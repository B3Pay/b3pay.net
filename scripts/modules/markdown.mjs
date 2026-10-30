/**
 * What the site does to a module's Markdown and MDX pages: read the
 * frontmatter, check the page against the content rules, and rewrite the
 * module's own links to the address the site serves it at.
 *
 * Pages are parsed with the same micromark grammar MDX uses, so "outside a
 * code block" and "a JSX attribute" mean what the compiler will mean.
 */
import { fromMarkdown } from "mdast-util-from-markdown";
import { mdxFromMarkdown } from "mdast-util-mdx";
import { mdxjs } from "micromark-extension-mdxjs";
import YAML from "yaml";

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

const FORBIDDEN_TAGS = ["script", "iframe", "object", "embed", "style", "link", "meta", "base", "form", "frame", "frameset"];
const FORBIDDEN_HTML = new RegExp(`<\\s*(${FORBIDDEN_TAGS.join("|")})\\b`, "i");
const EVENT_HANDLER = /\son[a-z]+\s*=/i;
const SCRIPT_URL = /^\s*(javascript|vbscript|data:text\/html)/i;

export function splitFrontmatter(source) {
  const match = /^---\r?\n([\s\S]*?)\r?\n?---[ \t]*(?:\r?\n|$)/.exec(source);
  if (!match) return { data: {}, body: source };
  const data = YAML.parse(match[1]) ?? {};
  if (typeof data !== "object" || Array.isArray(data)) throw new Error("the frontmatter is not a mapping");
  return { data, body: source.slice(match[0].length) };
}

export function joinFrontmatter(data, body) {
  return `---\n${YAML.stringify(data, { lineWidth: 0 }).trimEnd()}\n---\n\n${body.replace(/^\s+/, "")}`;
}

export function parse(body, { mdx }) {
  return mdx
    ? fromMarkdown(body, { extensions: [mdxjs()], mdastExtensions: [mdxFromMarkdown()] })
    : fromMarkdown(body);
}

function walk(node, visit) {
  visit(node);
  for (const child of node.children ?? []) walk(child, visit);
}

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

function checkExpression(estree, at, errors) {
  const body = estree?.body ?? [];
  if (body.length === 0) return; // a comment, {/* ... */}
  if (body.length === 1 && body[0].type === "ExpressionStatement" && isPlainValue(body[0].expression)) return;
  errors.push(`${at}: an expression must be a plain value; a page runs no code`);
}

function checkImport(statement, at, errors) {
  if (statement.type !== "ImportDeclaration") {
    errors.push(`${at}: only imports are allowed, not "${statement.type}"`);
    return;
  }
  const from = statement.source.value;
  if (ALLOWED_IMPORTS.includes(from)) return;
  const image = (from.startsWith("./") || from.startsWith("../")) && IMAGE.test(from);
  const defaultOnly = statement.specifiers.length === 1 && statement.specifiers[0].type === "ImportDefaultSpecifier";
  if (image && defaultOnly) return;
  errors.push(`${at}: may not import "${from}" (allowed: ${ALLOWED_IMPORTS.join(", ")}, or an image beside the page)`);
}

/**
 * The content rules. A page's text is the module's to write, but nothing in
 * it may run during the site's build or carry a script into the page.
 *
 * @returns {string[]} problems, each prefixed with `where` and a line number
 */
export function checkPage({ data, tree, where }) {
  const errors = [];
  for (const key of Object.keys(data))
    if (!ALLOWED_FRONTMATTER.includes(key)) errors.push(`${where}: frontmatter field "${key}" is not allowed in a module`);
  if (typeof data.title !== "string" || data.title.trim() === "") errors.push(`${where}: needs a title`);
  if ("template" in data && !["doc", "splash"].includes(data.template)) errors.push(`${where}: template is "doc" or "splash"`);
  if (data.hero?.image && !("file" in data.hero.image || ("dark" in data.hero.image && "light" in data.hero.image)))
    errors.push(`${where}: hero.image takes "file", or "dark" and "light"; raw HTML is not allowed`);

  walk(tree, (node) => {
    const at = `${where}:${node.position?.start.line ?? "?"}`;
    switch (node.type) {
      case "html":
        if (FORBIDDEN_HTML.test(node.value) || EVENT_HANDLER.test(node.value) || /\b(href|src)\s*=\s*["']?\s*javascript:/i.test(node.value))
          errors.push(`${at}: scripts, frames, forms and event handlers are not allowed in a page`);
        break;
      case "mdxjsEsm":
        for (const statement of node.data?.estree?.body ?? []) checkImport(statement, at, errors);
        break;
      case "mdxFlowExpression":
      case "mdxTextExpression":
        checkExpression(node.data?.estree, at, errors);
        break;
      case "mdxJsxFlowElement":
      case "mdxJsxTextElement": {
        if (node.name && FORBIDDEN_TAGS.includes(node.name.toLowerCase()))
          errors.push(`${at}: <${node.name}> is not allowed in a page`);
        for (const attribute of node.attributes) {
          if (attribute.type === "mdxJsxExpressionAttribute") {
            errors.push(`${at}: spread attributes run code; write each attribute out`);
            continue;
          }
          if (/^on/i.test(attribute.name)) errors.push(`${at}: event handler "${attribute.name}" is not allowed`);
          const value = attribute.value;
          if (typeof value === "string" && SCRIPT_URL.test(value)) errors.push(`${at}: "${attribute.name}" may not be a script URL`);
          if (value && typeof value === "object") checkExpression(value.data?.estree, `${at} ${attribute.name}=`, errors);
        }
        break;
      }
      case "link":
      case "image":
      case "definition":
        if (SCRIPT_URL.test(node.url)) errors.push(`${at}: links may not be script URLs`);
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
