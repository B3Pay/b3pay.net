const { IconOf, Button, Badge, Card, CardHeader, CardFooter, BrandMark, CodeBlock, WorkflowNode, PrincipalDisplay } = (typeof window !== "undefined" && window.B3PayDesignSystem_8a84cb) || {};
const icon = IconOf;

/* The background is a payment-gateway topology: every node is a real hop a
   ckBTC checkout passes through. The run panel lights them as it executes. */
const NODES = [
  { x: 6,  y: 18, l: "checkout" },
  { x: 6,  y: 72, l: "merchant" },
  { x: 17, y: 42, l: "invoice" },
  { x: 28, y: 13, l: "wallet" },
  { x: 27, y: 67, l: "kyt-check" },
  { x: 38, y: 89, l: "rate-oracle" },
  { x: 39, y: 34, l: "icp-ledger" },
  { x: 50, y: 58, l: "ckbtc-ledger" },
  { x: 51, y: 9,  l: "fee-vault" },
  { x: 63, y: 30, l: "settlement" },
  { x: 74, y: 56, l: "receipt" },
  { x: 76, y: 12, l: "webhook" },
  { x: 85, y: 84, l: "audit-log" },
  { x: 88, y: 40, l: "payout" },
  { x: 95, y: 66, l: "refund" },
];
const EDGES = [[0,2],[1,2],[2,3],[2,6],[3,4],[3,6],[4,6],[4,7],[5,7],[6,7],[6,8],[7,8],
  [7,9],[8,9],[9,10],[9,11],[10,12],[10,13],[11,13],[12,14],[13,14]];

/* Payment-gateway topology behind the hero. Blurred at rest; the cursor carries
   a spotlight that brings it into focus. `active` switches nodes on. */
function NodeField({ active }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const host = el.parentElement;
    const move = (e) => {
      const r = host.getBoundingClientRect();
      el.style.setProperty("--mx", (e.clientX - r.left) + "px");
      el.style.setProperty("--my", (e.clientY - r.top) + "px");
      el.dataset.live = "true";
    };
    const leave = () => { el.dataset.live = "false"; };
    host.addEventListener("mousemove", move);
    host.addEventListener("mouseleave", leave);
    return () => { host.removeEventListener("mousemove", move); host.removeEventListener("mouseleave", leave); };
  }, []);

  const layer = (sharp) => (
    <div className={"b3-nodefield__layer b3-nodefield__layer--" + (sharp ? "sharp" : "blur")} key={sharp ? "s" : "b"}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }} aria-hidden>
        {EDGES.map(([i, j], k) => {
          const on = active.has(i) && active.has(j);
          return <line key={k} x1={NODES[i].x} y1={NODES[i].y} x2={NODES[j].x} y2={NODES[j].y}
            stroke={on ? "var(--forge-500)" : "var(--ink-500)"} strokeWidth={on ? 1.6 : 1}
            vectorEffect="non-scaling-stroke" style={{ transition: "stroke var(--dur-slow) var(--ease-out)" }} />;
        })}
      </svg>
      {NODES.map((n, i) => {
        const on = active.has(i);
        const flip = n.x > 68;
        return (
          <span key={i} className={"b3-nodefield__node" + (flip ? " b3-nodefield__node--flip" : "")} style={{ left: n.x + "%", top: n.y + "%" }}>
            <span className={"b3-nodefield__dot" + (on ? " b3-nodefield__dot--hot" : "")} />
            <span className="b3-nodefield__label" style={{ color: on ? "var(--forge-500)" : "var(--text-mark)" }}>{n.l}</span>
          </span>
        );
      })}
    </div>
  );

  return <div className="b3-nodefield" ref={ref} data-live="false">{layer(false)}{layer(true)}</div>;
}

/* One checkout: two B3Forge seats, paid in ckBTC. Each call lights the hops it
   touches in the background topology. */
const STEPS = [
  { fn: "invoice_create",  target: "merchant",     ms: "9ms",  lights: [0, 1, 2] },
  { fn: "icrc2_approve",   target: "wallet",       ms: "12ms", lights: [3, 4, 6] },
  { fn: "icrc1_transfer",  target: "ckbtc-ledger", ms: "38ms", lights: [5, 7, 8] },
  { fn: "settle_receipt",  target: "browser",      ms: "4ms",  lights: [9, 10, 11, 12, 13] },  // refund stays dark
];

