import { useCallback, useEffect, useState } from "react";
import { BrandMark, Button, Drawer, IconOf, NavBar, Toaster } from "@b3pay/ui";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

import { CommandPalette } from "./CommandPalette";
import { Footer } from "./Footer";
import { GITHUB_ORG } from "../site/products";
import { linkProps } from "../lib/router-link";
import { NAV_ROUTES, ROUTES } from "../site/routes";

const isMac = () =>
  typeof navigator !== "undefined" && /mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent);

export function Layout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [palette, setPalette] = useState(false);
  const [menu, setMenu] = useState(false);
  const [searchLabel, setSearchLabel] = useState("⌘K");

  useEffect(() => setSearchLabel(isMac() ? "⌘K" : "Ctrl K"), []);

  // ⌘K / Ctrl+K toggles the palette from anywhere.
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

  // Scroll to top on navigate, and close whatever chrome was open.
  useEffect(() => {
    window.scrollTo(0, 0);
    setMenu(false);
    setPalette(false);
  }, [pathname]);

  const closePalette = useCallback(() => setPalette(false), []);

  // The nav highlights /products for every /products/:slug too.
  const activeLabel = NAV_ROUTES.find(
    (r) => pathname === r.path || pathname.startsWith(r.path + "/"),
  )?.label;

  return (
    <>
      <a className="site-skip" href="#main">
        Skip to content
      </a>

      <NavBar
        active={activeLabel}
        brand={
          <Link to="/" aria-label="B3Pay — home" style={{ display: "flex" }}>
            <BrandMark size={26} />
          </Link>
        }
        links={NAV_ROUTES.map((r) => ({
          label: r.label,
          href: r.path,
          render: (props) => (
            <NavLink
              to={r.path}
              className={props.className}
              data-active={props["data-active"]}
              aria-current={props["data-active"] ? "page" : undefined}
            >
              {props.children}
            </NavLink>
          ),
        }))}
        actions={
          <>
            <Button
              size="sm"
              variant="ghost"
              icon={IconOf("Search")}
              onClick={() => setPalette(true)}
              // The accessible name has to contain the visible label, or the
              // two disagree for anyone using voice control.
              aria-label={`Search — ${searchLabel}`}
            >
              {searchLabel}
            </Button>
            <Button
              className="site-nav-desktop-action"
              size="sm"
              variant="ghost"
              as="a"
              href={GITHUB_ORG}
              target="_blank"
              rel="noreferrer"
              icon={IconOf("Github")}
            >
              GitHub
            </Button>
            <Button
              className="site-nav-desktop-action"
              size="sm"
              variant="filled"
              color="primary"
              {...linkProps(navigate, "/contact")}
            >
              Get started
            </Button>
            <Button
              className="site-nav-menu-button"
              size="sm"
              variant="ghost"
              asIconButton
              icon={IconOf("Menu")}
              onClick={() => setMenu(true)}
              aria-label="Open the menu"
            />
          </>
        }
      />

      <main id="main" className="site-main">
        <Outlet />
      </main>

      <Footer />

      {palette ? <CommandPalette onClose={closePalette} /> : null}

      <Drawer open={menu} title="Menu" onClose={() => setMenu(false)} width={300}>
        <div
          className="site-link-list"
          style={{ display: "flex", flexDirection: "column", gap: 4 }}
        >
          {ROUTES.filter((r) => r.inNav || r.inSitemap).map((r) => (
            <NavLink
              key={r.path}
              to={r.path}
              className="b3-nav__link"
              style={{ height: 40, fontSize: "var(--text-md)" }}
              onClick={() => setMenu(false)}
            >
              {r.label}
            </NavLink>
          ))}
        </div>
        <div style={{ height: 1, background: "var(--border)", margin: "16px 0" }} />
        <Button
          as="a"
          href={GITHUB_ORG}
          target="_blank"
          rel="noreferrer"
          variant="outlined"
          size="md"
          fullWidth
          icon={IconOf("Github")}
        >
          GitHub
        </Button>
      </Drawer>

      <Toaster />
    </>
  );
}
