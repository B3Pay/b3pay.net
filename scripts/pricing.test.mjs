/**
 * The Clear Signing pricing page, /clear-signing/pricing/. Its prices live in
 * one place, src/data/clear-signing-pricing.ts, so the page, its plans and its
 * terms cannot disagree, and a price changes by changing that file alone.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { DEPOSIT, PLANS, dollars } from "../src/data/clear-signing-pricing.ts";
import { FOOTER } from "../src/components/site/nav.ts";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const PRICING = "/clear-signing/pricing/";

test("every price is a whole, positive number of US dollars, with the words after it", () => {
  for (const plan of PLANS) {
    assert.ok(plan.prices.length > 0, `${plan.id} has no price`);
    for (const price of plan.prices) {
      assert.ok(Number.isInteger(price.usd) && price.usd > 0, `${plan.id}: ${price.usd} is not a whole, positive number of dollars`);
      assert.match(price.unit, /^\S.*\S$/, `${plan.id}: a price needs the words after it`);
    }
  }
});

test("each plan has its own id and says who it is for, what it includes and its terms", () => {
  const ids = PLANS.map((plan) => plan.id);
  assert.deepEqual(ids, [...new Set(ids)]);
  assert.deepEqual(ids, ["coverage", "fix", "upkeep"]);
  for (const plan of PLANS) {
    for (const field of ["name", "title", "audience", "terms"]) assert.ok(plan[field].trim(), `${plan.id} has no ${field}`);
    assert.ok(plan.includes.length > 0, `${plan.id} includes nothing`);
    for (const line of [plan.audience, plan.terms, ...plan.includes]) assert.match(line, /^[A-Z].*\.$/, `"${line}" is not a sentence`);
  }
});

test("the share due at the start is part of the price, in whole percent", () => {
  assert.ok(DEPOSIT > 0 && DEPOSIT < 1, `${DEPOSIT}: the page says "the rest" is paid when the pull request opens`);
  assert.ok(Number.isInteger(DEPOSIT * 100), `${DEPOSIT} is not a whole percent`);
});

test("dollars are written whole, with a thousands separator", () => {
  assert.equal(dollars(50), "$50");
  assert.equal(dollars(750), "$750");
  assert.equal(dollars(1500), "$1,500");
  assert.equal(dollars(12000), "$12,000");
});

/** Every page and component the site renders, by path from the repository root. */
function sources() {
  return ["src/content/docs", "src/components", "src/pages"].flatMap((dir) =>
    readdirSync(join(ROOT, dir), { recursive: true })
      .filter((file) => /\.(astro|mdx?|ts)$/.test(file))
      .map((file) => join(dir, file)),
  );
}

/** What a file can put on a page: its text without code, MDX and HTML comments. */
const rendered = (text) =>
  text
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");

/** Dollar amounts: "$1,500", "$ 50". */
const AMOUNT = /\$\s?\d[\d,.]*/g;

test("the check for written prices finds one", () => {
  assert.deepEqual(rendered("<p>From $1,500</p> {/* $2 */}").match(AMOUNT), ["$1,500"]);
  assert.equal(rendered("// $2.41B, a TVL\nconst a = `${b}`;").match(AMOUNT), null);
});

test("no page or component writes a price of its own", () => {
  const files = sources();
  assert.ok(files.some((file) => file.endsWith("pricing.mdx")), "the pricing page is not among the files checked");
  const written = files.flatMap((file) =>
    [...rendered(readFileSync(join(ROOT, file), "utf8")).matchAll(AMOUNT)].map((match) => `${file}: ${match[0]}`),
  );
  assert.deepEqual(written, [], "a price belongs in src/data/clear-signing-pricing.ts");
});

test("the Clear Signing page and the footer link the pricing page", () => {
  const page = readFileSync(join(ROOT, "src/content/docs/clear-signing.mdx"), "utf8");
  assert.ok(page.includes(`](${PRICING})`), "the Clear Signing page's text does not link the pricing page");
  assert.ok(page.includes(`link: ${PRICING}`), "the Clear Signing page's hero does not link the pricing page");
  const links = FOOTER.flatMap((column) => column.links.map((link) => link.href));
  assert.ok(links.includes(PRICING), "the footer does not link the pricing page");
});
