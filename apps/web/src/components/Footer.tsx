import { BrandMark } from "@b3pay/ui";
import { Link } from "react-router-dom";

import { GITHUB_ORG, PRODUCTS } from "../site/products";

interface FooterLink {
  label: string;
  to: string;
}

const COLUMNS: { heading: string; items: FooterLink[] }[] = [
  {
    heading: "Products",
    items: PRODUCTS.map((p) => ({ label: p.name, to: `/products/${p.key}` })),
  },
  {
    heading: "Developers",
    items: [
      { label: "Documentation", to: "/developers" },
      { label: "npm packages", to: "https://www.npmjs.com/package/@ic-reactor/react" },
      { label: "docs.rs", to: "https://docs.rs/b3_utils" },
      { label: "Agent skills", to: `${GITHUB_ORG}/ic-reactor` },
    ],
  },
  {
    heading: "Organisation",
    items: [
      { label: "About", to: "/about" },
      { label: "Blog", to: "/blog" },
      { label: "GitHub", to: GITHUB_ORG },
      { label: "Contact", to: "/contact" },
    ],
  },
];

// The prototype set this line in --ink-600 (--text-mark). A copyright and a
// licence are content, not registration marks, and --text-mark is 3.6:1 by
// design — below AA. Content gets --muted-foreground.
const markStyle = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.1em",
  color: "var(--muted-foreground)",
} as const;

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--ink-100)",
        position: "relative",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 1,
          background: "var(--heat-edge)",
          opacity: 0.6,
        }}
      />
      <div className="site-footer-grid">
        <div>
          <BrandMark size={26} />
          <p
            style={{
              margin: "18px 0 0",
              fontSize: 14,
              lineHeight: "22px",
              color: "var(--muted-foreground)",
              maxWidth: 300,
            }}
          >
            Open-source infrastructure for decentralized applications, wallets and payments
            on the Internet Computer.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.heading}>
            <h2 className="b3-eyebrow" style={{ margin: 0 }}>
              {col.heading}
            </h2>
            <div
              className="site-link-list"
              style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}
            >
              {col.items.map((item) =>
                item.to.startsWith("http") ? (
                  <a
                    key={item.label}
                    href={item.to}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: 14, color: "var(--muted-foreground)" }}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    to={item.to}
                    style={{ fontSize: 14, color: "var(--muted-foreground)" }}
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="site-footer-bar">
        <span style={markStyle}>© 2026 B3PAY · MIT LICENCE</span>
        <span style={markStyle}>BUILT ON THE INTERNET COMPUTER</span>
      </div>
    </footer>
  );
}
