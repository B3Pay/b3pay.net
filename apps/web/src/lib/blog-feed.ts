/**
 * Latest-posts feed from the B3Pay blog (blog.b3pay.net).
 *
 * The endpoint is public and CORS-open. This site fetches it client-side
 * only, so the prerendered HTML ships the fallback state and hydration fills
 * in the live rows; a failed fetch leaves `posts` null and callers render a
 * plain link to the blog instead of an empty grid.
 */
import { useEffect, useState } from "react";

export const BLOG_URL = "https://blog.b3pay.net";

export interface BlogPost {
  title: string;
  url: string;
  /** ISO timestamp — render as `date.slice(0, 10)`. */
  date: string;
  category: string;
  summary: string;
}

function parsePosts(data: unknown): BlogPost[] | null {
  if (typeof data !== "object" || data === null) return null;
  const raw = (data as { posts?: unknown }).posts;
  if (!Array.isArray(raw)) return null;
  const posts = raw.filter(
    (p): p is BlogPost =>
      typeof p === "object" &&
      p !== null &&
      typeof (p as BlogPost).title === "string" &&
      typeof (p as BlogPost).url === "string" &&
      typeof (p as BlogPost).date === "string" &&
      typeof (p as BlogPost).category === "string" &&
      typeof (p as BlogPost).summary === "string",
  );
  return posts.length > 0 ? posts : null;
}

export function useBlogPosts(limit: number): BlogPost[] | null {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${BLOG_URL}/api/latest-posts`, { signal: controller.signal })
      .then((res) => (res.ok ? (res.json() as Promise<unknown>) : null))
      .then((data) => {
        if (data !== null) setPosts(parsePosts(data));
      })
      .catch(() => {
        // Fallback state is already rendered; nothing to do.
      });
    return () => controller.abort();
  }, []);

  return posts ? posts.slice(0, limit) : null;
}
