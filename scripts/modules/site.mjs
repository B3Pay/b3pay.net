/** What the site makes of a checked module: its sidebar in Starlight's terms. */

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
