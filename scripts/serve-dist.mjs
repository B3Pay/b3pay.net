/**
 * A local stand-in for how Vercel serves this build:
 *   1. exact file
 *   2. <path>/index.html   (the per-route documents the build emits)
 *   3. /index.html         (the SPA rewrite in vercel.json)
 *
 * `vite preview` rewrites extensionless paths to /index.html before it looks at
 * the filesystem, so it cannot show whether the per-route HTML is reachable.
 * This can.
 *
 *     node scripts/serve-dist.mjs [port] [dist-dir]
 */
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createGzip } from "node:zlib";
import { basename, extname, join, normalize } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const PORT = Number(process.argv[2] || 4180);
// Second argument selects the build: `dist` for b3pay.net, `dist-docs` for the
// documentation site. They are separate Vercel projects served the same way.
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", process.argv[3] || "dist");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
};

async function resolve(pathname) {
  const safe = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, "");
  for (const candidate of [join(ROOT, safe), join(ROOT, safe, "index.html")]) {
    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch {
      /* next candidate */
    }
  }
  return join(ROOT, "index.html");
}

// Vercel compresses text responses; measuring without it makes every timing
// audit read on a payload no visitor will ever download.
const COMPRESSIBLE = new Set([".html", ".js", ".css", ".svg", ".json", ".xml", ".txt", ".webmanifest"]);

createServer(async (req, res) => {
  const file = await resolve(new URL(req.url, "http://x").pathname);
  const ext = extname(file);
  const gzip = COMPRESSIBLE.has(ext) && /\bgzip\b/.test(req.headers["accept-encoding"] || "");
  res.writeHead(200, {
    "Content-Type": TYPES[ext] || "application/octet-stream",
    "Cache-Control": file.includes("/assets/")
      ? "public, max-age=31536000, immutable"
      : "no-cache",
    ...(gzip ? { "Content-Encoding": "gzip", Vary: "Accept-Encoding" } : {}),
  });
  const stream = createReadStream(file);
  if (gzip) stream.pipe(createGzip()).pipe(res);
  else stream.pipe(res);
}).listen(PORT, () => console.log(`${basename(ROOT)} on http://localhost:${PORT}`));
