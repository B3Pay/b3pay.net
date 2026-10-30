/** File helpers shared by the module scripts. Paths they return use forward slashes. */
import { lstat, readdir } from "node:fs/promises";
import { join } from "node:path";

/**
 * Every file under `root`, as paths relative to it. A link is reported, never
 * followed: a module is plain files, so the caller decides whether a link is
 * an error.
 */
export async function listFiles(root) {
  const files = [];
  const links = [];
  async function visit(dir, prefix) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isSymbolicLink()) links.push(path);
      else if (entry.isDirectory()) await visit(join(dir, entry.name), path);
      else if (entry.isFile()) files.push(path);
    }
  }
  try {
    if (!(await lstat(root)).isDirectory()) return { files, links };
  } catch {
    return { files, links };
  }
  await visit(root, "");
  return { files: files.sort(), links };
}

/** `*` within a segment, `**` across segments, `?` one character. */
export function globToRegExp(glob) {
  let pattern = "";
  for (let i = 0; i < glob.length; i++) {
    const char = glob[i];
    if (char === "*" && glob[i + 1] === "*") {
      const slash = glob[i + 2] === "/";
      pattern += slash ? "(?:.*/)?" : ".*";
      i += slash ? 2 : 1;
    } else if (char === "*") pattern += "[^/]*";
    else if (char === "?") pattern += "[^/]";
    else pattern += char.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  }
  return new RegExp(`^${pattern}$`);
}

export const matchesAny = (path, globs) => globs.some((glob) => globToRegExp(glob).test(path));

/** `guides/reads.mdx` -> `guides/reads`; `examples/index.mdx` -> `examples`; `index.md` -> `index`. */
export function pagePathOf(file) {
  const bare = file.replace(/\.mdx?$/, "");
  if (bare === "index") return "index";
  return bare.endsWith("/index") ? bare.slice(0, -"/index".length) : bare;
}

/** The URL a module's page is served at. */
export const pageUrl = (id, page) => (page === "index" ? `/docs/${id}/` : `/docs/${id}/${page}/`);
