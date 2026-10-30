/**
 * Building a module: from a repository's files and its manifest to the folder
 * the site serves, which is also what a repository publishes.
 *
 *   b3pay-module.json   the manifest, without `source`, with `origin`
 *   docs/               pages (.md, .mdx) and the images beside them
 *   static/             files served unchanged
 *
 * The repository's own publish workflow runs this, and so does the site for a
 * module it builds from a pinned commit. The same code either way means a
 * module looks the same whichever route it takes.
 */
import { spawnSync } from "node:child_process";
import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, posix } from "node:path";
import { listFiles, matchesAny, pagePathOf, pageUrl } from "./files.mjs";
import { deriveTitle, joinFrontmatter, parse, rewriteLinks, splitFrontmatter } from "./markdown.mjs";

const PAGE = /\.mdx?$/;
export const SCHEMA_URL = "https://b3pay.net/schemas/b3pay-module.schema.json";
const IMAGE = /\.(png|jpe?g|gif|svg|webp|avif)$/i;

function pointerGet(object, pointer) {
  const keys = pointer.split("/").slice(1).map((key) => key.replace(/~1/g, "/").replace(/~0/g, "~"));
  let parent = null;
  let key = null;
  let value = object;
  for (key of keys) {
    parent = value;
    if (parent === null || typeof parent !== "object" || !(key in parent)) return { found: false };
    value = parent[key];
  }
  return { found: true, parent, key, value };
}

/**
 * Changes a JSON file the static build reads, value by value. Each change
 * names the value it expects to find, so a moved pin that changed the file
 * fails here instead of editing the wrong thing.
 */
async function applyEdits(sourceDir, edits) {
  for (const edit of edits ?? []) {
    const file = join(sourceDir, edit.file);
    const json = JSON.parse(await readFile(file, "utf8"));
    for (const change of edit.replace) {
      const at = pointerGet(json, change.pointer);
      if (!at.found || JSON.stringify(at.value) !== JSON.stringify(change.from))
        throw new Error(`${edit.file}${change.pointer}: expected ${JSON.stringify(change.from)}, found ${at.found ? JSON.stringify(at.value) : "nothing"}`);
      at.parent[at.key] = change.to;
    }
    await writeFile(file, `${JSON.stringify(json, null, 2)}\n`);
  }
}

/**
 * Runs the module's static build with Node and nothing else from the site's
 * environment: the build of a module never sees the site's secrets.
 */
function runStaticCommand(sourceDir, command, out) {
  const [, ...args] = command.map((arg) => (arg === "{out}" ? out : arg));
  const result = spawnSync(process.execPath, args, {
    cwd: sourceDir,
    env: { PATH: process.env.PATH ?? "", NODE_ENV: "production", LANG: "C.UTF-8" },
    encoding: "utf8",
    timeout: 5 * 60 * 1000,
  });
  if (result.status !== 0)
    throw new Error(`static build "${command.join(" ")}" failed (${result.status ?? result.signal}):\n${(result.stderr || result.stdout || "").trim()}`);
}

