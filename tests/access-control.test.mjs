import assert from "node:assert/strict";
import test from "node:test";

const rolePermissions = {
  guest: ["read:public"],
  user: ["read:public", "manage:own-profile", "manage:own-listings"],
  owner: ["read:public", "claim:place", "manage:owned-place"],
  moderator: ["read:public", "read:moderation", "review:content"],
  admin: ["read:public", "manage:users", "manage:roles", "read:audit-logs"],
};

test("admin role includes role management", () => {
  assert.equal(rolePermissions.admin.includes("manage:roles"), true);
});

test("guest role cannot manage listings", () => {
  assert.equal(rolePermissions.guest.includes("manage:own-listings"), false);
});

test("moderator can review content but user cannot", () => {
  assert.equal(rolePermissions.moderator.includes("review:content"), true);
  assert.equal(rolePermissions.user.includes("review:content"), false);
});
