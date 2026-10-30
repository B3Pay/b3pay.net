#!/usr/bin/env node
/**
 * Builds and checks one module from a repository's files: the step a
 * repository's publish workflow runs before it pushes the module to its
 * `b3pay-site` branch (.github/workflows/publish-module.yml).
 *
 *   node scripts/modules/build-module.mjs --source <repository folder> --out <folder>
 *       [--manifest <file>]        default: <source>/b3pay-module.json
 *       [--repository owner/name]  default: $GITHUB_REPOSITORY
 *       [--commit <sha>]           default: $GITHUB_SHA
 *
 * The repository and commit become the module's `origin`, which the site
 * records in /modules.json. A local preview with neither has no origin.
 *
 * Exits 1, with every problem listed, when the manifest or the built module
 * breaks a rule; the site would refuse the same module.
 */
import { readFile } from "node:fs/promises";
import { isAbsolute, join, relative, resolve } from "node:path";
import { buildModule } from "./build.mjs";
import { checkModule } from "./check.mjs";
import { listFiles } from "./files.mjs";
import { checkManifest } from "./manifest.mjs";

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i];
    const value = argv[i + 1];
    if (!["--source", "--out", "--manifest", "--repository", "--commit"].includes(key) || value === undefined)
      throw new Error(`unexpected argument "${key}". Usage: build-module.mjs --source <folder> --out <folder> [--manifest <file>] [--repository owner/name] [--commit <sha>]`);
    args[key.slice(2)] = value;
  }
  if (!args.source || !args.out) throw new Error("--source and --out are required");
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const sourceDir = resolve(args.source);
  const outDir = resolve(args.out);
  const manifestFile = resolve(args.manifest ?? join(sourceDir, "b3pay-module.json"));
  const manifest = JSON.parse(await readFile(manifestFile, "utf8"));

  const where = relative(process.cwd(), manifestFile) || manifestFile;
  const problems = checkManifest(manifest, { where, form: "source" });
  if (problems.length) throw new Error(problems.join("\n"));

  // The build empties --out first, so it may not hold anything the module is read from.
  const holds = (outer, inner) => {
    const path = relative(outer, inner);
    return path === "" || (!path.startsWith("..") && !isAbsolute(path));
  };
  const readFrom = [manifest.source?.docs, manifest.source?.static?.dir].filter(Boolean).map((folder) => join(sourceDir, folder));
  if (holds(outDir, sourceDir) || readFrom.some((folder) => holds(folder, outDir)))
    throw new Error("--out must be a new folder, not the repository, one of its parents, or a folder the module is read from");

  // Links in the folders a module is read from are refused, wherever they point.
  for (const folder of [manifest.source?.docs, manifest.source?.static?.dir].filter(Boolean)) {
    const { links } = await listFiles(join(sourceDir, folder));
    if (links.length) throw new Error(`${folder}: links are not allowed in a module (${links.join(", ")})`);
  }

  const repository = args.repository || process.env.GITHUB_REPOSITORY;
  const commit = args.commit || process.env.GITHUB_SHA;
  const origin = repository ? { repository, ...(commit ? { commit } : {}) } : undefined;
  const built = await buildModule({ sourceDir, manifest, outDir, origin, local: true });
  const checked = await checkModule(outDir, { id: manifest.id });

  for (const warning of [...built.warnings, ...checked.warnings]) console.warn(`module  warning  ${warning}`);
  if (checked.errors.length) throw new Error(checked.errors.join("\n"));
  const statics = (await listFiles(join(outDir, "static"))).files.length;
  console.log(`module  ${manifest.id}: ${checked.pages.length} pages, ${statics} static files, in ${relative(process.cwd(), outDir) || outDir}`);
}

main().catch((error) => {
  console.error(`\nmodule  FAILED\n\n${error.message}\n`);
  process.exit(1);
});
