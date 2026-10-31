# Changelog

The site is not versioned; changes are listed by the date they merged.

## Unreleased

### Changed

- B3Note's docs come from the `b3pay-site` branch that B3Pay/B3Note
  publishes, instead of a pinned commit built with a manifest kept here
  (`modules/hosted/b3note.json`, removed). Its pages are unchanged. Every
  repository's docs on the site now come from the repository itself or from
  this one.
- A new home page, with the old one's motion back, told as the EVM story.
  The hero is a wallet's signature request that turns real calldata,
  approving Uniswap's Permit2 to spend unlimited USDC, into what an ERC-7730
  descriptor makes of it, in under five seconds, over a wall of calldata
  that turns into sentences under the pointer. Below it, the descriptor
  stays pinned while the field each part formats lights up; one descriptor
  is read by a wallet and by an agent; the Clear Signing service leads what
  we do; the Internet Computer products follow; and a closing band decodes
  as it scrolls in. The scroll effects are CSS scroll-driven animations
  where browsers have them. Without JavaScript, and with reduced motion, the
  page shows its finished state.
- The descriptor the home page shows is an illustration, printed from the
  same object the hero reads. It passes python-erc7730 1.0.12's lint against
  the `approve` ABI Sourcify lists for USDC's implementation; it has not been
  tested against a transaction, submitted or attested, and the page says so.
  `scripts/home-calldata.test.mjs` checks each selector against Keccak-256
  of its signature, the hero's calldata byte for byte, every address's
  checksum, and every sentence against the arguments it describes.

## 2026-10-31

### Added

- B3Forge user guides: getting started, building with Forge, the studio,
  running a workflow and approving its update calls, saving, sharing and
  forking, the canister explorer, a reference for expressions and utility
  nodes, and the limits of the beta. They describe only what the beta at
  forge.b3pay.net does, checked against B3Forge's code at commit `d0b26c8`.
- A sidebar item can list a folder's pages, `{ "label", "directory" }`, for
  pages a repository generates, such as an API reference.
- `publish-module.yml` takes `prepare`, a command a repository runs in its
  checkout before its module is built, to generate such pages.

### Changed

- IC Reactor's and Meant's docs come from the `b3pay-site` branches that
  B3Pay/ic-reactor and B3Pay/Meant publish, instead of pinned commits built
  with manifests kept here (`modules/hosted/ic-reactor.json` and
  `modules/hosted/meant.json`, removed). IC Reactor's now include the API
  reference TypeDoc writes, with its functions, interfaces and type aliases
  in the sidebar, and `/docs/ic-reactor/llms.txt`. Meant's are its current
  site, for `@meantjs` 0.5.0, and the site's build no longer runs Meant's
  `website/build.mjs`.
- Static module pages are in the site search: the site marks each page's
  `<main>`, or its `<body>`, with `data-pagefind-body`, unless an element of
  the page has it already. Meant's pages are found with the rest of the docs.
- `publish-module.yml`'s publish job is named "Publish the module", so a
  skipped one no longer shows its name's expression unevaluated.

### Removed

- B3Wallet is off the site: its docs page, its card on the home page,
  `/docs/` and `/internet-computer/`, and its link in the menu. Its old addresses, on
  docs.b3pay.net and here, lead to `/docs/`; the last step is a temporary
  redirect, so `/docs/b3wallet/` can serve a page again. The B3Wallet
  repository is unchanged.

## 2026-10-30

### Added

- One site for B3Pay's product pages and every project's documentation, on
  Astro and Starlight: home, Clear Signing, Toolkit, B3Forge, Internet
  Computer, About and Contact, and the docs under `/docs/`, with one header,
  one search and one theme switch.
- Docs modules. A module is a project's docs, served at `/docs/<id>/` with its
  own sidebar, listed in `modules/registry.json`. A module comes from this
  repository, from another repository at a pinned commit, or from the
  `b3pay-site` branch a repository publishes to with the reusable
  `publish-module.yml` workflow. Every module is checked on every build:
  manifest, page content rules (allowlists, applied to each page as the build
  reads it), file types, size, and that it only claims its own addresses.
  Guide: `modules/README.md`. JSON schemas at `https://b3pay.net/schemas/`.
- Docs for Clear Signing (what a descriptor is, how one is checked, the
  registry and attestations), B3Forge, B3Wallet, IC Reactor, Meant and B3Note.
- `npm test`, `npm run check:links` and `npm run check:redirects`, and CI that
  runs them with the type check and the build.
- Redirects from every docs.b3pay.net page and the old `/products/*` and
  `/developers` pages.
- The contact form asks for the protocol and the contracts, so a Clear Signing
  request arrives with what we need to scope it.

### Changed

- The brand follows B3Pay/b3pay-design-system version 3. Icons and the link
  preview card are drawn from its SVGs, without fonts or network.

### Removed

- The separate Vite apps for b3pay.net and docs.b3pay.net (`apps/`), the old
  design system copy (`design/`, `packages/ui/`), and their smoke tests.
