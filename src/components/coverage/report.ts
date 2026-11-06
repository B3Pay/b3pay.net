/**
 * The coverage report the tracker page renders, src/data/clear-signing-coverage.json,
 * and the ways the page writes its values. The page and /clear-signing/coverage.json
 * both read it from here, and neither builds while the report's counts disagree
 * with its protocol list (./totals.ts): the page never shows two numbers that
 * contradict each other, and the last good deploy stays live.
 */
import raw from "../../data/clear-signing-coverage.json?raw";
import { CHAINS, disagreements } from "./totals.ts";
import type { ChainId, Contract, CoverageReport, CoverageStatus, Protocol } from "./types.ts";

/** The file as it is, which /clear-signing/coverage.json publishes byte for byte. */
export const RAW: string = raw;

/** `mock` marks placeholder data; scripts/coverage.test.mjs refuses it once real data lands. */
export const report = JSON.parse(raw) as CoverageReport & { readonly mock?: boolean };

const problems = disagreements(report);
if (problems.length)
  throw new Error(
    `src/data/clear-signing-coverage.json: ${problems.length} count(s) disagree with its protocol list; see node scripts/coverage-totals.mjs\n  ${problems.join("\n  ")}`,
  );

/** A value the page has no words for stops the build instead of printing "undefined". */
function lookup<K extends string | number, V>(table: Record<K, V>, key: K, what: string): V {
  if (!Object.hasOwn(table, key)) throw new Error(`src/data/clear-signing-coverage.json: unknown ${what} "${key}"`);
  return table[key];
}

/** The four chains in the order the page shows them, with the report's names. */
export const chains = CHAINS.map(({ id }) => ({ id, ...report.chains[`${id}`] }));

const CHAIN_TAGS: Record<ChainId, string> = { 1: "ETH", 8453: "BASE", 42161: "ARB", 10: "OP" };
/** A chain as a short tag: ETH, BASE, ARB, OP. */
export const chainTag = (id: ChainId) => lookup(CHAIN_TAGS, id, "chain");
export const chainName = (id: ChainId) => {
  const chain = report.chains[`${id}`];
  if (!chain) throw new Error(`src/data/clear-signing-coverage.json: unknown chain ${id}`);
  return chain.name;
};

const STATUS: Record<CoverageStatus, string> = { covered: "Covered", partial: "Partial", uncovered: "Uncovered" };
export const statusLabel = (status: CoverageStatus) => lookup(STATUS, status, "status");

const SOURCIFY: Record<Contract["sourcify"], string> = {
  exact_match: "Verified, exact match",
  match: "Verified, partial match",
  not_verified: "Not verified",
  unknown: "Not known",
};
export const sourcifyLabel = (sourcify: Contract["sourcify"]) => lookup(SOURCIFY, sourcify, "Sourcify state");

type Attestation = NonNullable<Contract["descriptor"]>["attestation"];
// "Attested" only for an attestation that verified, as the schema says.
const ATTESTATION: Record<Attestation, string> = {
  verified: "Attested: its ERC-8176 attestation verified",
  unverified: "An attestation exists, not verified",
  none: "No attestation",
};
export const attestationLabel = (attestation: Attestation) => lookup(ATTESTATION, attestation, "attestation");

const LINT: Record<NonNullable<Contract["draft"]>["lint"], string> = { pass: "Pass", warnings: "Warnings" };
export const lintLabel = (lint: NonNullable<Contract["draft"]>["lint"]) => lookup(LINT, lint, "lint result");

const NUMBER = new Intl.NumberFormat("en-US");

/** A count with thousands separators: 12,840. */
export const count = (value: number) => NUMBER.format(value);

/** A count and its noun: "1 contract", "40 contracts". */
export const plural = (value: number, one: string, many = `${one}s`) => `${count(value)} ${value === 1 ? one : many}`;

/** Transactions per day: whole from 10 up, one decimal below. */
export const perDay = (value: number) => (value >= 10 ? NUMBER.format(Math.round(value)) : String(Math.round(value * 10) / 10));

/** A share as a whole percentage, which reads 0% or 100% only when it is exactly that. */
export function percent(share: number): string {
  const whole = Math.round(share * 100);
  if (share > 0 && whole === 0) return "<1%";
  if (share < 1 && whole === 100) return ">99%";
  return `${whole}%`;
}

const DAY = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** A day as the site writes it: 4 November 2026. */
export const day = (iso: string) => DAY.format(new Date(iso));

/** Two times as days: "5 November 2026", "3–5 November 2026" or "30 October – 2 November 2026". */
export const days = (from: string, to: string) => DAY.formatRange(new Date(from), new Date(to));

/** An address or hash shortened in the middle, as the design system writes it: 0x0000…0001. */
export const short = (hex: string) => `${hex.slice(0, 6)}…${hex.slice(-4)}`;

/** The explorer's page for a transaction, from the contract's: /address/<address> becomes /tx/<hash>. */
export function txUrl(contract: Contract, hash: string): string {
  const url = contract.explorerUrl.replace(/\/address\/0x[0-9a-fA-F]{40}\/?$/, `/tx/${hash}`);
  if (url === contract.explorerUrl) throw new Error(`${contract.explorerUrl} does not end with /address/<address>, so there is no link for ${hash}`);
  return url;
}

/** The chains a protocol's contracts are on, in the page's order. */
export const chainsOf = (protocol: Protocol) =>
  CHAINS.map(({ id }) => id).filter((id) => protocol.contracts.some((contract) => contract.chainId === id));

/** A link's host, which is what a reader needs to know before following it: docs.example.com. */
export const host = (url: string) => new URL(url).host.replace(/^www\./, "");

/** A registry file by its name: calldata-UniversalRouter.json. */
export const fileName = (path: string) => path.slice(path.lastIndexOf("/") + 1);

/** The registry at the report's commit, on GitHub. */
export const registryUrl = `https://github.com/${report.registry.repo}/tree/${report.registry.commit}`;

/** The most transactions any contract's sample holds: the "latest 1,000" of the method. */
export const sampleSize = Math.max(0, ...report.protocols.flatMap((protocol) => protocol.contracts.map((contract) => contract.sample?.count ?? 0)));

/** Contracts with a descriptor, and those whose descriptor carries an attestation that verified. */
export const described = report.protocols.flatMap((protocol) => protocol.contracts).filter((contract) => contract.descriptor !== null);
export const attested = described.filter((contract) => contract.descriptor?.attestation === "verified");
