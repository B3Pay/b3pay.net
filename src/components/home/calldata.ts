/**
 * The contract calls the home page shows, built from their arguments.
 *
 * Every hex string the page prints comes from here, so it is exactly the
 * calldata a wallet receives for the call described beside it, and every
 * readable line is worked out from the same arguments. The descriptor excerpt
 * the page shows is here too, and the hero's readable view is read from it.
 *
 * scripts/home-calldata.test.mjs checks each selector against Keccak-256 of
 * its signature, the encoding against calldata written out by hand, the
 * addresses' checksums, and the readable lines against the arguments.
 */

export type Arg =
  { type: "address"; value: string } | { type: "uint256"; value: bigint } | { type: "bool"; value: boolean };

export interface Call {
  /** The canonical signature: the function's name and argument types, nothing else. */
  signature: string;
  /** The first four bytes of Keccak-256 of the signature, as 8 lowercase hex digits. */
  selector: string;
  args: Arg[];
}

const ADDRESS = /^0x[0-9a-fA-F]{40}$/;

export const MAX_UINT256 = (1n << 256n) - 1n;

/** An argument as its 32-byte ABI word, 64 lowercase hex digits. Static types only. */
export function word(arg: Arg): string {
  switch (arg.type) {
    case "address":
      if (!ADDRESS.test(arg.value)) throw new Error(`not an address: ${arg.value}`);
      return arg.value.slice(2).toLowerCase().padStart(64, "0");
    case "uint256":
      if (arg.value < 0n || arg.value > MAX_UINT256) throw new Error(`not a uint256: ${arg.value}`);
      return arg.value.toString(16).padStart(64, "0");
    case "bool":
      return (arg.value ? "1" : "0").padStart(64, "0");
  }
}

/** A call's calldata: its selector, then one word per argument. */
export function encode(call: Call): string {
  return `0x${call.selector}${call.args.map(word).join("")}`;
}

/** An address shortened in the middle, as the design system writes it: `0x3b9f…a21c`. */
export function shortAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

/** An amount in a token's smallest unit, in whole tokens: `1500000000n, 6` is "1,500". */
export function formatUnits(value: bigint, decimals: number): string {
  const unit = 10n ** BigInt(decimals);
  const whole = (value / unit).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const fraction = (value % unit).toString().padStart(decimals, "0").replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole;
}

/** Contracts on Ethereum mainnet, by their checksummed addresses. */
export const USDC = {
  name: "USD Coin",
  symbol: "USDC",
  decimals: 6,
  address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
};
export const DAI = {
  name: "Dai",
  symbol: "DAI",
  decimals: 18,
  address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
};
export const WETH = {
  name: "Wrapped Ether",
  symbol: "WETH",
  decimals: 18,
  address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
};
export const PERMIT2 = {
  name: "Permit2",
  address: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
};

/**
 * The display format an ERC-7730 descriptor for USDC would give `approve`,
 * keyed by the function's signature with the parameter names of the verified
 * implementation's ABI (FiatToken: `spender`, `value`). An illustration: it
 * passes python-erc7730's lint, and has not been tested against a
 * transaction, submitted or attested.
 */
export const APPROVE_FORMAT = {
  "approve(address spender,uint256 value)": {
    intent: "Approve USDC",
    fields: [
      {
        path: "#.spender",
        label: "Spender",
        format: "addressName",
        params: { types: ["eoa", "contract"], sources: ["local", "ens"] },
      },
      {
        path: "#.value",
        label: "Amount",
        format: "tokenAmount",
        params: {
          tokenPath: "@.to",
          threshold: "0x8000000000000000000000000000000000000000000000000000000000000000",
          message: "Unlimited",
        },
      },
    ],
  },
} as const;

const format = APPROVE_FORMAT["approve(address spender,uint256 value)"];
const [spenderField, amountField] = format.fields;

/** Approving Uniswap's Permit2 contract to spend any amount of your USDC. */
export const APPROVE: Call = {
  signature: "approve(address,uint256)",
  selector: "095ea7b3",
  args: [
    { type: "address", value: PERMIT2.address },
    { type: "uint256", value: MAX_UINT256 },
  ],
};

/**
 * `tokenAmount`: the amount in whole tokens and the token's ticker, or, at or
 * above the threshold, the message and the ticker ("Unlimited USDC"), as
 * ERC-7730's field formats table says.
 */
function amount(value: bigint): string {
  const shown =
    value >= BigInt(amountField.params.threshold) ? amountField.params.message : formatUnits(value, USDC.decimals);
  return `${shown} ${USDC.symbol}`;
}

