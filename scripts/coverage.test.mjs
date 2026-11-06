/**
 * The Clear Signing coverage report, src/data/clear-signing-coverage.json,
 * which /clear-signing/coverage/ renders and /clear-signing/coverage.json
 * serves. Its counts must agree with its protocol list, and every field must
 * be what src/components/coverage/types.ts says, so the page never prints
 * two numbers that contradict each other, or a value it cannot read.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { COVERED_AT, SHARE_SLACK, disagreements, reach, recompute, statusOf, totalsOf, withTotals } from "../src/components/coverage/totals.ts";
import { REPORT } from "./coverage-totals.mjs";
import { checksum, keccak } from "./keccak.mjs";

const report = JSON.parse(readFileSync(REPORT, "utf8"));

test("every count agrees with the protocol list", () => {
  assert.deepEqual(disagreements(report), []);
});

// TODO(coverage data): unskip this test when the real report from the
// tracker replaces the mock data, which happens before the pull request.
test(
  "the report is real data, not the mock",
  { skip: "TODO: unskip when the real coverage data replaces the mock, before the pull request" },
  () => {
    assert.equal("mock" in report, false, 'src/data/clear-signing-coverage.json still has "mock": the page would show placeholders');
  },
);

/** A small report whose counts are worked out by hand below. */
function sample() {
  const contract = (chainId, status, perDay, tx, signer, draft = null) => ({
    chainId,
    status,
    draft,
    sample:
      perDay === undefined
        ? null
        : { count: 1000, perDay, oldest: "2026-11-01T00:00:00Z", newest: "2026-11-02T00:00:00Z", txShareCovered: tx, signerShareCovered: signer },
  });
  const protocol = (id, category, contracts) => ({ id, name: id, category, categoryLabel: category.toUpperCase(), status: "covered", totals: {}, contracts });
  return {
    version: 1,
    totals: {},
    chains: {},
    categories: {},
    protocols: [
      // a's first contract is mostly relayer calls: half its transactions, but every sender, are formatted.
      protocol("a", "dex", [contract(1, "covered", 300, 0.5, 1), contract(8453, "uncovered", 100, 0, 0, { functions: 2, testedTxs: 2, lint: "pass" })]),
      // b: no sample at all, and a sample of plain transfers only.
      protocol("b", "dex", [contract(1, "partial", undefined), contract(1, "uncovered", 50, null, null)]),
      // c: senders unknown.
      protocol("c", "bridge", [contract(10, "uncovered", 600, 0, null)]),
    ],
  };
}

test("counts, weighted shares and statuses are worked out as the schema says", () => {
  const small = sample();
  const [a, b] = small.protocols;
  // Both shares are weighted by transactions per day; a contract with no
  // sample, or no value for a share, adds nothing to that share.
  assert.deepEqual(totalsOf(a.contracts), {
    contracts: 2,
    covered: 1,
    partial: 0,
    uncovered: 1,
    drafts: 1,
    txShareCovered: 0.375,
    signerShareCovered: 0.75,
    perDay: 400,
  });
  assert.deepEqual(totalsOf(b.contracts), {
    contracts: 2,
    covered: 0,
    partial: 1,
    uncovered: 1,
    drafts: 0,
    txShareCovered: null,
    signerShareCovered: null,
    perDay: 50,
  });
  assert.equal(totalsOf([]).txShareCovered, null);
  assert.equal(totalsOf([]).signerShareCovered, null);

  assert.equal(statusOf([{ status: "covered" }, { status: "covered" }]), "covered");
  assert.equal(statusOf([{ status: "uncovered" }, { status: "uncovered" }]), "uncovered");
  assert.equal(statusOf([{ status: "covered" }, { status: "uncovered" }]), "partial");
  assert.equal(statusOf([{ status: "partial" }, { status: "partial" }]), "partial");

  const counts = recompute(small);
  // c's 600 a day count for transactions, not for senders.
  assert.deepEqual(counts.totals, {
    protocols: 3,
    contracts: 5,
    covered: 1,
    partial: 1,
    uncovered: 3,
    drafts: 1,
    txShareCovered: 0.15,
    signerShareCovered: 0.75,
    perDay: 1050,
  });
  // Every chain is listed, with or without contracts.
  assert.deepEqual(Object.keys(counts.chains).sort(), ["1", "10", "42161", "8453"]);
  assert.deepEqual(counts.chains["42161"], {
    name: "Arbitrum One",
    contracts: 0,
    covered: 0,
    partial: 0,
    uncovered: 0,
    drafts: 0,
    txShareCovered: null,
    signerShareCovered: null,
    perDay: 0,
  });
  assert.equal(counts.chains["1"].txShareCovered, 0.5);
  assert.equal(counts.chains["1"].signerShareCovered, 1);
  assert.deepEqual(Object.keys(counts.categories), ["dex", "bridge"]);
  assert.equal(counts.categories.dex.label, "DEX");
  assert.equal(counts.categories.dex.contracts, 4);
  assert.deepEqual(
    counts.protocols.map((protocol) => protocol.status),
    ["partial", "partial", "uncovered"],
  );
});

