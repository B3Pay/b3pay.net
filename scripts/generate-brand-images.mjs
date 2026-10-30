/**
 * Draws the raster brand images from the SVGs in public/brand/:
 *
 *   public/apple-touch-icon.png   180×180   the app icon, square (iOS rounds it)
 *   public/icon-192.png           192×192   the app icon, rounded
 *   public/icon-512.png           512×512   the app icon, rounded
 *   public/icon-maskable-512.png  512×512   the app icon, square, for maskable use
 *   public/og.png                 1280×640  the dark lockup, for link previews
 *
 *     npm run brand:images
 *
 * Run it when a brand SVG changes and commit the images: neither the build nor
 * the site draws or fetches anything. The SVGs are outlined, with no text, so
 * the result does not depend on the fonts of the machine that runs this.
 */
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const PUBLIC = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
const SURFACE = "#121110"; // --surface, dark (src/styles/tokens.css)
const BRAND = "#f0b35a"; // --brand, dark

const render = (svg, width) =>
  new Resvg(svg, { fitTo: { mode: "width", value: width }, font: { loadSystemFonts: false } }).render().asPng();

/** An SVG document as a nested <svg> placed at x, y with the given size. */
const place = (svg, { x, y, width, height }) =>
  svg
    .replace(/<\?xml[^>]*>/, "")
    .replace(/<svg\b([^>]*)>/, (_, attributes) => `<svg${attributes.replace(/\s(?:x|y|width|height)="[^"]*"/g, "")} x="${x}" y="${y}" width="${width}" height="${height}">`);

async function main() {
  const icon = await readFile(join(PUBLIC, "brand/b3pay-app-icon.svg"), "utf8");
  const lockup = await readFile(join(PUBLIC, "brand/b3pay-lockup-dark.svg"), "utf8");
  if (!/rx="22"/.test(icon)) throw new Error("brand/b3pay-app-icon.svg: expected its tile to have rx=\"22\"; update this script with the new shape");
  const square = icon.replace(/rx="22"/, 'rx="0"');

  // The lockup's own box is 193×48; at 720 wide it fills the card's middle.
  const width = 720;
  const height = Math.round((width * 48) / 193);
  const card = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 640" width="1280" height="640">
  <rect width="1280" height="640" fill="${SURFACE}"/>
  ${place(lockup, { x: (1280 - width) / 2, y: (640 - height) / 2, width, height })}
  <rect x="${(1280 - 96) / 2}" y="${(640 + height) / 2 + 56}" width="96" height="6" rx="3" fill="${BRAND}"/>
</svg>`;

  const outputs = [
    ["apple-touch-icon.png", render(square, 180)],
    ["icon-192.png", render(icon, 192)],
    ["icon-512.png", render(icon, 512)],
    ["icon-maskable-512.png", render(square, 512)],
    ["og.png", render(card, 1280)],
  ];
  for (const [name, png] of outputs) {
    await writeFile(join(PUBLIC, name), png);
    console.log(`brand  public/${name}  ${png.length} bytes`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
