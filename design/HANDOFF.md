# Handoff: b3pay.net — marketing site

> This file lives at the root of the B3Pay design-system project. Everything it references
> is in this same project — download the whole project and the paths below resolve.


## Overview

The public marketing site for **B3Pay**, an organisation building open-source infrastructure
for decentralized applications, wallets and payments on the **Internet Computer**. B3Pay has
had no website; this is it. Six routes: Home, Products, Developers, About, Blog, Contact.

Target domain: **b3pay.net**.

The site's job is to make five open-source projects legible to ICP and Web3 developers,
startup teams and organisations building decentralized apps — and to get them into the docs
or the GitHub org. Every product claim on the site is taken from a B3Pay repository README;
none of it is invented marketing copy.

## About the design files

**The files in this bundle are design references created in HTML.** They are prototypes that
show intended look and behaviour — they are not production code to copy directly. They use
in-browser Babel, a hand-rolled route switch, and a runtime-compiled component bundle. None
of that should ship.

Your task is to **recreate these designs in a real codebase**. There is no existing web
codebase for b3pay.net, so choose the framework. Recommended, given the rest of the B3Pay
stack and the deploy target:

- **Vite + React + TypeScript**, matching `B3Pay/b3forge`'s frontend (React 18, TanStack, Vite).
- Or **Next.js** static export, if SEO and per-route metadata matter more than stack symmetry.

Either builds to static assets, which is what an ICP asset canister serves.

### Deploying to the Internet Computer

The natural home for b3pay.net is an asset canister, same as the rest of B3Pay:

```json
// dfx.json
{
  "canisters": {
    "www": {
      "type": "assets",
      "source": ["dist"],
      "build": ["pnpm build"]
    }
  }
}
```

Then `dfx deploy --network ic www`, and point `b3pay.net` at the canister via a custom domain
(`.ic-assets.json` + the boundary-node custom-domain flow).

## Fidelity

**High-fidelity.** Colours, typography, spacing, radii, shadows, durations and easings are all
final and are all tokenised. Recreate pixel-for-pixel.

Two things are *not* final and need a decision before build:

1. **Fonts are Google Fonts substitutions.** Space Grotesk, Inter, JetBrains Mono and
   Instrument Serif are the four families named in `b3forge/frontend/styles.css`, so the
   *choice* comes from B3Pay's own code — but no licensed binaries exist. Currently loaded via
   `@import` from Google Fonts in `tokens/fonts.css`. Self-host them (fontsource
   or a local `@font-face` set) before launch; a canister-served site should not depend on a
   third-party CDN for text rendering.
2. **Icons load from a CDN at runtime.** See *Assets* below — replace with the real package.

## Where the design system ends and the site begins

Two things ship here, and they are separate concerns:

- `design-system/` — the **B3Pay design system**. Tokens, component primitives, brand assets,
  and `DESIGN_GUIDE.md` (the full brand guide: voice, colour, type, motion, iconography).
  This is reusable across b3pay.net, B3Forge, docs, and anything else B3Pay builds. Publish it
  as an internal package (`@b3pay/ui`) rather than copying it into the site repo.
- `prototype/` — the **site**, composed from those primitives.

Read `readme.md` first. It is the source of truth for anything this
document does not cover, and it documents *why* values are what they are.

---

## Design tokens

All tokens are plain CSS custom properties in `design-system/tokens/`, imported by
`styles.css`. Ship that file as-is; do not re-derive the values.

### Colour — ink (cool 240° neutral axis, dark-first)

| Token | Value | Role |
|---|---|---|
| `--ink-050` | `#0A0A0B` | Code block backgrounds |
| `--ink-100` | `#111111` | Brand near-black, from the logo artboards |
| `--ink-150` | `#111113` | `--background` — the page |
| `--ink-200` | `#1A1A1D` | `--card` |
| `--ink-250` | `#212125` | `--secondary` |
| `--ink-300` | `#26262A` | `--muted` |
| `--ink-400` | `#303035` | `--border`, `--input` |
| `--ink-500` | `#4A4A52` | Inactive dots, node-field edges |
| `--ink-600` | `#6B6B75` | `--text-mark` (decoration only) |
| `--ink-700` | `#9E9EA8` | `--muted-foreground` |
| `--ink-800` | `#C4C4CA` | Code text |
| `--ink-900` | `#F2F2F2` | `--foreground` |

