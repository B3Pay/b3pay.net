/**
 * What Sourcify's clear-signing library asks a wallet for while it formats a
 * call (its ExternalDataProvider): a token's symbol and decimals, an NFT
 * collection's name, a block's time and a chain's name, read here from the
 * chain itself through ./rpc.ts. A token's metadata is what the token says
 * about itself, cleaned before it is shown (./abi.ts). Names from ENS or an
 * address book are left out, so the library shows the address itself.
 *
 * `known` holds tokens already read, such as the examples' (./examples.ts),
 * so an example reads without asking a chain for them.
 */
import type { ExternalDataProvider, TokenResult } from "@ethereum-sourcify/clear-signing";
import { cleanText, decodeString, decodeUint, SELECTOR } from "./abi.ts";
import { chainById, NATIVE, type ChainId } from "./chains.ts";
import { blockTimestamp, ethCall, type Rpc } from "./rpc.ts";

export interface Provider extends ExternalDataProvider {
  /** The tokens this provider had to read from a chain, by "<chainId>:<address>". */
  readonly fetched: ReadonlySet<string>;
}

export function createProvider(rpc: Rpc, known: Readonly<Record<string, TokenResult>> = {}): Provider {
  const tokens = new Map<string, Promise<TokenResult | null>>();
  const collections = new Map<string, Promise<string | null>>();
  const fetched = new Set<string>();
  const tracked = (chainId: number) => chainById(chainId)?.id as ChainId | undefined;

  return {
    fetched,
    resolveToken(chainId, address) {
      const key = `${chainId}:${address.toLowerCase()}`;
      if (Object.hasOwn(known, key)) return Promise.resolve(known[key]!);
      const chain = tracked(chainId);
      if (!chain) return Promise.resolve(null);
      let token = tokens.get(key);
      if (!token) {
        fetched.add(key);
        token = readToken(rpc, chain, address).catch(() => null);
        tokens.set(key, token);
      }
      return token;
    },
    async resolveNftCollectionName(chainId, address) {
      const chain = tracked(chainId);
      if (!chain) return null;
      const key = `${chainId}:${address.toLowerCase()}`;
      let name = collections.get(key);
      if (!name) {
        name = ethCall(rpc, chain, address, SELECTOR.name)
          .then((data) => {
            const value = decodeString(data);
            return value ? cleanText(value, 64) : null;
          })
          .catch(() => null);
        collections.set(key, name);
      }
      const value = await name;
      return value ? { name: value } : null;
    },
    async resolveBlockTimestamp(chainId, height) {
      const chain = tracked(chainId);
      if (!chain) return null;
      const timestamp = await blockTimestamp(rpc, chain, height).catch(() => null);
      return timestamp === null ? null : { timestamp };
    },
    async resolveChainInfo(chainId) {
      const chain = chainById(chainId);
      return chain ? { name: chain.name, nativeCurrency: { ...NATIVE } } : null;
    },
  };
}

/** A token's decimals and symbol (its name too, when it has one), or null when it does not answer like a token. */
async function readToken(rpc: Rpc, chainId: ChainId, address: string): Promise<TokenResult | null> {
  const [decimals, symbol, name] = await Promise.all([
    ethCall(rpc, chainId, address, SELECTOR.decimals).then(decodeUint),
    ethCall(rpc, chainId, address, SELECTOR.symbol).then(decodeString),
    ethCall(rpc, chainId, address, SELECTOR.name)
      .then(decodeString)
      .catch(() => null),
  ]);
  if (decimals === null || decimals > 77n || !symbol) return null;
  return { decimals: Number(decimals), symbol: cleanText(symbol, 32), name: cleanText(name ?? "", 64) };
}
