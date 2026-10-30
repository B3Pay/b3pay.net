// @ts-check
/**
 * b3pay.net: the marketing pages and every product's docs, one Astro +
 * Starlight site.
 *
 * Product docs are modules (modules/README.md). `npm run dev` and `npm run
 * build` run scripts/modules/sync.mjs first, which brings each module's pages
 * into src/content/docs/docs/<id>/ and writes src/generated/modules.json. The
 * docs sidebar is built from that file: one topic per module, each with the
 * sidebar its manifest gives.
 */
import { existsSync, readFileSync } from "node:fs";
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightLinksValidator from "starlight-links-validator";
import starlightSidebarTopics from "starlight-sidebar-topics";

const SITE = "https://b3pay.net";
const DESCRIPTION =
  "B3Pay makes contract calls readable: ERC-7730 Clear Signing descriptors written and tested for your protocol, and tooling so AI agents only send transactions a person can read and approve.";

const navigation = new URL("./src/generated/modules.json", import.meta.url);
if (!existsSync(navigation))
  throw new Error(
    "src/generated/modules.json is missing. Run `npm run modules:sync` (`npm run dev` and `npm run build` run it for you).",
  );
/** @type {{ modules: Array<{ id: string, title: string, group: string, status: string, href: string, static: boolean, sidebar: any[] | null }> }} */
const { modules } = JSON.parse(readFileSync(navigation, "utf8"));

/** @type {Record<string, { text: string, variant: "caution" | "note" | "default" }>} */
const BADGES = {
  beta: { text: "Beta", variant: "caution" },
  "in-development": { text: "In development", variant: "note" },
};

// The product switcher at the top of the docs sidebar. A module with pages
// gets its own sidebar; a module of static pages is a link to its home.
const topics = modules.map((module) => {
  const badge =
    BADGES[module.status] ?? (module.group === "internet-computer" ? { text: "ICP", variant: "default" } : undefined);
  const topic = { label: module.title, link: module.href, ...(badge ? { badge } : {}) };
  return module.sidebar ? { ...topic, id: module.id, items: module.sidebar } : topic;
});

export default defineConfig({
  site: SITE,
  integrations: [
    starlight({
      title: "B3Pay",
      description: DESCRIPTION,
      logo: {
        dark: "./src/assets/b3pay-lockup-dark.svg",
        light: "./src/assets/b3pay-lockup-light.svg",
        alt: "B3Pay home",
        replacesTitle: true,
      },
      favicon: "/favicon.svg",
      social: [{ icon: "github", label: "B3Pay on GitHub", href: "https://github.com/B3Pay" }],
      credits: false,
      head: [
        { tag: "link", attrs: { rel: "apple-touch-icon", href: "/apple-touch-icon.png" } },
        { tag: "link", attrs: { rel: "manifest", href: "/site.webmanifest" } },
        { tag: "meta", attrs: { name: "theme-color", content: "#121110" } },
        { tag: "meta", attrs: { property: "og:image", content: `${SITE}/og.png` } },
        { tag: "meta", attrs: { property: "og:image:width", content: "1280" } },
        { tag: "meta", attrs: { property: "og:image:height", content: "640" } },
        { tag: "meta", attrs: { property: "og:image:alt", content: "B3Pay" } },
        { tag: "meta", attrs: { name: "twitter:image", content: `${SITE}/og.png` } },
      ],
      customCss: [
        "@fontsource-variable/schibsted-grotesk/wght.css",
        "@fontsource-variable/schibsted-grotesk/wght-italic.css",
        "@fontsource-variable/martian-mono/wdth.css",
        "./src/styles/tokens.css",
        "./src/styles/starlight.css",
        "./src/styles/site.css",
      ],
      expressiveCode: {
        themes: ["vitesse-dark", "vitesse-light"],
        useStarlightUiThemeColors: true,
        styleOverrides: { borderRadius: "10px" },
      },
      components: {
        Header: "./src/components/starlight/Header.astro",
        Footer: "./src/components/starlight/Footer.astro",
        MobileMenuFooter: "./src/components/starlight/MobileMenuFooter.astro",
      },
      plugins: [
        starlightSidebarTopics(topics, {
          // A module's pages that its sidebar leaves out still belong to it.
          topics: Object.fromEntries(
            modules.filter((module) => module.sidebar).map((module) => [module.id, [`/docs/${module.id}/**`]]),
          ),
        }),
        starlightLinksValidator({
          // A module of static pages is files, not pages the validator knows:
          // its folder addresses are served by its index.html.
          exclude: modules.filter((module) => module.static).flatMap((module) => [`/docs/${module.id}/`, `/docs/${module.id}/**`]),
          sameSitePolicy: "validate",
        }),
      ],
    }),
  ],
});
