import { Alert, Badge, Button, IconOf } from "@b3pay/ui";

import { GITHUB_ORG } from "../site/products";
import { Section } from "../site/furniture";
import { routeMeta } from "../site/routes";
import { useSeo } from "../lib/seo";

/**
 * Titles, dates and summaries are from the design system's `Pages.jsx`. No post
 * bodies exist in any B3Pay source, so the rows are an index and nothing more —
 * they deliberately do not link anywhere. `/blog` is also kept out of the
 * NavBar and the sitemap until the posts are written; both flags live on the
 * route entry in `site/routes.ts`.
 */
const POSTS = [
  {
    t: "Candid expressions: referencing prior node outputs",
    d: "2025-11-04",
    tag: "B3Forge",
    e: "How $N0.Ok.amount resolves, why opt-depth matters, and what the Rust compatibility engine rejects at edit time.",
  },
  {
    t: "defineReactor: one call instead of three",
    d: "2025-09-18",
    tag: "IC Reactor",
    e: "The manual construction order still works. Here is when you still need it.",
  },
  {
    t: "Why B3Wallet upgrades itself",
    d: "2025-06-02",
    tag: "B3Wallet",
    e: "Self-upgrade keeps a user-owned canister current without asking us for permission.",
  },
  {
    t: "Timelock notes with VetKeys",
    d: "2024-12-11",
    tag: "B3Note",
    e: "Identity-based encryption without email addresses or pre-shared keys.",
  },
];

export default function Blog() {
  useSeo(routeMeta("/blog"));

  return (
    <>
      <Section
        as="h1"
        eyebrow="Writing"
        title="Notes from the build."
        lead="Implementation write-ups, not announcements."
      />
      <div className="site-shell">
        <Alert
          color="info"
          title="These posts are not published yet"
          icon={IconOf("Info")}
          action={
            <Button
              size="sm"
              variant="outlined"
              as="a"
              href={GITHUB_ORG}
              target="_blank"
              rel="noreferrer"
              icon={IconOf("Github")}
            >
              Repositories
            </Button>
          }
          style={{ marginBottom: 40 }}
        >
          The index below lists what has been written. The code each one describes is already
          public.
        </Alert>

        {POSTS.map((p) => (
          <article key={p.t} className="site-blog-row">
            <time
              dateTime={p.d}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--muted-foreground)",
              }}
            >
              {p.d}
            </time>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontFamily: "var(--font-display)",
                  fontSize: 24,
                  fontWeight: 600,
                  letterSpacing: "-0.022em",
                }}
              >
                {p.t}
              </h2>
              <p
                style={{
                  fontSize: 15,
                  lineHeight: "24px",
                  color: "var(--muted-foreground)",
                  margin: "8px 0 0",
                  maxWidth: 620,
                }}
              >
                {p.e}
              </p>
            </div>
            <Badge size="xs" color="secondary">
              {p.tag}
            </Badge>
          </article>
        ))}
      </div>
    </>
  );
}
