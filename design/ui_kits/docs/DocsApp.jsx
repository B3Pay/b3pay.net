const { IconOf, Button, Badge, Card, CardHeader, BrandMark, Icon, CodeBlock, SideNav, Shell, Alert, Command, Input, Kbd, Select, Tooltip } = (typeof window !== "undefined" && window.B3PayDesignSystem_8a84cb) || {};
const icon = IconOf;

const H2 = ({ children }) => (
  <h2 id={String(children).toLowerCase().replace(/\s+/g, "-")} style={{ margin: "44px 0 16px", fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, letterSpacing: "-0.022em", scrollMarginTop: 70 }}>{children}</h2>
);

function Block({ b }) {
  if (b.type === "h") return <H2>{b.text}</H2>;
  if (b.type === "p") return <p style={{ margin: "0 0 16px", fontSize: 15, lineHeight: "26px", color: "var(--muted-foreground)", maxWidth: "68ch", textWrap: "pretty" }}>{b.text}</p>;
  if (b.type === "code") return <div style={{ margin: "0 0 20px" }}><CodeBlock filename={b.file} code={b.code} /></div>;
  if (b.type === "callout") return <div style={{ margin: "0 0 20px" }}><Alert color={b.color} title={b.title} icon={icon("TriangleAlert")}>{b.text}</Alert></div>;
  if (b.type === "table") return (
    <div className="b3-card" style={{ overflow: "hidden", margin: "0 0 20px" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead><tr>{b.head.map((h) => <th key={h} style={{ textAlign: "left", padding: "10px 14px", borderBottom: "1px solid var(--border)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted-foreground)", fontWeight: 400 }}>{h}</th>)}</tr></thead>
        <tbody>{b.rows.map((r, i) => (
          <tr key={i}>{r.map((c, j) => (
            <td key={j} style={{ padding: "10px 14px", borderTop: i ? "1px solid var(--border)" : 0, color: j === 0 ? "var(--foreground)" : c === "yes" ? "var(--success)" : c === "no" ? "var(--ink-600)" : "var(--muted-foreground)", fontFamily: j > 0 ? "var(--font-mono)" : undefined, fontSize: j > 0 ? 11 : 13 }}>{c}</td>
          ))}</tr>
        ))}</tbody>
      </table>
    </div>
  );
  if (b.type === "api") return (
    <div style={{ margin: "0 0 20px" }}>
      {b.rows.map(([sig, pkg, desc]) => (
        <div key={sig} style={{ padding: "16px 0", borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16 }}>
            <code style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--forge-500)" }}>{sig}</code>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-600)" }}>{pkg}</span>
          </div>
          <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: "22px", color: "var(--muted-foreground)", maxWidth: "68ch" }}>{desc}</p>
        </div>
      ))}
    </div>
  );
  return null;
}