function Hero({ go }) {
  const [step, setStep] = React.useState(0);
  const [run, setRun] = React.useState(0);
  React.useEffect(() => {
    setStep(0);
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setStep(i);
      if (i >= STEPS.length) clearInterval(t);
    }, 1100);
    return () => clearInterval(t);
  }, [run]);
  const active = React.useMemo(() => {
    const s = new Set();
    STEPS.slice(0, step).forEach((st) => st.lights.forEach((n) => s.add(n)));
    return s;
  }, [step]);

  return (
    <div style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--border)" }}>
      <div className="b3-colgrid" />
      <NodeField active={active} />
      <div style={{ position: "absolute", inset: 0, background: "var(--heat-glow)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 2, background: "var(--gradient-brand)", animation: "b3-glow-breathe 4s var(--ease-in-out) infinite" }} />
      <span className="b3-spine">B3PAY / ORG / EST 2023 / INTERNET COMPUTER</span>
      <span className="b3-tick b3-tick--hot" style={{ left: 18, top: 18 }} />
      <span className="b3-tick" style={{ right: 18, top: 18 }} />
      <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto", padding: "116px 24px 56px", display: "grid", gridTemplateColumns: "minmax(0,1.05fr) minmax(0,0.95fr)", gap: 56, alignItems: "center" }}>
        <div>
          <div className="b3-eyebrow" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 5, height: 5, borderRadius: 9999, background: "var(--forge-500)", boxShadow: "var(--glow-forge-sm)" }} />
            Open source · Internet Computer · since 2023
          </div>
          <h1 className="b3-display" style={{ margin: "26px 0 0", fontSize: "clamp(44px, 6.6vw, 92px)" }}>
            Infrastructure for apps that hold their own keys.
          </h1>
          <div style={{ display: "flex", gap: 18, marginTop: 30, alignItems: "flex-start" }}>
            <span style={{ width: 40, height: 1, background: "var(--forge-600)", marginTop: 14, flex: "none" }} />
            <p style={{ margin: 0, fontSize: 19, lineHeight: "30px", color: "var(--muted-foreground)", maxWidth: 520, textWrap: "pretty" }}>
              B3Pay builds open-source wallets, TypeScript libraries and workflow tooling for the Internet Computer.
              No centralized backend sits between your users and their assets.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 38 }}>
            <Button size="xl" variant="filled" color="primary" bevel onClick={() => go("developers")} iconRight={icon("ArrowRight")}>Start building</Button>
            <Button size="xl" variant="outlined" onClick={() => go("products")} icon={icon("Github")}>View the repos</Button>
          </div>
          <div style={{ display: "flex", marginTop: 46, borderTop: "1px solid var(--border)" }}>
            {[["03", "chains"], ["05", "projects"], ["07", "packages"], ["MIT", "licence"]].map(([v, l], i) => (
              <div key={l} style={{ flex: 1, paddingTop: 14, borderRight: i < 3 ? "1px solid var(--border)" : "none" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>{v}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted-foreground)", marginTop: 5 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <HeroRun step={step} onRetry={() => setRun((r) => r + 1)} />
      </div>
    </div>
  );
}

/* The right column shows that checkout processing, then its result. */
function HeroRun({ step, onRetry }) {
  const done = step >= STEPS.length;
  return (
    <div className="b3-scan" style={{ position: "relative", background: "var(--ink-050)", border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, height: 40, padding: "0 14px", borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted-foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Checkout — order 4821 · 2 seats</span>
        <Badge color={done ? "success" : "warning"} size="xs" dot>{done ? "Paid" : "Running"}</Badge>
      </div>

      <div style={{ padding: "16px 16px 14px" }}>
        <div className="b3-eyebrow" style={{ marginBottom: 12 }}>Processing</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {STEPS.map((s, i) => {
            const ran = step > i;
            const active = step === i + 1;
            return (
              <div key={s.fn} style={{
                display: "grid", gridTemplateColumns: "12px minmax(0,1fr) auto auto", gap: 10, alignItems: "center",
                padding: "8px 0", borderTop: i ? "1px solid var(--border)" : 0,
                opacity: ran ? 1 : 0.34, transition: "opacity var(--dur-slow) var(--ease-dock)",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: 9999, background: ran ? "var(--success)" : "var(--ink-500)", boxShadow: active ? "0 0 8px 1px var(--success)" : "none", justifySelf: "center" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.fn}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted-foreground)" }}>{s.target}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: ran ? "var(--success)" : "var(--text-mark)", minWidth: 34, textAlign: "right" }}>{ran ? s.ms : "—"}</span>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0 12px" }}>
          <span className="b3-eyebrow">Result</span>
          <hr className="b3-rule-hot" style={{ flex: 1 }} />
        </div>
        <div style={{
          border: "1px solid " + (done ? "color-mix(in srgb,var(--success) 45%,transparent)" : "var(--border)"),
          background: done ? "color-mix(in srgb,var(--success) 8%,transparent)" : "transparent",
          padding: "14px", transition: "border-color var(--dur-slow) var(--ease-out), background-color var(--dur-slow) var(--ease-out)",
        }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
            <span className="b3-display" style={{ fontSize: 30, fontVariantNumeric: "tabular-nums", color: done ? "var(--foreground)" : "var(--ink-500)", transition: "color var(--dur-slow) var(--ease-out)" }}>
              {done ? "0.0241" : "0.0000"} <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 400, letterSpacing: 0, color: "var(--muted-foreground)" }}>ckBTC</span>
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: done ? "var(--success)" : "var(--text-mark)" }}>{done ? "Settled" : "Pending"}</span>
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted-foreground)", marginTop: 8 }}>
            {done ? "block 1 284 907 · fee 0.0000021 · payout to merchant" : "awaiting settlement"}
          </div>
          <Button size="sm" fullWidth style={{ marginTop: 14 }}
            variant={done ? "outlined" : "filled"} color={done ? "secondary" : "primary"}
            isLoading={step > 0 && !done}
            icon={icon(done ? "RotateCcw" : "Zap")}
            onClick={done ? onRetry : undefined}>
            {done ? "Run it again" : "Pay 0.0241 ckBTC"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Home({ go }) {
  return (
    <>
      <Hero go={go} />

      <Section eyebrow="What we build" spec="FIG. 01" title="Five open-source projects, one thesis."
        lead="Users should keep custody. Developers should not have to give up type safety to make that happen. Everything below is MIT-licensed and runs on the Internet Computer.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 16 }}>
          {PRODUCTS.map((p, i) => (
            <Card key={p.key} interactive onClick={() => go("products")} style={{ borderRadius: 0, ...(i === 0 ? { gridColumn: "span 2" } : null) }}>
              <CardHeader
                title={<span style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: "-0.022em" }}>{p.name}</span>}
                description={p.line}
                action={<Badge color={p.tagColor} size="xs">{p.tag}</Badge>} />
              <CardFooter>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted-foreground)", letterSpacing: "0.06em" }}>{p.lang}</span>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Section>

      <Rule />

      <Section eyebrow="How it works" spec="FIG. 02" title="No backend. No custody handover."
        lead="Every product here runs its logic on the client or inside a canister the user owns. That constraint shapes the whole stack.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 44 }}>
          {[
            { n: "01", h: "Identity stays with the user", b: "Internet Identity issues a delegated identity in the browser. B3Pay never holds a key, a seed phrase or a session on a server." },
            { n: "02", h: "State lives in a canister", b: "A B3Wallet is a canister the user controls. Upgrades, signers and thresholds are decisions they make on-chain, not requests to us." },
            { n: "03", h: "Types survive the boundary", b: "IC Reactor generates TypeScript from Candid, so a canister method signature is a compile error in your editor before it is a runtime failure." },
          ].map((s) => (
            <div key={s.n}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--forge-500)", letterSpacing: "0.14em" }}>{s.n}</div>
              <hr className="b3-rule-hot" style={{ margin: "14px 0 18px" }} />
              <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 600, letterSpacing: "-0.018em" }}>{s.h}</h3>
              <p style={{ margin: "12px 0 0", fontSize: 15, lineHeight: "24px", color: "var(--muted-foreground)", textWrap: "pretty" }}>{s.b}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section bg="var(--ink-100)" tight>
        <Slab style={{ padding: 0 }} part="IC-REACTOR / 1.2.0">
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", alignItems: "center" }}>
            <div style={{ padding: "56px 48px" }}>
              <div className="b3-eyebrow">For developers</div>
              <h2 className="b3-display" style={{ margin: "18px 0 0", fontSize: 40 }}>
                One call wires the client, the cache and the hooks.
              </h2>
              <p style={{ margin: "18px 0 0", fontSize: 16, lineHeight: "26px", color: "var(--muted-foreground)" }}>
                <code style={{ fontFamily: "var(--font-mono)", color: "var(--forge-500)" }}>defineReactor</code> creates the QueryClient, ClientManager, reactor and bound hooks — including <code style={{ fontFamily: "var(--font-mono)" }}>useAuth</code> and <code style={{ fontFamily: "var(--font-mono)" }}>useUserPrincipal</code>.
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: 30 }}>
                <Button variant="filled" color="primary" onClick={() => go("developers")}>Read the guide</Button>
                <Button variant="ghost" icon={icon("Package")}>npm</Button>
              </div>
            </div>
            <div style={{ padding: "48px 40px 48px 0" }}>
              <CodeBlock filename="src/reactor.ts" code={`import { defineReactor } from "@ic-reactor/react"
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
})`} />
            </div>
          </div>
        </Slab>
      </Section>

    </>
  );
}

Object.assign(window, { Home, Hero, HeroRun, NodeField });
