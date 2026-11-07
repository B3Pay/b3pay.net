/**
 * The four chains the playground reads, in the coverage tracker's order and
 * with its names: where to ask for a transaction (public RPCs, the first that
 * answers wins), where a person can look it up, and what its native currency
 * is called. The RPCs are the ones the tracker reads: public and keyless,
 * asked straight from the reader's browser, so no server of this site sees
 * what anyone looks up.
 */
export type ChainId = 1 | 8453 | 42161 | 10;

export interface PlaygroundChain {
  readonly id: ChainId;
  readonly name: string;
  /** The block explorer, without a trailing slash. */
  readonly explorer: string;
  readonly rpc: readonly string[];
}

export const CHAINS: readonly PlaygroundChain[] = [
  {
    id: 1,
    name: "Ethereum",
    explorer: "https://etherscan.io",
    rpc: ["https://ethereum-rpc.publicnode.com", "https://eth.llamarpc.com"],
  },
  {
    id: 8453,
    name: "Base",
    explorer: "https://basescan.org",
    rpc: ["https://base-rpc.publicnode.com", "https://mainnet.base.org"],
  },
  {
    id: 42161,
    name: "Arbitrum One",
    explorer: "https://arbiscan.io",
    rpc: ["https://arbitrum-one-rpc.publicnode.com", "https://arb1.arbitrum.io/rpc"],
  },
  {
    id: 10,
    name: "OP Mainnet",
    explorer: "https://optimistic.etherscan.io",
    rpc: ["https://optimism-rpc.publicnode.com", "https://mainnet.optimism.io"],
  },
];

/** Every chain here pays in ether. */
export const NATIVE = { name: "Ether", symbol: "ETH", decimals: 18 } as const;

export function chainById(id: number): PlaygroundChain | undefined {
  return CHAINS.find((chain) => chain.id === id);
}

export const txUrl = (chain: PlaygroundChain, hash: string) => `${chain.explorer}/tx/${hash}`;
export const addressUrl = (chain: PlaygroundChain, address: string) => `${chain.explorer}/address/${address}`;
