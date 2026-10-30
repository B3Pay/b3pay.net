/**
 * What the site does to a module's Markdown and MDX pages: read them, check
 * them against the content rules, and rewrite the module's own links to the
 * addresses the site serves them at.
 *
 * A page is read the way the site's build reads it, so that a check cannot
 * pass something the build then renders differently: the frontmatter with
 * Astro's own reader, and the body with Sätteri, the parser Astro 7 renders
 * Markdown and MDX with, given the features this site's build turns on.
 * The rules are allowlists: what they do not name is refused.
 */
import { parseFrontmatter } from "@astrojs/internal-helpers/frontmatter";
import { parse as parseScript } from "acorn";
import { markdownToMdast, mdxToMdast } from "satteri";
import YAML from "yaml";

/** Sätteri's features in the site's build: Astro's defaults (GFM, smart punctuation), and the directives Starlight's asides use. */
export const FEATURES = { gfm: true, smartPunctuation: true, directive: true };

/** What a page may import. Anything else is code the site's build would run. */
export const ALLOWED_IMPORTS = ["@astrojs/starlight/components"];
const IMAGE = /\.(png|jpe?g|gif|svg|webp|avif)$/i;

/** Frontmatter a module page may set. `slug` would let a page claim any address; `head` and `banner` write raw HTML. */
export const ALLOWED_FRONTMATTER = [
  "title",
  "description",
  "sidebar",
  "tableOfContents",
  "template",
  "hero",
  "editUrl",
  "lastUpdated",
  "prev",
  "next",
  "pagefind",
  "draft",
];

/**
 * The HTML a page may write, as raw HTML in Markdown or as tags in MDX:
 * elements that format text, with attributes that only describe it. Links
 * and images are written in Markdown, where their addresses are checked.
 */
export const HTML_TAGS = new Set(
  "abbr b blockquote br caption code dd del details div dl dt em figcaption figure h1 h2 h3 h4 h5 h6 hr i ins kbd li mark ol p pre q s samp small span strong sub summary sup table tbody td tfoot th thead tr u ul var wbr".split(" "),
);
export const HTML_ATTRIBUTES = new Set("align colspan dir height lang open reversed rowspan scope span start title valign width".split(" "));

/** The schemes a link may use. Anything else, `javascript:` first, is refused. */
const SCHEMES = ["http", "https", "mailto", "tel"];
/** Component props that hold an address. */
const URL_PROP = /(?:href|src|srcset|url|link|action|poster|cite|background|ping)$/i;
/** A component prop, or a key of an object passed as one. No `set:html`-style directives, no `on…` handlers, no styles. */
const PROP_NAME = /^[A-Za-z][A-Za-z0-9-]*$/;
const FORBIDDEN_PROP = /^(on.*|style|srcdoc)$/i;

// Raw HTML, read with the HTML tokenizer's own whitespace rather than JavaScript's \s.
const SPACE = "[\\t\\n\\f\\r ]";
const ATTRIBUTE_NAME = "[^\\t\\n\\f\\r /\"'<=>]+";
const ATTRIBUTE_VALUE = `(?:"[^"]*"|'[^']*'|[^\\t\\n\\f\\r "'=<>\`]+)`;
const ATTRIBUTE = `${SPACE}+(${ATTRIBUTE_NAME})(?:${SPACE}*=${SPACE}*${ATTRIBUTE_VALUE})?`;
const START_TAG = new RegExp(`^<([A-Za-z][A-Za-z0-9]*)((?:${ATTRIBUTE})*)${SPACE}*\\/?>`);
const END_TAG = new RegExp(`^<\\/([A-Za-z][A-Za-z0-9]*)${SPACE}*>`);
/** A comment that ends where it seems to: no `--` inside, so no `--!>` either. */
const COMMENT = /^<!--(?!-?>)(?:(?!--)[\s\S])*-->/;

const JS = { ecmaVersion: "latest", sourceType: "module" };

/**
 * A page's frontmatter and the body the site renders, read as Astro reads
 * them: the frontmatter blanked out where it was, and a Markdown page's body
 * trimmed. `line` counts the lines before the body, for messages.
 */
