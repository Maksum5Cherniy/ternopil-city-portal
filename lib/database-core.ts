import { createHash, randomBytes, randomUUID } from "node:crypto";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import type { HomeCard, ModerationStatus, UserRole } from "@/types";

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
  email_verified: boolean;
  email_verified_at: string | null;
  seller_status: "active" | "suspended";
  is_blocked: boolean;
  blocked_reason: string | null;
  profile_completed: boolean;
  last_login_at: string | null;
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
  emailVerified: boolean;
  sellerStatus: "active" | "suspended";
  isBlocked: boolean;
  blockedReason?: string;
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

export type AdminUserSummary = {
  id: string;
  email: string;
  displayName: string;
  roles: UserRole[];
  emailVerified: boolean;
  sellerStatus: string;
  isBlocked: boolean;
  blockedReason?: string;
  createdAt: string;
  lastLoginAt?: string;
};

export type ListingModerationItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  categoryId: string;
  status: string;
  moderationStatus: ModerationStatus;
  authorName: string;
  authorEmail: string;
  createdAt: string;
};

export type OwnerClaimRow = {
  id: string;
  user_id: string;
  place_name: string;
  business_email: string | null;
  phone: string | null;
  address: string | null;
  website: string | null;
  message: string | null;
  status: ModerationStatus;
  moderation_comment: string | null;
  moderator_id: string | null;
  created_at: string;
  updated_at: string;
};

export type OwnerClaimSummary = {
  id: string;
  userId: string;
  placeName: string;
  businessEmail?: string;
  phone?: string;
  address?: string;
  website?: string;
  message?: string;
  status: ModerationStatus;
  moderationComment?: string;
  createdAt: string;
  updatedAt: string;
};

export type AuditLogSummary = {
  id: string;
  actorId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  details: Record<string, unknown>;
  createdAt: string;
};

