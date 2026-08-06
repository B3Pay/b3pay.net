import type { B3Color } from "@b3pay/ui";

export const SITE_URL = "https://docs.b3pay.net";
export const SITE_NAME = "B3Pay Docs";
export const OG_IMAGE = "https://b3pay.net/og.png";
export const MAIN_SITE = "https://b3pay.net";
export const GITHUB_ORG = "https://github.com/B3Pay";

/** Where "Edit this page" and "Report an issue" point. */
export const DOCS_REPO = "b3hr4d/b3pay.net";

export interface DocNavItem {
  /** Matches the `.mdx` filename under `content/<project>/`. */
  slug: string;
  label: string;
  /** Mono glyph in the sidebar row — the design uses ★ for the entry point. */
  badge?: string;
}

export interface DocNavSection {
  label: string;
  items: DocNavItem[];
}

export interface DocProject {
  /** URL segment and content directory name. */
  key: string;
  name: string;
  /** One line, shown on the docs home card. Lifted from the product entry. */
  line: string;
  /** Badge beside "Docs" in the top bar. */
  tag: string;
  tagColor: B3Color;
  /** `owner/name` on GitHub. */
  repo: string;
  /** Version switcher contents. Newest first; the first is the one served. */
  versions: string[];
  sections: DocNavSection[];
}

/**
 * The one docs table.
 *
 * The sidebar, the ⌘K palette, the prev/next footer, sitemap.xml and the
 * per-page static HTML the build emits all read from here. `content/pages.ts`
 * cross-checks it against the `.mdx` files on disk and fails the build when the
 * two disagree, so a page cannot be written and left unreachable, or listed
 * here and 404 in production.
 *
 * Product names, taglines and repos are transcribed from
 * `apps/web/src/site/products.ts` — the marketing site and the docs describe
 * the same four projects and should not drift.
 */
export const PROJECTS: DocProject[] = [
  {
    key: "ic-reactor",
    name: "IC Reactor",
    line: "Type-safe Internet Computer integration for TypeScript and React. Seven packages, end-to-end types, TanStack Query caching.",
    tag: "MIT",
    tagColor: "info",
    repo: "B3Pay/ic-reactor",
    versions: ["v1.2.0", "v1.1.4", "v1.0.9"],
    sections: [
      {
        label: "Getting started",
        items: [
          { slug: "why", label: "Why IC Reactor" },
          { slug: "install", label: "Install" },
          { slug: "quickstart", label: "Quick start", badge: "★" },
        ],
      },
      {
        label: "Core patterns",
        items: [
          { slug: "hooks", label: "Generic hooks" },
          { slug: "factories", label: "Query factories" },
          { slug: "display", label: "DisplayReactor" },
        ],
      },
      {
        label: "Codegen",
        items: [
          { slug: "vite", label: "Vite plugin" },
          { slug: "cli", label: "CLI" },
        ],
      },
      {
        label: "Reference",
        items: [
          { slug: "api", label: "API reference" },
          { slug: "candid", label: "Dynamic Candid" },
        ],
      },
    ],
  },
  {
    key: "b3forge",
    name: "B3Forge",
    line: "Candid-native workflow platform. Compose canister calls into typed workflows in a visual graph editor and run them in the browser.",
    tag: "Beta",
    tagColor: "warning",
    repo: "B3Pay/b3forge",
    versions: ["beta"],
    sections: [
      {
        label: "Getting started",
        items: [
          { slug: "overview", label: "Overview" },
          { slug: "first-workflow", label: "Your first workflow", badge: "★" },
        ],
      },
      {
        label: "Building workflows",
        items: [
          { slug: "nodes", label: "Nodes and bindings" },
          { slug: "expressions", label: "Expressions" },
          { slug: "execution", label: "Browser execution" },
        ],
      },
      {
        label: "Community",
        items: [{ slug: "catalog", label: "Publishing to the catalog" }],
      },
    ],
  },
  {
    key: "b3wallet",
    name: "B3Wallet",
    line: "Self-custodial multi-chain, multi-owner wallet. Bitcoin, Ethereum and Internet Computer from one canister you control.",
    tag: "Live",
    tagColor: "success",
    repo: "B3Pay/B3Wallet",
    versions: ["v0.1.0"],
    sections: [
      {
        label: "Getting started",
        items: [
          { slug: "overview", label: "Overview" },
          { slug: "deploy", label: "Deploy a wallet", badge: "★" },
        ],
      },
      {
        label: "Ownership",
        items: [
          { slug: "owners", label: "Owners and signers" },
          { slug: "consensus", label: "Consensus rules" },
        ],
      },
      {
        label: "Chains",
        items: [
          { slug: "chains", label: "Supported chains" },
          { slug: "upgrades", label: "Self-upgrading canister" },
        ],
      },
    ],
  },
  {
    key: "b3note",
    name: "B3Note",
    line: "Anonymous note sharing with witness-like encryption. Notes and share links expire in an hour, then the canister timer deletes them.",
    tag: "Demo",
    tagColor: "muted",
    repo: "B3Pay/B3Note",
    versions: ["demo"],
    sections: [
      {
        label: "Getting started",
        items: [
          { slug: "overview", label: "Overview" },
          { slug: "run-locally", label: "Run it locally", badge: "★" },
        ],
      },
      {
        label: "How it works",
        items: [
          { slug: "encryption", label: "VetKeys encryption" },
          { slug: "expiry", label: "Expiry and timers" },
        ],
      },
    ],
  },
];

export const projectByKey = (key: string): DocProject | undefined =>
  PROJECTS.find((p) => p.key === key);

export const repoUrl = (repo: string) => `https://github.com/${repo}`;
