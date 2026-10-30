import { test } from "node:test";
import assert from "node:assert/strict";
import { toStarlight } from "./site.mjs";

test("toStarlight puts every sidebar item at its address on the site, and a folder's pages in Starlight's own list", () => {
  assert.deepEqual(
    toStarlight(
      [
        "index",
        { label: "Reads", page: "guides/reads" },
        { label: "Repository", link: "https://github.com/B3Pay/example" },
        { label: "Playground", link: "play/" },
        { label: "Functions", directory: "libs/functions" },
        { label: "More", collapsed: true, items: [{ label: "Types", directory: "libs/types", collapsed: true }] },
      ],
      "example",
    ),
    [
      { slug: "docs/example" },
      { label: "Reads", slug: "docs/example/guides/reads" },
      { label: "Repository", link: "https://github.com/B3Pay/example" },
      { label: "Playground", link: "/docs/example/play/" },
      { label: "Functions", collapsed: false, items: [{ autogenerate: { directory: "docs/example/libs/functions" } }] },
      { label: "More", collapsed: true, items: [{ label: "Types", collapsed: true, items: [{ autogenerate: { directory: "docs/example/libs/types" } }] }] },
    ],
  );
});
