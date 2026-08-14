import { Badge, Button, IconOf } from "@b3pay/ui";

import { Section } from "../site/furniture";
import { BLOG_URL, useBlogPosts } from "../lib/blog-feed";
import { routeMeta } from "../site/routes";
import { useSeo } from "../lib/seo";

/**
 * Index of the B3Pay blog (blog.b3pay.net). The posts live there, not here —
 * this page fetches the latest stories client-side and every row links out.
 * The prerendered HTML ships only the header and the "Read the blog" pointer,
 * so a failed fetch (or a crawler without JS) still lands on a working page.
 */
export default function Blog() {
  useSeo(routeMeta("/blog"));
  const posts = useBlogPosts(8);

  return (
    <>
      <Section
        as="h1"
        eyebrow="Writing"
        title="Notes from the wire."
        lead="Stories on AI, Web3 and the Internet Computer from the B3Pay blog — researched, written and published by an AI pipeline, with grounded sources on every one."
      />
      <div className="site-shell">
        {posts &&
          posts.map((p) => (
            <a key={p.url} href={p.url} className="site-blog-row">
              <time
                dateTime={p.date}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--muted-foreground)",
                }}
              >
                {p.date.slice(0, 10)}
              </time>
              <div>
                <h2
                  className="site-blog-row__title"
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-display)",
                    fontSize: 24,
                    fontWeight: 600,
                    letterSpacing: "-0.022em",
                  }}
                >
                  {p.title}
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
                  {p.summary}
                </p>
              </div>
              <Badge size="xs" color="secondary">
                {p.category}
              </Badge>
            </a>
          ))}
        <div
          style={{
            padding: "26px 0 0",
            borderTop: posts ? "1px solid var(--border)" : "none",
          }}
        >
          <Button
            variant="outlined"
            as="a"
            href={BLOG_URL}
            icon={IconOf("ArrowUpRight")}
          >
            Read the blog
          </Button>
        </div>
      </div>
    </>
  );
}
