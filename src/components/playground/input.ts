/**
 * What a person gives the playground, checked before anything is fetched: a
 * transaction hash, or a contract address with calldata and a value. Also the
 * page address that names a request (#chain=8453&tx=0x…), so a result can be
 * shared, and the way an amount of ether is written. Nothing here touches the
 * network or the page, so scripts/playground.test.mjs runs it in Node.
 */
import { chainById, type ChainId } from "./chains.ts";

/** Calldata above this is not read: it would only slow the page. */
export const MAX_CALLDATA_BYTES = 128 * 1024;

/** A transaction to look up, or a call to read as it is. */
export type Request =
  | { readonly kind: "hash"; readonly chainId: ChainId; readonly hash: string }
  | { readonly kind: "call"; readonly chainId: ChainId; readonly to: string; readonly data: string; readonly value: bigint };

export type Parsed<T> = { readonly ok: true; readonly value: T } | { readonly ok: false; readonly error: string };

const ok = <T>(value: T): Parsed<T> => ({ ok: true, value });
const fail = <T>(error: string): Parsed<T> => ({ ok: false, error });

const HASH = /^0x[0-9a-f]{64}$/i;
const ADDRESS = /^0x[0-9a-f]{40}$/i;

export function parseChain(text: string): Parsed<ChainId> {
  const chain = /^\d+$/.test(text.trim()) ? chainById(Number(text.trim())) : undefined;
  return chain ? ok(chain.id) : fail("Pick Ethereum, Base, Arbitrum One or OP Mainnet.");
}

export function parseHash(text: string): Parsed<string> {
  const hash = text.trim();
  return HASH.test(hash) ? ok(hash.toLowerCase()) : fail("A transaction hash is 0x followed by 64 hexadecimal characters.");
}

export function parseAddress(text: string): Parsed<string> {
  const address = text.trim();
  return ADDRESS.test(address)
    ? ok(address.toLowerCase())
    : fail("A contract address is 0x followed by 40 hexadecimal characters.");
}

/** Calldata as a wallet shows it, spaces and line breaks allowed, 0x optional. */
export function parseCalldata(text: string): Parsed<string> {
  const compact = text.replace(/\s+/g, "");
  const hex = /^0x/i.test(compact) ? compact.slice(2) : compact;
  if (!hex) return fail("Paste the calldata: the hexadecimal data the wallet is asked to sign.");
  if (!/^[0-9a-f]+$/i.test(hex)) return fail("Calldata is hexadecimal: only 0 to 9 and a to f.");
  if (hex.length % 2) return fail("Calldata has an even number of hexadecimal characters, two for each byte.");
  if (hex.length < 8) return fail("Calldata starts with a 4-byte function selector, so it is at least 8 hexadecimal characters.");
  if (hex.length / 2 > MAX_CALLDATA_BYTES) return fail(`Calldata over ${MAX_CALLDATA_BYTES / 1024} KB is not read here.`);
  return ok(`0x${hex.toLowerCase()}`);
}

const WEI_PER_ETHER = 10n ** 18n;

/** An amount of ether as a person writes it, 0.5 or 1,000, in wei. Empty is zero. */
export function parseEther(text: string): Parsed<bigint> {
  const amount = text.trim().replace(/[\s,_]/g, "");
  if (!amount) return ok(0n);
  const match = /^(\d*)(?:\.(\d*))?$/.exec(amount);
  const [whole = "", fraction = ""] = match ? [match[1], match[2]] : [];
  if (!match || (!whole && !fraction)) return fail("Write the value in ether, such as 0.5.");
  if (fraction.length > 18) return fail("Ether has 18 decimals at most.");
  return ok(BigInt(whole || "0") * WEI_PER_ETHER + BigInt(fraction.padEnd(18, "0") || "0"));
}

/** An amount in the token's smallest unit, written with its decimals: 1500000 at 6 is "1.5". */
export function formatUnits(value: bigint, decimals: number): string {
  const negative = value < 0n;
  const digits = (negative ? -value : value).toString().padStart(decimals + 1, "0");
  const whole = digits.slice(0, digits.length - decimals);
  const fraction = digits.slice(digits.length - decimals).replace(/0+$/, "");
  return `${negative ? "-" : ""}${whole}${fraction ? `.${fraction}` : ""}`;
}

/** The longest calldata a page address carries; a longer call is not put in the address. */
export const MAX_HASH_DATA = 8 * 1024;

/**
 * The request a page address's fragment names: #chain=8453&tx=0x… for a
 * transaction, or #chain=8453&to=0x…&data=0x…&value=<wei> for a call. The
 * fragment never leaves the browser, so the server does not see what a
 * person looks up. Null when the fragment names no request, such as an
 * anchor on the page.
 */
export function requestFromHash(fragment: string): Parsed<Request> | null {
  const query = new URLSearchParams(fragment.replace(/^#/, ""));
  const tx = query.get("tx");
  const to = query.get("to");
  if (tx === null && to === null) return null;
  const chain = parseChain(query.get("chain") ?? "1");
  if (!chain.ok) return chain;
  if (tx !== null) {
    const hash = parseHash(tx);
    return hash.ok ? ok({ kind: "hash", chainId: chain.value, hash: hash.value }) : hash;
  }
  const address = parseAddress(to ?? "");
  if (!address.ok) return address;
  const data = parseCalldata(query.get("data") ?? "");
  if (!data.ok) return data;
  const value = query.get("value") ?? "0";
  if (!/^\d{1,78}$/.test(value)) return fail("The value in this address is not a whole number of wei.");
  return ok({ kind: "call", chainId: chain.value, to: address.value, data: data.value, value: BigInt(value) });
}

/** The page address's fragment for a request, #chain=…, or null when its calldata is too long to carry. */
export function hashOf(request: Request): string | null {
  const query = new URLSearchParams({ chain: String(request.chainId) });
  if (request.kind === "hash") query.set("tx", request.hash);
  else {
    if (request.data.length > MAX_HASH_DATA) return null;
    query.set("to", request.to);
    query.set("data", request.data);
    if (request.value) query.set("value", request.value.toString());
  }
  return `#${query}`;
}