export type AdminDashboardData = {
  stats: {
    users: number;
    pendingListings: number;
    ownerClaims: number;
    activeListings: number;
    blockedUsers: number;
  };
  users: AdminUserSummary[];
  listings: ListingModerationItem[];
  ownerClaims: OwnerClaimSummary[];
  auditLogs: AuditLogSummary[];
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
const privilegedRoles = new Set<UserRole>(["owner", "moderator", "admin"]);
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

  const roles = value.filter((role): role is UserRole => validRoles.has(role as UserRole));

  return Array.from(new Set(roles));
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function sanitizeText(value: string | undefined | null, maxLength = 3000) {
  return (value || "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
}

export function toPublicUser(row: DatabaseUserRow): PublicUser {
  const normalizedRoles = normalizeRoles(row.roles);
  const effectiveRoles = row.email_verified
    ? normalizedRoles
    : normalizedRoles.filter((role) => !privilegedRoles.has(role));
  const roles: UserRole[] = effectiveRoles.length > 0 ? effectiveRoles : ["user"];

  return {
    uid: row.id,
    email: row.email,
    displayName: row.display_name,
    phone: row.phone || undefined,
    telegram: row.telegram || undefined,
    instagram: row.instagram || undefined,
    roles,
    emailVerified: Boolean(row.email_verified),
    sellerStatus: row.seller_status || "active",
    isBlocked: row.is_blocked,
    blockedReason: row.blocked_reason || undefined,
    profileCompleted: row.profile_completed,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
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

  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMPTZ`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS seller_status TEXT NOT NULL DEFAULT 'active'`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS blocked_reason TEXT`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ`;

  await sql`
    CREATE TABLE IF NOT EXISTS auth_sessions (
      token_hash TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS email_verification_tokens (
      token_hash TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TIMESTAMPTZ NOT NULL,
      consumed_at TIMESTAMPTZ,
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
      moderation_comment TEXT,
      moderated_by TEXT REFERENCES users(id) ON DELETE SET NULL,
      moderated_at TIMESTAMPTZ,
      is_featured BOOLEAN NOT NULL DEFAULT FALSE,
      views INTEGER NOT NULL DEFAULT 0,
      favorites_count INTEGER NOT NULL DEFAULT 0,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`ALTER TABLE listings ADD COLUMN IF NOT EXISTS moderation_comment TEXT`;
  await sql`ALTER TABLE listings ADD COLUMN IF NOT EXISTS moderated_by TEXT REFERENCES users(id) ON DELETE SET NULL`;
  await sql`ALTER TABLE listings ADD COLUMN IF NOT EXISTS moderated_at TIMESTAMPTZ`;

  await sql`
    CREATE TABLE IF NOT EXISTS seller_profiles (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'active',
      listings_count INTEGER NOT NULL DEFAULT 0,
      rating NUMERIC(3, 2) NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS owner_claims (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      place_name TEXT NOT NULL,
      business_email TEXT,
      phone TEXT,
      address TEXT,
      website TEXT,
      message TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      moderation_comment TEXT,
      moderator_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      reporter_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      reason TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      moderation_comment TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      read_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      actor_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      details JSONB NOT NULL DEFAULT '{}'::JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS auth_sessions_user_id_idx ON auth_sessions (user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS auth_sessions_expires_at_idx ON auth_sessions (expires_at)`;
  await sql`CREATE INDEX IF NOT EXISTS email_verification_user_idx ON email_verification_tokens (user_id, expires_at)`;
  await sql`CREATE INDEX IF NOT EXISTS listings_user_id_idx ON listings (user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS listings_status_idx ON listings (status, moderation_status)`;
  await sql`CREATE INDEX IF NOT EXISTS owner_claims_user_idx ON owner_claims (user_id, status)`;
  await sql`CREATE INDEX IF NOT EXISTS owner_claims_status_idx ON owner_claims (status, created_at)`;
  await sql`CREATE INDEX IF NOT EXISTS reports_status_idx ON reports (status, created_at)`;
  await sql`CREATE INDEX IF NOT EXISTS notifications_user_idx ON notifications (user_id, read_at, created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS audit_logs_created_idx ON audit_logs (created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS users_roles_idx ON users USING GIN (roles)`;
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("base64url");
}

function toOwnerClaimSummary(row: OwnerClaimRow): OwnerClaimSummary {
  return {
    id: row.id,
    userId: row.user_id,
    placeName: row.place_name,
    businessEmail: row.business_email || undefined,
    phone: row.phone || undefined,
    address: row.address || undefined,
    website: row.website || undefined,
    message: row.message || undefined,
    status: row.status,
    moderationComment: row.moderation_comment || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toAdminUserSummary(row: DatabaseUserRow): AdminUserSummary {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    roles: normalizeRoles(row.roles),
    emailVerified: Boolean(row.email_verified),
    sellerStatus: row.seller_status || "active",
    isBlocked: row.is_blocked,
    blockedReason: row.blocked_reason || undefined,
    createdAt: row.created_at,
    lastLoginAt: row.last_login_at || undefined,
  };
}

function toAuditLogSummary(row: {
  id: string;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}): AuditLogSummary {
  return {
    id: row.id,
    actorId: row.actor_id || undefined,
    action: row.action,
    entityType: row.entity_type,
    entityId: row.entity_id || undefined,
    details: row.details || {},
    createdAt: row.created_at,
  };
}

export async function writeAuditLog(input: {
  actorId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, unknown>;
}) {
  await ensureDatabaseSchema();

  await getSql().query(
    `
      INSERT INTO audit_logs (id, actor_id, action, entity_type, entity_id, details)
      VALUES ($1, $2, $3, $4, $5, $6::JSONB)
    `,
    [
      randomUUID(),
      input.actorId || null,
      input.action,
      input.entityType,
      input.entityId || null,
      JSON.stringify(input.details || {}),
    ],
  );
}

export async function createNotification(input: {
  userId: string;
  type: string;
  title: string;
  body: string;
}) {
  await ensureDatabaseSchema();

  await getSql().query(
    `
      INSERT INTO notifications (id, user_id, type, title, body)
      VALUES ($1, $2, $3, $4, $5)
    `,
    [randomUUID(), input.userId, input.type, input.title, input.body],
  );
}

export async function getUserByEmail(email: string) {
  await ensureDatabaseSchema();

  const rows = (await getSql().query("SELECT * FROM users WHERE email = $1 LIMIT 1", [
    normalizeEmail(email),
  ])) as DatabaseUserRow[];

  return rows[0] || null;
}

export async function getUserById(id: string) {
  await ensureDatabaseSchema();

  const rows = (await getSql().query("SELECT * FROM users WHERE id = $1 LIMIT 1", [
    id,
  ])) as DatabaseUserRow[];

  return rows[0] || null;
}

export async function createUser(input: {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
}) {
  await ensureDatabaseSchema();

  const email = normalizeEmail(input.email);
  const rows = (await getSql().query(
    `
      INSERT INTO users (id, email, password_hash, display_name, roles, email_verified)
      VALUES ($1, $2, $3, $4, ARRAY['user']::TEXT[], FALSE)
      RETURNING *
    `,
    [input.id, email, input.passwordHash, sanitizeText(input.displayName, 80)],
  )) as DatabaseUserRow[];

  return rows[0];
}

export async function syncAdminRoleFromEnv(user: DatabaseUserRow) {
  if (!user.email_verified) {
    return user;
  }

  const rolesFromEnv = getAdminRolesForEmail(user.email);

  if (!rolesFromEnv.includes("admin") || user.roles.includes("admin")) {
    return user;
  }

  const rows = (await getSql().query(
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

export async function markUserLastLogin(userId: string) {
  await ensureDatabaseSchema();

  await getSql().query("UPDATE users SET last_login_at = NOW(), updated_at = NOW() WHERE id = $1", [
    userId,
  ]);
}

export async function createEmailVerificationToken(userId: string) {
  await ensureDatabaseSchema();

  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashToken(token);

  await getSql().query(
    `
      UPDATE email_verification_tokens
      SET consumed_at = NOW()
      WHERE user_id = $1 AND consumed_at IS NULL
    `,
    [userId],
  );
  await getSql().query(
    `
      INSERT INTO email_verification_tokens (token_hash, user_id, expires_at)
      VALUES ($1, $2, NOW() + INTERVAL '24 hours')
    `,
    [tokenHash, userId],
  );

  return token;
}

export async function verifyEmailToken(token: string) {
  await ensureDatabaseSchema();

  const tokenHash = hashToken(token);
  const tokenRows = (await getSql().query(
    `
      UPDATE email_verification_tokens
      SET consumed_at = NOW()
      WHERE token_hash = $1
        AND consumed_at IS NULL
        AND expires_at > NOW()
      RETURNING user_id
    `,
    [tokenHash],
  )) as Array<{ user_id: string }>;

  const userId = tokenRows[0]?.user_id;

  if (!userId) {
    return null;
  }

  const userRows = (await getSql().query(
    `
      UPDATE users
      SET email_verified = TRUE,
          email_verified_at = COALESCE(email_verified_at, NOW()),
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `,
    [userId],
  )) as DatabaseUserRow[];
  const user = userRows[0];

  return user ? await syncAdminRoleFromEnv(user) : null;
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

  const rows = (await getSql().query(
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
    [
      userId,
      sanitizeText(input.displayName, 80),
      sanitizeText(input.phone, 32),
      sanitizeText(input.telegram, 80),
      sanitizeText(input.instagram, 80),
    ],
  )) as DatabaseUserRow[];

  return rows[0] || null;
}

export async function ensureSellerProfile(userId: string) {
  await ensureDatabaseSchema();

  await getSql().query(
    `
      INSERT INTO seller_profiles (user_id)
      VALUES ($1)
      ON CONFLICT (user_id) DO UPDATE
      SET updated_at = NOW()
    `,
    [userId],
  );
}

export async function getRecentListingCount(userId: string, minutes = 60) {
  await ensureDatabaseSchema();

  const rows = (await getSql().query(
    `
      SELECT COUNT(*)::INT AS count
      FROM listings
      WHERE user_id = $1 AND created_at > NOW() - ($2::TEXT || ' minutes')::INTERVAL
    `,
    [userId, String(minutes)],
  )) as Array<{ count: number }>;

  return Number(rows[0]?.count || 0);
}

export async function createListing(input: ListingInsert) {
  await ensureDatabaseSchema();

  await getSql().query(
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
      sanitizeText(input.title, 120),
      sanitizeText(input.description, 3000),
      input.price,
      sanitizeText(input.categoryId, 80),
      sanitizeText(input.condition, 32),
      sanitizeText(input.district, 80),
      sanitizeText(input.phone, 32),
      sanitizeText(input.telegram, 80),
      sanitizeText(input.instagram, 80),
      sanitizeText(input.preferredContact, 32),
      input.expiresAt,
    ],
  );

  await ensureSellerProfile(input.userId);
  await getSql().query(
    "UPDATE seller_profiles SET listings_count = listings_count + 1, updated_at = NOW() WHERE user_id = $1",
    [input.userId],
  );
  await writeAuditLog({
    actorId: input.userId,
    action: "listing.created",
    entityType: "listing",
    entityId: input.id,
    details: { slug: input.slug, status: "pending" },
  });
}

export async function createOwnerClaim(input: {
  userId: string;
  placeName: string;
  businessEmail?: string;
  phone?: string;
  address?: string;
  website?: string;
  message?: string;
}) {
  await ensureDatabaseSchema();

  const id = randomUUID();

  await getSql().query(
    `
      INSERT INTO owner_claims (
        id, user_id, place_name, business_email, phone, address, website, message
      )
      VALUES ($1, $2, $3, NULLIF($4, ''), NULLIF($5, ''), NULLIF($6, ''), NULLIF($7, ''), NULLIF($8, ''))
    `,
    [
      id,
      input.userId,
      sanitizeText(input.placeName, 140),
      sanitizeText(input.businessEmail, 120),
      sanitizeText(input.phone, 32),
      sanitizeText(input.address, 200),
      sanitizeText(input.website, 200),
      sanitizeText(input.message, 1200),
    ],
  );

  await writeAuditLog({
    actorId: input.userId,
    action: "owner_claim.created",
    entityType: "owner_claim",
    entityId: id,
    details: { placeName: input.placeName },
  });

  return id;
}

export async function getOwnerDashboard(userId: string) {
  await ensureDatabaseSchema();

  const claims = (await getSql().query(
    `
      SELECT *
      FROM owner_claims
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 20
    `,
    [userId],
  )) as OwnerClaimRow[];

  return {
    claims: claims.map(toOwnerClaimSummary),
  };
}

export async function getUserListings(userId: string) {
  await ensureDatabaseSchema();

  const rows = (await getSql().query(
    `
      SELECT l.*, u.display_name AS author_name, u.email AS author_email
      FROM listings l
      JOIN users u ON u.id = l.user_id
      WHERE l.user_id = $1
      ORDER BY l.created_at DESC
      LIMIT 30
    `,
    [userId],
  )) as Array<
    {
      author_name: string;
      author_email: string;
    } & {
      id: string;
      slug: string;
      title: string;
      description: string;
      price: string;
      category_id: string;
      status: string;
      moderation_status: ModerationStatus;
      created_at: string;
    }
  >;

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    price: Number(row.price),
    categoryId: row.category_id,
    status: row.status,
    moderationStatus: row.moderation_status,
    authorName: row.author_name,
    authorEmail: row.author_email,
    createdAt: row.created_at,
  }));
}

export async function getAdminDashboard(): Promise<AdminDashboardData> {
  await ensureDatabaseSchema();

  const sql = getSql();
  const usersPromise = sql.query(
    `
        SELECT *
        FROM users
        ORDER BY created_at DESC
        LIMIT 25
      `,
  ) as unknown as Promise<DatabaseUserRow[]>;
  const listingsPromise = sql.query(
    `
        SELECT l.*, u.display_name AS author_name, u.email AS author_email
        FROM listings l
        JOIN users u ON u.id = l.user_id
        ORDER BY l.created_at DESC
        LIMIT 25
      `,
  ) as unknown as Promise<
    Array<{
      id: string;
      slug: string;
      title: string;
      description: string;
      price: string;
      category_id: string;
      status: string;
      moderation_status: ModerationStatus;
      author_name: string;
      author_email: string;
      created_at: string;
    }>
  >;
  const ownerClaimsPromise = sql.query(
    `
        SELECT *
        FROM owner_claims
        ORDER BY created_at DESC
        LIMIT 25
      `,
  ) as unknown as Promise<OwnerClaimRow[]>;
  const auditLogsPromise = sql.query(
    `
        SELECT *
        FROM audit_logs
        ORDER BY created_at DESC
        LIMIT 20
      `,
  ) as unknown as Promise<
    Array<{
      id: string;
      actor_id: string | null;
      action: string;
      entity_type: string;
      entity_id: string | null;
      details: Record<string, unknown> | null;
      created_at: string;
    }>
  >;
  const statsPromise = sql.query(
    `
        SELECT
          (SELECT COUNT(*)::INT FROM users) AS users,
          (SELECT COUNT(*)::INT FROM listings WHERE moderation_status = 'pending') AS pending_listings,
          (SELECT COUNT(*)::INT FROM owner_claims WHERE status = 'pending') AS owner_claims,
          (SELECT COUNT(*)::INT FROM listings WHERE status = 'active') AS active_listings,
          (SELECT COUNT(*)::INT FROM users WHERE is_blocked = TRUE) AS blocked_users
      `,
  ) as unknown as Promise<
    Array<{
      users: number;
      pending_listings: number;
      owner_claims: number;
      active_listings: number;
      blocked_users: number;
    }>
  >;
  const [users, listings, ownerClaims, auditLogs, statsRows] = await Promise.all([
    usersPromise,
    listingsPromise,
    ownerClaimsPromise,
    auditLogsPromise,
    statsPromise,
  ]);
  const stats = statsRows[0] || {
    users: 0,
    pending_listings: 0,
    owner_claims: 0,
    active_listings: 0,
    blocked_users: 0,
  };

  return {
    stats: {
      users: Number(stats.users),
      pendingListings: Number(stats.pending_listings),
      ownerClaims: Number(stats.owner_claims),
      activeListings: Number(stats.active_listings),
      blockedUsers: Number(stats.blocked_users),
    },
    users: users.map(toAdminUserSummary),
    listings: listings.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      description: row.description,
      price: Number(row.price),
      categoryId: row.category_id,
      status: row.status,
      moderationStatus: row.moderation_status,
      authorName: row.author_name,
      authorEmail: row.author_email,
      createdAt: row.created_at,
    })),
    ownerClaims: ownerClaims.map(toOwnerClaimSummary),
    auditLogs: auditLogs.map(toAuditLogSummary),
  };
}

export async function getModerationDashboard() {
  const adminData = await getAdminDashboard();

  return {
    listings: adminData.listings.filter((listing) => listing.moderationStatus === "pending"),
    ownerClaims: adminData.ownerClaims.filter((claim) => claim.status === "pending"),
    auditLogs: adminData.auditLogs,
  };
}

export async function updateUserAdministration(input: {
  actorId: string;
  userId: string;
  roles: UserRole[];
  isBlocked: boolean;
  blockedReason?: string;
  sellerStatus: "active" | "suspended";
}) {
  await ensureDatabaseSchema();

  const roles = normalizeRoles(input.roles).filter((role) => role !== "guest");
  const nextRoles = roles.length > 0 ? roles : (["user"] satisfies UserRole[]);
  const rows = (await getSql().query(
    `
      UPDATE users
      SET roles = $2,
          is_blocked = $3,
          blocked_reason = NULLIF($4, ''),
          seller_status = $5,
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `,
    [
      input.userId,
      nextRoles,
      input.isBlocked,
      sanitizeText(input.blockedReason, 300),
      input.sellerStatus,
    ],
  )) as DatabaseUserRow[];
  const user = rows[0] || null;

  if (user) {
    await writeAuditLog({
      actorId: input.actorId,
      action: "user.updated",
      entityType: "user",
      entityId: input.userId,
      details: {
        roles: nextRoles,
        isBlocked: input.isBlocked,
        sellerStatus: input.sellerStatus,
      },
    });
  }

  return user;
}

export async function moderateListing(input: {
  actorId: string;
  listingId: string;
  moderationStatus: Extract<ModerationStatus, "approved" | "rejected" | "hidden" | "blocked">;
  comment?: string;
}) {
  await ensureDatabaseSchema();

  const publicStatus = input.moderationStatus === "approved" ? "active" : input.moderationStatus;
  const rows = (await getSql().query(
    `
      UPDATE listings
      SET moderation_status = $2,
          status = $3,
          moderation_comment = NULLIF($4, ''),
          moderated_by = $5,
          moderated_at = NOW(),
          updated_at = NOW()
      WHERE id = $1
      RETURNING user_id, slug, title
    `,
    [
      input.listingId,
      input.moderationStatus,
      publicStatus,
      sanitizeText(input.comment, 500),
      input.actorId,
    ],
  )) as Array<{ user_id: string; slug: string; title: string }>;
  const listing = rows[0] || null;

  if (listing) {
    await createNotification({
      userId: listing.user_id,
      type: "listing_moderation",
      title: "Статус оголошення оновлено",
      body:
        input.moderationStatus === "approved"
          ? `Оголошення "${listing.title}" схвалено.`
          : `Оголошення "${listing.title}" має статус: ${input.moderationStatus}.`,
    });
    await writeAuditLog({
      actorId: input.actorId,
      action: "listing.moderated",
      entityType: "listing",
      entityId: input.listingId,
      details: { moderationStatus: input.moderationStatus, slug: listing.slug },
    });
  }

  return listing;
}

export async function moderateOwnerClaim(input: {
  actorId: string;
  claimId: string;
  status: Extract<ModerationStatus, "approved" | "rejected">;
  comment?: string;
}) {
  await ensureDatabaseSchema();

  const rows = (await getSql().query(
    `
      UPDATE owner_claims
      SET status = $2,
          moderation_comment = NULLIF($3, ''),
          moderator_id = $4,
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `,
    [input.claimId, input.status, sanitizeText(input.comment, 500), input.actorId],
  )) as OwnerClaimRow[];
  const claim = rows[0] || null;

  if (claim && input.status === "approved") {
    await getSql().query(
      `
        UPDATE users
        SET roles = ARRAY(SELECT DISTINCT UNNEST(roles || ARRAY['owner']::TEXT[])),
            updated_at = NOW()
        WHERE id = $1
      `,
      [claim.user_id],
    );
  }

  if (claim) {
    await createNotification({
      userId: claim.user_id,
      type: "owner_claim",
      title: "Заявку власника розглянуто",
      body:
        input.status === "approved"
          ? `Заявку на "${claim.place_name}" схвалено.`
          : `Заявку на "${claim.place_name}" відхилено. ${input.comment || ""}`.trim(),
    });
    await writeAuditLog({
      actorId: input.actorId,
      action: "owner_claim.moderated",
      entityType: "owner_claim",
      entityId: input.claimId,
      details: { status: input.status, placeName: claim.place_name },
    });
  }

  return claim;
}

export async function getListingCardsFromDatabase(limit = 24): Promise<HomeCard[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }

  await ensureDatabaseSchema();

  const rows = (await getSql().query(
    `
      SELECT slug, title, description, price, currency, district, status, created_at
      FROM listings
      WHERE status = 'active'
        AND moderation_status = 'approved'
        AND expires_at > NOW()
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
