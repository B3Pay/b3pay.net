import { Button } from "@b3pay/ui";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { OnThisPage } from "../components/OnThisPage";
import { entryPage, neighbours, pageByPath } from "../content/pages";
import { projectByKey } from "../content/registry";
import { ArrowLeft, ArrowRight } from "../lib/icons";
import { linkProps } from "../lib/router-link";
import { useSeo } from "../lib/seo";
import NotFound from "./NotFound";

export default function DocPage() {
  const { project: projectKey = "", slug } = useParams();
  const project = projectByKey(projectKey);

  // `/<project>` with no page: land on the first entry in its sidebar.
  if (project && !slug) {
    const first = entryPage(project.key);
    if (first) return <Navigate to={first.path} replace />;
  }

  const page = pageByPath(`/${projectKey}/${slug}`);
  if (!page) return <NotFound />;

  return <Article key={page.path} page={page} />;
}

function Article({ page }: { page: NonNullable<ReturnType<typeof pageByPath>> }) {
  const navigate = useNavigate();
  const { prev, next } = neighbours(page);
  const { Component } = page;

  useSeo({
    title: `${page.title} — ${page.project.name} docs`,
    description: page.lead,
    path: page.path,
    indexable: !page.draft,
  });

  return (
    <div className="docs-page">
      <article id="doc" className="docs-article">
        <div className="docs-crumb">
          <span>{page.project.name}</span>
          <span className="docs-crumb__sep">/</span>
          <span>{page.section}</span>
          <span className="docs-crumb__sep">/</span>
          <span className="docs-crumb__here">{page.title}</span>
        </div>

        <h1 className="docs-title">{page.title}</h1>
        <p className="docs-lead">{page.lead}</p>

        <div className="docs-prose">
          <Component />
        </div>

        {prev || next ? (
          <nav className="docs-pager" aria-label="Previous and next page">
            {prev ? (
              <Button {...linkProps(navigate, prev.path)} variant="outlined" icon={ArrowLeft}>
                {prev.label}
              </Button>
            ) : (
              <span />
            )}
            {next ? (
              <Button
                {...linkProps(navigate, next.path)}
                variant="outlined"
                iconRight={ArrowRight}
              >
                {next.label}
              </Button>
            ) : (
              <span />
            )}
          </nav>
        ) : null}
      </article>

      <OnThisPage page={page} />
    </div>
  );
}
