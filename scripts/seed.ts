import { randomUUID } from "node:crypto";
import { listings } from "../constants/content";
import { ensureDatabaseSchema, getSql, isDatabaseConfigured } from "../lib/database-core";
import { hashPassword } from "../lib/password-core";

function parsePrice(value: string | undefined) {
  if (!value) {
    return 0;
  }

  const numericValue = Number(value.replace(/[^\d]/g, ""));

  return Number.isFinite(numericValue) ? numericValue : 0;
}

async function run() {
  if (!isDatabaseConfigured()) {
    console.log("DATABASE_URL is missing. Connect Neon Store in Vercel before running seed.");
    return;
  }

  await ensureDatabaseSchema();

  const sql = getSql();
  const seedUserId = "seed-admin";
  const passwordHash = await hashPassword("ChangeMe123!");

  await sql.query(
    `
      INSERT INTO users (id, email, password_hash, display_name, roles, profile_completed)
      VALUES ($1, $2, $3, $4, $5, TRUE)
      ON CONFLICT (email) DO NOTHING
    `,
    [seedUserId, "admin@example.test", passwordHash, "Тестовий адміністратор", ["user", "admin"]],
  );

  for (const item of listings.slice(0, 10)) {
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
        seedUserId,
        item.title,
        item.description,
        parsePrice(item.price),
        item.category || "home",
        item.status === "pending" ? "pending" : "active",
      ],
    );
  }

  console.log("Postgres seed data written successfully.");
  console.log("Seed admin: admin@example.test / ChangeMe123! Change this before production.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