### Colour — Forge (brand orange, from the Figma variables)

| Token | Value | Figma mode | Role |
|---|---|---|---|
| `--forge-300` | `#FFA056` | IC - Dark | Link hover |
| `--forge-400` | `#FF9230` | Dark | — |
| `--forge-500` | `#FF8D28` | Accents/Orange | `--accent`, `--ring`, links, active nodes |
| `--forge-600` | `#ED7437` | Forge | `--primary` |
| `--forge-700` | `#C55300` | Light | Light-theme primary |
| `--forge-800` | `#8A3A00` | — | — |
| `--forge-900` | `#3D1A00` | — | — |

`--primary-foreground` is `#150800`, not white — the CTA is dark text on orange.

**Rule: one Forge surface per view.** Orange marks the single most important action or the
live state.

### Colour — status (exact HSL from the B3Forge app, dark theme)

`--error #811D1D` · `--success #199A48` · `--warning #C47F09` · `--info #0EA5E9` · `--alert #DF5F06`

### Colour — text roles

Three content levels and one decoration level. There is no fifth.

| Token | Use | Contrast on `--background` |
|---|---|---|
| `--foreground` | Headings, body | 16.4:1 |
| `--muted-foreground` | Secondary, metadata, eyebrows | 7.1:1 |
| `--forge-500` | Links, interactive text | 8.2:1 |
| `--text-mark` | Registration marks, figure numbers, part numbers, the spine. **Decoration only — nothing that carries meaning.** | 3.6:1, below AA on purpose |

### Typography

| Token | Stack | Job |
|---|---|---|
| `--font-display` | Space Grotesk, Inter, sans-serif | Headings, hero, card titles, metrics |
| `--font-sans` | Inter, system-ui | Body, UI labels, buttons, nav |
| `--font-mono` | JetBrains Mono, ui-monospace | Principals, canister IDs, Candid, code, eyebrows, badges, all metadata |
| `--font-accent` | Instrument Serif, Georgia | Pull quotes only |

Scale (`--text-*` / `--text-*-lh`):
`2xs 10/14` · `xs 11/16` · `sm 12/18` · `base 14/22` · `md 16/26` · `lg 18/28` · `xl 21/30` ·
`2xl 26/32` · `3xl 34/38` · `4xl 46/48` · `5xl 62/62` · `6xl 84/80` · `7xl 116/104`

The 10/11/12px steps are the B3Forge control sizes verbatim. Do not round them.

Tracking: `--tracking-tightest -0.035em` · `tighter -0.022em` · `tight -0.012em` ·
`wide 0.04em` · `widest 0.14em` (mono eyebrows).

### Spacing

4px base: `2 4 6 8 10 12 14 16 20 24 28 32 40 48 64 80 96 128 160`.
Layout: `--gutter 24px` · `--page-max 1240px` · `--prose-max 68ch` ·
`--section-y 120px` · `--section-y-tight 72px`.

### Radius

Derived from the app's `--radius: 0.625rem`. **Do not snap these to a 4/8px grid.**

`--radius-xs 4px` · `sm 6px` · `md 8px` · `lg 10px` (`--radius`) · `xl 14px` · `2xl 20px` · `full 9999px`

Radius scales with control size — an `xs` button gets `radius-xs`, an `xl` button `radius-xl`.

**Open question for the team:** the marketing surfaces override cards to `border-radius: 0`
because the machined visual language wants square corners. The 10px scale comes from the
B3Forge app. Decide whether b3pay.net goes fully square or keeps 10px in-product.

### Shadows

`--shadow-xs 0 1px 2px rgb(0 0 0/.05)` (input rest) ·
`--shadow-sm 0 1px 3px rgb(0 0 0/.1), 0 1px 2px -1px rgb(0 0 0/.1)` (outlined button) ·
`--shadow-md 0 4px 12px -2px rgb(0 0 0/.35)` (card hover) ·
`--shadow-lg 0 18px 48px -12px rgb(0 0 0/.55)` (dialogs, menus) ·
`--glow-forge-sm 0 0 0 1px rgb(237 116 55/.35), 0 0 16px -2px rgb(237 116 55/.45)` (primary hover)

### Motion

