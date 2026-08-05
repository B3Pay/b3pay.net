const DOC_NAV = [
  { label: "Getting started", items: [
    { value: "why", label: "Why IC Reactor" },
    { value: "install", label: "Install" },
    { value: "quickstart", label: "Quick start", badge: "★" },
  ] },
  { label: "Core patterns", items: [
    { value: "hooks", label: "Generic hooks" },
    { value: "factories", label: "Query factories" },
    { value: "display", label: "DisplayReactor" },
  ] },
  { label: "Codegen", items: [
    { value: "vite", label: "Vite plugin" },
    { value: "cli", label: "CLI" },
  ] },
  { label: "Reference", items: [
    { value: "api", label: "API reference" },
    { value: "candid", label: "Dynamic Candid" },
  ] },
];

const DOCS = {
  quickstart: {
    crumb: ["Getting started", "Quick start"],
    title: "Quick start",
    lead: "One call creates the QueryClient, ClientManager, reactor and bound hooks — including useAuth, useAgentState, useUserPrincipal and useIdentityAttributes.",
    toc: ["Fastest path", "Use in components", "What you get"],
    blocks: [
      { type: "h", text: "Fastest path: defineReactor" },
      { type: "p", text: "Point defineReactor at a canister and it wires the whole client for you. The manual construction order still exists for when you need explicit control." },
      { type: "code", file: "src/reactor.ts", code: `import { defineReactor } from "@ic-reactor/react"
import { idlFactory, type _SERVICE } from "./declarations/my_canister"

export const {
  reactor: backendReactor,
  queryClient,
  clientManager,
  useActorQuery,
  useActorMutation,
  useAuth,
} = defineReactor<_SERVICE>({
  name: "backend",
  idlFactory,
  canisterId: "rrkah-fqaaa-aaaaa-aaaaq-cai",
  display: true,
})` },
      { type: "h", text: "Use in components" },
      { type: "code", file: "src/App.tsx", code: `function Greeting() {
  const { data, isPending, error } = useActorQuery({
    functionName: "greet",
    args: ["World"],
  })

  if (isPending) return <div>Loading…</div>
  if (error) return <div>Error: {error.message}</div>
  return <h1>{data}</h1>
}` },
      { type: "callout", color: "warning", title: "Hooks are React-only", text: "Do not call useActorQuery, .useQuery() or .useMutation() outside React components or custom hooks. For loaders and services use fetch() and execute()." },
      { type: "h", text: "What you get" },
      { type: "table", head: ["Feature", "Standard Actor", "IC Reactor"], rows: [
        ["Type-safe method calls", "yes", "yes"],
        ["Query caching", "no", "yes"],
        ["Background refetching", "no", "yes"],
        ["Typed Ok/Err handling", "manual", "yes"],
        ["Shared auth + cache", "no", "ClientManager"],
        ["Display transforms", "no", "DisplayReactor"],
      ] },
    ],
  },
  api: {
    crumb: ["Reference", "API reference"],
    title: "API reference",
    lead: "Every export in @ic-reactor/react, with the package that owns it.",
    toc: ["Factories", "Hooks", "Managers"],
    blocks: [
      { type: "h", text: "Factories" },
      { type: "api", rows: [
        ["defineReactor<T>(config)", "@ic-reactor/react", "Creates QueryClient, ClientManager, Reactor and bound hooks in one call."],
        ["createActorHooks(reactor)", "@ic-reactor/react", "Returns useActorQuery, useActorMutation, useActorSuspenseQuery, useActorInfiniteQuery."],
        ["createAuthHooks(auth)", "@ic-reactor/react", "Returns useAuth and useUserPrincipal."],
        ["createQuery(reactor, opts)", "@ic-reactor/react", "Reusable query object usable inside and outside React."],
        ["createMutation(reactor, opts)", "@ic-reactor/react", "Reusable mutation with invalidateQueries support."],
      ] },
      { type: "h", text: "Managers" },
      { type: "api", rows: [
        ["ClientManager", "@ic-reactor/core", "Shared agent and cache coordination."],
        ["AuthenticationManager", "@ic-reactor/react", "Internet Identity login, logout and delegation."],
        ["Reactor<T>", "@ic-reactor/core", "Typed canister runtime: fetchQuery, callMethod, invalidateQueries."],
        ["DisplayReactor", "@ic-reactor/core", "Reactor with UI-friendly transforms — bigint and Principal as strings."],
        ["CandidDisplayReactor", "@ic-reactor/candid", "Runtime Candid parsing for explorers and dev tools."],
      ] },
    ],
  },
  install: {
    crumb: ["Getting started", "Install"],
    title: "Install",
    lead: "Pick the entry point that matches your app.",
    toc: ["React", "Non-React", "Optional"],
    blocks: [
      { type: "h", text: "React apps" },
      { type: "code", file: "terminal", code: "pnpm add @ic-reactor/react @icp-sdk/core @tanstack/react-query" },
      { type: "h", text: "Non-React apps" },
      { type: "code", file: "terminal", code: "pnpm add @ic-reactor/core @icp-sdk/core @tanstack/query-core" },
      { type: "h", text: "Optional packages" },
      { type: "code", file: "terminal", code: `# Internet Identity auth helpers
pnpm add @icp-sdk/auth

# Dynamic Candid support (explorers / dev tools)
pnpm add @ic-reactor/candid @ic-reactor/parser` },
    ],
  },
};

Object.assign(window, { DOC_NAV, DOCS });
