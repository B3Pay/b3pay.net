/**
 * What the playground says about a contract the coverage tracker follows:
 * the coverage report (src/data/clear-signing-coverage.json) cut down to what
 * the page needs, one entry per deployment, keyed "<chainId>:<address>" in
 * lower case. It is written at build time to
 * /clear-signing/playground/contracts.json, which the page reads once, on the
 * first call it formats. Every word comes from the report.
 */
import type { CoverageReport, CoverageStatus } from "../coverage/types.ts";

export interface PlaygroundContract {
  readonly protocol: { readonly id: string; readonly name: string };
  readonly label: string;
  readonly status: CoverageStatus;
  /** How much of its recent calls the registry's descriptor formatted: by senders, else by transactions. */
  readonly reach: null | { readonly by: "senders" | "transactions"; readonly share: number };
  /** The registry's descriptor for this deployment, as the report found it. */
  readonly descriptor: null | {
    readonly owner: string | null;
    readonly attestation: "verified" | "unverified" | "none";
  };
  /** The registry's descriptor for another deployment that formats this one's calls (a near miss). */
  readonly elsewhere: null | {
    readonly path: string;
    readonly label: string;
    readonly address: string;
    readonly chainName: string;
    readonly sameAddress: boolean;
  };
  /** A B3Pay draft, and the one real call its page shows rendered with it. */
  readonly draft: null | {
    readonly preview: null | {
      readonly intent: string;
      readonly fields: readonly { readonly label: string; readonly value: string }[];
      readonly txHash: string;
    };
  };
  /** Function signatures by selector, for the calls the report saw. */
  readonly functions: Readonly<Record<string, string>>;
}

export interface PlaygroundContracts {
  /** When the report was built, and the registry commit it was checked against. */
  readonly generatedAt: string;
  readonly registryCommit: string;
  readonly contracts: Readonly<Record<string, PlaygroundContract>>;
}

export const contractKey = (chainId: number, address: string) => `${chainId}:${address.toLowerCase()}`;

// The id of a contract's card on its protocol's page, which the result links to.
export { contractAnchor } from "../coverage/format.ts";

export function playgroundContracts(report: CoverageReport): PlaygroundContracts {
  const contracts: Record<string, PlaygroundContract> = {};
  for (const protocol of report.protocols) {
    for (const contract of protocol.contracts) {
      const key = contractKey(contract.chainId, contract.address);
      if (Object.hasOwn(contracts, key)) throw new Error(`The coverage report lists ${key} twice`);
      const { descriptor, elsewhere, draft, sample } = contract;
      const reach =
        sample?.signerShareCovered != null
          ? { by: "senders" as const, share: sample.signerShareCovered }
          : sample?.txShareCovered != null
            ? { by: "transactions" as const, share: sample.txShareCovered }
            : null;
      contracts[key] = {
        protocol: { id: protocol.id, name: protocol.name },
        label: contract.label,
        status: contract.status,
        reach: descriptor ? reach : null,
        descriptor: descriptor && { owner: descriptor.owner, attestation: descriptor.attestation },
        elsewhere: elsewhere && {
          path: elsewhere.path,
          label: elsewhere.label,
          address: elsewhere.address,
          chainName: elsewhere.chainName,
          sameAddress: elsewhere.sameAddress,
        },
        draft: draft && {
          preview: draft.preview
            ? {
                intent: draft.preview.intent,
                fields: draft.preview.fields.map(({ label, value }) => ({ label, value })),
                txHash: draft.preview.txHash,
              }
            : null,
        },
        functions: Object.fromEntries(
          contract.topFunctions.flatMap(({ selector, signature }) => (signature ? [[selector.toLowerCase(), signature]] : [])),
        ),
      };
    }
  }
  return { generatedAt: report.generatedAt, registryCommit: report.registry.commit, contracts };
}
