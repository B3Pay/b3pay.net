/**
 * Getting a repository at a commit or a branch, as the tar archive GitHub
 * serves for it.
 *
 * The archive's pax global header names the commit it was made from. A pinned
 * commit is therefore checked, not trusted, and a branch build records exactly
 * which commit it served.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { readTar } from "./tar.mjs";

export const COMMIT = /^[0-9a-f]{40}$/;
const REPO = /^[A-Za-z0-9-]+\/[A-Za-z0-9._-]+$/;
const BRANCH = /^[A-Za-z0-9._/-]+$/;

/**
 * `ref` is a full commit id or `refs/heads/<branch>`. With `GITHUB_TOKEN` set
 * the API endpoint is used, which also reaches private repositories; without
 * it, codeload, which needs no token for public ones.
 */
export function archiveUrl(repo, ref, token) {
  if (!REPO.test(repo)) throw new Error(`"${repo}" is not an owner/name repository`);
  if (!COMMIT.test(ref) && !(ref.startsWith("refs/heads/") && BRANCH.test(ref.slice(11))))
    throw new Error(`"${ref}" is neither a full commit id nor refs/heads/<branch>`);
  return token
    ? `https://api.github.com/repos/${repo}/tarball/${ref}`
    : `https://codeload.github.com/${repo}/tar.gz/${ref}`;
}

async function download(repo, ref, { attempts = 4 } = {}) {
  const token = process.env.GITHUB_TOKEN;
  const url = archiveUrl(repo, ref, token);
  const headers = { "User-Agent": "b3pay.net-modules" };
  if (token) headers.Authorization = `Bearer ${token}`;
  for (let attempt = 1; ; attempt++) {
    try {
      const response = await fetch(url, { headers, redirect: "follow" });
      if (response.status === 404) {
        const error = new Error(
          `${repo} at ${ref}: not found. A private repository needs GITHUB_TOKEN with read access.`,
        );
        error.final = true;
        throw error;
      }
      if (!response.ok) throw new Error(`${repo} at ${ref}: HTTP ${response.status}`);
      return Buffer.from(await response.arrayBuffer());
    } catch (error) {
      if (error.final || attempt >= attempts) throw error;
      const wait = 2 ** attempt * 1000;
      console.warn(`modules  ${error.message}; retrying in ${wait / 1000}s`);
      await sleep(wait);
    }
  }
}

/**
 * Fetches `repo` at `ref` and returns the archive with the commit it holds.
 * Commits are immutable, so an archive fetched by commit id is cached under
 * `cacheDir`; a branch is fetched every time.
 */
export async function fetchArchive(repo, ref, { cacheDir }) {
  const cached = COMMIT.test(ref) && cacheDir ? join(cacheDir, `${repo.replace("/", "--")}--${ref}.tar.gz`) : null;
  let archive = cached && existsSync(cached) ? await readFile(cached) : null;
  if (!archive) {
    archive = await download(repo, ref);
    if (cached) {
      await mkdir(dirname(cached), { recursive: true });
      await writeFile(cached, archive);
    }
  }
  const { global, entries } = readTar(archive);
  const commit = global.comment;
  if (!COMMIT.test(commit ?? "")) throw new Error(`${repo} at ${ref}: the archive does not name its commit`);
  if (COMMIT.test(ref) && commit !== ref)
    throw new Error(`${repo}: asked for ${ref} but the archive holds ${commit}`);
  return { commit, entries };
}

const unsafe = (path) => path.startsWith("/") || path.split("/").some((part) => part === ".." || part === ".");

/**
 * Writes the archive's files under `dest`, without the archive's top folder.
 * Links and special files are never created; their paths are returned, so the
 * caller can refuse one that lies inside a folder a module is read from.
 */
export async function unpack(entries, dest) {
  const skipped = [];
  let files = 0;
  for (const entry of entries) {
    const path = entry.path.split("/").slice(1).join("/").replace(/\/$/, "");
    if (path === "") continue;
    if (unsafe(path)) throw new Error(`archive entry "${entry.path}" leaves its folder`);
    if (entry.type === "5") continue;
    if (entry.type !== "0") {
      skipped.push(path);
      continue;
    }
    const target = join(dest, path);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, entry.data);
    files++;
  }
  return { files, skipped };
}
