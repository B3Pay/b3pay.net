const { IconOf, Button, Badge, Card, CardHeader, CardContent, CardFooter, Icon, CodeBlock, Tabs, Input, Alert, Label, Select, Textarea, Checkbox, BrandMark } = (typeof window !== "undefined" && window.B3PayDesignSystem_8a84cb) || {};
const icon = IconOf;

/* ── Developers ────────────────────────────────────────────────── */
function Developers({ go }) {
  const [tab, setTab] = React.useState("react");
  const samples = {
    react: { file: "src/App.tsx", code: `function Greeting() {
  const { data, isPending, error } = useActorQuery({
    functionName: "greet",
    args: ["World"],
  })

  if (isPending) return <div>Loading…</div>
  if (error) return <div>Error: {error.message}</div>
  return <h1>{data}</h1>
}` },
    factory: { file: "src/queries.ts", code: `export const getProfile = createQuery(backendReactor, {
  functionName: "get_profile",
})

export const updateProfile = createMutation(backendReactor, {
  functionName: "update_profile",
  invalidateQueries: [getProfile.getQueryKey()],
})` },
    codegen: { file: "vite.config.ts", code: `export default defineConfig({
  plugins: [
    react(),
    icReactor({
      canisters: [{ name: "backend", didFile: "./backend/backend.did" }],
    }),
  ],
})` },
  };
  const s = samples[tab];
  return (
    <>
      <Section eyebrow="For developers" title="Typed canister calls, cached and invalidated for you."
        lead="IC Reactor sits above the raw Actor API. You keep type safety and control; you stop writing cache keys by hand." />

      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px 96px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,0.85fr) minmax(0,1.15fr)", gap: 48, alignItems: "start" }}>
          <div>
            <div className="b3-eyebrow" style={{ marginBottom: 16 }}>Install</div>
            <CodeBlock filename="React apps" code={"pnpm add @ic-reactor/react @icp-sdk/core @tanstack/react-query"} />
            <div style={{ height: 10 }} />
            <CodeBlock filename="Non-React" code={"pnpm add @ic-reactor/core @icp-sdk/core @tanstack/query-core"} />

            <div className="b3-eyebrow" style={{ margin: "40px 0 14px" }}>Packages</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {[
                ["@ic-reactor/core", "ClientManager, Reactor, DisplayReactor"],
                ["@ic-reactor/react", "Hooks and query/mutation factories"],
                ["@ic-reactor/candid", "Dynamic Candid parsing"],
                ["@ic-reactor/parser", "WASM Candid parser"],
                ["@ic-reactor/codegen", "Shared codegen pipeline"],
                ["@ic-reactor/cli", "Declarations and typed hooks"],
                ["@ic-reactor/vite-plugin", "Watch-mode hook generation"],
              ].map(([n, d]) => (
                <div key={n} style={{ padding: "12px 0", borderTop: "1px solid var(--border)" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--forge-500)" }}>{n}</div>
                  <div style={{ fontSize: 13, color: "var(--muted-foreground)", marginTop: 3 }}>{d}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Tabs variant="underline" value={tab} onChange={setTab} tabs={[
              { value: "react", label: "Hooks" },
              { value: "factory", label: "Query factories" },
              { value: "codegen", label: "Codegen" },
            ]} />
            <div style={{ marginTop: 20 }}><CodeBlock filename={s.file} code={s.code} numbered /></div>

            <div style={{ marginTop: 28 }}>
              <Alert color="info" title="Do not call hooks outside React" icon={icon("Info")}>
                Use <code style={{ fontFamily: "var(--font-mono)" }}>getProfile.fetch()</code> and <code style={{ fontFamily: "var(--font-mono)" }}>updateProfile.execute()</code> in loaders, services and tests.
              </Alert>
            </div>

            <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 12 }}>
              <Card><CardHeader title="Reactor vs Actor" description="Caching, background refetch, typed Ok/Err and shared auth — none of which the standard Actor gives you." icon={icon("GitCompare")} /></Card>
              <Card><CardHeader title="Agent skills" description="ic-reactor-hooks ships as an installable skill for AI coding agents." icon={icon("Bot")} /></Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── About ─────────────────────────────────────────────────────── */
function About() {
  return (
    <>
      <Section eyebrow="About" title="A small team building in the open since 2023."
        lead="B3Pay started as a self-custodial wallet experiment on the Internet Computer and grew into a set of libraries other teams now depend on. Every line is public." />
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px 120px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 64 }}>
          <div>
            <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, letterSpacing: "-0.022em" }}>What we are working toward</h3>
            <p style={{ margin: "16px 0 0", fontSize: 16, lineHeight: "26px", color: "var(--muted-foreground)", textWrap: "pretty" }}>
              Decentralized payments that are simple enough for everyday users and businesses. That is a long way off,
              and the honest path there runs through tooling: wallets people can actually recover, libraries that make
              canister integration boring, and workflows a non-programmer can read.
            </p>
            <div style={{ marginTop: 32, display: "flex", flexDirection: "column" }}>
              {[
                ["2023", "B3Wallet — multi-chain, multi-owner canister wallet"],
                ["2023", "b3_utils published to crates.io"],
                ["2023", "B3Note — witness-like encryption demo on VetKeys"],
                ["2024", "IC Reactor reaches seven packages"],
                ["2025", "B3Forge enters beta — browser workflow execution"],
              ].map(([y, t]) => (
                <div key={t} style={{ display: "flex", gap: 20, padding: "14px 0", borderTop: "1px solid var(--border)" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--forge-500)", width: 40, flex: "none" }}>{y}</span>
                  <span style={{ fontSize: 15, lineHeight: "22px" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Slab style={{ padding: 40 }}>
              <BrandMark variant="stacked" size={64} />
              <p style={{ margin: "32px 0 0", fontFamily: "var(--font-accent)", fontSize: 24, lineHeight: "34px", color: "var(--ink-800)", textWrap: "pretty" }}>
                Users maintain exclusive control over their canisters, and therefore their funds.
              </p>
              <div className="b3-eyebrow" style={{ marginTop: 18 }}>B3Wallet README</div>
            </Slab>
            <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 12 }}>
              <Card><CardHeader title="Open by default" description="MIT on every repository. Issues and PRs welcome." icon={icon("Github")} /></Card>
              <Card><CardHeader title="Agent-ready" description="llms.txt, AGENTS.md and skill packages ship with the code." icon={icon("Terminal")} /></Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Blog ──────────────────────────────────────────────────────── */
const POSTS = [
  { t: "Candid expressions: referencing prior node outputs", d: "2025-11-04", tag: "B3Forge", e: "How $N0.Ok.amount resolves, why opt-depth matters, and what the Rust compatibility engine rejects at edit time." },
  { t: "defineReactor: one call instead of three", d: "2025-09-18", tag: "IC Reactor", e: "The manual construction order still works. Here is when you still need it." },
  { t: "Why B3Wallet upgrades itself", d: "2025-06-02", tag: "B3Wallet", e: "Self-upgrade keeps a user-owned canister current without asking us for permission." },
  { t: "Timelock notes with VetKeys", d: "2024-12-11", tag: "B3Note", e: "Identity-based encryption without email addresses or pre-shared keys." },
];

function Blog() {
  return (
    <>
      <Section eyebrow="Writing" title="Notes from the build."
        lead="Implementation write-ups, not announcements." />
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px 120px" }}>
        {POSTS.map((p) => (
          <a key={p.t} href="#" style={{ display: "grid", gridTemplateColumns: "120px 1fr auto", gap: 28, alignItems: "baseline", padding: "26px 0", borderTop: "1px solid var(--border)", textDecoration: "none", color: "inherit" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-600)" }}>{p.d}</span>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, letterSpacing: "-0.022em" }}>{p.t}</div>
              <div style={{ fontSize: 15, lineHeight: "24px", color: "var(--muted-foreground)", marginTop: 8, maxWidth: 620 }}>{p.e}</div>
            </div>
            <Badge size="xs" color="secondary">{p.tag}</Badge>
          </a>
        ))}
      </div>
    </>
  );
}

/* ── Contact / get started ─────────────────────────────────────── */
function Contact() {
  const [sent, setSent] = React.useState(false);
  return (
    <Section eyebrow="Get started" title="Tell us what you are building."
      lead="Grant applications, integration questions and bug reports all land in the same inbox. We answer in engineering terms.">
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 64, alignItems: "start" }}>
        <Card>
          <CardContent style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {sent ? (
              <div style={{ padding: "40px 0", textAlign: "center" }}>
                <div style={{ color: "var(--success)" }}><Icon name="Check" size={28} style={{ margin: "0 auto" }} /></div>
                <p style={{ margin: "14px 0 0", fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600 }}>Message sent</p>
                <p style={{ margin: "8px 0 0", fontSize: 14, color: "var(--muted-foreground)" }}>We reply within two working days.</p>
                <Button style={{ marginTop: 20 }} variant="outlined" size="sm" onClick={() => setSent(false)}>Send another</Button>
              </div>
            ) : (
              <>
                <div><Label htmlFor="n" required>Name</Label><Input id="n" size="lg" placeholder="Ada Lovelace" /></div>
                <div><Label htmlFor="e" required>Email</Label><Input id="e" size="lg" placeholder="ada@example.org" /></div>
                <div><Label htmlFor="t">Topic</Label><Select id="t" size="lg" options={["Integration question", "Grant / partnership", "Bug report", "Something else"]} /></div>
                <div><Label htmlFor="m">Message</Label><Textarea id="m" rows={5} placeholder="What are you building, and where are you stuck?" /></div>
                <Checkbox id="oss" label="I am happy for this to be discussed in a public issue" />
                <Button variant="filled" color="primary" size="lg" fullWidth onClick={() => setSent(true)}>Send</Button>
              </>
            )}
          </CardContent>
        </Card>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {[
            ["GitHub", "github.com/B3Pay", "Github"],
            ["Documentation", "IC Reactor docs and package READMEs", "BookOpen"],
            ["Crates", "docs.rs/b3_utils", "Package"],
            ["Live demo", "B3Note on icp0.io", "Play"],
          ].map(([k, v, ic]) => (
            <a key={k} href="#" style={{ display: "flex", gap: 16, alignItems: "center", padding: "20px 0", borderTop: "1px solid var(--border)", textDecoration: "none", color: "inherit" }}>
              <span style={{ color: "var(--forge-500)" }}><Icon name={ic} size={18} /></span>
              <span style={{ flex: 1 }}>
                <span style={{ display: "block", fontSize: 15, fontWeight: 500 }}>{k}</span>
                <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted-foreground)", marginTop: 3 }}>{v}</span>
              </span>
              <Icon name="ArrowUpRight" size={15} style={{ color: "var(--muted-foreground)" }} />
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
}

Object.assign(window, { Developers, About, Blog, Contact, POSTS });
