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
    // A folder is a path, not a page: one named `index` is that folder, not the module's home.
    if ("directory" in item) return { label: item.label, collapsed: item.collapsed ?? false, items: [{ autogenerate: { directory: `docs/${id}/${item.directory}` } }] };
    return { label: item.label, collapsed: item.collapsed ?? false, items: toStarlight(item.items, id) };
  });
}

/** A page's start tags, in order, outside comments and the text of script, style, textarea and title elements: each one's name, place and text. */
function* startTags(html) {
  const pattern = /<!--[\s\S]*?-->|<(script|style|textarea|title)(?=[\s/>])[\s\S]*?<\/\1\s*>|<([a-z][^\s/>]*)(?:[^>"']|"[^"]*"|'[^']*')*>/gi;
  for (const match of html.matchAll(pattern)) if (match[2] !== undefined) yield { name: match[2].toLowerCase(), index: match.index, text: match[0] };
}

/** Whether the tag has the attribute itself, not in an attribute's value. */
const hasAttribute = (tag, name) => new RegExp(`\\s${name}(?=[\\s=/>])`, "i").test(tag.text.replace(/"[^"]*"|'[^']*'/g, '""'));

/**
 * A static page marked for the site search. Pagefind indexes only pages with
 * `data-pagefind-body` once any page has it, as Starlight's pages do, so a
 * static page gets it on its `<main>`, or its `<body>` when it has no main,
 * unless one of its elements has it already.
 */
export function indexForSearch(html) {
  const tags = [...startTags(html)];
  if (tags.some((tag) => hasAttribute(tag, "data-pagefind-body"))) return html;
  for (const name of ["main", "body"]) {
    const tag = tags.find((tag) => tag.name === name);
    if (tag) return `${html.slice(0, tag.index + name.length + 1)} data-pagefind-body${html.slice(tag.index + name.length + 1)}`;
  }
  return html;
}
