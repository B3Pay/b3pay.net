#!/usr/bin/env node
/**
 * Brings every module in `modules/registry.json` into the site. `npm run
 * build` runs it before `astro build`, and `npm run dev` before the dev server.
 *
 *   node scripts/modules/sync.mjs
 *   node scripts/modules/sync.mjs --module <id>=<folder>   use this module instead
 *                                                          of the registry's, or
 *                                                          add it if the registry
 *                                                          has none (the publish
 *                                                          dry run)
 *
 * For each module: get its files (from this repository, from a repository at
 * a pinned commit, or from the branch a repository publishes to), build it if
 * it is a source, check it, then copy its pages to src/content/docs/docs/<id>/
 * and its static files to public/docs/<id>/. Last, write
 * src/generated/modules.json (the navigation) and public/modules.json (what
 * is live, and from which commit).
 *
 * One problem in one module fails the whole run, so the build fails and the
 * last good deploy stays live.
 */
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { fetchArchive, unpack } from "./archive.mjs";
import { buildModule } from "./build.mjs";
import { checkModule } from "./check.mjs";
import { GROUPS, checkManifest, checkRegistry } from "./manifest.mjs";
import { toStarlight } from "./site.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const SELF = "B3Pay/b3pay.net";
const WORK = join(ROOT, ".modules");
const CONTENT = join(ROOT, "src/content/docs/docs");
const PUBLIC = join(ROOT, "public/docs");
const NAVIGATION = join(ROOT, "src/generated/modules.json");
const RECORD = join(ROOT, "public/modules.json");
const STATE = join(WORK, "materialized.json");
const RESERVED = ["index", "404"];

const readJson = async (file) => JSON.parse(await readFile(file, "utf8"));

function parseOverrides(argv) {
  const overrides = new Map();
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] !== "--module") continue;
    const [id, folder] = (argv[i + 1] ?? "").split("=");
    if (!id || !folder) throw new Error("--module takes <id>=<folder>");
    overrides.set(id, resolve(folder));
  }
  return overrides;
}

/** A link inside a folder the module is read from is an error; elsewhere in the repository it is no concern. */
function refuseLinks(skipped, manifest) {
  const roots = [manifest.source?.docs, manifest.source?.static?.dir, manifest.source?.static?.command && dirname(manifest.source.static.command[1])]
    .filter(Boolean)
    .map((root) => (root === "." ? "" : root));
  const bad = skipped.filter((path) => roots.some((root) => root === "" || path === root || path.startsWith(`${root}/`)));
  if (bad.length) throw new Error(`links are not allowed in a module: ${bad.join(", ")}`);
}

/** Gets one module's files and builds them if needed. Returns the built module's folder and where it came from. */
async function prepare({ id, source }, override) {
  const bundleDir = join(WORK, "bundles", id);

  if (override) {
    const manifest = await readJson(join(override, "b3pay-module.json"));
    if (!("source" in manifest)) return { dir: override, from: { kind: "override", folder: override } };
    const errors = checkManifest(manifest, { where: `${override}/b3pay-module.json`, id, form: "source" });
    if (errors.length) throw new Error(errors.join("\n"));
    const built = await buildModule({ sourceDir: override, manifest, outDir: bundleDir, origin: { repository: SELF }, local: true });
    return { dir: bundleDir, from: { kind: "override", folder: override }, warnings: built.warnings };
  }

  if ("path" in source) {
    const sourceDir = join(ROOT, source.path);
    const manifest = await readJson(join(sourceDir, "b3pay-module.json"));
    const errors = checkManifest(manifest, { where: `${source.path}/b3pay-module.json`, id, form: "source" });
    if (errors.length) throw new Error(errors.join("\n"));
    const origin = { repository: SELF, path: source.path };
    if (/^[0-9a-f]{40}$/.test(process.env.VERCEL_GIT_COMMIT_SHA ?? "")) origin.commit = process.env.VERCEL_GIT_COMMIT_SHA;
    const built = await buildModule({ sourceDir, manifest, outDir: bundleDir, origin, local: true });
    return { dir: bundleDir, from: { kind: "local", repository: SELF, path: source.path }, warnings: built.warnings };
  }

  if ("commit" in source) {
    const { commit, entries } = await fetchArchive(source.repo, source.commit, { cacheDir: join(WORK, "cache") });
    const sourceDir = join(WORK, "sources", id);
    await rm(sourceDir, { recursive: true, force: true });
    const { skipped } = await unpack(entries, sourceDir);
    const where = source.manifest ?? `${source.repo}@${commit.slice(0, 7)}:b3pay-module.json`;
    const manifestFile = source.manifest ? join(ROOT, source.manifest) : join(sourceDir, "b3pay-module.json");
    if (!existsSync(manifestFile)) throw new Error(`${where}: no manifest`);
    const manifest = await readJson(manifestFile);
    const errors = checkManifest(manifest, { where, id, form: "source" });
    if (errors.length) throw new Error(errors.join("\n"));
    refuseLinks(skipped, manifest);
    const built = await buildModule({ sourceDir, manifest, outDir: bundleDir, origin: { repository: source.repo, commit } });
    return { dir: bundleDir, from: { kind: "commit", repository: source.repo, commit }, warnings: built.warnings };
  }

  const ref = source.pin ?? `refs/heads/${source.branch}`;
  const { commit, entries } = await fetchArchive(source.repo, ref, { cacheDir: join(WORK, "cache") });
  await rm(bundleDir, { recursive: true, force: true });
  const { skipped } = await unpack(entries, bundleDir);
  if (skipped.length) throw new Error(`links are not allowed in a module: ${skipped.join(", ")}`);
  return {
    dir: bundleDir,
    from: { kind: "published", repository: source.repo, branch: source.branch, commit, ...(source.pin ? { pinned: true } : {}) },
  };
}

