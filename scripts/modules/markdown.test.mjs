import { test } from "node:test";
import assert from "node:assert/strict";
import { checkPage, deriveTitle, parse, rewriteLinks, splitFrontmatter } from "./markdown.mjs";

const check = (source, { mdx = true } = {}) => {
  const { data, body } = splitFrontmatter(source);
  return checkPage({ data, tree: parse(body, { mdx }), where: "page" }).join("\n");
};
const page = (body, frontmatter = "title: A page") => `---\n${frontmatter}\n---\n\n${body}\n`;

test("plain Markdown, Starlight components and plain values pass", () => {
  assert.equal(
    check(
      page(`import { Aside, Card } from "@astrojs/starlight/components";
import diagram from "./diagram.png";

<Aside type="note" title={"A note"}>Text with a [link](./other.md).</Aside>

<Card title="x" icon="rocket" data={{ a: [1, -2, "three"], b: true }} />

{/* a comment */}`),
    ),
    "",
  );
});

test("frontmatter is limited to what cannot claim an address or write raw HTML", () => {
  assert.match(check(page("Text", "title: A\nslug: /"), { mdx: false }), /"slug" is not allowed/);
  assert.match(check(page("Text", "title: A\nhead:\n  - tag: script"), { mdx: false }), /"head" is not allowed/);
  assert.match(check(page("Text", "title: A\nbanner:\n  content: <b>x</b>"), { mdx: false }), /"banner" is not allowed/);
  assert.match(check(page("Text", "description: no title"), { mdx: false }), /needs a title/);
  assert.match(check(page("Text", "title: A\ntemplate: custom"), { mdx: false }), /template/);
});

test("scripts, frames, forms, styles and event handlers are refused, in Markdown and in MDX", () => {
  for (const html of ["<script>alert(1)</script>", '<iframe src="https://x"></iframe>', "<form></form>", "<style>body{}</style>", '<img src="x" onerror="alert(1)">', '<a href="javascript:alert(1)">x</a>'])
    assert.match(check(page(html), { mdx: false }), /not allowed/, html);
  assert.match(check(page("<script>{`alert(1)`}</script>")), /<script> is not allowed/);
  assert.match(check(page('<div onClick="alert(1)">x</div>')), /event handler/);
  assert.match(check(page('<a href="javascript:alert(1)">x</a>')), /script URL/);
  assert.match(check(page("[x](javascript:alert(1))"), { mdx: false }), /script URLs/);
});

test("MDX runs no code: no other imports, exports, spreads or computed expressions", () => {
  assert.match(check(page('import fs from "node:fs";')), /may not import "node:fs"/);
  assert.match(check(page('import X from "../../src/components/site/ContactForm.astro";')), /may not import/);
  assert.match(check(page("export const x = 1;")), /only imports/);
  assert.match(check(page("{process.env.SECRET}")), /plain value/);
  assert.match(check(page("{(() => 1)()}")), /plain value/);
  assert.match(check(page("{`${1}`}")), /plain value/);
  assert.match(check(page('<Card {...{ title: "x" }} />')), /spread/);
  assert.match(check(page("<Card title={globalThis.x} />")), /plain value/);
});

test("rewriteLinks maps links outside code and leaves code alone", () => {
  const body = `See [the guide](./guide.md) and [ref][r].

<LinkCard href="./guide.md" title="Guide" />

\`[not](./guide.md)\`

\`\`\`md
[not](./guide.md)
\`\`\`

[r]: ./guide.md#part
`;
  const out = rewriteLinks(body, parse(body, { mdx: true }), (url) => url.replace(/^\.\/guide\.md/, "/docs/x/guide/"));
  assert.match(out, /\[the guide\]\(\/docs\/x\/guide\/\)/);
  assert.match(out, /href="\/docs\/x\/guide\/"/);
  assert.match(out, /\[r\]: \/docs\/x\/guide\/#part/);
  assert.match(out, /`\[not\]\(\.\/guide\.md\)`/);
  assert.match(out, /```md\n\[not\]\(\.\/guide\.md\)\n```/);
});

test("deriveTitle takes the first heading as the title and the first paragraph as the description", () => {
  const body = "<!-- a comment -->\n# How it works\n\nNotes are encrypted in the browser.\n\n## Next\n";
  const derived = deriveTitle(body, parse(body, { mdx: false }));
  assert.equal(derived.title, "How it works");
  assert.equal(derived.description, "Notes are encrypted in the browser.");
  assert.doesNotMatch(derived.body, /# How it works/);
  assert.match(derived.body, /## Next/);
});
