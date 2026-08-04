import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import type { HomeCard, UserRole } from "@/types";

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super("DATABASE_URL is not configured.");
    this.name = "DatabaseNotConfiguredError";
  }
}

export type DatabaseUserRow = {
  id: string;
  email: string;
  password_hash: string;
  display_name: string;
  phone: string | null;
  telegram: string | null;
  instagram: string | null;
  roles: string[];
  is_blocked: boolean;
  profile_completed: boolean;
  created_at: string;
  updated_at: string;
};

export type PublicUser = {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  telegram?: string;
  instagram?: string;
  roles: UserRole[];
  isBlocked: boolean;
  profileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ListingInsert = {
  id: string;
  slug: string;
  userId: string;
  title: string;
  description: string;
  price: number;
  categoryId: string;
  condition: string;
  district?: string;
  phone?: string;
  telegram?: string;
  instagram?: string;
  preferredContact: string;
  expiresAt: string;
};

type ListingCardRow = {
  slug: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  district: string | null;
  status: string;
  created_at: string;
};

const validRoles = new Set<UserRole>(["guest", "user", "owner", "moderator", "admin"]);
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

let sqlClient: NeonQueryFunction<false, false> | null = null;
let schemaReady: Promise<void> | null = null;

export function isDatabaseConfigured() {
  return Boolean(databaseUrl);
}

export function getSql() {
  if (!databaseUrl) {
    throw new DatabaseNotConfiguredError();
  }

  sqlClient ??= neon(databaseUrl);

  return sqlClient;
}

export function normalizeRoles(value: unknown): UserRole[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((role): role is UserRole => validRoles.has(role as UserRole));
}

export function toPublicUser(row: DatabaseUserRow): PublicUser {
  return {
    uid: row.id,
    email: row.email,
    displayName: row.display_name,
    phone: row.phone || undefined,
    telegram: row.telegram || undefined,
    instagram: row.instagram || undefined,
    roles: normalizeRoles(row.roles).length > 0 ? normalizeRoles(row.roles) : ["user"],
    isBlocked: row.is_blocked,
    profileCompleted: row.profile_completed,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function getAdminRolesForEmail(email: string): UserRole[] {
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((value) => normalizeEmail(value))
    .filter(Boolean);

  return adminEmails.includes(normalizeEmail(email)) ? ["user", "admin"] : ["user"];
}

export async function ensureDatabaseSchema() {
  if (!isDatabaseConfigured()) {
    throw new DatabaseNotConfiguredError();
  }

  if (!schemaReady) {
    schemaReady = createSchema();
  }

  await schemaReady;
}

async function createSchema() {
  const sql = getSql();

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      display_name TEXT NOT NULL,
      phone TEXT,
      telegram TEXT,
      instagram TEXT,
      roles TEXT[] NOT NULL DEFAULT ARRAY['user']::TEXT[],
      is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
      profile_completed BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS auth_sessions (
      token_hash TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS listings (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      price NUMERIC(12, 2) NOT NULL DEFAULT 0,
      category_id TEXT NOT NULL,
      condition TEXT NOT NULL,
      district TEXT,
      phone TEXT,
      telegram TEXT,
      instagram TEXT,
      preferred_contact TEXT NOT NULL,
      city TEXT NOT NULL DEFAULT 'Тернопіль',
      currency TEXT NOT NULL DEFAULT 'UAH',
      images JSONB NOT NULL DEFAULT '[]'::JSONB,
      status TEXT NOT NULL DEFAULT 'pending',
      moderation_status TEXT NOT NULL DEFAULT 'pending',
      is_featured BOOLEAN NOT NULL DEFAULT FALSE,
      views INTEGER NOT NULL DEFAULT 0,
      favorites_count INTEGER NOT NULL DEFAULT 0,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS auth_sessions_user_id_idx ON auth_sessions (user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS auth_sessions_expires_at_idx ON auth_sessions (expires_at)`;
  await sql`CREATE INDEX IF NOT EXISTS listings_user_id_idx ON listings (user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS listings_status_idx ON listings (status, moderation_status)`;
  await sql`CREATE INDEX IF NOT EXISTS users_roles_idx ON users USING GIN (roles)`;
}

export async function getUserByEmail(email: string) {
  await ensureDatabaseSchema();

  const sql = getSql();
  const rows = (await sql.query("SELECT * FROM users WHERE email = $1 LIMIT 1", [
    normalizeEmail(email),
  ])) as DatabaseUserRow[];

  return rows[0] || null;
}

export async function getUserById(id: string) {
  await ensureDatabaseSchema();

  const sql = getSql();
  const rows = (await sql.query("SELECT * FROM users WHERE id = $1 LIMIT 1", [id])) as
    DatabaseUserRow[] | [];

  return rows[0] || null;
}

export async function createUser(input: {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
}) {
  await ensureDatabaseSchema();

  const sql = getSql();
  const email = normalizeEmail(input.email);
  const roles = getAdminRolesForEmail(email);
  const rows = (await sql.query(
    `
      INSERT INTO users (id, email, password_hash, display_name, roles)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
    [input.id, email, input.passwordHash, input.displayName, roles],
  )) as DatabaseUserRow[];

  return rows[0];
}

export async function syncAdminRoleFromEnv(user: DatabaseUserRow) {
  const rolesFromEnv = getAdminRolesForEmail(user.email);

  if (!rolesFromEnv.includes("admin") || user.roles.includes("admin")) {
    return user;
  }

  const sql = getSql();
  const rows = (await sql.query(
    `
      UPDATE users
      SET roles = ARRAY(SELECT DISTINCT UNNEST(roles || ARRAY['admin']::TEXT[])),
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `,
    [user.id],
  )) as DatabaseUserRow[];

  return rows[0] || user;
}

export async function updateUserProfile(
  userId: string,
  input: {
    displayName: string;
    phone?: string;
    telegram?: string;
    instagram?: string;
  },
) {
  await ensureDatabaseSchema();

  const sql = getSql();
  const rows = (await sql.query(
    `
      UPDATE users
      SET display_name = $2,
          phone = NULLIF($3, ''),
          telegram = NULLIF($4, ''),
          instagram = NULLIF($5, ''),
          profile_completed = TRUE,
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `,
    [userId, input.displayName, input.phone || "", input.telegram || "", input.instagram || ""],
  )) as DatabaseUserRow[];

  return rows[0] || null;
}

export async function createListing(input: ListingInsert) {
  await ensureDatabaseSchema();

  const sql = getSql();
  await sql.query(
    `
      INSERT INTO listings (
        id, slug, user_id, title, description, price, category_id, condition, district,
        phone, telegram, instagram, preferred_contact, expires_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NULLIF($9, ''), NULLIF($10, ''),
        NULLIF($11, ''), NULLIF($12, ''), $13, $14)
    `,
    [
      input.id,
      input.slug,
      input.userId,
      input.title,
      input.description,
      input.price,
      input.categoryId,
      input.condition,
      input.district || "",
      input.phone || "",
      input.telegram || "",
      input.instagram || "",
      input.preferredContact,
      input.expiresAt,
    ],
  );
}

export async function getListingCardsFromDatabase(limit = 24): Promise<HomeCard[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }

  await ensureDatabaseSchema();

  const sql = getSql();
  const rows = (await sql.query(
    `
      SELECT slug, title, description, price, currency, district, status, created_at
      FROM listings
      WHERE status IN ('active', 'pending')
        AND moderation_status IN ('approved', 'pending')
      ORDER BY created_at DESC
      LIMIT $1
    `,
    [limit],
  )) as ListingCardRow[];

  return rows.map((listing) => ({
    title: listing.title,
    description: listing.description,
    href: `/market/${listing.slug}`,
    meta: listing.district || "Тернопіль",
    badge: `${Number(listing.price).toLocaleString("uk-UA")} ${listing.currency}`,
  }));
}
