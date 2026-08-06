import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  // The design system is workspace TypeScript, so the SSR build has to compile
  // it rather than hand it to node as-is.
  ssr: { noExternal: ["@b3pay/ui", "lucide-react", "sonner"] },
  build: {
    // The client build goes to the repo root. Vercel resolves its output
    // directory from the project's Root Directory, and its default for a Vite
    // app is `dist` there — emitting anywhere else makes the deploy depend on a
    // dashboard override that silently outranks vercel.json.
    //
    // The SSR bundle stays inside apps/web: it is an intermediate the prerender
    // step consumes and never ships, and this package is the one that declares
    // "type": "module", which node needs to load it without reparsing.
    outDir: isSsrBuild ? "dist-ssr" : "../../dist",
    emptyOutDir: true,
    target: "es2020",
    // One stylesheet: the site is small, and a second request in the critical
    // path costs more than the bytes it saves.
    cssCodeSplit: false,
    assetsInlineLimit: 0,
    rollupOptions: isSsrBuild
      ? undefined
      : {
          output: {
            // React and the router change on their own schedule; splitting them
            // keeps a content edit from invalidating 165 kB of vendor code.
            manualChunks: { react: ["react", "react-dom", "react-router-dom"] },
          },
        },
  },
}));
