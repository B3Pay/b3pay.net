/**
 * Interaction smoke test against the built documentation site.
 *
 *     node scripts/serve-dist.mjs 4181 dist-docs &
 *     node scripts/smoke-docs.mjs
 *
 * Covers what a build cannot prove on its own: the ⌘K palette, sidebar
 * navigation without a page load, anchor scrolling inside the shell's own
 * scroll container, the on-this-page rail tracking the reading position, the
 * prev/next pager, and the mobile drawer.
 *
 * The scroll cases are the ones worth having. `.b3-shell__main` scrolls, not the
 * document, so every default the browser gives a normal page — hash offsets,
 * scroll restoration, IntersectionObserver against the viewport — is wrong here
 * and had to be re-established by hand.
 */
import puppeteer from "puppeteer-core";

const BASE = process.env.BASE || "http://localhost:4181";
const CHROME =
  process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

let failures = 0;
const check = (name, ok, detail = "") => {
  console.log(`${ok ? "  ok  " : "  FAIL"} ${name}${detail ? "  — " + detail : ""}`);
  if (!ok) failures++;
};
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu"],
});

async function newPage(width = 1440, height = 900) {
  const page = await browser.newPage();
  await page.setViewport({ width, height });
  return page;
}

// ── The document arrives with its content ───────────────────────────
{
  const page = await newPage();
  await page.setJavaScriptEnabled(false);
  await page.goto(`${BASE}/ic-reactor/quickstart`, { waitUntil: "domcontentloaded" });
  check(
    "prose is in the document without JavaScript",
    await page.evaluate(() => /defineReactor/.test(document.body.innerText)),
  );
  check(
    "the sidebar is in the document without JavaScript",
    await page.evaluate(() => document.querySelectorAll(".docs-nav__link").length >= 10),
  );
  await page.close();
}

// ── ⌘K palette ──────────────────────────────────────────────────────
{
  const page = await newPage();
  await page.goto(`${BASE}/ic-reactor/quickstart`, { waitUntil: "networkidle0" });

  await page.keyboard.down("Meta");
  await page.keyboard.press("k");
  await page.keyboard.up("Meta");
  await wait(300);

  const dialog = '[role="dialog"][aria-label="Command palette"]';
  check("⌘K opens the command palette", await page.evaluate((d) => !!document.querySelector(d), dialog));
  check(
    "headings of the current page are offered",
    await page.evaluate(() => /On this page/i.test(document.body.innerText)),
  );

  await page.keyboard.type("Dynamic Candid");
  await wait(250);
  await page.keyboard.press("Enter");
  await wait(400);
  check(
    "palette navigates across the project",
    new URL(page.url()).pathname === "/ic-reactor/candid",
    page.url(),
  );
  await page.close();
}

// ── Sidebar routes on the client ────────────────────────────────────
{
  const page = await newPage();
  await page.goto(`${BASE}/ic-reactor/why`, { waitUntil: "networkidle0" });

  // Tag the window; a full page load would clear it.
  await page.evaluate(() => (window.__stayed = true));
  await page.evaluate(() => {
    const link = [...document.querySelectorAll(".docs-nav__link")].find(
      (a) => a.getAttribute("href") === "/ic-reactor/api",
    );
    link.click();
  });
  await wait(400);

  check("sidebar navigates without a page load", await page.evaluate(() => window.__stayed === true));
  check("the URL updated", new URL(page.url()).pathname === "/ic-reactor/api", page.url());
  check(
    "the new page is marked current in the sidebar",
    await page.evaluate(
      () =>
        document.querySelector('.docs-nav__link[aria-current="page"]')?.getAttribute("href") ===
        "/ic-reactor/api",
    ),
  );
  check(
    "the scroll container reset to the top",
    await page.evaluate(() => document.querySelector(".b3-shell__main").scrollTop === 0),
  );
  await page.close();
}

// ── Anchors scroll inside the shell, clear of the bar ───────────────
{
  const page = await newPage();
  await page.goto(`${BASE}/ic-reactor/quickstart#what-you-get`, { waitUntil: "networkidle0" });
  await wait(600);

  const top = await page.evaluate(() => {
    const el = document.getElementById("what-you-get");
    return el.getBoundingClientRect().top;
  });
  // The bar is 52px. Anything above it is hidden; far below it means no scroll
  // happened at all.
  check("a deep link scrolls its heading into view below the bar", top > 52 && top < 260, `top ${Math.round(top)}px`);
  await page.close();
}

