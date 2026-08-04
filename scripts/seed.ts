import { randomUUID } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { listings } from "../constants/content";

function loadLocalEnv() {
  const envPath = resolve(process.cwd(), ".env.local");

  if (!existsSync(envPath)) {
    return;
  }

  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separator = trimmed.indexOf("=");

    if (separator === -1) {
      continue;
    }

    const key = trimmed.slice(0, separator);
    const value = trimmed.slice(separator + 1).replace(/^"|"$/g, "");

    process.env[key] ||= value;
  }
}

function parsePrice(value: string | undefined) {
  if (!value) {
    return 0;
  }

  const numericValue = Number(value.replace(/[^\d]/g, ""));

  return Number.isFinite(numericValue) ? numericValue : 0;
}

async function run() {
  loadLocalEnv();

  const { ensureDatabaseSchema, getSql, isDatabaseConfigured } =
    await import("../lib/database-core");
  const { hashPassword } = await import("../lib/password-core");

  if (!isDatabaseConfigured()) {
    console.log("DATABASE_URL is missing. Connect Neon Store in Vercel before running seed.");
    return;
  }

  await ensureDatabaseSchema();

  const sql = getSql();
  const seedUserId = "seed-admin";

  if (process.env.ALLOW_DEMO_SEED === "true") {
    const passwordHash = await hashPassword("ChangeMe123!");

    await sql.query(
      `
        INSERT INTO users (
          id, email, password_hash, display_name, roles, email_verified, email_verified_at,
          profile_completed
        )
        VALUES ($1, $2, $3, $4, $5, TRUE, NOW(), TRUE)
        ON CONFLICT (email) DO NOTHING
      `,
      [seedUserId, "admin@example.test", passwordHash, "Тестовий адміністратор", ["user", "admin"]],
    );
  }

  const existingUserRows = (await sql.query(
    "SELECT id FROM users ORDER BY created_at ASC LIMIT 1",
  )) as Array<{ id: string }> | [];
  const ownerId =
    existingUserRows[0]?.id || (process.env.ALLOW_DEMO_SEED === "true" ? seedUserId : null);

  if (!ownerId) {
    console.log("Postgres schema verified. Create a real user before seeding listings.");
    return;
  }

  for (const item of listings.slice(0, 15)) {
    const id = randomUUID();

    await sql.query(
      `
        INSERT INTO listings (
          id, slug, user_id, title, description, price, category_id, condition,
          preferred_contact, status, moderation_status, expires_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'used', 'phone', $8, 'approved', NOW() + INTERVAL '30 days')
        ON CONFLICT (slug) DO NOTHING
      `,
      [
        id,
        item.slug,
        ownerId,
        item.title,
        item.description,
        parsePrice(item.price),
        item.category || "home",
        item.status === "pending" ? "pending" : "active",
      ],
    );
  }

  console.log("Postgres schema verified and seed listings written.");
  console.log("Set ALLOW_DEMO_SEED=true only for local demo admin creation.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
