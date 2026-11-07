/**
 * Keccak-256, as Ethereum uses it, and the EIP-55 checksum built on it, for
 * the tests that check selectors and addresses (home-calldata.test.mjs and
 * coverage.test.mjs).
 *
 * It is written out here because Node's own `keccak-256` digest is missing
 * from some releases: Node 24.15 and 22 throw "Digest method not supported";
 * 24.22 has the digest. home-calldata.test.mjs checks it against known
 * digests.
 */

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
export function keccak(text) {
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
export function checksum(address) {
  const hex = address.slice(2).toLowerCase();
  const hash = keccak(hex);
  return `0x${[...hex].map((c, i) => (Number.parseInt(hash[i], 16) >= 8 ? c.toUpperCase() : c)).join("")}`;
}
