/**
 * The playground in the browser (./PlaygroundHero.astro). It takes a request
 * from the form, an example or the page address; reads the transaction from
 * the chain's public RPCs (./rpc.ts), or from the example itself; formats the
 * call with Sourcify's clear-signing library against the Clear Signing
 * registry on GitHub (./clear.ts); and shows the call as the wallet is asked
 * to sign it beside what a wallet that reads the registry shows, then what
 * the coverage tracker found for the contract (./contracts.ts).
 *
 * Everything from outside (the chain's answers, the registry's files and
 * what the library makes of them) is set as text, never as markup, after
 * ./abi.ts's cleanText. The only addresses built from it are explorer and
 * GitHub pages for checked hexadecimal and registry paths.
 */
import type { DisplayField, DisplayFieldGroup, DisplayModel, Warning } from "@ethereum-sourcify/clear-signing";
import { cleanText } from "./abi.ts";
import { addressUrl, chainById, CHAINS, txUrl, type PlaygroundChain } from "./chains.ts";
import {
  clearSign,
  fallbackReason,
  githubRegistry,
  LIBRARY_VERSION,
  registryFileUrl,
  type Library,
  type Registry,
} from "./clear.ts";
import { contractAnchor, contractKey, type PlaygroundContract, type PlaygroundContracts } from "./contracts.ts";
import { EXAMPLE_TOKENS, EXAMPLES } from "./examples.ts";
import {
  formatUnits,
  parseAddress,
  parseCalldata,
  parseChain,
  parseEther,
  parseHash,
  hashOf,
  requestFromHash,
  type Request,
} from "./input.ts";
import { createProvider } from "./provider.ts";
import { createRpc, getTransaction, RpcError } from "./rpc.ts";
import { calldataLines, contractTitle, day, ether, fileName, percent, plural, short } from "./view.ts";

const CONTRACTS_URL = "/clear-signing/playground/contracts.json";
const START = "/clear-signing/#start";

/** A failure the page can name, in words a person can act on. */
class Failure extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Failure";
  }
}

/** A rejection handler that keeps a failure the page can already name, and names any other with `message`. */
const because = (message: string) => (error: unknown) => {
  console.error(error);
  throw error instanceof Failure || error instanceof RpcError ? error : new Failure(message);
};

// ── What is fetched once and kept ───────────────────────────────────────

const rpc = createRpc();
const provider = createProvider(rpc, EXAMPLE_TOKENS);

let library: Promise<Library> | undefined;
let registry: Promise<Registry> | undefined;
let tracker: Promise<PlaygroundContracts | null> | undefined;

/** The library, loaded on the first call the page formats; tried again after a failure. */
function loadLibrary(): Promise<Library> {
  library ??= import("@ethereum-sourcify/clear-signing").catch((error: unknown) => {
    library = undefined;
    return because("The clear-signing library did not load. Check your connection and try again.")(error);
  });
  return library;
}

/** The registry's index from GitHub, with each file read when a call needs it. */
function loadRegistry(lib: Library): Promise<Registry> {
  registry ??= githubRegistry(lib).catch((error: unknown) => {
    registry = undefined;
    return because("GitHub did not answer with the Clear Signing registry. Try again in a moment.")(error);
  });
  return registry;
}

/** What the coverage tracker found, or null when it did not load: the page goes on without it. */
function loadTracker(): Promise<PlaygroundContracts | null> {
  tracker ??= fetch(CONTRACTS_URL)
    .then((response) => (response.ok ? (response.json() as Promise<PlaygroundContracts>) : null))
    .catch(() => null)
    .then((contracts) => {
      if (!contracts) tracker = undefined;
      return contracts;
    });
  return tracker;
}

// ── Building the page ───────────────────────────────────────────────────

type Child = Node | string | null | undefined | false | readonly Child[];

