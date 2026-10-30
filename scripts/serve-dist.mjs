/**
 * A local stand-in for how Vercel serves this build:
 *   1. the exact file
 *   2. <path>/index.html, with a redirect from <path> to <path>/ first
 *      (vercel.json sets trailingSlash: true)
 *   3. /404.html with status 404
 *
 * Redirects from vercel.json are not applied here; `npm run check:redirects`
 * tests those.
 *
 *     node scripts/serve-dist.mjs [port] [dist-dir]
 */
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createGzip } from "node:zlib";
import { basename, dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const PORT = Number(process.argv[2] || 4180);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", process.argv[3] || "dist");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".pdf": "application/pdf",
};

const isFile = async (path) => {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
};

/** @returns {Promise<{ file: string, status: number } | { redirect: string }>} */
async function resolve(pathname) {
  const safe = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, "");
  if (await isFile(join(ROOT, safe))) return { file: join(ROOT, safe), status: 200 };
  if (await isFile(join(ROOT, safe, "index.html"))) {
    if (!pathname.endsWith("/")) return { redirect: `${pathname}/` };
    return { file: join(ROOT, safe, "index.html"), status: 200 };
  }
  return { file: join(ROOT, "404.html"), status: 404 };
}

// Vercel compresses text responses; measuring without it makes every timing
// audit read on a payload no visitor will ever download.
const COMPRESSIBLE = new Set([".html", ".js", ".mjs", ".css", ".svg", ".json", ".xml", ".txt", ".webmanifest"]);

createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  const found = await resolve(url.pathname);
  if ("redirect" in found) {
    res.writeHead(308, { Location: found.redirect + url.search });
    return res.end();
  }
  const ext = extname(found.file);
  const gzip = COMPRESSIBLE.has(ext) && /\bgzip\b/.test(req.headers["accept-encoding"] || "");
  res.writeHead(found.status, {
    "Content-Type": TYPES[ext] || "application/octet-stream",
    "Cache-Control": found.file.includes("/_astro/") ? "public, max-age=31536000, immutable" : "no-cache",
    ...(gzip ? { "Content-Encoding": "gzip", Vary: "Accept-Encoding" } : {}),
  });
  const stream = createReadStream(found.file);
  if (gzip) stream.pipe(createGzip()).pipe(res);
  else stream.pipe(res);
}).listen(PORT, () => console.log(`${basename(ROOT)} on http://localhost:${PORT}`));
