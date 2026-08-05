import { PRODUCTS } from "./products";

export const SITE_URL = "https://b3pay.net";
export const SITE_NAME = "B3Pay";
export const OG_IMAGE = `${SITE_URL}/og.png`;

export interface RouteMeta {
  /** Path as the router and the sitemap see it. */
  path: string;
  /** NavBar / command-palette label. */
  label: string;
  /** <title>. */
  title: string;
  /** <meta name="description">. */
  description: string;
  /** Show in the primary nav and the mobile menu. */
  inNav: boolean;
  /** Include in sitemap.xml and in the prerendered per-route HTML. */
  inSitemap: boolean;
}

/**
 * The one route table. NavBar, the ⌘K palette, sitemap.xml and the per-route
 * static HTML the build emits all read from here, so a route cannot be listed in
 * one place and missing from another.
 *
 * Titles and descriptions are the page's own lead copy — no new marketing was
 * written for metadata.
 */
export const ROUTES: RouteMeta[] = [
  {
    path: "/",
    label: "Home",
    title: "B3Pay — open infrastructure for the Internet Computer",
    description:
      "B3Pay builds open-source wallets, TypeScript libraries and workflow tooling for the Internet Computer. No centralized backend sits between your users and their assets.",
    inNav: false,
    inSitemap: true,
  },
  {
    path: "/products",
    label: "Products",
    title: "Products — B3Pay",
    description:
      "Five open-source projects: B3Forge, B3Wallet, IC Reactor, B3Note and B3Utils. All MIT-licensed and developed in the open.",
    inNav: true,
    // /products redirects to the first product, so the slug URLs are canonical.
    inSitemap: false,
  },
  {
    path: "/developers",
    label: "Developers",
    title: "Developers — B3Pay",
    description:
      "IC Reactor sits above the raw Actor API. You keep type safety and control; you stop writing cache keys by hand.",
    inNav: true,
    inSitemap: true,
  },
  {
    path: "/about",
    label: "About",
    title: "About — B3Pay",
    description:
      "B3Pay started as a self-custodial wallet experiment on the Internet Computer and grew into a set of libraries other teams now depend on. Every line is public.",
    inNav: true,
    inSitemap: true,
  },
  {
    path: "/blog",
    label: "Blog",
    title: "Writing — B3Pay",
    description:
      "Notes from the build. Implementation write-ups from the B3Forge, IC Reactor, B3Wallet and B3Note repositories.",
    // The four posts have real titles, dates and summaries but no bodies exist
    // in any B3Pay source. The index is honest; the nav entry would not be.
    // Flip both flags once B3Pay writes the posts.
    inNav: false,
    inSitemap: false,
  },
  {
    path: "/contact",
    label: "Contact",
    title: "Contact — B3Pay",
    description:
      "Grant applications, integration questions and bug reports all land in the same inbox. We answer in engineering terms.",
    inNav: false,
    inSitemap: true,
  },
];

/** Per-product routes, generated so a new product cannot miss the sitemap. */
export const PRODUCT_ROUTES: RouteMeta[] = PRODUCTS.map((p) => ({
  path: `/products/${p.key}`,
  label: p.name,
  title: `${p.name} — B3Pay`,
  description: p.line,
  inNav: false,
  inSitemap: true,
}));

export const ALL_ROUTES: RouteMeta[] = [...ROUTES, ...PRODUCT_ROUTES];

export const NAV_ROUTES = ROUTES.filter((r) => r.inNav);

export function routeMeta(pathname: string): RouteMeta {
  return (
    ALL_ROUTES.find((r) => r.path === pathname) ??
    ALL_ROUTES.find((r) => r.path === "/")!
  );
}
