/**
 * What the site makes of a checked module: its sidebar in Starlight's terms,
 * and its static pages in the site search.
 */

/** The module's sidebar, in Starlight's terms, with every page, link and folder at its address on the site. */
export function toStarlight(items, id) {
  const slug = (page) => (page === "index" ? `docs/${id}` : `docs/${id}/${page}`);
  return items.map((item) => {
    if (typeof item === "string") return { slug: slug(item) };
    if ("page" in item) return { label: item.label, slug: slug(item.page) };
    if ("link" in item) return { label: item.label, link: /^https:/.test(item.link) ? item.link : `/docs/${id}/${item.link}` };
    // Starlight lists a folder's pages in place of an `autogenerate` entry, so a labeled folder is a group holding one.
    if ("directory" in item) return { label: item.label, collapsed: item.collapsed ?? false, items: [{ autogenerate: { directory: slug(item.directory) } }] };
    return { label: item.label, collapsed: item.collapsed ?? false, items: toStarlight(item.items, id) };
  });
}

/** Where the first `<name>` start tag is, outside comments and the text of script, style, textarea and title elements; -1 if there is none. */
function startTag(html, name) {
  const pattern = new RegExp(`<!--[\\s\\S]*?-->|<(script|style|textarea|title)\\b[\\s\\S]*?</\\1\\s*>|<${name}(?=[\\s/>])`, "gi");
  for (const match of html.matchAll(pattern)) if (!match[0].startsWith("<!--") && match[1] === undefined) return match.index;
  return -1;
}

/**
 * A static page marked for the site search. Pagefind indexes only pages with
 * `data-pagefind-body` once any page has it, as Starlight's pages do, so a
 * static page gets it on its `<main>`, or its `<body>` when it has no main.
 */
export function indexForSearch(html) {
  if (/\sdata-pagefind-body\b/i.test(html)) return html;
  for (const name of ["main", "body"]) {
    const at = startTag(html, name);
    if (at !== -1) return `${html.slice(0, at + name.length + 1)} data-pagefind-body${html.slice(at + name.length + 1)}`;
  }
  return html;
}
