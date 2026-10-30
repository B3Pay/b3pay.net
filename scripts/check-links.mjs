#!/usr/bin/env node
/**
 * Every link, image, script, stylesheet, form and head tag in the built pages
 * that points into this site must reach a file of the build, or a function in
 * api/, the way Vercel serves it (scripts/vercel-routes.mjs), without passing
 * through a redirect; and a #fragment must name an element of its page.
 *
 * Starlight's link validator checks the Markdown pages while they build. This
 * checks the HTML everything else makes as well: the header and footer, the
 * module cards, the head tags, and the pages static modules bring.
 *
 *     node scripts/check-links.mjs [dist]
 */
import { readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ORIGIN, createRouter, listFunctions, listPages } from "./vercel-routes.mjs";

const ROOT = join(fileURLToPath(import.meta.url), "..", "..");

const URL_ATTRIBUTES = new Set(["href", "src", "action", "poster"]);
const SRCSET_ATTRIBUTES = new Set(["srcset", "imagesrcset"]);
const META_URLS = new Set(["og:image", "og:url", "twitter:image"]);
const SKIPPED_SCHEMES = /^(mailto|tel|javascript|data|blob):/i;

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
const decode = (text) =>
  text.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, body) => {
    if (body[0] === "#") return String.fromCodePoint(body[1].toLowerCase() === "x" ? parseInt(body.slice(2), 16) : Number(body.slice(1)));
    return ENTITIES[body.toLowerCase()] ?? entity;
  });

/** The addresses a page refers to: attributes of real tags, not text inside scripts, styles or comments. */
export function linksOf(html) {
  const markup = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/(<script\b[^>]*>)[\s\S]*?<\/script>/gi, "$1")
    .replace(/(<style\b[^>]*>)[\s\S]*?<\/style>/gi, "$1");
  const links = [];
  // A quoted value may hold ">" (Expressive Code keeps a block's source in data-code), so tags are read value by value.
  const tags = /<([a-z][\w-]*)((?:\s+[^\s"'=<>\/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*\/?>/gi;
  for (const [, tag, attributes] of markup.matchAll(tags)) {
    const values = {};
    for (const [, name, double, single, bare] of attributes.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g))
      values[name.toLowerCase()] = decode(double ?? single ?? bare ?? "");
    for (const [name, value] of Object.entries(values)) {
      if (URL_ATTRIBUTES.has(name)) links.push({ tag: tag.toLowerCase(), attribute: name, rel: values.rel, value });
      if (SRCSET_ATTRIBUTES.has(name))
        for (const candidate of value.split(",")) {
          const url = candidate.trim().split(/\s+/)[0];
          if (url) links.push({ tag: tag.toLowerCase(), attribute: name, value: url });
        }
    }
    if (tag.toLowerCase() === "meta" && META_URLS.has(values.property ?? values.name) && values.content)
      links.push({ tag: "meta", attribute: values.property ?? values.name, value: values.content });
  }
  return links;
}

/** The ids, and the names of anchors, a fragment can point at. */
export function targetsOf(html) {
  const targets = new Set();
  for (const [, , double, single, bare] of html.matchAll(/\s(id|name)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi)) targets.add(decode(double ?? single ?? bare));
  return targets;
}

export function checkLinks({ router, pages }) {
  const html = new Map();
  const read = (file) => {
    if (!html.has(file)) html.set(file, readFileSync(file, "utf8"));
    return html.get(file);
  };
  const targets = new Map();
  const targetsIn = (file) => {
    if (!targets.has(file)) targets.set(file, targetsOf(read(file)));
    return targets.get(file);
  };
  const ends = new Map();
  const endOf = (address) => {
    if (!ends.has(address)) ends.set(address, router.resolve(address));
    return ends.get(address);
  };

  /** problem → { link, pages } so a broken header link is reported once, not on every page. */
  const problems = new Map();
  const report = (message, page) => {
    if (!problems.has(message)) problems.set(message, []);
    problems.get(message).push(page.path);
  };
  let internal = 0;
  let external = 0;

  for (const page of pages) {
    const base = new URL(page.path, ORIGIN);
    for (const link of linksOf(read(page.file))) {
      if (link.value === "" || SKIPPED_SCHEMES.test(link.value)) continue;
      // The not-found page answers at addresses that do not exist, with a 404
      // that keeps it out of search indexes; the canonical address Starlight
      // gives it, /404/, is linked from nowhere.
      if (page.path === "/404.html" && (link.rel === "canonical" || link.attribute === "og:url")) continue;
      let url;
      try {
        url = new URL(link.value, base);
      } catch {
        report(`${link.value} (${link.tag} ${link.attribute}) is not a valid address`, page);
        continue;
      }
      if (url.origin !== ORIGIN && url.hostname !== "docs.b3pay.net") {
        external++;
        continue;
      }
      internal++;
      const fragment = url.hash ? decodeURIComponent(url.hash.slice(1)) : "";
      url.hash = "";
      url.search = "";
      const end = endOf(url.href);
      const shown = `${link.value} (${link.tag} ${link.attribute})`;
      if (end.hops.length) report(`${shown} redirects to ${end.url}; link there instead`, page);
      else if (end.function) {
        if (link.attribute !== "action") report(`${shown} points at the function ${end.function}`, page);
      } else if (end.status !== 200 || !end.file) report(`${shown} is broken (HTTP ${end.status})`, page);
      else if (fragment && end.file.endsWith(".html") && !targetsIn(end.file).has(fragment))
        report(`${shown}: ${end.url} has no element with id "${fragment}"`, page);
    }
  }
  return { problems, internal, external };
}

function main() {
  const dist = resolve(process.argv[2] ?? "dist");
  const config = JSON.parse(readFileSync(join(ROOT, "vercel.json"), "utf8"));
  const router = createRouter({ config, dist, functions: listFunctions(join(ROOT, "api")) });
  const pages = listPages(dist);
  if (!pages.length) throw new Error(`${relative(process.cwd(), dist) || dist} has no pages; build the site first`);
  const { problems, internal, external } = checkLinks({ router, pages });
  if (problems.size) {
    const lines = [...problems].map(([message, on]) => `${message}\n    on ${on.length === 1 ? on[0] : `${on.length} pages, first ${on[0]}`}`);
    console.error(`\nlinks  ${problems.size} problem${problems.size === 1 ? "" : "s"}\n\n${lines.join("\n")}\n`);
    process.exit(1);
  }
  console.log(`links  ${internal} links into the site reach a page, file or function (${pages.length} pages; ${external} external links not followed)`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