/** The hero's signature request, as a wallet sees it at each step. */
export const HERO = {
  network: "Ethereum",
  to: USDC,
  calldata: encode(APPROVE),
  /** The calldata cut where each part starts: the selector, then each argument's word. */
  parts: [`0x${APPROVE.selector}`, ...APPROVE.args.map(word)],
  /** Decoded with the ABI alone: the function, and each argument by its name. */
  decoded: [
    { label: "function", value: "approve(address spender, uint256 value)" },
    { label: "spender", value: PERMIT2.address.toLowerCase() },
    { label: "value", value: MAX_UINT256.toString() },
  ],
  /** Formatted by the descriptor: its intent, then each field. */
  readable: [
    { label: "", value: format.intent },
    {
      label: spenderField.label,
      value: PERMIT2.name,
      detail: shortAddress(PERMIT2.address),
    },
    { label: amountField.label, value: amount(MAX_UINT256) },
  ],
};

const ADDRESSES = [
  "0x37620C975370b7662C702BBA9B2187A1DAfa4934",
  "0xeceff220811761B0A42B655d223AfAf2Dfd0B07A",
  "0xD8d2589634Ca0d4c4826d8dF81F72A79a414410A",
  "0xe69f03fcF104c7a2806399a4a854296AA71E3770",
  "0x9E5b802D5B8C655a87e648945d77a1b63c2F6457",
  "0xd2AC4918611F91Fd39d89459064C0422D227629d",
  "0xF9E65c64699bf5478A4433CDe24077E3E798eac8",
  "0xA54E75Fc5d32e02d68dFfC96FB1ff001b16226D2",
];
const a = (i: number) => ADDRESSES[i] as string;
const address = (value: string): Arg => ({ type: "address", value });
const uint = (value: bigint): Arg => ({ type: "uint256", value });

/** A call to a contract, and the sentence a wallet could show for it. */
export interface Example {
  /** The token called, when the sentence needs its symbol and decimals. */
  to?: typeof USDC;
  call: Call;
  says: string;
}

/**
 * The calls behind the hero. The tokens are real; the other addresses are
 * made up, from a hash.
 */
export const BACKDROP: Example[] = [
  {
    to: USDC,
    call: {
      signature: "transfer(address,uint256)",
      selector: "a9059cbb",
      args: [address(a(0)), uint(1_500_000_000n)],
    },
    says: `Send 1,500 USDC to ${shortAddress(a(0))}`,
  },
  {
    to: USDC,
    call: APPROVE,
    says: `Approve ${PERMIT2.name} to spend unlimited USDC`,
  },
  {
    to: WETH,
    call: {
      signature: "withdraw(uint256)",
      selector: "2e1a7d4d",
      args: [uint(750_000_000_000_000_000n)],
    },
    says: "Unwrap 0.75 WETH",
  },
  {
    call: {
      signature: "setApprovalForAll(address,bool)",
      selector: "a22cb465",
      args: [address(a(2)), { type: "bool", value: true }],
    },
    says: `Let ${shortAddress(a(2))} move all your NFTs in this collection`,
  },
  {
    to: DAI,
    call: {
      signature: "transfer(address,uint256)",
      selector: "a9059cbb",
      args: [address(a(1)), uint(250n * 10n ** 18n)],
    },
    says: `Send 250 DAI to ${shortAddress(a(1))}`,
  },
  {
    call: {
      signature: "safeTransferFrom(address,address,uint256)",
      selector: "42842e0e",
      args: [address(a(3)), address(a(4)), uint(4821n)],
    },
    says: `Send NFT #4821 to ${shortAddress(a(4))}`,
  },
  {
    call: {
      signature: "delegate(address)",
      selector: "5c19a95c",
      args: [address(a(5))],
    },
    says: `Delegate your votes to ${shortAddress(a(5))}`,
  },
  {
    to: WETH,
    call: {
      signature: "transferFrom(address,address,uint256)",
      selector: "23b872dd",
      args: [address(a(6)), address(a(7)), uint(12_500_000_000_000_000_000n)],
    },
    says: `Move 12.5 WETH from ${shortAddress(a(6))} to ${shortAddress(a(7))}`,
  },
  {
    to: DAI,
    call: {
      signature: "approve(address,uint256)",
      selector: "095ea7b3",
      args: [address(a(0)), uint(1000n * 10n ** 18n)],
    },
    says: `Approve ${shortAddress(a(0))} to spend 1,000 DAI`,
  },
];
