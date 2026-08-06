import { PAGES } from "../content/pages";
import { SITE_NAME, SITE_URL } from "../content/registry";

export { MAIN_SITE, OG_IMAGE, SITE_NAME, SITE_URL } from "../content/registry";

export interface RouteMeta {
  /** Path as the router and the sitemap see it. */
  path: string;
  /** <title>. */
  title: string;
  /** <meta name="description">. */
  description: string;
  /** Include in sitemap.xml and get a prerendered document. */
  inSitemap: boolean;
}

export const HOME_TITLE = `${SITE_NAME} — B3Forge, B3Wallet, IC Reactor and B3Note`;
export const HOME_DESCRIPTION =
  "Developer documentation for the four B3Pay projects: the B3Forge workflow platform, the B3Wallet self-custodial canister, the IC Reactor TypeScript packages and the B3Note encryption demo.";

/**
 * Every URL the docs site serves a document for.
 *
 * `/<project>` is deliberately absent: it redirects to the project's first
 * page, and a canonical document there would compete with the page it forwards
 * to. Same reasoning as `/products` on b3pay.net.
 */
export const ALL_ROUTES: RouteMeta[] = [
  {
    path: "/",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    inSitemap: true,
  },
  // A draft page still gets a document — it is reachable from the sidebar and
  // has to render — but it is noindexed and absent from the sitemap. Submitting
  // an outline for indexing is how a docs site earns thin-content penalties.
  ...PAGES.map((p) => ({
    path: p.path,
    title: `${p.title} — ${p.project.name} docs`,
    description: p.lead,
    inSitemap: !p.draft,
  })),
];

export function routeMeta(pathname: string): RouteMeta {
  return ALL_ROUTES.find((r) => r.path === pathname) ?? ALL_ROUTES[0];
}

export const canonical = (path: string) => SITE_URL + (path === "/" ? "/" : path);
