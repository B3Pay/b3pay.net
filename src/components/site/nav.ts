/**
 * The site's navigation, in one place: the header, the mobile menus and the
 * footer all read from here.
 */
export interface NavLink {
  label: string;
  href: string;
}

/** The header, left to right. EVM work first; the docs hold every product. */
export const PRIMARY: NavLink[] = [
  { label: "Clear Signing", href: "/clear-signing/" },
  { label: "Toolkit", href: "/toolkit/" },
  { label: "B3Forge", href: "/forge/" },
  { label: "Docs", href: "/docs/" },
  { label: "About", href: "/about/" },
];

/** The mobile menus add the pages the header leaves to the footer. */
export const MOBILE: NavLink[] = [
  ...PRIMARY,
  { label: "Internet Computer", href: "/internet-computer/" },
  { label: "Contact", href: "/contact/" },
];

export const FOOTER: { label: string; links: NavLink[] }[] = [
  {
    label: "EVM",
    links: [
      { label: "Clear Signing", href: "/clear-signing/" },
      { label: "Toolkit", href: "/toolkit/" },
      { label: "B3Forge", href: "/forge/" },
    ],
  },
  {
    label: "Docs",
    links: [
      { label: "All docs", href: "/docs/" },
      { label: "Clear Signing", href: "/docs/clear-signing/" },
      { label: "B3Forge", href: "/docs/b3forge/" },
    ],
  },
  {
    label: "Internet Computer",
    links: [
      { label: "All products", href: "/internet-computer/" },
      { label: "IC Reactor", href: "/docs/ic-reactor/" },
      { label: "Meant", href: "/docs/meant/" },
      { label: "B3Note", href: "/docs/b3note/" },
      { label: "B3Wallet", href: "/docs/b3wallet/" },
    ],
  },
  {
    label: "B3Pay",
    links: [
      { label: "About", href: "/about/" },
      { label: "Contact", href: "/contact/" },
      { label: "Blog", href: "https://blog.b3pay.net/" },
      { label: "GitHub", href: "https://github.com/B3Pay" },
    ],
  },
];

/** The link for the page being shown, and the section it belongs to. */
export function isCurrent(pathname: string, href: string): boolean {
  if (href.startsWith("http")) return false;
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return href === "/" ? path === "/" : path.startsWith(href);
}