| Token | Value | Use |
|---|---|---|
| `--dur-instant` | 120ms | Hover tint |
| `--dur-fast` | 150ms | Every interactive control |
| `--dur-base` | 200ms | Panels, accordions |
| `--dur-slow` | 250ms | Drawer, dialog, state changes in the hero panel |
| `--dur-slower` | 300ms | Dock pill |
| `--dur-hero` | 900ms | Landing reveals |
| `--ease-out` | `cubic-bezier(0,0,.2,1)` | Default |
| `--ease-in-out` | `cubic-bezier(.4,0,.2,1)` | Breathing loops |
| `--ease-dock` | `cubic-bezier(.22,1,.36,1)` | **Signature curve** — everything entering the viewport |

Keyframes: `b3-border-pulse` (2s, loading buttons), `b3-glow-breathe` (4s, hero heat line),
`b3-dock-enter`, `b3-slide-in-right`, `b3-edge-flow`, `b3-shimmer`, `b3-ember`.

`prefers-reduced-motion: reduce` is honoured globally in `tokens/motion.css`. Keep that.

**No bounce. No scroll-jacking. No parallax.**

---

## The machined visual language

Six utilities in `components/b3-components.css` carry the brand's "forge"
identity. They are what makes the site not look like a generic dark developer site. Port all
of them.

| Class | What it does |
|---|---|
| `.b3-colgrid` | 12 vertical hairlines at `--hairline` (`rgb(255 255 255 / .08)`), `max-width: 1240px`, centred, `position:absolute; inset:0`. Sits behind **every** section. This is the single biggest contributor to the look. |
| `.b3-tick` | 11×11px registration crosshair, two 1px lines. Placed at section corners (18px inset). `.b3-tick--hot` is the Forge version. |
| `.b3-bracket` | 10px L-shaped corner brackets in `--forge-600` on the **top-left and bottom-right only** — the same diagonal logic as `.b3-bevel`. Reserve for large slab panels; at small panel scale it reads as an artifact. |
| `.b3-rule-hot` | 1px rule, `linear-gradient(90deg, --forge-600, --forge-600@14% 34%, --border 58%)`. Heat falls off left to right. Used under every eyebrow and between numbered steps. |
| `.b3-scan` | `::after` overlay of `--scanline` (`repeating-linear-gradient` 3px transparent / 1px `rgb(255 255 255 / .012)`). Material texture on ink surfaces. |
| `.b3-spine` | Rotated mono label in the left page margin: `writing-mode: vertical-rl`, `rotate(180deg)`, 10px, `.3em` tracking, `--text-mark`. Content: `B3PAY / ORG / EST 2023 / INTERNET COMPUTER`. |
| `.b3-bevel` | `clip-path` cutting 10px off top-left and bottom-right. **Hero CTA only.** Two on a screen is one too many. |
| `.b3-display` | Space Grotesk 700, `-0.045em`, `line-height: .92`, `text-wrap: balance`. All display headings. |

---

## Screens

All six routes share a sticky `NavBar` and a `Footer`. Page content sits inside `Section`,
which supplies the colgrid, corner ticks, an eyebrow row (`eyebrow` + `.b3-rule-hot` + a
`FIG. NN` spec number), a `.b3-display` title at 52px, and an 18px/28px lead capped at 620px.

### Chrome

**NavBar** — sticky, `height: 64px`, `padding: 0 24px`, `border-bottom: 1px solid --border`,
`background: color-mix(in srgb, var(--background) 78%, transparent)`, `backdrop-filter: blur(14px)`.
Left: `BrandMark` at 26px, then nav links (Products, Developers, About, Blog) as 32px-tall
pills, `--muted-foreground`, hovering to `--foreground` on a 5% white fill.
Right: a ghost `⌘K` search button, a ghost GitHub button, a filled primary **Get started**.

**Footer** — `background: --ink-100`, `border-top: 1px solid --border`, with `--heat-edge`
(a transparent→Forge→transparent hairline) at 60% opacity across the top edge.
Four columns at `1.4fr 1fr 1fr 1fr`: BrandMark + a 300px description, then Products,
Developers, Organisation link lists. A bottom bar with `© 2026 B3PAY · MIT LICENCE` left and
`BUILT ON THE INTERNET COMPUTER` right, both 10px mono at `.1em`.

**Command palette** — `⌘K` / `Ctrl+K`. Opens the `Command` primitive over a
`rgb(0 0 0 / .66)` + `blur(3px)` overlay, at `top: 22%`, `width: min(560px, 100vw - 32px)`.
Groups: Pages, Packages.

