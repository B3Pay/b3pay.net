/**
 * Generates the favicon set and the Open Graph card from the brand mark.
 *
 *     npm run brand:images
 *
 * Run this when `packages/ui/assets/b3pay-mark*.svg` changes. The outputs are
 * committed to `apps/web/public/`, so neither the build nor the site fetches
 * anything at deploy time.
 *
 * The one network call is here: Space Grotesk and Inter are pulled from Google
 * Fonts as TTF so resvg can typeset the wordmark and the strapline in the real
 * faces. @fontsource ships woff2 only, which resvg cannot read.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

import { Resvg } from "@resvg/resvg-js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS = join(ROOT, "packages/ui/assets");
const PUBLIC = join(ROOT, "apps/web/public");

// Brand values, all from design/tokens/color.css.
const INK_150 = "#111113"; // --background
const INK_900 = "#F2F2F2"; // --foreground
const INK_100 = "#111111"; // brand near-black
const INK_700 = "#9E9EA8"; // --muted-foreground
const FORGE_600 = "#ED7437"; // --primary

/**
 * Google content-negotiates the font format off the User-Agent. Safari 5 gets
 * TrueType, which is what resvg reads; a modern UA gets woff2 and an IE UA gets
 * EOT, neither of which it can parse.
 */
const LEGACY_UA =
  "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; en-us) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1";

async function fetchFont(family, weight) {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}`;
  const css = await fetch(url, { headers: { "User-Agent": LEGACY_UA } }).then((r) => {
    if (!r.ok) throw new Error(`${family} ${weight}: font CSS returned ${r.status}`);
    return r.text();
  });
  // Static cuts come back as a .ttf URL; families Google only ships variable
  // (Inter) come back as /l/font?kit=… with no extension — still TTF bytes for
  // this UA, and resvg renders the default instance, which is the weight asked
  // for here.
  const src = css.match(/url\((https:\/\/[^)]+)\)/)?.[1];
  if (!src) throw new Error(`${family} ${weight}: no font url in the returned CSS`);
  // The same UA on the font request too — the /l/font endpoint content-negotiates,
  // and a modern UA gets woff2 back, which resvg cannot read.
  const buf = Buffer.from(
    await fetch(src, { headers: { "User-Agent": LEGACY_UA } }).then((r) => {
      if (!r.ok) throw new Error(`${family} ${weight}: font returned ${r.status}`);
      return r.arrayBuffer();
    }),
  );
  const magic = buf.subarray(0, 4).toString("hex");
  if (!["00010000", "74727565", "4f54544f"].includes(magic)) {
    throw new Error(
      `${family} ${weight}: expected a TrueType/OpenType file, got magic 0x${magic}`,
    );
  }
  const file = join(tmpdir(), `b3pay-${family.replace(/\s+/g, "-")}-${weight}.ttf`);
  await writeFile(file, buf);
  return file;
}

function render(svg, { width, fontFiles = [] }) {
  const r = new Resvg(svg, {
    fitTo: { mode: "width", value: width },
    background: "rgba(0,0,0,0)",
    font: { fontFiles, loadSystemFonts: fontFiles.length === 0 },
  });
  return r.render().asPng();
}

/** The mark, padded onto a dark tile. Raster favicons cannot adapt to the tab. */
function iconSvg(markInner, size) {
  // Clear space is half the mark width per side; at icon scale that is too much
  // padding to stay legible, so the glyph is inset by a sixth instead.
  const pad = Math.round(size / 6);
  const inner = size - pad * 2;
  const w = (inner * 302) / 412;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.16)}" fill="${INK_100}"/>
  <svg x="${(size - w) / 2}" y="${pad}" width="${w}" height="${inner}" viewBox="-11 -11 302 412" fill="none" color="${INK_900}">${markInner}</svg>
</svg>`;
}

