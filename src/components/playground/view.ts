/**
 * How the playground writes what it shows: short addresses, amounts of
 * ether, calldata in words and dates. Numbers, shares, days and addresses
 * are written as on the coverage pages, by the same functions
 * (../coverage/format.ts). Pure functions, with no page and no network, so
 * scripts/playground.test.mjs checks them in Node.
 */
import { formatUnits } from "./input.ts";

export { count, day, fileName, percent, plural, short } from "../coverage/format.ts";

/**
 * A contract as the result names it: its label after its protocol's name,
 * without the protocol's aside in brackets, or its label alone when that
 * already starts with the name. "Aave v3 Pool", "Aero · Slipstream SwapRouter".
 */
export function contractTitle(protocol: string, label: string): string {
  const name = protocol.replace(/\s*\([^)]*\)\s*$/, "");
  return label.toLowerCase().startsWith(name.toLowerCase()) ? label : `${name} · ${label}`;
}

/** An amount of wei in ether, its whole part grouped: "1,000.5 ETH", "0 ETH". */
export function ether(wei: bigint): string {
  const [whole = "0", fraction] = formatUnits(wei, 18).split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${grouped}${fraction ? `.${fraction}` : ""} ETH`;
}

/**
 * Calldata as a raw-data view shows it: the 4-byte function selector on its
 * own line, then each 32-byte word of the arguments after its byte offset in
 * hexadecimal, the way the ABI points into them. A last word shorter than 32
 * bytes is shown as it is.
 */
export function calldataLines(data: string): string[] {
  const hex = data.replace(/^0x/i, "").toLowerCase();
  const lines = [`0x${hex.slice(0, 8)}`];
  for (let at = 8; at < hex.length; at += 64) {
    lines.push(`${((at - 8) / 2).toString(16).padStart(4, "0")}  ${hex.slice(at, at + 64)}`);
  }
  return lines;
}
