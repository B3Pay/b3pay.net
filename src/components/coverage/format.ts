/**
 * How the site writes numbers, shares, days, addresses and links, on the
 * coverage pages and in the playground alike. Pure functions with no data
 * import, so the playground's client script can share them without pulling
 * in the report, and Node's test runner can load them as they are.
 * ./report.ts passes them on to the coverage components.
 */

const NUMBER = new Intl.NumberFormat("en-US");

/** A count with thousands separators: 12,840. */
export const count = (value: number) => NUMBER.format(value);

/** A count and its noun: "1 contract", "40 contracts". */
export const plural = (value: number, one: string, many = `${one}s`) => `${count(value)} ${value === 1 ? one : many}`;

/** Transactions per day: whole from 10 up, one decimal below. */
export const perDay = (value: number) => (value >= 10 ? NUMBER.format(Math.round(value)) : String(Math.round(value * 10) / 10));

/** A share as a whole percentage, which reads 0% or 100% only when it is exactly that. */
export function percent(share: number): string {
  const whole = Math.round(share * 100);
  if (share > 0 && whole === 0) return "<1%";
  if (share < 1 && whole === 100) return ">99%";
  return `${whole}%`;
}

const DAY = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** A day as the site writes it: 4 November 2026. */
export const day = (iso: string) => DAY.format(new Date(iso));

/** Two times as days: "5 November 2026", "3–5 November 2026" or "30 October – 2 November 2026". */
export const days = (from: string, to: string) => DAY.formatRange(new Date(from), new Date(to));

/**
 * An address or hash shortened in the middle, as the design system writes
 * it: 0x0000…0001. Anything short enough to read whole stays as it is.
 */
export const short = (hex: string) => (hex.length > 14 ? `${hex.slice(0, 6)}…${hex.slice(-4)}` : hex);

const USD = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumSignificantDigits: 3 });

/** An amount in US dollars, to three figures: $2.41B. */
export const usd = (value: number) => USD.format(value);

/** Text for a place that takes HTML, such as a hero's title and tagline. */
export const escapeHtml = (text: string) =>
  text.replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]!);

/** A link's host, which is what a reader needs to know before following it: docs.example.com. */
export const host = (url: string) => new URL(url).host.replace(/^www\./, "");

/** A registry file by its name: calldata-UniversalRouter.json. */
export const fileName = (path: string) => path.slice(path.lastIndexOf("/") + 1);

/** The id of a contract's card on its protocol's page (./ContractCard.astro), so a link can go to it: contract-8453-0x3fc9…. */
export const contractAnchor = (chainId: number, address: string) => `contract-${chainId}-${address.toLowerCase()}`;
