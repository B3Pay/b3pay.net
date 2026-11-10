/**
 * What the Clear Signing service costs, in one place: /clear-signing/pricing/
 * shows these plans and terms, and no other page or component writes a price.
 * scripts/pricing.test.mjs checks both: that every amount here is a whole,
 * positive number of US dollars, and that no page or component carries a
 * dollar amount of its own. To change a price, change it here.
 */

/** A price: whole US dollars, and the words after it ("for the first contract"). */
export interface Price {
  readonly usd: number;
  readonly unit: string;
}

export interface Plan {
  /** The card's id on the page, `plan-<id>`, for links to one plan. */
  readonly id: "coverage" | "fix" | "upkeep";
  readonly name: string;
  /** What it is, as the card's title. */
  readonly title: string;
  /** Who it is for, in one sentence. */
  readonly audience: string;
  /** The headline price first, then any that follows it. */
  readonly prices: readonly [Price, ...Price[]];
  /** What it includes, one sentence each. */
  readonly includes: readonly string[];
  /** When the work is delivered or how it is billed, in one sentence. */
  readonly terms: string;
}

export const PLANS: readonly Plan[] = [
  {
    id: "coverage",
    name: "Coverage",
    title: "Descriptors for your contracts",
    audience: "For contracts the registry does not describe yet.",
    prices: [
      { usd: 1500, unit: "for the first contract" },
      { usd: 500, unit: "for each contract after it" },
    ],
    includes: [
      "The scope: the contracts and functions your users sign, on every chain you are deployed to.",
      "A descriptor for each contract, from its verified ABI, listing it on every chain and at every address it is deployed to.",
      "A test from a real transaction for every function, and the official linter's schema and ABI checks.",
      "The pull request to the registry, with your sign-off, and answers to its reviewers until it merges.",
    ],
    terms: "The pull request opens within 10 business days of the start, for up to five contracts.",
  },
  {
    id: "fix",
    name: "Fix",
    title: "A descriptor that falls short",
    audience: "For a descriptor that misses some of your deployments, no longer matches its contract, or is stuck in review.",
    prices: [{ usd: 750, unit: "per descriptor" }],
    includes: [
      "The deployments it misses added, or the descriptor brought in line with the contract as deployed.",
      "A test from a real transaction for each deployment and function it changes.",
      "A pull request stuck in review picked up, with your sign-off.",
      "Answers to the registry's reviewers until it merges.",
    ],
    terms: "The pull request opens within 5 business days of the start.",
  },
  {
    id: "upkeep",
    name: "Upkeep",
    title: "Descriptors kept current",
    audience: "For descriptors in the registry, whoever wrote them.",
    prices: [
      { usd: 250, unit: "a month, for up to five contracts" },
      { usd: 50, unit: "a month for each contract after them" },
    ],
    includes: [
      "Each upgrade, new deployment or ABI change that affects a descriptor, fixed and submitted, with no Fix to pay for.",
      "Every descriptor tested again each month on your newest transactions.",
      "A monthly report of how much of your traffic a wallet could clear-sign.",
    ],
    terms: "Billed quarterly, in advance. Stop at the end of any quarter.",
  },
];

/** How Coverage and a Fix are paid: the share due at the start, the rest when the pull request opens. */
export const DEPOSIT = 0.5;

const DOLLARS = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

/** A price in whole US dollars: $1,500. */
export const dollars = (usd: number) => DOLLARS.format(usd);
