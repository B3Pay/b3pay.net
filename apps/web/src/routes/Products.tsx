import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CodeBlock,
  Icon,
  IconOf,
  PrincipalDisplay,
} from "@b3pay/ui";
import { Link, Navigate, useParams } from "react-router-dom";

import { PRODUCTS, repoUrl } from "../site/products";
import { Section } from "../site/furniture";
import { routeMeta } from "../site/routes";
import { useSeo } from "../lib/seo";

const CANDID_SAMPLE = `(record {
  owner  = $N0.recipient_account.owner;
  amount = $N1.Ok.amount : nat;
  memo   = opt $N2.memo
})`;

function ProductAside({ sel }: { sel: string }) {
  if (sel === "ic-reactor") {
    return (
      <CodeBlock
        filename="install"
        code={"pnpm add @ic-reactor/react \\\n  @icp-sdk/core @tanstack/react-query"}
      />
    );
  }
  if (sel === "b3forge") {
    return (
      <>
        <CodeBlock filename="expression.candid" code={CANDID_SAMPLE} />
        <Alert color="warning" title="Beta" icon={IconOf("TriangleAlert")}>
          The canister stores and shares workflows. It does not execute them — execution is
          browser-only.
        </Alert>
      </>
    );
  }
  if (sel === "b3wallet") {
    return (
      <Card>
        <CardHeader
          title="Signer consensus"
          description="50% + 1. Three signers require two approvals."
        />
        <CardContent
          style={{ paddingTop: 0, display: "flex", flexDirection: "column", gap: 8 }}
        >
          {(
            [
              ["Signer 1", "approved"],
              ["Signer 2", "approved"],
              ["Signer 3", "pending"],
            ] as const
          ).map(([n, s]) => (
            <div
              key={n}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                padding: "8px 0",
                borderTop: "1px solid var(--border)",
              }}
            >
              <PrincipalDisplay
                value={`${n === "Signer 3" ? "aaaaa" : "mxzaz"}-hqaaa-aaaar-qaada-cai`}
                head={2}
                tail={2}
                copyable={false}
              />
              <Badge size="xs" color={s === "approved" ? "success" : "muted"} dot>
                {s}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }
  if (sel === "b3note") {
    return (
      <Card>
        <CardHeader title="Expiry model" icon={IconOf("Timer")} />
        <CardContent
          style={{
            paddingTop: 0,
            fontSize: 13,
            lineHeight: "21px",
            color: "var(--muted-foreground)",
          }}
        >
          Anonymous users get 5 notes. Each note and each share link lives one hour. A canister
          global timer clears expired users and one-time keys. Notes also delete on first read.
        </CardContent>
      </Card>
    );
  }
  return <CodeBlock filename="Cargo.toml" code={'[dependencies]\nb3_utils = "0.11"'} />;
}

export default function Products() {
  const { slug } = useParams<{ slug: string }>();
  const p = PRODUCTS.find((x) => x.key === slug);

  // /products and any unknown slug resolve to the first product, which is where
  // the prototype's tab state started.
  const fallback = !p;
  useSeo(routeMeta(fallback ? "/products" : `/products/${slug}`));

  if (fallback) return <Navigate to={`/products/${PRODUCTS[0].key}`} replace />;

  return (
    <>
      <Section
        as="h1"
        eyebrow="Products & ecosystem"
        title="Everything B3Pay ships is public."
        lead="Pick a project to see what it does, how it is built and where the code lives. All five are MIT-licensed and developed in the open."
      />

      <div className="site-shell">
        {/* Tab-shaped, but these are real navigations to real URLs — so they are
            links with aria-current, not ARIA tabs over hidden panels. */}
        <nav className="site-tabs" aria-label="Products">
          {PRODUCTS.map((x) => {
            const selected = x.key === p.key;
            return (
              <Link
                key={x.key}
                to={`/products/${x.key}`}
                className="site-tab"
                aria-current={selected ? "page" : undefined}
                data-selected={selected}
              >
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--font-display)",
                    fontSize: 17,
                    fontWeight: 600,
                    color: selected ? "var(--foreground)" : "var(--muted-foreground)",
                    letterSpacing: "-0.018em",
                  }}
                >
                  {x.name}
                </span>
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--muted-foreground)",
                    marginTop: 6,
                  }}
                >
                  {x.tag}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="site-grid-split-a">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <h2
                style={{
                  margin: 0,
                  fontFamily: "var(--font-display)",
                  fontSize: 42,
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                }}
              >
                {p.name}
              </h2>
              <Badge color={p.tagColor}>{p.tag}</Badge>
            </div>
            <p
              style={{
                margin: "18px 0 0",
                fontSize: 18,
                lineHeight: "28px",
                color: "var(--muted-foreground)",
                textWrap: "pretty",
              }}
            >
              {p.line}
            </p>

            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "34px 0 0",
                display: "flex",
                flexDirection: "column",
                gap: 0,
              }}
            >
              {p.points.map((pt) => (
                <li
                  key={pt}
                  style={{
                    display: "flex",
                    gap: 14,
                    alignItems: "flex-start",
                    padding: "14px 0",
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <span style={{ color: "var(--forge-500)", marginTop: 2 }}>
                    <Icon name="Check" size={15} />
                  </span>
                  <span style={{ fontSize: 15, lineHeight: "23px" }}>{pt}</span>
                </li>
              ))}
            </ul>

            <div style={{ display: "flex", gap: 8, marginTop: 32, flexWrap: "wrap" }}>
              <Button
                variant="filled"
                color="primary"
                as="a"
                href={repoUrl(p.repo)}
                target="_blank"
                rel="noreferrer"
                icon={IconOf("Github")}
              >
                {p.repo}
              </Button>
              <Button
                variant="outlined"
                as="a"
                href={`${repoUrl(p.repo)}#readme`}
                target="_blank"
                rel="noreferrer"
                icon={IconOf("BookOpen")}
              >
                Documentation
              </Button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card>
              <CardHeader title="Stack" />
              <CardContent
                style={{ paddingTop: 4, display: "flex", flexDirection: "column", gap: 10 }}
              >
                {(
                  [
                    ["Language", p.lang],
                    ["Modules", p.ic],
                    ["Licence", "MIT"],
                    ["Repository", p.repo],
                  ] as const
                ).map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 16,
                      fontSize: 12,
                    }}
                  >
                    <span className="b3-eyebrow">{k}</span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        textAlign: "right",
                        color: "var(--ink-800)",
                      }}
                    >
                      {v}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <ProductAside sel={p.key} />
          </div>
        </div>
      </div>
    </>
  );
}
