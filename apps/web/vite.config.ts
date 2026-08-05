import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  // The design system is workspace TypeScript, so the SSR build has to compile
  // it rather than hand it to node as-is.
  ssr: { noExternal: ["@b3pay/ui", "lucide-react", "sonner"] },
  build: {
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
