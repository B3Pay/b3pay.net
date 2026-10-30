import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

/**
 * POST /api/contact/ (vercel.json sends every path without its trailing
 * slash to the one with it, so the form posts there directly).
 *
 * The prototype's form called `setSent(true)` and dropped the submission. This
 * delivers it, or fails loudly — it never reports success it did not achieve.
 *
 * Required environment variables (Vercel > Settings > Environment Variables):
 *   RESEND_API_KEY     — https://resend.com/api-keys
 *   CONTACT_TO_EMAIL   — where submissions land
 *   CONTACT_FROM_EMAIL — a verified sender on the Resend domain,
 *                        e.g. "B3Pay site <site@b3pay.net>"
 *
 * With any of them missing the endpoint returns 503 and the form shows an
 * error, which is the correct behaviour: nothing is silently discarded.
 */

/** Must match the labels in src/components/site/ContactForm.astro (scripts/contact-form.test.mjs checks). */
const TOPICS = [
  "Clear Signing descriptors",
  "Toolkit or MCP server",
  "B3Forge",
  "Internet Computer products",
  "Something else",
] as const;

const MAX = { name: 120, email: 200, organization: 120, contracts: 2000, message: 5000 };

/**
 * Origin allowlist. A browser sends `Origin` on every POST, and this endpoint
 * answers no CORS preflight, so a request carrying none — or a foreign one —
 * did not come from the site's own form. A determined bot can forge the
 * header; this only turns away the ones that do not bother.
 */
const ALLOWED_HOSTS = new Set(["b3pay.net", "www.b3pay.net"]);

function originAllowed(origin: string | undefined): boolean {
  if (!origin) return false;
  let hostname: string;
  try {
    ({ hostname } = new URL(origin));
  } catch {
    return false;
  }
  if (ALLOWED_HOSTS.has(hostname)) return true;
  // Preview deployments post from <project>-<hash>.vercel.app.
  if (hostname.endsWith(".vercel.app")) return true;
  // `vercel dev` against a local build — never accepted in production.
  if (process.env.VERCEL_ENV !== "production")
    return hostname === "localhost" || hostname === "127.0.0.1";
  return false;
}

interface Payload {
  name: string;
  email: string;
  organization: string;
  topic: string;
  contracts: string;
  message: string;
}

function validate(body: unknown): { ok: true; value: Payload } | { ok: false; error: string } {
  if (typeof body !== "object" || body === null) return { ok: false, error: "Expected a JSON object." };
  const b = body as Record<string, unknown>;

  const text = (key: string) => (typeof b[key] === "string" ? (b[key] as string).trim() : "");
  const name = text("name");
  const email = text("email");
  const organization = text("organization");
  const contracts = text("contracts");
  const message = text("message");
  const topic = text("topic");

  if (name.length < 1 || name.length > MAX.name) return { ok: false, error: "A name is required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > MAX.email)
    return { ok: false, error: "A valid email address is required." };
  if (organization.length > MAX.organization)
    return { ok: false, error: `The protocol or company name is longer than ${MAX.organization} characters.` };
  if (contracts.length > MAX.contracts)
    return { ok: false, error: `The contracts list is longer than ${MAX.contracts} characters.` };
  if (message.length < 10 || message.length > MAX.message)
    return { ok: false, error: "A message of at least 10 characters is required." };

  return {
    ok: true,
    value: {
      name,
      email,
      organization,
      contracts,
      message,
      topic: (TOPICS as readonly string[]).includes(topic) ? topic : TOPICS[TOPICS.length - 1],
    },
  };
}

/** Header injection guard — a name or subject may not carry line breaks. */
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const origin = typeof req.headers.origin === "string" ? req.headers.origin : undefined;
  if (!originAllowed(origin)) {
    console.warn(`contact: rejected origin ${origin ?? "(none)"}`);
    return res
      .status(403)
      .json({ error: "This endpoint only accepts submissions from b3pay.net." });
  }

  // Honeypot. `website` sits off-screen, unfocusable and hidden from assistive
  // technology, so a person never fills it — a bot filling every input it can
  // parse does. Answer 200 so the sender learns nothing, and log it: the
  // submission is dropped here, but it is not dropped quietly.
  const raw =
    typeof req.body === "object" && req.body !== null
      ? (req.body as Record<string, unknown>)
      : {};
  if (typeof raw.website === "string" && raw.website.trim() !== "") {
    console.warn("contact: honeypot tripped, submission discarded");
    return res.status(200).json({ ok: true });
  }

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    console.error(
      "contact: missing env — RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL are all required",
    );
    return res
      .status(503)
      .json({ error: "The contact endpoint is not configured yet." });
  }

  const parsed = validate(req.body);
  if (!parsed.ok) return res.status(400).json({ error: parsed.error });
  const { name, email, organization, topic, contracts, message } = parsed.value;

  const subject = oneLine(`[b3pay.net] ${topic} — ${organization || name}`);
  const text = [
    `Topic:         ${topic}`,
    `Name:          ${name}`,
    `Email:         ${email}`,
    `Organization:  ${organization || "(not given)"}`,
    "",
    ...(contracts ? ["Contracts:", contracts, ""] : []),
    message,
  ].join("\n");

  try {
    const resend = new Resend(RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: [CONTACT_TO_EMAIL],
      replyTo: email,
      subject,
      text,
      html: `<pre style="font:14px/1.5 ui-monospace,monospace;white-space:pre-wrap">${escapeHtml(text)}</pre>`,
    });
    if (error) throw new Error(error.message);
  } catch (err) {
    console.error("contact: delivery failed", err);
    return res.status(502).json({ error: "The message could not be delivered." });
  }

  return res.status(200).json({ ok: true });
}