function DocsApp() {
  const [page, setPage] = React.useState("quickstart");
  const [palette, setPalette] = React.useState(false);
  const doc = DOCS[page] || DOCS.quickstart;

  React.useEffect(() => {
    const h = (e) => { if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setPalette((p) => !p); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const select = (v) => { setPage(DOCS[v] ? v : "quickstart"); };

  return (
    <Shell
      bar={
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <BrandMark size={22} />
            <span style={{ width: 1, height: 18, background: "var(--border)" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted-foreground)" }}>Docs</span>
            <Badge size="xs" color="secondary">IC Reactor</Badge>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button type="button" onClick={() => setPalette(true)} className="b3-field b3-field--md"
              style={{ width: 260, justifyContent: "space-between", cursor: "pointer", color: "var(--muted-foreground)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon name="Search" size={13} /> Search docs</span>
              <span style={{ display: "flex", gap: 3 }}><Kbd>⌘</Kbd><Kbd>K</Kbd></span>
            </button>
            <Select size="md" options={["v1.2.0", "v1.1.4", "v1.0.9"]} style={{ width: 96 }} />
            <Tooltip content="View on GitHub"><Button asIconButton size="md" icon={icon("Github")} aria-label="GitHub" /></Tooltip>
          </div>
        </>
      }
      aside={
        <>
          <SideNav active={page} onSelect={select} sections={DOC_NAV} />
          <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
            <div className="b3-eyebrow" style={{ padding: "0 8px 8px" }}>Other projects</div>
            {["B3Forge", "B3Wallet", "B3Note", "B3Utils"].map((p) => (
              <button key={p} type="button" className="b3-menu__item"><Icon name="ArrowUpRight" size={12} /><span style={{ flex: 1 }}>{p}</span></button>
            ))}
          </div>
        </>
      }>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 200px", gap: 48, padding: "40px 48px 120px", maxWidth: 1080 }}>
        <article>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted-foreground)" }}>
            {doc.crumb.map((c, i) => (
              <React.Fragment key={c}>{i ? <span style={{ color: "var(--ink-500)" }}>/</span> : null}<span style={{ color: i === doc.crumb.length - 1 ? "var(--forge-500)" : undefined }}>{c}</span></React.Fragment>
            ))}
          </div>
          <h1 style={{ margin: "16px 0 0", fontFamily: "var(--font-display)", fontSize: 46, lineHeight: "50px", fontWeight: 600, letterSpacing: "-0.032em" }}>{doc.title}</h1>
          <p style={{ margin: "18px 0 34px", fontSize: 17, lineHeight: "28px", color: "var(--muted-foreground)", maxWidth: "68ch", textWrap: "pretty" }}>{doc.lead}</p>
          {doc.blocks.map((b, i) => <Block key={i} b={b} />)}

          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 56, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
            <Button variant="outlined" icon={icon("ArrowLeft")} onClick={() => select("install")}>Install</Button>
            <Button variant="outlined" iconRight={icon("ArrowRight")} onClick={() => select("api")}>API reference</Button>
          </div>
        </article>

        <nav style={{ position: "sticky", top: 24, alignSelf: "start" }}>
          <div className="b3-eyebrow" style={{ marginBottom: 12 }}>On this page</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9, borderLeft: "1px solid var(--border)" }}>
            {doc.toc.map((t, i) => (
              <a key={t} href={"#" + t.toLowerCase().replace(/\s+/g, "-")}
                style={{ fontSize: 12, lineHeight: "18px", color: i === 0 ? "var(--forge-500)" : "var(--muted-foreground)", textDecoration: "none", paddingLeft: 12, borderLeft: i === 0 ? "1px solid var(--forge-500)" : "1px solid transparent", marginLeft: -1 }}>{t}</a>
            ))}
          </div>
          <div style={{ marginTop: 28, paddingTop: 16, borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 8 }}>
            <a href="#" style={{ fontSize: 12, color: "var(--muted-foreground)", textDecoration: "none", display: "flex", gap: 6, alignItems: "center" }}><Icon name="Pencil" size={12} /> Edit this page</a>
            <a href="#" style={{ fontSize: 12, color: "var(--muted-foreground)", textDecoration: "none", display: "flex", gap: 6, alignItems: "center" }}><Icon name="MessageSquare" size={12} /> Report an issue</a>
          </div>
        </nav>
      </div>

      {palette ? (
        <Command onClose={() => setPalette(false)} placeholder="Search canisters, methods, docs…" groups={[
          { label: "Docs", items: Object.keys(DOCS).map((k) => ({ label: DOCS[k].title, hint: DOCS[k].crumb[0], icon: icon("FileText"), onSelect: () => select(k) })) },
          { label: "Canisters", items: [
            { label: "icp-ledger", hint: "ryjl3-tyaaa-aaaaa-aaaba-cai", icon: icon("Box") },
            { label: "ckbtc-minter", hint: "mqygn-kiaaa-aaaar-qaadq-cai", icon: icon("Box") },
          ] },
        ]} />
      ) : null}
    </Shell>
  );
}

Object.assign(window, { DocsApp, Block, H2 });
