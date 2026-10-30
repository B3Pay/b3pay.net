import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { gunzipSync, gzipSync } from "node:zlib";
import { archiveUrl, unpack } from "./archive.mjs";
import { readTar } from "./tar.mjs";

const COMMIT = "0123456789abcdef0123456789abcdef01234567";

/** One ustar header block. */
function header(name, { size = 0, type = "0", link = "" } = {}) {
  const block = Buffer.alloc(512);
  block.write(name, 0, 100);
  block.write("0000644\0", 100);
  block.write("0000000\0", 108);
  block.write("0000000\0", 116);
  block.write(`${size.toString(8).padStart(11, "0")}\0`, 124);
  block.write("00000000000\0", 136);
  block.fill(0x20, 148, 156);
  block.write(type, 156);
  block.write(link, 157, 100);
  block.write("ustar\0", 257);
  block.write("00", 263);
  let sum = 0;
  for (const byte of block) sum += byte;
  block.write(`${sum.toString(8).padStart(6, "0")}\0 `, 148);
  return block;
}

const padded = (data) => Buffer.concat([data, Buffer.alloc((512 - (data.length % 512)) % 512)]);

function paxBody(records) {
  return Buffer.from(
    Object.entries(records)
      .map(([key, value]) => {
        const rest = ` ${key}=${value}\n`;
        let length = rest.length + String(rest.length).length;
        if (String(length).length + rest.length !== length) length = String(length).length + rest.length;
        return `${length}${rest}`;
      })
      .join(""),
  );
}

/** A .tar.gz shaped like GitHub's: a pax global header naming the commit, then the entries. */
function archive(entries, commit = COMMIT) {
  const blocks = [];
  const global = paxBody({ comment: commit });
  blocks.push(header("pax_global_header", { size: global.length, type: "g" }), padded(global));
  for (const entry of entries) {
    const data = Buffer.from(entry.data ?? "");
    blocks.push(header(entry.path, { size: entry.type === "2" ? 0 : data.length, type: entry.type ?? "0", link: entry.link }));
    if (entry.type !== "2" && entry.type !== "5") blocks.push(padded(data));
  }
  blocks.push(Buffer.alloc(1024));
  return gzipSync(Buffer.concat(blocks));
}

test("readTar reads the commit from the pax global header, and the entries", () => {
  const { global, entries } = readTar(
    archive([
      { path: "repo-abc/", type: "5" },
      { path: "repo-abc/docs/index.md", data: "# Hello\n" },
      { path: "repo-abc/docs/link.md", type: "2", link: "../../etc/passwd" },
    ]),
  );
  assert.equal(global.comment, COMMIT);
  assert.deepEqual(
    entries.map(({ path, type }) => [path, type]),
    [
      ["repo-abc/", "5"],
      ["repo-abc/docs/index.md", "0"],
      ["repo-abc/docs/link.md", "2"],
    ],
  );
  assert.equal(entries[1].data.toString(), "# Hello\n");
});

test("readTar refuses a header whose checksum does not match", () => {
  const tar = gunzipSync(archive([{ path: "repo/a.md", data: "a" }]));
  assert.doesNotThrow(() => readTar(gzipSync(tar)));
  // Blocks: the global header, its body, then the entry's header.
  tar[512 * 2 + 10] ^= 0xff;
  assert.throws(() => readTar(gzipSync(tar)), /checksum mismatch/);
});

test("unpack writes files without the archive's top folder", async () => {
  const dest = await mkdtemp(join(tmpdir(), "unpack-"));
  const { entries } = readTar(archive([{ path: "repo-abc/docs/index.md", data: "# Hi\n" }]));
  const { files, skipped } = await unpack(entries, dest);
  assert.equal(files, 1);
  assert.deepEqual(skipped, []);
  assert.equal(await readFile(join(dest, "docs/index.md"), "utf8"), "# Hi\n");
});

test("unpack never creates a link, and reports it", async () => {
  const dest = await mkdtemp(join(tmpdir(), "unpack-"));
  const { entries } = readTar(archive([{ path: "repo-abc/docs/link.md", type: "2", link: "/etc/passwd" }]));
  const { skipped } = await unpack(entries, dest);
  assert.deepEqual(skipped, ["docs/link.md"]);
  assert.equal(existsSync(join(dest, "docs/link.md")), false);
});

test("unpack refuses an entry that leaves its folder", async () => {
  for (const path of ["repo-abc/../escape.md", "repo-abc/docs/../../escape.md", "repo-abc/./x.md"]) {
    const dest = await mkdtemp(join(tmpdir(), "unpack-"));
    const { entries } = readTar(archive([{ path, data: "x" }]));
    await assert.rejects(unpack(entries, dest), /leaves its folder/, path);
    assert.deepEqual(await readdir(dest), [], path);
  }
});

test("archiveUrl takes owner/name and a full commit or a branch ref, nothing else", () => {
  assert.equal(archiveUrl("B3Pay/Meant", COMMIT), `https://codeload.github.com/B3Pay/Meant/tar.gz/${COMMIT}`);
  assert.equal(archiveUrl("B3Pay/Meant", "refs/heads/b3pay-site", "t"), "https://api.github.com/repos/B3Pay/Meant/tarball/refs/heads/b3pay-site");
  assert.throws(() => archiveUrl("B3Pay/Meant/../x", COMMIT), /owner\/name/);
  assert.throws(() => archiveUrl("B3Pay/Meant", "main"), /neither/);
  assert.throws(() => archiveUrl("B3Pay/Meant", "refs/heads/a b"), /neither/);
  assert.throws(() => archiveUrl("B3Pay/Meant", "abc123"), /neither/);
});
