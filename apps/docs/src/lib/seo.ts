import { useEffect } from "react";

import { canonical, OG_IMAGE, SITE_NAME } from "./routes";

function setMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export interface Seo {
  title: string;
  description: string;
  /** Route path, e.g. "/ic-reactor/quickstart". */
  path: string;
  /** Keep the page out of the index — used by 404. @default true */
  indexable?: boolean;
}

/**
 * Per-page document metadata, for client-side navigation.
 *
 * The build bakes the same tags into `dist-docs/<path>/index.html`, so a cold
 * load already has them before JavaScript runs; this keeps them right once the
 * router takes over. Mirrors apps/web/src/lib/seo.ts.
 */
export function useSeo({ title, description, path, indexable = true }: Seo) {
  useEffect(() => {
    const url = canonical(path);
    document.title = title;
    setMeta('meta[name="description"]', "name", "description", description);
    setLink("canonical", url);

    const robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (indexable) robots?.remove();
    else setMeta('meta[name="robots"]', "name", "robots", "noindex,follow");

    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:url"]', "property", "og:url", url);
    setMeta('meta[property="og:type"]', "property", "og:type", "website");
    setMeta('meta[property="og:site_name"]', "property", "og:site_name", SITE_NAME);
    setMeta('meta[property="og:image"]', "property", "og:image", OG_IMAGE);

    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", OG_IMAGE);
  }, [title, description, path, indexable]);
}