// ── The on-this-page rail follows the reading position ──────────────
{
  const page = await newPage();
  await page.goto(`${BASE}/ic-reactor/quickstart`, { waitUntil: "networkidle0" });
  await wait(400);

  const activeAt = async (scrollTop) => {
    await page.evaluate((y) => (document.querySelector(".b3-shell__main").scrollTop = y), scrollTop);
    await wait(500);
    return page.evaluate(
      () => document.querySelector(".docs-toc__link[data-active]")?.textContent?.trim() ?? null,
    );
  };

  const first = await activeAt(0);
  check("the rail starts on the first heading", first === "Fastest path: defineReactor", String(first));

  const deep = await activeAt(2600);
  check("the rail advances as the page scrolls", deep !== null && deep !== first, String(deep));
  await page.close();
}

// ── Prev / next pager ───────────────────────────────────────────────
{
  const page = await newPage();
  await page.goto(`${BASE}/ic-reactor/install`, { waitUntil: "networkidle0" });

  const hrefs = await page.evaluate(() =>
    [...document.querySelectorAll(".docs-pager a")].map((a) => a.getAttribute("href")),
  );
  check(
    "the pager carries real hrefs in sidebar order",
    hrefs.join(",") === "/ic-reactor/why,/ic-reactor/quickstart",
    hrefs.join(", "),
  );

  await page.evaluate(() => (window.__stayed = true));
  await page.evaluate(() => document.querySelectorAll(".docs-pager a")[1].click());
  await wait(400);
  check(
    "the pager routes on the client",
    (await page.evaluate(() => window.__stayed === true)) &&
      new URL(page.url()).pathname === "/ic-reactor/quickstart",
  );
  await page.close();
}

// ── Draft pages say so ──────────────────────────────────────────────
{
  const page = await newPage();
  await page.goto(`${BASE}/b3forge/nodes`, { waitUntil: "networkidle0" });
  check(
    "an outline page is labelled in the body",
    await page.evaluate(() => /Outline — not yet written/.test(document.body.innerText)),
  );
  check(
    "an outline page is labelled in the sidebar",
    await page.evaluate(() =>
      [...document.querySelectorAll(".docs-nav__badge")].some((b) => b.textContent === "draft"),
    ),
  );
  check(
    "an outline page is noindexed",
    await page.evaluate(
      () => document.querySelector('meta[name="robots"]')?.content === "noindex,follow",
    ),
  );
  await page.close();
}

// ── Mobile ──────────────────────────────────────────────────────────
{
  const page = await newPage(390, 844);
  await page.goto(`${BASE}/ic-reactor/quickstart`, { waitUntil: "networkidle0" });

  check(
    "the sidebar is hidden at 390px",
    await page.evaluate(
      () => getComputedStyle(document.querySelector(".b3-shell__aside")).display === "none",
    ),
  );
  check(
    "the menu button is shown at 390px",
    await page.evaluate(
      () => getComputedStyle(document.querySelector(".docs-bar__menu")).display !== "none",
    ),
  );
  check(
    "search is still reachable at 390px",
    await page.evaluate(
      () => getComputedStyle(document.querySelector(".docs-bar__searchicon")).display !== "none",
    ),
  );
  check(
    "nothing scrolls horizontally at 390px",
    await page.evaluate(() => {
      const main = document.querySelector(".b3-shell__main");
      return (
        document.documentElement.scrollWidth <= window.innerWidth + 1 &&
        main.scrollWidth <= main.clientWidth + 1
      );
    }),
    await page.evaluate(() => {
      const main = document.querySelector(".b3-shell__main");
      return `doc ${document.documentElement.scrollWidth}, main ${main.scrollWidth}/${main.clientWidth}`;
    }),
  );

  await page.click(".docs-bar__menu");
  await wait(350);
  check(
    "the nav drawer opens",
    await page.evaluate(() => !!document.querySelector('aside[role="dialog"]')),
  );
  await page.keyboard.press("Escape");
  await wait(350);
  check(
    "Escape closes the drawer",
    await page.evaluate(() => !document.querySelector('aside[role="dialog"]')),
  );
  await page.close();
}

await browser.close();
console.log(failures ? `\n${failures} failure(s)` : "\nall checks passed");
process.exit(failures ? 1 : 0);
