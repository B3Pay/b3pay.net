import { defineCollection } from "astro:content";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";

/**
 * A page's address is its path under src/content/docs/, always. Astro's
 * default takes a `slug` from the frontmatter when there is one, which would
 * let a module's page claim an address outside its own folder. The module
 * checks refuse `slug` as well; this makes the rule hold for every page.
 */
function pathId({ entry }: { entry: string }): string {
  const id = entry.replace(/\.mdx?$/, "").toLowerCase();
  return id === "index" ? id : id.replace(/\/index$/, "");
}

export const collections = {
  docs: defineCollection({ loader: docsLoader({ generateId: pathId }), schema: docsSchema() }),
};
