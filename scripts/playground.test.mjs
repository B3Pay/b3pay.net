/**
 * The Clear Signing playground, /clear-signing/playground/
 * (src/components/playground/): what a person types is checked before
 * anything is fetched; the chains' RPCs are tried in turn and their answers
 * checked; a token's metadata is read once and cleaned; Sourcify's library
 * formats a call, and formats a near miss once its descriptor is bound to
 * the contract; and the examples and the coverage data agree with the
 * report. The network is a fake throughout; the library is the real one.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as library from "@ethereum-sourcify/clear-signing";
import { cleanText, decodeString, decodeUint, SELECTOR } from "../src/components/playground/abi.ts";
import { addressUrl, CHAINS, chainById, txUrl } from "../src/components/playground/chains.ts";
import {
  bindTo,
  clearSign,
  fallbackReason,
  LIBRARY_VERSION,
  registryFileUrl,
  resolverFor,
} from "../src/components/playground/clear.ts";
import { contractAnchor, contractKey, playgroundContracts } from "../src/components/playground/contracts.ts";
import { EXAMPLE_TOKENS, EXAMPLES } from "../src/components/playground/examples.ts";
import {
  formatUnits,
  hashOf,
  MAX_CALLDATA_BYTES,
  MAX_HASH_DATA,
  parseAddress,
  parseCalldata,
  parseChain,
  parseEther,
  parseHash,
  PLAYGROUND_PATH,
  requestFromHash,
  txInPlayground,
} from "../src/components/playground/input.ts";
import { createProvider } from "../src/components/playground/provider.ts";
import { createRpc, getTransaction, RpcError } from "../src/components/playground/rpc.ts";
import { calldataLines, contractTitle, count, day, ether, fileName, percent, plural, short } from "../src/components/playground/view.ts";
import * as siteFormat from "../src/components/coverage/format.ts";
import { APPROVE_FORMAT, PERMIT2, USDC } from "../src/components/home/calldata.ts";

const report = JSON.parse(readFileSync(new URL("../src/data/clear-signing-coverage.json", import.meta.url), "utf8"));
const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const installed = JSON.parse(
  readFileSync(new URL("../node_modules/@ethereum-sourcify/clear-signing/package.json", import.meta.url), "utf8"),
);

const HASH = `0x${"ab".repeat(32)}`;
const word = (value) => BigInt(value).toString(16).padStart(64, "0");
const abiString = (text) => {
  const hex = Buffer.from(text, "utf8").toString("hex");
  return `0x${word(32)}${word(hex.length / 2)}${hex.padEnd(Math.max(64, Math.ceil(hex.length / 64) * 64), "0")}`;
};

// ── What a person types ────────────────────────────────────────────────

test("a transaction hash, an address and a chain are checked before anything is fetched", () => {
  assert.deepEqual(parseHash(` ${HASH.toUpperCase().replace("0X", "0x")} `), { ok: true, value: HASH });
  assert.equal(parseHash("0x1234").ok, false);
  assert.equal(parseHash(`${HASH}00`).ok, false);
  assert.equal(parseHash(HASH.replace("a", "g")).ok, false);
  assert.deepEqual(parseAddress(USDC.address), { ok: true, value: USDC.address.toLowerCase() });
  assert.equal(parseAddress("0x1234").ok, false);
  assert.deepEqual(parseChain("8453"), { ok: true, value: 8453 });
  assert.equal(parseChain("137").ok, false, "Polygon is not one of the four chains");
  assert.equal(parseChain("1.5").ok, false);
});

test("calldata is read as a wallet shows it, and refused when it cannot be a call", () => {
  assert.deepEqual(parseCalldata("095ea7b3 0000\n0001"), { ok: true, value: "0x095ea7b300000001" });
  assert.deepEqual(parseCalldata("0X095EA7B3"), { ok: true, value: "0x095ea7b3" });
  assert.match(parseCalldata("").error, /Paste the calldata/);
  assert.match(parseCalldata("0x095ea7b").error, /even number/);
  assert.match(parseCalldata("0x0950").error, /4-byte function selector/);
  assert.match(parseCalldata("0x095ea7zz").error, /hexadecimal/);
  assert.match(parseCalldata(`0x${"00".repeat(MAX_CALLDATA_BYTES + 1)}`).error, /not read here/);
  assert.equal(parseCalldata(`0x${"00".repeat(MAX_CALLDATA_BYTES)}`).ok, true);
});

test("an amount of ether is read in wei, and written back the same way", () => {
  const wei = (text) => parseEther(text).value;
  assert.equal(wei(""), 0n);
  assert.equal(wei("0.5"), 5n * 10n ** 17n);
  assert.equal(wei("1,000"), 1000n * 10n ** 18n);
  assert.equal(wei(".25"), 25n * 10n ** 16n);
  assert.equal(wei("0.000000000000000001"), 1n);
  assert.equal(parseEther("0.0000000000000000001").ok, false, "ether has 18 decimals");
  assert.equal(parseEther("1e18").ok, false);
  assert.equal(parseEther(".").ok, false);
  assert.equal(formatUnits(1_500_000n, 6), "1.5");
  assert.equal(formatUnits(0n, 18), "0");
  assert.equal(formatUnits(10n ** 18n, 18), "1");
  assert.equal(formatUnits(1n, 18), "0.000000000000000001");
  assert.equal(ether(1234n * 10n ** 18n + 5n * 10n ** 17n), "1,234.5 ETH");
  assert.equal(ether(0n), "0 ETH");
});

test("a request lives in the page address's fragment, and anything else there is an anchor", () => {
  const hash = { kind: "hash", chainId: 8453, hash: HASH };
  assert.equal(hashOf(hash), `#chain=8453&tx=${HASH}`);
  assert.deepEqual(requestFromHash(hashOf(hash)), { ok: true, value: hash });
  const call = { kind: "call", chainId: 10, to: PERMIT2.address.toLowerCase(), data: "0x095ea7b3", value: 7n };
  assert.deepEqual(requestFromHash(hashOf(call)), { ok: true, value: call });
  assert.equal(hashOf({ ...call, value: 0n }).includes("value"), false);
  assert.equal(hashOf({ ...call, data: `0x${"00".repeat(MAX_HASH_DATA)}` }), null, "too long to carry");
  assert.equal(requestFromHash(""), null);
  assert.equal(requestFromHash("#how-it-works"), null);
  assert.deepEqual(requestFromHash(`#tx=${HASH}`), { ok: true, value: { kind: "hash", chainId: 1, hash: HASH } });
  assert.equal(requestFromHash(`#chain=137&tx=${HASH}`).ok, false);
  assert.equal(requestFromHash("#chain=1&tx=0x12").ok, false);
  assert.equal(requestFromHash(`#chain=1&to=${PERMIT2.address}&data=0x095ea7b3&value=-1`).ok, false);
});

// ── What the page writes ───────────────────────────────────────────────

test("calldata is shown as its selector, then each 32-byte word after its offset", () => {
  const data = `0x095ea7b3${word(PERMIT2.address)}${"ff".repeat(32)}abcd`;
  assert.deepEqual(calldataLines(data), [
    "0x095ea7b3",
    `0000  ${word(PERMIT2.address)}`,
    `0020  ${"ff".repeat(32)}`,
    "0040  abcd",
  ]);
  assert.deepEqual(calldataLines("0x095ea7b3"), ["0x095ea7b3"]);
});

test("names, shares and dates read as on the coverage pages", () => {
  assert.equal(short(HASH), "0xabab…abab");
  assert.equal(short("0x1234"), "0x1234");
  assert.equal(fileName("registry/okx/calldata-OkxDexRouterV1.0.8.json"), "calldata-OkxDexRouterV1.0.8.json");
  assert.equal(contractTitle("Aave v3", "Aave v3 Pool"), "Aave v3 Pool");
  assert.equal(contractTitle("Aero (Aerodrome + Velodrome)", "Slipstream SwapRouter"), "Aero · Slipstream SwapRouter");
  assert.equal(contractTitle("OKX DEX (OKX Wallet swaps)", "OKX DEX router"), "OKX DEX router");
  assert.equal(day("2026-11-07T08:00:00Z"), "7 November 2026");
  assert.deepEqual([0, 0.001, 0.5, 0.954, 0.999, 1].map(percent), ["0%", "<1%", "50%", "95%", ">99%", "100%"]);
  // The coverage pages' own functions, not copies that could drift from them.
  for (const [name, writes] of Object.entries({ count, day, fileName, percent, plural, short })) {
    assert.equal(writes, siteFormat[name], `${name} is the coverage pages' own`);
  }
});

test("text from outside is shown, never acted on, and cut to length", () => {
  assert.equal(cleanText("US‮DC"), "US\\u{202e}DC");
  assert.equal(cleanText("a\nb​c"), "a\\u{a}b\\u{200b}c");
  assert.equal(cleanText("abcdef", 3), "abc…");
  assert.equal(cleanText("😀😀", 1), "😀…", "counted in code points");
});

// ── Reading a chain ────────────────────────────────────────────────────

test("the four chains are the coverage report's, each with HTTPS RPCs and an explorer", () => {
  assert.deepEqual(
    CHAINS.map((chain) => chain.id).sort(),
    Object.keys(report.chains).map(Number).sort(),
  );
  for (const chain of CHAINS) {
    assert.ok(chain.rpc.length >= 2, `${chain.name} has a second RPC to fall back on`);
    for (const url of chain.rpc) assert.equal(new URL(url).protocol, "https:", `${url} is HTTPS`);
    assert.match(chain.explorer, /^https:\/\/[^/]+$/, `${chain.name}'s explorer is a bare host, so its links take /tx/<hash>`);
  }
  assert.equal(txUrl(chainById(10), HASH), `https://optimistic.etherscan.io/tx/${HASH}`);
  assert.equal(addressUrl(chainById(8453), USDC.address), `https://basescan.org/address/${USDC.address}`);
});

/** A fake fetch: each RPC's answer by its address, in turn. */
function fakeFetch(answers) {
  const calls = [];
  const fetch = async (url, init) => {
    calls.push({ url, body: JSON.parse(init.body) });
    const answer = answers[url];
    if (typeof answer === "function") return answer(init);
    if (answer === undefined || answer === "down") throw new TypeError("fetch failed");
    if (typeof answer === "number") return { ok: false, status: answer, json: async () => ({}) };
    return { ok: true, status: 200, json: async () => ({ jsonrpc: "2.0", id: 1, ...answer }) };
  };
  return { fetch, calls };
}