---

### 1. Home — the hero

The most involved screen. Two halves.

**Background: a live payment-gateway topology.** 15 labelled nodes, positioned in percent,
connected by 21 edges, drawn as one SVG at `viewBox="0 0 100 100"` with
`preserveAspectRatio="none"` and `vector-effect: non-scaling-stroke`. Labels are absolutely
positioned divs, not SVG text.

Nodes (`x%`, `y%`, label):
```
 0 checkout      6,18      8 fee-vault     51,9
 1 merchant      6,72      9 settlement    63,30
 2 invoice      17,42     10 receipt       74,56
 3 wallet       28,13     11 webhook       76,12
 4 kyt-check    27,67     12 audit-log     85,84
 5 rate-oracle  38,89     13 payout        88,40
 6 icp-ledger   39,34     14 refund        95,66
 7 ckbtc-ledger 50,58
```
Edges: `[0,2][1,2][2,3][2,6][3,4][3,6][4,6][4,7][5,7][6,7][6,8][7,8][7,9][8,9][9,10][9,11][10,12][10,13][11,13][12,14][13,14]`

Node rendering: a 10px dot (`--ink-100` fill, 1px `--ink-700` border) plus a 10px mono
uppercase label at `.1em`, `gap: 7px`. Nodes past `x > 68%` flip the label to the left —
**and the whole box must shift left by its own width** (`transform: translate(calc(-100% + 5px), -50%)`)
so the dot lands on the coordinate. Reversing child order alone detaches the dot from its edges.

**The blur/spotlight.** Two identical copies of the field are stacked:
- `.b3-nodefield__layer--blur` — `filter: blur(3.5px)`, `opacity: .8`
- `.b3-nodefield__layer--sharp` — `filter: brightness(1.4)`, `opacity: 0`, and
  `mask-image: radial-gradient(circle 220px at var(--mx) var(--my), #000 0%, #000 36%, transparent 74%)`

A `mousemove` listener on the hero writes `--mx` / `--my` (cursor position relative to the
hero) onto the field root and sets `data-live="true"`; `mouseleave` sets it false, which fades
the sharp layer out over `--dur-base`. Write the custom properties imperatively via a ref —
do **not** put cursor position in React state, it re-renders 60×/sec.

**The run panel (right column).** A `--ink-050` panel, 1px border, `--shadow-lg`, `.b3-scan`.
It executes one checkout **once** on mount, then stops.

- Header bar, 40px, `--card` background: `CHECKOUT — ORDER 4821 · 2 SEATS` (10px mono, `.12em`,
  uppercase, `--muted-foreground`) and a `Badge` — `warning`/`Running` → `success`/`Paid`.
- `PROCESSING` eyebrow, then four rows on a `12px minmax(0,1fr) auto auto` grid, 1px separators:
  a 6px status dot, the mono function name, the target, and the latency. Rows sit at
  `opacity: .34` until they run, then `1` over `--dur-slow --ease-dock`. The active row's dot
  gets `box-shadow: 0 0 8px 1px var(--success)`.
- `RESULT` eyebrow + `.b3-rule-hot`, then a result block that transitions from a neutral border
  to `--success` at 45% with an 8% success wash. `0.0000 → 0.0241 ckBTC`, `PENDING → SETTLED`,
  and `awaiting settlement → block 1 284 907 · fee 0.0000021 · payout to merchant`.
- A full-width `Button` at the bottom of the result block: filled primary **Pay 0.0241 ckBTC**
  at idle, `isLoading` while the calls run, then outlined **Run it again** with a `RotateCcw`
  icon, which replays the sequence from zero.

**The steps drive the background.** Each step declares which nodes it lights:

| Step | Target | Latency | Lights |
|---|---|---|---|
| `invoice_create` | merchant | 9ms | checkout, merchant, invoice |
| `icrc2_approve` | wallet | 12ms | wallet, kyt-check, icp-ledger |
| `icrc1_transfer` | ckbtc-ledger | 38ms | rate-oracle, ckbtc-ledger, fee-vault |
| `settle_receipt` | browser | 4ms | settlement, receipt, webhook, audit-log, payout |

