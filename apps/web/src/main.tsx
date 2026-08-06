import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

import "@b3pay/ui/styles.css";
import "./site/site.css";
import App from "./App";

const root = document.getElementById("root")!;

// Vercel Web Analytics. The dashboard hands out the `/next` import; this is a
// Vite SPA, so the plain React entry is the right one — it appends
// /_vercel/insights/script.js on mount and the script attributes page views to
// history.pushState, which is what react-router already navigates with.
//
// It lives here rather than in Layout so the SSR bundle never imports it: the
// component renders null and only does anything in an effect, so a prerendered
// document would carry the import cost and none of the benefit.
const tree = (
  <StrictMode>
    <BrowserRouter>
      <App />
      <Analytics />
    </BrowserRouter>
  </StrictMode>
);

// The build prerenders every route, so in production there is markup to adopt.
// `vite dev` serves an empty #root, hence the branch.
if (root.firstElementChild) hydrateRoot(root, tree);
else createRoot(root).render(tree);
