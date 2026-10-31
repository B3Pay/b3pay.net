# b3pay.net

The B3Pay website and the documentation of every B3Pay project, as one site
at [b3pay.net](https://b3pay.net): the product pages, and under `/docs/` the
docs each repository publishes. Built with [Astro](https://astro.build) and
[Starlight](https://starlight.astro.build), deployed on Vercel.

```
src/content/docs/   the site's own pages: home, Clear Signing, Toolkit, B3Forge,
                    Internet Computer, About, Contact, and /docs/
src/components/     the header, footer, cards and form, Starlight overrides, and
                    the home page's hero and sections (home/)
src/styles/         design tokens (from B3Pay/b3pay-design-system) and site CSS
modules/            the docs modules: the registry, the modules written here,
                    and manifests for repositories built here (modules/README.md)
scripts/modules/    fetching, checking, building and syncing modules
scripts/check-*.mjs checks over the built site: links and redirects
api/contact.ts      the contact form's endpoint, a Vercel function
public/             brand files, icons, the module JSON schemas
```

## Running it

Node 24.

```sh
npm ci
npm run dev              # sync the modules, then the dev server
npm run build            # sync the modules, then build dist/
npm run preview          # serve dist/ the way Vercel does, on localhost:4180
npm test                 # module rules, archive safety, the checkers themselves,
                         # and the home page's calldata against its sentences
npm run typecheck        # astro check, and the API function
npm run check:links      # every link in dist/ reaches a page, a file or the API
npm run check:redirects  # every old address ends where it should
npm run brand:images     # redraw the icons and the link preview card
```

The first sync downloads the modules the registry pins from GitHub; later runs
reuse `.modules/cache`. CI (`.github/workflows/ci.yml`) runs the tests, the type
check, the build and both checks on every pull request.

## Docs modules

Each product's docs are a module, served at `/docs/<id>/` with its own sidebar.
[`modules/registry.json`](modules/registry.json) lists them and where each
comes from: this repository, a repository at a pinned commit, or the
`b3pay-site` branch a repository publishes to with
[`publish-module.yml`](.github/workflows/publish-module.yml). Every module is
checked on every build, and one problem in any of them fails the build, so the
last good deploy stays live.

How to write and publish one: [modules/README.md](modules/README.md).

## Deploying

Vercel builds the repository root with the settings in
[`vercel.json`](vercel.json): `npm ci`, `npm run build`, `dist/`. The file
wins over the dashboard for those three.

`trailingSlash: true` sends `/about` to `/about/`, as Starlight links it.
Vercel adds that slash before any redirect applies, so a redirect's source
ends with `/` to match; `npm run check:redirects` follows every old address
through Vercel's own route compiler and fails when one ends anywhere else.

### Old addresses

docs.b3pay.net, the docs site this one replaces, redirects page by page to
`/docs/`, and the old `/products/*` and `/developers` pages to their new
places. The redirects match on the host, so docs.b3pay.net has to be served by
this deployment: add it to this project's domains. Its DNS record is in
Cloudflare, where `b3pay.net`'s nameservers point (not Namecheap's panel):

| Type  | Name   | Value                     | Proxy status              |
| ----- | ------ | ------------------------- | ------------------------- |
| CNAME | `docs` | the target Vercel shows   | **DNS only** (grey cloud) |

Leave it unproxied: Cloudflare in front of Vercel blocks the certificate
challenge, and with Flexible SSL it loops.

### Rebuilding when a module publishes

A repository's publish workflow calls a deploy hook of this project, kept in
the organization secret `B3PAY_SITE_DEPLOY_HOOK` (Vercel → Settings → Git →
Deploy Hooks, branch `main`). Without it, a published module goes live with the
site's next deploy.

### Contact form

The form posts to `/api/contact/`, which sends the message through
[Resend](https://resend.com). Set three environment variables in Vercel →
Settings → Environment Variables (see [.env.example](.env.example)):

| Variable             |                                      |
| -------------------- | ------------------------------------ |
| `RESEND_API_KEY`     | https://resend.com/api-keys          |
| `CONTACT_TO_EMAIL`   | where messages land                  |
| `CONTACT_FROM_EMAIL` | a verified sender on the Resend domain |

With any of them missing the endpoint answers 503 and the form says so. It
never reports a message it did not send.
