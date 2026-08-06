import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { defineConfig } from "vite";

import { remarkCodeBlocks, remarkDocsToc } from "./src/lib/mdx-plugins.mjs";

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    // `enforce: "pre"` so MDX compiles to JSX before the React plugin runs;
    // without it the JSX these files produce reaches esbuild untransformed.
    {
      enforce: "pre",
      ...mdx({
        // Element names resolve through MDXProvider instead of module scope, so
        // a page can write `<Callout>` without importing it. See DocsArticle.
        providerImportSource: "@mdx-js/react",
        remarkPlugins: [
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: "meta" }],
          remarkGfm,
          remarkDocsToc,
          remarkCodeBlocks,
        ],
        rehypePlugins: [rehypeSlug],
      }),
    },
    react({ include: /\.(mdx|jsx|tsx)$/ }),
  ],
  // The design system is workspace TypeScript, so the SSR build has to compile
  // it rather than hand it to node as-is.
  ssr: { noExternal: ["@b3pay/ui", "lucide-react", "sonner"] },
  build: {
    // Docs emit to `dist-docs` rather than `dist` so a local `npm run build`
    // and `npm run build:docs` do not overwrite each other. On Vercel the two
    // sites are separate projects; the docs project sets Output Directory to
    // this path. See README > Deploying.
    outDir: isSsrBuild ? "dist-ssr" : "../../dist-docs",
    emptyOutDir: true,
    target: "es2020",
    cssCodeSplit: false,
    assetsInlineLimit: 0,
    rollupOptions: isSsrBuild
      ? undefined
      : {
          output: {
            manualChunks: { react: ["react", "react-dom", "react-router-dom"] },
          },
        },
  },
}));
