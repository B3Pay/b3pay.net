import { Alert, CodeBlock as UiCodeBlock, type B3Color } from "@b3pay/ui";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Link } from "react-router-dom";

import { TriangleAlert } from "../lib/icons";

/**
 * What `.mdx` pages render into.
 *
 * Every entry is either a design-system primitive or a class hook that
 * `docs.css` styles from tokens — no page introduces a colour, size or radius of
 * its own. The five block types the design prototype defined (`h`, `p`, `code`,
 * `callout`, `table`) map onto markdown syntax, with `api` kept as a component
 * because there is no markdown for it.
 *
 * Supplied through MDXProvider, so a page writes `<Callout>` without an import.
 */

/** Fenced code. The remark plugin rewrites ``` blocks into this. */
function CodeBlock({ code, lang, filename }: { code: string; lang?: string; filename?: string }) {
  return (
    <div className="docs-prose__code">
      <UiCodeBlock code={code} lang={lang} filename={filename} />
    </div>
  );
}

/** `<Callout color="warning" title="…">…</Callout>` */
function Callout({
  color = "info",
  title,
  children,
}: {
  color?: B3Color;
  title?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="docs-prose__callout">
      <Alert color={color} title={title} icon={TriangleAlert}>
        {children}
      </Alert>
    </div>
  );
}

/**
 * Marks a page that is an outline rather than finished documentation.
 *
 * Pages carrying `draft: true` in their frontmatter are also kept out of
 * sitemap.xml and served `noindex`, so the banner and the crawler agree. It
 * reads as a placeholder on purpose — the alternative is prose that sounds
 * finished and documents nothing, the failure mode the /blog index on b3pay.net
 * was left unlisted to avoid.
 */
function Draft({ children, repo }: { children?: ReactNode; repo?: string }) {
  return (
    <div className="docs-prose__callout">
      <Alert color="warning" title="Outline — not yet written" icon={TriangleAlert}>
        {children ?? "The headings below are the intended structure of this page."}
        {repo ? (
          <>
            {" "}
            Until it is written, the source of truth is{" "}
            <a
              className="docs-link"
              href={`https://github.com/${repo}`}
              target="_blank"
              rel="noreferrer"
            >
              {repo}
            </a>
            .
          </>
        ) : null}
      </Alert>
    </div>
  );
}

/**
 * Signature / package / description rows.
 *
 * The design's `api` block. A markdown table would carry the same three columns
 * and lose the layout — the signature wants the full line at mono 13 with the
 * owning package pushed right, not a third of a table cell.
 */
function ApiList({ rows }: { rows: [signature: string, pkg: string, description: string][] }) {
  return (
    <div className="docs-api">
      {rows.map(([signature, pkg, description]) => (
        <div className="docs-api__row" key={signature}>
          <div className="docs-api__head">
            <code className="docs-api__sig">{signature}</code>
            <span className="docs-api__pkg">{pkg}</span>
          </div>
          <p className="docs-api__desc">{description}</p>
        </div>
      ))}
    </div>
  );
}

/** Markdown tables get the card treatment the design gives them. */
function Table(props: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="b3-card docs-table">
      <table {...props} />
    </div>
  );
}

/**
 * Links. Anything site-relative routes on the client; anything else opens in a
 * new tab and says so to a screen reader.
 */
function Anchor({ href = "", children, ...rest }: ComponentPropsWithoutRef<"a">) {
  if (href.startsWith("/")) {
    return (
      <Link to={href} className="docs-link">
        {children}
      </Link>
    );
  }
  const external = /^https?:/.test(href);
  return (
    <a
      href={href}
      className="docs-link"
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      {...rest}
    >
      {children}
      {external ? <span className="docs-sr-only"> (opens in a new tab)</span> : null}
    </a>
  );
}

export const mdxComponents = {
  a: Anchor,
  table: Table,
  ApiList,
  Callout,
  CodeBlock,
  Draft,
};
