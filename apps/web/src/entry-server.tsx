import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";

import App from "./App";

export { ALL_ROUTES, OG_IMAGE, SITE_NAME, SITE_URL } from "./site/routes";

/**
 * Build-time render of a single route.
 *
 * The site ships as static files, so this runs once per route at build and the
 * result is baked into `dist/<route>/index.html`. The client hydrates it. That
 * is the difference between a first paint that waits for a 165 kB React bundle
 * and one that arrives with the document.
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
