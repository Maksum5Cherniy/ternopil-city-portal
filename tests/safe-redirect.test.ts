import assert from "node:assert/strict";
import test from "node:test";
import { getSafeRedirect } from "../lib/safe-redirect";

test("login redirect stays on a page of this site", () => {
  assert.equal(getSafeRedirect("/admin"), "/admin");
  assert.equal(
    getSafeRedirect("/places/example?tab=reviews"),
    "/places/example?tab=reviews",
  );
  for (const unsafe of [
    "//evil.example",
    "/\\evil.example",
    "/\nevil.example",
    "https://evil.example",
    "/api/admin/users",
  ]) {
    assert.equal(getSafeRedirect(unsafe), "/profile");
  }
});
