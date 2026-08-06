import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";

import App from "./App";

export { ALL_ROUTES, OG_IMAGE, SITE_NAME, SITE_URL } from "./lib/routes";

/**
 * Build-time render of a single page.
 *
 * Docs are the case prerendering exists for: the content is the product, and it
 * has to be in the document a crawler receives rather than assembled after a
 * React bundle boots. Mirrors apps/web/src/entry-server.tsx.
 */
export function render(path: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={path}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
}
