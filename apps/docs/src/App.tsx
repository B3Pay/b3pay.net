import { MDXProvider } from "@mdx-js/react";
import { Route, Routes } from "react-router-dom";

import { DocsLayout } from "./components/DocsLayout";
import { mdxComponents } from "./components/mdx";
import DocPage from "./routes/DocPage";
import DocsHome from "./routes/DocsHome";
import NotFound from "./routes/NotFound";

export default function App() {
  return (
    <MDXProvider components={mdxComponents}>
      <Routes>
        <Route element={<DocsLayout />}>
          <Route path="/" element={<DocsHome />} />
          {/* `/:project` redirects to the project's first page; DocPage does
              the lookup so the redirect target stays derived from the nav. */}
          <Route path="/:project" element={<DocPage />} />
          <Route path="/:project/:slug" element={<DocPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </MDXProvider>
  );
}