function ogSvg(markInner) {
  const W = 1200;
  const H = 630;
  const markH = 132;
  const markW = (markH * 302) / 412;
  const left = 88;
  const top = 150;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${INK_150}"/>

  <!-- gradient-brand across the top edge, as the hero has it -->
  <defs>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#C55300"/>
      <stop offset="0.45" stop-color="#FF8D28"/>
      <stop offset="1" stop-color="#FFA056"/>
    </linearGradient>
    <radialGradient id="heat" cx="0.5" cy="-0.1" r="0.8">
      <stop offset="0" stop-color="${FORGE_600}" stop-opacity="0.18"/>
      <stop offset="1" stop-color="${FORGE_600}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#heat)"/>
  <rect width="${W}" height="4" fill="url(#brand)"/>

  <!-- b3-colgrid: 12 hairlines -->
  <g stroke="#FFFFFF" stroke-opacity="0.08" stroke-width="1">
    ${Array.from({ length: 11 }, (_, i) => {
      const x = Math.round((W / 12) * (i + 1)) + 0.5;
      return `<line x1="${x}" y1="0" x2="${x}" y2="${H}"/>`;
    }).join("\n    ")}
  </g>

  <!-- b3-tick, top-left hot -->
  <g stroke-width="1">
    <line x1="${left}" y1="${74}" x2="${left + 22}" y2="${74}" stroke="${FORGE_600}"/>
    <line x1="${left + 11}" y1="${63}" x2="${left + 11}" y2="${85}" stroke="${FORGE_600}"/>
  </g>

  <svg x="${left}" y="${top}" width="${markW}" height="${markH}" viewBox="-11 -11 302 412" fill="none" color="${INK_900}">${markInner}</svg>
  <text x="${left + markW + 42}" y="${top + markH - 26}" font-family="Space Grotesk" font-weight="700" font-size="106" letter-spacing="-3.2" fill="${INK_900}">B3Pay</text>

  <text x="${left}" y="${top + markH + 112}" font-family="Space Grotesk" font-weight="700" font-size="46" letter-spacing="-2" fill="${INK_900}">Infrastructure for apps that hold their own keys.</text>

  <line x1="${left}" y1="${H - 118}" x2="${W - left}" y2="${H - 118}" stroke="#303035" stroke-width="1"/>
  <text x="${left}" y="${H - 78}" font-family="Inter" font-weight="400" font-size="24" fill="${INK_700}">Open source · Internet Computer · since 2023</text>
  <text x="${W - left}" y="${H - 78}" text-anchor="end" font-family="Inter" font-weight="400" font-size="24" fill="${INK_700}">b3pay.net</text>
</svg>`;
}

/** The paths inside the source mark, so they can be re-nested at any size. */
async function markInner(file) {
  const svg = await readFile(join(ASSETS, file), "utf8");
  const body = svg.match(/<svg[^>]*>([\s\S]*)<\/svg>\s*$/)?.[1];
  if (!body) throw new Error(`${file}: could not read the mark geometry`);
  return body.trim();
}

async function main() {
  await mkdir(PUBLIC, { recursive: true });

  // b3pay-mark.svg uses currentColor for the strokes and keeps the Forge node
  // at a fixed #ED7437 — the node never changes colour, in any variant.
  const inner = await markInner("b3pay-mark.svg");

  // favicon.svg: no tile, and it follows the tab's colour scheme.
  const w = (32 * 302) / 412;
  await writeFile(
    join(PUBLIC, "favicon.svg"),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <style>:root{color:${INK_900}}@media (prefers-color-scheme: light){:root{color:${INK_100}}}</style>
  <svg x="${(32 - w) / 2}" y="1" width="${w}" height="30" viewBox="-11 -11 302 412" fill="none">${inner}</svg>
</svg>\n`,
  );

  for (const [name, size] of [
    ["favicon-16.png", 16],
    ["favicon-32.png", 32],
    ["apple-touch-icon.png", 180],
    ["icon-192.png", 192],
    ["icon-512.png", 512],
  ]) {
    await writeFile(join(PUBLIC, name), render(iconSvg(inner, size), { width: size }));
    console.log(`  ${name}  ${size}×${size}`);
  }

  const fonts = await Promise.all([
    fetchFont("Space Grotesk", 700),
    fetchFont("Inter", 400),
  ]);
  await writeFile(
    join(PUBLIC, "og.png"),
    render(ogSvg(inner), { width: 1200, fontFiles: fonts }),
  );
  console.log("  og.png  1200×630");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