test("a contract's status is measured on senders, then transactions, then its functions", () => {
  const taken = (tx, signer) => ({ count: 1000, perDay: 10, oldest: "2026-11-01T00:00:00Z", newest: "2026-11-02T00:00:00Z", txShareCovered: tx, signerShareCovered: signer });
  const functions = { writable: 8, formatted: 6 };
  assert.deepEqual(reach({ sample: taken(0.26, 0.97), functions }), { share: 0.97, by: "senders" });
  assert.deepEqual(reach({ sample: taken(0.96, null), functions }), { share: 0.96, by: "transactions" });
  // No recent calls with calldata: the share of writable functions the descriptor formats.
  assert.deepEqual(reach({ sample: taken(null, null), functions }), { share: 0.75, by: "functions" });
  assert.deepEqual(reach({ sample: null, functions }), { share: 0.75, by: "functions" });
  // Nothing to measure: a contract with a descriptor is then partial, never covered.
  assert.equal(reach({ sample: null, functions: null }), null);
  assert.equal(reach({ sample: null, functions: { writable: 0, formatted: 0 } }), null);
});

test("a count that disagrees is found, and --write puts the list's counts back", () => {
  const fixed = withTotals(sample());
  assert.deepEqual(disagreements(fixed), []);
  // Busiest first: c (600 a day), then a (400), then b (50).
  assert.deepEqual(
    fixed.protocols.map((protocol) => protocol.id),
    ["c", "a", "b"],
  );

  const broken = structuredClone(fixed);
  broken.totals.covered += 1;
  broken.chains["8453"].drafts = 0;
  broken.categories.dex.txShareCovered = 0.8;
  broken.protocols[1].status = "covered";
  broken.protocols.reverse();
  assert.deepEqual(disagreements(broken), [
    "totals.covered is 2; the protocol list gives 1",
    "chains.8453.drafts is 0; the protocol list gives 1",
    "categories.dex.txShareCovered is 0.8; the protocol list gives 0.375",
    "a.status is covered; its contracts make it partial",
    "protocols are not busiest first: b (50 a day) comes before a (400)",
    "protocols are not busiest first: a (400 a day) comes before c (600)",
  ]);

  // The script says the same and changes nothing; with --write it fixes the file.
  const file = join(mkdtempSync(join(tmpdir(), "coverage-")), "report.json");
  writeFileSync(file, JSON.stringify(broken));
  const script = fileURLToPath(new URL("./coverage-totals.mjs", import.meta.url));
  const check = spawnSync(process.execPath, [script, file], { encoding: "utf8" });
  assert.equal(check.status, 1);
  assert.match(check.stderr, /totals\.covered is 2; the protocol list gives 1/);
  assert.equal(readFileSync(file, "utf8"), JSON.stringify(broken));
  const write = spawnSync(process.execPath, [script, "--write", file], { encoding: "utf8" });
  assert.equal(write.status, 0, write.stderr);
  assert.deepEqual(disagreements(JSON.parse(readFileSync(file, "utf8"))), []);
});