/** An element with attributes and children; strings become text, never markup. */
function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attributes: Readonly<Record<string, string | undefined>> | null,
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [name, value] of Object.entries(attributes ?? {})) if (value !== undefined) node.setAttribute(name, value);
  const add = (child: Child) => {
    if (child === null || child === undefined || child === false) return;
    if (Array.isArray(child)) (child as readonly Child[]).forEach(add);
    else node.append(child as Node | string);
  };
  children.forEach(add);
  return node;
}

const link = (href: string, ...children: Child[]) => h("a", { href }, ...children);
const code = (text: string) => h("code", null, text);
const clean = (text: string) => cleanText(text);

/** One fact, as a term and its description. */
const fact = (term: string, ...description: Child[]) => h("div", null, h("dt", null, term), h("dd", null, ...description));

// ── The result ──────────────────────────────────────────────────────────

/** The call the playground formats. */
interface Call {
  readonly hash: string | null;
  readonly from: string | null;
  readonly to: string;
  readonly data: string;
  readonly value: bigint;
}

interface Outcome {
  readonly request: Request;
  readonly chain: PlaygroundChain;
  readonly call: Call;
  /** What the registry's descriptor makes of the call; null for a plain transfer, which needs none. */
  readonly display: DisplayModel | null;
  /** The registry file the index names for this deployment, if any. */
  readonly path: string | null;
  /** For a near miss: the call formatted with the descriptor the registry has for another deployment. */
  readonly near: DisplayModel | null;
  readonly tracked: PlaygroundContracts | null;
  readonly contract: PlaygroundContract | null;
}

const BADGES = new Set(["covered", "partial", "uncovered", "draft"]);

/**
 * Notes the page leaves out. The playground resolves no names (no ENS, no
 * address book), so the library notes every address it could not name; the
 * address itself is shown, as a wallet without names shows it.
 */
const QUIET = new Set(["UNKNOWN_ADDRESS"]);
const heard = (warning: Warning | undefined): warning is Warning => warning !== undefined && !QUIET.has(warning.code);

const ADDRESS = /^0x[0-9a-f]{40}$/i;

const titleOf = (contract: PlaygroundContract) => contractTitle(contract.protocol.name, contract.label);

/** Where the registry describes a near miss: the same address on another chain, or another contract, as the coverage card writes it. */
const elsewhereName = (elsewhere: NonNullable<PlaygroundContract["elsewhere"]>): Child =>
  elsewhere.sameAddress ? "the same address" : [`${elsewhere.label} at `, code(short(elsewhere.address))];

