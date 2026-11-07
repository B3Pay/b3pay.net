import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { checkLinks, isState, keepsStateIn, linksOf } from "./check-links.mjs";
import { createRouter, listPages } from "./vercel-routes.mjs";

test("linksOf reads the attributes of real tags, not text that looks like them", () => {
  const html = `<!doctype html><head>
<meta property="og:image" content="https://b3pay.net/og.png"><link rel="canonical" href="https://b3pay.net/">
<script>const card = '<a href="/in-a-script/">';</script><!-- <a href="/in-a-comment/"> -->
</head><body>
<div class="copy" data-code="<button onClick={() => go()}>  <a href=&quot;/in-code/&quot;>x</a>"><button>Copy</button></div>
<a href="/docs/?a=1&amp;b=2#top">Docs</a><img src="/logo.png" srcset="/logo.png 1x, /logo@2x.png 2x" alt="">
<form action="/api/contact/" method="post"></form><a href='mailto:hi@b3pay.net'>Mail</a>
</body>`;
  assert.deepEqual(
    linksOf(html).map((link) => link.value),
    ["https://b3pay.net/og.png", "https://b3pay.net/", "/docs/?a=1&b=2#top", "/logo.png", "/logo.png", "/logo@2x.png", "/api/contact/", "mailto:hi@b3pay.net"],
  );
});

test("checkLinks reports broken links, links through a redirect, and missing fragments", async () => {
  const dist = await mkdtemp(join(tmpdir(), "dist-"));
  const files = {
    "index.html": `<a href="/about/">ok</a><a href="/about/#team">has id</a><a href="/about/#nobody">no id</a>
<a href="/about">redirects</a><a href="/missing/">broken</a><a href="https://example.com/x">external</a>
<a href="https://b3pay.net/logo.png">absolute ok</a><form action="/api/contact/"></form><a href="#top" id="top">self</a>`,
    "about/index.html": '<h2 id="team">Team</h2>',
    "logo.png": "png",
    "404.html": '<link rel="canonical" href="https://b3pay.net/404/">',
  };
  for (const [path, content] of Object.entries(files)) {
    await mkdir(dirname(join(dist, path)), { recursive: true });
    await writeFile(join(dist, path), content);
  }
  const router = createRouter({ config: { trailingSlash: true }, dist, functions: new Set(["/api/contact"]) });
  const { problems, internal, external } = checkLinks({ router, pages: listPages(dist) });
  assert.deepEqual([...problems.keys()], [
    '/about/#nobody (a href): https://b3pay.net/about/ has no element with id "nobody"',
    "/about (a href) redirects to https://b3pay.net/about/; link there instead",
    "/missing/ (a href) is broken (HTTP 404)",
  ]);
  assert.equal(internal, 8);
  assert.equal(external, 1);
});

test("a fragment of name=value pairs is state only on a page that says it keeps its state there", async () => {
  assert.equal(isState("chain=8453&tx=0xab"), true);
  assert.equal(isState("chain=1"), true);
  assert.equal(isState("team"), false);
  assert.equal(isState("a=b=c"), false);
  assert.equal(keepsStateIn('<div class="pg" data-fragment-state>'), true);
  assert.equal(keepsStateIn('<p>data-fragment-state is an attribute</p>'), false);

  const dist = await mkdtemp(join(tmpdir(), "dist-"));
  const files = {
    "index.html": `<a href="/play/#chain=8453&amp;tx=0xab">state</a><a href="/play/#nobody">no id</a>
<a href="/about/#chain=1">not a page with state</a>`,
    "play/index.html": '<div data-fragment-state><a href="#chain=1&amp;tx=0xcd">example</a></div>',
    "about/index.html": "<h1>About</h1>",
  };
  for (const [path, content] of Object.entries(files)) {
    await mkdir(dirname(join(dist, path)), { recursive: true });
    await writeFile(join(dist, path), content);
  }
  const router = createRouter({ config: { trailingSlash: true }, dist, functions: new Set() });
  const { problems } = checkLinks({ router, pages: listPages(dist) });
  assert.deepEqual([...problems.keys()], [
    '/play/#nobody (a href): https://b3pay.net/play/ has no element with id "nobody"',
    '/about/#chain=1 (a href): https://b3pay.net/about/ has no element with id "chain=1"',
  ]);
});
