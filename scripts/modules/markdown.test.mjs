import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { checkPage, deriveTitle, isSafeUrl, parse, readPage, rewriteLinks } from "./markdown.mjs";

const check = (source, { mdx = true } = {}) => {
  const { data, body, line } = readPage(source, { mdx });
  return checkPage({ data, tree: parse(body, { mdx }), where: "page", line }).join("\n");
};
const page = (body, frontmatter = "title: A page") => `---\n${frontmatter}\n---\n\n${body}\n`;
const components = 'import { Aside, Card, LinkButton, LinkCard } from "@astrojs/starlight/components";\n\n';

test("pages are read with the copies of Sätteri and Astro's frontmatter reader that the build renders with", () => {
  const require = createRequire(import.meta.url);
  const renderer = createRequire(require.resolve("@astrojs/markdown-satteri"));
  assert.equal(fileURLToPath(import.meta.resolve("satteri")), renderer.resolve("satteri"));
  for (const reader of ["astro", "@astrojs/mdx"])
    assert.equal(
      fileURLToPath(import.meta.resolve("@astrojs/internal-helpers/frontmatter")),
      createRequire(require.resolve(reader)).resolve("@astrojs/internal-helpers/frontmatter"),
      reader,
    );
});

test("plain Markdown, HTML that formats text, Starlight components and plain values pass", () => {
  assert.equal(
    check(
      page(`:::note[A title]
Text with a [link](./other.md), [another](https://example.com#part) and <kbd>Ctrl</kbd> + <kbd>C</kbd>, as 3 < 4.
:::

<details><summary>More</summary>

Hidden text.<br>

</details>

<p align="center">Centered</p>

<!-- a comment -->`),
      { mdx: false },
    ),
    "",
  );
  assert.equal(
    check(
      page(`${components}import diagram from "./diagram.png";

<Aside type="note" title={"A note"}>Text with a [link](./other.md).</Aside>

<Card title="x" icon="rocket" data={{ a: [1, -2, "three"], b: true }} />

<LinkCard href="/docs/example/" title="Guide" description="Read it." />

<LinkButton href="https://example.com" icon="external">Go</LinkButton>

<details open><summary>More</summary><kbd>Ctrl</kbd></details>

{/* a comment */}`),
    ),
    "",
  );
});

test("frontmatter is limited to what cannot claim an address or write raw HTML", () => {
  const frontmatter = (fields) => check(page("Text", fields), { mdx: false });
  assert.match(frontmatter("title: A\nslug: /"), /"slug" is not allowed/);
  assert.match(frontmatter("title: A\nhead:\n  - tag: script"), /"head" is not allowed/);
  assert.match(frontmatter("title: A\nbanner:\n  content: <b>x</b>"), /"banner" is not allowed/);
  assert.match(frontmatter("description: no title"), /needs a title/);
  assert.match(frontmatter("title: A\ntemplate: custom"), /template/);
  assert.equal(frontmatter("title: The <Card> component\neditUrl: false\nprev: false\nnext:\n  link: /docs/x/\n  label: Next\nsidebar:\n  label: Cards\n  order: 2\n  badge: New"), "");
});

