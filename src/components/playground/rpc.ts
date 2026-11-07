/**
 * Reading a chain from the browser: a JSON-RPC request to the chain's public
 * RPCs in turn (./chains.ts), each given a few seconds, the next one tried
 * when one does not answer or turns the request away. Only reads: a
 * transaction by its hash, a block's time and eth_call. What comes back is
 * checked for shape before anything uses it. `fetch` is passed in, so
 * scripts/playground.test.mjs runs this against a fake chain.
 */
import { chainById, type ChainId } from "./chains.ts";

export class RpcError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RpcError";
  }
}

type Fetch = (input: string, init: RequestInit) => Promise<Pick<Response, "ok" | "status" | "json">>;

export interface Rpc {
  request(chainId: ChainId, method: string, params: readonly unknown[]): Promise<unknown>;
}

/** JSON-RPC error codes that mean "not now" rather than "no": a rate limit or an overloaded node. */
const TRY_ANOTHER = new Set([-32005, -32016, -32603, 429]);

export function createRpc(fetchImpl: Fetch = fetch, timeoutMs = 8000): Rpc {
  let id = 0;
  return {
    async request(chainId, method, params) {
      const chain = chainById(chainId);
      if (!chain) throw new RpcError(`Chain ${chainId} is not one the playground reads.`);
      for (const url of chain.rpc) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        try {
          const response = await fetchImpl(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jsonrpc: "2.0", id: (id += 1), method, params }),
            signal: controller.signal,
          });
          if (!response.ok) continue;
          const body = (await response.json()) as { result?: unknown; error?: { code?: unknown; message?: unknown } };
          if (body && typeof body === "object" && body.error) {
            if (typeof body.error.code === "number" && TRY_ANOTHER.has(body.error.code)) continue;
            throw new RpcError(typeof body.error.message === "string" ? body.error.message : "The RPC refused the request.");
          }
          if (!body || typeof body !== "object" || !("result" in body)) continue;
          return body.result;
        } catch (error) {
          if (error instanceof RpcError) throw error;
          // A network error, a timeout or a body that is not JSON: try the next RPC.
        } finally {
          clearTimeout(timer);
        }
      }
      throw new RpcError(`None of ${chain.name}'s public RPCs answered. Try again in a moment.`);
    },
  };
}

const ADDRESS = /^0x[0-9a-f]{40}$/i;
const HEX = /^0x(?:[0-9a-f]{2})*$/i;
const QUANTITY = /^0x[0-9a-f]{1,64}$/i;

/** A transaction as the playground needs it. `to` is null for a contract's creation. */
export interface ChainTransaction {
  readonly hash: string;
  readonly from: string;
  readonly to: string | null;
  readonly input: string;
  readonly value: bigint;
}

/** The transaction with this hash, or null when the chain has none. */
export async function getTransaction(rpc: Rpc, chainId: ChainId, hash: string): Promise<ChainTransaction | null> {
  const tx = await rpc.request(chainId, "eth_getTransactionByHash", [hash]);
  if (tx === null) return null;
  const { from, to, input, value } = (tx ?? {}) as Record<string, unknown>;
  if (
    typeof from !== "string" ||
    !ADDRESS.test(from) ||
    !(to === null || (typeof to === "string" && ADDRESS.test(to))) ||
    typeof input !== "string" ||
    !HEX.test(input) ||
    typeof value !== "string" ||
    !QUANTITY.test(value)
  )
    throw new RpcError("The RPC's answer is not a transaction.");
  return { hash, from, to: to as string | null, input: input.toLowerCase(), value: BigInt(value) };
}

/** What eth_call returns, as hex. */
export async function ethCall(rpc: Rpc, chainId: ChainId, to: string, data: string): Promise<string> {
  const result = await rpc.request(chainId, "eth_call", [{ to, data }, "latest"]);
  if (typeof result !== "string" || !HEX.test(result)) throw new RpcError("The RPC's answer to eth_call is not hex.");
  return result;
}

/** A block's time in seconds, or null when the chain has no such block. */
export async function blockTimestamp(rpc: Rpc, chainId: ChainId, block: bigint): Promise<number | null> {
  const result = await rpc.request(chainId, "eth_getBlockByNumber", [`0x${block.toString(16)}`, false]);
  const timestamp = (result as { timestamp?: unknown } | null)?.timestamp;
  return typeof timestamp === "string" && QUANTITY.test(timestamp) ? Number(BigInt(timestamp)) : null;
}
