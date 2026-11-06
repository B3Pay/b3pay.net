/**
 * The coverage report's counts, worked out again from its protocol list: for
 * all contracts, for each chain, each category and each protocol. The page
 * does not build while the report's own counts disagree with these
 * (./report.ts), `npm test` checks the same (scripts/coverage.test.mjs), and
 * `node scripts/coverage-totals.mjs --write` writes them into the report.
 *
 * Counts agree exactly. Transactions per day and the two shares are sums
 * and ratios of numbers the report rounds, so those agree within
 * PER_DAY_SLACK and SHARE_SLACK.
 *
 * Plain TypeScript with nothing but type imports, so Node runs it as it is.
 */
import type { ChainId, Contract, CoverageReport, CoverageStatus, Totals } from "./types.ts";

/** The four chains in the order the page shows them, and the names a new report starts with. */
export const CHAINS: readonly { readonly id: ChainId; readonly name: string }[] = [
  { id: 1, name: "Ethereum" },
  { id: 8453, name: "Base" },
  { id: 42161, name: "Arbitrum One" },
  { id: 10, name: "OP Mainnet" },
];

/**
 * The share a contract's descriptor must format for the contract to count as
 * covered, from CoverageStatus in ./types.ts: of what recent senders called,
 * or of recent transactions when the senders are unknown, or of the ABI's
 * state-changing functions when there were no recent calls (see reach()).
 */
export const COVERED_AT = 0.95;

/**
 * What a contract's status is measured on, in CoverageStatus's order: its
 * sender share, else its transaction share, else, with no recent calls, the
 * share of its writable functions the descriptor formats. Null when none of
 * these can be measured, which makes a contract with a descriptor partial.
 */
export function reach(contract: Contract): { share: number; by: "senders" | "transactions" | "functions" } | null {
  const sample = contract.sample;
  if (sample?.signerShareCovered != null) return { share: sample.signerShareCovered, by: "senders" };
  if (sample?.txShareCovered != null) return { share: sample.txShareCovered, by: "transactions" };
  const functions = contract.functions;
  if (functions && functions.writable > 0) return { share: functions.formatted / functions.writable, by: "functions" };
  return null;
}

/**
 * How much of an uncovered contract's recent calls the registry's descriptor
 * for another deployment formats (Contract.elsewhere): by senders, else by
 * transactions. Null without such a descriptor. At COVERED_AT or more, the
 * contract would count as covered if that descriptor listed it, which the
 * totals count as describedElsewhere.
 */
export function elsewhereReach(contract: Contract): { share: number; by: "senders" | "transactions" } | null {
  const elsewhere = contract.elsewhere;
  if (!elsewhere) return null;
  if (elsewhere.signerShareCovered != null) return { share: elsewhere.signerShareCovered, by: "senders" };
  if (elsewhere.txShareCovered != null) return { share: elsewhere.txShareCovered, by: "transactions" };
  return null;
}

/** A share agrees when it is within a twentieth of a percentage point. */
export const SHARE_SLACK = 0.0005;
/** Transactions per day agree within one, or 0.1% of a large figure. */
export const PER_DAY_SLACK = (perDay: number) => Math.max(1, Math.abs(perDay) * 0.001);

const COUNTS = ["contracts", "covered", "partial", "uncovered", "drafts", "describedElsewhere"] as const;
const SHARES = ["txShareCovered", "signerShareCovered"] as const;

const round = (value: number, places: number) => Math.round(value * 10 ** places) / 10 ** places;

/**
 * The totals of a set of contracts. Both shares are weighted by each
 * contract's transactions per day; a contract with no sample, no rate, or no
 * value for that share adds nothing to it, and with none left it is null.
 */
export function totalsOf(contracts: readonly Contract[]): Totals {
  const counts = { covered: 0, partial: 0, uncovered: 0 };
  let drafts = 0;
  let describedElsewhere = 0;
  let perDay = 0;
  const weighted = { txShareCovered: 0, signerShareCovered: 0 };
  const weight = { txShareCovered: 0, signerShareCovered: 0 };
  for (const contract of contracts) {
    counts[contract.status]++;
    if (contract.draft) drafts++;
    if ((elsewhereReach(contract)?.share ?? 0) >= COVERED_AT) describedElsewhere++;
    const rate = contract.sample?.perDay;
    if (rate == null) continue;
    perDay += rate;
    for (const key of SHARES) {
      const share = contract.sample?.[key];
      if (share == null) continue;
      weighted[key] += share * rate;
      weight[key] += rate;
    }
  }
  const share = (key: (typeof SHARES)[number]) => (weight[key] > 0 ? round(weighted[key] / weight[key], 4) : null);
  return {
    contracts: contracts.length,
    ...counts,
    drafts,
    describedElsewhere,
    txShareCovered: share("txShareCovered"),
    signerShareCovered: share("signerShareCovered"),
    perDay: round(perDay, 1),
  };
}

/**
 * A protocol is covered when every contract of it is, uncovered when none of
 * its contracts has a descriptor, and partial in between.
 */
export function statusOf(contracts: readonly Contract[]): CoverageStatus {
  if (contracts.every((contract) => contract.status === "covered")) return "covered";
  if (contracts.every((contract) => contract.status === "uncovered")) return "uncovered";
  return "partial";
}

export interface Recomputed {
  totals: Totals & { protocols: number };
  chains: Record<`${ChainId}`, Totals & { name: string }>;
  categories: Record<string, Totals & { label: string }>;
  protocols: { id: string; status: CoverageStatus; totals: Totals }[];
}

