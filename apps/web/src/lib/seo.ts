import { useEffect } from "react";

import { OG_IMAGE, SITE_NAME, SITE_URL } from "../site/routes";

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
  /** Route path, e.g. "/products/b3forge". */
  path: string;
}

/**
 * Per-route document metadata.
 *
 * The build also writes a static HTML file per route with these same tags baked
 * in (see `scripts/postbuild-seo.mjs`), so a crawler that does not run
 * JavaScript still gets the right title and description on a cold load. This
 * hook keeps them correct across client-side navigation.
 */
export function useSeo({ title, description, path }: Seo) {
  useEffect(() => {
    const url = SITE_URL + (path === "/" ? "/" : path);
    document.title = title;
    setMeta('meta[name="description"]', "name", "description", description);
    setLink("canonical", url);

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
  }, [title, description, path]);
}
