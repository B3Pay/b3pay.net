import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import "@b3pay/ui/styles.css";
import "./site/site.css";
import App from "./App";

const root = document.getElementById("root")!;

// Vercel Web Analytics and Speed Insights. The dashboard hands out the `/next`
// import for both; this is a Vite SPA, so the plain React entries are the ones
// that apply — each appends its own script under /_vercel on mount, and both
// read navigation from history.pushState, which is what react-router already
// moves with.
//
// They live here rather than in Layout so the SSR bundle never imports them:
// both render null and only do anything in an effect, so a prerendered document
// would carry the import cost and none of the benefit.
const tree = (
  <StrictMode>
    <BrowserRouter>
      <App />
      <Analytics />
      <SpeedInsights />
    </BrowserRouter>
  </StrictMode>
);

// The build prerenders every route, so in production there is markup to adopt.
// `vite dev` serves an empty #root, hence the branch.
if (root.firstElementChild) hydrateRoot(root, tree);
else createRoot(root).render(tree);
