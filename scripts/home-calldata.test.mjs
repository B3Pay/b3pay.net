/**
 * The home page prints contract calls twice: as the calldata a wallet
 * receives, and as what a person reads. These tests hold the two together:
 * each selector against Keccak-256 of its signature, the encoding against
 * calldata written out by hand, every address's checksum, and every sentence
 * against the arguments it describes.
 *
 * Keccak-256 is Node's own (`keccak-256`, OpenSSL 3.2 and later), so this
 * needs Node 24, the version the site builds with.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  APPROVE,
  APPROVE_FORMAT,
  BACKDROP,
  DAI,
  HERO,
  MAX_UINT256,
  PERMIT2,
  USDC,
  WETH,
  encode,
  formatUnits,
  shortAddress,
  word,
} from "../src/components/home/calldata.ts";
import { formatLines } from "../src/components/home/descriptor.ts";

const keccak = (text) => createHash("keccak-256").update(text).digest("hex");

/** EIP-55: a letter is upper case when the same digit of the lower-case address's hash is 8 or more. */
function checksum(address) {
  const hex = address.slice(2).toLowerCase();
  const hash = keccak(hex);
  return `0x${[...hex].map((c, i) => (Number.parseInt(hash[i], 16) >= 8 ? c.toUpperCase() : c)).join("")}`;
}

const CALLS = [APPROVE, ...BACKDROP.map((example) => example.call)];

test("the hash is Keccak-256, not SHA3-256", () => {
  assert.equal(keccak(""), "c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470");
  assert.equal(keccak("transfer(address,uint256)").slice(0, 8), "a9059cbb");
});

test("every selector is the start of its signature's hash", () => {
  for (const call of CALLS) assert.equal(call.selector, keccak(call.signature).slice(0, 8), call.signature);
});

test("every call has the arguments its signature names", () => {
  for (const call of CALLS) {
    const types = call.signature
      .slice(call.signature.indexOf("(") + 1, -1)
      .split(",")
      .filter(Boolean);
    assert.deepEqual(
      call.args.map((arg) => arg.type),
      types,
      call.signature,
    );
  }
});

test("the hero's calldata is approve(Permit2, 2^256 - 1), byte for byte", () => {
  assert.equal(
    HERO.calldata,
    "0x095ea7b3" +
      "000000000000000000000000000000000022d473030f116ddee9f6b43ac78ba3" +
      "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
  );
  assert.equal(HERO.parts.join(""), HERO.calldata);
  assert.deepEqual(
    HERO.parts.map((part) => part.length),
    [10, 64, 64],
  );
});

test("the hero decodes to the arguments it encodes", () => {
  const [fn, spender, value] = HERO.decoded;
  assert.equal(fn.value.replace(/ \w+(?=[,)])/g, "").replace(/ /g, ""), APPROVE.signature);
  assert.equal(spender.value, `0x${HERO.parts[1].slice(24)}`);
  assert.equal(BigInt(value.value), BigInt(`0x${HERO.parts[2]}`));
  assert.equal(BigInt(value.value), MAX_UINT256);
});

test("the hero's readable view is what the descriptor formats", () => {
  const [signature, format] = Object.entries(APPROVE_FORMAT)[0];
  // The key is the signature with the implementation's parameter names.
  assert.equal(signature.replace(/ \w+(?=[,)])/g, ""), APPROVE.signature);
  const names = [...signature.matchAll(/ (\w+)(?=[,)])/g)].map((match) => match[1]);
  assert.deepEqual(
    format.fields.map((field) => field.path),
    names.map((name) => `#.${name}`),
  );
  const [intent, spender, amount] = HERO.readable;
  // What the rest of the page says the hero shows, and the token the call goes to.
  assert.deepEqual(
    HERO.readable.map((row) => row.value),
    ["Approve USDC", "Permit2", "Unlimited USDC"],
  );
  assert.equal(HERO.to.address, USDC.address);
  assert.equal(intent.value, format.intent);
  assert.equal(spender.label, format.fields[0].label);
  assert.equal(spender.value, "Permit2");
  assert.equal(spender.detail, shortAddress(PERMIT2.address));
  const { threshold, message } = format.fields[1].params;
  assert.equal(BigInt(threshold), 1n << 255n);
  assert.ok(MAX_UINT256 >= BigInt(threshold), "the amount is at or above the threshold");
  assert.equal(amount.label, format.fields[1].label);
  // At or above the threshold a wallet shows the message with the ticker, as
  // ERC-7730's example "Unlimited DAI" does.
  assert.equal(amount.value, `${message} ${HERO.to.symbol}`);
});

