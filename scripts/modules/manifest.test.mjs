import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { checkManifest, checkRegistry } from "./manifest.mjs";

const valid = () => ({
  schema: 1,
  id: "example",
  title: "Example",
  description: "An example module.",
  group: "evm",
  status: "active",
  links: { repository: "https://github.com/B3Pay/example" },
  editUrl: "https://github.com/B3Pay/example/edit/main/docs/{path}",
  source: { docs: "docs" },
  sidebar: [{ label: "Overview", page: "index" }, "guides/reads", { label: "More", items: [{ label: "Site", link: "https://b3pay.net/" }] }],
});

const problems = (manifest, options = {}) => checkManifest(manifest, { where: "m", form: "source", ...options });

test("a complete source manifest passes", () => {
  assert.deepEqual(problems(valid()), []);
});

test("the manifests in this repository pass", () => {
  for (const file of ["clear-signing/b3pay-module.json", "b3forge/b3pay-module.json", "b3wallet/b3pay-module.json", "hosted/ic-reactor.json", "hosted/meant.json", "hosted/b3note.json"]) {
    const manifest = JSON.parse(readFileSync(new URL(`../../modules/${file}`, import.meta.url), "utf8"));
    assert.deepEqual(problems(manifest), [], file);
  }
  assert.deepEqual(checkRegistry(JSON.parse(readFileSync(new URL("../../modules/registry.json", import.meta.url), "utf8"))), []);
});

test("unknown fields, and fields of the other form, are refused", () => {
  assert.match(problems({ ...valid(), slug: "x" }).join(), /unknown field "slug"/);
  assert.match(problems({ ...valid(), origin: { repository: "a/b" } }).join(), /unknown field "origin"/);
  const { source, ...bundle } = valid();
  assert.match(checkManifest({ ...bundle, source }, { where: "m", form: "bundle" }).join(), /unknown field "source"/);
});

test("the id is an address segment and must match the registry", () => {
  for (const id of ["A", "x", "-x", "x-", "has space", "../x", "a".repeat(41)]) assert.notDeepEqual(problems({ ...valid(), id }), [], id);
  assert.match(problems(valid(), { id: "other" }).join(), /registry calls this module "other"/);
});

test("links and the edit URL are https, and group and status come from their lists", () => {
  assert.match(problems({ ...valid(), links: { repository: "javascript:alert(1)" } }).join(), /links.repository: an https URL/);
  assert.match(problems({ ...valid(), links: { homepage: "https://x" } }).join(), /unknown field "homepage"/);
  assert.match(problems({ ...valid(), editUrl: "https://github.com/x" }).join(), /editUrl/);
  assert.match(problems({ ...valid(), group: "solana" }).join(), /group/);
  assert.match(problems({ ...valid(), status: "stable" }).join(), /status/);
});

test("sidebar items are pages, links, folders or groups, three deep at most", () => {
  assert.deepEqual(problems({ ...valid(), sidebar: [{ label: "Functions", directory: "libs/functions" }, { label: "Types", directory: "libs/types", collapsed: true }] }), []);
  assert.match(problems({ ...valid(), sidebar: [{ label: "x", directory: "libs/Functions" }] }).join(), /not a folder of pages/);
  assert.match(problems({ ...valid(), sidebar: [{ label: "x", directory: "libs", page: "libs" }] }).join(), /exactly one/);
  assert.match(problems({ ...valid(), sidebar: [{ label: "x", directory: "libs", collapsed: "yes" }] }).join(), /collapsed: true or false/);
  assert.match(problems({ ...valid(), sidebar: [{ label: "x", directory: "libs", sort: "name" }] }).join(), /unknown field "sort"/);
  assert.match(problems({ ...valid(), sidebar: [] }).join(), /non-empty/);
  assert.match(problems({ ...valid(), sidebar: ["Guides/Reads"] }).join(), /not a page path/);
  assert.match(problems({ ...valid(), sidebar: [{ label: "x", page: "a", link: "https://x" }] }).join(), /exactly one/);
  assert.match(problems({ ...valid(), sidebar: [{ label: "x", link: "http://x" }] }).join(), /https URL, or a path inside/);
  assert.match(problems({ ...valid(), sidebar: [{ label: "x", link: "../other/" }] }).join(), /https URL, or a path inside/);
  const nest = (depth) => (depth === 0 ? ["index"] : [{ label: `level ${depth}`, items: nest(depth - 1) }]);
  assert.deepEqual(problems({ ...valid(), sidebar: nest(3) }), []);
  assert.match(problems({ ...valid(), sidebar: nest(4) }).join(), /deeper than three/);
});

test("source paths stay inside the repository", () => {
  for (const docs of ["/etc", "../docs", "docs/../..", "docs\\x", "./docs"]) assert.match(problems({ ...valid(), source: { docs } }).join(), /source.docs/, docs);
  assert.match(problems({ ...valid(), source: { docs: "docs", rename: { "a.md": "../b.md" } } }).join(), /leaves the folder/);
  assert.match(problems({ ...valid(), source: { linkBase: "v4" } }).join(), /linkBase/);
});

test("a static command is node, a script in the repository, and {out} once", () => {
  const command = (value) => problems({ ...valid(), source: { static: { command: value } } }).join();
  assert.equal(command(["node", "website/build.mjs", "--out", "{out}"]), "");
  assert.match(command(["bash", "-c", "rm -rf / {out}"]), /static.command/);
  assert.match(command(["node", "build.mjs"]), /static.command/);
  assert.match(command(["node", "/usr/bin/x.mjs", "{out}"]), /a file inside the repository/);
  assert.match(command(["node", "../x.mjs", "{out}"]), /a file inside the repository/);
  assert.match(problems({ ...valid(), source: { static: { dir: "site", command: ["node", "x.mjs", "{out}"] } } }).join(), /exactly one/);
});

test("registry entries come in three forms", () => {
  const registry = (source) => checkRegistry({ modules: [{ id: "example", source }] });
  const commit = "0123456789abcdef0123456789abcdef01234567";
  assert.deepEqual(registry({ path: "modules/example" }), []);
  assert.deepEqual(registry({ repo: "B3Pay/example", commit, manifest: "modules/hosted/example.json" }), []);
  assert.deepEqual(registry({ repo: "B3Pay/example", branch: "b3pay-site" }), []);
  assert.deepEqual(registry({ repo: "B3Pay/example", branch: "b3pay-site", pin: commit }), []);
  assert.match(registry({ repo: "B3Pay/example", commit: "main" }).join(), /40-character/);
  assert.match(registry({ repo: "B3Pay/example", branch: "b3pay-site", pin: "abc" }).join(), /40-character/);
  assert.match(registry({ repo: "not a repo", branch: "b3pay-site" }).join(), /owner\/name/);
  assert.match(registry({ url: "https://x" }).join(), /needs "path", "commit" or "branch"/);
  assert.match(checkRegistry({ modules: [{ id: "x1", source: { path: "a" } }, { id: "x1", source: { path: "b" } }] }).join(), /listed twice/);
});
