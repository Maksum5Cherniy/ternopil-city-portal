import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { isAtLeastRole } from "@/lib/access-control";
import {
  ensureDatabaseSchema,
  type DatabaseUserRow,
  getSql,
  isDatabaseConfigured,
  normalizeRoles,
  toPublicUser,
  type PublicUser,
} from "@/lib/database";
import type { UserRole } from "@/types";

export const sessionCookieName = "de_ternopil_session";
export const sessionCookieMaxAgeSeconds = 60 * 60 * 24 * 5;

export type ServerSession =
  | { status: "authenticated"; user: PublicUser }
  | { status: "signedOut" }
  | { status: "invalid" }
  | { status: "databaseMissing" }
  | { status: "blocked"; user: PublicUser };

function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("base64url");
}

export async function getCurrentServerSession(): Promise<ServerSession> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(sessionCookieName)?.value;

  if (!sessionCookie) {
    return { status: "signedOut" };
  }

  if (!isDatabaseConfigured()) {
    return { status: "databaseMissing" };
  }

  try {
    await ensureDatabaseSchema();

    const sql = getSql();
    const rows = (await sql.query(
      `
        SELECT u.*
        FROM auth_sessions s
        JOIN users u ON u.id = s.user_id
        WHERE s.token_hash = $1
          AND s.expires_at > NOW()
        LIMIT 1
      `,
      [hashSessionToken(sessionCookie)],
    )) as DatabaseUserRow[];

    if (!rows[0]) {
      return { status: "invalid" };
    }

    const user = toPublicUser({
      ...rows[0],
      roles: normalizeRoles(rows[0].roles),
    });

    if (user.isBlocked) {
      return { status: "blocked", user };
    }

    return { status: "authenticated", user };
  } catch {
    return { status: "invalid" };
  }
}

export function hasServerRole(session: ServerSession, role: UserRole) {
  return session.status === "authenticated" && isAtLeastRole(session.user.roles, role);
}

export async function createServerSession(userId: string) {
  await ensureDatabaseSchema();

  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + sessionCookieMaxAgeSeconds * 1000).toISOString();
  const sql = getSql();

  await sql.query("DELETE FROM auth_sessions WHERE expires_at <= NOW()");
  await sql.query(
    "INSERT INTO auth_sessions (token_hash, user_id, expires_at) VALUES ($1, $2, $3)",
    [tokenHash, userId, expiresAt],
  );

  return token;
}

export async function revokeCurrentServerSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(sessionCookieName)?.value;

  if (!sessionCookie || !isDatabaseConfigured()) {
    return;
  }

  await ensureDatabaseSchema();
  await getSql().query("DELETE FROM auth_sessions WHERE token_hash = $1", [
    hashSessionToken(sessionCookie),
  ]);
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(sessionCookieName, token, {
    httpOnly: true,
    maxAge: sessionCookieMaxAgeSeconds,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(sessionCookieName, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}
