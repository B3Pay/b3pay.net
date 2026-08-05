const { IconOf, Button, BrandMark, NavBar, Icon, Command } = (typeof window !== "undefined" && window.B3PayDesignSystem_8a84cb) || {};
const icon = IconOf;

const ROUTES = [
  { key: "home", label: "Home" },
  { key: "products", label: "Products" },
  { key: "developers", label: "Developers" },
  { key: "about", label: "About" },
  { key: "blog", label: "Blog" },
  { key: "contact", label: "Contact" },
];

function Footer({ go }) {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", background: "var(--ink-100)", position: "relative" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 1, background: "var(--heat-edge)", opacity: 0.6 }} />
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "64px 24px 40px", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 40 }}>
        <div>
          <BrandMark size={26} />
          <p style={{ margin: "18px 0 0", fontSize: 14, lineHeight: "22px", color: "var(--muted-foreground)", maxWidth: 300 }}>
            Open-source infrastructure for decentralized applications, wallets and payments on the Internet Computer.
          </p>
        </div>
        {[
          { h: "Products", items: ["B3Forge", "B3Wallet", "IC Reactor", "B3Note", "B3Utils"] },
          { h: "Developers", items: ["Documentation", "npm packages", "docs.rs", "Agent skills"] },
          { h: "Organisation", items: ["About", "Blog", "GitHub", "Contact"] },
        ].map((col) => (
          <div key={col.h}>
            <div className="b3-eyebrow">{col.h}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
              {col.items.map((i) => <a key={i} href="#" style={{ fontSize: 14, color: "var(--muted-foreground)", textDecoration: "none" }}>{i}</a>)}
            </div>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "20px 24px 40px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", color: "var(--ink-600)" }}>© 2026 B3PAY · MIT LICENCE</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", color: "var(--ink-600)" }}>BUILT ON THE INTERNET COMPUTER</span>
      </div>
    </footer>
  );
}

function App() {
  const [route, setRoute] = React.useState("home");
  const [palette, setPalette] = React.useState(false);
  const go = (r) => { setRoute(r); window.scrollTo(0, 0); };

  React.useEffect(() => {
    const h = (e) => { if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setPalette((p) => !p); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const Page = { home: Home, products: Products, developers: Developers, about: About, blog: Blog, contact: Contact }[route];

  return (
    <div onClick={(e) => {
      const a = e.target.closest("a[href^='#']");
      if (a) { const k = a.getAttribute("href").slice(1); if (ROUTES.some((r) => r.key === k)) { e.preventDefault(); go(k); } }
    }}>
      <NavBar
        brand={<a href="#" onClick={(e) => { e.preventDefault(); go("home"); }} style={{ display: "flex" }}><BrandMark size={26} /></a>}
        active={ROUTES.find((r) => r.key === route).label}
        links={ROUTES.slice(1, 5).map((r) => ({ label: r.label, href: "#" + r.key }))}
        actions={
          <>
            <Button size="sm" variant="ghost" icon={icon("Search")} onClick={() => setPalette(true)}>⌘K</Button>
            <Button size="sm" variant="ghost" icon={icon("Github")}>GitHub</Button>
            <Button size="sm" variant="filled" color="primary" onClick={() => go("contact")}>Get started</Button>
          </>
        } />
      <div>
        <Page go={go} />
      </div>
      <Footer go={go} />
      {palette ? (
        <Command onClose={() => setPalette(false)} placeholder="Search products, packages and docs…" groups={[
          { label: "Pages", items: ROUTES.map((r) => ({ label: r.label, icon: icon("FileText"), onSelect: () => go(r.key) })) },
          { label: "Packages", items: [
            { label: "@ic-reactor/react", hint: "npm", icon: icon("Package") },
            { label: "@ic-reactor/core", hint: "npm", icon: icon("Package") },
            { label: "b3_utils", hint: "crates.io", icon: icon("Package") },
          ] },
        ]} />
      ) : null}
    </div>
  );
}

Object.assign(window, { App, Footer, ROUTES });
