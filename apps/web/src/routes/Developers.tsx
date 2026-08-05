import { useState } from "react";
import { Alert, Card, CardHeader, CodeBlock, IconOf, Tabs } from "@b3pay/ui";

import { Section } from "../site/furniture";
import { routeMeta } from "../site/routes";
import { useSeo } from "../lib/seo";

const SAMPLES = {
  react: {
    file: "src/App.tsx",
    code: `function Greeting() {
  const { data, isPending, error } = useActorQuery({
    functionName: "greet",
    args: ["World"],
  })

  if (isPending) return <div>Loading…</div>
  if (error) return <div>Error: {error.message}</div>
  return <h1>{data}</h1>
}`,
  },
  factory: {
    file: "src/queries.ts",
    code: `export const getProfile = createQuery(backendReactor, {
  functionName: "get_profile",
})

export const updateProfile = createMutation(backendReactor, {
  functionName: "update_profile",
  invalidateQueries: [getProfile.getQueryKey()],
})`,
  },
  codegen: {
    file: "vite.config.ts",
    code: `export default defineConfig({
  plugins: [
    react(),
    icReactor({
      canisters: [{ name: "backend", didFile: "./backend/backend.did" }],
    }),
  ],
})`,
  },
} as const;

type SampleKey = keyof typeof SAMPLES;

const PACKAGES: [string, string][] = [
  ["@ic-reactor/core", "ClientManager, Reactor, DisplayReactor"],
  ["@ic-reactor/react", "Hooks and query/mutation factories"],
  ["@ic-reactor/candid", "Dynamic Candid parsing"],
  ["@ic-reactor/parser", "WASM Candid parser"],
  ["@ic-reactor/codegen", "Shared codegen pipeline"],
  ["@ic-reactor/cli", "Declarations and typed hooks"],
  ["@ic-reactor/vite-plugin", "Watch-mode hook generation"],
];

export default function Developers() {
  const [tab, setTab] = useState<SampleKey>("react");
  const s = SAMPLES[tab];
  useSeo(routeMeta("/developers"));

  return (
    <>
      <Section
        as="h1"
        eyebrow="For developers"
        title="Typed canister calls, cached and invalidated for you."
        lead="IC Reactor sits above the raw Actor API. You keep type safety and control; you stop writing cache keys by hand."
      />

      <div className="site-shell site-shell--tight">
        <div className="site-grid-split-b">
          <div>
            <h2 className="b3-eyebrow" style={{ margin: "0 0 16px" }}>
              Install
            </h2>
            <CodeBlock
              filename="React apps"
              code={"pnpm add @ic-reactor/react @icp-sdk/core @tanstack/react-query"}
            />
            <div style={{ height: 10 }} />
            <CodeBlock
              filename="Non-React"
              code={"pnpm add @ic-reactor/core @icp-sdk/core @tanstack/query-core"}
            />

            <h2 className="b3-eyebrow" style={{ margin: "40px 0 14px" }}>
              Packages
            </h2>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {PACKAGES.map(([n, d]) => (
                <div key={n} style={{ padding: "12px 0", borderTop: "1px solid var(--border)" }}>
                  <a
                    href={`https://www.npmjs.com/package/${n}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}
                  >
                    {n}
                  </a>
                  <div style={{ fontSize: 13, color: "var(--muted-foreground)", marginTop: 3 }}>
                    {d}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Tabs
              variant="underline"
              value={tab}
              onChange={(v) => setTab(v as SampleKey)}
              aria-label="Code sample"
              tabs={[
                { value: "react", label: "Hooks" },
                { value: "factory", label: "Query factories" },
                { value: "codegen", label: "Codegen" },
              ]}
            />
            <div style={{ marginTop: 20 }}>
              <CodeBlock filename={s.file} code={s.code} numbered />
            </div>

            <div style={{ marginTop: 28 }}>
              <Alert color="info" title="Do not call hooks outside React" icon={IconOf("Info")}>
                Use <code style={{ fontFamily: "var(--font-mono)" }}>getProfile.fetch()</code> and{" "}
                <code style={{ fontFamily: "var(--font-mono)" }}>updateProfile.execute()</code> in
                loaders, services and tests.
              </Alert>
            </div>

            <div className="site-grid-pair" style={{ marginTop: 28 }}>
              <Card>
                <CardHeader
                  title="Reactor vs Actor"
                  description="Caching, background refetch, typed Ok/Err and shared auth — none of which the standard Actor gives you."
                  icon={IconOf("GitCompare")}
                />
              </Card>
              <Card>
                <CardHeader
                  title="Agent skills"
                  description="ic-reactor-hooks ships as an installable skill for AI coding agents."
                  icon={IconOf("Bot")}
                />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
