/**
 * The playground's examples as their links show them: what the coverage
 * report says of each one's contract, so no page says by hand which calls the
 * registry formats, and the addresses that open it in the playground. The
 * playground lists them all under its form (./PlaygroundHero.astro); the
 * Clear Signing page lists one of each kind beside its offer
 * (../clear-signing/ClearSigningHero.astro).
 */
import { report } from "../coverage/report.ts";
import { chainById } from "./chains.ts";
import { contractKey } from "./contracts.ts";
import { EXAMPLES, type Example } from "./examples.ts";
import { hashOf, txInPlayground } from "./input.ts";

/** What a wallet that reads the registry shows for an example, from what the report says of its contract. */
export type ExampleKind = "formatted" | "no-descriptor" | "near-miss" | "draft";

/** Each kind as a link names it beside its chain; a call the registry formats needs no word. */
const TAGS: Record<ExampleKind, string | null> = {
  formatted: null,
  "no-descriptor": "No descriptor",
  "near-miss": "Near miss",
  draft: "B3Pay draft",
};

const contracts = new Map(
  report.protocols.flatMap((protocol) =>
    protocol.contracts.map((contract) => [contractKey(contract.chainId, contract.address), contract] as const),
  ),
);

function kindOf(example: Example): ExampleKind {
  const contract = contracts.get(contractKey(example.chainId, example.to));
  if (!contract) throw new Error(`The playground's example ${example.id} calls a contract the coverage report does not list`);
  if (contract.status !== "uncovered") return "formatted";
  return contract.draft ? "draft" : contract.elsewhere ? "near-miss" : "no-descriptor";
}

export const exampleLinks = EXAMPLES.map((example) => {
  const kind = kindOf(example);
  return {
    ...example,
    kind,
    formatted: kind === "formatted",
    tag: TAGS[kind],
    chain: chainById(example.chainId)?.name,
    /** Its address on the playground's own page, where the script reads it without a reload. */
    fragment: hashOf({ kind: "hash", chainId: example.chainId, hash: example.hash }),
    /** Its address from any other page. */
    href: txInPlayground(example.chainId, example.hash),
  };
});
