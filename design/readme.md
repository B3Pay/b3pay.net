# B3Pay Design System

Brand, foundations, components and UI kits for **B3Pay** — an organisation building
open-source infrastructure and products for decentralized applications, wallets and
payments on the **Internet Computer**.

---

## 1. The organisation

B3Pay has been building in the open since 2023. The work spans five public repositories,
all MIT-licensed, all under [github.com/B3Pay](https://github.com/B3Pay):

| Project | What it is | Stack | Status |
|---|---|---|---|
| **B3Forge** | Candid-native visual workflow platform. Compose ICP canister calls into typed workflows and run them in the browser with a delegated identity. | Rust + WASM, TypeScript, React Flow | Beta |
| **B3Wallet** | Self-custodial multi-chain, multi-owner wallet canister. Bitcoin, Ethereum and Internet Computer; single-owner, multi-owner and multi-signature. | Rust, React | Live |
| **IC Reactor** | Type-safe Internet Computer integration for TypeScript and React. Seven npm packages, TanStack Query caching, hook factories, codegen. | TypeScript | MIT, published |
| **B3Note** | Anonymous note sharing with witness-like / identity-based encryption on VetKeys. Notes and links expire in one hour. | Rust, BLS pairing | Demo |
| **B3Utils** | Foundation Rust crate: stable memory, timers, logging, transfers, tokens, timestamps. | Rust | Published on docs.rs |

**Audience.** ICP and Web3 developers, startup teams, and organisations building
decentralized applications, wallets, payment products and automated canister workflows.
Secondary: enterprises and treasury teams, and consumers using the wallet.

**Chains and assets.** Internet Computer, Bitcoin and Ethereum, including ICP-native and
chain-key assets — ICP, ckBTC, ckETH. Do not imply Lightning, Solana, Tron, BNB Chain or
specific Ethereum L2 support anywhere in the brand. If those appear, they are future plans
and must be labelled as such.

**Mission.** Make decentralized payments simple enough for everyday users and businesses,
without centralized backends and without users giving up custody.

### Sources this system was built from

- **Figma:** `B3Pay.fig`, mounted as a virtual filesystem. One page, five frames
  (`logo-light`, `logo-dark`, `logo-dark2`, `icon-black`, `icon-white`), three colour
  variables. **No components, no text styles, no fonts, no images.** The logo geometry in
  `assets/b3pay-mark.svg` is transcribed verbatim from node `421:73`.
- **GitHub:** `B3Pay/b3forge` — `frontend/styles.css` (the live token system),
  `.design-sync/conventions.md` (the component contract), `frontend/shared/ui/*`
  (the shipped component inventory: alert, badge, box, button, card, checkbox, combobox,
  command, dialog, drawer, dropdown-menu, error-display, field-error, file-dropzone, input,
  kbd, label, navigation-menu, popover, principal-display, select, shell, sonner, switch,
  tabs, textarea, tooltip). Also `B3Pay/ic-reactor`, `B3Pay/B3Wallet`, `B3Pay/B3Note`,
  `B3Pay/b3_utils` READMEs for product copy.

Component sizes, radii, shadows, durations, easings and semantic hues in this system are
copied from `b3forge/frontend/styles.css` and `button.tsx` / `input.tsx`. They are not
rounded to a 4/8px grid, because the source does not round them.

### Where this system diverges from the shipped app

The B3Forge web app currently themes `--primary` as purple (`hsl(262 83% 58%)`).
**The B3Pay brand primary is Forge orange `#ED7437`** — that is what the logo and the Figma
variables define, and it is the direction chosen for the organisation. Everything else
(neutral axis, radii, control geometry, semantic hues, motion) matches the app exactly, so
aligning the app to the brand is a one-variable change, not a rebuild.

---

## 2. Content fundamentals

**Voice.** Technical, direct, plain-spoken. Short confident statements without hype.
Explain difficult blockchain concepts in accessible language. Sound like experienced
engineers building real infrastructure, not crypto marketers.

**Banned words.** revolutionary · game-changing · seamless · limitless · future of finance ·
unlock · empower · effortless. Unless directly supported by evidence on the page, they do
not appear.

**Person.** "We" for the organisation, sparingly. "You" for the reader when giving
instructions. Never "I". Never a first-person founder voice in product surfaces.

**Casing.**
- Headings and buttons: **sentence case**. `Start building`, not `Start Building`.
- Eyebrows, badges, table headers, metadata labels: **UPPERCASE**, mono, `.14em` tracking.
- Product names keep their exact casing: `B3Forge`, `B3Wallet`, `IC Reactor`, `B3Note`,
  `B3Utils`, `ckBTC`, `ckETH`, `dfx`.
- Package and crate names stay lowercase and mono: `@ic-reactor/react`, `b3_utils`.

**Emoji: never.** Not in headings, not in body, not as icons, not in badges. The source
repos use them in a couple of README tables; the brand surfaces do not.

**Sentence shape.** Lead with the constraint or the fact, then the consequence.

> No backend. No custody handover.
> Every product here runs its logic on the client or inside a canister the user owns.
> That constraint shapes the whole stack.

**Numbers and identifiers.** Always mono, always exact. Principals are truncated with
`PrincipalDisplay`, never retyped or shortened by hand. Cycles get a unit (`2.41 T cycles`).
Version numbers carry the `v` (`v1.2.0`).

**Specific examples from the source material, kept verbatim in tone:**

- "Workflows are Candid-native end-to-end."
- "It does **not** execute workflows. Execution is browser-only for beta."
- "Users maintain exclusive control over their canisters, and therefore, their funds."
- "Do not call React hooks outside React components or custom hooks."

Note the last one: prohibitions are stated flatly, without softening. Keep that.

**What we do not write.** Roadmap promises without a date. Comparative claims against named
competitors. TVL, price or token language of any kind — B3Pay has no token and the brand
must not imply one.

---

## 3. Visual foundations

### Colour

Dark-first. The page is near-black; orange is the only saturated colour on a default screen.

- **Ink** — a cool 240° neutral axis. `--ink-100 #111111` is the brand near-black taken from
  the logo artboards; `--ink-150` is the page background, `--ink-200` cards, `--ink-400`
  borders, `--ink-700` muted text, `--ink-900` foreground. Same values as the shipped app.
- **Forge** — `--forge-600 #ED7437` is the primary (Figma variable `Forge`).
  `--forge-500 #FF8D28` is the accent, the focus ring and the hover glow (Figma variable
  `Accents/Orange`). `--forge-700 #C55300` is the light-theme primary (Figma `Light` mode).
- **Status** — error, success, warning, info, alert, at the app's exact HSL values.
- **Node accents** — five fixed hues for the B3Forge workflow graph (trigger amber,
  variables violet, query blue, update orange, utility green). These are the only place a
  non-brand hue is allowed, and they never change.

**Rule: one Forge surface per view.** Orange marks the single most important action or the
live state. A screen with three orange buttons has no primary action.

**Text has three content levels and one decoration level.** `--foreground` for headings and
body, `--muted-foreground` for secondary and metadata, `--forge-500` for links. Anything a
reader needs uses one of those three. `--text-mark` is the fourth and it is decoration only —
registration marks, figure numbers, part numbers, the rotated spine. It sits below AA on
purpose, so nothing that carries meaning may use it.

Light theme exists (`:root[data-theme="light"]`) and is a real, complete set — but the brand
is dark. Use light only where the platform demands it.

### Type

Four faces, each with one job.

| Face | Token | Job |
|---|---|---|
| Space Grotesk | `--font-display` | Headings, hero, card titles, metrics. Tight tracking (`-0.022em` to `-0.035em`), weight 600. |
| Inter | `--font-sans` | Body, UI labels, buttons, navigation. |
| JetBrains Mono | `--font-mono` | Principals, canister IDs, Candid, code, eyebrows, badges, table headers, all metadata. |
| Instrument Serif | `--font-accent` | Pull quotes only. Never a UI label. |

The UI steps below 14px (`10 / 11 / 12`) are the app's control sizes verbatim. Display steps
run to 116px for the hero.

Mono does more work here than in most systems. If a value is defined by a machine — a
principal, a version, a status, a count, a section label — it is mono, uppercase where it is
a label, and tracked out to `.14em`.

### Layout

- Page max width **1240px**, gutter **24px**, prose **68ch**.
- Section rhythm **120px** desktop / **72px** tight.
- Structure is expressed with **1px hairlines**, not boxes. Lists, tables, feature rows and
  timelines are separated by `border-top: 1px solid var(--border)` — no card per row.
- A **64px hairline grid** (`.b3-grid-bg`) sits behind hero and slab surfaces at low opacity.
  It is the only background pattern in the system.

### Backgrounds and atmosphere

- No photography in the system yet — none shipped in the sources. See *Gaps*.
- No illustration. Product screenshots and live component compositions do the work: the
  marketing hero is a real `WorkflowNode` graph, not a drawing.
- **`--heat-glow`** — a radial ellipse of `rgb(237 116 55 / 0.18)` from just above the top
  edge. Used once per page section at most, behind the hero and slab panels. This is the
  forge metaphor: heat comes from off-screen.
- **`--heat-edge`** — a horizontal orange gradient hairline, transparent at both ends.
  Sits on the top border of the footer and the bottom border of the app bar.
- **`--gradient-brand`** — `forge-700 → forge-500 → forge-300`, left to right. One gradient
  in the whole system. There is no purple gradient, no blue gradient, no mesh.

### Machined edges

The signature geometric detail. `.b3-bevel` cuts `10px` off the top-left and bottom-right
corners with `clip-path`, so a rectangle reads as milled stock rather than a rounded card.

Use it on: the primary hero CTA, large slab panels, and nothing else. It is a punctuation
mark; two on a screen is one too many.

### Corner radii

Derived from the app's `--radius: 0.625rem`. `xs 4 · sm 6 · md 8 · lg 10 · xl 14 · 2xl 20`.
Radius scales with control size — an `xs` button gets `radius-xs`, an `xl` button
`radius-xl` — so a button and an input of the same size share corner geometry when stacked.

### Cards

`background: var(--card)` · `1px solid var(--border)` · `radius-lg` · **no shadow at rest**.
Depth is a border, not a drop shadow. On hover, an interactive card takes a Forge-tinted
border (`forge-600` at 55%) and `--shadow-md`. Header is a props contract
(`title` / `description` / `icon` / `action`), not hand-built markup.

### Shadows

Quiet and few, all copied from the app:
`--shadow-xs` input rest · `--shadow-sm` outlined button · `--shadow-md` card hover ·
`--shadow-lg` dialogs and menus. Plus two brand glows: `--glow-forge-sm` on primary button
hover and `--shadow-icon-glow` on the card icon tile.

### Transparency and blur

Only on fixed chrome. The nav bar and app bar are
`color-mix(in srgb, var(--background) 78%, transparent)` with `backdrop-filter: blur(14px)`.
Modal overlays are `rgb(0 0 0 / 0.66)` with `blur(3px)`. Nothing else is translucent — there
is no glassmorphism in this system.

### Motion

Signature, not constant. Durations and easings come from the app:

- `--dur-fast 150ms` is the default for every interactive control.
- `--dur-base 200ms` panels and accordions; `--dur-slow 250ms` drawers and dialogs.
- `--ease-dock cubic-bezier(.22, 1, .36, 1)` is the signature curve — everything that
  enters the viewport uses it.
- `--dur-hero 900ms` for landing reveals only.

Named animations: `b3-border-pulse` (2s, loading buttons), `b3-glow-breathe` (1.5s, the hero
heat line), `b3-dock-enter` (menus, dialogs), `b3-slide-in-right` (drawers, toasts),
`b3-edge-flow` (workflow edges). `prefers-reduced-motion` is honoured globally in
`tokens/motion.css`.

**No bounce. No scroll-jacking. No parallax.**

### Interaction states

- **Hover** — a colour *tint*, never an opacity change on the element.
  `default` buttons take `color-mix(--c 10%)` fill and a 60% coloured border; `filled` drops
  to 90% of its own colour; `ghost` takes a 10% tint. Interactive cards take a Forge border.
- **Press** — `translateY(1px)`. No scale.
- **Focus** — `0 0 0 1px var(--background), 0 0 0 3px var(--ring)` on buttons; a 1px ring
  plus a ring-coloured border on form controls. Always visible, never removed.
- **Active / selected** — 15% tint of the control's own colour with a 50% border.
- **Disabled** — `opacity: 0.5`, pointer events off. Never a grey repaint.
- **Loading** — the border pulses to transparent and back over 2s (`b3-border-pulse`), and
  the control stops accepting input. Filled buttons are given a border for the pulse to
  travel from, since their resting border is transparent. No spinners in buttons.

### Links

`--forge-500` at rest, `--forge-300` on hover, no underline in UI. In prose, links underline
on hover with a 4px offset.

---

## 4. Iconography

**Lucide**, at 2px stroke — the set the B3Forge app already uses (`lucide-react`).
It is loaded from CDN by the `Icon` component (`unpkg.com/lucide@0.469.0`), so no icon
binaries ship in this project.

```jsx
<Icon name="GitBranch" size={16} />
<Button icon={icon("Play")}>Run workflow</Button>
```

- Icon names are Lucide's, PascalCase.
- Stroke stays 2 at every size. Sizes track the control: 10 / 12 / 14 / 16 / 20px for the
  five button sizes.
- Icons are `currentColor` — they inherit the button or text colour, never a fixed hex.
- **No emoji.** **No unicode glyphs as icons** (the one exception is the `▼` in the native
  select and `×` in dismiss buttons, both of which match the app).
- **No hand-drawn SVG.** If Lucide has no glyph for a concept, use a text label.
- The only bespoke vector in the system is the brand mark itself.

**Brand assets** in `assets/`:

| File | Use |
|---|---|
| `b3pay-mark.svg` | Mark with `currentColor` strokes and the fixed `#ED7437` node. Primary asset. |
| `b3pay-mark-white.svg` | Flattened white, for dark surfaces and email. |
| `b3pay-mark-ink.svg` | Flattened `#111111`, for light surfaces and print. |

All three are 280 × 390, transcribed verbatim from the Figma. The orange node never changes
colour, in any variant. Clear space is half the mark width on every side. Below 24px, drop
the wordmark and use the glyph alone.

---

## 5. Components

Grouped by concern under `components/`. Each has `<Name>.jsx`, `<Name>.d.ts` and
`<Name>.prompt.md`; each directory has one `@dsCard` HTML. Interaction states live in
`components/b3-components.css`, imported from `styles.css`.

**Brand** — `BrandMark`

**Core** — `Button`, `Badge`, `Card` (`CardHeader`, `CardContent`, `CardFooter`), `Box`,
`Kbd`, `Label`, `Icon`, `CodeBlock`

**Forms** — `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`, `Combobox`, `FieldError`,
`FileDropzone`

**Feedback** — `Alert`, `Toast`, `Tooltip`, `ErrorDisplay`

**Overlay** — `Dialog`, `Drawer`, `Popover`, `DropdownMenu`, `Command`

**Navigation** — `Tabs`, `NavBar`, `SideNav`, `Shell`

**Internet Computer** — `PrincipalDisplay`, `TruncatedString`, `WorkflowNode`

### Intentional additions

The source repo defines the inventory; these five are not in it and are here for a reason:

- **`BrandMark`** — the Figma ships a logo but no component for it.
- **`Icon`** — a thin wrapper so `lucide-react` (a bundler-only dependency) is usable in
  plain-browser HTML. Same icon set, same names.
- **`CodeBlock`** — the docs site needs one and the app has no equivalent.
- **`NavBar`** / **`SideNav`** — the app has `frontend/shared/layout/header/` and
  `footer/`, but no public marketing or docs navigation. These generalise them.
- **`WorkflowNode`** — the app's node rendering lives in the flow-studio feature, not in
  `shared/ui`. It is lifted here because the graph is the most recognisable thing B3Pay ships.

### Not built (present in the source, deliberately skipped)

`ai-prompt`, `navigation-menu` (Radix mega-menu), `command` primitives (folded into
`Command`), `error-display`'s sub-variants, `PageLayout` and `NotFound` — all
app-specific shells with no brand-level meaning.

---

## 6. UI kits

- **`ui_kits/website/`** — the marketing site B3Pay does not have yet. Six routes: home,
  products, developers, about, blog, contact. `⌘K` opens the command palette.
- **`ui_kits/docs/`** — the developer documentation site, modelled on the IC Reactor docs.
  Sidebar, article, API reference, on-this-page rail, version switcher, `⌘K` search.

### Templates

Starting folders a consuming project can copy. Each is editable in place — headline, copy
and code samples are tweakable props.

- **`templates/marketing-page/`** — heat-glow hero, hairline feature rows, slab CTA, footer.
- **`templates/docs-page/`** — docs shell: sidebar, article, code sample, callout, TOC rail.

---

## 7. Index

```
styles.css                 the single entry point consumers link
tokens/
  fonts.css                Google Fonts import + family tokens
  color.css                ink ramp, forge ramp, status, node accents, semantic aliases
  typography.css           size / weight / tracking scale
  space.css                4px scale, layout constants
  radius.css               radius scale derived from --radius: 10px
  elevation.css            shadows and forge glows
  motion.css               durations, easings, keyframes, reduced-motion
  base.css                 body defaults, link colours, scrollbars, selection
  fig-tokens.css           raw Figma variables, all five modes
  fig-typography.css       (empty — the Figma defines no text styles)
components/
  b3-components.css        all component interaction states
  brand/ core/ forms/ feedback/ overlay/ navigation/ ic/
guidelines/                17 foundation specimen cards
assets/                    brand mark, three variants
ui_kits/website/           marketing site
ui_kits/docs/              documentation site
templates/marketing-page/  copyable landing-page starter
templates/docs-page/       copyable docs-page starter
thumbnail.html             project tile
SKILL.md                   Agent Skills manifest
```

---

## 8. Gaps and substitutions

**Fonts are substitutions.** No font binaries shipped in the Figma or any B3Pay repository.
Space Grotesk, Inter, JetBrains Mono and Instrument Serif are loaded from Google Fonts —
these are the four families named in `b3forge/frontend/styles.css`, so the *choice* is the
source's, but the *files* are Google's. If B3Pay has licensed cuts, drop them in and replace
the `@import` in `tokens/fonts.css` with `@font-face` rules.

**No photography or illustration.** Nothing shipped in the sources. Every image slot in the
UI kits is filled with a live component composition instead of a placeholder. If B3Pay has
brand photography, it should be cool-toned, high-contrast and mechanical to match — but that
is a recommendation, not an observed rule.

**No wordmark artwork.** The Figma contains the glyph only. `BrandMark` sets "B3Pay" in
Space Grotesk 700 at `-0.03em`. If a drawn wordmark exists, replace the text node.

**Icons are a CDN substitution** in the sense that the SVG files are not vendored here —
but the set is the app's own (Lucide), not an approximation.
