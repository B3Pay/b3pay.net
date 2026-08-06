import { BrandMark, Card, CardHeader, IconOf } from "@b3pay/ui";

import { Section, Slab } from "../site/furniture";
import { routeMeta } from "../site/routes";
import { useSeo } from "../lib/seo";

const TIMELINE: [string, string][] = [
  ["2023", "B3Wallet — multi-chain, multi-owner canister wallet"],
  ["2023", "b3_utils published to crates.io"],
  ["2023", "B3Note — witness-like encryption demo on VetKeys"],
  ["2024", "IC Reactor reaches seven packages"],
  ["2025", "B3Forge enters beta — browser workflow execution"],
];

export default function About() {
  useSeo(routeMeta("/about"));

  return (
    <>
      <Section
        as="h1"
        eyebrow="About"
        title="A small team building in the open since 2023."
        lead="B3Pay started as a self-custodial wallet experiment on the Internet Computer and grew into a set of libraries other teams now depend on. Every line is public."
      />
      <div className="site-shell">
        <div className="site-grid-half">
          <div>
            <h2
              style={{
                margin: 0,
                fontFamily: "var(--font-display)",
                fontSize: 26,
                fontWeight: 600,
                letterSpacing: "-0.022em",
              }}
            >
              What we are working toward
            </h2>
            <p
              style={{
                margin: "16px 0 0",
                fontSize: 16,
                lineHeight: "26px",
                color: "var(--muted-foreground)",
                textWrap: "pretty",
              }}
            >
              Decentralized payments that are simple enough for everyday users and businesses.
              That is a long way off, and the honest path there runs through tooling: wallets
              people can actually recover, libraries that make canister integration boring, and
              workflows a non-programmer can read.
            </p>
            <ol
              style={{
                listStyle: "none",
                padding: 0,
                margin: "32px 0 0",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {TIMELINE.map(([y, t]) => (
                <li
                  key={t}
                  style={{
                    display: "flex",
                    gap: 20,
                    padding: "14px 0",
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      color: "var(--forge-500)",
                      width: 40,
                      flex: "none",
                    }}
                  >
                    {y}
                  </span>
                  <span style={{ fontSize: 15, lineHeight: "22px" }}>{t}</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <Slab style={{ padding: 40 }}>
              <BrandMark variant="stacked" size={64} />
              <figure style={{ margin: "32px 0 0" }}>
                <blockquote
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-accent)",
                    fontSize: 24,
                    lineHeight: "34px",
                    color: "var(--ink-800)",
                    textWrap: "pretty",
                  }}
                >
                  Users maintain exclusive control over their canisters, and therefore their
                  funds.
                </blockquote>
                <figcaption className="b3-eyebrow" style={{ marginTop: 18 }}>
                  B3Wallet README
                </figcaption>
              </figure>
            </Slab>
            <div className="site-grid-pair" style={{ marginTop: 16 }}>
              <Card>
                <CardHeader
                  title="Open by default"
                  description="MIT on every repository. Issues and PRs welcome."
                  icon={IconOf("Github")}
                />
              </Card>
              <Card>
                <CardHeader
                  title="Agent-ready"
                  description="llms.txt, AGENTS.md and skill packages ship with the code."
                  icon={IconOf("Terminal")}
                />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
