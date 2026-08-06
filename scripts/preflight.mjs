/**
 * Reports what the build can actually see before it starts.
 *
 * A CI build that runs from the wrong directory fails several steps later with
 * something unrelated — `npm error No workspaces found: --workspace=apps/web`
 * says nothing about the cause. This says it directly.
 */
import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const cwd = process.cwd();
const entries = readdirSync(cwd, { withFileTypes: true })
  .filter((e) => !e.name.startsWith("."))
  .map((e) => e.name + (e.isDirectory() ? "/" : ""))
  .sort();

console.log(`preflight  node ${process.version}  cwd ${cwd}`);
console.log(`preflight  contents: ${entries.join(" ")}`);

const required = ["package.json", "apps/web/package.json", "packages/ui/package.json"];
const missing = required.filter((f) => !existsSync(join(cwd, f)));

if (missing.length) {
  console.error(
    [
      "",
      `preflight  FAILED — missing: ${missing.join(", ")}`,
      "",
      "  The build is not running from the repository root. On Vercel this is",
      "  almost always the Root Directory setting:",
      "",
      "    Project → Settings → Build and Deployment → Root Directory",
      "",
      "  It must be empty (the repository root). vercel.json supplies the build",
      "  command and output directory relative to it.",
      "",
    ].join("\n"),
  );
  process.exit(1);
}

console.log("preflight  ok — workspace root found");
