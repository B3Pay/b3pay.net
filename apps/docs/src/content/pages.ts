import type { ComponentType } from "react";

import { PROJECTS, type DocProject } from "./registry";

/**
 * Mirrors the `toc` export declared in `src/mdx.d.ts`. The ambient wildcard
 * module cannot import a named type from here without a circular reference, so
 * the shape is stated twice and matched structurally. Change one, change both.
 */
export interface TocEntry {
  depth: 2 | 3;
  text: string;
  id: string;
}

export interface DocPage {
  project: DocProject;
  /** Sidebar section this page sits under — the first breadcrumb segment. */
  section: string;
  slug: string;
  /** Sidebar label. Often shorter than `title`. */
  label: string;
  badge?: string;
  /** Router path and canonical URL suffix, e.g. "/ic-reactor/quickstart". */
  path: string;
  title: string;
  lead: string;
  /** An outline rather than finished prose. Kept out of the sitemap, noindexed. */
  draft: boolean;
  toc: TocEntry[];
  Component: ComponentType<{ components?: Record<string, unknown> }>;
}

interface MdxModule {
  default: ComponentType<{ components?: Record<string, unknown> }>;
  meta?: { title?: string; lead?: string; draft?: boolean };
  toc?: TocEntry[];
}

// Eager, so every page is part of the SSR bundle the prerender step imports and
// part of the search index the palette filters. The whole corpus is a few tens
// of kB of prose; lazy loading it would buy a smaller first chunk and cost a
// navigation round trip on every sidebar click.
const modules = import.meta.glob<MdxModule>("./*/*.mdx", { eager: true });

const keyFor = (project: string, slug: string) => `./${project}/${slug}.mdx`;

function build(): DocPage[] {
  const pages: DocPage[] = [];
  const claimed = new Set<string>();
  const problems: string[] = [];

  for (const project of PROJECTS) {
    for (const section of project.sections) {
      for (const item of section.items) {
        const key = keyFor(project.key, item.slug);
        const mod = modules[key];

        if (!mod) {
          problems.push(`  missing file    ${key.slice(2)}  (listed in registry.ts)`);
          continue;
        }
        claimed.add(key);

        const title = mod.meta?.title;
        const lead = mod.meta?.lead;
        if (!title || !lead) {
          problems.push(
            `  bad frontmatter ${key.slice(2)}  (needs both \`title\` and \`lead\`)`,
          );
          continue;
        }

        pages.push({
          project,
          section: section.label,
          slug: item.slug,
          label: item.label,
          badge: item.badge,
          path: `/${project.key}/${item.slug}`,
          title,
          lead,
          draft: mod.meta?.draft === true,
          toc: mod.toc ?? [],
          Component: mod.default,
        });
      }
    }
  }

  for (const key of Object.keys(modules)) {
    if (!claimed.has(key)) {
      problems.push(`  unreachable     ${key.slice(2)}  (no entry in registry.ts)`);
    }
  }

  if (problems.length) {
    throw new Error(
      [
        "",
        "The docs nav and the content directory disagree:",
        "",
        ...problems.sort(),
        "",
        "  Every .mdx file under src/content/<project>/ must appear exactly once",
        "  in PROJECTS in src/content/registry.ts, and carry title + lead",
        "  frontmatter. Fix one side or the other.",
        "",
      ].join("\n"),
    );
  }

  return pages;
}

/** Every page, in sidebar order, grouped project by project. */
export const PAGES: DocPage[] = build();

const byPath = new Map(PAGES.map((p) => [p.path, p]));

export const pageByPath = (path: string): DocPage | undefined => byPath.get(path);

export const pagesOf = (projectKey: string): DocPage[] =>
  PAGES.filter((p) => p.project.key === projectKey);

/** Pages of a project that are actually written. */
export const writtenPagesOf = (projectKey: string): DocPage[] =>
  pagesOf(projectKey).filter((p) => !p.draft);

/** First page of a project — where `/<project>` lands. */
export const entryPage = (projectKey: string): DocPage | undefined =>
  PAGES.find((p) => p.project.key === projectKey);

/**
 * Previous and next within the same project, following sidebar order across
 * section boundaries. Ends of a project return undefined rather than wrapping
 * into a neighbouring product.
 */
export function neighbours(page: DocPage): { prev?: DocPage; next?: DocPage } {
  const siblings = pagesOf(page.project.key);
  const i = siblings.indexOf(page);
  return { prev: siblings[i - 1], next: siblings[i + 1] };
}
