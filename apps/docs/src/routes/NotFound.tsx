import { Button, Kbd } from "@b3pay/ui";
import { useLocation, useNavigate } from "react-router-dom";

import { PROJECTS } from "../content/registry";
import { entryPage } from "../content/pages";
import { linkProps } from "../lib/router-link";
import { useSeo } from "../lib/seo";

export default function NotFound() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useSeo({
    title: "Not found — B3Pay Docs",
    description: "That documentation page does not exist.",
    path: pathname,
    indexable: false,
  });

  return (
    <div className="docs-home" id="doc">
      <div className="b3-eyebrow">404</div>
      <h1 className="docs-title">No page here.</h1>
      <p className="docs-lead">
        <code className="docs-inline-code">{pathname}</code> does not match any page. Press{" "}
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd> to search, or start from a project:
      </p>

      <div className="docs-home__foot">
        {PROJECTS.map((project) => {
          const first = entryPage(project.key);
          return first ? (
            <Button key={project.key} {...linkProps(navigate, first.path)} variant="outlined">
              {project.name}
            </Button>
          ) : null;
        })}
      </div>
    </div>
  );
}
