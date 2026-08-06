/**
 * What a compiled `.mdx` page exports.
 *
 * `meta` comes from the YAML frontmatter via remark-mdx-frontmatter, `toc` from
 * the remarkDocsToc plugin in lib/mdx-plugins.mjs. Both are build-time
 * constants, so a page missing either fails in the content loader rather than
 * rendering a half-page.
 */
declare module "*.mdx" {
  import type { ComponentType } from "react";

  export interface DocFrontmatter {
    title: string;
    lead: string;
    /** An outline, not finished prose: noindex, and out of the sitemap. */
    draft?: boolean;
  }

  export interface TocEntry {
    depth: 2 | 3;
    text: string;
    id: string;
  }

  export const meta: DocFrontmatter;
  export const toc: TocEntry[];

  const MDXComponent: ComponentType<{ components?: Record<string, unknown> }>;
  export default MDXComponent;
}

declare module "*.mjs";
