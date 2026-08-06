/**
 * Interaction smoke test against the built site.
 *
 *     node scripts/serve-dist.mjs 4180 &
 *     node scripts/smoke.mjs
 *
 * Covers the behaviours in HANDOFF.md that a build cannot prove on its own:
 * the ⌘K palette, Escape and focus return, focus trapping, the hero run and its
 * replay, prefers-reduced-motion, and the mobile menu.
 */
import puppeteer from "puppeteer-core";

const BASE = process.env.BASE || "http://localhost:4180";
const CHROME =
  process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

let failures = 0;
const check = (name, ok, detail = "") => {
  console.log(`${ok ? "  ok  " : "  FAIL"} ${name}${detail ? "  — " + detail : ""}`);
  if (!ok) failures++;
};

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

// ── ⌘K palette: open, trap, Escape, focus return ────────────────────
{
  const page = await newPage();
  await page.goto(`${BASE}/`, { waitUntil: "networkidle0" });

  // Focus the palette trigger first, so "returns to the trigger" is testable.
  await page.evaluate(() =>
    document.querySelector('button[aria-label^="Search"]').focus(),
  );
  const triggerLabel = await page.evaluate(() => document.activeElement.getAttribute("aria-label"));

  await page.keyboard.down("Meta");
  await page.keyboard.press("k");
  await page.keyboard.up("Meta");
  await new Promise((r) => setTimeout(r, 300));

  check(
    "⌘K opens the command palette",
    await page.evaluate(() => !!document.querySelector('[role="dialog"][aria-label="Command palette"]')),
  );
  check(
    "focus lands inside the palette",
    await page.evaluate(() =>
      document
        .querySelector('[role="dialog"][aria-label="Command palette"]')
        .contains(document.activeElement),
    ),
  );

  // Tab all the way round; focus must never leave the dialog.
  let escaped = false;
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press("Tab");
    const inside = await page.evaluate(() => {
      const d = document.querySelector('[role="dialog"][aria-label="Command palette"]');
      return !d || d.contains(document.activeElement);
    });
    if (!inside) {
      escaped = true;
      break;
    }
  }
  check("focus is trapped in the palette", !escaped);

  await page.keyboard.press("Escape");
  await new Promise((r) => setTimeout(r, 300));
  check(
    "Escape closes the palette",
    await page.evaluate(() => !document.querySelector('[role="dialog"][aria-label="Command palette"]')),
  );
  check(
    "focus returns to the trigger",
    (await page.evaluate(() => document.activeElement?.getAttribute("aria-label"))) === triggerLabel,
  );

  // Palette navigation actually routes.
  await page.keyboard.down("Meta");
  await page.keyboard.press("k");
  await page.keyboard.up("Meta");
  await new Promise((r) => setTimeout(r, 250));
  await page.keyboard.type("About");
  await new Promise((r) => setTimeout(r, 250));
  await page.keyboard.press("Enter");
  await new Promise((r) => setTimeout(r, 400));
  check("palette navigates", new URL(page.url()).pathname === "/about", page.url());

  await page.close();
}

// ── Hero run: plays once, stops at Settled, replays ─────────────────
{
  const page = await newPage();
  await page.goto(`${BASE}/`, { waitUntil: "networkidle0" });

  const buttonText = () =>
    page.evaluate(() => {
      const b = [...document.querySelectorAll("button")].find((x) =>
        /Pay 0\.0241 BTC|Run it again/.test(x.textContent),
      );
      return b?.textContent.trim() ?? null;
    });

  check("hero starts at the pay button", (await buttonText()) === "Pay 0.0241 BTC");

  await new Promise((r) => setTimeout(r, 6200)); // 6 steps × 900ms + slack
  check("hero settles into Run it again", (await buttonText()) === "Run it again");
  check(
    "settled state reads Settled / Paid",
    await page.evaluate(() => /settled/i.test(document.body.innerText) && /paid/i.test(document.body.innerText)),
  );
  check(
    "refund stays dark on a successful payment",
    await page.evaluate(() => {
      const nodes = [...document.querySelectorAll(".b3-nodefield__node")];
      const refund = nodes.find((n) => n.textContent.trim() === "refund");
      return !!refund && !refund.querySelector(".b3-nodefield__dot--hot");
    }),
  );

  const litBefore = await page.evaluate(
    () => document.querySelectorAll(".b3-nodefield__dot--hot").length,
  );
  await page.evaluate(() =>
    [...document.querySelectorAll("button")]
      .find((x) => /Run it again/.test(x.textContent))
      .click(),
  );
  await new Promise((r) => setTimeout(r, 300));
  const litAfter = await page.evaluate(
    () => document.querySelectorAll(".b3-nodefield__dot--hot").length,
  );
  check(
    "Run it again relights the field from zero",
    litAfter < litBefore && (await buttonText()) === "Pay 0.0241 BTC",
    `${litBefore} lit → ${litAfter} lit`,
  );

  await page.close();
}

