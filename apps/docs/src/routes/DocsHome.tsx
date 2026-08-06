import { Badge, Button, Card } from "@b3pay/ui";
import { Link } from "react-router-dom";

import { entryPage, pagesOf, writtenPagesOf } from "../content/pages";
import { GITHUB_ORG, MAIN_SITE, PROJECTS } from "../content/registry";
import { ArrowRight, Github } from "../lib/icons";
import { HOME_DESCRIPTION, HOME_TITLE } from "../lib/routes";
import { useSeo } from "../lib/seo";

export default function DocsHome() {
  useSeo({ title: HOME_TITLE, description: HOME_DESCRIPTION, path: "/" });

  return (
    <div className="docs-home" id="doc">
      <div className="b3-eyebrow">B3Pay · Documentation</div>
      <h1 className="docs-title">Four projects, one reference.</h1>
      <p className="docs-lead">
        Everything B3Pay ships is open source and developed in the open. These are the
        guides for building on it — the workflow platform, the wallet canister, the
        TypeScript packages and the encryption demo.
      </p>

      <div className="docs-home__grid">
        {PROJECTS.map((project) => {
          const first = entryPage(project.key);
          // Counting outlines as pages would overstate what is here. Report
          // what is written, and say so plainly when nothing is.
          const written = writtenPagesOf(project.key).length;
          const total = pagesOf(project.key).length;
          if (!first) return null;
          return (
            <Card key={project.key} className="docs-home__card">
              <div className="docs-home__card-head">
                <h2 className="docs-home__card-title">
                  <Link to={first.path}>{project.name}</Link>
                </h2>
                <Badge size="xs" color={project.tagColor}>
                  {project.tag}
                </Badge>
              </div>
              <p className="docs-home__card-line">{project.line}</p>
              <div className="docs-home__card-foot">
                <span className="docs-home__count">
                  {written === 0
                    ? `Outline · ${total} pages`
                    : `${written} of ${total} pages`}
                </span>
                <Link to={first.path} className="docs-home__cta">
                  {written === 0 ? "See the outline" : "Read the docs"}{" "}
                  <ArrowRight width={13} height={13} aria-hidden />
                </Link>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="docs-home__foot">
        <Button as="a" href={MAIN_SITE} variant="outlined" size="md">
          b3pay.net
        </Button>
        <Button
          as="a"
          href={GITHUB_ORG}
          target="_blank"
          rel="noreferrer"
          variant="ghost"
          size="md"
          icon={Github}
        >
          GitHub
        </Button>
      </div>
    </div>
  );
}
