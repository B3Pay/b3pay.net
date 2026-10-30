# Changelog

The site is not versioned; changes are listed by the date they merged.

## Unreleased

### Added

- A sidebar item can list a folder's pages, `{ "label", "directory" }`, for
  pages a repository generates, such as an API reference.
- `publish-module.yml` takes `prepare`, a command a repository runs in its
  checkout before its module is built, to generate such pages.

### Changed

- Static module pages are in the site search: the site marks each page's
  `<main>`, or its `<body>`, with `data-pagefind-body`, unless an element of
  the page has it already. Meant's pages are found with the rest of the docs.
- `publish-module.yml`'s publish job is named "Publish the module", so a
  skipped one no longer shows its name's expression unevaluated.
- The B3Wallet page no longer says that a transaction needs the approval of
  more than half of its signers: in its code, not every method goes through
  those approvals. It now says not to hold funds in it.

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
