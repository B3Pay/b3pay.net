const { IconOf, Icon, Button, Badge, Card, CardHeader, CardContent, CardFooter, CodeBlock, Tabs, Alert, PrincipalDisplay, WorkflowNode } = (typeof window !== "undefined" && window.B3PayDesignSystem_8a84cb) || {};
const icon = IconOf;

function Products() {
  const [sel, setSel] = React.useState("b3forge");
  const p = PRODUCTS.find((x) => x.key === sel);
  return (
    <>
      <Section eyebrow="Products & ecosystem" title="Everything B3Pay ships is public."
        lead="Pick a project to see what it does, how it is built and where the code lives. All five are MIT-licensed and developed in the open." />

      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px 120px" }}>
        <div style={{ display: "flex", gap: 0, borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", marginBottom: 40 }}>
          {PRODUCTS.map((x) => (
            <button key={x.key} type="button" onClick={() => setSel(x.key)}
              style={{
                flex: 1, background: sel === x.key ? "var(--card)" : "transparent", border: 0,
                borderRight: "1px solid var(--border)", padding: "20px 18px", textAlign: "left", cursor: "pointer",
                borderTop: sel === x.key ? "2px solid var(--forge-500)" : "2px solid transparent",
                transition: "background-color var(--dur-fast) var(--ease-out)",
              }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600, color: sel === x.key ? "var(--foreground)" : "var(--muted-foreground)", letterSpacing: "-0.018em" }}>{x.name}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-600)", marginTop: 6 }}>{x.tag}</div>
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.15fr) minmax(0,0.85fr)", gap: 48, alignItems: "start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 42, fontWeight: 600, letterSpacing: "-0.03em" }}>{p.name}</h3>
              <Badge color={p.tagColor}>{p.tag}</Badge>
            </div>
            <p style={{ margin: "18px 0 0", fontSize: 18, lineHeight: "28px", color: "var(--muted-foreground)", textWrap: "pretty" }}>{p.line}</p>

            <ul style={{ listStyle: "none", padding: 0, margin: "34px 0 0", display: "flex", flexDirection: "column", gap: 0 }}>
              {p.points.map((pt) => (
                <li key={pt} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "14px 0", borderTop: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--forge-500)", marginTop: 2 }}><Icon name="Check" size={15} /></span>
                  <span style={{ fontSize: 15, lineHeight: "23px" }}>{pt}</span>
                </li>
              ))}
            </ul>

            <div style={{ display: "flex", gap: 8, marginTop: 32 }}>
              <Button variant="filled" color="primary" icon={icon("Github")}>{p.repo}</Button>
              <Button variant="outlined" icon={icon("BookOpen")}>Documentation</Button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card>
              <CardHeader title="Stack" />
              <CardContent style={{ paddingTop: 4, display: "flex", flexDirection: "column", gap: 10 }}>
                {[["Language", p.lang], ["Modules", p.ic], ["Licence", "MIT"], ["Repository", p.repo]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 16, fontSize: 12 }}>
                    <span className="b3-eyebrow">{k}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, textAlign: "right", color: "var(--ink-800)" }}>{v}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <ProductAside sel={sel} />
          </div>
        </div>
      </div>
    </>
  );
}

function ProductAside({ sel }) {
  if (sel === "ic-reactor") {
    return <CodeBlock filename="install" code={"pnpm add @ic-reactor/react \\\n  @icp-sdk/core @tanstack/react-query"} />;
  }
  if (sel === "b3forge") {
    return (
      <>
        <CodeBlock filename="expression.candid" code={`(record {
  owner  = $N0.recipient_account.owner;
  amount = $N1.Ok.amount : nat;
  memo   = opt $N2.memo
})`} />
        <Alert color="warning" title="Beta" icon={icon("TriangleAlert")}>
          The canister stores and shares workflows. It does not execute them — execution is browser-only.
        </Alert>
      </>
    );
  }
  if (sel === "b3wallet") {
    return (
      <Card>
        <CardHeader title="Signer consensus" description="50% + 1. Three signers require two approvals." />
        <CardContent style={{ paddingTop: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {[["Signer 1", "approved"], ["Signer 2", "approved"], ["Signer 3", "pending"]].map(([n, s]) => (
            <div key={n} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: "1px solid var(--border)" }}>
              <PrincipalDisplay value={`${n === "Signer 3" ? "aaaaa" : "mxzaz"}-hqaaa-aaaar-qaada-cai`} head={2} tail={2} copyable={false} />
              <Badge size="xs" color={s === "approved" ? "success" : "muted"} dot>{s}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }
  if (sel === "b3note") {
    return (
      <Card>
        <CardHeader title="Expiry model" icon={icon("Timer")} />
        <CardContent style={{ paddingTop: 0, fontSize: 13, lineHeight: "21px", color: "var(--muted-foreground)" }}>
          Anonymous users get 5 notes. Each note and each share link lives one hour.
          A canister global timer clears expired users and one-time keys. Notes also delete on first read.
        </CardContent>
      </Card>
    );
  }
  return <CodeBlock filename="Cargo.toml" code={'[dependencies]\nb3_utils = "0.11"'} />;
}

Object.assign(window, { Products });
