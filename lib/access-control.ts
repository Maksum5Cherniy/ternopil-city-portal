import type { UserRole } from "@/types";

export const roleOrder: UserRole[] = ["guest", "user", "owner", "moderator", "admin"];

export const rolePermissions: Record<UserRole, string[]> = {
  guest: ["read:public"],
  user: [
    "read:public",
    "manage:own-profile",
    "manage:own-listings",
    "manage:own-favorites",
    "create:review",
    "create:report",
  ],
  owner: [
    "read:public",
    "manage:own-profile",
    "manage:own-listings",
    "manage:own-favorites",
    "create:review",
    "create:report",
    "claim:place",
    "manage:owned-place",
    "reply:owned-place-reviews",
    "read:owned-place-stats",
  ],
  moderator: [
    "read:public",
    "read:moderation",
    "review:content",
    "hide:content",
    "reject:content",
    "read:reports",
  ],
  admin: [
    "read:public",
    "read:moderation",
    "review:content",
    "hide:content",
    "reject:content",
    "manage:users",
    "manage:roles",
    "manage:settings",
    "manage:homepage",
    "read:audit-logs",
  ],
};

export function hasPermission(roles: UserRole[], permission: string) {
  return roles.some((role) => rolePermissions[role]?.includes(permission));
}

export function isAtLeastRole(roles: UserRole[], requiredRole: UserRole) {
  const requiredIndex = roleOrder.indexOf(requiredRole);

  return roles.some((role) => roleOrder.indexOf(role) >= requiredIndex);
}