export function readPage(source, { mdx }) {
  const { frontmatter: data, content } = parseFrontmatter(source, { frontmatter: "empty-with-spaces" });
  if (mdx) return { data, body: content, line: 0 };
  const start = content.length - content.trimStart().length;
  return { data, body: content.trim(), line: content.slice(0, start).split("\n").length - 1 };
}

export function joinFrontmatter(data, body) {
  return `---\n${YAML.stringify(data, { lineWidth: 0 }).trimEnd()}\n---\n\n${body.replace(/^(?:[ \t]*\r?\n)+/, "").trimEnd()}\n`;
}

/** The page's syntax tree, as the site's build parses it. Throws when the page does not parse. */
export function parse(body, { mdx }) {
  return (mdx ? mdxToMdast : markdownToMdast)(body, { features: FEATURES });
}

function walk(node, visit) {
  visit(node);
  for (const child of node.children ?? []) walk(child, visit);
}

const isRecord = (value) => value !== null && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date);
const onlyKeys = (value, keys) => Object.keys(value).every((key) => keys.includes(key));

/** An address a page may use: a path on the site, or an http, https, mailto or tel URL. */
export function isSafeUrl(url) {
  // Browsers drop tabs and newlines inside a URL, and spaces and control characters around it.
  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(url.replace(/[\u0000-\u0020\u007f]/g, ""));
  return !scheme || SCHEMES.includes(scheme[1].toLowerCase());
}

const isScriptUrl = (value) => /^(javascript|vbscript):/i.test(value.replace(/[\u0000-\u0020\u007f]/g, ""));

/** A literal the page could have typed: strings, numbers, booleans, arrays and objects of them. */
function isPlainValue(node) {
  if (!node) return false;
  switch (node.type) {
    case "Literal":
      return true;
    case "TemplateLiteral":
      return node.expressions.length === 0;
    case "ArrayExpression":
      return node.elements.every((element) => element && isPlainValue(element));
    case "ObjectExpression":
      return node.properties.every(
        (property) =>
          property.type === "Property" && !property.computed && property.kind === "init" && !property.method && isPlainValue(property.value),
      );
    case "UnaryExpression":
      return (node.operator === "-" || node.operator === "+") && node.argument.type === "Literal" && typeof node.argument.value === "number";
    default:
      return false;
  }
}

/** True when an MDX expression is only a comment, `{/* … *\/}`. */
function isComment(source) {
  try {
    return parseScript(source, JS).body.length === 0;
  } catch {
    return false;
  }
}

/** The plain value an MDX expression holds, or `undefined` when it holds code. */
function plainValue(source) {
  try {
    const { body } = parseScript(`(${source}\n)`, JS);
    if (body.length === 1 && body[0].type === "ExpressionStatement" && isPlainValue(body[0].expression)) return body[0].expression;
  } catch {
    // Not JavaScript; the build would fail on it too.
  }
  return undefined;
}

/** What a plain value holds: `[key, string]` for each string, under the prop or object key it is in, and `[key]` for each object key. */
function contentsOf(name, node, out = []) {
  switch (node.type) {
    case "Literal":
      if (typeof node.value === "string") out.push([name, node.value]);
      break;
    case "TemplateLiteral":
      for (const quasi of node.quasis) out.push([name, quasi.value.cooked ?? quasi.value.raw]);
      break;
    case "ArrayExpression":
      for (const element of node.elements) contentsOf(name, element, out);
      break;
    case "ObjectExpression":
      for (const property of node.properties) {
        const key = property.key.name ?? String(property.key.value);
        out.push([key]);
        contentsOf(key, property.value, out);
      }
      break;
  }
  return out;
}

