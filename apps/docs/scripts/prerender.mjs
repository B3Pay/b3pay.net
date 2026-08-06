/**
 * Turns the client build into one static document per documentation page.
 *
 * Same shape as apps/web/scripts/prerender.mjs: render each route with
 * react-dom/server, swap the <head> metadata block, write
 * `dist-docs/<route>/index.html`. Vercel serves the file for a matching path and
 * falls through to the SPA rewrite in vercel.json for anything else.
 *
 * It matters more here than on the marketing site. Documentation is read by
 * search engines and by whatever is answering developers' questions this year,
 * and a page whose content only exists after a React bundle boots is a page
 * those readers see as empty.
 *
 * Run by `npm run build:docs` after `vite build` and `vite build --ssr`.
 */
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const APP = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(APP, "..", "..", "dist-docs");

const { render, ALL_ROUTES, OG_IMAGE, SITE_NAME, SITE_URL } = await import(
  join(APP, "dist-ssr/entry-server.js")
);

const SEO_START = "<!--seo-->";
const SEO_END = "<!--/seo-->";
const ROOT_OPEN = '<div id="root">';
const CRITICAL_FONTS = ["space-grotesk-latin-600-normal", "inter-latin-400-normal"];

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function head({ title, description, url, indexable }) {
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
    indexable ? "" : `<meta name="robots" content="noindex,follow" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="B3Pay — infrastructure for apps that hold their own keys." />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
  ]
    .filter(Boolean)
    .join("\n    ");
}

async function preloadTags() {
  const assets = await readdir(join(DIST, "assets"));
  return CRITICAL_FONTS.map((name) => {
    const file = assets.find((f) => f.startsWith(name) && f.endsWith(".woff2"));
    if (!file) {
      console.warn(`  ! critical font not found in dist-docs/assets: ${name}`);
      return "";
    }
    return `<link rel="preload" as="font" type="font/woff2" crossorigin="anonymous" href="/assets/${file}" />`;
  })
    .filter(Boolean)
    .join("\n    ");
}

let shell = await readFile(join(DIST, "index.html"), "utf8");
shell = shell.replace("<head>", `<head>\n    ${await preloadTags()}`);

const seoStart = shell.indexOf(SEO_START);
const seoEnd = shell.indexOf(SEO_END);
const rootOpen = shell.indexOf(ROOT_OPEN);
if (seoStart < 0 || seoEnd < 0 || rootOpen < 0) {
  throw new Error("index.html is missing the <!--seo--> block or the #root container");
}

const beforeSeo = shell.slice(0, seoStart + SEO_START.length);
const betweenSeoAndRoot = shell.slice(seoEnd, rootOpen + ROOT_OPEN.length);
const afterRoot = shell.slice(rootOpen + ROOT_OPEN.length);

for (const r of ALL_ROUTES) {
  const document =
    beforeSeo +
    "\n    " +
    head({
      title: r.title,
      description: r.description,
      url: SITE_URL + r.path,
      indexable: r.inSitemap,
    }) +
    "\n    " +
    betweenSeoAndRoot +
    render(r.path) +
    afterRoot;

  const file = r.path === "/" ? join(DIST, "index.html") : join(DIST, r.path.slice(1), "index.html");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, document);
  console.log(
    `  ${r.path.padEnd(32)} ${(document.length / 1024).toFixed(1)} kB${r.inSitemap ? "" : "  (noindex)"}`,
  );
}

const indexed = ALL_ROUTES.filter((r) => r.inSitemap);
const urls = indexed.map((r) => `  <url><loc>${SITE_URL}${r.path}</loc></url>`).join("\n");
await writeFile(
  join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
console.log(
  `  sitemap.xml                      ${indexed.length} urls (${ALL_ROUTES.length - indexed.length} drafts withheld)`,
);

// Vercel resolves its Output Directory from the project's Root Directory, and
// reports a miss without saying where it looked. State the absolute path so the
// build log answers that on its own.
const top = (await readdir(DIST)).sort().join(" ");
console.log(`\noutput  ${DIST}`);
console.log(`output  cwd was ${process.cwd()}`);
console.log(`output  contains: ${top}`);
