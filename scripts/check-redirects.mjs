#!/usr/bin/env node
/**
 * Checks vercel.json as Vercel compiles it (scripts/vercel-routes.mjs):
 *
 *   - every address the old sites served ends where OLD_ADDRESSES says, on a
 *     page this build has, by permanent redirects unless marked otherwise;
 *   - no redirect catches a page of this build on b3pay.net;
 *   - docs.b3pay.net serves nothing itself: every page address there leaves
 *     for b3pay.net on its first redirect.
 *
 *     node scripts/check-redirects.mjs [dist]
 */
import { readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ORIGIN, createRouter, listFunctions, listPages } from "./vercel-routes.mjs";

const ROOT = join(fileURLToPath(import.meta.url), "..", "..");
const OLD_DOCS = "https://docs.b3pay.net";

/** [old address, where it must end, temporary?] */
export const OLD_ADDRESSES = [
  // docs.b3pay.net, the docs site this one replaces (apps/docs until this change).
  [`${OLD_DOCS}/`, "/docs/"],
  [`${OLD_DOCS}/ic-reactor`, "/docs/ic-reactor/"],
  [`${OLD_DOCS}/ic-reactor/why`, "/docs/ic-reactor/"],
  [`${OLD_DOCS}/ic-reactor/install`, "/docs/ic-reactor/guides/getting-started/"],
  [`${OLD_DOCS}/ic-reactor/quickstart`, "/docs/ic-reactor/guides/getting-started/"],
  [`${OLD_DOCS}/ic-reactor/vite`, "/docs/ic-reactor/guides/vite-plugin/"],
  // The 3.x API pages: ic-reactor 4 removed what they described.
  ...["api", "candid", "cli", "display", "factories", "hooks"].map((page) => [`${OLD_DOCS}/ic-reactor/${page}`, "/docs/ic-reactor/migrating-from-3/"]),
  [`${OLD_DOCS}/b3forge`, "/docs/b3forge/"],
  ...["overview", "first-workflow", "nodes", "expressions", "execution", "catalog"].map((page) => [`${OLD_DOCS}/b3forge/${page}`, "/docs/b3forge/"]),
  // B3Wallet is off the site: its addresses lead to /docs/b3wallet/ for good,
  // and from there to /docs/ by a temporary redirect, so that address can
  // serve a page again without browsers still holding the move.
  [`${OLD_DOCS}/b3wallet`, "/docs/", true],
  ...["overview", "owners", "consensus", "chains", "upgrades", "deploy"].map((page) => [`${OLD_DOCS}/b3wallet/${page}`, "/docs/", true]),
  [`${OLD_DOCS}/b3note`, "/docs/b3note/"],
  ...["overview", "encryption", "expiry"].map((page) => [`${OLD_DOCS}/b3note/${page}`, "/docs/b3note/"]),
  [`${OLD_DOCS}/b3note/run-locally`, "/docs/b3note/development/"],
  [`${OLD_DOCS}/sitemap.xml`, "/sitemap-index.xml"],
  [`${OLD_DOCS}/robots.txt`, "/robots.txt"],
  [`${OLD_DOCS}/a-page-that-never-existed`, "/docs/"],
  // b3pay.net before this change (apps/web).
  ["/products", "/"],
  ["/products/b3forge", "/forge/"],
  ["/products/b3wallet", "/docs/", true],
  ["/products/ic-reactor", "/docs/ic-reactor/"],
  ["/products/b3note", "/docs/b3note/"],
  ["/developers", "/docs/"],
  ["/about", "/about/"],
  ["/contact", "/contact/"],
  ["/blog", "https://blog.b3pay.net/", true],
  // This site's own B3Wallet page, served from 2026-10-30 until B3Wallet came
  // off the site.
  ["/docs/b3wallet", "/docs/", true],
];

/** Each address as written, and with the trailing slash links often add. */
const variants = (address) => {
  const { pathname } = new URL(address, ORIGIN);
  const last = pathname.split("/").pop();
  return pathname.endsWith("/") || last.includes(".") ? [address] : [address, `${address}/`];
};

export function checkRedirects({ router, pages }) {
  const problems = [];
  let checked = 0;

  for (const [address, expected, temporary = false] of OLD_ADDRESSES) {
    for (const from of variants(address)) {
      checked++;
      const end = router.resolve(from);
      const want = new URL(expected, ORIGIN).href;
      if (end.url !== want) problems.push(`${from} ends at ${end.url}, not ${want}`);
      else if (!end.external && !end.file) problems.push(`${from} ends at ${end.url}, which the build does not have (HTTP ${end.status})`);
      else if (!end.external && end.status !== 200) problems.push(`${from} ends at ${end.url} with HTTP ${end.status}`);
      // Permanent all the way, or, for a temporary move, permanent up to a last 307.
      const statuses = end.hops.map((hop) => hop.status);
      const wantStatuses = statuses.map((_, i) => (temporary && i === statuses.length - 1 ? 307 : 308));
      if (statuses.join() !== wantStatuses.join()) problems.push(`${from} redirects with ${statuses.join(", ") || "none"}, not ${wantStatuses.join(", ") || "a redirect"}`);
    }
  }

  for (const page of pages) {
    checked += 2;
    const here = router.resolve(page.path);
    if (here.hops.length || here.file !== page.file)
      problems.push(`${page.path} is a page of this build, but ${here.hops.length ? `a redirect sends it to ${here.url}` : `it is served from ${here.file ?? `HTTP ${here.status}`}`}`);
    const old = router.resolve(`${OLD_DOCS}${page.path}`);
    if (!old.hops.length || new URL(old.hops[0].to).hostname !== "b3pay.net")
      problems.push(`${OLD_DOCS}${page.path} is not sent to b3pay.net by its first redirect (it ends at ${old.url})`);
  }

  return { problems, checked };
}

function main() {
  const dist = resolve(process.argv[2] ?? "dist");
  const config = JSON.parse(readFileSync(join(ROOT, "vercel.json"), "utf8"));
  const router = createRouter({ config, dist, functions: listFunctions(join(ROOT, "api")) });
  const pages = listPages(dist);
  if (!pages.length) throw new Error(`${relative(process.cwd(), dist) || dist} has no pages; build the site first`);
  const { problems, checked } = checkRedirects({ router, pages });
  if (problems.length) {
    console.error(`\nredirects  ${problems.length} problem${problems.length === 1 ? "" : "s"}\n\n${problems.join("\n")}\n`);
    process.exit(1);
  }
  console.log(`redirects  ${checked} addresses end where they should (${OLD_ADDRESSES.length} old addresses, ${pages.length} pages)`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