/** The first piece of raw HTML that is not text, a comment or an allowed tag; `undefined` when there is none. */
function unsafeHtml(html) {
  let rest = html;
  for (;;) {
    const at = rest.search(/<[A-Za-z!/?]/); // anything else after "<" is text to the browser
    if (at === -1) return undefined;
    rest = rest.slice(at);
    let token = COMMENT.exec(rest);
    if (!token) {
      token = END_TAG.exec(rest) ?? START_TAG.exec(rest);
      if (!token || !HTML_TAGS.has(token[1].toLowerCase())) return rest;
      for (const [, name] of (token[2] ?? "").matchAll(new RegExp(ATTRIBUTE, "g")))
        if (!HTML_ATTRIBUTES.has(name.toLowerCase())) return rest;
    }
    rest = rest.slice(token[0].length);
  }
}

const snippet = (text) => JSON.stringify(text.length > 40 ? `${text.slice(0, 40)}…` : text);

function checkImport(statement, at, components, errors) {
  if (statement.type !== "ImportDeclaration") {
    errors.push(`${at}: only imports are allowed, not "${statement.type}"`);
    return;
  }
  const from = statement.source.value;
  if (statement.attributes?.length) {
    errors.push(`${at}: may not import "${from}" with attributes`);
    return;
  }
  if (ALLOWED_IMPORTS.includes(from) && statement.specifiers.every((specifier) => specifier.type === "ImportSpecifier")) {
    for (const specifier of statement.specifiers) components.add(specifier.local.name);
    return;
  }
  const image = (from.startsWith("./") || from.startsWith("../")) && IMAGE.test(from);
  const defaultOnly = statement.specifiers.length === 1 && statement.specifiers[0].type === "ImportDefaultSpecifier";
  if (image && defaultOnly) return;
  errors.push(`${at}: may not import "${from}" (allowed: components by name from ${ALLOWED_IMPORTS.join(", ")}, or an image beside the page)`);
}

/** A prop of one of Starlight's components: a plain value, no handlers, no HTML, and safe addresses. */
function checkProp({ name, value }, at, errors) {
  if (!PROP_NAME.test(name) || FORBIDDEN_PROP.test(name)) {
    errors.push(`${at}: the attribute "${name}" is not allowed`);
    return;
  }
  if (value === null || value === undefined) return; // a boolean attribute
  let contents;
  if (typeof value === "string") contents = [[name, value]];
  else {
    const expression = plainValue(value.value);
    if (!expression) {
      errors.push(`${at} ${name}=: an expression must be a plain value; a page runs no code`);
      return;
    }
    contents = contentsOf(name, expression);
  }
  for (const [key, string] of contents) {
    if (string === undefined) {
      if (!PROP_NAME.test(key) || FORBIDDEN_PROP.test(key)) errors.push(`${at} ${name}=: the key "${key}" is not allowed`);
      continue;
    }
    if (string.includes("<")) errors.push(`${at} ${name}=: may not contain "<", which a component can render as HTML (show markup in a code block)`);
    const urls = /srcset$/i.test(key) ? string.split(",").map((candidate) => candidate.trim().split(/\s+/)[0]) : [string];
    if (URL_PROP.test(key) ? !urls.every(isSafeUrl) : isScriptUrl(string))
      errors.push(`${at} ${name}=: ${snippet(string)} is not an address a page may use (a path, or http, https, mailto or tel)`);
  }
}

function checkElement(node, at, components, errors) {
  if (node.name === null) return; // a fragment, <>…</>
  // MDX reads a lowercase name as an HTML tag and anything else as a component.
  const component = /^[A-Z]/.test(node.name) && components.has(node.name);
  if (!component && !HTML_TAGS.has(node.name)) {
    errors.push(
      /^[A-Z]/.test(node.name)
        ? `${at}: <${node.name}> is not a component the page imports from ${ALLOWED_IMPORTS.join(", ")}`
        : `${at}: <${node.name}> is not allowed in a page`,
    );
    return;
  }
  for (const attribute of node.attributes) {
    if (attribute.type !== "mdxJsxAttribute") errors.push(`${at}: spread attributes run code; write each attribute out`);
    else if (component) checkProp(attribute, `${at} <${node.name}>`, errors);
    else if (!HTML_ATTRIBUTES.has(attribute.name.toLowerCase()) || (attribute.value !== null && typeof attribute.value === "object"))
      errors.push(`${at}: <${node.name} ${attribute.name}> is not allowed; HTML tags take ${[...HTML_ATTRIBUTES].join(", ")} as plain text`);
  }
}

