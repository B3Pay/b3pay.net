import { Link, useLocation } from "react-router-dom";

import type { DocPage } from "../content/pages";

/**
 * The sidebar tree.
 *
 * This is the design system's `SideNav` markup — the same `b3-menu__item` rows
 * under the same mono eyebrow section labels — rebuilt on `<Link>` instead of
 * `<button>`. `SideNav` drives navigation through an `onSelect` callback with no
 * render escape hatch, which is right for an app rail and wrong for
 * documentation: a button has no href, so ⌘-click and middle-click do nothing
 * and a crawler finds no path from one page to the next.
 *
 * Composition, not a new primitive, so it lives here rather than in @b3pay/ui —
 * the same call apps/web made for its site furniture.
 */
export function DocsSideNav({
  pages,
  onNavigate,
}: {
  pages: DocPage[];
  /** Closes the mobile drawer once a row is chosen. */
  onNavigate?: () => void;
}) {
  const { pathname } = useLocation();

  // Sidebar order is registry order, so consecutive pages sharing a section
  // label belong to the same group. No sort, no lookup.
  const sections: { label: string; items: DocPage[] }[] = [];
  for (const page of pages) {
    const last = sections[sections.length - 1];
    if (last && last.label === page.section) last.items.push(page);
    else sections.push({ label: page.section, items: [page] });
  }

  return (
    <nav aria-label="Documentation" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {sections.map((section) => (
        <div key={section.label}>
          <div className="b3-eyebrow" style={{ padding: "0 8px 6px" }}>
            {section.label}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {section.items.map((page) => {
              const active = pathname === page.path;
              return (
                <Link
                  key={page.path}
                  to={page.path}
                  onClick={onNavigate}
                  className="b3-menu__item docs-nav__link"
                  data-active={active || undefined}
                  aria-current={active ? "page" : undefined}
                >
                  <span style={{ flex: 1 }}>{page.label}</span>
                  {/* The draft marker outranks the registry's own badge — a
                      reader needs to know a page is an outline before they
                      need to know it is the recommended entry point. */}
                  {page.draft || page.badge ? (
                    <span className="docs-nav__badge">
                      {page.draft ? "draft" : page.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