/** Where a module's home is served: a page, or a static file (a folder's index.html is served at the folder). */
function homeHref(id, home) {
  if (home === "index") return `/docs/${id}/`;
  if (home.endsWith(".html")) return `/docs/${id}/${home.replace(/(^|\/)index\.html$/, "$1")}`;
  return `/docs/${id}/${home}/`;
}

async function main() {
  const overrides = parseOverrides(process.argv.slice(2));
  const registry = await readJson(join(ROOT, "modules/registry.json"));
  const problems = checkRegistry(registry);
  for (const { id } of registry.modules ?? []) if (RESERVED.includes(id)) problems.push(`modules/registry.json: "${id}" is reserved`);
  // A repository can try its module before the registry lists it: that is
  // how it publishes for the first time, before the site serves it.
  const entries = [...(registry.modules ?? [])];
  for (const id of overrides.keys()) {
    if (RESERVED.includes(id)) problems.push(`--module ${id}: "${id}" is reserved`);
    else if (!entries.some((entry) => entry.id === id)) entries.push({ id, source: { preview: true } });
  }
  if (problems.length) throw new Error(problems.join("\n"));

  const prepared = [];
  for (const entry of entries) {
    try {
      const result = await prepare(entry, overrides.get(entry.id));
      const checked = await checkModule(result.dir, { id: entry.id });
      for (const warning of [...(result.warnings ?? []), ...checked.warnings]) console.warn(`modules  warning  ${warning}`);
      problems.push(...checked.errors);
      prepared.push({ entry, ...result, manifest: checked.manifest, pages: checked.pages });
      console.log(`modules  ${entry.id.padEnd(14)} ${describe(result.from)}  ${checked.pages.length} pages`);
    } catch (error) {
      problems.push(`module ${entry.id}: ${error.message}`);
    }
  }
  if (problems.length) throw new Error(problems.join("\n"));

  // Replace what the last run wrote, and nothing else.
  const previous = existsSync(STATE) ? await readJson(STATE) : [];
  for (const id of new Set([...previous, ...prepared.map(({ entry }) => entry.id)])) {
    await rm(join(CONTENT, id), { recursive: true, force: true });
    await rm(join(PUBLIC, id), { recursive: true, force: true });
  }
  for (const { entry, dir } of prepared) {
    if (existsSync(join(dir, "docs"))) await cp(join(dir, "docs"), join(CONTENT, entry.id), { recursive: true });
    if (existsSync(join(dir, "static"))) await cp(join(dir, "static"), join(PUBLIC, entry.id), { recursive: true });
  }
  await mkdir(WORK, { recursive: true });
  await writeFile(STATE, `${JSON.stringify(prepared.map(({ entry }) => entry.id))}\n`);

  const ordered = GROUPS.flatMap((group) => prepared.filter(({ manifest }) => manifest.group === group));
  const navigation = ordered.map(({ entry, manifest }) => ({
    id: entry.id,
    title: manifest.title,
    description: manifest.description,
    group: manifest.group,
    status: manifest.status,
    links: manifest.links ?? {},
    href: homeHref(entry.id, manifest.home),
    // A module of static pages only has no sidebar: the site links to its home.
    static: !manifest.sidebar,
    sidebar: manifest.sidebar ? toStarlight(manifest.sidebar, entry.id) : null,
  }));
  await mkdir(dirname(NAVIGATION), { recursive: true });
  await writeFile(NAVIGATION, `${JSON.stringify({ modules: navigation }, null, 2)}\n`);

  const record = ordered.map(({ entry, manifest, from }) => ({
    id: entry.id,
    title: manifest.title,
    href: `https://b3pay.net${homeHref(entry.id, manifest.home)}`,
    source: from.kind === "override" ? { kind: "override" } : from,
    origin: manifest.origin ?? null,
  }));
  await mkdir(dirname(RECORD), { recursive: true });
  await writeFile(RECORD, `${JSON.stringify({ modules: record }, null, 2)}\n`);
}

function describe(from) {
  if (from.kind === "local") return `${from.path} (this repository)`;
  if (from.kind === "override") return `${from.folder} (override)`;
  if (from.kind === "commit") return `${from.repository}@${from.commit.slice(0, 7)} (pinned commit)`;
  return `${from.repository}:${from.branch}@${from.commit.slice(0, 7)}${from.pinned ? " (pinned)" : ""}`;
}

main().catch((error) => {
  console.error(`\nmodules  FAILED\n\n${error.message}\n`);
  process.exit(1);
});
