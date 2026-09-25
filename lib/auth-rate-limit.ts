import "server-only";

import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { ensureDatabaseSchema, getSql } from "@/lib/database";

let tableReady: Promise<void> | undefined;

async function ensureRateLimitTable() {
  await ensureDatabaseSchema();

  if (process.env.DATABASE_SCHEMA_MODE === "external") {
    return;
  }

  if (!tableReady) {
    tableReady = getSql()
      .query(
        `
        CREATE TABLE IF NOT EXISTS auth_rate_limits (
          key TEXT PRIMARY KEY,
          attempts INTEGER NOT NULL,
          reset_at TIMESTAMPTZ NOT NULL
        )
      `,
      )
      .then(() => undefined)
      .catch((error) => {
        tableReady = undefined;
        throw error;
      });
  }

  await tableReady;
}

export async function consumeAuthLimit(
  scope: string,
  identifier: string,
  limit: number,
  windowSeconds: number,
) {
  await ensureRateLimitTable();

  const key = createHash("sha256")
    .update(`${scope}:${identifier.trim().toLowerCase()}`)
    .digest("hex");
  const rows = (await getSql().query(
    `
      INSERT INTO auth_rate_limits (key, attempts, reset_at)
      VALUES ($1, 1, NOW() + ($2 * INTERVAL '1 second'))
      ON CONFLICT (key) DO UPDATE SET
        attempts = CASE
          WHEN auth_rate_limits.reset_at <= NOW() THEN 1
          ELSE auth_rate_limits.attempts + 1
        END,
        reset_at = CASE
          WHEN auth_rate_limits.reset_at <= NOW() THEN NOW() + ($2 * INTERVAL '1 second')
          ELSE auth_rate_limits.reset_at
        END
      RETURNING attempts, GREATEST(1, CEIL(EXTRACT(EPOCH FROM (reset_at - NOW())))) AS retry_after
    `,
    [key, windowSeconds],
  )) as Array<{ attempts: number; retry_after: number }>;

  return {
    allowed: rows[0].attempts <= limit,
    retryAfter: Number(rows[0].retry_after),
  };
}

export async function enforceAuthLimit(
  scope: string,
  identifier: string,
  limit: number,
  windowSeconds: number,
) {
  const result = await consumeAuthLimit(scope, identifier, limit, windowSeconds);

  return result.allowed
    ? null
    : NextResponse.json(
        { error: "Забагато спроб. Спробуйте пізніше." },
        { status: 429, headers: { "Retry-After": String(result.retryAfter) } },
      );
}

/** The per-address limit is supplementary; the per-account limit also applies. */
export function getClientAddress(request: Request) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    null
  );
}
