import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { isSameOriginMutation } from "../lib/request-security";

function request(headers: Record<string, string>) {
  return new Request("https://deternopil.example/api/profile", {
    method: "POST",
    headers,
  });
}

test("accepts the exact origin and browser same-origin fallback", () => {
  assert.equal(isSameOriginMutation(request({ origin: "https://deternopil.example" })), true);
  assert.equal(isSameOriginMutation(request({ "sec-fetch-site": "same-origin" })), true);
});

test("rejects cross-origin and unidentifiable mutations", () => {
  assert.equal(isSameOriginMutation(request({ origin: "https://evil.example" })), false);
  assert.equal(isSameOriginMutation(request({ origin: "null" })), false);
  assert.equal(isSameOriginMutation(request({ "sec-fetch-site": "same-site" })), false);
  assert.equal(isSameOriginMutation(request({ referer: "https://evil.example/page" })), false);
  assert.equal(isSameOriginMutation(request({})), false);
});

test("every API mutation checks its request origin", () => {
  function checkDirectory(directory: string) {
    for (const item of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, item.name);

      if (item.isDirectory()) {
        checkDirectory(path);
      } else if (item.name === "route.ts") {
        const source = readFileSync(path, "utf8");
        const mutationCount = [
          ...source.matchAll(/export async function (POST|PUT|PATCH|DELETE)\(/g),
        ].length;
        const guardCount = [...source.matchAll(/rejectCrossOriginMutation\(request\)/g)].length;

        assert.equal(guardCount, mutationCount, `${path} has an unguarded mutation`);
      }
    }
  }

  checkDirectory(join(process.cwd(), "app", "api"));
});