function setUp(root: HTMLElement): void {
  const form = root.querySelector<HTMLFormElement>("[data-pg-form]");
  const result = root.querySelector<HTMLElement>("[data-pg-result]");
  const status = root.querySelector<HTMLElement>("[data-pg-status]");
  const errorBox = root.querySelector<HTMLElement>("[data-pg-error]");
  const submit = form?.querySelector<HTMLButtonElement>('button[type="submit"]');
  const chainSelect = form?.querySelector<HTMLSelectElement>('select[name="chain"]');
  const txInput = form?.querySelector<HTMLInputElement>('input[name="tx"]');
  const toInput = form?.querySelector<HTMLInputElement>('input[name="to"]');
  const dataInput = form?.querySelector<HTMLTextAreaElement>('textarea[name="data"]');
  const ethInput = form?.querySelector<HTMLInputElement>('input[name="eth"]');
  if (!form || !result || !status || !errorBox || !submit || !chainSelect || !txInput || !toInput || !dataInput || !ethInput)
    return;
  const kinds = [...form.querySelectorAll<HTMLInputElement>('input[name="kind"]')];
  const groups = [...form.querySelectorAll<HTMLElement>("[data-when]")];

  // ── The form ──────────────────────────────────────────────────────────

  const kind = () => (kinds.find((input) => input.checked)?.value === "call" ? "call" : "hash");

  /** Shows the inputs for a hash or for a call; the others are switched off, so they are not sent. */
  function showKind(next: "hash" | "call") {
    for (const input of kinds) input.checked = input.value === next;
    for (const group of groups) {
      const on = group.dataset.when === next;
      group.hidden = !on;
      for (const control of group.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea"))
        control.disabled = !on;
    }
  }

  function fill(request: Request) {
    chainSelect!.value = String(request.chainId);
    showKind(request.kind);
    if (request.kind === "hash") txInput!.value = request.hash;
    else {
      toInput!.value = request.to;
      dataInput!.value = request.data;
      ethInput!.value = request.value ? formatUnits(request.value, 18) : "";
    }
  }

  function read(): { readonly request: Request } | { readonly error: string; readonly control: HTMLElement } {
    const chain = parseChain(chainSelect!.value);
    if (!chain.ok) return { error: chain.error, control: chainSelect! };
    if (kind() === "hash") {
      const hash = parseHash(txInput!.value);
      return hash.ok
        ? { request: { kind: "hash", chainId: chain.value, hash: hash.value } }
        : { error: hash.error, control: txInput! };
    }
    const to = parseAddress(toInput!.value);
    if (!to.ok) return { error: to.error, control: toInput! };
    const data = parseCalldata(dataInput!.value);
    if (!data.ok) return { error: data.error, control: dataInput! };
    const value = parseEther(ethInput!.value);
    if (!value.ok) return { error: value.error, control: ethInput! };
    return { request: { kind: "call", chainId: chain.value, to: to.value, data: data.value, value: value.value } };
  }

  function showError(message: string, control?: HTMLElement) {
    errorBox!.textContent = message;
    errorBox!.hidden = false;
    if (control) {
      control.setAttribute("aria-invalid", "true");
      control.setAttribute("aria-describedby", errorBox!.id);
      control.focus();
    }
  }

  function clearError() {
    errorBox!.hidden = true;
    errorBox!.textContent = "";
    for (const control of form!.querySelectorAll("[aria-invalid]")) {
      control.removeAttribute("aria-invalid");
      control.removeAttribute("aria-describedby");
    }
  }

  for (const input of kinds) input.addEventListener("change", () => (clearError(), showKind(kind())));
  form.addEventListener("input", clearError);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearError();
    const got = read();
    if ("error" in got) return showError(got.error, got.control);
    go(got.request);
  });

  /**
   * Puts the request in the page address's fragment, so it can be shared and
   * the back button returns to it; the change runs it. A call too long for
   * the address runs as it is, and the address loses the last request.
   */
  function go(request: Request) {
    const fragment = hashOf(request);
    if (fragment && fragment !== location.hash) {
      location.hash = fragment;
      return;
    }
    if (!fragment && location.hash) history.replaceState(null, "", `${location.pathname}${location.search}`);
    void run(request, true);
  }

  // An example, a link someone shared, the back button: whatever puts a request in the fragment runs it.
  // A fragment that names no request is an anchor on the page, and leaves the result as it is.
  addEventListener("hashchange", () => {
    const parsed = requestFromHash(location.hash);
    if (!parsed && location.hash) return;
    clearError();
    if (parsed?.ok) {
      fill(parsed.value);
      void run(parsed.value, true);
    } else {
      current += 1;
      busy(false);
      result!.hidden = true;
      result!.replaceChildren();
      if (parsed) showError(parsed.error);
    }
  });

  // ── Running a request ────────────────────────────────────────────────

  let current = 0;

  function busy(on: boolean) {
    submit!.disabled = on;
    root.toggleAttribute("data-busy", on);
    if (!on) status!.textContent = "";
  }

  const say = (text: string) => (status!.textContent = text);

  async function run(request: Request, chosen: boolean) {
    const id = (current += 1);
    const live = () => id === current;
    const chain = chainById(request.chainId)!;
    busy(true);
    try {
      // What does not depend on the transaction starts at once.
      const lib = loadLibrary();
      const reg = lib.then(loadRegistry);
      const known = loadTracker();
      lib.catch(() => undefined);
      reg.catch(() => undefined);

      let call: Call | null;
      if (request.kind === "call") {
        call = { hash: null, from: null, to: request.to, data: request.data, value: request.value };
      } else {
        const example = EXAMPLES.find((item) => item.chainId === request.chainId && item.hash === request.hash);
        if (example) {
          call = { hash: example.hash, from: example.from, to: example.to, data: example.data, value: BigInt(example.value) };
        } else {
          say(`Reading the transaction from ${chain.name}…`);
          const tx = await getTransaction(rpc, request.chainId, request.hash).catch(
            because(`None of ${chain.name}'s public RPCs answered. Try again in a moment.`),
          );
          if (!live()) return;
          if (!tx) return show(missing(request), chosen);
          if (tx.to === null)
            return show(note("This transaction creates a contract, so there is no call to a contract to clear-sign."), chosen);
          call = { hash: tx.hash, from: tx.from, to: tx.to, data: tx.input, value: tx.value };
        }
      }

      say("Reading the Clear Signing registry from GitHub…");
      const [libraryReady, registryReady, tracked] = await Promise.all([lib, reg, known]);
      if (!live()) return;
      const contract = tracked?.contracts[contractKey(chain.id, call.to)] ?? null;
      const path = registryReady.index.calldataIndex[`eip155:${chain.id}:${call.to.toLowerCase()}`] ?? null;

      let display: DisplayModel | null = null;
      let near: DisplayModel | null = null;
      if (call.data !== "0x") {
        say("Formatting the call…");
        const input = { chainId: chain.id, to: call.to, data: call.data, value: call.value, ...(call.from ? { from: call.from } : {}) };
        display = await clearSign(libraryReady, registryReady, provider, input).catch(
          because("The library could not format this call. Try again in a moment."),
        );
        if (fallbackReason(display) && contract?.elsewhere) {
          near = await clearSign(libraryReady, registryReady, provider, input, {
            chainId: chain.id,
            address: call.to,
            path: contract.elsewhere.path,
          }).catch(() => null);
        }
      }
      if (!live()) return;
      show(outcome({ request, chain, call, display, path, near, tracked, contract }), chosen);
    } catch (error) {
      if (!live()) return;
      show(
        failure(error instanceof Failure || error instanceof RpcError ? clean(error.message) : "Something went wrong. Try again.", request),
        chosen,
      );
    } finally {
      if (live()) busy(false);
    }
  }

  /**
   * Draws the result and brings it into view when it starts below the middle
   * of the window. Focus moves to it only when a person asked for it here,
   * not when the page opens on a shared link.
   */
  function show(content: Node, chosen: boolean) {
    result!.replaceChildren(content);
    result!.hidden = false;
    const top = result!.getBoundingClientRect().top;
    if (top > innerHeight * 0.5 || top < 0)
      result!.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    if (chosen) result!.querySelector<HTMLElement>("[data-pg-focus]")?.focus({ preventScroll: true });
  }

  // ── What is drawn ────────────────────────────────────────────────────

  function badge(kind: string): Node | null {
    if (!BADGES.has(kind)) return null;
    const template = root.querySelector<HTMLTemplateElement>(`template[data-badge="${kind}"]`);
    return template ? template.content.cloneNode(true) : null;
  }

  function note(text: string): HTMLElement {
    return h("div", { class: "pg-message" }, h("p", { tabindex: "-1", "data-pg-focus": "" }, text));
  }

  function failure(message: string, request: Request): HTMLElement {
    const retry = h("button", { type: "button", class: "pg-chip" }, "Try again");
    retry.addEventListener("click", () => void run(request, true));
    return h("div", { class: "pg-message pg-failure" }, h("p", { tabindex: "-1", "data-pg-focus": "" }, message), retry);
  }

  function missing(request: Extract<Request, { kind: "hash" }>): HTMLElement {
    const chain = chainById(request.chainId)!;
    const others = CHAINS.filter((other) => other.id !== chain.id).map((other) => {
      const button = h("button", { type: "button", class: "pg-chip" }, `Look on ${other.name}`);
      button.addEventListener("click", () => go({ ...request, chainId: other.id }));
      return button;
    });
    return h(
      "div",
      { class: "pg-message" },
      h("p", { tabindex: "-1", "data-pg-focus": "" }, `${chain.name} has no transaction with this hash. It may be on another chain.`),
      h("div", { class: "pg-chips" }, others),
    );
  }

  function outcome(o: Outcome): HTMLElement {
    return h(
      "div",
      { class: "pg-outcome" },
      head(o),
      h("div", { class: "pg-panes" }, rawPane(o), clearPane(o)),
      trackerPanel(o),
    );
  }

  function head({ request, chain, call, contract }: Outcome): HTMLElement {
    const title = contract ? titleOf(contract) : `Contract ${short(call.to)}`;
    const share = hashOf(request) && navigator.clipboard ? shareButton() : null;
    return h(
      "header",
      { class: "pg-head" },
      h(
        "div",
        null,
        h(
          "p",
          { class: "pg-kicker" },
          chain.name,
          call.hash ? [" · transaction ", link(txUrl(chain, call.hash), code(short(call.hash)))] : " · a call you pasted",
        ),
        h("h2", { tabindex: "-1", "data-pg-focus": "" }, title),
      ),
      share,
    );
  }

  function shareButton(): HTMLElement {
    const button = h("button", { type: "button", class: "pg-chip" }, "Copy link");
    let timer: ReturnType<typeof setTimeout> | undefined;
    button.addEventListener("click", () => {
      navigator.clipboard.writeText(location.href).then(
        () => (button.textContent = "Link copied"),
        () => (button.textContent = "Copy it from the address bar"),
      );
      clearTimeout(timer);
      timer = setTimeout(() => (button.textContent = "Copy link"), 2500);
    });
    return button;
  }

  /** The call as the wallet is asked to sign it: the contract, the value and the calldata. */
  function rawPane({ chain, call, contract }: Outcome): HTMLElement {
    const bytes = (call.data.length - 2) / 2;
    const selector = bytes >= 4 ? call.data.slice(0, 10) : null;
    const signature = selector ? contract?.functions[selector] : undefined;
    return h(
      "section",
      { class: "pg-pane pg-raw", "aria-labelledby": "pg-raw-title" },
      h("p", { class: "pg-pane-kicker" }, "Without a descriptor"),
      h("h3", { id: "pg-raw-title" }, "What the wallet is asked to sign"),
      h(
        "dl",
        { class: "pg-facts" },
        fact("To", link(addressUrl(chain, call.to), code(call.to))),
        fact("Value", ether(call.value)),
        selector
          ? fact("Function", code(selector), signature ? h("span", { class: "pg-signature" }, signature) : null)
          : fact("Calldata", "None: a plain transfer"),
      ),
      bytes > 0 &&
        h(
          "figure",
          { class: "pg-calldata" },
          h("figcaption", null, `Calldata, ${plural(bytes, "byte")}, in 32-byte words`),
          h("pre", { tabindex: "0" }, code(calldataLines(call.data).join("\n"))),
        ),
    );
  }

  /** What a wallet that reads the registry shows for the call. */
  function clearPane(o: Outcome): HTMLElement {
    const { chain, call, display, path } = o;
    const pane = (...children: Child[]) =>
      h(
        "section",
        { class: "pg-pane pg-clear", "aria-labelledby": "pg-clear-title" },
        h("p", { class: "pg-pane-kicker" }, "With the Clear Signing registry"),
        h("h3", { id: "pg-clear-title" }, "What a wallet shows you"),
        ...children,
      );

    if (!display)
      return pane(
        h(
          "figure",
          { class: "pg-screen" },
          screenHead("No descriptor needed", "plain"),
          h("p", { class: "pg-where" }, chain.name),
          h("p", { class: "pg-intent" }, `Send ${ether(call.value)}`),
          h("dl", { class: "pg-fields" }, fact("To", code(call.to))),
        ),
        h("p", { class: "pg-fine" }, "A plain transfer carries no calldata, so every wallet shows it as it is."),
      );

    const reason = fallbackReason(display);
    if (!reason)
      return pane(
        screen(display, where(chain, display), "Registry descriptor", "registry"),
        warnings(display.warnings ?? []),
        h(
          "p",
          { class: "pg-fine" },
          "Formatted with ",
          path ? link(registryFileUrl(path), code(fileName(path))) : "the registry's descriptor",
          ` from the registry on GitHub as it is now, by Sourcify's clear-signing library ${LIBRARY_VERSION}. `,
          "Attestations are not checked here: a wallet may show only a descriptor an auditor has attested.",
        ),
      );

    const selector = display.rawCalldataFallback?.selector ?? call.data.slice(0, 10);
    const words = display.rawCalldataFallback?.args.length ?? Math.ceil((call.data.length - 10) / 64);
    const why = {
      "no-descriptor": `The registry has no descriptor for this contract on ${chain.name}, so a wallet can show only the raw call.`,
      "no-format": `The registry's descriptor for this contract does not format the function ${selector}, so a wallet can show only the raw call.`,
      "fetch-error": "The registry lists a descriptor for this contract, but it could not be read from GitHub. Try again in a moment.",
      other: "The library could not format this call with the registry's descriptor, so a wallet can show only the raw call.",
    }[reason];
    const skip = new Set(["NO_DESCRIPTOR", "NO_FORMAT_MATCH"]);
    return pane(
      h(
        "figure",
        { class: "pg-screen pg-blind" },
        screenHead("No descriptor", "none"),
        h("p", { class: "pg-where" }, `${chain.name} · ${short(call.to)}`),
        h("p", { class: "pg-intent" }, "Contract interaction"),
        h("dl", { class: "pg-fields" }, fact("Function", code(selector)), fact("Data", plural(words, "word"), " of raw data")),
      ),
      h("p", { class: "pg-why" }, why),
      reason === "no-format" && path ? h("p", { class: "pg-fine" }, "Descriptor: ", link(registryFileUrl(path), code(fileName(path)))) : null,
      warnings((display.warnings ?? []).filter((warning) => !skip.has(warning.code))),
    );
  }

  /** The descriptor's owner and contract name, as a wallet shows where a call goes. */
  function where(chain: PlaygroundChain, display: DisplayModel): string {
    const { owner, contractName } = display.metadata ?? {};
    return [chain.name, owner, contractName && contractName !== owner ? contractName : undefined]
      .filter((part): part is string => Boolean(part))
      .map(clean)
      .join(" · ");
  }

  function screenHead(tag: string, kind: string): HTMLElement {
    return h(
      "div",
      { class: "pg-screen-head" },
      h("span", { class: "pg-who" }, "Signature request"),
      h("span", { class: `pg-tag pg-tag-${kind}` }, tag),
    );
  }

  function screen(display: DisplayModel, whereText: string, tag: string, kind: string): HTMLElement {
    return h("figure", { class: "pg-screen" }, screenHead(tag, kind), h("p", { class: "pg-where" }, whereText), body(display, 0));
  }

  /** The intent and the fields of a formatted call; an inner call is drawn inside, two levels deep at most. */
  function body(display: DisplayModel, depth: number): Child[] {
    const intent = display.interpolatedIntent ?? (typeof display.intent === "string" ? display.intent : undefined);
    const pairs = display.intent && typeof display.intent === "object" ? Object.entries(display.intent) : [];
    return [
      intent ? h("p", { class: "pg-intent" }, clean(intent)) : null,
      pairs.length > 0 && h("dl", { class: "pg-fields pg-intent-list" }, pairs.map(([key, value]) => fact(clean(key), clean(value)))),
      fields(display.fields ?? [], depth),
    ];
  }

  function fields(items: readonly (DisplayField | DisplayFieldGroup)[], depth: number): Child[] {
    const out: Child[] = [];
    let list: HTMLElement | null = null;
    for (const item of items) {
      if ("fields" in item) {
        list = null;
        out.push(
          h(
            "div",
            { class: "pg-group" },
            item.label ? h("p", { class: "pg-group-label" }, clean(item.label)) : null,
            h("dl", { class: "pg-fields" }, item.fields.map((field) => row(field, depth))),
            heard(item.warning) ? warningLine(item.warning) : null,
          ),
        );
      } else {
        if (!list) out.push((list = h("dl", { class: "pg-fields" })));
        list.append(row(item, depth));
      }
    }
    return out;
  }

  function row(field: DisplayField, depth: number): HTMLElement {
    const inner = field.embeddedCalldata;
    const value: Child =
      inner && depth < 2 && !fallbackReason(inner.display)
        ? h(
            "div",
            { class: "pg-inner" },
            h("p", { class: "pg-where" }, inner.callee ? `Calls ${clean(inner.callee)}` : "An inner call"),
            body(inner.display, depth + 1),
          )
        : inner
          ? [inner.callee ? `A call to ${short(clean(inner.callee))}, ` : "An inner call, ", "shown raw: ", code(short(clean(field.value)))]
          : ADDRESS.test(field.value)
            ? code(field.value)
            : clean(field.value);
    const raw =
      field.rawAddress && field.rawAddress.toLowerCase() !== field.value.toLowerCase()
        ? h("span", { class: "pg-raw-address" }, code(clean(field.rawAddress)))
        : null;
    return h(
      "div",
      null,
      h("dt", null, field.separator ? h("span", { class: "pg-separator" }, clean(field.separator)) : null, clean(field.label)),
      h("dd", null, value, raw, heard(field.warning) ? warningLine(field.warning) : null),
    );
  }

  function warningLine(warning: Warning): HTMLElement {
    return h("span", { class: "pg-warning" }, code(warning.code), " ", clean(warning.message));
  }

  function warnings(list: readonly Warning[]): HTMLElement | null {
    const seen = new Set<string>();
    const unique = list.filter(
      (warning) => heard(warning) && !seen.has(warning.code + warning.message) && seen.add(warning.code + warning.message),
    );
    return unique.length
      ? h(
          "div",
          { class: "pg-warnings" },
          h("p", null, "The library's notes"),
          h("ul", null, unique.map((warning) => h("li", null, warningLine(warning)))),
        )
      : null;
  }

  /** What the coverage tracker found for the contract, with the near miss and B3Pay's draft. */
  function trackerPanel(o: Outcome): HTMLElement {
    const { tracked, contract, chain, call, display } = o;
    if (!tracked)
      return h(
        "aside",
        { class: "pg-tracker" },
        h("p", null, "The coverage tracker's data did not load, so this contract's coverage is not shown. Try again in a moment."),
      );
    if (!contract)
      return h(
        "aside",
        { class: "pg-tracker" },
        h("div", { class: "pg-tracker-head" }, h("p", { class: "pg-eyebrow" }, "Not in the coverage tracker")),
        h(
          "p",
          null,
          "The ",
          link("/clear-signing/coverage/", "coverage tracker"),
          " follows the most-used contracts on Ethereum, Base, Arbitrum One and OP Mainnet, and this one is not among them.",
          display && fallbackReason(display) ? [" Is it your protocol's? ", link(START, "We can write and test its descriptor"), "."] : null,
        ),
      );

    const when = day(tracked.generatedAt);
    const page = `/clear-signing/coverage/${encodeURIComponent(contract.protocol.id)}/#${contractAnchor(chain.id, call.to)}`;
    const reason = display ? fallbackReason(display) : null;
    const reach = contract.reach;
    const measured = reach
      ? `On ${when}, the registry's descriptor for it formatted ${percent(reach.share)} of ${reach.by === "senders" ? "what its recent senders called" : "its recent transactions"}.`
      : null;
    const found: Child = {
      covered: measured ?? `On ${when}, the tracker counted it as covered.`,
      partial: measured ?? `On ${when}, the tracker counted it as partly covered: how much of its calls the descriptor formats could not be measured.`,
      uncovered: contract.elsewhere
        ? [
            `On ${when}, the registry had no descriptor for this deployment, but it had one for `,
            elsewhereName(contract.elsewhere),
            ` on ${contract.elsewhere.chainName}.`,
          ]
        : `On ${when}, the registry had no descriptor for it.`,
    }[contract.status];
    const changed =
      display && contract.status === "uncovered" && !reason
        ? `The registry has a descriptor for it now: one was added after the tracker last read it.`
        : contract.status !== "uncovered" && reason === "no-descriptor"
          ? "The registry on GitHub has no descriptor for it now."
          : null;

    return h(
      "aside",
      { class: "pg-tracker" },
      h(
        "div",
        { class: "pg-tracker-head" },
        h("p", { class: "pg-eyebrow" }, "In the coverage tracker"),
        h("span", { class: "pg-badges" }, badge(contract.status), contract.draft ? badge("draft") : null),
      ),
      h(
        "p",
        { class: "pg-found" },
        h("strong", null, `${titleOf(contract)}. `),
        found,
        changed ? ` ${changed}` : null,
        " ",
        link(page, "See this contract in the tracker"),
        ".",
      ),
      nearMiss(o),
      draft(o),
    );
  }

  function nearMiss({ contract, near, chain }: Outcome): HTMLElement | null {
    const elsewhere = contract?.elsewhere;
    if (!elsewhere || !near) return null;
    const file = link(registryFileUrl(elsewhere.path), code(fileName(elsewhere.path)));
    const formatted = !fallbackReason(near);
    return h(
      "div",
      { class: "pg-near" },
      h("h3", null, "If the registry listed this deployment"),
      formatted
        ? [
            h(
              "p",
              null,
              "The registry describes ",
              h("strong", null, elsewhereName(elsewhere)),
              ` on ${elsewhere.chainName} with `,
              file,
              ". Listed for this contract too, it would show this call as:",
            ),
            screen(near, where(chain, near), "Preview", "preview"),
            h(
              "p",
              { class: "pg-fine" },
              "A preview, not what a wallet shows today: the descriptor does not list this deployment, and whether it fits is for the protocol to check.",
            ),
          ]
        : h(
            "p",
            null,
            "The registry's descriptor for ",
            h("strong", null, elsewhereName(elsewhere)),
            ` on ${elsewhere.chainName}, `,
            file,
            ", does not format this call either.",
          ),
    );
  }

  function draft({ contract, chain, call }: Outcome): HTMLElement | null {
    if (!contract?.draft) return null;
    const preview = contract.draft.preview;
    const same = preview !== null && preview.txHash.toLowerCase() === call.hash?.toLowerCase();
    return h(
      "div",
      { class: "pg-draft" },
      h("h3", null, "B3Pay has a draft for this contract"),
      preview
        ? [
            h("p", null, same ? "With it, a wallet would show this very transaction as:" : "With it, a wallet would show one of its recent calls as:"),
            h(
              "figure",
              { class: "pg-screen" },
              screenHead("B3Pay draft", "draft"),
              h("p", { class: "pg-where" }, `${chain.name} · ${contract.label}`),
              h("p", { class: "pg-intent" }, preview.intent),
              h(
                "dl",
                { class: "pg-fields" },
                preview.fields.map(({ label, value }) => fact(label, ADDRESS.test(value) ? code(value) : value)),
              ),
              h("figcaption", { class: "pg-from" }, "from transaction ", link(txUrl(chain, preview.txHash), code(short(preview.txHash)))),
            ),
          ]
        : null,
      h(
        "p",
        { class: "pg-fine" },
        "The draft is not in the registry. Every function it formats has a test built from a real transaction, and the full draft is on request.",
      ),
      h("a", { class: "pg-button", href: START }, "Get this descriptor"),
    );
  }

  // ── Ready ────────────────────────────────────────────────────────────

  // The form works now: what the markup switched off until this script ran comes on.
  for (const input of kinds) input.disabled = false;
  submit.disabled = false;
  showKind(kind());
  root.dataset.ready = "";
  const initial = requestFromHash(location.hash);
  if (initial?.ok) {
    fill(initial.value);
    void run(initial.value, false);
  } else if (initial) showError(initial.error);
}

const root = document.querySelector<HTMLElement>("[data-pg]");
if (root) setUp(root);
