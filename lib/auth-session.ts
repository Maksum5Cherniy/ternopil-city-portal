import "server-only";

import { cookies } from "next/headers";
import type { DecodedIdToken } from "firebase-admin/auth";
import { adminAuth, adminDb, isFirebaseAdminConfigured } from "@/firebase/firebaseAdmin";
import { isAtLeastRole } from "@/lib/access-control";
import type { UserRole } from "@/types";

export const sessionCookieName = "de_ternopil_session";
export const sessionCookieMaxAgeSeconds = 60 * 60 * 24 * 5;

const validRoles = new Set<UserRole>(["guest", "user", "owner", "moderator", "admin"]);

type ServerUser = {
  uid: string;
  email?: string;
  displayName?: string;
  roles: UserRole[];
  isBlocked: boolean;
};

export type ServerSession =
  | { status: "authenticated"; user: ServerUser; decodedToken: DecodedIdToken }
  | { status: "signedOut" }
  | { status: "invalid" }
  | { status: "firebaseAdminMissing" }
  | { status: "blocked"; user: ServerUser };

function normalizeRoles(value: unknown): UserRole[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((role): role is UserRole => validRoles.has(role as UserRole));
}

function rolesFromToken(decodedToken: DecodedIdToken): UserRole[] {
  const tokenWithClaims = decodedToken as DecodedIdToken & {
    roles?: unknown;
    role?: unknown;
    admin?: unknown;
  };
  const roles = normalizeRoles(tokenWithClaims.roles);

  if (roles.length > 0) {
    return roles;
  }

  if (
    typeof tokenWithClaims.role === "string" &&
    validRoles.has(tokenWithClaims.role as UserRole)
  ) {
    return [tokenWithClaims.role as UserRole];
  }

  if (tokenWithClaims.admin === true) {
    return ["admin"];
  }

  return [];
}

export async function getCurrentServerSession(): Promise<ServerSession> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(sessionCookieName)?.value;

  if (!sessionCookie) {
    return { status: "signedOut" };
  }

  if (!isFirebaseAdminConfigured) {
    return { status: "firebaseAdminMissing" };
  }

  try {
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    const [userSnapshot, roleSnapshot] = await Promise.all([
      adminDb.collection("users").doc(decodedToken.uid).get(),
      adminDb.collection("userRoles").doc(decodedToken.uid).get(),
    ]);
    const userData = userSnapshot.exists ? userSnapshot.data() : {};
    const roleData = roleSnapshot.exists ? roleSnapshot.data() : {};
    const roles = [
      ...new Set([
        ...normalizeRoles(userData?.roles),
        ...normalizeRoles(roleData?.roles),
        ...rolesFromToken(decodedToken),
      ]),
    ];
    const user: ServerUser = {
      uid: decodedToken.uid,
      email: typeof userData?.email === "string" ? userData.email : decodedToken.email,
      displayName:
        typeof userData?.displayName === "string" ? userData.displayName : decodedToken.name,
      roles: roles.length > 0 ? roles : ["user"],
      isBlocked: userData?.isBlocked === true,
    };

    if (user.isBlocked) {
      return { status: "blocked", user };
    }

    return { status: "authenticated", user, decodedToken };
  } catch {
    return { status: "invalid" };
  }
}

export function hasServerRole(session: ServerSession, role: UserRole) {
  return session.status === "authenticated" && isAtLeastRole(session.user.roles, role);
}
