# Modules: how a repository publishes its docs to b3pay.net

Every product's documentation is a **module**: a set of pages, or of static
pages, that b3pay.net serves under `/docs/<id>/`, with its own sidebar, its
card on [/docs/](https://b3pay.net/docs/), and a place in the site's search.
A repository owns its module's content; this repository owns the site, the
rules a module must pass, and the list of modules it serves.

[`registry.json`](registry.json) is that list. Each entry names where a module
comes from:

| Source                                                             | Meaning                                                                                                                                                                  |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `{ "path": "modules/clear-signing" }`                              | Written in this repository.                                                                                                                                              |
| `{ "repo": "B3Pay/x", "branch": "b3pay-site" }`                    | **Published by the repository itself**: its workflow builds and checks the module, then commits it to its `b3pay-site` branch. The site reads that branch on every build. |
| `{ "repo": "B3Pay/x", "branch": "b3pay-site", "pin": "<commit>" }` | The same, held at one commit of that branch: a rollback, or a freeze while something is fixed.                                                                          |
| `{ "repo": "B3Pay/x", "commit": "<commit>", "manifest": "…" }`     | Built here from the repository at a pinned commit, with a manifest kept in [`hosted/`](hosted). The way in for a repository that has not adopted the workflow yet.      |

`npm run build` brings every module in (`scripts/modules/sync.mjs`), checks
each one, and **fails on the first problem in any of them**. A failed build
never deploys, so the last good version of the site stays live. What is live,
and from which commit, is at [/modules.json](https://b3pay.net/modules.json).

## Publishing from a repository

1. **Write `b3pay-module.json`** at the repository's root:

   ```json
   {
     "$schema": "https://b3pay.net/schemas/b3pay-module.schema.json",
     "schema": 1,
     "id": "ic-reactor",
     "title": "IC Reactor",
     "description": "Typed canister calls for TypeScript and React.",
     "group": "internet-computer",
     "status": "maintained",
     "links": { "repository": "https://github.com/B3Pay/ic-reactor" },
     "editUrl": "https://github.com/B3Pay/ic-reactor/edit/main/docs/{path}",
     "source": { "docs": "docs" },
     "sidebar": [
       { "label": "Overview", "page": "index" },
       { "label": "Guides", "items": ["guides/reads", "guides/writes"] }
     ]
   }
   ```

2. **Add the workflow**, `.github/workflows/b3pay-site.yml`:

   ```yaml
   name: Docs on b3pay.net
   on:
     push:
       branches: [main]
     pull_request:
   jobs:
     module:
       # A commit of B3Pay/b3pay.net, not a branch: the publish job holds a
       # token that can push to this repository.
       uses: B3Pay/b3pay.net/.github/workflows/publish-module.yml@<commit>
       with:
         publish: ${{ github.event_name == 'push' }}
       permissions:
         contents: write
       secrets:
         deploy-hook: ${{ secrets.B3PAY_SITE_DEPLOY_HOOK }}
   ```

   On a pull request it only checks: it builds the module with this site's
   tools, then builds the whole site with it and checks its links, so a
   module that would break b3pay.net fails in its own repository first. On a
   push to `main` it also commits the built module to the `b3pay-site` branch
   and calls the deploy hook, and Vercel rebuilds b3pay.net. Without the hook
   the module goes live with the site's next deploy.

3. **Add the registry entry** here, once the first publish has created the
   branch:

   ```json
   { "id": "ic-reactor", "source": { "repo": "B3Pay/ic-reactor", "branch": "b3pay-site" } }
   ```

The workflow never writes to b3pay.net. Its publish job pushes only to the
calling repository, with that repository's own token, and runs no code from
the site: the module it pushes is files, which the site checks again when it
builds.

`B3PAY_SITE_DEPLOY_HOOK` is an organization secret holding a deploy hook of
the b3pay.net Vercel project (Settings → Git → Deploy Hooks, branch `main`).
Anyone with it can start a build of the site and nothing more.

### Trying it locally

From a checkout of this repository:

```sh
npm run module:build -- --source ../ic-reactor --out ../ic-reactor-module
node scripts/modules/sync.mjs --module ic-reactor=../ic-reactor-module
npx astro dev
```

`--module` uses the given folder instead of the registry's source, or adds the
module if the registry does not list it yet.

## The manifest

| Field         | Required | What it is                                                                                                                       |
| ------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `schema`      | yes      | `1`.                                                                                                                             |
| `id`          | yes      | The address: `/docs/<id>/`. Lowercase letters, digits and dashes, 2 to 40 characters. Must match the registry entry.            |
| `title`       | yes      | At most 40 characters. The sidebar topic and the card title.                                                                     |
| `description` | yes      | At most 240 characters. The card text.                                                                                           |
| `group`       | yes      | `evm` or `internet-computer`: where the card and the topic are listed.                                                          |
| `status`      | yes      | `active`, `beta`, `in-development` or `maintained`. Shown as a badge.                                                           |
| `links`       | no       | `repository`, `package` and `app`, each an https URL. Shown on the card.                                                        |
| `editUrl`     | no       | An https URL with `{path}`, the page's path in `source.docs`: the "Edit page" link.                                              |
| `home`        | no       | The page or `.html` file the card opens. Defaults to the `index` page, then `index.html` of the static pages.                    |
| `sidebar`     | with pages | A list of page paths, `{ "label", "page" }`, `{ "label", "link" }` (https, or a path inside the module) or `{ "label", "items", "collapsed"? }`, three groups deep at most. |
| `source`      | to build | Where the module's files are in the repository: below.                                                                           |

`source`:

| Field            | What it is                                                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `docs`           | The folder of `.md` and `.mdx` pages, and the images beside them. A page's path is its address: `guides/reads.md` → `/docs/<id>/guides/reads/`. |
| `include`, `exclude` | Globs over the files of `docs`.                                                                                                    |
| `rename`         | `{ "from.md": "to.md" }`, when a file's name is not the address it should have.                                                        |
| `linkBase`       | The path the pages were served under before, such as `"/v4/"`: links starting with it are pointed at `/docs/<id>/`.                    |
| `static.dir`     | A folder of ready-made static pages, served as they are under `/docs/<id>/`.                                                          |
| `static.command` | `["node", "<script>", …, "{out}", …]`: a script of the repository that writes static pages to `{out}`.                                |

The JSON schemas, for editors, are
[`b3pay-module.schema.json`](../public/schemas/b3pay-module.schema.json) and
[`registry.schema.json`](../public/schemas/registry.schema.json), served at
`https://b3pay.net/schemas/`. The checks the build runs are in
[`scripts/modules/`](../scripts/modules); where the two differ, the scripts
are right.

## What a page may contain

A module's pages run through the same Starlight build as the rest of the site,
so the rules keep one module from reaching into another's pages or the site's.
The check reads a page the way the build does, with Astro's frontmatter reader
and Sätteri, the parser Astro renders Markdown and MDX with, and allows only
what the rules name:

- **Frontmatter**: `title` (required), `description`, `sidebar` (`label`,
  `order`, `hidden`, `badge`), `tableOfContents`, `template` (`doc` or
  `splash`), `hero` (`title`, `tagline`, an `image` file, and `actions` of
  `text`, `link`, `variant` and an icon name), `editUrl` (`false` or an https
  URL), `lastUpdated`, `prev`, `next`, `pagefind` and `draft`. Not `slug`,
  which would let a page claim any address, nor `head` or `banner`, which
  write raw HTML. Starlight writes a hero's title and tagline as HTML, so
  they, and the title of a page with a hero, may not contain `<`. A page
  without a title takes its first `# Heading`.
- **Imports**: components by name from `@astrojs/starlight/components`, and
  images by a relative path. Nothing else.
- **Components**: the ones the page imports, with plain values. No spread
  attributes, `on…` handlers, `style`, or `set:html` and other directives,
  and no `<` in a value: Starlight writes some values, such as a card's
  title, as HTML. Show markup in a code block instead.
- **HTML**: tags that format text, such as `<b>`, `<br>`, `<kbd>`,
  `<details>`, lists and tables, with only attributes that describe them,
  such as `title`, `align` and `colspan`. No scripts, frames, forms, styles,
  links or images: links and images are written in Markdown.
- **Addresses**: links, images, `href` and the other address props are paths,
  or `http`, `https`, `mailto` and `tel` URLs.
- **Expressions**: plain values, such as `{"text"}` or `{[1, 2]}`, and
  comments. A page runs no code.
- **Names**: lowercase letters, digits and dashes for pages; no file or folder
  starting with `_`; no links (symlinks) anywhere a module is read from.
- **Links** to other pages of the module, written as relative `.md` links,
  point at the right address on the site. Every link is checked when the site
  builds.

Static pages are served as they are, so their links are checked after the
build instead (`npm run check:links`). Their files are pages, styles, scripts,
data, images and fonts; hidden files are left out. Their scripts run on
b3pay.net as the site's own do, and none of the rules above reach them, so
only add a module with static pages from a repository you would take code
from.

A module holds at most 5,000 files and 100 MB.

## What runs where

The site's build runs no code from a module published to a branch: it
unpacks files and checks them. A module built here from a pinned commit is
different when it has `static.command`: that script, from the other
repository, runs inside this site's build, with a minimal environment but on
the same machine. That is acceptable only for B3Pay's own repositories at
commits someone has reviewed, which is why the registry pins them, and why
publishing from the repository is the way to move to.