test("the descriptor excerpt on the page is the descriptor the hero reads", () => {
  const lines = formatLines();
  const text = lines.map((line) => "  ".repeat(line.indent) + line.text).join("\n");
  assert.deepEqual(JSON.parse(`{${text}}`), APPROVE_FORMAT);
  // Each lit part is the lines that make it, and only those.
  const lit = (beat) => lines.filter((line) => line.beat === beat).map((line) => line.text);
  assert.ok(lit(1)[0].startsWith('"approve(address spender,uint256 value)"'));
  assert.ok(lit(1).some((text) => text.startsWith('"intent"')));
  assert.ok(lit(2).includes('"path": "#.spender",'));
  assert.ok(lit(3).includes('"path": "#.value",'));
  assert.ok(lit(3).some((text) => text.startsWith('"threshold"')));
  assert.ok(!lit(2).some((text) => text.includes("#.value")));
  assert.ok(!lit(3).some((text) => text.includes("#.spender")));
});

test("every address carries its EIP-55 checksum", () => {
  const addresses = [USDC.address, DAI.address, WETH.address, PERMIT2.address];
  for (const call of CALLS) for (const arg of call.args) if (arg.type === "address") addresses.push(arg.value);
  for (const address of addresses) assert.equal(address, checksum(address));
  assert.equal(USDC.address, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
  assert.equal(PERMIT2.address, "0x000000000022D473030F116dDEE9F6B43aC78BA3");
});

test("each backdrop sentence says what its arguments do", () => {
  const name = (address) => (address === PERMIT2.address ? PERMIT2.name : shortAddress(address));
  const amount = (to, value) =>
    value >= 1n << 255n ? `unlimited ${to.symbol}` : `${formatUnits(value, to.decimals)} ${to.symbol}`;
  const SAY = {
    "transfer(address,uint256)": (to, [recipient, value]) =>
      `Send ${formatUnits(value, to.decimals)} ${to.symbol} to ${shortAddress(recipient)}`,
    "approve(address,uint256)": (to, [spender, value]) => `Approve ${name(spender)} to spend ${amount(to, value)}`,
    "withdraw(uint256)": (to, [wad]) => `Unwrap ${formatUnits(wad, to.decimals)} ${to.symbol}`,
    "setApprovalForAll(address,bool)": (_, [operator, approved]) =>
      approved ? `Let ${shortAddress(operator)} move all your NFTs in this collection` : null,
    "safeTransferFrom(address,address,uint256)": (_, [, recipient, id]) =>
      `Send NFT #${id} to ${shortAddress(recipient)}`,
    "delegate(address)": (_, [delegatee]) => `Delegate your votes to ${shortAddress(delegatee)}`,
    "transferFrom(address,address,uint256)": (to, [from, recipient, value]) =>
      `Move ${formatUnits(value, to.decimals)} ${to.symbol} from ${shortAddress(from)} to ${shortAddress(recipient)}`,
  };
  for (const { to, call, says } of BACKDROP) {
    const say = SAY[call.signature];
    assert.ok(say, `no sentence rule for ${call.signature}`);
    assert.equal(
      says,
      say(
        to,
        call.args.map((arg) => arg.value),
      ),
    );
  }
});

test("words are 32 bytes, and out-of-range values are refused", () => {
  assert.equal(word({ type: "bool", value: true }), "0".repeat(63) + "1");
  assert.equal(word({ type: "uint256", value: 0n }), "0".repeat(64));
  assert.equal(word({ type: "uint256", value: MAX_UINT256 }), "f".repeat(64));
  assert.equal(
    word({ type: "address", value: PERMIT2.address }),
    "0".repeat(24) + PERMIT2.address.slice(2).toLowerCase(),
  );
  assert.throws(() => word({ type: "uint256", value: MAX_UINT256 + 1n }));
  assert.throws(() => word({ type: "uint256", value: -1n }));
  assert.throws(() => word({ type: "address", value: "0x1234" }));
  for (const call of CALLS) assert.equal(encode(call).length, 2 + 8 + 64 * call.args.length);
});

test("amounts are written in whole tokens", () => {
  assert.equal(formatUnits(1_500_000_000n, 6), "1,500");
  assert.equal(formatUnits(750_000_000_000_000_000n, 18), "0.75");
  assert.equal(formatUnits(12_500_000_000_000_000_000n, 18), "12.5");
  assert.equal(formatUnits(1_234_567_890_123n, 6), "1,234,567.890123");
  assert.equal(formatUnits(1n, 6), "0.000001");
  assert.equal(formatUnits(0n, 18), "0");
  assert.equal(shortAddress(USDC.address), "0xA0b8…eB48");
});