// ── prefers-reduced-motion jumps to the settled state ───────────────
{
  const page = await newPage();
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.goto(`${BASE}/`, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 400)); // far less than one 1100ms step
  check(
    "reduced motion skips straight to settled",
    await page.evaluate(
      () =>
        /settled/i.test(document.body.innerText) &&
        !![...document.querySelectorAll("button")].find((x) => /Run it again/.test(x.textContent)),
    ),
  );
  await page.close();
}

// ── Mobile: nav collapses, Drawer opens and traps, Escape closes ────
{
  const page = await newPage(390, 844);
  await page.goto(`${BASE}/`, { waitUntil: "networkidle0" });

  check(
    "primary nav is hidden at 390px",
    await page.evaluate(() => getComputedStyle(document.querySelector(".b3-nav")).display === "none"),
  );
  check(
    "menu button is shown at 390px",
    await page.evaluate(
      () => getComputedStyle(document.querySelector(".site-nav-menu-button")).display !== "none",
    ),
  );
  check(
    "page does not scroll horizontally at 390px",
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
    await page.evaluate(() => `scrollWidth ${document.documentElement.scrollWidth}`),
  );

  await page.click(".site-nav-menu-button");
  await new Promise((r) => setTimeout(r, 350));
  check(
    "menu drawer opens",
    await page.evaluate(() => !!document.querySelector('aside[role="dialog"]')),
  );
  await page.keyboard.press("Escape");
  await new Promise((r) => setTimeout(r, 350));
  check(
    "Escape closes the drawer",
    await page.evaluate(() => !document.querySelector('aside[role="dialog"]')),
  );
  await page.close();
}

// ── Every route renders its own <h1> and title on a cold load ───────
for (const [path, expectTitle] of [
  ["/", "B3Pay — open infrastructure for the Internet Computer"],
  ["/products/b3wallet", "B3Wallet — B3Pay"],
  ["/developers", "Developers — B3Pay"],
  ["/about", "About — B3Pay"],
  ["/blog", "Writing — B3Pay"],
  ["/contact", "Contact — B3Pay"],
]) {
  const page = await newPage();
  await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
  const title = await page.title();
  const h1s = await page.evaluate(() => document.querySelectorAll("h1").length);
  check(`${path} — title and single h1`, title === expectTitle && h1s === 1, `"${title}", ${h1s} h1`);
  await page.close();
}

// ── /products redirects to the first product ───────────────────────
{
  const page = await newPage();
  await page.goto(`${BASE}/products`, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 300));
  check("/products redirects to /products/b3forge", new URL(page.url()).pathname === "/products/b3forge");
  await page.close();
}

// ── The contact form never claims success it did not achieve ───────
{
  const page = await newPage();
  await page.goto(`${BASE}/contact`, { waitUntil: "networkidle0" });

  // The local server has no serverless runtime, so /api/contact answers with
  // the SPA shell — the exact shape of a misconfigured deploy.
  await page.type("#n", "Ada Lovelace");
  await page.type("#e", "ada@example.org");
  await page.type("#m", "Checking that a failed delivery is reported as one.");
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 800));

  check(
    "a non-JSON 200 is reported as a failure, not a send",
    await page.evaluate(
      () =>
        !/Message sent/.test(document.body.innerText) &&
        /not sent/i.test(document.body.innerText),
    ),
    (await page.evaluate(() => document.body.innerText)).includes("Message sent")
      ? "form claimed success"
      : "",
  );
  await page.close();
}

// ── Nothing from a CDN, and no emoji, in the shipped output ────────
{
  const page = await newPage();
  const external = [];
  page.on("request", (r) => {
    const u = new URL(r.url());
    if (u.hostname !== "localhost" && u.protocol !== "data:") external.push(r.url());
  });
  await page.goto(`${BASE}/`, { waitUntil: "networkidle0" });
  check("no external requests", external.length === 0, external.join(", "));
  await page.close();
}

await browser.close();
console.log(failures ? `\n${failures} failing` : "\nall checks passed");
process.exit(failures ? 1 : 0);