const [BASE_A, BASE_B] = chainById(8453).rpc;

test("an RPC that is down, overloaded or slow gives way to the next", async () => {
  const slow = (init) =>
    new Promise((_, reject) => init.signal.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError"))));
  for (const first of [503, "down", { error: { code: -32005, message: "rate limited" } }, slow]) {
    const { fetch, calls } = fakeFetch({ [BASE_A]: first, [BASE_B]: { result: "0x2105" } });
    const rpc = createRpc(fetch, 50);
    assert.equal(await rpc.request(8453, "eth_chainId", []), "0x2105");
    assert.deepEqual(
      calls.map((call) => call.url),
      [BASE_A, BASE_B],
    );
  }
});

test("an RPC that refuses the request is believed, and none answering is said plainly", async () => {
  const refused = createRpc(fakeFetch({ [BASE_A]: { error: { code: -32602, message: "invalid argument" } } }).fetch);
  await assert.rejects(refused.request(8453, "eth_getTransactionByHash", ["0x"]), (error) => {
    assert.ok(error instanceof RpcError);
    assert.equal(error.message, "invalid argument");
    return true;
  });
  const none = createRpc(fakeFetch({}).fetch);
  await assert.rejects(none.request(8453, "eth_chainId", []), /None of Base's public RPCs answered/);
  await assert.rejects(none.request(137, "eth_chainId", []), /not one the playground reads/);
});

test("a transaction is checked for shape, and a missing one is null", async () => {
  const tx = { from: PERMIT2.address, to: USDC.address, input: "0x095EA7B3", value: "0xde0b6b3a7640000" };
  const rpc = (result) => createRpc(fakeFetch({ [BASE_A]: { result } }).fetch);
  assert.deepEqual(await getTransaction(rpc(tx), 8453, HASH), {
    hash: HASH,
    from: PERMIT2.address,
    to: USDC.address,
    input: "0x095ea7b3",
    value: 10n ** 18n,
  });
  assert.equal((await getTransaction(rpc({ ...tx, to: null }), 8453, HASH)).to, null, "a contract's creation");
  assert.equal(await getTransaction(rpc(null), 8453, HASH), null);
  await assert.rejects(getTransaction(rpc({ ...tx, input: "<script>" }), 8453, HASH), /not a transaction/);
  await assert.rejects(getTransaction(rpc({ ...tx, value: 1 }), 8453, HASH), /not a transaction/);
});

// ── Token metadata ─────────────────────────────────────────────────────

/** A fake chain whose tokens answer eth_call for their decimals, symbol and name. */
function fakeTokens(tokens) {
  const calls = [];
  const rpc = {
    async request(chainId, method, params) {
      calls.push({ chainId, method, params });
      const [{ to, data }] = params;
      const token = tokens[to.toLowerCase()];
      if (!token) throw new RpcError("execution reverted");
      if (data === SELECTOR.decimals) return `0x${word(token.decimals)}`;
      if (data === SELECTOR.symbol) return token.symbol.startsWith("0x") ? token.symbol : abiString(token.symbol);
      if (data === SELECTOR.name) return abiString(token.name);
      throw new RpcError("execution reverted");
    },
  };
  return { rpc, calls };
}

test("a token is read from its own contract once, cleaned, and known tokens are not read at all", async () => {
  const strange = "0x00000000000000000000000000000000000000aa";
  const mkr = "0x00000000000000000000000000000000000000bb";
  const { rpc, calls } = fakeTokens({
    [USDC.address.toLowerCase()]: { decimals: 6, symbol: "USDC", name: "USD Coin" },
    [strange]: { decimals: 18, symbol: "US‮DC", name: "Not USDC" },
    [mkr]: { decimals: 18, symbol: `0x${Buffer.from("MKR").toString("hex").padEnd(64, "0")}`, name: "Maker" },
    "0x00000000000000000000000000000000000000cc": { decimals: 78, symbol: "BIG", name: "Too many decimals" },
  });
  const known = { [`8453:${PERMIT2.address.toLowerCase()}`]: { name: "Known", symbol: "KNW", decimals: 0 } };
  const provider = createProvider(rpc, known);
  assert.deepEqual(await provider.resolveToken(8453, PERMIT2.address), known[`8453:${PERMIT2.address.toLowerCase()}`]);
  assert.equal(calls.length, 0);
  assert.deepEqual(await provider.resolveToken(1, USDC.address), { decimals: 6, symbol: "USDC", name: "USD Coin" });
  const after = calls.length;
  await provider.resolveToken(1, USDC.address.toLowerCase());
  assert.equal(calls.length, after, "read once");
  assert.ok(provider.fetched.has(`1:${USDC.address.toLowerCase()}`));
  assert.equal((await provider.resolveToken(1, strange)).symbol, "US\\u{202e}DC");
  assert.equal((await provider.resolveToken(1, mkr)).symbol, "MKR", "a bytes32 symbol");
  assert.equal(await provider.resolveToken(1, "0x00000000000000000000000000000000000000cc"), null);
  assert.equal(await provider.resolveToken(1, "0x00000000000000000000000000000000000000dd"), null, "not a token");
  assert.equal(await provider.resolveToken(137, USDC.address), null, "not one of the four chains");
  assert.deepEqual(await provider.resolveChainInfo(8453), {
    name: "Base",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  });
  assert.equal(await provider.resolveChainInfo(137), null);
});

test("returned words and strings are decoded, and anything else is not", () => {
  assert.equal(decodeUint(`0x${word(6)}`), 6n);
  assert.equal(decodeUint("0x06"), null);
  assert.equal(decodeString(abiString("USD Coin")), "USD Coin");
  assert.equal(decodeString("0x1234"), null);
  assert.equal(decodeString(`0x${word(32)}${word(1000)}`), null, "a length past the data");
});

// ── Formatting, with the real library ──────────────────────────────────

/** A descriptor for USDC's approve on Ethereum, from the home page's display format. */
const DESCRIPTOR = {
  $schema: "../../specs/erc7730-v2.schema.json",
  context: { $id: "USDC", contract: { deployments: [{ chainId: 1, address: USDC.address }] } },
  metadata: { owner: "Test owner" },
  display: { formats: APPROVE_FORMAT },
};
const PATH = "registry/test/calldata-usdc.json";
const BASE_USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const registry = {
  index: { calldataIndex: { [`eip155:1:${USDC.address.toLowerCase()}`]: PATH }, typedDataIndex: {} },
  file: async (path) => {
    if (path !== PATH) throw new Error(`no ${path}`);
    return DESCRIPTOR;
  },
};
const tokens = createProvider(fakeTokens({}).rpc, {
  [`1:${USDC.address.toLowerCase()}`]: { name: "USD Coin", symbol: "USDC", decimals: 6 },
  [`8453:${BASE_USDC.toLowerCase()}`]: { name: "USD Coin", symbol: "USDC", decimals: 6 },
});
const approve = (amount) => `0x095ea7b3${word(PERMIT2.address)}${word(amount)}`;

test("the library pinned in package.json is the one installed and the one the page names", () => {
  assert.equal(pkg.dependencies["@ethereum-sourcify/clear-signing"], LIBRARY_VERSION);
  assert.equal(installed.version, LIBRARY_VERSION);
});

test("a call the registry describes is formatted as its descriptor says", async () => {
  const display = await clearSign(library, registry, tokens, { chainId: 1, to: USDC.address, data: approve(1_500_000n), value: 0n });
  assert.equal(fallbackReason(display), null);
  assert.equal(display.intent, "Approve USDC");
  assert.deepEqual(
    display.fields.map((field) => [field.label, field.value]),
    [
      ["Spender", PERMIT2.address],
      ["Amount", "1.5 USDC"],
    ],
  );
  const unlimited = await clearSign(library, registry, tokens, {
    chainId: 1,
    to: USDC.address,
    data: approve((1n << 256n) - 1n),
    value: 0n,
  });
  assert.equal(unlimited.fields[1].value, "Unlimited USDC");
});

test("a call the registry does not describe falls back to raw data, and a near miss reads once bound", async () => {
  const call = { chainId: 8453, to: BASE_USDC, data: approve(1_500_000n), value: 0n };
  const raw = await clearSign(library, registry, tokens, call);
  assert.equal(fallbackReason(raw), "no-descriptor");
  assert.equal(raw.rawCalldataFallback.selector, "0x095ea7b3");
  const near = await clearSign(library, registry, tokens, call, { chainId: 8453, address: BASE_USDC, path: PATH });
  assert.equal(fallbackReason(near), null);
  assert.deepEqual(
    near.fields.map((field) => field.value),
    [PERMIT2.address, "1.5 USDC"],
  );
  const other = await clearSign(library, registry, tokens, { ...call, data: `0xa9059cbb${word(PERMIT2.address)}${word(1)}` });
  assert.equal(fallbackReason(other), "no-descriptor");
});

test("binding a near miss copies the descriptor and leaves the registry's own untouched", async () => {
  const nearMiss = { chainId: 8453, address: BASE_USDC, path: PATH };
  const bound = bindTo(DESCRIPTOR, nearMiss);
  assert.deepEqual(bound.context.contract.deployments, [...DESCRIPTOR.context.contract.deployments, { chainId: 8453, address: BASE_USDC }]);
  assert.equal(DESCRIPTOR.context.contract.deployments.length, 1);
  assert.equal(bindTo("not a descriptor", nearMiss), "not a descriptor");
  const resolver = resolverFor(registry, nearMiss);
  assert.equal(resolver.index.calldataIndex[`eip155:8453:${BASE_USDC.toLowerCase()}`], PATH);
  assert.equal(registry.index.calldataIndex[`eip155:8453:${BASE_USDC.toLowerCase()}`], undefined);
  assert.equal(await resolver.fetchAttestation(), null, "attestations are not checked here");
});

test("a fallback says why", () => {
  const raw = { rawCalldataFallback: { selector: "0x12345678", args: [] } };
  assert.equal(fallbackReason({ intent: "Swap", fields: [] }), null);
  assert.equal(fallbackReason({ ...raw, warnings: [{ code: "NO_DESCRIPTOR", message: "" }] }), "no-descriptor");
  assert.equal(fallbackReason({ ...raw, warnings: [{ code: "NO_FORMAT_MATCH", message: "" }] }), "no-format");
  assert.equal(fallbackReason({ ...raw, warnings: [{ code: "DESCRIPTOR_FETCH_ERROR", message: "" }] }), "fetch-error");
  assert.equal(fallbackReason({ ...raw, warnings: [] }), "other");
  assert.equal(
    registryFileUrl("registry/a b/c#d.json"),
    "https://github.com/ethereum/clear-signing-erc7730-registry/blob/master/registry/a%20b/c%23d.json",
  );
});

// ── The coverage data and the examples ─────────────────────────────────

test("every contract in the report is in the playground's data once, with what its card says", () => {
  const { contracts, generatedAt, registryCommit } = playgroundContracts(report);
  const all = report.protocols.flatMap((protocol) => protocol.contracts.map((contract) => ({ protocol, contract })));
  assert.equal(Object.keys(contracts).length, all.length);
  assert.equal(generatedAt, report.generatedAt);
  assert.equal(registryCommit, report.registry.commit);
  for (const { protocol, contract } of all) {
    const entry = contracts[contractKey(contract.chainId, contract.address)];
    assert.ok(entry, `${contract.label} on ${contract.chainId}`);
    assert.equal(entry.protocol.id, protocol.id);
    assert.equal(entry.status, contract.status);
    assert.equal(entry.elsewhere?.path ?? null, contract.elsewhere?.path ?? null);
    assert.equal(entry.draft?.preview?.txHash ?? null, contract.draft?.preview?.txHash ?? null);
    if (entry.reach) assert.ok(entry.reach.share >= 0 && entry.reach.share <= 1);
    for (const selector of Object.keys(entry.functions)) assert.match(selector, /^0x[0-9a-f]{8}$/);
  }
  assert.equal(contractAnchor(8453, BASE_USDC), `contract-8453-${BASE_USDC.toLowerCase()}`);
});

test("each most-called function with a real call links the playground to that call, on its contract's chain", () => {
  let links = 0;
  for (const contract of report.protocols.flatMap((protocol) => protocol.contracts))
    for (const fn of contract.topFunctions) {
      if (fn.exampleTx === null) continue;
      const href = txInPlayground(contract.chainId, fn.exampleTx);
      const url = new URL(href, "https://b3pay.net");
      assert.equal(url.pathname, PLAYGROUND_PATH);
      assert.equal(url.search, "", "nothing looked up reaches the server");
      assert.deepEqual(requestFromHash(url.hash), { ok: true, value: { kind: "hash", chainId: contract.chainId, hash: fn.exampleTx } });
      links += 1;
    }
  // Most of them: the sample keeps calls of the busiest selectors, so a few top functions have none.
  const all = report.protocols.flatMap((protocol) => protocol.contracts.flatMap((contract) => contract.topFunctions)).length;
  assert.ok(links >= all * 0.9, `${links} of ${all} top functions link a real call`);
});

test("each example is a real call to a contract the report lists, and shows what it is there for", () => {
  const { contracts } = playgroundContracts(report);
  const seen = new Set();
  for (const example of EXAMPLES) {
    assert.ok(!seen.has(example.id), `${example.id} is listed once`);
    seen.add(example.id);
    assert.ok(chainById(example.chainId), example.id);
    assert.equal(parseHash(example.hash).ok, true, example.id);
    assert.equal(parseAddress(example.from).ok, true, example.id);
    assert.equal(parseCalldata(example.data).value, example.data, example.id);
    assert.match(example.value, /^\d+$/);
    assert.ok(contracts[contractKey(example.chainId, example.to)], `${example.id} calls a contract the report lists`);
  }
  const of = (id) => contracts[contractKey(EXAMPLES.find((e) => e.id === id).chainId, EXAMPLES.find((e) => e.id === id).to)];
  const formatted = EXAMPLES.filter((example) => of(example.id).status !== "uncovered");
  assert.deepEqual(
    [...new Set(formatted.map((example) => example.chainId))].sort(),
    CHAINS.map((chain) => chain.id).sort(),
    "one call the registry formats on each chain",
  );
  assert.ok(EXAMPLES.some((example) => of(example.id).status === "uncovered" && !of(example.id).elsewhere && !of(example.id).draft));
  assert.ok(EXAMPLES.some((example) => of(example.id).elsewhere), "a near miss");
  const drafted = EXAMPLES.find((example) => of(example.id).draft?.preview);
  assert.ok(drafted, "a contract with a draft");
  assert.equal(of(drafted.id).draft.preview.txHash.toLowerCase(), drafted.hash, "whose preview is the example's own call");
  for (const [key, token] of Object.entries(EXAMPLE_TOKENS)) {
    assert.match(key, /^(1|8453|42161|10):0x[0-9a-f]{40}$/);
    assert.ok(Number.isInteger(token.decimals) && token.decimals >= 0 && token.decimals <= 77);
    assert.equal(cleanText(token.symbol), token.symbol);
  }
});
