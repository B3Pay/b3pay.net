# b3pay.net

The public marketing site for **B3Pay** — open-source infrastructure for
decentralized applications, wallets and payments on the Internet Computer.

Built from `design/`, the B3Pay design system. Every colour, size, radius,
duration and string on the site comes from there; `design/readme.md` is the
brand guide and `design/HANDOFF.md` the per-page spec.

```
packages/ui/     @b3pay/ui — tokens, brand assets, 30 component primitives
apps/web/        b3pay.net — the Vite + React + TypeScript marketing site
apps/docs/       docs.b3pay.net — the documentation site, MDX over the same @b3pay/ui
api/contact.ts   Vercel function behind the contact form
design/          the design system, unchanged, as delivered
```

Two sites, one design system, one repository, two Vercel projects. See
[Documentation](#documentation) and [Deploying](#deploying).

## Running it

Node 22.12 or newer. Built and tested on 22.22.2 and 24.15.0.

```bash
npm install
npm run dev          # vite dev server                         b3pay.net
npm run build        # typecheck, bundle, prerender every route
npm run preview      # serve dist/ the way Vercel does         (localhost:4180)
npm run smoke        # interaction tests against a running preview

npm run dev:docs     # vite dev server                         docs.b3pay.net
npm run build:docs   # same three passes, into dist-docs/
npm run preview:docs # serve dist-docs/ the way Vercel does    (localhost:4181)
npm run smoke:docs   # interaction tests against a running docs preview

npm run typecheck    # both apps plus the API function
npm run brand:images # regenerate favicons + og.png from the brand mark
```

Each `smoke` script needs its matching `preview` running in another shell. They
drive Chrome through `puppeteer-core` and check the things a build cannot.

`npm run smoke` covers the ⌘K palette, focus trapping and return, the hero run
and its replay, `prefers-reduced-motion`, the mobile menu, per-route titles, and
that the contact form never reports a send it did not make.

`npm run smoke:docs` covers the palette, sidebar routing without a page load,
deep-link anchors, the on-this-page rail tracking scroll position, the pager,
the draft state and the mobile drawer — plus that the prose is in the document
with JavaScript disabled.

## How the build works

`npm run build` does three passes:

1. `vite build` — the client bundle.
2. `vite build --ssr` — the same app compiled for Node.
3. `apps/web/scripts/prerender.mjs` — renders each route with
   `react-dom/server` and writes `dist/<route>/index.html` with that route's
   `<title>`, description, canonical and Open Graph tags baked into the head.

The client build lands in `dist/` at the repo root — not under `apps/web` —
because that is where Vercel looks by default for a Vite app, and its dashboard
Output Directory setting outranks `vercel.json`. The SSR bundle stays in
`apps/web/dist-ssr`; it is an intermediate the prerender step consumes and
never ships.

The client hydrates whatever it finds. Without step 3 a crawler sees one empty
`<div id="root">` for six routes, and first paint waits on 165 kB of React —
Lighthouse performance sat at 74. With it, 93–95.

Routes, their metadata and their sitemap membership all come from one table:
[apps/web/src/site/routes.ts](apps/web/src/site/routes.ts). The nav, the ⌘K
palette, `sitemap.xml` and the prerender step read it, so a route cannot be
listed in one place and missing from another.

## Documentation

`apps/docs/` is docs.b3pay.net: guides for B3Forge, B3Wallet, IC Reactor and
B3Note, on the same `@b3pay/ui` primitives as the marketing site.

It is not a docs framework with a B3Pay theme bolted on. The design system
already had the parts — `Shell`, `SideNav`, `CodeBlock` ("the docs workhorse",
in its own doc comment), `Command`, `Tabs`, `Kbd`, `Alert` — and
`design/ui_kits/docs/` is a finished prototype of this exact layout. Starlight or
Nextra would have meant reimplementing that against someone else's chrome and
maintaining two divergent versions of the same design.

```
apps/docs/src/
  content/registry.ts     PROJECTS: the sidebar tree for all four projects
  content/<project>/*.mdx one file per page
  content/pages.ts        joins the two, and fails the build if they disagree
  components/mdx.tsx      what markdown renders into
  lib/mdx-plugins.mjs     TOC extraction; fenced code → CodeBlock
```

**Writing a page** means adding an `.mdx` file and one line to `registry.ts`.
Frontmatter carries `title`, `lead` and optionally `draft`. Miss either half and
the build stops with the list of orphans and the file it expected — the same
"one table, everything reads from it" rule as
[apps/web/src/site/routes.ts](apps/web/src/site/routes.ts).

Markdown gets the design system's typography from
[apps/docs/src/docs.css](apps/docs/src/docs.css). Three components are available
in any page without an import:

| | |
|---|---|
| `<Callout color title>` | An `Alert`. Same colours as everywhere else |
| `<ApiList rows={[[sig, pkg, desc]]} />` | The design's `api` block — signature, owning package, description |
| `<Draft repo>` | Marks a page as an outline |

Fenced code becomes a `CodeBlock` with its copy button; the text after the
language is the filename — ` ```ts src/reactor.ts `.

### Drafts

IC Reactor is written. The other three projects are outlines: every page exists
with its intended headings and a `<Draft>` banner, so the structure is reviewable
and the gaps are visible.

A page with `draft: true` is reachable, labelled in the body and in the sidebar,
**and kept out of `sitemap.xml` and served `noindex`**. Submitting outlines for
indexing is how a docs site earns a thin-content penalty, and it is the same call
that left `/blog` unlisted on the marketing site. Delete the flag when the page
is written; the sitemap picks it up on the next build.

## Deploying

Two sites deploy from this one repository, as **two Vercel projects** pointed at
the same GitHub repo. They are separate so that a docs build failure cannot take
down b3pay.net, and so editing a guide does not rebuild the marketing site.

`vercel.json` at the repo root carries what both sites share: `npm ci`, the SPA
rewrite for anything the prerendered files do not cover, and the security and
cache headers. `/api` is excluded from that rewrite on purpose — see
[api/contact.ts](api/contact.ts).

**What it deliberately does not carry is `buildCommand` and `outputDirectory`,
and they must not be added back.**

Those two fields — and `installCommand` — behave the opposite way round to the
rest of Vercel's configuration. When `vercel.json` defines them, **the file wins
and the dashboard fields are disabled**, greyed out with the file's values shown
as placeholders. That is fine for one project. With two projects reading one
`vercel.json`, it makes the per-project difference impossible to express: the
docs project cannot be told to run a different build, because the field it needs
is locked by a file it shares with the marketing site.

So both settings live in each project's dashboard, where they can differ.
`installCommand` stays in the file because both projects want the same `npm ci`.

| Project | Root Directory | Build Command | Output Directory |
|---|---|---|---|
| **b3pay.net** | *empty* (the repo root) | `npm run build` | `dist` |
| **docs.b3pay.net** | *empty* (the repo root) | `npm run build:docs` | `dist-docs` |

Set all four explicitly rather than leaving any empty. Empty means "whatever
Vercel's framework detection infers", detection runs against the Root Directory,
and the repo root has no bundler in its `package.json` — so the preset resolves
to "Other", whose default output directory is `public`. Leaving Output Directory
empty is what produced the error in the third row below, on a build that had
otherwise succeeded.

What each one costs when it is wrong:

| Setting | If it is wrong |
|---|---|
| Root Directory, pointing outside the repo root | `npm error No workspaces found: --workspace=apps/web`, because `apps/` is not visible from wherever the build ran |
| Root Directory, pointing at a workspace member | `npm error Missing script: "build:docs"` — npm resolves the script against that member's `package.json`, and fails before preflight can say why |
| Output Directory, wrong | `Error: No Output Directory named "dist" found after the Build completed` |
| Output Directory, empty | `Error: No Output Directory named "public" found after the Build completed` — nothing asked for `public`; it is the "Other" preset's default |
| Build Command on the docs project | No error at all — docs.b3pay.net silently serves a second copy of the marketing site |

The last line of every build prints the absolute path that was written. When
Vercel reports it cannot find the output, compare the two — `output
/vercel/path0/dist` against a message naming `public` is the whole diagnosis.

Both build scripts start with [scripts/preflight.mjs](scripts/preflight.mjs),
which prints the working directory and its contents and fails with the Root
Directory instruction rather than letting npm report a symptom four steps later.

### The docs subdomain

`b3pay.net` is registered at Namecheap with its nameservers delegated to
Cloudflare, so the record goes in the **Cloudflare** dashboard — Namecheap's DNS
panel is inert.

Add `docs.b3pay.net` under the docs project's Domains, then create the record
Vercel shows:

| Type | Name | Value | Proxy status |
|---|---|---|---|
| CNAME | `docs` | the target Vercel displays | **DNS only** (grey cloud) |

Leave it unproxied. Orange-clouding it puts Cloudflare in front of Vercel's edge,
which blocks the Let's Encrypt challenge, and with Cloudflare's SSL mode set to
Flexible it produces a redirect loop. Check too that any `CAA` record on the zone
permits `letsencrypt.org`, or issuance fails while the domain reads "Invalid
Configuration".

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

The same `dist/` deploys as an asset canister:

```json
{ "canisters": { "b3pay_web": { "type": "assets", "source": ["dist"] } } }
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
  hero, and `Pay 0.0241 BTC` in the run panel until it settles. All three are
  specified explicitly in `HANDOFF.md`. The one that was not — `Read the guide`
  in the developer slab — is outlined here. Worth a decision.
- **The hero run shows the Bitcoin leg, so it is ahead of `HANDOFF.md`.** The
  handoff specifies four steps over fifteen nodes at 1100ms; the panel in
  [HeroRun.tsx](apps/web/src/routes/home/HeroRun.tsx) runs six over seventeen
  at 900ms, because a buyer paying a ckBTC checkout starts by holding BTC. The
  three added calls are the real ckBTC minter flow — `get_btc_address`,
  `bitcoin_get_utxos`, `update_balance` — and the deposit bar above the list
  states the BTC → ckBTC conversion before any of them run. Two changes came
  with it: `icrc2_approve` is now followed by `icrc2_transfer_from` rather than
  `icrc1_transfer`, which would have ignored the allowance the approve just
  created, and the settlement fee reads `0.0000001` — the ckBTC ledger's actual
  10-satoshi fee. `btc-network` and `ckbtc-minter` are appended to `NODES` as
  15 and 16 so the indices the handoff documents still point at the same nodes.
- **Product docs links point at `#readme`** on each repository. There is no
  documentation site yet; these are the closest real URLs.
- **Fonts are still Google Fonts cuts**, now self-hosted via `@fontsource`
  (latin + latin-ext). If B3Pay licenses its own, replace the imports in
  `packages/ui/tokens/fonts.css` and leave the variable block alone.
