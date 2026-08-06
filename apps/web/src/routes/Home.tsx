import {
  Badge,
  Button,
  Card,
  CardFooter,
  CardHeader,
  CodeBlock,
  IconOf,
} from "@b3pay/ui";
import { Link, useNavigate } from "react-router-dom";

import { Hero } from "./home/Hero";
import { Rule, Section, Slab } from "../site/furniture";
import { PRODUCTS } from "../site/products";
import { linkProps } from "../lib/router-link";
import { routeMeta } from "../site/routes";
import { useSeo } from "../lib/seo";

const HOW_IT_WORKS = [
  {
    n: "01",
    h: "Identity stays with the user",
    b: "Internet Identity issues a delegated identity in the browser. B3Pay never holds a key, a seed phrase or a session on a server.",
  },
  {
    n: "02",
    h: "State lives in a canister",
    b: "A B3Wallet is a canister the user controls. Upgrades, signers and thresholds are decisions they make on-chain, not requests to us.",
  },
  {
    n: "03",
    h: "Types survive the boundary",
    b: "IC Reactor generates TypeScript from Candid, so a canister method signature is a compile error in your editor before it is a runtime failure.",
  },
];

const REACTOR_SAMPLE = `import { defineReactor } from "@ic-reactor/react"
import { idlFactory, type _SERVICE } from "./declarations/backend"

export const {
  reactor,
  useActorQuery,
  useActorMutation,
  useAuth,
} = defineReactor<_SERVICE>({
  name: "backend",
  idlFactory,
  canisterId: "rrkah-fqaaa-aaaaa-aaaaq-cai",
  display: true,
})`;

export default function Home() {
  const navigate = useNavigate();
  useSeo(routeMeta("/"));

  return (
    <>
      <Hero />

      <Section
        eyebrow="What we build"
        spec="FIG. 01"
        title="Four open-source projects, one thesis."
        lead="Users should keep custody. Developers should not have to give up type safety to make that happen. Everything below is MIT-licensed and runs on the Internet Computer."
      >
        <div className="site-grid-products">
          {PRODUCTS.map((p) => (
            <Link key={p.key} to={`/products/${p.key}`} className="site-card-link">
              <Card interactive style={{ borderRadius: 0, height: "100%" }}>
                <CardHeader
                  title={
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 22,
                        letterSpacing: "-0.022em",
                      }}
                    >
                      {p.name}
                    </span>
                  }
                  description={p.line}
                  action={
                    <Badge color={p.tagColor} size="xs">
                      {p.tag}
                    </Badge>
                  }
                />
                <CardFooter>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--muted-foreground)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {p.lang}
                  </span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      <Rule />

      <Section
        eyebrow="How it works"
        spec="FIG. 02"
        title="No backend. No custody handover."
        lead="Every product here runs its logic on the client or inside a canister the user owns. That constraint shapes the whole stack."
      >
        <div className="site-grid-3">
          {HOW_IT_WORKS.map((s) => (
            <div key={s.n}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--forge-500)",
                  letterSpacing: "0.14em",
                }}
              >
                {s.n}
              </div>
              <hr className="b3-rule-hot" style={{ margin: "14px 0 18px" }} />
              <h3
                style={{
                  margin: 0,
                  fontFamily: "var(--font-display)",
                  fontSize: 21,
                  fontWeight: 600,
                  letterSpacing: "-0.018em",
                }}
              >
                {s.h}
              </h3>
              <p
                style={{
                  margin: "12px 0 0",
                  fontSize: 15,
                  lineHeight: "24px",
                  color: "var(--muted-foreground)",
                  textWrap: "pretty",
                }}
              >
                {s.b}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section bg="var(--ink-100)" tight>
        <Slab style={{ padding: 0 }} part="IC-REACTOR / 1.2.0">
          <div className="site-slab-split">
            <div className="site-slab-split__copy">
              <p className="b3-eyebrow" style={{ margin: 0 }}>
                For developers
              </p>
              <h2 className="b3-display" style={{ margin: "18px 0 0", fontSize: 40 }}>
                One call wires the client, the cache and the hooks.
              </h2>
              <p
                style={{
                  margin: "18px 0 0",
                  fontSize: 16,
                  lineHeight: "26px",
                  color: "var(--muted-foreground)",
                }}
              >
                <code style={{ fontFamily: "var(--font-mono)", color: "var(--forge-500)" }}>
                  defineReactor
                </code>{" "}
                creates the QueryClient, ClientManager, reactor and bound hooks — including{" "}
                <code style={{ fontFamily: "var(--font-mono)" }}>useAuth</code> and{" "}
                <code style={{ fontFamily: "var(--font-mono)" }}>useUserPrincipal</code>.
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: 30, flexWrap: "wrap" }}>
                {/* Outlined, not filled primary: the hero CTA is this page's one
                    Forge surface, and two primaries means no primary. */}
                <Button variant="outlined" {...linkProps(navigate, "/developers")}>
                  Read the guide
                </Button>
                <Button
                  variant="ghost"
                  as="a"
                  href="https://www.npmjs.com/package/@ic-reactor/react"
                  target="_blank"
                  rel="noreferrer"
                  icon={IconOf("Package")}
                >
                  npm
                </Button>
              </div>
            </div>
            <div className="site-slab-split__code">
              <CodeBlock filename="src/reactor.ts" code={REACTOR_SAMPLE} />
            </div>
          </div>
        </Slab>
      </Section>
    </>
  );
}