function checkFrontmatter(data, where, errors) {
  for (const key of Object.keys(data))
    if (!ALLOWED_FRONTMATTER.includes(key)) errors.push(`${where}: frontmatter field "${key}" is not allowed in a module`);
  if (typeof data.title !== "string" || data.title.trim() === "") errors.push(`${where}: needs a title`);
  if ("template" in data && !["doc", "splash"].includes(data.template)) errors.push(`${where}: template is "doc" or "splash"`);
  if ("editUrl" in data && typeof data.editUrl !== "boolean" && !(typeof data.editUrl === "string" && /^https:\/\//i.test(data.editUrl)))
    errors.push(`${where}: editUrl is false, or an https URL`);

  for (const key of ["prev", "next"]) {
    const value = data[key];
    if (value === undefined || typeof value === "boolean" || typeof value === "string") continue;
    if (!isRecord(value) || !onlyKeys(value, ["link", "label"]))
      errors.push(`${where}: ${key} is true, false, a label, or { link, label }`);
    else if ("link" in value && !(typeof value.link === "string" && isSafeUrl(value.link)))
      errors.push(`${where}: ${key}.link is a path, or an http or https URL`);
  }

  if ("sidebar" in data) {
    const { sidebar } = data;
    if (!isRecord(sidebar) || !onlyKeys(sidebar, ["label", "order", "hidden", "badge"]))
      errors.push(`${where}: sidebar takes label, order, hidden and badge`);
    else if ("badge" in sidebar && typeof sidebar.badge !== "string" && !(isRecord(sidebar.badge) && onlyKeys(sidebar.badge, ["text", "variant"])))
      errors.push(`${where}: sidebar.badge is a text, or { text, variant }`);
  }

  if (!("hero" in data)) return;
  const { hero } = data;
  if (!isRecord(hero) || !onlyKeys(hero, ["title", "tagline", "image", "actions"])) {
    errors.push(`${where}: hero takes title, tagline, image and actions`);
    return;
  }
  // Starlight writes the hero's title and tagline into the page as HTML, and
  // the page's title as the hero's when the hero has none.
  const texts = { "hero.title": hero.title, "hero.tagline": hero.tagline };
  if (!("title" in hero)) texts["the title, which is the hero's here,"] = data.title;
  for (const [field, value] of Object.entries(texts))
    if (value !== undefined && (typeof value !== "string" || value.includes("<")))
      errors.push(`${where}: ${field} is text without "<", as Starlight renders it as HTML`);
  const { image } = hero;
  if (image !== undefined) {
    const files = isRecord(image) && (onlyKeys(image, ["alt", "file"]) ? ["file"] : onlyKeys(image, ["alt", "dark", "light"]) ? ["dark", "light"] : null);
    if (!files || !files.every((key) => typeof image[key] === "string"))
      errors.push(`${where}: hero.image takes "file", or "dark" and "light"; raw HTML is not allowed`);
  }
  if (hero.actions === undefined) return;
  if (!Array.isArray(hero.actions)) {
    errors.push(`${where}: hero.actions is a list`);
    return;
  }
  hero.actions.forEach((action, index) => {
    const at = `${where}: hero.actions[${index}]`;
    if (!isRecord(action) || !onlyKeys(action, ["text", "link", "variant", "icon"])) errors.push(`${at} takes text, link, variant and icon`);
    else if (typeof action.link !== "string" || !isSafeUrl(action.link)) errors.push(`${at}.link is a path, or an http or https URL`);
    else if ("icon" in action && (typeof action.icon !== "string" || action.icon.includes("<")))
      errors.push(`${at}.icon is the name of one of Starlight's icons`);
  });
}

/**
 * The content rules. A page's text is the module's to write, but nothing in
 * it may run during the site's build or carry a script into the page.
 *
 * @returns {string[]} problems, each prefixed with `where` and a line number
 */
export function checkPage({ data, tree, where, line = 0 }) {
  const errors = [];
  checkFrontmatter(data, where, errors);
  const at = (node) => `${where}:${node.position ? node.position.start.line + line : "?"}`;

  // MDX hoists imports, so a page may use a component above its import.
  const components = new Set();
  for (const node of tree.children)
    if (node.type === "mdxjsEsm") {
      let program;
      try {
        program = parseScript(node.value, JS);
      } catch (error) {
        errors.push(`${at(node)}: does not parse (${error.message})`);
        continue;
      }
      for (const statement of program.body) checkImport(statement, at(node), components, errors);
    }

  walk(tree, (node) => {
    switch (node.type) {
      case "html": {
        const unsafe = unsafeHtml(node.value);
        if (unsafe !== undefined)
          errors.push(
            `${at(node)}: the HTML at ${snippet(unsafe)} is not allowed; a page's HTML is tags that format text, such as <b>, <br> and <details>, with no scripts, styles, links or images`,
          );
        break;
      }
      case "mdxFlowExpression":
      case "mdxTextExpression":
        if (!isComment(node.value) && !plainValue(node.value)) errors.push(`${at(node)}: an expression must be a plain value; a page runs no code`);
        break;
      case "mdxJsxFlowElement":
      case "mdxJsxTextElement":
        checkElement(node, at(node), components, errors);
        break;
      case "link":
      case "image":
      case "definition":
        if (!isSafeUrl(node.url)) errors.push(`${at(node)}: ${snippet(node.url)} is not an address a page may link to (a path, or http, https, mailto or tel)`);
        break;
    }
  });
  return errors;
}

/** Character ranges of code, which no rewrite may touch. */
function protectedRanges(tree) {
  const ranges = [];
  walk(tree, (node) => {
    if (["code", "inlineCode", "mdxjsEsm"].includes(node.type) && node.position)
      ranges.push([node.position.start.offset, node.position.end.offset]);
  });
  return ranges.sort((a, b) => a[0] - b[0]);
}

/**
 * Rewrites the destinations of links outside code: Markdown links and
 * definitions, and `href`, `link` and `src` attributes. `map` takes a URL and
 * returns its replacement, or `undefined` to leave it.
 */
export function rewriteLinks(body, tree, map) {
  const ranges = protectedRanges(tree);
  const patterns = [
    /(\]\(\s*<?)([^)\s>]+)/g, // [text](url) and ![alt](url)
    /^(\s{0,3}\[[^\]]+\]:\s*<?)(\S+?)(?=>?(\s|$))/gm, // [label]: url
    /(\b(?:href|link|src)\s*=\s*["'])([^"']+)/g, // href="url"
  ];
  const edits = [];
  for (const pattern of patterns)
    for (const match of body.matchAll(pattern)) {
      const start = match.index + match[1].length;
      const end = start + match[2].length;
      if (ranges.some(([from, to]) => start < to && end > from)) continue;
      const next = map(match[2]);
      if (next !== undefined && next !== match[2]) edits.push([start, end, next]);
    }
  edits.sort((a, b) => b[0] - a[0]);
  let out = body;
  for (const [start, end, next] of edits) out = out.slice(0, start) + next + out.slice(end);
  return out;
}

const plainText = (node) =>
  node.type === "text" || node.type === "inlineCode" ? node.value : (node.children ?? []).map(plainText).join("");

/**
 * For a page written without frontmatter (a README-style file): its first
 * `# Heading` becomes the title and leaves the body, where Starlight would
 * print it twice. The first paragraph becomes the description.
 */
export function deriveTitle(body, tree) {
  const first = tree.children.find((node) => node.type !== "html" || !/^<!--/.test(node.value));
  let title;
  let rest = body;
  if (first?.type === "heading" && first.depth === 1) {
    title = plainText(first).trim();
    rest = body.slice(0, first.position.start.offset) + body.slice(first.position.end.offset);
  }
  const paragraph = tree.children.find((node) => node.type === "paragraph");
  let description = paragraph ? plainText(paragraph).replace(/\s+/g, " ").trim() : undefined;
  if (description && description.length > 160) description = `${description.slice(0, 157).replace(/\s+\S*$/, "")}…`;
  return { title, description, body: rest };
}
