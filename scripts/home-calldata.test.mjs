/**
 * The home page prints contract calls twice: as the calldata a wallet
 * receives, and as what a person reads. These tests hold the two together:
 * each selector against Keccak-256 of its signature, the encoding against
 * calldata written out by hand, every address's checksum, and every sentence
 * against the arguments it describes.
 *
 * Keccak-256 is written out below, because Node's own `keccak-256` digest is
 * missing from some releases. Node 24.15 and 22 throw "Digest method not
 * supported"; 24.22 has the digest.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
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

// Keccak-f[1600]'s round constants, from its LFSR, and its rotation offsets,
// from its walk over (x, y), as FIPS 202 defines them.
const ROUNDS = [];
const OFFSETS = Array(25).fill(0);
for (let round = 0, lfsr = 1; round < 24; round++) {
  let constant = 0n;
  for (let j = 0; j < 7; j++) {
    if (lfsr & 1) constant |= 1n << BigInt(2 ** j - 1);
    lfsr = lfsr & 0x80 ? (lfsr << 1) ^ 0x171 : lfsr << 1; // x^8 + x^6 + x^5 + x^4 + 1
  }
  ROUNDS.push(constant);
}
for (let t = 0, x = 1, y = 0; t < 24; t++) {
  OFFSETS[x + 5 * y] = (((t + 1) * (t + 2)) / 2) % 64;
  [x, y] = [y, (2 * x + 3 * y) % 5];
}

const MASK = (1n << 64n) - 1n;
const rotl = (lane, n) => ((lane << BigInt(n)) | (lane >> BigInt(64 - n))) & MASK;

/** Keccak-f[1600] over 25 lanes of 64 bits, lane (x, y) at index x + 5y. */
function permute(state) {
  for (const constant of ROUNDS) {
    // θ: each lane takes the parity of the columns on either side.
    const parity = [0, 1, 2, 3, 4].map((x) => state[x] ^ state[x + 5] ^ state[x + 10] ^ state[x + 15] ^ state[x + 20]);
    for (let x = 0; x < 5; x++) {
      const d = parity[(x + 4) % 5] ^ rotl(parity[(x + 1) % 5], 1);
      for (let i = x; i < 25; i += 5) state[i] ^= d;
    }
    // ρ and π: rotate each lane, and move it from (x, y) to (y, 2x + 3y).
    const moved = Array(25);
    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 5; y++) moved[y + 5 * ((2 * x + 3 * y) % 5)] = rotl(state[x + 5 * y], OFFSETS[x + 5 * y]);
    }
    // χ: each lane mixes with the next two of its row.
    for (let row = 0; row < 25; row += 5) {
      for (let x = 0; x < 5; x++) {
        state[row + x] = moved[row + x] ^ (~moved[row + ((x + 1) % 5)] & moved[row + ((x + 2) % 5)]);
      }
    }
    // ι
    state[0] ^= constant;
  }
}

/**
 * Keccak-256 of a string's UTF-8 bytes, in hex. It pads as Ethereum's Keccak
 * does (0x01, zeros, 0x80), not as SHA3-256 does (0x06, zeros, 0x80).
 */
function keccak(text) {
  const RATE = 136; // bytes absorbed per permutation: 1600 bits less a 512-bit capacity
  const bytes = [...Buffer.from(text, "utf8"), 0x01];
  while (bytes.length % RATE) bytes.push(0);
  bytes[bytes.length - 1] |= 0x80;
  const state = Array(25).fill(0n);
  for (let block = 0; block < bytes.length; block += RATE) {
    // Lanes are little-endian.
    for (let i = 0; i < RATE; i++) state[i >> 3] ^= BigInt(bytes[block + i]) << BigInt(8 * (i % 8));
    permute(state);
  }
  const digest = Array.from({ length: 32 }, (_, i) => Number((state[i >> 3] >> BigInt(8 * (i % 8))) & 0xffn));
  return Buffer.from(digest).toString("hex");
}

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
  // Where the padding can go wrong: one byte short of a block, a whole block,
  // and three blocks. These digests are OpenSSL's KECCAK-256 and
  // PyCryptodome's, which agree.
  assert.equal(keccak("a".repeat(135)), "34367dc248bbd832f4e3e69dfaac2f92638bd0bbd18f2912ba4ef454919cf446");
  assert.equal(keccak("a".repeat(136)), "a6c4d403279fe3e0af03729caada8374b5ca54d8065329a3ebcaeb4b60aa386e");
  assert.equal(keccak("a".repeat(300)), "5b7e0e47a96f32a88b4f14ca177982790807c40e1a105742ba0fc1babe1ef826");
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
