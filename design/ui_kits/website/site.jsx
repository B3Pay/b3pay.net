const B = (typeof window !== "undefined" && window.B3PayDesignSystem_8a84cb) || {};
const { IconOf, Button, Badge, Card, CardHeader, CardContent, CardFooter, BrandMark, Icon, CodeBlock, PrincipalDisplay, WorkflowNode, Tabs, NavBar, Alert, Input } = B;
const icon = IconOf;

/* ── Shared site furniture ─────────────────────────────────────── */

const Section = ({ eyebrow, title, lead, children, tight, bg, spec, style }) => (
  <section style={{ padding: `${tight ? 72 : 120}px 24px`, background: bg, position: "relative", ...style }}>
    <div className="b3-colgrid" />
    <span className="b3-tick" style={{ left: 18, top: 18 }} />
    <span className="b3-tick" style={{ right: 18, bottom: 18 }} />
    <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative" }}>
      {eyebrow ? (
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <span className="b3-eyebrow">{eyebrow}</span>
          <hr className="b3-rule-hot" style={{ flex: 1 }} />
          {spec ? <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".18em", color: "var(--text-mark)" }}>{spec}</span> : null}
        </div>
      ) : null}
      {title ? <h2 className="b3-display" style={{ margin: 0, fontSize: 52, maxWidth: 820 }}>{title}</h2> : null}
      {lead ? <p style={{ margin: "22px 0 0", fontSize: 18, lineHeight: "28px", color: "var(--muted-foreground)", maxWidth: 620, textWrap: "pretty" }}>{lead}</p> : null}
      {children ? <div style={{ marginTop: title || lead ? 60 : 0 }}>{children}</div> : null}
    </div>
  </section>
);

const Rule = () => <div style={{ height: 1, background: "var(--border)" }} />;

const Stat = ({ value, label, unit }) => (
  <div>
    <div style={{ fontFamily: "var(--font-display)", fontSize: 42, fontWeight: 600, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
      {value}{unit ? <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--muted-foreground)", marginLeft: 6 }}>{unit}</span> : null}
    </div>
    <div className="b3-eyebrow" style={{ marginTop: 10 }}>{label}</div>
  </div>
);

/* Machined stock: square corners, diagonal brackets, scanline, part number. */
const Slab = ({ children, style, glow = true, part }) => (
  <div className="b3-bracket b3-scan" style={{ position: "relative", background: "var(--ink-100)", border: "1px solid var(--border)", overflow: "hidden", ...style }}>
    {glow ? <div style={{ position: "absolute", inset: 0, background: "var(--heat-glow)", pointerEvents: "none" }} /> : null}
    <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(90deg,var(--hairline) 1px,transparent 1px)", backgroundSize: "calc(100% / 8) 100%", pointerEvents: "none" }} />
    {part ? <span style={{ position: "absolute", right: 14, top: 12, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".18em", color: "var(--text-mark)" }}>{part}</span> : null}
    <div style={{ position: "relative" }}>{children}</div>
  </div>
);

const PRODUCTS = [
  { key: "b3forge", name: "B3Forge", tag: "Beta", tagColor: "warning", lang: "Rust · TypeScript",
    line: "Candid-native workflow platform. Compose canister calls into typed workflows in a visual graph editor and run them in the browser.",
    points: ["Visual node graph with type-checked bindings", "Expressions reference prior outputs as $N0.amount", "Browser execution with a delegated identity", "Community catalog — publish and fork workflows"],
    repo: "B3Pay/b3forge", ic: "Rust/WASM compatibility engine" },
  { key: "b3wallet", name: "B3Wallet", tag: "Live", tagColor: "success", lang: "Rust · React",
    line: "Self-custodial multi-chain, multi-owner wallet. Bitcoin, Ethereum and Internet Computer from one canister you control.",
    points: ["Single-owner, multi-owner and multi-signature", "50%+1 consensus for transaction approval", "No registration, no backup phrase to lose", "Self-upgrading canister"],
    repo: "B3Pay/B3Wallet", ic: "b3wallet_lib · operations · b3_utils" },
  { key: "ic-reactor", name: "IC Reactor", tag: "MIT", tagColor: "info", lang: "TypeScript · React",
    line: "Type-safe Internet Computer integration for TypeScript and React. Seven packages, end-to-end types, TanStack Query caching.",
    points: ["defineReactor() wires the whole client in one call", "useActorQuery / useActorMutation hook factories", "Typed Ok/Err result handling", "Codegen via CLI or the Vite plugin"],
    repo: "B3Pay/ic-reactor", ic: "@ic-reactor/core · react · candid · cli" },
  { key: "b3note", name: "B3Note", tag: "Demo", tagColor: "muted", lang: "Rust",
    line: "Anonymous note sharing with witness-like encryption. Notes and share links expire in an hour, then the canister timer deletes them.",
    points: ["No login — up to 5 notes per anonymous user", "Identity-based encryption via the VetKeys API", "Share links carry an on-chain verifiable signature", "Auto-delete on first read or after one hour"],
    repo: "B3Pay/B3Note", ic: "BLS pairing · VetKeys · timelock" },
  { key: "b3utils", name: "B3Utils", tag: "Crate", tagColor: "secondary", lang: "Rust",
    line: "The foundation crate. Stable memory, timers, logging, transfers, tokens and timestamps for canister development.",
    points: ["Reserved stable-memory IDs 248–254", "Transfer and token primitives", "Timer and notifier memory", "Published on docs.rs"],
    repo: "B3Pay/b3_utils", ic: "docs.rs/b3_utils" },
];

Object.assign(window, { B, Section, Rule, Stat, Slab, PRODUCTS });