`refund` deliberately never lights on a successful payment. Active nodes turn
`--forge-500` with a `0 0 14px 2px rgb(237 116 55 / .6)` glow; an edge only goes Forge (and
`stroke-width: 1.6`) when **both** endpoints are active, so the path physically traces across
the hero. All transitions run at `--dur-slow --ease-out`.

**Hero content (left column).** Grid `minmax(0,1.05fr) minmax(0,0.95fr)`, `gap: 56px`,
`padding: 116px 24px 56px`, `align-items: center`. Use `minmax(0, …)` — plain `fr` lets the
`<pre>` and the big heading set a min-content floor and blow out the layout.

- Eyebrow: a 5px Forge dot with `--glow-forge-sm`, then
  `Open source · Internet Computer · since 2023`.
- H1: `.b3-display` at `clamp(44px, 6.6vw, 92px)` —
  *"Infrastructure for apps that hold their own keys."*
- Lead: a 40px Forge rule in the margin, then 19px/30px `--muted-foreground`, max 520px.
- CTAs: `xl` filled primary **Start building** with a `.b3-bevel` and an `ArrowRight`, plus
  `xl` outlined **View the repos** with a GitHub icon.
- Stat strip: four cells over a 1px top border, separators between but **not after the last**:
  `03 CHAINS · 05 PROJECTS · 07 PACKAGES · MIT LICENCE`. Values in `--font-display` 22px/700,
  `tabular-nums`; labels 10px mono `.16em` `--muted-foreground`.

Above it all: a 2px `--gradient-brand` bar across the top running `b3-glow-breathe 4s`, the
`.b3-spine`, and two corner ticks (top-left hot, top-right neutral).

### 1b. Home — remaining sections

- **What we build** (`FIG. 01`) — five product cards in a 3-column grid, B3Forge spanning two.
  `CardHeader` with a 22px display title, the product line as description, and a status `Badge`
  (Beta / Live / MIT / Demo / Crate). `CardFooter` carries the language line in 11px mono
  `--muted-foreground`. Cards are `interactive` (Forge border + `--shadow-md` on hover) and
  overridden to `border-radius: 0`.
- **How it works** (`FIG. 02`) — three columns. `01/02/03` in 12px Forge mono at `.14em`, a
  `.b3-rule-hot`, a 21px display heading, then 15px/24px body.
- **Developer slab** — a `Slab` (square, `.b3-bracket`, `.b3-scan`, an 8-column internal
  hairline grid, `--heat-glow`, and a `IC-REACTOR / 1.2.0` part number top-right). Two equal
  `minmax(0,1fr)` columns, `align-items: center`: copy and CTAs left, a `CodeBlock` of the
  `defineReactor` example right.

### 2. Products

A five-tab strip spanning the full width, each tab a flex-1 button with a 1px right separator;
the selected tab gets a `--card` fill and a 2px `--forge-500` top border. Below, a
`minmax(0,1.15fr) minmax(0,0.85fr)` split: a 42px display product name with its status badge,
an 18px line, a hairline-separated feature list with Forge `Check` icons, and repo/docs
buttons. The aside holds a Stack card (Language / Modules / Licence / Repository as
label-value rows) plus a per-product extra — a Candid expression sample for B3Forge, a signer
consensus list for B3Wallet, an install `CodeBlock` for IC Reactor, an expiry-model card for
B3Note, a `Cargo.toml` for B3Utils.

### 3. Developers

`minmax(0,0.85fr) minmax(0,1.15fr)`. Left: two install `CodeBlock`s and a hairline-separated
list of the seven `@ic-reactor/*` packages, names in 12px Forge mono. Right: underline `Tabs`
(Hooks / Query factories / Codegen) over a numbered `CodeBlock`, an info `Alert` about hooks
being React-only, and two summary cards.

### 4. About

Two columns. Left: a 26px heading, a paragraph, and a hairline-separated timeline
(`2023 → 2025`, year in Forge mono, 40px wide). Right: a `Slab` containing a stacked
`BrandMark` at 64px and a pull quote in `--font-accent` at 24px/34px, attributed with an
eyebrow; below it two cards.

### 5. Blog

Four posts as `120px 1fr auto` rows separated by 1px top borders: ISO date in 11px mono, a
24px display title with a 15px excerpt capped at 620px, and a project `Badge`.

### 6. Contact

