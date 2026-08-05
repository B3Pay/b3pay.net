# B3Pay marketing site

The site B3Pay does not have yet. Six routes, all client-side, no build step.

| File | What it holds |
|---|---|
| `index.html` | Entry. Loads React, Babel, the design-system bundle, then the four JSX files in order. |
| `site.jsx` | Shared furniture — `Section`, `Rule`, `Stat`, `Slab` — and the `PRODUCTS` data, written from the B3Pay repository READMEs. |
| `Home.jsx` | Hero (with a live `WorkflowNode` graph that steps through a run), product grid, how-it-works, the `defineReactor` slab, stats. |
| `Products.jsx` | Tabbed product detail for all five projects, each with its own aside. |
| `Pages.jsx` | Developers, About, Blog, Contact. |
| `App.jsx` | Route state, nav bar, footer, `⌘K` command palette. |

**Interactions to try:** click any nav item or product card; `⌘K` for the palette; the
product tabs; submit the contact form (it fakes a success state); the developer page's code
tabs.

**Copy rules applied:** no banned words, sentence-case headings, mono uppercase eyebrows,
no emoji, chains limited to ICP / Bitcoin / Ethereum / ckBTC / ckETH.

Every product claim on these pages comes from a B3Pay README. Nothing is invented.