test("frontmatter that Starlight renders as HTML or as a link is checked as such", () => {
  const frontmatter = (fields) => check(page("Text", fields), { mdx: false });
  assert.match(frontmatter("title: A\nhero:\n  tagline: <img src=x onerror=alert(1)>"), /hero\.tagline is text without "<"/);
  assert.match(frontmatter('title: A\nhero:\n  title: "<img src=x onerror=alert(1)>"'), /hero\.title is text without "<"/);
  assert.match(frontmatter("title: A <img src=x onerror=alert(1)>\nhero:\n  tagline: Fine"), /the title, which is the hero's here, is text without "<"/);
  assert.match(frontmatter("title: A\nhero:\n  image:\n    html: <img src=x onerror=alert(1)>"), /hero\.image takes "file"/);
  assert.match(frontmatter("title: A\nhero:\n  actions:\n    - text: Go\n      link: javascript:alert(1)"), /hero\.actions\[0\]\.link is a path/);
  assert.match(frontmatter("title: A\nhero:\n  actions:\n    - text: Go\n      link: /\n      attrs:\n        onclick: alert(1)"), /hero\.actions\[0\] takes text, link/);
  assert.match(frontmatter("title: A\nhero:\n  actions:\n    - text: Go\n      link: /\n      icon: <svg onload=alert(1)>"), /hero\.actions\[0\]\.icon is the name/);
  assert.match(frontmatter("title: A\nsidebar:\n  attrs:\n    onclick: alert(1)"), /sidebar takes label/);
  assert.match(frontmatter("title: A\nprev:\n  link: javascript:alert(1)"), /prev\.link is a path/);
  assert.match(frontmatter("title: A\neditUrl: javascript:alert(1)"), /editUrl is false, or an https URL/);
});

test("frontmatter is read where Astro reads it, not where it looks like it ends", () => {
  // Astro ends the frontmatter at the first line that starts with "---", so
  // "title: A ---" does not end it and the hero below is frontmatter too.
  const hidden = '---\ntitle: A ---\nhero:\n  tagline: "\\x3cimg src=x onerror=alert(1)\\x3e"\n---\n\nText\n';
  assert.match(check(hidden, { mdx: false }), /hero\.tagline is text without "<"/);
  assert.match(check(hidden), /hero\.tagline is text without "<"/);
  assert.match(check('+++\ntitle = "A"\nslug = "/"\n+++\n\nText\n', { mdx: false }), /"slug" is not allowed/);
  assert.match(check(page("Text\n\n<script>alert(1)</script>"), { mdx: false }), /^page:7: /);
});

test("raw HTML is limited to tags that format text, read as the browser reads them", () => {
  for (const html of [
    "<script>alert(1)</script>",
    '<iframe src="https://x"></iframe>',
    "<form></form>",
    "<style>body{}</style>",
    '<img src="x" onerror="alert(1)">',
    '<a href="javascript:alert(1)">x</a>',
    '<a href="&#106;avascript:alert(1)">x</a>',
    '<div title="x"onclick="alert(1)">x</div>',
    '<div>\n<b/onclick="alert(1)">x</b>\n</div>',
    '<details ontoggle="alert(1)" open>x</details>',
    '<span style="position:fixed;inset:0">x</span>',
    "<starlight-tabs>x</starlight-tabs>",
    '<svg><animate attributeName="href" values="javascript:alert(1)" /></svg>',
    "<!-- x --!> <img src=x onerror=alert(1)> -->",
    '<div title="\n\nx &quot; onmouseover=&quot;alert(1)\n\n</div>',
  ])
    assert.match(check(page(html), { mdx: false }), /the HTML at .* is not allowed/, html);
});

test("links go to pages, or to http, https, mailto and tel addresses", () => {
  for (const link of ["[x](javascript:alert(1))", "[x](&#106;avascript:alert(1))", "<javascript:alert(1)>", "[x][r]\n\n[r]: vbscript:x", "![x](data:text/html,x)", "[x](<java\tscript:alert(1)>)"])
    assert.match(check(page(link), { mdx: false }), /is not an address a page may link to/, link);
  assert.equal(isSafeUrl("/docs/x/"), true);
  assert.equal(isSafeUrl("./other.md#part"), true);
  assert.equal(isSafeUrl("mailto:hello@b3pay.net"), true);
  assert.equal(isSafeUrl(" \u0001JavaScript:alert(1)"), false);
});

test("component props are plain values, with no handlers, no HTML and no script addresses", () => {
  for (const [jsx, problem] of [
    ['<LinkCard href={"javascript:alert(document.domain)"} title="x" />', /is not an address a page may use/],
    ['<LinkCard href={`javascript:alert(1)`} title="x" />', /is not an address a page may use/],
    ['<LinkCard href={"\\u006aavascript:alert(1)"} title="x" />', /is not an address a page may use/],
    ['<LinkCard href="&#106;avascript:alert(1)" title="x" />', /is not an address a page may use/],
    ['<LinkCard href={["javascript:alert(1)"]} title="x" />', /is not an address a page may use/],
    ['<LinkButton href="/" ping="javascript:alert(1)">x</LinkButton>', /is not an address a page may use/],
    ['<LinkCard href="/" title="a &lt;img src=x onerror=alert(1)&gt;" />', /may not contain "<"/],
    ['<LinkCard href="/" title={"<img src=x onerror=alert(1)>"} />', /may not contain "<"/],
    ['<Card title="x" set:html="<img src=x onerror=alert(1)>" />', /the attribute "set:html" is not allowed/],
    ['<Card title="x" style="position:fixed" />', /the attribute "style" is not allowed/],
    ['<Card title="x" data={{ onclick: "alert(1)" }} />', /the key "onclick" is not allowed/],
    ['<a href="https://example.com">x</a>', /<a> is not allowed/],
    ["<starlight-tabs>x</starlight-tabs>", /<starlight-tabs> is not allowed/],
    ["<Card.constructor />", /<Card\.constructor> is not a component the page imports/],
    ["<MDXContent />", /<MDXContent> is not a component the page imports/],
    ['<b onClick="alert(1)">x</b>', /<b onClick> is not allowed/],
    ['<b title={"x"}>x</b>', /<b title> is not allowed/],
  ])
    assert.match(check(page(components + jsx)), problem, jsx);
});

test("MDX runs no code: no other imports, exports, spreads or computed expressions", () => {
  assert.match(check(page('import fs from "node:fs";')), /may not import "node:fs"/);
  assert.match(check(page('import X from "../../src/components/site/ContactForm.astro";')), /may not import/);
  assert.match(check(page('import { Image } from "astro:assets";')), /may not import "astro:assets"/);
  assert.match(check(page('import * as S from "@astrojs/starlight/components";')), /may not import "@astrojs\/starlight\/components"/);
  assert.match(check(page("export const x = 1;")), /only imports/);
  assert.match(check(page("{process.env.SECRET}")), /plain value/);
  assert.match(check(page("{(() => 1)()}")), /plain value/);
  assert.match(check(page("{`${1}`}")), /plain value/);
  assert.match(check(page("{1), alert((1)}")), /plain value/);
  assert.match(check(page(`${components}<Card {...{ title: "x" }} />`)), /spread/);
  assert.match(check(page(`${components}<Card title={globalThis.x} />`)), /plain value/);
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
