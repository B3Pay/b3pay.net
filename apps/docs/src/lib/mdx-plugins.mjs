/**
 * The two MDX transforms the docs need that no off-the-shelf plugin provides.
 *
 * Kept as `.mjs` because vite.config.ts imports them at config-load time, before
 * any TypeScript transform is in play.
 */
import { parse } from "acorn";
import GithubSlugger from "github-slugger";
import { toString } from "mdast-util-to-string";
import { visit } from "unist-util-visit";

/**
 * Exports `toc` from every page: the h2/h3 headings, in document order, with
 * the same ids `rehype-slug` will put on the rendered elements.
 *
 * Every heading is passed through the slugger, not just the ones that reach the
 * table of contents, because the slugger dedupes by counting what it has
 * already seen — skipping an h4 here would desynchronise the ids from
 * rehype-slug's the moment two headings share a title.
 */
export function remarkDocsToc() {
  return (tree) => {
    const slugger = new GithubSlugger();
    const toc = [];

    visit(tree, "heading", (node) => {
      const text = toString(node);
      if (!text) return;
      const id = slugger.slug(text);
      if (node.depth === 2 || node.depth === 3) {
        toc.push({ depth: node.depth, text, id });
      }
    });

    const source = `export const toc = ${JSON.stringify(toc)};`;
    tree.children.unshift({
      type: "mdxjsEsm",
      value: source,
      data: { estree: parse(source, { ecmaVersion: "latest", sourceType: "module" }) },
    });
  };
}

/**
 * Rewrites fenced code blocks to `<CodeBlock code lang filename />`, which
 * DocsArticle resolves to the design system's component.
 *
 * This runs on mdast rather than hast because the info string after the
 * language — ```ts src/reactor.ts — is `node.meta` here and is not guaranteed
 * to survive the conversion to hast.
 */
export function remarkCodeBlocks() {
  return (tree) => {
    visit(tree, "code", (node, index, parent) => {
      if (!parent || index === null || index === undefined) return;

      const filename = (node.meta || "").trim();
      const attributes = [attr("code", node.value)];
      if (node.lang) attributes.push(attr("lang", node.lang));
      if (filename) attributes.push(attr("filename", filename));

      parent.children[index] = {
        type: "mdxJsxFlowElement",
        name: "CodeBlock",
        attributes,
        children: [],
      };
    });
  };
}

const attr = (name, value) => ({ type: "mdxJsxAttribute", name, value });