/** Every count of the report, from its protocol list alone. Names and labels are kept. */
export function recompute(report: CoverageReport): Recomputed {
  const contracts = report.protocols.flatMap((protocol) => protocol.contracts);

  const chains = {} as Record<`${ChainId}`, Totals & { name: string }>;
  for (const { id, name } of CHAINS) {
    chains[`${id}`] = {
      name: report.chains?.[`${id}`]?.name ?? name,
      ...totalsOf(contracts.filter((contract) => contract.chainId === id)),
    };
  }

  const groups = new Map<string, { label: string; contracts: Contract[] }>();
  for (const protocol of report.protocols) {
    const group = groups.get(protocol.category) ?? { label: protocol.categoryLabel, contracts: [] };
    group.contracts.push(...protocol.contracts);
    groups.set(protocol.category, group);
  }
  const categories: Record<string, Totals & { label: string }> = {};
  for (const [key, group] of groups) categories[key] = { label: group.label, ...totalsOf(group.contracts) };

  return {
    totals: { protocols: report.protocols.length, ...totalsOf(contracts) },
    chains,
    categories,
    protocols: report.protocols.map((protocol) => ({
      id: protocol.id,
      status: statusOf(protocol.contracts),
      totals: totalsOf(protocol.contracts),
    })),
  };
}

function compareTotals(where: string, actual: Partial<Totals> | undefined, expected: Totals, problems: string[]) {
  if (!actual) {
    problems.push(`${where} is missing`);
    return;
  }
  for (const key of COUNTS)
    if (actual[key] !== expected[key]) problems.push(`${where}.${key} is ${actual[key]}; the protocol list gives ${expected[key]}`);
  if (typeof actual.perDay !== "number" || Math.abs(actual.perDay - expected.perDay) > PER_DAY_SLACK(expected.perDay))
    problems.push(`${where}.perDay is ${actual.perDay}; the protocol list gives ${expected.perDay}`);
  for (const key of SHARES) {
    const share = actual[key];
    const want = expected[key];
    const agrees = share === null || want === null ? share === want : typeof share === "number" && Math.abs(share - want) <= SHARE_SLACK;
    if (!agrees) problems.push(`${where}.${key} is ${share}; the protocol list gives ${want}`);
  }
}

/**
 * Where the report's counts disagree with its protocol list, one line each;
 * empty when they all agree. Also checks the two things the counts rest on:
 * each protocol's status, and the list's order, busiest first.
 */
export function disagreements(report: CoverageReport): string[] {
  const expected = recompute(report);
  const problems: string[] = [];

  compareTotals("totals", report.totals, expected.totals, problems);
  if (report.totals?.protocols !== expected.totals.protocols)
    problems.push(`totals.protocols is ${report.totals?.protocols}; the list has ${expected.totals.protocols}`);

  const chainKeys = Object.keys(report.chains ?? {});
  for (const key of chainKeys)
    if (!(key in expected.chains)) problems.push(`chains.${key} is not one of the four chains`);
  for (const [key, chain] of Object.entries(expected.chains)) {
    const actual = report.chains?.[key as `${ChainId}`];
    compareTotals(`chains.${key}`, actual, chain, problems);
    if (actual && !actual.name) problems.push(`chains.${key} has no name`);
  }

  for (const key of Object.keys(report.categories ?? {}))
    if (!(key in expected.categories)) problems.push(`categories.${key} has no protocol`);
  for (const [key, category] of Object.entries(expected.categories)) {
    const actual = report.categories?.[key];
    compareTotals(`categories.${key}`, actual, category, problems);
    if (actual && actual.label !== category.label)
      problems.push(`categories.${key}.label is "${actual.label}"; its protocols say "${category.label}"`);
  }
  for (const protocol of report.protocols)
    if (protocol.categoryLabel !== expected.categories[protocol.category]?.label)
      problems.push(`${protocol.id}: category ${protocol.category} is labeled "${protocol.categoryLabel}" here and "${expected.categories[protocol.category]?.label}" elsewhere`);

  report.protocols.forEach((protocol, i) => {
    const want = expected.protocols[i]!;
    if (protocol.contracts.length === 0) problems.push(`${protocol.id} has no contracts`);
    if (protocol.status !== want.status) problems.push(`${protocol.id}.status is ${protocol.status}; its contracts make it ${want.status}`);
    compareTotals(`${protocol.id}.totals`, protocol.totals, want.totals, problems);
  });

  for (let i = 1; i < report.protocols.length; i++) {
    const [before, after] = [report.protocols[i - 1]!, report.protocols[i]!];
    if (before.totals.perDay < after.totals.perDay)
      problems.push(`protocols are not busiest first: ${before.id} (${before.totals.perDay} a day) comes before ${after.id} (${after.totals.perDay})`);
  }
  return problems;
}

/**
 * The report with every count replaced by the one its protocol list gives,
 * and its protocols put busiest first. Keys keep their places, so a rewritten
 * file differs from the old one only where a count changed.
 */
export function withTotals<T extends CoverageReport>(report: T): T {
  const expected = recompute(report);
  const protocols = report.protocols
    .map((protocol, i) => ({ ...protocol, status: expected.protocols[i]!.status, totals: expected.protocols[i]!.totals }))
    .sort((a, b) => b.totals.perDay - a.totals.perDay);
  return { ...report, totals: expected.totals, chains: expected.chains, categories: expected.categories, protocols };
}
