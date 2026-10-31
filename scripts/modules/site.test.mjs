import { test } from "node:test";
import assert from "node:assert/strict";
import { indexForSearch, toStarlight } from "./site.mjs";

test("toStarlight puts every sidebar item at its address on the site, and a folder's pages in Starlight's own list", () => {
  assert.deepEqual(
    toStarlight(
      [
        "index",
        { label: "Reads", page: "guides/reads" },
        { label: "Repository", link: "https://github.com/B3Pay/example" },
        { label: "Playground", link: "play/" },
        { label: "Functions", directory: "libs/functions" },
        { label: "More", collapsed: true, items: [{ label: "Types", directory: "libs/types", collapsed: true }] },
      ],
      "example",
    ),
    [
      { slug: "docs/example" },
      { label: "Reads", slug: "docs/example/guides/reads" },
      { label: "Repository", link: "https://github.com/B3Pay/example" },
      { label: "Playground", link: "/docs/example/play/" },
      { label: "Functions", collapsed: false, items: [{ autogenerate: { directory: "docs/example/libs/functions" } }] },
      { label: "More", collapsed: true, items: [{ label: "Types", collapsed: true, items: [{ autogenerate: { directory: "docs/example/libs/types" } }] }] },
    ],
  );
});

test("toStarlight lists a folder named index as that folder, not the whole module", () => {
  assert.deepEqual(toStarlight([{ label: "Index", directory: "index" }], "example"), [
    { label: "Index", collapsed: false, items: [{ autogenerate: { directory: "docs/example/index" } }] },
  ]);
});

test("indexForSearch marks a static page's main, or its body when it has none, once", () => {
  const page = (body) => `<!doctype html><html><head><title>A</title></head>${body}</html>`;
  assert.equal(indexForSearch(page('<body><nav>Menu</nav><main id="main">Text</main></body>')), page('<body><nav>Menu</nav><main data-pagefind-body id="main">Text</main></body>'));
  assert.equal(indexForSearch(page("<body class=x><p>Text</p></body>")), page("<body data-pagefind-body class=x><p>Text</p></body>"));
  assert.equal(indexForSearch(page("<BODY><MAIN>Text</MAIN></BODY>")), page("<BODY><MAIN data-pagefind-body>Text</MAIN></BODY>"));
  const marked = page("<body><main data-pagefind-body>Text</main></body>");
  assert.equal(indexForSearch(marked), marked);
  assert.equal(indexForSearch(indexForSearch(page("<body><main>Text</main></body>"))), page("<body><main data-pagefind-body>Text</main></body>"));
});

test("indexForSearch finds the real tag, not one in a comment, a script or a longer name", () => {
  const html = '<body><!-- <main> --><script>const t = "<main>";</script><mainframe></mainframe><main>Text</main></body>';
  assert.equal(indexForSearch(html), '<body><!-- <main> --><script>const t = "<main>";</script><mainframe></mainframe><main data-pagefind-body>Text</main></body>');
  assert.equal(indexForSearch("<p>No body or main</p>"), "<p>No body or main</p>");
});

test("indexForSearch leaves a page alone only when one of its elements has data-pagefind-body", () => {
  const mentions = [
    ["<body><!-- Add data-pagefind-body here --><main>Text</main></body>", "<body><!-- Add data-pagefind-body here --><main data-pagefind-body>Text</main></body>"],
    ['<body><script>const a = " data-pagefind-body";</script><main>Text</main></body>', '<body><script>const a = " data-pagefind-body";</script><main data-pagefind-body>Text</main></body>'],
    ["<body><main><code>&lt;main data-pagefind-body&gt;</code></main></body>", "<body><main data-pagefind-body><code>&lt;main data-pagefind-body&gt;</code></main></body>"],
    ['<body><main title="a data-pagefind-body example">Text</main></body>', '<body><main data-pagefind-body title="a data-pagefind-body example">Text</main></body>'],
  ];
  for (const [html, marked] of mentions) assert.equal(indexForSearch(html), marked);
  for (const marked of [
    "<body><nav>Menu</nav><article data-pagefind-body>Text</article><main>More</main></body>",
    '<body><main data-pagefind-body="">Text</main></body>',
    "<BODY><MAIN DATA-PAGEFIND-BODY>Text</MAIN></BODY>",
  ])
    assert.equal(indexForSearch(marked), marked);
});