/** Pages are served at <path>/, and a link to one without the slash costs a redirect. */
export const withSlash = (url) =>
  url.replace(/^([^#?]*)(.*)$/s, (_, path, rest) => (path.endsWith("/") || /\.\w+$/.test(path.split("/").pop()) ? path : `${path}/`) + rest);

/**
 * @param {object} options
 * @param {string} options.sourceDir  the repository's files
 * @param {object} options.manifest   its manifest (source form, already checked)
 * @param {string} options.outDir     where the module is written; emptied first
 * @param {{ repository: string, commit?: string, path?: string }} options.origin
 * @param {boolean} [options.local]   files belong to this repository: never edit them
 */
export async function buildModule({ sourceDir, manifest, outDir, origin, local = false }) {
  const { source = {}, ...rest } = manifest;
  const id = manifest.id;
  const warnings = [];
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  // Pages and the images beside them.
  const pages = new Map(); // source file -> target file
  if (source.docs) {
    const docsDir = join(sourceDir, source.docs);
    if (!existsSync(docsDir)) throw new Error(`${source.docs}: no such folder`);
    const { files, links } = await listFiles(docsDir);
    if (links.length) throw new Error(`${source.docs}: links are not allowed (${links.join(", ")})`);
    for (const file of files) {
      if (!matchesAny(file, source.include ?? ["**/*"])) continue;
      if (matchesAny(file, source.exclude ?? [])) continue;
      if (!PAGE.test(file) && !IMAGE.test(file)) {
        warnings.push(`${source.docs}/${file}: not a page or an image, left out`);
        continue;
      }
      pages.set(file, source.rename?.[file] ?? file);
    }
    for (const from of Object.keys(source.rename ?? {}))
      if (!pages.has(from)) throw new Error(`source.rename: "${from}" is not one of the module's files`);

    const byTarget = new Map([...pages.values()].map((target) => [target, true]));
    if (byTarget.size !== pages.size) throw new Error("source.rename: two files end up at the same path");
    const pageOfSource = new Map(
      [...pages].filter(([file]) => PAGE.test(file)).map(([file, target]) => [file, pagePathOf(target)]),
    );

    for (const [file, target] of pages) {
      const destination = join(outDir, "docs", target);
      await mkdir(dirname(destination), { recursive: true });
      if (!PAGE.test(file)) {
        await copyFile(join(docsDir, file), destination);
        continue;
      }
      const mdx = file.endsWith(".mdx");
      const raw = await readFile(join(docsDir, file), "utf8");
      let { data, body } = splitFrontmatter(raw);

      // The module's links to itself, written for wherever its pages were
      // served before, point at /docs/<id>/ here.
      const map = (url) => {
        if (source.linkBase && url.startsWith(source.linkBase)) return withSlash(pageUrl(id, "index") + url.slice(source.linkBase.length));
        const relative = /^(?![a-z][a-z0-9+.-]*:|\/|#)([^#?]+\.mdx?)([#?].*)?$/i.exec(url);
        if (relative) {
          const resolved = posix.normalize(posix.join(posix.dirname(file), relative[1]));
          const page = pageOfSource.get(resolved);
          if (page) return pageUrl(id, page) + (relative[2] ?? "");
        }
        return undefined;
      };
      body = rewriteLinks(body, parse(body, { mdx }), map);
      for (const holder of [data.prev, data.next, ...(data.hero?.actions ?? [])])
        if (holder && typeof holder.link === "string") holder.link = map(holder.link) ?? holder.link;

      if (typeof data.title !== "string") {
        const derived = deriveTitle(body, parse(body, { mdx }));
        if (derived.title) {
          data = { title: derived.title, ...(derived.description ? { description: derived.description } : {}), ...data };
          body = derived.body;
        }
      }
      if (data.editUrl !== false && manifest.editUrl)
        data.editUrl = manifest.editUrl.replace("{path}", file);
      await writeFile(destination, joinFrontmatter(data, body));
    }
  }

  // Static pages: copied, or built by the module's own script.
  const staticOut = join(outDir, "static");
  if (source.static?.dir) {
    const staticDir = join(sourceDir, source.static.dir);
    const { files, links } = await listFiles(staticDir);
    if (links.length) throw new Error(`${source.static.dir}: links are not allowed (${links.join(", ")})`);
    if (files.length === 0) throw new Error(`${source.static.dir}: no files`);
    for (const file of files) {
      await mkdir(dirname(join(staticOut, file)), { recursive: true });
      await copyFile(join(staticDir, file), join(staticOut, file));
    }
  } else if (source.static?.command) {
    if (local && source.static.edits?.length) throw new Error("source.static.edits: only for a module built from another repository");
    await applyEdits(sourceDir, source.static.edits);
    runStaticCommand(sourceDir, source.static.command, staticOut);
  }
  // Hidden files are host settings (`.nojekyll` for GitHub Pages), which mean
  // nothing here and which the site does not serve.
  for (const file of (await listFiles(staticOut)).files)
    if (file.split("/").some((part) => part.startsWith("."))) {
      await rm(join(staticOut, file));
      warnings.push(`static/${file}: hidden file, left out`);
    }

  const hasIndexPage = [...pages.values()].some((target) => PAGE.test(target) && pagePathOf(target) === "index");
  const out = {
    ...rest,
    // A built module travels without this repository, so it names the schema by its URL.
    $schema: SCHEMA_URL,
    home: rest.home ?? (hasIndexPage ? "index" : existsSync(join(staticOut, "index.html")) ? "index.html" : undefined),
    origin,
  };
  if (out.home === undefined) delete out.home;
  await writeFile(join(outDir, "b3pay-module.json"), `${JSON.stringify(out, null, 2)}\n`);
  return { manifest: out, warnings };
}
