import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { DocPage } from "../content/pages";
import { DOCS_REPO } from "../content/registry";
import { MessageSquare, Pencil } from "../lib/icons";

const SCROLLER = ".b3-shell__main";

/**
 * The right-hand rail: headings of the current page, plus the two links that
 * turn a reader into a contributor.
 *
 * The active heading is tracked with an IntersectionObserver whose root is the
 * shell's scrolling element rather than the viewport — `.b3-shell__main` is what
 * actually scrolls here, and a viewport-rooted observer never fires.
 */
export function OnThisPage({ page }: { page: DocPage }) {
  const [active, setActive] = useState<string | undefined>(page.toc[0]?.id);

  useEffect(() => {
    setActive(page.toc[0]?.id);
    if (!page.toc.length) return;

    const root = document.querySelector(SCROLLER);
    const targets = page.toc
      .map((t) => document.getElementById(t.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Topmost heading currently inside the band wins. Falling back to the
        // last one that left through the top keeps a heading highlighted while
        // its section is being read, rather than clearing between headings.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) setActive(visible[0].target.id);
      },
      {
        root,
        // Only headings in the top third of the reading area count as current.
        rootMargin: "-70px 0px -67% 0px",
        threshold: 0,
      },
    );

    for (const el of targets) observer.observe(el);
    return () => observer.disconnect();
  }, [page]);

  const source = `https://github.com/${DOCS_REPO}/blob/main/apps/docs/src/content/${page.project.key}/${page.slug}.mdx`;
  const issue = `https://github.com/${DOCS_REPO}/issues/new?title=${encodeURIComponent(
    `Docs: ${page.project.name} — ${page.title}`,
  )}`;

  return (
    <nav className="docs-toc" aria-label="On this page">
      {page.toc.length ? (
        <>
          <div className="b3-eyebrow" style={{ marginBottom: 12 }}>
            On this page
          </div>
          <ul className="docs-toc__list">
            {page.toc.map((t) => (
              <li key={t.id}>
                <Link
                  to={`${page.path}#${t.id}`}
                  className="docs-toc__link"
                  data-depth={t.depth}
                  data-active={t.id === active || undefined}
                  aria-current={t.id === active ? "location" : undefined}
                >
                  {t.text}
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <div className="docs-toc__meta">
        <a href={source} target="_blank" rel="noreferrer">
          <Pencil width={12} height={12} aria-hidden /> Edit this page
        </a>
        <a href={issue} target="_blank" rel="noreferrer">
          <MessageSquare width={12} height={12} aria-hidden /> Report an issue
        </a>
      </div>
    </nav>
  );
}
