# b3pay.net

The public marketing site for **B3Pay** — open-source infrastructure for
decentralized applications, wallets and payments on the Internet Computer.

Built from `design/`, the B3Pay design system. Every colour, size, radius,
duration and string on the site comes from there; `design/readme.md` is the
brand guide and `design/HANDOFF.md` the per-page spec.

```
packages/ui/     @b3pay/ui — tokens, brand assets, 30 component primitives
apps/web/        the Vite + React + TypeScript site
api/contact.ts   Vercel function behind the contact form
design/          the design system, unchanged, as delivered
```

## Running it

Node 20.19+ or 22.12+.

```bash
npm install
npm run dev          # vite dev server
npm run build        # typecheck, bundle, prerender every route
npm run preview      # serve dist/ the way Vercel does (localhost:4180)
npm run smoke        # interaction tests against a running preview
npm run typecheck
npm run brand:images # regenerate favicons + og.png from the brand mark
```

`npm run smoke` needs `npm run preview` running in another shell. It drives
Chrome through `puppeteer-core` and checks the things a build cannot: the ⌘K
palette, focus trapping and return, the hero run and its replay,
`prefers-reduced-motion`, the mobile menu, per-route titles, and that the
contact form never reports a send it did not make.

## How the build works

`npm run build` does three passes:

1. `vite build` — the client bundle.
2. `vite build --ssr` — the same app compiled for Node.
3. `apps/web/scripts/prerender.mjs` — renders each route with
   `react-dom/server` and writes `dist/<route>/index.html` with that route's
   `<title>`, description, canonical and Open Graph tags baked into the head.

The client hydrates whatever it finds. Without step 3 a crawler sees one empty
`<div id="root">` for six routes, and first paint waits on 165 kB of React —
Lighthouse performance sat at 74. With it, 93–95.

Routes, their metadata and their sitemap membership all come from one table:
[apps/web/src/site/routes.ts](apps/web/src/site/routes.ts). The nav, the ⌘K
palette, `sitemap.xml` and the prerender step read it, so a route cannot be
listed in one place and missing from another.

## Deploying

`vercel.json` at the repo root points Vercel at
`npm run build -w apps/web` → `apps/web/dist`, with an SPA rewrite for anything
the prerendered files do not cover. `/api` is excluded from that rewrite on
purpose — see [api/contact.ts](api/contact.ts).

Connect this repo in the Vercel dashboard for per-PR previews, then add the
custom domain.

### Contact form

The form posts to `/api/contact`, which relays through
[Resend](https://resend.com). Set three environment variables in
Vercel → Settings → Environment Variables (see [.env.example](.env.example)):

| Variable | |
|---|---|
| `RESEND_API_KEY` | https://resend.com/api-keys |
| `CONTACT_TO_EMAIL` | where submissions land |
| `CONTACT_FROM_EMAIL` | a verified sender on the Resend domain |

With any of them missing the endpoint returns 503 and the form shows the
failure. It never reports a delivery it did not achieve.

### Later: the Internet Computer

The same `apps/web/dist` deploys as an asset canister:

```json
{ "canisters": { "b3pay_web": { "type": "assets", "source": ["apps/web/dist"] } } }
```

```bash
dfx deploy b3pay_web --network ic
```

Vercel for the marketing edge, the canister as the sovereign copy.

## Notes for the B3Pay team

Things that came up building this, in the order they matter.

- **`/blog` is built but unlisted.** The four posts have real titles, dates and
  summaries, but no post bodies exist in any B3Pay source, and none were
  invented. The page renders at its URL and is linked from the footer and the
  palette; it is out of the NavBar, out of `sitemap.xml`, and carries
  `noindex,follow`. Flip `inNav` and `inSitemap` on the `/blog` entry in
  `routes.ts` once the posts are written — nothing else needs to change.
- **Three design-system fixes live in the site, not the system.** They belong
  upstream in `@b3pay/ui` and are commented where they sit, in
  [apps/web/src/site/site.css](apps/web/src/site/site.css):
  - No `box-sizing: border-box` reset. The component geometry assumes one —
    `.b3-field { width: 100%; padding: 0 12px; border: 1px }` otherwise
    overflows its container by 26px, and no control is the height its size
    class claims.
  - `.b3-badge--soft` sets text in `--c`. For `--success` and `--warning` that
    is 4.15:1 at badge sizes, under AA. Lifted toward `--foreground`.
  - `CodeBlock`'s line-number gutter used `--ink-500` on `--ink-050`: 2.25:1.
    Now `--muted-foreground`.
- **The footer's licence line used `--text-mark`.** That token is 3.6:1 by
  design and the brand guide reserves it for decoration. A copyright and a
  licence are content, so they are `--muted-foreground` now.
- **`Icon` needs a registry.** The prototype resolved `name` against a Lucide
  UMD bundle at runtime; a bundler cannot do that and tree-shake. The reachable
  set is written down in
  [packages/ui/components/core/Icon.tsx](packages/ui/components/core/Icon.tsx)
  and extended with `registerIcons()`. `lucide-react` is pinned to `0.469.0`,
  the version `design/readme.md` names — and the last one that still ships the
  brand glyphs (`Github`).
- **The home page carries three Forge-orange surfaces**, against the brand
  guide's one-per-view rule: `Get started` in the nav, `Start building` in the
  hero, and `Pay 0.0241 ckBTC` in the run panel until it settles. All three are
  specified explicitly in `HANDOFF.md`. The one that was not — `Read the guide`
  in the developer slab — is outlined here. Worth a decision.
- **Product docs links point at `#readme`** on each repository. There is no
  documentation site yet; these are the closest real URLs.
- **Fonts are still Google Fonts cuts**, now self-hosted via `@fontsource`
  (latin + latin-ext). If B3Pay licenses its own, replace the imports in
  `packages/ui/tokens/fonts.css` and leave the variable block alone.
