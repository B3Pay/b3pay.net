/**
 * Where Vercel sends a request for this site, worked out from vercel.json with
 * Vercel's own route compiler (@vercel/routing-utils) and the files of a
 * build. check-redirects.mjs and check-links.mjs ask it where an address ends.
 *
 * It covers what vercel.json uses here: trailingSlash, redirects with host
 * conditions, headers, and functions in api/. A key it does not cover makes it
 * throw rather than guess, so a new kind of rule needs teaching here first.
 */
import { readdirSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import routing from "@vercel/routing-utils";

export const ORIGIN = "https://b3pay.net";
/** The hosts this deployment answers for. */
export const HOSTS = new Set(["b3pay.net", "docs.b3pay.net"]);

const COVERED = new Set(["$schema", "installCommand", "buildCommand", "outputDirectory", "trailingSlash", "redirects", "headers"]);
const MAX_HOPS = 10;

const isFile = (path) => {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
};

/** `/api/<name>` for each function file in api/, as Vercel deploys them. */
export function listFunctions(apiDir) {
  let names = [];
  try {
    names = readdirSync(apiDir);
  } catch {
    return new Set();
  }
  return new Set(names.filter((name) => /\.(ts|js|mjs)$/.test(name)).map((name) => `/api/${name.slice(0, -extname(name).length)}`));
}

/**
 * @param {{ config: object, dist: string, functions?: Set<string> }} options
 *   config: the parsed vercel.json; dist: the build; functions: from listFunctions.
 */
export function createRouter({ config, dist, functions = new Set() }) {
  for (const key of Object.keys(config))
    if (!COVERED.has(key)) throw new Error(`vercel.json: "${key}" is not simulated by scripts/vercel-routes.mjs; teach it there before relying on the checks`);

  const { routes, error } = routing.getTransformedRoutes({
    trailingSlash: config.trailingSlash,
    redirects: config.redirects,
    headers: config.headers,
  });
  if (error) throw new Error(`vercel.json: ${error.message}`);
  for (const route of routes) {
    if ("handle" in route || "dest" in route) throw new Error(`vercel.json compiled to a route this simulation does not cover: ${JSON.stringify(route)}`);
    for (const condition of [...(route.has ?? []), ...(route.missing ?? [])])
      if (condition.type !== "host") throw new Error(`vercel.json: "${condition.type}" conditions are not simulated by scripts/vercel-routes.mjs`);
  }
  const compiled = routes.map((route) => ({ ...route, pattern: new RegExp(route.src, route.caseSensitive ? "" : "i") }));
  const hostIs = (condition, host) => new RegExp(`^(?:${condition.value})$`, "i").test(host);

  /** The files, or the function, Vercel serves for a path no route redirected. */
  function serve(pathname) {
    let path;
    try {
      path = decodeURIComponent(pathname);
    } catch {
      return { status: 400 };
    }
    if (path.includes("\0") || path.split("/").includes("..")) return { status: 404 };
    // A function answers with or without the trailing slash, and trailingSlash
    // sends /api/contact to /api/contact/, so the form posts there. `vercel dev`
    // does the same and says it copies production; posting the form once on a
    // preview deployment is the real test.
    const bare = path.length > 1 ? path.replace(/\/$/, "") : path;
    if (functions.has(bare)) return { status: 200, function: bare };
    const file = path.endsWith("/") ? join(dist, path, "index.html") : join(dist, path);
    if (isFile(file)) return { status: 200, file };
    return { status: 404, file: join(dist, "404.html") };
  }

  /** One request: the first redirect that applies, or what is served. */
  function answer(host, pathname) {
    for (const route of compiled) {
      const match = route.pattern.exec(pathname);
      if (!match) continue;
      if (route.has && !route.has.every((condition) => hostIs(condition, host))) continue;
      if (route.missing && route.missing.some((condition) => hostIs(condition, host))) continue;
      if (route.continue) continue; // headers only
      if (route.status >= 300 && route.status < 400) {
        const location = route.headers.Location.replace(/\$(\d+|[A-Za-z_]\w*)/g, (_, key) => (/^\d+$/.test(key) ? match[Number(key)] : match.groups?.[key]) ?? "");
        return { redirect: location, status: route.status };
      }
      // A route with nothing but a source ends the list: /.well-known goes straight to the files.
      break;
    }
    return serve(pathname);
  }

  /**
   * Follows an address to where it ends.
   * @param {string} address absolute, or a path on b3pay.net
   * @returns {{ url: string, hops: { from: string, to: string, status: number }[], status?: number, file?: string, function?: string, external?: boolean }}
   */
  function resolve(address) {
    let url = new URL(address, ORIGIN);
    const hops = [];
    for (let i = 0; i <= MAX_HOPS; i++) {
      if (url.protocol !== "https:" || !HOSTS.has(url.hostname)) return { url: url.href, hops, external: true };
      const result = answer(url.hostname, url.pathname);
      if (!("redirect" in result)) return { url: url.href, hops, ...result };
      const next = new URL(result.redirect, url);
      hops.push({ from: url.href, to: next.href, status: result.status });
      url = next;
    }
    throw new Error(`${address}: more than ${MAX_HOPS} redirects`);
  }

  return { resolve };
}

/** Every HTML page of a build, as the path it is served at. */
export function listPages(dist) {
  const pages = [];
  const walk = (dir, prefix) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (prefix === "/" && (entry.name === "_astro" || entry.name === "pagefind")) continue;
        walk(join(dir, entry.name), `${prefix}${entry.name}/`);
      } else if (entry.name.endsWith(".html")) {
        pages.push({ path: entry.name === "index.html" ? prefix : `${prefix}${entry.name}`, file: join(dir, entry.name) });
      }
    }
  };
  walk(dist, "/");
  return pages.sort((a, b) => a.path.localeCompare(b.path));
}
