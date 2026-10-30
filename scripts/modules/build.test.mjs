import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SCHEMA_URL, buildModule, withSlash } from "./build.mjs";
import { checkModule } from "./check.mjs";

const COMMIT = "0123456789abcdef0123456789abcdef01234567";
const BUILD_MODULE = join(dirname(fileURLToPath(import.meta.url)), "build-module.mjs");

const manifest = (source, extra = {}) => ({
  schema: 1,
  id: "example",
  title: "Example",
  description: "An example module.",
  group: "internet-computer",
  status: "maintained",
  editUrl: "https://github.com/B3Pay/example/edit/main/docs/{path}",
  source,
  ...extra,
});

/** A repository folder with the given files, inside a temporary folder of its own (so its parent is never the system's). */
async function repository(files) {
  const root = join(await mkdtemp(join(tmpdir(), "module-repo-")), "repo");
  for (const [path, content] of Object.entries(files)) {
    await mkdir(dirname(join(root, path)), { recursive: true });
    await writeFile(join(root, path), content);
  }
  return root;
}

const outFolder = async () => join(await mkdtemp(join(tmpdir(), "module-out-")), "module");

test("withSlash adds the trailing slash pages are served with, and only to pages", () => {
  assert.equal(withSlash("/docs/x/guides/reads"), "/docs/x/guides/reads/");
  assert.equal(withSlash("/docs/x/guides/reads#part"), "/docs/x/guides/reads/#part");
  assert.equal(withSlash("/docs/x/"), "/docs/x/");
  assert.equal(withSlash("/docs/x/logo.png"), "/docs/x/logo.png");
});

test("a module builds from a repository's files, its links pointed at its addresses on the site", async () => {
  const repo = await repository({
    "docs/index.md": "# Example\n\nAn example module.\n\nRead [the guide](./guides/reads.md#first), and [the old address](/v4/guides/reads).\n",
    "docs/guides/reads.md": "---\ntitle: Reads\n---\n\nBack to [the start](../index.md).\n",
    "docs/notes.txt": "not a page",
  });
  const out = await outFolder();
  const sidebar = [{ label: "Overview", page: "index" }, { label: "Reads", page: "guides/reads" }];
  const built = await buildModule({
    sourceDir: repo,
    manifest: manifest({ docs: "docs", linkBase: "/v4/" }, { sidebar }),
    outDir: out,
    origin: { repository: "B3Pay/example", commit: COMMIT },
  });
  assert.deepEqual(built.warnings, ["docs/notes.txt: not a page or an image, left out"]);

  const bundle = JSON.parse(await readFile(join(out, "b3pay-module.json"), "utf8"));
  assert.equal(bundle.$schema, SCHEMA_URL);
  assert.deepEqual(bundle.origin, { repository: "B3Pay/example", commit: COMMIT });
  assert.equal(bundle.home, "index");
  assert.equal("source" in bundle, false);

  const index = await readFile(join(out, "docs/index.md"), "utf8");
  assert.match(index, /^---\ntitle: Example\ndescription: An example module\.\neditUrl: https:\/\/github\.com\/B3Pay\/example\/edit\/main\/docs\/index\.md\n---/);
  assert.match(index, /\(\/docs\/example\/guides\/reads\/#first\)/);
  assert.match(index, /\(\/docs\/example\/guides\/reads\/\)/);
  assert.doesNotMatch(index, /^# Example/m);
  assert.match(await readFile(join(out, "docs/guides/reads.md"), "utf8"), /\(\/docs\/example\/\)/);

  const checked = await checkModule(out, { id: "example" });
  assert.deepEqual(checked.errors, []);
  assert.deepEqual(checked.pages.sort(), ["guides/reads", "index"]);
});

test("static pages are copied as they are, without hidden files", async () => {
  const repo = await repository({ "site/index.html": "<!doctype html><title>x</title>", "site/.nojekyll": "", "site/assets/app.css": "body{}" });
  const out = await outFolder();
  const built = await buildModule({ sourceDir: repo, manifest: manifest({ static: { dir: "site" } }), outDir: out, origin: { repository: "B3Pay/example" } });
  assert.deepEqual(built.warnings, ["static/.nojekyll: hidden file, left out"]);
  assert.equal(existsSync(join(out, "static/assets/app.css")), true);
  assert.equal(existsSync(join(out, "static/.nojekyll")), false);
  const checked = await checkModule(out, { id: "example" });
  assert.deepEqual(checked.errors, []);
  assert.equal(JSON.parse(await readFile(join(out, "b3pay-module.json"), "utf8")).home, "index.html");
});

test("checkModule refuses what breaks the rules, every problem at once", async () => {
  const dir = await repository({
    "b3pay-module.json": JSON.stringify({ ...manifest(undefined, { sidebar: ["index", "missing"], origin: { repository: "B3Pay/example" } }), source: undefined }),
    "docs/index.md": "---\ntitle: Home\n---\n\n<script>alert(1)</script>\n",
    "docs/Upper.md": "---\ntitle: Upper\n---\n",
    "docs/_partial.md": "---\ntitle: Partial\n---\n",
    "static/tool.exe": "MZ",
    "extra.txt": "outside",
  });
  await symlink("/etc/passwd", join(dir, "docs/passwd.md"));
  const { errors } = await checkModule(dir, { id: "example" });
  const all = errors.join("\n");
  assert.match(all, /docs\/index\.md:\d+: scripts, frames, forms and event handlers are not allowed/);
  assert.match(all, /docs\/Upper\.md: a page's path is lowercase/);
  assert.match(all, /docs\/_partial\.md: names are letters/);
  assert.match(all, /static\/tool\.exe: not a file type the site serves/);
  assert.match(all, /extra\.txt is outside docs\/ and static\//);
  assert.match(all, /docs\/passwd\.md is a link/);
  assert.match(all, /the sidebar names "missing", which is not a page/);
});

test("checkModule refuses a module whose manifest names another id", async () => {
  const dir = await repository({
    "b3pay-module.json": JSON.stringify({ ...manifest(undefined, { id: "other", home: "index.html" }), source: undefined }),
    "static/index.html": "<!doctype html>",
  });
  assert.match((await checkModule(dir, { id: "example" })).errors.join(), /registry calls this module "example"/);
});

test("build-module refuses an output folder it would empty over its own input", async () => {
  const repo = await repository({ "b3pay-module.json": JSON.stringify(manifest({ docs: "docs" }, { sidebar: ["index"] })), "docs/index.md": "# Hi\n" });
  for (const out of [repo, dirname(repo), join(repo, "docs"), join(repo, "docs/built")]) {
    const result = spawnSync(process.execPath, [BUILD_MODULE, "--source", repo, "--out", out], { encoding: "utf8" });
    assert.equal(result.status, 1, out);
    assert.match(result.stderr, /--out must be a new folder/, out);
  }
  assert.equal(await readFile(join(repo, "docs/index.md"), "utf8"), "# Hi\n");

  const out = await outFolder();
  const result = spawnSync(process.execPath, [BUILD_MODULE, "--source", repo, "--out", out, "--repository", "B3Pay/example", "--commit", COMMIT], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /module {2}example: 1 pages, 0 static files/);
});
