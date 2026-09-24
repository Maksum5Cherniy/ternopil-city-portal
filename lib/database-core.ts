import { createHash, randomBytes, randomUUID } from "node:crypto";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import type {
  HomeCard,
  ListingStatus,
  ModerationStatus,
  UserRole,
} from "@/types";

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
  moderationComment?: string;
  authorName: string;
  authorEmail: string;
  createdAt: string;
};

export type UserListingSummary = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  categoryId: string;
  condition: string;
  district?: string;
  status: ListingStatus;
  moderationStatus: ModerationStatus;
  moderationComment?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  publicHref: string;
};

export type PublicListingDetail = UserListingSummary & {
  phone?: string;
  telegram?: string;
  instagram?: string;
  preferredContact: string;
  authorName: string;
  views: number;
  favoritesCount: number;
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

export type ReportSummary = {
  id: string;
  reporterId?: string;
  reporterName?: string;
  reporterEmail?: string;
  entityType: string;
  entityId: string;
  entityTitle?: string;
  reason: string;
  status: string;
  moderationComment?: string;
  createdAt: string;
  updatedAt: string;
};

export type ReviewSummary = {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  targetHref: string;
  targetTitle: string;
  rating: number;
  text: string;
  ownerReply?: string;
  status: ModerationStatus;
  moderationComment?: string;
  createdAt: string;
  updatedAt: string;
};

export type NotificationSummary = {
  id: string;
  type: string;
  title: string;
  body: string;
  readAt?: string;
  createdAt: string;
};

export type AdminContentType = "news" | "place" | "ad" | "home";
export type AdminContentStatus = "draft" | "published" | "archived";

export type AdminContentItemSummary = {
  id: string;
  type: AdminContentType;
  title: string;
  summary?: string;
  href?: string;
  status: AdminContentStatus;
  orderIndex: number;
  notes?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
};

export type SiteSettingSummary = {
  key: string;
  value: string;
  updatedBy?: string;
  updatedAt?: string;
};

export type AdminNotificationSummary = NotificationSummary & {
  userId: string;
  userEmail: string;
  userName: string;
};

export type AdminDashboardData = {
  stats: {
    users: number;
    pendingListings: number;
    ownerClaims: number;
    pendingReports: number;
    pendingReviews: number;
    activeListings: number;
    blockedUsers: number;
    contentItems: number;
    sentNotifications: number;
  };
  users: AdminUserSummary[];
  listings: ListingModerationItem[];
  ownerClaims: OwnerClaimSummary[];
  reports: ReportSummary[];
  reviews: ReviewSummary[];
  auditLogs: AuditLogSummary[];
  contentItems: AdminContentItemSummary[];
  settings: SiteSettingSummary[];
  notifications: AdminNotificationSummary[];
};

type ListingCardRow = {
  slug: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  category_id: string;
  condition: string;
  district: string | null;
  status: string;
  created_at: string;
};

const validRoles = new Set<UserRole>([
  "guest",
  "user",
  "owner",
  "moderator",
  "admin",
]);
const privilegedRoles = new Set<UserRole>(["owner", "moderator", "admin"]);
const defaultSiteSettings: SiteSettingSummary[] = [
  { key: "site_title", value: "Де Тернопіль" },
  {
    key: "site_description",
    value: "Міський інформаційний портал Тернополя.",
  },
  { key: "contact_telegram", value: "@no_name_te" },
  {
    key: "seo_keywords",
    value: "Тернопіль, новини, заклади, події, барахолка",
  },
  { key: "homepage_notice", value: "" },
];
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

  const roles = value.filter((role): role is UserRole =>
    validRoles.has(role as UserRole),
  );

  return Array.from(new Set(roles));
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function sanitizeText(
  value: string | undefined | null,
  maxLength = 3000,
) {
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
  const roles: UserRole[] =
    effectiveRoles.length > 0 ? effectiveRoles : ["user"];

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

  return adminEmails.includes(normalizeEmail(email))
    ? ["user", "admin"]
    : ["user"];
}

export async function ensureDatabaseSchema() {
  if (!isDatabaseConfigured()) {
    throw new DatabaseNotConfiguredError();
  }

  if (!schemaReady) {
    schemaReady = createSchema().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }

  await schemaReady;
}

async function createSchema() {
  const sql = getSql();
  // Neon HTTP queries do not share a database session, so session advisory
  // locks cannot protect the separate idempotent schema statements below.
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
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
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
      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        target_href TEXT NOT NULL,
        target_title TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        text TEXT NOT NULL,
        owner_reply TEXT,
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

  await sql`
      CREATE TABLE IF NOT EXISTS admin_content_items (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        summary TEXT,
        href TEXT,
        status TEXT NOT NULL DEFAULT 'draft',
        order_index INTEGER NOT NULL DEFAULT 0,
        payload JSONB NOT NULL DEFAULT '{}'::JSONB,
        created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

  await sql`
      CREATE TABLE IF NOT EXISTS site_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL DEFAULT '',
        updated_by TEXT REFERENCES users(id) ON DELETE SET NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

  await sql`CREATE INDEX IF NOT EXISTS auth_sessions_user_id_idx ON auth_sessions (user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS auth_sessions_expires_at_idx ON auth_sessions (expires_at)`;
  await sql`CREATE INDEX IF NOT EXISTS email_verification_user_idx ON email_verification_tokens (user_id, expires_at)`;
  await sql`CREATE INDEX IF NOT EXISTS password_reset_user_idx ON password_reset_tokens (user_id, expires_at)`;
  await sql`CREATE INDEX IF NOT EXISTS listings_user_id_idx ON listings (user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS listings_status_idx ON listings (status, moderation_status)`;
  await sql`CREATE INDEX IF NOT EXISTS owner_claims_user_idx ON owner_claims (user_id, status)`;
  await sql`CREATE INDEX IF NOT EXISTS owner_claims_status_idx ON owner_claims (status, created_at)`;
  await sql`CREATE INDEX IF NOT EXISTS reports_status_idx ON reports (status, created_at)`;
  await sql`CREATE INDEX IF NOT EXISTS reports_entity_idx ON reports (entity_type, entity_id)`;
  await sql`CREATE INDEX IF NOT EXISTS reviews_user_idx ON reviews (user_id, created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS reviews_target_idx ON reviews (target_href, status, created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS reviews_status_idx ON reviews (status, created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS notifications_user_idx ON notifications (user_id, read_at, created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS audit_logs_created_idx ON audit_logs (created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS users_roles_idx ON users USING GIN (roles)`;
  await sql`CREATE INDEX IF NOT EXISTS admin_content_items_type_status_idx ON admin_content_items (type, status, order_index, updated_at DESC)`;
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

function toAdminContentItemSummary(row: {
  id: string;
  type: string;
  title: string;
  summary: string | null;
  href: string | null;
  status: string;
  order_index: number;
  payload: Record<string, unknown> | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}): AdminContentItemSummary {
  const type = ["news", "place", "ad", "home"].includes(row.type)
    ? (row.type as AdminContentType)
    : "news";
  const status = ["draft", "published", "archived"].includes(row.status)
    ? (row.status as AdminContentStatus)
    : "draft";
  const payload = row.payload || {};
  const notes = typeof payload.notes === "string" ? payload.notes : undefined;

  return {
    id: row.id,
    type,
    title: row.title,
    summary: row.summary || undefined,
    href: row.href || undefined,
    status,
    orderIndex: Number(row.order_index) || 0,
    notes,
    createdBy: row.created_by || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toSiteSettingSummary(row: {
  key: string;
  value: string;
  updated_by: string | null;
  updated_at: string;
}): SiteSettingSummary {
  return {
    key: row.key,
    value: row.value,
    updatedBy: row.updated_by || undefined,
    updatedAt: row.updated_at,
  };
}

function toAdminNotificationSummary(row: {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  type: string;
  title: string;
  body: string;
  read_at: string | null;
  created_at: string;
}): AdminNotificationSummary {
  return {
    id: row.id,
    userId: row.user_id,
    userEmail: row.user_email,
    userName: row.user_name,
    type: row.type,
    title: row.title,
    body: row.body,
    readAt: row.read_at || undefined,
    createdAt: row.created_at,
  };
}

function toNotificationSummary(row: {
  id: string;
  type: string;
  title: string;
  body: string;
  read_at: string | null;
  created_at: string;
}): NotificationSummary {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    body: row.body,
    readAt: row.read_at || undefined,
    createdAt: row.created_at,
  };
}

function toUserListingSummary(row: {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: string | number;
  currency?: string | null;
  category_id: string;
  condition: string;
  district: string | null;
  status: string;
  moderation_status: ModerationStatus;
  moderation_comment: string | null;
  created_at: string;
  updated_at: string;
  expires_at: string;
}): UserListingSummary {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    price: Number(row.price),
    currency: row.currency || "UAH",
    categoryId: row.category_id,
    condition: row.condition,
    district: row.district || undefined,
    status: row.status as ListingStatus,
    moderationStatus: row.moderation_status,
    moderationComment: row.moderation_comment || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    expiresAt: row.expires_at,
    publicHref: `/market/${row.slug}`,
  };
}

function toReportSummary(row: {
  id: string;
  reporter_id: string | null;
  reporter_name: string | null;
  reporter_email: string | null;
  entity_type: string;
  entity_id: string;
  entity_title: string | null;
  reason: string;
  status: string;
  moderation_comment: string | null;
  created_at: string;
  updated_at: string;
}): ReportSummary {
  return {
    id: row.id,
    reporterId: row.reporter_id || undefined,
    reporterName: row.reporter_name || undefined,
    reporterEmail: row.reporter_email || undefined,
    entityType: row.entity_type,
    entityId: row.entity_id,
    entityTitle: row.entity_title || undefined,
    reason: row.reason,
    status: row.status,
    moderationComment: row.moderation_comment || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toReviewSummary(row: {
  id: string;
  user_id: string;
  user_name?: string | null;
  user_email?: string | null;
  target_href: string;
  target_title: string;
  rating: string | number;
  text: string;
  owner_reply: string | null;
  status: ModerationStatus;
  moderation_comment: string | null;
  created_at: string;
  updated_at: string;
}): ReviewSummary {
  return {
    id: row.id,
    userId: row.user_id,
    userName: row.user_name || undefined,
    userEmail: row.user_email || undefined,
    targetHref: row.target_href,
    targetTitle: row.target_title,
    rating: Number(row.rating),
    text: row.text,
    ownerReply: row.owner_reply || undefined,
    status: row.status,
    moderationComment: row.moderation_comment || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
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

  const id = randomUUID();

  await getSql().query(
    `
      INSERT INTO notifications (id, user_id, type, title, body)
      VALUES ($1, $2, $3, $4, $5)
    `,
    [id, input.userId, input.type, input.title, input.body],
  );

  return id;
}

export async function getUserNotifications(
  userId: string,
  limit = 30,
): Promise<NotificationSummary[]> {
  await ensureDatabaseSchema();

  const rows = (await getSql().query(
    `
      SELECT id, type, title, body, read_at, created_at
      FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `,
    [userId, limit],
  )) as Array<{
    id: string;
    type: string;
    title: string;
    body: string;
    read_at: string | null;
    created_at: string;
  }>;

  return rows.map(toNotificationSummary);
}

export async function getUserByEmail(email: string) {
  await ensureDatabaseSchema();

  const rows = (await getSql().query(
    "SELECT * FROM users WHERE email = $1 LIMIT 1",
    [normalizeEmail(email)],
  )) as DatabaseUserRow[];

  return rows[0] || null;
}

export async function getUserById(id: string) {
  await ensureDatabaseSchema();

  const rows = (await getSql().query(
    "SELECT * FROM users WHERE id = $1 LIMIT 1",
    [id],
  )) as DatabaseUserRow[];

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

  await getSql().query(
    "UPDATE users SET last_login_at = NOW(), updated_at = NOW() WHERE id = $1",
    [userId],
  );
}

export async function createEmailVerificationToken(userId: string) {
  await ensureDatabaseSchema();

  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashToken(token);

  await getSql().query(
    `
      DELETE FROM email_verification_tokens
      WHERE user_id = $1 AND expires_at <= NOW()
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

export async function createPasswordResetToken(userId: string) {
  await ensureDatabaseSchema();

  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashToken(token);

  await getSql().query(
    `
      UPDATE password_reset_tokens
      SET consumed_at = NOW()
      WHERE user_id = $1 AND consumed_at IS NULL
    `,
    [userId],
  );
  await getSql().query(
    `
      INSERT INTO password_reset_tokens (token_hash, user_id, expires_at)
      VALUES ($1, $2, NOW() + INTERVAL '1 hour')
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
      SET consumed_at = COALESCE(consumed_at, NOW())
      WHERE token_hash = $1
        AND expires_at > NOW()
      RETURNING user_id
    `,
    [tokenHash],
  )) as Array<{ user_id: string }>;

  const userId = tokenRows[0]?.user_id;

  if (!userId) {
    const verifiedUserRows = (await getSql().query(
      `
        SELECT u.*
        FROM email_verification_tokens t
        JOIN users u ON u.id = t.user_id
        WHERE t.token_hash = $1
          AND u.email_verified = TRUE
        LIMIT 1
      `,
      [tokenHash],
    )) as DatabaseUserRow[];
    const verifiedUser = verifiedUserRows[0];

    return verifiedUser ? await syncAdminRoleFromEnv(verifiedUser) : null;
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

export async function resetPasswordWithToken(
  token: string,
  passwordHash: string,
) {
  await ensureDatabaseSchema();

  const tokenHash = hashToken(token);
  const tokenRows = (await getSql().query(
    `
      UPDATE password_reset_tokens
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
      SET password_hash = $2,
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `,
    [userId, passwordHash],
  )) as DatabaseUserRow[];

  await getSql().query("DELETE FROM auth_sessions WHERE user_id = $1", [
    userId,
  ]);
  await getSql().query(
    `
      UPDATE password_reset_tokens
      SET consumed_at = NOW()
      WHERE user_id = $1 AND consumed_at IS NULL
    `,
    [userId],
  );

  return userRows[0] || null;
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
      SELECT *
      FROM listings
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 30
    `,
    [userId],
  )) as Array<{
    id: string;
    slug: string;
    title: string;
    description: string;
    price: string;
    currency: string;
    category_id: string;
    condition: string;
    district: string | null;
    status: string;
    moderation_status: ModerationStatus;
    moderation_comment: string | null;
    created_at: string;
    updated_at: string;
    expires_at: string;
  }>;

  return rows.map(toUserListingSummary);
}

export async function getPublicListingBySlug(
  slug: string,
): Promise<PublicListingDetail | null> {
  if (!isDatabaseConfigured()) {
    return null;
  }

  await ensureDatabaseSchema();

  const rows = (await getSql().query(
    `
      SELECT l.*, u.display_name AS author_name
      FROM listings l
      JOIN users u ON u.id = l.user_id
      WHERE l.slug = $1
        AND l.status = 'active'
        AND l.moderation_status = 'approved'
        AND l.expires_at > NOW()
      LIMIT 1
    `,
    [sanitizeText(slug, 160)],
  )) as Array<{
    id: string;
    slug: string;
    title: string;
    description: string;
    price: string;
    currency: string;
    category_id: string;
    condition: string;
    district: string | null;
    phone: string | null;
    telegram: string | null;
    instagram: string | null;
    preferred_contact: string;
    status: string;
    moderation_status: ModerationStatus;
    moderation_comment: string | null;
    views: number;
    favorites_count: number;
    expires_at: string;
    created_at: string;
    updated_at: string;
    author_name: string;
  }>;
  const row = rows[0];

  if (!row) {
    return null;
  }

  return {
    ...toUserListingSummary(row),
    phone: row.phone || undefined,
    telegram: row.telegram || undefined,
    instagram: row.instagram || undefined,
    preferredContact: row.preferred_contact,
    authorName: row.author_name,
    views: Number(row.views || 0),
    favoritesCount: Number(row.favorites_count || 0),
  };
}

export async function updateOwnListingStatus(input: {
  userId: string;
  listingId: string;
  status: Extract<ListingStatus, "pending" | "sold" | "archived" | "deleted">;
}) {
  await ensureDatabaseSchema();

  const rows = (await getSql().query(
    `
      UPDATE listings
      SET status = $3,
          moderation_status = CASE WHEN $3 = 'pending' THEN 'pending' ELSE moderation_status END,
          moderation_comment = CASE WHEN $3 = 'pending' THEN NULL ELSE moderation_comment END,
          moderated_by = CASE WHEN $3 = 'pending' THEN NULL ELSE moderated_by END,
          moderated_at = CASE WHEN $3 = 'pending' THEN NULL ELSE moderated_at END,
          expires_at = CASE
            WHEN $3 = 'pending' AND expires_at <= NOW() THEN NOW() + INTERVAL '30 days'
            ELSE expires_at
          END,
          updated_at = NOW()
      WHERE id = $1
        AND user_id = $2
        AND status <> 'deleted'
      RETURNING *
    `,
    [input.listingId, input.userId, input.status],
  )) as Array<{
    id: string;
    slug: string;
    title: string;
    description: string;
    price: string;
    currency: string;
    category_id: string;
    condition: string;
    district: string | null;
    status: string;
    moderation_status: ModerationStatus;
    moderation_comment: string | null;
    created_at: string;
    updated_at: string;
    expires_at: string;
  }>;
  const listing = rows[0] ? toUserListingSummary(rows[0]) : null;

  if (listing) {
    await writeAuditLog({
      actorId: input.userId,
      action: "listing.status_updated",
      entityType: "listing",
      entityId: input.listingId,
      details: { status: input.status, slug: listing.slug },
    });
  }

  return listing;
}

export async function createReport(input: {
  reporterId?: string;
  entityType: string;
  entityId: string;
  reason: string;
}) {
  await ensureDatabaseSchema();

  const id = randomUUID();

  await getSql().query(
    `
      INSERT INTO reports (id, reporter_id, entity_type, entity_id, reason)
      VALUES ($1, $2, $3, $4, $5)
    `,
    [
      id,
      input.reporterId || null,
      sanitizeText(input.entityType, 40),
      sanitizeText(input.entityId, 160),
      sanitizeText(input.reason, 1000),
    ],
  );
  await writeAuditLog({
    actorId: input.reporterId,
    action: "report.created",
    entityType: "report",
    entityId: id,
    details: { entityType: input.entityType, entityId: input.entityId },
  });

  return id;
}

async function getReports(limit = 25) {
  await ensureDatabaseSchema();

  const rows = (await getSql().query(
    `
      SELECT
        r.*,
        u.display_name AS reporter_name,
        u.email AS reporter_email,
        COALESCE(l.title, r.entity_id) AS entity_title
      FROM reports r
      LEFT JOIN users u ON u.id = r.reporter_id
      LEFT JOIN listings l ON r.entity_type = 'listing' AND l.id = r.entity_id
      ORDER BY
        CASE WHEN r.status = 'pending' THEN 0 ELSE 1 END,
        r.created_at DESC
      LIMIT $1
    `,
    [limit],
  )) as Array<{
    id: string;
    reporter_id: string | null;
    reporter_name: string | null;
    reporter_email: string | null;
    entity_type: string;
    entity_id: string;
    entity_title: string | null;
    reason: string;
    status: string;
    moderation_comment: string | null;
    created_at: string;
    updated_at: string;
  }>;

  return rows.map(toReportSummary);
}

async function getReportById(reportId: string) {
  await ensureDatabaseSchema();

  const rows = (await getSql().query(
    `
      SELECT
        r.*,
        u.display_name AS reporter_name,
        u.email AS reporter_email,
        COALESCE(l.title, r.entity_id) AS entity_title
      FROM reports r
      LEFT JOIN users u ON u.id = r.reporter_id
      LEFT JOIN listings l ON r.entity_type = 'listing' AND l.id = r.entity_id
      WHERE r.id = $1
      LIMIT 1
    `,
    [reportId],
  )) as Array<{
    id: string;
    reporter_id: string | null;
    reporter_name: string | null;
    reporter_email: string | null;
    entity_type: string;
    entity_id: string;
    entity_title: string | null;
    reason: string;
    status: string;
    moderation_comment: string | null;
    created_at: string;
    updated_at: string;
  }>;

  return rows[0] ? toReportSummary(rows[0]) : null;
}

export async function createReview(input: {
  userId: string;
  targetHref: string;
  targetTitle: string;
  rating: number;
  text: string;
}) {
  await ensureDatabaseSchema();

  const id = randomUUID();

  await getSql().query(
    `
      INSERT INTO reviews (id, user_id, target_href, target_title, rating, text)
      VALUES ($1, $2, $3, $4, $5, $6)
    `,
    [
      id,
      input.userId,
      sanitizeText(input.targetHref, 300),
      sanitizeText(input.targetTitle, 160),
      Math.min(5, Math.max(1, Math.round(input.rating))),
      sanitizeText(input.text, 2000),
    ],
  );

  await writeAuditLog({
    actorId: input.userId,
    action: "review.created",
    entityType: "review",
    entityId: id,
    details: { targetHref: input.targetHref, targetTitle: input.targetTitle },
  });

  return id;
}

export async function getUserReviews(
  userId: string,
  limit = 30,
): Promise<ReviewSummary[]> {
  await ensureDatabaseSchema();

  const rows = (await getSql().query(
    `
      SELECT
        r.*,
        u.display_name AS user_name,
        u.email AS user_email
      FROM reviews r
      JOIN users u ON u.id = r.user_id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
      LIMIT $2
    `,
    [userId, limit],
  )) as Array<{
    id: string;
    user_id: string;
    user_name: string | null;
    user_email: string | null;
    target_href: string;
    target_title: string;
    rating: string | number;
    text: string;
    owner_reply: string | null;
    status: ModerationStatus;
    moderation_comment: string | null;
    created_at: string;
    updated_at: string;
  }>;

  return rows.map(toReviewSummary);
}

export async function getPublicReviews(
  targetHref: string,
  limit = 12,
): Promise<ReviewSummary[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }

  await ensureDatabaseSchema();

  const rows = (await getSql().query(
    `
      SELECT
        r.*,
        u.display_name AS user_name,
        NULL::TEXT AS user_email
      FROM reviews r
      JOIN users u ON u.id = r.user_id
      WHERE r.target_href = $1
        AND r.status = 'approved'
      ORDER BY r.created_at DESC
      LIMIT $2
    `,
    [sanitizeText(targetHref, 300), limit],
  )) as Array<{
    id: string;
    user_id: string;
    user_name: string | null;
    user_email: string | null;
    target_href: string;
    target_title: string;
    rating: string | number;
    text: string;
    owner_reply: string | null;
    status: ModerationStatus;
    moderation_comment: string | null;
    created_at: string;
    updated_at: string;
  }>;

  return rows.map(toReviewSummary);
}

async function getReviews(limit = 25): Promise<ReviewSummary[]> {
  await ensureDatabaseSchema();

  const rows = (await getSql().query(
    `
      SELECT
        r.*,
        u.display_name AS user_name,
        u.email AS user_email
      FROM reviews r
      JOIN users u ON u.id = r.user_id
      ORDER BY
        CASE WHEN r.status = 'pending' THEN 0 ELSE 1 END,
        r.created_at DESC
      LIMIT $1
    `,
    [limit],
  )) as Array<{
    id: string;
    user_id: string;
    user_name: string | null;
    user_email: string | null;
    target_href: string;
    target_title: string;
    rating: string | number;
    text: string;
    owner_reply: string | null;
    status: ModerationStatus;
    moderation_comment: string | null;
    created_at: string;
    updated_at: string;
  }>;

  return rows.map(toReviewSummary);
}

async function getReviewById(reviewId: string) {
  await ensureDatabaseSchema();

  const rows = (await getSql().query(
    `
      SELECT
        r.*,
        u.display_name AS user_name,
        u.email AS user_email
      FROM reviews r
      JOIN users u ON u.id = r.user_id
      WHERE r.id = $1
      LIMIT 1
    `,
    [reviewId],
  )) as Array<{
    id: string;
    user_id: string;
    user_name: string | null;
    user_email: string | null;
    target_href: string;
    target_title: string;
    rating: string | number;
    text: string;
    owner_reply: string | null;
    status: ModerationStatus;
    moderation_comment: string | null;
    created_at: string;
    updated_at: string;
  }>;

  return rows[0] ? toReviewSummary(rows[0]) : null;
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
      moderation_comment: string | null;
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
  const reportsPromise = getReports(25);
  const reviewsPromise = getReviews(25);
  const contentPromise = sql.query(
    `
        SELECT *
        FROM admin_content_items
        ORDER BY type ASC, order_index ASC, updated_at DESC
        LIMIT 120
      `,
  ) as unknown as Promise<
    Array<{
      id: string;
      type: string;
      title: string;
      summary: string | null;
      href: string | null;
      status: string;
      order_index: number;
      payload: Record<string, unknown> | null;
      created_by: string | null;
      created_at: string;
      updated_at: string;
    }>
  >;
  const settingsPromise = sql.query(
    `
        SELECT *
        FROM site_settings
        ORDER BY key ASC
      `,
  ) as unknown as Promise<
    Array<{
      key: string;
      value: string;
      updated_by: string | null;
      updated_at: string;
    }>
  >;
  const notificationsPromise = sql.query(
    `
        SELECT
          n.*,
          u.email AS user_email,
          u.display_name AS user_name
        FROM notifications n
        JOIN users u ON u.id = n.user_id
        ORDER BY n.created_at DESC
        LIMIT 25
      `,
  ) as unknown as Promise<
    Array<{
      id: string;
      user_id: string;
      user_email: string;
      user_name: string;
      type: string;
      title: string;
      body: string;
      read_at: string | null;
      created_at: string;
    }>
  >;
  const statsPromise = sql.query(
    `
        SELECT
          (SELECT COUNT(*)::INT FROM users) AS users,
          (SELECT COUNT(*)::INT FROM listings WHERE moderation_status = 'pending') AS pending_listings,
          (SELECT COUNT(*)::INT FROM owner_claims WHERE status = 'pending') AS owner_claims,
          (SELECT COUNT(*)::INT FROM reports WHERE status = 'pending') AS pending_reports,
          (SELECT COUNT(*)::INT FROM reviews WHERE status = 'pending') AS pending_reviews,
          (SELECT COUNT(*)::INT FROM listings WHERE status = 'active') AS active_listings,
          (SELECT COUNT(*)::INT FROM users WHERE is_blocked = TRUE) AS blocked_users,
          (SELECT COUNT(*)::INT FROM admin_content_items) AS content_items,
          (SELECT COUNT(*)::INT FROM notifications) AS sent_notifications
      `,
  ) as unknown as Promise<
    Array<{
      users: number;
      pending_listings: number;
      owner_claims: number;
      pending_reports: number;
      pending_reviews: number;
      active_listings: number;
      blocked_users: number;
      content_items: number;
      sent_notifications: number;
    }>
  >;
  const [
    users,
    listings,
    ownerClaims,
    auditLogs,
    reports,
    reviews,
    contentRows,
    settingRows,
    notifications,
    statsRows,
  ] = await Promise.all([
    usersPromise,
    listingsPromise,
    ownerClaimsPromise,
    auditLogsPromise,
    reportsPromise,
    reviewsPromise,
    contentPromise,
    settingsPromise,
    notificationsPromise,
    statsPromise,
  ]);
  const stats = statsRows[0] || {
    users: 0,
    pending_listings: 0,
    owner_claims: 0,
    pending_reports: 0,
    pending_reviews: 0,
    active_listings: 0,
    blocked_users: 0,
    content_items: 0,
    sent_notifications: 0,
  };
  const savedSettings = new Map(
    settingRows.map((row) => [row.key, toSiteSettingSummary(row)]),
  );

  return {
    stats: {
      users: Number(stats.users),
      pendingListings: Number(stats.pending_listings),
      ownerClaims: Number(stats.owner_claims),
      pendingReports: Number(stats.pending_reports),
      pendingReviews: Number(stats.pending_reviews),
      activeListings: Number(stats.active_listings),
      blockedUsers: Number(stats.blocked_users),
      contentItems: Number(stats.content_items),
      sentNotifications: Number(stats.sent_notifications),
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
      moderationComment: row.moderation_comment || undefined,
      authorName: row.author_name,
      authorEmail: row.author_email,
      createdAt: row.created_at,
    })),
    ownerClaims: ownerClaims.map(toOwnerClaimSummary),
    reports,
    reviews,
    auditLogs: auditLogs.map(toAuditLogSummary),
    contentItems: contentRows.map(toAdminContentItemSummary),
    settings: defaultSiteSettings.map(
      (setting) => savedSettings.get(setting.key) || setting,
    ),
    notifications: notifications.map(toAdminNotificationSummary),
  };
}

export async function getModerationDashboard() {
  const adminData = await getAdminDashboard();

  return {
    listings: adminData.listings.filter(
      (listing) => listing.moderationStatus === "pending",
    ),
    ownerClaims: adminData.ownerClaims.filter(
      (claim) => claim.status === "pending",
    ),
    reports: adminData.reports.filter((report) => report.status === "pending"),
    reviews: adminData.reviews.filter((review) => review.status === "pending"),
    auditLogs: adminData.auditLogs,
  };
}

export async function upsertAdminContentItem(input: {
  actorId: string;
  id?: string;
  type: AdminContentType;
  title: string;
  summary?: string;
  href?: string;
  status: AdminContentStatus;
  orderIndex?: number;
  notes?: string;
}) {
  await ensureDatabaseSchema();

  const id = input.id || randomUUID();
  const payload = { notes: sanitizeText(input.notes, 1200) };
  const rows = (await getSql().query(
    `
      INSERT INTO admin_content_items (
        id, type, title, summary, href, status, order_index, payload, created_by
      )
      VALUES ($1, $2, $3, NULLIF($4, ''), NULLIF($5, ''), $6, $7, $8::JSONB, $9)
      ON CONFLICT (id) DO UPDATE
      SET type = EXCLUDED.type,
          title = EXCLUDED.title,
          summary = EXCLUDED.summary,
          href = EXCLUDED.href,
          status = EXCLUDED.status,
          order_index = EXCLUDED.order_index,
          payload = EXCLUDED.payload,
          updated_at = NOW()
      RETURNING *
    `,
    [
      id,
      input.type,
      sanitizeText(input.title, 160),
      sanitizeText(input.summary, 800),
      sanitizeText(input.href, 300),
      input.status,
      input.orderIndex || 0,
      JSON.stringify(payload),
      input.actorId,
    ],
  )) as Array<{
    id: string;
    type: string;
    title: string;
    summary: string | null;
    href: string | null;
    status: string;
    order_index: number;
    payload: Record<string, unknown> | null;
    created_by: string | null;
    created_at: string;
    updated_at: string;
  }>;
  const item = rows[0] ? toAdminContentItemSummary(rows[0]) : null;

  if (item) {
    await writeAuditLog({
      actorId: input.actorId,
      action: input.id ? "content.updated" : "content.created",
      entityType: input.type,
      entityId: item.id,
      details: { status: input.status, title: item.title },
    });
  }

  return item;
}

export async function updateAdminContentStatus(input: {
  actorId: string;
  id: string;
  status: AdminContentStatus;
}) {
  await ensureDatabaseSchema();

  const rows = (await getSql().query(
    `
      UPDATE admin_content_items
      SET status = $2,
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `,
    [input.id, input.status],
  )) as Array<{
    id: string;
    type: string;
    title: string;
    summary: string | null;
    href: string | null;
    status: string;
    order_index: number;
    payload: Record<string, unknown> | null;
    created_by: string | null;
    created_at: string;
    updated_at: string;
  }>;
  const item = rows[0] ? toAdminContentItemSummary(rows[0]) : null;

  if (item) {
    await writeAuditLog({
      actorId: input.actorId,
      action: "content.status.updated",
      entityType: item.type,
      entityId: item.id,
      details: { status: input.status, title: item.title },
    });
  }

  return item;
}

export async function getPublishedAdminContentItems(
  input: {
    type?: AdminContentType;
    limit?: number;
  } = {},
) {
  if (!isDatabaseConfigured()) {
    return [];
  }

  await ensureDatabaseSchema();

  const rows = (await getSql().query(
    `
      SELECT *
      FROM admin_content_items
      WHERE status = 'published'
        AND ($1::TEXT IS NULL OR type = $1)
      ORDER BY order_index ASC, updated_at DESC
      LIMIT $2
    `,
    [input.type || null, input.limit || 50],
  )) as Array<{
    id: string;
    type: string;
    title: string;
    summary: string | null;
    href: string | null;
    status: string;
    order_index: number;
    payload: Record<string, unknown> | null;
    created_by: string | null;
    created_at: string;
    updated_at: string;
  }>;

  return rows.map(toAdminContentItemSummary);
}

export async function deleteAdminContentItem(input: {
  actorId: string;
  id: string;
}) {
  await ensureDatabaseSchema();

  const rows = (await getSql().query(
    `
      DELETE FROM admin_content_items
      WHERE id = $1
      RETURNING *
    `,
    [input.id],
  )) as Array<{
    id: string;
    type: string;
    title: string;
    summary: string | null;
    href: string | null;
    status: string;
    order_index: number;
    payload: Record<string, unknown> | null;
    created_by: string | null;
    created_at: string;
    updated_at: string;
  }>;
  const item = rows[0] ? toAdminContentItemSummary(rows[0]) : null;

  if (item) {
    await writeAuditLog({
      actorId: input.actorId,
      action: "content.deleted",
      entityType: item.type,
      entityId: item.id,
      details: { status: item.status, title: item.title },
    });
  }

  return item;
}

export async function updateSiteSettings(input: {
  actorId: string;
  settings: Array<{ key: string; value: string }>;
}) {
  await ensureDatabaseSchema();

  const rows: SiteSettingSummary[] = [];

  for (const setting of input.settings) {
    const result = (await getSql().query(
      `
        INSERT INTO site_settings (key, value, updated_by, updated_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (key) DO UPDATE
        SET value = EXCLUDED.value,
            updated_by = EXCLUDED.updated_by,
            updated_at = NOW()
        RETURNING *
      `,
      [setting.key, sanitizeText(setting.value, 2000), input.actorId],
    )) as Array<{
      key: string;
      value: string;
      updated_by: string | null;
      updated_at: string;
    }>;

    if (result[0]) {
      rows.push(toSiteSettingSummary(result[0]));
    }
  }

  await writeAuditLog({
    actorId: input.actorId,
    action: "settings.updated",
    entityType: "site_settings",
    details: { keys: input.settings.map((setting) => setting.key) },
  });

  return rows;
}

export async function createSystemNotification(input: {
  actorId: string;
  target: "all" | "admins" | "moderators" | "owners" | "users";
  title: string;
  body: string;
}) {
  await ensureDatabaseSchema();

  const sql = getSql();
  const targetRole =
    input.target === "admins"
      ? "admin"
      : input.target === "moderators"
        ? "moderator"
        : input.target === "owners"
          ? "owner"
          : null;
  const users = targetRole
    ? ((await sql.query(
        `
          SELECT id
          FROM users
          WHERE is_blocked = FALSE
            AND email_verified = TRUE
            AND roles @> ARRAY[$1]::TEXT[]
        `,
        [targetRole],
      )) as Array<{ id: string }>)
    : ((await sql.query(
        `
          SELECT id
          FROM users
          WHERE is_blocked = FALSE
            AND ($1::TEXT = 'all' OR email_verified = TRUE)
        `,
        [input.target],
      )) as Array<{ id: string }>);

  const notificationIds: string[] = [];

  for (const user of users) {
    const notificationId = await createNotification({
      userId: user.id,
      type: "system",
      title: sanitizeText(input.title, 160),
      body: sanitizeText(input.body, 1000),
    });

    notificationIds.push(notificationId);
  }

  await writeAuditLog({
    actorId: input.actorId,
    action: "notification.sent",
    entityType: "notification",
    details: { target: input.target, count: users.length, title: input.title },
  });

  return { sentCount: users.length, notificationIds };
}

export async function deleteAdminNotification(input: {
  actorId: string;
  id: string;
}) {
  await ensureDatabaseSchema();

  const rows = (await getSql().query(
    `
      DELETE FROM notifications
      WHERE id = $1
      RETURNING id, user_id, type, title, body, read_at, created_at
    `,
    [input.id],
  )) as Array<{
    id: string;
    user_id: string;
    type: string;
    title: string;
    body: string;
    read_at: string | null;
    created_at: string;
  }>;
  const notification = rows[0];

  if (notification) {
    await writeAuditLog({
      actorId: input.actorId,
      action: "notification.deleted",
      entityType: "notification",
      entityId: notification.id,
      details: { userId: notification.user_id, title: notification.title },
    });
  }

  return notification ? toNotificationSummary(notification) : null;
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
  moderationStatus: Extract<
    ModerationStatus,
    "approved" | "rejected" | "hidden" | "blocked"
  >;
  comment?: string;
}) {
  await ensureDatabaseSchema();

  const publicStatus =
    input.moderationStatus === "approved" ? "active" : input.moderationStatus;
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
    [
      input.claimId,
      input.status,
      sanitizeText(input.comment, 500),
      input.actorId,
    ],
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

export async function moderateReport(input: {
  actorId: string;
  reportId: string;
  status: "reviewed" | "dismissed" | "blocked";
  comment?: string;
}) {
  await ensureDatabaseSchema();

  const rows = (await getSql().query(
    `
      UPDATE reports
      SET status = $2,
          moderation_comment = NULLIF($3, ''),
          updated_at = NOW()
      WHERE id = $1
      RETURNING reporter_id, entity_type, entity_id
    `,
    [input.reportId, input.status, sanitizeText(input.comment, 500)],
  )) as Array<{
    reporter_id: string | null;
    entity_type: string;
    entity_id: string;
  }>;
  const report = rows[0] || null;

  if (!report) {
    return null;
  }

  if (input.status === "blocked" && report.entity_type === "listing") {
    await moderateListing({
      actorId: input.actorId,
      listingId: report.entity_id,
      moderationStatus: "blocked",
      comment: input.comment || "Заблоковано після розгляду скарги.",
    });
  }

  if (report.reporter_id) {
    await createNotification({
      userId: report.reporter_id,
      type: "report_moderation",
      title: "Скаргу розглянуто",
      body:
        input.status === "dismissed"
          ? "Модератор розглянув скаргу і не знайшов порушення."
          : "Модератор розглянув скаргу та застосував рішення.",
    });
  }

  await writeAuditLog({
    actorId: input.actorId,
    action: "report.moderated",
    entityType: "report",
    entityId: input.reportId,
    details: {
      status: input.status,
      entityType: report.entity_type,
      entityId: report.entity_id,
    },
  });

  return getReportById(input.reportId);
}

export async function moderateReview(input: {
  actorId: string;
  reviewId: string;
  status: Extract<
    ModerationStatus,
    "approved" | "rejected" | "hidden" | "blocked"
  >;
  comment?: string;
}) {
  await ensureDatabaseSchema();

  const rows = (await getSql().query(
    `
      UPDATE reviews
      SET status = $2,
          moderation_comment = NULLIF($3, ''),
          updated_at = NOW()
      WHERE id = $1
      RETURNING user_id, target_title
    `,
    [input.reviewId, input.status, sanitizeText(input.comment, 500)],
  )) as Array<{ user_id: string; target_title: string }>;
  const review = rows[0] || null;

  if (!review) {
    return null;
  }

  await createNotification({
    userId: review.user_id,
    type: "review_moderation",
    title: "Статус відгуку оновлено",
    body:
      input.status === "approved"
        ? `Відгук до "${review.target_title}" схвалено.`
        : `Відгук до "${review.target_title}" має статус: ${input.status}.`,
  });
  await writeAuditLog({
    actorId: input.actorId,
    action: "review.moderated",
    entityType: "review",
    entityId: input.reviewId,
    details: { status: input.status, targetTitle: review.target_title },
  });

  return getReviewById(input.reviewId);
}

export async function getListingCardsFromDatabase(
  limit = 24,
): Promise<HomeCard[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }

  await ensureDatabaseSchema();

  const rows = (await getSql().query(
    `
      SELECT slug, title, description, price, currency, category_id, condition, district, status, created_at
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
    category: listing.category_id,
    condition: listing.condition,
    status: listing.status,
  }));
}

export async function searchListingCardsFromDatabase(
  query: string,
  limit = 24,
): Promise<HomeCard[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }

  await ensureDatabaseSchema();

  const searchQuery = sanitizeText(query, 120);
  const rows = (await getSql().query(
    `
      SELECT slug, title, description, price, currency, category_id, condition, district, status, created_at
      FROM listings
      WHERE status = 'active'
        AND moderation_status = 'approved'
        AND expires_at > NOW()
        AND (
          $2 = ''
          OR title ILIKE ('%' || $2 || '%')
          OR description ILIKE ('%' || $2 || '%')
          OR district ILIKE ('%' || $2 || '%')
        )
      ORDER BY created_at DESC
      LIMIT $1
    `,
    [limit, searchQuery],
  )) as ListingCardRow[];

  return rows.map((listing) => ({
    title: listing.title,
    description: listing.description,
    href: `/market/${listing.slug}`,
    meta: listing.district || "Тернопіль",
    badge: `${Number(listing.price).toLocaleString("uk-UA")} ${listing.currency}`,
    category: listing.category_id,
    condition: listing.condition,
    status: listing.status,
  }));
}

export async function getListingSitemapRoutes(limit = 500) {
  if (!isDatabaseConfigured()) {
    return [];
  }

  await ensureDatabaseSchema();

  const rows = (await getSql().query(
    `
      SELECT slug, updated_at
      FROM listings
      WHERE status = 'active'
        AND moderation_status = 'approved'
        AND expires_at > NOW()
      ORDER BY updated_at DESC
      LIMIT $1
    `,
    [limit],
  )) as Array<{ slug: string; updated_at: string }>;

  return rows.map((row) => ({
    route: `/market/${row.slug}`,
    lastModified: new Date(row.updated_at),
  }));
}
