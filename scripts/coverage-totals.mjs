#!/usr/bin/env node
/**
 * The Clear Signing coverage report's counts, worked out again from its
 * protocol list: the totals, each chain, each category and each protocol
 * (src/components/coverage/totals.ts does the counting).
 *
 *     node scripts/coverage-totals.mjs [report.json]           say where the counts disagree
 *     node scripts/coverage-totals.mjs --write [report.json]   write the counts the list gives
 *
 * The report is src/data/clear-signing-coverage.json unless named. Without
 * --write it changes nothing and exits 1 when any count disagrees; the page
 * does not build until they agree, and `npm test` checks the same.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { disagreements, withTotals } from "../src/components/coverage/totals.ts";

const ROOT = join(fileURLToPath(import.meta.url), "..", "..");
export const REPORT = join(ROOT, "src/data/clear-signing-coverage.json");

function main(argv) {
  const write = argv.includes("--write");
  const file = argv.find((arg) => !arg.startsWith("--")) ?? REPORT;
  const shown = relative(process.cwd(), file) || file;
  const report = JSON.parse(readFileSync(file, "utf8"));

  if (write) {
    const before = disagreements(report);
    writeFileSync(file, `${JSON.stringify(withTotals(report), null, 2)}\n`);
    console.log(`coverage  ${shown}: ${before.length ? `${before.length} counts rewritten from the protocol list` : "counts already agreed; file rewritten as they were"}`);
    return;
  }

  const problems = disagreements(report);
  if (problems.length) {
    const counted = problems.length === 1 ? "1 count disagrees" : `${problems.length} counts disagree`;
    console.error(`\ncoverage  ${shown}: ${counted} with the protocol list\n\n  ${problems.join("\n  ")}\n\nRun with --write to replace them with the counts the list gives.\n`);
    process.exit(1);
  }
  const { totals } = report;
  console.log(`coverage  ${shown}: every count agrees (${totals.protocols} protocols, ${totals.contracts} contracts)`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main(process.argv.slice(2));
