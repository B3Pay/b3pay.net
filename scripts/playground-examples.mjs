/**
 * Writes src/components/playground/examples.ts, the Clear Signing
 * playground's examples: each a transaction taken whole from the coverage
 * tracker's samples, and the tokens its call names, as the tracker's token
 * files have them. Before writing, it formats each one the way the page
 * does (src/components/playground/clear.ts), against a local clone of the
 * registry, and prints how each reads, so an example that no longer shows
 * what it is there for is seen before it ships.
 *
 *   node scripts/playground-examples.mjs <registry clone> <clear-signing-mcp>/tracker
 *
 * Then npm test, whose scripts/playground.test.mjs checks the examples
 * against the coverage report.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import * as library from "@ethereum-sourcify/clear-signing";
import { clearSign, fallbackReason } from "../src/components/playground/clear.ts";

/** The transactions, picked from the samples: what each is there for is in examples.ts's header. */
const PICKS = [
  ["uniswap-ethereum", "Swap on Uniswap", 1, "0xf7e41e2907519cd00d8b8cf9fe3750b7c38b52dd63b5faaf3f91b05aff8bcc99"],
  ["hyperliquid-arbitrum", "Deposit to Hyperliquid", 42161, "0x0a5767fb0613baffa13880102a8e74f83a21aceb4686f3d8751114c2bf323a03"],
  ["aave-base", "Borrow on Aave", 8453, "0xeddb57dcbfebcc74f9de062e6f2183f2968420edd9f1fc1452eca2d505f5bd99"],
  ["1inch-op", "Swap on 1inch", 10, "0x741e68b8b98c40ece8f4e0d88b3b328f82c7e5d16189a93d237444bb66d041c8"],
  ["universal-router-base", "Swap on Uniswap's Universal Router", 8453, "0xc575e93c37e0bf426a11b9c635fbe28cfcd16c7409482b11012ff82deeeb22d6"],
  ["okx-base", "Swap on OKX DEX", 8453, "0x97968396517c3689c46c14774e4624c2f37209cb60925c2e53214af0d7c4a8fd"],
  ["aero-base", "Swap on Aero Slipstream", 8453, "0x71377f7790158d03afe99828d1d16e7cda59ff556f79dbd2f9c047e657278627"],
];

const [registryDir, trackerDir] = process.argv.slice(2);
if (!registryDir || !trackerDir) {
  console.error("usage: node scripts/playground-examples.mjs <registry clone> <clear-signing-mcp>/tracker");
  process.exit(2);
}
const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
const report = readJson(new URL("../src/data/clear-signing-coverage.json", import.meta.url));
const registry = {
  index: {
    calldataIndex: readJson(join(registryDir, "index.calldata.json")),
    typedDataIndex: readJson(join(registryDir, "index.eip712.json")),
  },
  file: async (path) => readJson(join(registryDir, path)),
};

const CHAIN_NAMES = { 1: "Ethereum", 8453: "Base", 42161: "Arbitrum One", 10: "OP Mainnet" };
const tokens = Object.fromEntries(
  Object.keys(CHAIN_NAMES).map((chainId) => [chainId, readJson(join(trackerDir, "data", "tokens", `${chainId}.json`))]),
);
// The tokens the examples' calls name, which the page then needs no RPC for.
const used = new Map();
const provider = {
  resolveToken: async (chainId, address) => {
    const token = tokens[chainId]?.[address.toLowerCase()] ?? null;
    if (token) used.set(`${chainId}:${address.toLowerCase()}`, { name: token.name, symbol: token.symbol, decimals: token.decimals });
    return token;
  },
  resolveChainInfo: async (chainId) =>
    CHAIN_NAMES[chainId] ? { name: CHAIN_NAMES[chainId], nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 } } : null,
};

