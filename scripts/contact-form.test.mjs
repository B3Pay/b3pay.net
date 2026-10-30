import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("the contact form offers exactly the topics the endpoint accepts", () => {
  const form = /const TOPICS = \[([\s\S]*?)\];/.exec(read("src/components/site/ContactForm.astro"))[1];
  const endpoint = /const TOPICS = \[([\s\S]*?)\] as const;/.exec(read("api/contact.ts"))[1];
  const offered = [...form.matchAll(/label: "([^"]+)"/g)].map((match) => match[1]);
  const accepted = [...endpoint.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
  assert.ok(offered.length > 1);
  assert.deepEqual(offered, accepted);
  // An unknown topic is filed under the last one.
  assert.equal(accepted.at(-1), "Something else");
});

test("the form posts to the address Vercel serves the endpoint at", () => {
  assert.match(read("src/components/site/ContactForm.astro"), /action="\/api\/contact\/"/);
});
