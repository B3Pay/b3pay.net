import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "@b3pay/ui/styles.css";
import "./site/site.css";
import App from "./App";

const root = document.getElementById("root")!;

const tree = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// The build prerenders every route, so in production there is markup to adopt.
// `vite dev` serves an empty #root, hence the branch.
if (root.firstElementChild) hydrateRoot(root, tree);
else createRoot(root).render(tree);
