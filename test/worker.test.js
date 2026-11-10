import assert from "node:assert/strict";
import test from "node:test";
import worker from "../src/index.js";

for (const method of ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]) {
  test(`${method} returns 410 on every path`, async () => {
    for (const path of ["/", "/api/items?key=value", "/favicon.ico", "/robots.txt"]) {
      const response = worker.fetch(new Request(`https://example.com${path}`, { method }));
      assert.equal(response.status, 410);
      assert.equal(response.statusText, "Gone");
      assert.equal(response.headers.get("X-Content-Type-Options"), "nosniff");
      assert.equal(response.headers.get("Cache-Control"), "no-store");
      assert.equal(response.headers.get("Retry-After"), null);
      assert.equal(response.headers.get("Content-Type"), "text/plain; charset=utf-8");
      const body = await response.text();
      if (method === "HEAD") assert.equal(body, "");
      else assert.match(body, /サービスは終了/);
    }
  });
}