Two columns. Left: a `Card` with a real form — Name, Email, Topic (`Select`), Message
(`Textarea`), a public-issue `Checkbox`, and a full-width `lg` filled primary submit. On
submit it swaps to a success state with a `Check` icon, a 20px display confirmation, and a
"Send another" button. Right: four hairline-separated link rows, each with a Forge icon, a
15px label, an 11px mono sub-line, and a trailing `ArrowUpRight`.

---

## Interactions & behaviour

| Behaviour | Detail |
|---|---|
| Routing | Six routes. The prototype fakes it with `useState`; use a real router. Scroll to top on navigate. |
| Nav delegation | The prototype delegates `#route` clicks from a wrapper containing **both** the NavBar and the page. With a real router this becomes ordinary `<Link>`s. |
| `⌘K` | `metaKey \|\| ctrlKey` + `k`, `preventDefault`, toggles the palette. |
| Hero spotlight | `mousemove` → write `--mx`/`--my` via ref; `mouseleave` → fade out. |
| Hero run | Runs once on mount and on retry. 1100ms per step, interval cleared at the last step. |
| Hover | A colour *tint*, never an opacity change. `default` buttons take a 10% fill + 60% coloured border; `filled` drops to 90% of its own colour; `ghost` takes a 10% tint. Interactive cards take a Forge border. |
| Press | `translateY(1px)`. No scale. |
| Focus | `0 0 0 1px var(--background), 0 0 0 3px var(--ring)` on buttons; 1px ring + ring border on form controls. Always visible. |
| Disabled | `opacity: .5`, pointer events off. Never a grey repaint. |
| Loading | Border pulses to transparent and back over 2s; the control stops accepting input. Filled buttons get a border at 60% of their foreground colour so the pulse has somewhere to travel from. No spinners in buttons. |

## State

Small and local — no global store is needed.

| State | Owner | Notes |
|---|---|---|
| `route` | App | Replace with the router. |
| `palette` | App | `⌘K` visibility. |
| `step`, `run` | Hero | Run progress and the retry counter. `active` (the lit node Set) is derived from `step` via `useMemo` — do not store it. |
| `--mx`, `--my` | NodeField | Imperative, via ref. Never React state. |
| `sel` | Products | Selected product tab. |
| `tab` | Developers | Selected code sample. |
| `sent` | Contact | Form success state. Wire the real submit. |

## Responsive

The prototype is designed at **1280px** and is correct from ~1024px up. Below that the
two-column hero needs to stack — that work has not been done and is yours. Suggested:
stack at 1024px with the run panel first, drop `.b3-colgrid` to 6 columns at 768px, hide
`.b3-spine` below 1024px, and let the H1 `clamp()` handle type down to 44px.

## Accessibility

- Text roles hold AA except `--text-mark`, which is decoration-only by design and must never
  carry meaning. Do not use it for content in new work.
- The node-field labels are decorative; mark the field `aria-hidden`.
- The hero run animation is decorative — respect `prefers-reduced-motion` by jumping to the
  settled state rather than animating.
- Every icon-only button needs an `aria-label`. The prototype does this; keep it.

## Assets

| Asset | Path | Notes |
|---|---|---|
| Brand mark | `assets/b3pay-mark.svg` | `currentColor` strokes, fixed `#ED7437` node. Primary asset. |
| Brand mark, white | `assets/b3pay-mark-white.svg` | Flattened, for email/dark. |
| Brand mark, ink | `assets/b3pay-mark-ink.svg` | Flattened `#111111`, for light/print. |

All three are `viewBox="-11 -11 302 412"`, transcribed verbatim from `B3Pay.fig` node `421:73`.
The viewBox is wider than the 280×390 layer bounds because the stroke-expanded paths extend
11px past them — tightening it clips the mark on all four sides.

**The orange node at the centre of the mark never changes colour, in any variant.**
Clear space is half the mark width on every side. Below 24px, drop the wordmark and use the
glyph alone.

There is **no drawn wordmark** — the Figma contains the glyph only. `BrandMark` sets "B3Pay"
in Space Grotesk 700 at `-0.03em`, sized to `0.8 ×` the mark height with a `0.34 ×` gap.
If a real wordmark exists, replace the text node.

**Icons: Lucide.** The prototype loads `lucide@0.469.0` UMD from unpkg at runtime and reads
`window.lucide.icons`. **Replace this with `lucide-react` as a dependency** — same set, same
names, tree-shaken, no CDN. Stroke width stays 2 at every size; sizes track the control at
10/12/14/16/20px for the five button sizes. Icons are `currentColor`.

