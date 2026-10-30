/**
 * The module contract, version 1: what `b3pay-module.json` may say, and what
 * `modules/registry.json` may say. public/schemas/*.schema.json, served at
 * https://b3pay.net/schemas/, describe the same rules for editors; these
 * functions are what the build enforces.
 *
 * Each check returns a list of messages rather than throwing, so one run
 * reports every problem in every module at once.
 */

export const GROUPS = ["evm", "internet-computer"];
export const STATUSES = ["active", "beta", "in-development", "maintained"];

const ID = /^[a-z][a-z0-9-]{0,38}[a-z0-9]$/;
const SEGMENT = /^[a-z0-9][a-z0-9-]*$/;
const COMMIT = /^[0-9a-f]{40}$/;
const REPO = /^[A-Za-z0-9-]+\/[A-Za-z0-9._-]+$/;
const BRANCH = /^[A-Za-z0-9._/-]+$/;

const isObject = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
const isString = (value, min = 1, max = Infinity) =>
  typeof value === "string" && value.trim().length >= min && value.length <= max;

function https(value) {
  if (typeof value !== "string") return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

/** A path inside a folder: relative, forward slashes, no `.` or `..` segments. */
export function relativePath(value) {
  return (
    typeof value === "string" &&
    value !== "" &&
    !value.startsWith("/") &&
    !value.includes("\\") &&
    value.split("/").every((part) => part !== "" && part !== "." && part !== "..")
  );
}

/** A page path: `index`, `guides/reads`. Lowercase segments, so a path is its own URL. */
export const isPagePath = (value) =>
  typeof value === "string" && value.split("/").every((part) => SEGMENT.test(part));

function unknownKeys(object, allowed, where, errors) {
  for (const key of Object.keys(object)) if (!allowed.includes(key)) errors.push(`${where}: unknown field "${key}"`);
}

function checkSidebar(items, where, errors, depth = 0) {
  if (!Array.isArray(items) || items.length === 0) {
    errors.push(`${where}: must be a non-empty list`);
    return;
  }
  if (depth > 3) errors.push(`${where}: nests deeper than three groups`);
  items.forEach((item, index) => {
    const at = `${where}[${index}]`;
    if (typeof item === "string") {
      if (!isPagePath(item)) errors.push(`${at}: "${item}" is not a page path`);
      return;
    }
    if (!isObject(item)) {
      errors.push(`${at}: must be a page path or an object`);
      return;
    }
    if (!isString(item.label, 1, 60)) errors.push(`${at}.label: required, at most 60 characters`);
    const kinds = ["page", "link", "items"].filter((key) => key in item);
    if (kinds.length !== 1) {
      errors.push(`${at}: needs exactly one of "page", "link" or "items"`);
      return;
    }
    if ("page" in item) {
      unknownKeys(item, ["label", "page"], at, errors);
      if (!isPagePath(item.page)) errors.push(`${at}.page: "${item.page}" is not a page path`);
    } else if ("link" in item) {
      unknownKeys(item, ["label", "link"], at, errors);
      if (!https(item.link) && !relativePath(item.link.replace(/\/$/, "")))
        errors.push(`${at}.link: an https URL, or a path inside the module`);
    } else {
      unknownKeys(item, ["label", "items", "collapsed"], at, errors);
      if ("collapsed" in item && typeof item.collapsed !== "boolean")
        errors.push(`${at}.collapsed: true or false`);
      checkSidebar(item.items, `${at}.items`, errors, depth + 1);
    }
  });
}

function checkSource(source, where, errors) {
  if (!isObject(source)) {
    errors.push(`${where}: must be an object`);
    return;
  }
  unknownKeys(source, ["docs", "include", "exclude", "rename", "linkBase", "static"], where, errors);
  if ("docs" in source && !relativePath(source.docs)) errors.push(`${where}.docs: a folder inside the repository`);
  for (const key of ["include", "exclude"])
    if (key in source && (!Array.isArray(source[key]) || !source[key].every((glob) => isString(glob))))
      errors.push(`${where}.${key}: a list of globs`);
  if ("rename" in source) {
    if (!isObject(source.rename)) errors.push(`${where}.rename: an object of file to file`);
    else
      for (const [from, to] of Object.entries(source.rename))
        if (!relativePath(from) || !relativePath(to)) errors.push(`${where}.rename: "${from}" -> "${to}" leaves the folder`);
  }
  if ("linkBase" in source && !(isString(source.linkBase) && /^\/.*\/$/.test(source.linkBase) && source.linkBase !== "/"))
    errors.push(`${where}.linkBase: a path that starts and ends with "/", such as "/v4/"`);
  if ("static" in source) {
    const s = source.static;
    if (!isObject(s)) {
      errors.push(`${where}.static: must be an object`);
      return;
    }
    unknownKeys(s, ["dir", "command", "edits"], `${where}.static`, errors);
    if (("dir" in s) === ("command" in s)) errors.push(`${where}.static: needs exactly one of "dir" or "command"`);
    if ("dir" in s && !relativePath(s.dir)) errors.push(`${where}.static.dir: a folder inside the repository`);
    if ("command" in s) {
      const ok =
        Array.isArray(s.command) &&
        s.command[0] === "node" &&
        s.command.every((arg) => typeof arg === "string") &&
        s.command.filter((arg) => arg === "{out}").length === 1;
      if (!ok) errors.push(`${where}.static.command: ["node", ...arguments] with "{out}" once, where the pages go`);
      else if (!relativePath(s.command[1] ?? "")) errors.push(`${where}.static.command: the script is a file inside the repository`);
    }
    if ("edits" in s) {
      if (!Array.isArray(s.edits)) errors.push(`${where}.static.edits: a list`);
      else
        s.edits.forEach((edit, index) => {
          const at = `${where}.static.edits[${index}]`;
          if (!isObject(edit) || !relativePath(edit.file) || !edit.file.endsWith(".json") || !Array.isArray(edit.replace))
            return errors.push(`${at}: { "file": "<a .json file>", "replace": [...] }`);
          edit.replace.forEach((change, j) => {
            if (!isObject(change) || typeof change.pointer !== "string" || !change.pointer.startsWith("/") || !("from" in change) || !("to" in change))
              errors.push(`${at}.replace[${j}]: { "pointer": "/a/b", "from": <current value>, "to": <new value> }`);
          });
        });
    }
  }
}

/**
 * @param {unknown} manifest
 * @param {{ where: string, id?: string, form: "source" | "bundle" }} options
 *   A source manifest (in a repository, or hosted here for one) may carry
 *   `source`; a built module carries `origin` instead.
 */
export function checkManifest(manifest, { where, id, form }) {
  const errors = [];
  if (!isObject(manifest)) return [`${where}: not a JSON object`];
  const allowed = ["$schema", "schema", "id", "title", "description", "group", "status", "links", "editUrl", "home", "sidebar"];
  unknownKeys(manifest, [...allowed, form === "source" ? "source" : "origin"], where, errors);
  if (manifest.schema !== 1) errors.push(`${where}.schema: must be 1`);
  if (!ID.test(manifest.id ?? "")) errors.push(`${where}.id: lowercase letters, digits and dashes, 2 to 40 characters`);
  else if (id && manifest.id !== id) errors.push(`${where}.id: "${manifest.id}" but the registry calls this module "${id}"`);
  if (!isString(manifest.title, 1, 40)) errors.push(`${where}.title: required, at most 40 characters`);
  if (!isString(manifest.description, 1, 240)) errors.push(`${where}.description: required, at most 240 characters`);
  if (!GROUPS.includes(manifest.group)) errors.push(`${where}.group: one of ${GROUPS.join(", ")}`);
  if (!STATUSES.includes(manifest.status)) errors.push(`${where}.status: one of ${STATUSES.join(", ")}`);
  if ("links" in manifest) {
    if (!isObject(manifest.links)) errors.push(`${where}.links: must be an object`);
    else {
      unknownKeys(manifest.links, ["repository", "package", "app"], `${where}.links`, errors);
      for (const [key, value] of Object.entries(manifest.links))
        if (!https(value)) errors.push(`${where}.links.${key}: an https URL`);
    }
  }
  if ("editUrl" in manifest && !(https(manifest.editUrl) && manifest.editUrl.includes("{path}")))
    errors.push(`${where}.editUrl: an https URL containing {path}`);
  if ("home" in manifest && !(isPagePath(manifest.home) || (relativePath(manifest.home) && manifest.home.endsWith(".html"))))
    errors.push(`${where}.home: a page path, or an .html file of the module's static pages`);
  if ("sidebar" in manifest) checkSidebar(manifest.sidebar, `${where}.sidebar`, errors);
  if (form === "source" && "source" in manifest) checkSource(manifest.source, `${where}.source`, errors);
  if (form === "bundle" && "origin" in manifest) {
    const origin = manifest.origin;
    if (
      !isObject(origin) ||
      !REPO.test(origin.repository ?? "") ||
      !(origin.commit === undefined || COMMIT.test(origin.commit)) ||
      !(origin.path === undefined || relativePath(origin.path))
    )
      errors.push(`${where}.origin: { "repository": "owner/name", "commit"?: "<40 hex>", "path"?: "folder" }`);
  }
  return errors;
}

/**
 * A registry entry names where a module comes from:
 *   { "path": "modules/x" }                        written in this repository
 *   { "repo": "o/n", "commit": "<id>", "manifest"? } built here from the repository at a pinned commit
 *   { "repo": "o/n", "branch": "b3pay-site", "pin"? } published by the repository itself
 */
export function checkRegistry(registry, where = "modules/registry.json") {
  const errors = [];
  if (!isObject(registry) || !Array.isArray(registry.modules)) return [`${where}: { "modules": [...] }`];
  unknownKeys(registry, ["$schema", "modules"], where, errors);
  const seen = new Set();
  registry.modules.forEach((entry, index) => {
    const at = `${where} modules[${index}]`;
    if (!isObject(entry)) return errors.push(`${at}: must be an object`);
    unknownKeys(entry, ["id", "source"], at, errors);
    if (!ID.test(entry.id ?? "")) errors.push(`${at}.id: lowercase letters, digits and dashes`);
    else if (seen.has(entry.id)) errors.push(`${at}.id: "${entry.id}" is listed twice`);
    seen.add(entry.id);
    const source = entry.source;
    if (!isObject(source)) return errors.push(`${at}.source: must be an object`);
    if ("path" in source) {
      unknownKeys(source, ["path"], `${at}.source`, errors);
      if (!relativePath(source.path)) errors.push(`${at}.source.path: a folder in this repository`);
    } else if ("commit" in source) {
      unknownKeys(source, ["repo", "commit", "manifest"], `${at}.source`, errors);
      if (!REPO.test(source.repo ?? "")) errors.push(`${at}.source.repo: owner/name`);
      if (!COMMIT.test(source.commit ?? "")) errors.push(`${at}.source.commit: a full 40-character commit id`);
      if ("manifest" in source && !relativePath(source.manifest)) errors.push(`${at}.source.manifest: a file in this repository`);
    } else if ("branch" in source) {
      unknownKeys(source, ["repo", "branch", "pin"], `${at}.source`, errors);
      if (!REPO.test(source.repo ?? "")) errors.push(`${at}.source.repo: owner/name`);
      if (!BRANCH.test(source.branch ?? "")) errors.push(`${at}.source.branch: a branch name`);
      if ("pin" in source && !COMMIT.test(source.pin)) errors.push(`${at}.source.pin: a full 40-character commit id`);
    } else errors.push(`${at}.source: needs "path", "commit" or "branch"`);
  });
  return errors;
}
