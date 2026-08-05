# B3Pay developer docs

A documentation site modelled on the IC Reactor docs, built entirely from this design
system's `Shell`, `SideNav`, `CodeBlock` and `Command` components.

| File | What it holds |
|---|---|
| `index.html` | Entry. |
| `content.jsx` | `DOC_NAV` (the sidebar tree) and `DOCS` (three complete pages: Quick start, Install, API reference). Content is lifted from the `B3Pay/ic-reactor` README. |
| `DocsApp.jsx` | The shell: top bar with search and version switcher, sidebar, article renderer, on-this-page rail, `⌘K` palette. |

The article renderer handles five block types — `h`, `p`, `code`, `callout`, `table`, `api`.
Adding a page means adding an entry to `DOCS`, not writing markup.

**Interactions to try:** sidebar navigation (Quick start / Install / API reference are
complete; other entries fall back to Quick start), `⌘K`, the copy button on any code block,
the prev/next footer.