function sampleOf(chainId, hash) {
  for (const protocol of report.protocols) {
    for (const contract of protocol.contracts.filter((candidate) => candidate.chainId === chainId)) {
      let txs;
      try {
        ({ txs } = readJson(join(trackerDir, "data", "samples", String(chainId), `${contract.address.toLowerCase()}.json`)));
      } catch {
        continue;
      }
      const tx = txs.find((candidate) => candidate.hash.toLowerCase() === hash);
      if (tx) return { protocol, contract, tx };
    }
  }
  throw new Error(`${hash} is in no sample of a contract on chain ${chainId} that the report lists`);
}

const warnings = (display) => JSON.stringify((display.warnings ?? []).map((warning) => warning.code));
const intent = (display) => display.interpolatedIntent ?? JSON.stringify(display.intent);

const examples = [];
for (const [id, title, chainId, hash] of PICKS) {
  const { protocol, contract, tx } = sampleOf(chainId, hash);
  if (tx.to.toLowerCase() !== contract.address.toLowerCase() || tx.status !== "success")
    throw new Error(`${id}: ${hash} is not a successful call to ${contract.address}`);
  const call = { chainId, to: tx.to, data: tx.input.toLowerCase(), value: BigInt(tx.value), from: tx.from };
  const display = await clearSign(library, registry, provider, call);
  const reason = fallbackReason(display);
  let reads = reason ? `[${reason}] ${warnings(display)}` : `${intent(display)} ${warnings(display)}`;
  if (reason && contract.elsewhere) {
    const near = await clearSign(library, registry, provider, call, { chainId, address: tx.to, path: contract.elsewhere.path });
    reads = `[${reason}], bound as a near miss: ${fallbackReason(near) ?? intent(near)} ${warnings(near)}`;
  }
  console.log(`${id.padEnd(22)} ${protocol.id} | ${contract.label} | ${contract.status}${contract.draft ? " | draft" : ""} | ${reads}`);
  examples.push({
    id,
    title,
    chainId,
    hash: tx.hash.toLowerCase(),
    block: tx.blockNumber,
    from: tx.from,
    to: tx.to,
    value: String(BigInt(tx.value)),
    data: tx.input.toLowerCase(),
  });
}

const q = JSON.stringify;
const entry = (example) => `  {
    id: ${q(example.id)},
    title: ${q(example.title)},
    chainId: ${example.chainId},
    hash: ${q(example.hash)},
    block: ${example.block},
    from: ${q(example.from)},
    to: ${q(example.to)},
    value: ${q(example.value)},
    data: ${q(example.data)},
  },`;
const tokenLines = [...used.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([key, token]) => `  ${q(key)}: { name: ${q(token.name)}, symbol: ${q(token.symbol)}, decimals: ${token.decimals} },`);

const source = `/**
 * The playground's examples: real transactions, taken whole from the coverage
 * tracker's samples (B3Pay/clear-signing-mcp, tracker/data/samples), so an
 * example reads without asking a chain for the transaction. Four are calls
 * the registry formats, one on each chain; then the busiest contract it does
 * not describe, a near miss, and a contract B3Pay has a draft for. The tokens
 * their calls name are listed as the tracker read them from each token's own
 * contract.
 *
 * Written by scripts/playground-examples.mjs, not by hand;
 * scripts/playground.test.mjs checks each against the coverage report.
 */
import type { TokenResult } from "@ethereum-sourcify/clear-signing";
import type { ChainId } from "./chains.ts";

export interface Example {
  readonly id: string;
  /** What the person did, as the button says it. */
  readonly title: string;
  readonly chainId: ChainId;
  readonly hash: string;
  readonly block: number;
  readonly from: string;
  readonly to: string;
  /** In wei. */
  readonly value: string;
  readonly data: string;
}

export const EXAMPLES: readonly Example[] = [
${examples.map(entry).join("\n")}
];

/** The examples' tokens, by "<chainId>:<address>". */
export const EXAMPLE_TOKENS: Readonly<Record<string, TokenResult>> = {
${tokenLines.join("\n")}
};
`;
const out = new URL("../src/components/playground/examples.ts", import.meta.url);
writeFileSync(out, source);
console.log(`wrote ${examples.length} examples and ${tokenLines.length} tokens to src/components/playground/examples.ts`);
