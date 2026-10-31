import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { OLD_ADDRESSES, checkRedirects } from "./check-redirects.mjs";
import { createRouter, listPages } from "./vercel-routes.mjs";

const CONFIG = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8"));
const FUNCTIONS = new Set(["/api/contact"]);

/** A build holding exactly the pages and files the old addresses lead to. */
async function build() {
  const dist = await mkdtemp(join(tmpdir(), "dist-"));
  const targets = new Set(["/", ...OLD_ADDRESSES.map(([, to]) => to).filter((to) => to.startsWith("/"))]);
  for (const path of [...targets, "/404.html"]) {
    const file = path.endsWith("/") ? join(dist, path, "index.html") : join(dist, path);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, "<!doctype html>");
  }
  return dist;
}

const run = async (config) => {
  const dist = await build();
  const router = createRouter({ config, dist, functions: FUNCTIONS });
  return checkRedirects({ router, pages: listPages(dist) }).problems.join("\n");
};

test("vercel.json sends every old address where it should", async () => {
  assert.equal(await run(CONFIG), "");
});

test("Vercel adds the trailing slash before any redirect applies", async () => {
  const dist = await build();
  const router = createRouter({ config: { trailingSlash: true, redirects: [{ source: "/old", destination: "/docs/", permanent: true }] }, dist });
  const end = router.resolve("/old");
  assert.equal(end.url, "https://b3pay.net/old/");
  assert.equal(end.status, 404);
  assert.equal(router.resolve("/docs").url, "https://b3pay.net/docs/");
  assert.equal(router.resolve("/api/contact/").url, "https://b3pay.net/api/contact/");
});

test("a source written without its trailing slash is caught", async () => {
  const redirects = CONFIG.redirects.map((r) => (r.source === "/ic-reactor/why/" ? { ...r, source: "/ic-reactor/why" } : r));
  assert.match(await run({ ...CONFIG, redirects }), /docs\.b3pay\.net\/ic-reactor\/why ends at https:\/\/b3pay\.net\/docs\/ic-reactor\/migrating-from-3\//);
});

test("a redirect that catches a page of the site is caught", async () => {
  const redirects = [{ source: "/docs/:path*/", destination: "/", permanent: true }, ...CONFIG.redirects];
  assert.match(await run({ ...CONFIG, redirects }), /\/docs\/b3forge\/ is a page of this build, but a redirect sends it to https:\/\/b3pay\.net\//);
});

test("a page still served on docs.b3pay.net is caught", async () => {
  const redirects = CONFIG.redirects.filter((r) => !r.source.startsWith("/:path*"));
  assert.match(await run({ ...CONFIG, redirects }), /https:\/\/docs\.b3pay\.net\/forge\/ is not sent to b3pay\.net/);
});

test("a temporary move that became permanent is caught", async () => {
  const redirects = CONFIG.redirects.map((r) => (r.source === "/blog/" ? { ...r, permanent: true } : r));
  assert.match(await run({ ...CONFIG, redirects }), /\/blog redirects with 308, 308, not 308, 307/);
});

test("a rule the simulation does not cover is refused, not guessed", async () => {
  const dist = await build();
  assert.throws(() => createRouter({ config: { ...CONFIG, rewrites: [{ source: "/a", destination: "/b" }] }, dist }), /"rewrites" is not simulated/);
  assert.throws(
    () => createRouter({ config: { ...CONFIG, redirects: [{ source: "/a/", has: [{ type: "header", key: "x" }], destination: "/", permanent: true }] }, dist }),
    /"header" conditions are not simulated/,
  );
});
