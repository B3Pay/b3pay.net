import type { B3Color } from "@b3pay/ui";

/**
 * Every claim here is transcribed from a B3Pay repository README via the design
 * system's `ui_kits/website/site.jsx`. Nothing is invented marketing copy — if a
 * product line reads thin, that is a question for the B3Pay team.
 */
export interface Product {
  key: string;
  name: string;
  tag: string;
  tagColor: B3Color;
  lang: string;
  line: string;
  points: string[];
  repo: string;
  ic: string;
  /**
   * This project's first page on docs.b3pay.net, origin excluded.
   *
   * Must match the first nav entry for the project in
   * `apps/docs/src/content/registry.ts`. The two sites deploy as separate
   * Vercel projects, so nothing checks this at build time — the deep link is
   * still worth it over `/<key>`, which exists only as a client-side redirect
   * and would hand a crawler an empty document.
   */
  docs: string;
}

export const PRODUCTS: Product[] = [
  {
    key: "b3forge",
    name: "B3Forge",
    tag: "Beta",
    tagColor: "warning",
    lang: "Rust · TypeScript",
    line: "Candid-native workflow platform. Compose canister calls into typed workflows in a visual graph editor and run them in the browser.",
    points: [
      "Visual node graph with type-checked bindings",
      "Expressions reference prior outputs as $N0.amount",
      "Browser execution with a delegated identity",
      "Community catalog — publish and fork workflows",
    ],
    repo: "B3Pay/b3forge",
    docs: "/b3forge/overview",
    ic: "Rust/WASM compatibility engine",
  },
  {
    key: "b3wallet",
    name: "B3Wallet",
    tag: "Live",
    tagColor: "success",
    lang: "Rust · React",
    line: "Self-custodial multi-chain, multi-owner wallet. Bitcoin, Ethereum and Internet Computer from one canister you control.",
    points: [
      "Single-owner, multi-owner and multi-signature",
      "50%+1 consensus for transaction approval",
      "No registration, no backup phrase to lose",
      "Self-upgrading canister",
    ],
    repo: "B3Pay/B3Wallet",
    docs: "/b3wallet/overview",
    ic: "b3wallet_lib · operations · b3_utils",
  },
  {
    key: "ic-reactor",
    name: "IC Reactor",
    tag: "MIT",
    tagColor: "info",
    lang: "TypeScript · React",
    line: "Type-safe Internet Computer integration for TypeScript and React. Seven packages, end-to-end types, TanStack Query caching.",
    points: [
      "defineReactor() wires the whole client in one call",
      "useActorQuery / useActorMutation hook factories",
      "Typed Ok/Err result handling",
      "Codegen via CLI or the Vite plugin",
    ],
    repo: "B3Pay/ic-reactor",
    docs: "/ic-reactor/why",
    ic: "@ic-reactor/core · react · candid · cli",
  },
  {
    key: "b3note",
    name: "B3Note",
    tag: "Demo",
    tagColor: "muted",
    lang: "Rust",
    line: "Anonymous note sharing with witness-like encryption. Notes and share links expire in an hour, then the canister timer deletes them.",
    points: [
      "No login — up to 5 notes per anonymous user",
      "Identity-based encryption via the VetKeys API",
      "Share links carry an on-chain verifiable signature",
      "Auto-delete on first read or after one hour",
    ],
    repo: "B3Pay/B3Note",
    docs: "/b3note/overview",
    ic: "BLS pairing · VetKeys · timelock",
  },
];

export const GITHUB_ORG = "https://github.com/B3Pay";

/** The documentation site. A separate Vercel project over the same repository. */
export const DOCS_URL = "https://docs.b3pay.net";

export const repoUrl = (repo: string) => `https://github.com/${repo}`;

export const docsUrl = (p: Product) => `${DOCS_URL}${p.docs}`;
