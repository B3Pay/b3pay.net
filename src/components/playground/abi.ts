/**
 * The little ABI the playground needs to read a token's own name, symbol and
 * decimals, and the way it makes outside text safe to show. Everything a
 * chain or the registry returns is someone else's text: a symbol can carry a
 * right-to-left override that turns "USDC" around, or invisible characters
 * that make two names look alike. Those are spelled out (\u{202e}) instead of
 * acted on, and every string is cut to a bounded length, as the clear-signing
 * MCP server does.
 */

/** The selectors of ERC-20's (and ERC-721's) metadata functions. */
export const SELECTOR = { decimals: "0x313ce567", symbol: "0x95d89b41", name: "0x06fdde03" } as const;

const strip = (hex: string) => (/^0x/i.test(hex) ? hex.slice(2) : hex);

/** A returned uint256, or null when the data is not one 32-byte word. */
export function decodeUint(hex: string): bigint | null {
  const data = strip(hex);
  if (!/^[0-9a-f]{64}$/i.test(data)) return null;
  return BigInt(`0x${data}`);
}

/**
 * A returned string: an ABI-encoded string, or the bytes32 that some old
 * tokens return (MKR, SAI), up to its first zero byte. Null when it is
 * neither, or empty.
 */
export function decodeString(hex: string): string | null {
  const data = strip(hex);
  if (!/^(?:[0-9a-f]{2})*$/i.test(data)) return null;
  const bytes = Uint8Array.from(data.match(/../g) ?? [], (byte) => Number.parseInt(byte, 16));
  if (bytes.length === 32) {
    const end = bytes.indexOf(0);
    return text(bytes.subarray(0, end === -1 ? 32 : end));
  }
  if (bytes.length < 64) return null;
  const offset = word(bytes, 0);
  if (offset === null || offset + 32 > bytes.length) return null;
  const length = word(bytes, offset);
  if (length === null || offset + 32 + length > bytes.length) return null;
  return text(bytes.subarray(offset + 32, offset + 32 + length));
}

/** A 32-byte word read as a small number, or null when it is larger than any data here could be. */
function word(bytes: Uint8Array, at: number): number | null {
  if (at + 32 > bytes.length) return null;
  let value = 0;
  for (let i = at; i < at + 32; i += 1) {
    value = value * 256 + bytes[i]!;
    if (value > 0xffffff) return null;
  }
  return value;
}

function text(bytes: Uint8Array): string | null {
  const value = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  return value ? value : null;
}

/** Longest string, in code points, the page shows from an outside source. */
export const MAX_TEXT_LENGTH = 500;

/**
 * Whether a character changes how the text around it shows rather than being
 * shown itself: a C0 or C1 control (line breaks included), DEL, a
 * bidirectional formatting character, or an invisible joiner or mark.
 */
export function isUnsafeCodePoint(code: number): boolean {
  return (
    code < 0x20 ||
    (code >= 0x7f && code <= 0x9f) ||
    code === 0x61c ||
    (code >= 0x200b && code <= 0x200f) ||
    (code >= 0x202a && code <= 0x202e) ||
    (code >= 0x2060 && code <= 0x2064) ||
    (code >= 0x2066 && code <= 0x2069) ||
    code === 0xfeff
  );
}

/** `value` with each unsafe character spelled out as \u{…}, cut to `max` code points with an ellipsis. */
export function cleanText(value: string, max = MAX_TEXT_LENGTH): string {
  let out = "";
  let count = 0;
  for (const char of value) {
    if (count >= max) return `${out}…`;
    const code = char.codePointAt(0) ?? 0;
    out += isUnsafeCodePoint(code) ? `\\u{${code.toString(16)}}` : char;
    count += 1;
  }
  return out;
}
