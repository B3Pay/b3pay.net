/**
 * Clear-signing one call the way a wallet with Sourcify's library does: find
 * the descriptor the Clear Signing registry lists for the contract, decode
 * the calldata with it and write each value as the descriptor says.
 *
 * The registry is read from GitHub as it is now (`master`), through a
 * resolver of the playground's own, so that it can also answer "what would a
 * wallet show if this descriptor listed this contract too": for a contract
 * the coverage tracker found the registry describing at another address (a
 * near miss), the same descriptor is bound to this one and the call is
 * formatted again. That is a preview, and the page says so.
 *
 * No attestation policy is set: the page shows what the registry's descriptor
 * says, and says that a wallet may accept only attested descriptors.
 */
import type { DescriptorResolver, DisplayModel, ExternalDataProvider, RegistryIndex } from "@ethereum-sourcify/clear-signing";

export type Library = Pick<typeof import("@ethereum-sourcify/clear-signing"), "format" | "fetchPrebuiltRegistryIndex">;

export const REGISTRY_REPO = "ethereum/clear-signing-erc7730-registry";

/** The branch of the registry the playground reads: the registry as it is now. */
export const REGISTRY_REF = "master";

/** The version of the library package.json pins; scripts/playground.test.mjs keeps the two equal. */
export const LIBRARY_VERSION = "0.3.1";

/** A registry file's page on GitHub. */
export const registryFileUrl = (path: string, ref = REGISTRY_REF) =>
  `https://github.com/${REGISTRY_REPO}/blob/${ref}/${path.split("/").map(encodeURIComponent).join("/")}`;

/** The registry's index and a way to read any of its files. */
export interface Registry {
  readonly index: RegistryIndex;
  readonly file: (path: string) => Promise<unknown>;
}

/** The registry on GitHub at `ref`, each file fetched once. */
export async function githubRegistry(library: Library, ref = REGISTRY_REF, fetchImpl: typeof fetch = fetch): Promise<Registry> {
  const index = await library.fetchPrebuiltRegistryIndex({ repo: REGISTRY_REPO, ref });
  const files = new Map<string, Promise<unknown>>();
  return {
    index,
    file(path) {
      let file = files.get(path);
      if (!file) {
        const url = `https://raw.githubusercontent.com/${REGISTRY_REPO}/${ref}/${path.split("/").map(encodeURIComponent).join("/")}`;
        file = fetchImpl(url).then((response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status} fetching ${path} from the registry`);
          return response.json() as Promise<unknown>;
        });
        file.catch(() => files.delete(path));
        files.set(path, file);
      }
      return file;
    },
  };
}

/** A contract the registry describes at another address, and the file that does. */
export interface NearMiss {
  readonly chainId: number;
  readonly address: string;
  readonly path: string;
}

/**
 * The library's resolver over `registry`. With `nearMiss`, the index also
 * points that contract at the file, and each descriptor read lists it among
 * its deployments, as if the file said so.
 */
export function resolverFor(registry: Registry, nearMiss?: NearMiss): DescriptorResolver {
  const key = nearMiss && `eip155:${nearMiss.chainId}:${nearMiss.address.toLowerCase()}`;
  const index: RegistryIndex =
    nearMiss && key
      ? { ...registry.index, calldataIndex: { ...registry.index.calldataIndex, [key]: nearMiss.path } }
      : registry.index;
  return {
    index,
    async fetchDescriptor(path) {
      const descriptor = await registry.file(path);
      return (nearMiss ? bindTo(descriptor, nearMiss) : descriptor) as Awaited<ReturnType<DescriptorResolver["fetchDescriptor"]>>;
    },
    fetchAttestation: async () => null,
  };
}

/** A copy of a descriptor file whose contract deployments also list the near miss. */
export function bindTo(descriptor: unknown, nearMiss: NearMiss): unknown {
  if (!descriptor || typeof descriptor !== "object") return descriptor;
  const copy = structuredClone(descriptor) as { context?: { contract?: { deployments?: unknown } } };
  const contract = copy.context?.contract;
  if (contract && typeof contract === "object") {
    const deployments = Array.isArray(contract.deployments) ? contract.deployments : [];
    contract.deployments = [...deployments, { chainId: nearMiss.chainId, address: nearMiss.address }];
  }
  return copy;
}

export interface Call {
  readonly chainId: number;
  readonly to: string;
  readonly data: string;
  readonly value: bigint;
  readonly from?: string;
}

export function clearSign(
  library: Library,
  registry: Registry,
  provider: ExternalDataProvider,
  call: Call,
  nearMiss?: NearMiss,
): Promise<DisplayModel> {
  return library.format(
    { chainId: call.chainId, to: call.to, data: call.data, value: call.value, ...(call.from ? { from: call.from } : {}) },
    { descriptorResolverOptions: { type: "custom", resolver: resolverFor(registry, nearMiss) }, externalDataProvider: provider },
  );
}

/** Why a wallet would show raw data, from the library's warnings; null when it formatted the call. */
export function fallbackReason(display: DisplayModel): "no-descriptor" | "no-format" | "fetch-error" | "other" | null {
  if (!display.rawCalldataFallback && (display.intent !== undefined || display.fields?.length)) return null;
  const codes = new Set((display.warnings ?? []).map((warning) => warning.code));
  if (codes.has("NO_DESCRIPTOR")) return "no-descriptor";
  if (codes.has("NO_FORMAT_MATCH")) return "no-format";
  if (codes.has("DESCRIPTOR_FETCH_ERROR")) return "fetch-error";
  return "other";
}