No photography or illustration exists. Every image slot in the design is filled with a live
component composition instead — that is deliberate, not a placeholder.

---

## Components

`components/` holds 31 primitives, each as `<Name>.jsx` + `<Name>.d.ts`
(the props contract) + `<Name>.prompt.md` (usage notes and examples). **Read the `.d.ts` and
`.prompt.md` before reimplementing any of them.**

- **brand/** — `BrandMark`
- **core/** — `Button`, `Badge`, `Card` (+`CardHeader`/`CardContent`/`CardFooter`), `Box`, `Kbd`, `Label`, `Icon`, `CodeBlock`
- **forms/** — `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`, `Combobox`, `FieldError`, `FileDropzone`
- **feedback/** — `Alert`, `Toast`, `Tooltip`, `ErrorDisplay`
- **overlay/** — `Dialog`, `Drawer`, `Popover`, `DropdownMenu`, `Command`
- **navigation/** — `Tabs`, `NavBar`, `SideNav`, `Shell`
- **ic/** — `PrincipalDisplay`, `TruncatedString`, `WorkflowNode`

The inventory mirrors `B3Pay/b3forge`'s `frontend/shared/ui/`, so a component here has a
counterpart the B3Forge team already recognises. `Button`'s size scale is that file verbatim:

| Size | Height | Padding-x | Font | Gap | Icon | Radius |
|---|---|---|---|---|---|---|
| xs | 20px | 8px | 10px | 4px | 10px | 4px |
| sm | 24px | 12px | 11px | 6px | 12px | 6px |
| md | 32px | 16px | 12px | 6px | 14px | 8px |
| lg | 40px | 24px | 14px | 8px | 16px | 10px |
| xl | 48px | 32px | 16px | 10px | 20px | 14px |

Form controls share the same heights, so a button and an input of the same size line up.

Interaction states live in `components/b3-components.css` because the primitives
are plain React with no CSS-in-JS. In a real build, move these to CSS modules, vanilla-extract
or Tailwind — but **keep the values**.

---

## Files in this bundle

```
readme.md                  full brand guide — read this first
HANDOFF.md                 this file
styles.css                 single entry point; @import list only
tokens/                    colour, typography, space, radius, elevation, motion, fonts, base
components/
  b3-components.css        every interaction state
  brand/ core/ forms/ feedback/ overlay/ navigation/ ic/
                           each: <Name>.jsx + <Name>.d.ts + <Name>.prompt.md
assets/                    three brand-mark SVGs
guidelines/                17 foundation specimen cards (HTML)
ui_kits/website/
  index.html               entry — loads React, Babel, the bundle, then the JSX in order
  site.jsx                 Section / Rule / Stat / Slab + the PRODUCTS data
  Home.jsx                 hero, node field, run panel, home sections
  Products.jsx             tabbed product detail
  Pages.jsx                Developers, About, Blog, Contact
  App.jsx                  routing, nav, footer, command palette
ui_kits/docs/              documentation-site prototype
templates/                 copyable marketing-page and docs-page starters
```

`_ds_bundle.js`, `_ds_manifest.json` and `_adherence.oxlintrc.json` at the root are generated
tooling output — the prototype loads the bundle to resolve components at runtime. Ignore them
when building; read the `.jsx` sources directly.

## Content rules

From `DESIGN_GUIDE.md` §2, and they apply to any copy you add:

- Technical, direct, plain-spoken. Short confident statements without hype.
- **Banned:** revolutionary, game-changing, seamless, limitless, future of finance, unlock,
  empower, effortless.
- Sentence case for headings and buttons. UPPERCASE mono for eyebrows, badges, table headers.
- Product names keep their casing: `B3Forge`, `B3Wallet`, `IC Reactor`, `B3Note`, `B3Utils`,
  `ckBTC`, `ckETH`, `dfx`. Packages stay lowercase mono.
- **No emoji.** Anywhere.
- Chains are Internet Computer, Bitcoin and Ethereum, plus ICP / ckBTC / ckETH. Do not imply
  Lightning, Solana, Tron, BNB Chain or specific Ethereum L2s unless labelled as future plans.
- No token language of any kind — B3Pay has no token and the brand must not imply one.
