/**
 * Checking a built module before the site serves it, and before a repository
 * publishes it: the manifest, every page against the content rules, the
 * static files, and that every address the module claims is one it owns.
 */
import { readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, posix } from "node:path";
import { listFiles, pagePathOf } from "./files.mjs";
import { checkManifest, isPagePath } from "./manifest.mjs";
import { checkPage, parse, readPage } from "./markdown.mjs";

const PAGE = /\.mdx?$/;
const DOC_ASSET = /\.(png|jpe?g|gif|svg|webp|avif)$/i;
const STATIC = /\.(html|css|js|mjs|json|txt|xml|svg|png|jpe?g|gif|webp|avif|ico|woff2?|map|pdf|webmanifest|pf_meta|pf_index|pf_fragment|pagefind)$/i;
const NAME = /^[a-z0-9][a-z0-9._-]*$/i;

export const LIMITS = { files: 5000, bytes: 100 * 1024 * 1024 };

/** Pages a sidebar names, relative links it makes, and folders whose pages it lists. */
function sidebarTargets(items, pages = [], links = [], directories = []) {
  for (const item of items ?? []) {
    if (typeof item === "string") pages.push(item);
    else if ("page" in item) pages.push(item.page);
    else if ("link" in item) links.push(item.link);
    else if ("directory" in item) directories.push(item.directory);
    else sidebarTargets(item.items, pages, links, directories);
  }
  return { pages, links, directories };
}

/** A folder's pages: its index and every page below it, as Starlight lists them. */
const inside = (page, directory) => page === directory || page.startsWith(`${directory}/`);

/**
 * @returns {Promise<{ errors: string[], warnings: string[], manifest: object | null, pages: string[] }>}
 */
export async function checkModule(dir, { id }) {
  const errors = [];
  const warnings = [];
  const where = `module ${id}`;

  let manifest = null;
  try {
    manifest = JSON.parse(await readFile(join(dir, "b3pay-module.json"), "utf8"));
  } catch (error) {
    return { errors: [`${where}: b3pay-module.json is missing or not JSON (${error.message})`], warnings, manifest, pages: [] };
  }
  errors.push(...checkManifest(manifest, { where: `${where} b3pay-module.json`, id, form: "bundle" }));

  const { files: top } = await listFiles(dir);
  for (const file of top)
    if (file !== "b3pay-module.json" && !file.startsWith("docs/") && !file.startsWith("static/"))
      errors.push(`${where}: ${file} is outside docs/ and static/`);

  // Pages.
  const docs = await listFiles(join(dir, "docs"));
  const pages = new Map(); // page path -> file
  let bytes = 0;
  for (const link of docs.links) errors.push(`${where}: docs/${link} is a link`);
  for (const file of docs.files) {
    const at = `${where} docs/${file}`;
    bytes += (await stat(join(dir, "docs", file))).size;
    const segments = file.split("/");
    if (!segments.every((segment) => NAME.test(segment)) || segments.some((segment) => segment.startsWith("_"))) {
      errors.push(`${at}: names are letters, digits, dots and dashes, and may not start with "_"`);
      continue;
    }
    if (DOC_ASSET.test(file)) continue;
    if (!PAGE.test(file)) {
      errors.push(`${at}: docs/ holds pages (.md, .mdx) and images only`);
      continue;
    }
    const page = pagePathOf(file);
    if (!isPagePath(page)) {
      errors.push(`${at}: a page's path is lowercase letters, digits and dashes, so it is its own address`);
      continue;
    }
    if (pages.has(page)) {
      errors.push(`${at}: the same address as docs/${pages.get(page)}`);
      continue;
    }
    pages.set(page, file);

    const mdx = file.endsWith(".mdx");
    let read;
    try {
      read = readPage(await readFile(join(dir, "docs", file), "utf8"), { mdx });
    } catch (error) {
      errors.push(`${at}: ${error.message}`);
      continue;
    }
    let tree;
    try {
      tree = parse(read.body, { mdx });
    } catch (error) {
      errors.push(`${at}: does not parse (${error.message})`);
      continue;
    }
    const { data } = read;
    errors.push(...checkPage({ data, tree, where: at, line: read.line }));
    const image = data.hero?.image ?? {};
    for (const key of ["file", "dark", "light"]) {
      if (typeof image[key] !== "string") continue;
      const resolved = posix.normalize(posix.join(posix.dirname(file), image[key]));
      if (resolved.startsWith("../") || !existsSync(join(dir, "docs", resolved)))
        errors.push(`${at}: hero.image.${key} "${image[key]}" is not a file in the module`);
    }
  }

  // Static files.
  const statics = await listFiles(join(dir, "static"));
  for (const link of statics.links) errors.push(`${where}: static/${link} is a link`);
  for (const file of statics.files) {
    const at = `${where} static/${file}`;
    bytes += (await stat(join(dir, "static", file))).size;
    if (!file.split("/").every((segment) => NAME.test(segment))) errors.push(`${at}: names are letters, digits, dots and dashes`);
    else if (!STATIC.test(file)) errors.push(`${at}: not a file type the site serves`);
    const page = file === "index.html" ? "index" : file.endsWith("/index.html") ? file.slice(0, -"/index.html".length) : null;
    if (page && pages.has(page)) errors.push(`${at}: the same address as the page docs/${pages.get(page)}`);
  }

  const count = docs.files.length + statics.files.length;
  if (count === 0) errors.push(`${where}: has no pages and no static files`);
  if (count > LIMITS.files) errors.push(`${where}: ${count} files, over the limit of ${LIMITS.files}`);
  if (bytes > LIMITS.bytes) errors.push(`${where}: ${(bytes / 1048576).toFixed(1)} MB, over the limit of ${LIMITS.bytes / 1048576} MB`);

  // What the manifest points at exists.
  if (manifest) {
    const staticFiles = new Set(statics.files);
    const home = manifest.home;
    if (home === undefined) errors.push(`${where}: no home: add docs/index.md(x), static/index.html, or "home"`);
    else if (home.endsWith(".html") ? !staticFiles.has(home) : !pages.has(home))
      errors.push(`${where}: home "${home}" is not one of its pages or files`);
    if (pages.size > 0 && !manifest.sidebar) errors.push(`${where}: has pages but no sidebar`);
    const targets = sidebarTargets(manifest.sidebar);
    for (const page of targets.pages) if (!pages.has(page)) errors.push(`${where}: the sidebar names "${page}", which is not a page`);
    for (const link of targets.links) {
      if (/^https:/.test(link)) continue;
      const path = link.replace(/\/$/, "");
      if (!pages.has(path) && !staticFiles.has(path) && !staticFiles.has(`${path}/index.html`))
        errors.push(`${where}: the sidebar links "${link}", which is not in the module`);
    }
    for (const directory of targets.directories)
      if (![...pages.keys()].some((page) => inside(page, directory)))
        errors.push(`${where}: the sidebar lists the folder "${directory}", which has no pages`);
    const listed = new Set(targets.pages);
    const unlisted = [...pages.keys()].filter((page) => !listed.has(page) && !targets.directories.some((directory) => inside(page, directory)));
    if (unlisted.length) warnings.push(`${where}: pages not in the sidebar: ${unlisted.join(", ")}`);
  }

  return { errors, warnings, manifest, pages: [...pages.keys()] };
}