test("the report follows the schema in src/components/coverage/types.ts", () => {
  const problems = [];
  const expect = (ok, where, what) => ok || problems.push(`${where}: ${what}`);

  const isText = (value) => typeof value === "string" && value.trim() !== "";
  const isCount = (value) => Number.isInteger(value) && value >= 0;
  const isShare = (value) => typeof value === "number" && value >= 0 && value <= 1;
  const isTime = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value) && !Number.isNaN(Date.parse(value));
  const isHttps = (value) => {
    try {
      return new URL(value).protocol === "https:";
    } catch {
      return false;
    }
  };
  const only = (value, keys, where) => {
    for (const key of Object.keys(value ?? {})) expect(keys.includes(key), where, `has a field the schema does not: ${key}`);
  };
  const STATUSES = ["covered", "partial", "uncovered"];
  const CHAINS = [1, 8453, 42161, 10];

  // "mock" is the placeholder flag; the test above refuses it once real data lands.
  only(report, ["mock", "version", "generatedAt", "registry", "sources", "totals", "chains", "categories", "protocols"], "report");
  expect(report.version === 1, "version", "is not 1");
  expect(isTime(report.generatedAt), "generatedAt", "is not an ISO time");
  const { registry, sources } = report;
  expect(registry.repo === "ethereum/clear-signing-erc7730-registry", "registry.repo", "is not the Clear Signing registry");
  expect(/^[0-9a-f]{40}$/.test(registry.commit), "registry.commit", "is not a full commit SHA");
  expect(isTime(registry.committedAt), "registry.committedAt", "is not an ISO time");
  expect(isCount(registry.deploymentsOnTrackedChains), "registry.deploymentsOnTrackedChains", "is not a count");
  expect(isTime(sources.onchain.oldest) && isTime(sources.onchain.newest), "sources.onchain", "is not two ISO times");
  expect(Date.parse(sources.onchain.oldest) <= Date.parse(sources.onchain.newest), "sources.onchain", "oldest is after newest");
  expect(sources.defillama === undefined || isTime(sources.defillama), "sources.defillama", "is not an ISO time");
  expect(Array.isArray(report.protocols) && report.protocols.length > 0, "protocols", "is empty");

  const ids = new Set();
  const deployments = new Set();
  for (const protocol of report.protocols) {
    const at = protocol.id;
    only(protocol, ["id", "name", "category", "categoryLabel", "website", "tvlUsd", "status", "totals", "contracts"], at);
    expect(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(protocol.id) && !ids.has(protocol.id), at, "id is not unique kebab-case");
    ids.add(protocol.id);
    expect(isText(protocol.name), at, "has no name");
    expect(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(protocol.category), at, "category is not kebab-case");
    expect(isText(protocol.categoryLabel), at, "has no category label");
    expect(isHttps(protocol.website), at, "website is not an https address");
    expect(protocol.tvlUsd === null || (typeof protocol.tvlUsd === "number" && protocol.tvlUsd >= 0), at, "tvlUsd is not a number or null");
    expect(STATUSES.includes(protocol.status), at, `status ${protocol.status} is not one of ${STATUSES}`);

    for (const contract of protocol.contracts) {
      const where = `${at} ${contract.chainId}:${contract.address}`;
      only(
        contract,
        ["chainId", "address", "name", "label", "role", "version", "status", "addressSource", "explorerUrl", "sourcify", "descriptor", "functions", "sample", "topFunctions", "draft"],
        where,
      );
      expect(CHAINS.includes(contract.chainId), where, "is not on one of the four chains");
      expect(/^0x[0-9a-fA-F]{40}$/.test(contract.address) && checksum(contract.address) === contract.address, where, "address is not EIP-55");
      const deployment = `${contract.chainId}:${contract.address.toLowerCase()}`;
      expect(!deployments.has(deployment), where, "is listed twice");
      deployments.add(deployment);
      for (const key of ["name", "label", "role"]) expect(isText(contract[key]), where, `has no ${key}`);
      expect(contract.version === undefined || isText(contract.version), where, "version is empty");
      expect(STATUSES.includes(contract.status), where, `status ${contract.status} is not one of ${STATUSES}`);
      expect(isHttps(contract.addressSource), where, "addressSource is not an https address");
      // The page links a transaction by swapping /address/<address> for /tx/<hash>.
      expect(isHttps(contract.explorerUrl) && contract.explorerUrl.toLowerCase().endsWith(`/address/${contract.address.toLowerCase()}`), where, "explorerUrl does not end with /address/<address>");
      expect(["exact_match", "match", "not_verified", "unknown"].includes(contract.sourcify), where, `sourcify ${contract.sourcify} is unknown`);

      const { descriptor, functions, sample: taken, topFunctions, draft } = contract;
      expect((descriptor === null) === (contract.status === "uncovered"), where, "has a descriptor exactly when it is not uncovered");
      if (descriptor) {
        only(descriptor, ["path", "url", "owner", "formats", "attestation"], `${where} descriptor`);
        expect(/^registry\/.+\.json$/.test(descriptor.path), where, "descriptor.path is not a registry file");
        expect(isHttps(descriptor.url) && descriptor.url.endsWith(`/${registry.commit}/${descriptor.path}`), where, "descriptor.url is not the file at the registry's commit");
        expect(descriptor.owner === null || isText(descriptor.owner), where, "descriptor.owner is empty");
        expect(isCount(descriptor.formats), where, "descriptor.formats is not a count");
        expect(["verified", "unverified", "none"].includes(descriptor.attestation), where, `attestation ${descriptor.attestation} is unknown`);
      }
      if (functions !== null) {
        expect(isCount(functions.writable) && isCount(functions.formatted) && functions.formatted <= functions.writable, where, "functions formats more than are writable");
        expect(descriptor !== null || functions.formatted === 0, where, "formats functions without a descriptor");
      }

      if (taken !== null) {
        only(taken, ["count", "perDay", "oldest", "newest", "txShareCovered", "signerShareCovered"], `${where} sample`);
        expect(isCount(taken.count) && taken.count > 0, where, "sample.count is not a positive count");
        expect(taken.perDay === null || (typeof taken.perDay === "number" && taken.perDay >= 0), where, "sample.perDay is not a rate");
        expect(isTime(taken.oldest) && isTime(taken.newest) && Date.parse(taken.oldest) <= Date.parse(taken.newest), where, "sample times are not in order");
        for (const key of ["txShareCovered", "signerShareCovered"])
          expect(key in taken && (taken[key] === null || isShare(taken[key])), where, `sample.${key} is not a share or null`);
      }
      const share = taken?.txShareCovered ?? null;
      // The thresholds of CoverageStatus, on what it measures, allowing for rounding.
      const measured = reach(contract);
      if (contract.status === "covered")
        expect(measured !== null && measured.share >= COVERED_AT - SHARE_SLACK, where, `is covered, but its descriptor formats ${measured ? `${measured.share} by ${measured.by}` : "an unmeasured share"}`);
      if (contract.status === "partial")
        expect(measured === null || measured.share < COVERED_AT + SHARE_SLACK, where, `is partial, but its descriptor formats ${measured?.share} by ${measured?.by}`);
      if (contract.status === "uncovered")
        for (const key of ["txShareCovered", "signerShareCovered"])
          expect((taken?.[key] ?? 0) <= SHARE_SLACK, where, `has no descriptor, but ${key} is ${taken?.[key]}`);

      expect(Array.isArray(topFunctions) && topFunctions.length <= 5, where, "topFunctions is not a list of up to 5");
      expect(taken !== null || topFunctions.length === 0, where, "has top functions but no sample");
      let formatted = 0;
      let unformatted = 0;
      topFunctions.forEach((fn, i) => {
        const at = `${where} topFunctions[${i}]`;
        only(fn, ["selector", "signature", "share", "senders", "formatted"], at);
        expect(/^0x[0-9a-f]{8}$/.test(fn.selector), at, "selector is not 4 bytes of lower-case hex");
        if (fn.signature !== null) expect(fn.selector === `0x${keccak(fn.signature).slice(0, 8)}`, at, `selector is not Keccak-256 of ${fn.signature}`);
        expect(isShare(fn.share), at, "share is not a share");
        expect("senders" in fn && (fn.senders === null || (isCount(fn.senders) && fn.senders <= taken.count)), at, "senders is not a count up to the sample's");
        expect(typeof fn.formatted === "boolean", at, "formatted is not true or false");
        expect(descriptor !== null || !fn.formatted, at, "is formatted without a descriptor");
        expect(i === 0 || topFunctions[i - 1].share >= fn.share, at, "is not in order, most called first");
        if (fn.formatted) formatted += fn.share;
        else unformatted += fn.share;
      });
      // What the top functions show cannot contradict the contract's share.
      if (share !== null) {
        expect(formatted <= share + SHARE_SLACK, where, `its formatted top functions add up to more than its share, ${share}`);
        expect(unformatted <= 1 - share + SHARE_SLACK, where, `its unformatted top functions add up to more than 1 - ${share}`);
      }

      if (draft !== null) {
        only(draft, ["functions", "testedTxs", "lint", "preview"], `${where} draft`);
        expect(isCount(draft.functions) && draft.functions > 0, where, "draft formats no function");
        expect(isCount(draft.testedTxs) && draft.testedTxs > 0, where, "draft was tested on no transaction");
        expect(["pass", "warnings"].includes(draft.lint), where, `draft.lint ${draft.lint} is unknown`);
        if (draft.preview !== undefined) {
          const { preview } = draft;
          only(preview, ["txHash", "intent", "fields"], `${where} preview`);
          expect(/^0x[0-9a-fA-F]{64}$/.test(preview.txHash), where, "preview.txHash is not a transaction hash");
          expect(isText(preview.intent), where, "preview has no intent");
          expect(Array.isArray(preview.fields) && preview.fields.length > 0, where, "preview has no fields");
          for (const field of preview.fields ?? []) expect(isText(field.label) && isText(field.value), where, "a preview field has no label or value");
        }
      }
    }
  }
  assert.deepEqual(problems, []);
});
