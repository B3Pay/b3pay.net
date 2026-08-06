import { Badge, BrandMark, Button, Drawer, Kbd, Select, Shell, Tooltip } from "@b3pay/ui";
import { useCallback, useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

import { entryPage, pageByPath, pagesOf } from "../content/pages";
import { MAIN_SITE, PROJECTS, repoUrl } from "../content/registry";
import { ArrowUpRight, Github, Menu, Search } from "../lib/icons";
import { DocsPalette } from "./DocsPalette";
import { DocsSideNav } from "./DocsSideNav";

const isMac = () =>
  typeof navigator !== "undefined" && /mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent);

export function DocsLayout() {
  const { pathname, hash } = useLocation();
  const [palette, setPalette] = useState(false);
  const [menu, setMenu] = useState(false);
  const [searchLabel, setSearchLabel] = useState("⌘K");

  const page = pageByPath(pathname);
  const project = page?.project ?? PROJECTS.find((p) => pathname.startsWith(`/${p.key}`));
  const sidebar = project ? pagesOf(project.key) : [];

  useEffect(() => setSearchLabel(isMac() ? "⌘K" : "Ctrl K"), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // The shell scrolls `.b3-shell__main`, not the document, so neither the
  // browser's own scroll restoration nor `window.scrollTo` applies. Reset it on
  // navigation, and honour an incoming #hash once the new page has rendered.
  useEffect(() => {
    setMenu(false);
    setPalette(false);
    const main = document.querySelector(".b3-shell__main");
    if (!main) return;
    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        target.scrollIntoView({ block: "start" });
        return;
      }
    }
    main.scrollTop = 0;
  }, [pathname, hash]);

  const closePalette = useCallback(() => setPalette(false), []);
  const closeMenu = useCallback(() => setMenu(false), []);

  const others = PROJECTS.filter((p) => p.key !== project?.key);

  const nav = (
    <>
      <DocsSideNav pages={sidebar} onNavigate={closeMenu} />
      <div className="docs-aside__switch">
        <div className="b3-eyebrow" style={{ padding: "0 8px 8px" }}>
          Other projects
        </div>
        {others.map((p) => {
          const first = entryPage(p.key);
          return first ? (
            <Link
              key={p.key}
              to={first.path}
              className="b3-menu__item docs-nav__link"
              onClick={closeMenu}
            >
              <ArrowUpRight width={12} height={12} aria-hidden />
              <span style={{ flex: 1 }}>{p.name}</span>
            </Link>
          ) : null;
        })}
      </div>
    </>
  );

  return (
    <Shell
      className="docs-shell"
      bar={
        <>
          <div className="docs-bar__left">
            <Button
              className="docs-bar__menu"
              size="sm"
              variant="ghost"
              asIconButton
              icon={Menu}
              onClick={() => setMenu(true)}
              aria-label="Open the navigation"
            />
            <a href={MAIN_SITE} aria-label="B3Pay — home" style={{ display: "flex" }}>
              <BrandMark size={22} />
            </a>
            <span className="docs-bar__divider" />
            <Link to="/" className="b3-eyebrow docs-bar__wordmark">
              Docs
            </Link>
            {project ? (
              <Badge size="xs" color={project.tagColor}>
                {project.name}
              </Badge>
            ) : null}
          </div>

          <div className="docs-bar__right">
            <button
              type="button"
              onClick={() => setPalette(true)}
              className="b3-field b3-field--md docs-search"
              aria-label={`Search the documentation — ${searchLabel}`}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Search width={13} height={13} aria-hidden /> Search docs
              </span>
              <span style={{ display: "flex", gap: 3 }} aria-hidden>
                {searchLabel === "⌘K" ? (
                  <>
                    <Kbd>⌘</Kbd>
                    <Kbd>K</Kbd>
                  </>
                ) : (
                  <>
                    <Kbd>Ctrl</Kbd>
                    <Kbd>K</Kbd>
                  </>
                )}
              </span>
            </button>

            {/* Below 680px the field above is gone and there is no keyboard to
                press ⌘K on, so search needs its own control. */}
            <Button
              className="docs-bar__searchicon"
              size="md"
              variant="ghost"
              asIconButton
              icon={Search}
              onClick={() => setPalette(true)}
              aria-label="Search the documentation"
            />

            {project && project.versions.length > 1 ? (
              // Older versions are not published yet, so the control reports
              // the version being read rather than pretending to switch.
              <Select
                className="docs-bar__version"
                style={{ width: 96 }}
                size="md"
                options={project.versions}
                aria-label="Documentation version"
                disabled
              />
            ) : null}

            <Tooltip content="View on GitHub">
              <Button
                as="a"
                href={repoUrl(project?.repo ?? "B3Pay/b3pay.net")}
                target="_blank"
                rel="noreferrer"
                asIconButton
                size="md"
                variant="ghost"
                icon={Github}
                aria-label="View on GitHub"
              />
            </Tooltip>
          </div>
        </>
      }
      aside={project ? nav : null}
    >
      <a className="docs-skip" href="#doc">
        Skip to content
      </a>

      <Outlet />

      <Drawer open={menu} title="Documentation" onClose={closeMenu} width={300}>
        {project ? nav : null}
      </Drawer>

      {palette ? <DocsPalette current={page} onClose={closePalette} /> : null}
    </Shell>
  );
}
