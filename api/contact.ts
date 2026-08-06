import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

/**
 * POST /api/contact
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

const TOPICS = [
  "Integration question",
  "Grant / partnership",
  "Bug report",
  "Something else",
] as const;

const MAX = { name: 120, email: 200, message: 5000 };

interface Payload {
  name: string;
  email: string;
  topic: string;
  message: string;
  publicIssue: boolean;
}

function validate(body: unknown): { ok: true; value: Payload } | { ok: false; error: string } {
  if (typeof body !== "object" || body === null) return { ok: false, error: "Expected a JSON object." };
  const b = body as Record<string, unknown>;

  const name = typeof b.name === "string" ? b.name.trim() : "";
  const email = typeof b.email === "string" ? b.email.trim() : "";
  const message = typeof b.message === "string" ? b.message.trim() : "";
  const topic = typeof b.topic === "string" ? b.topic : "";

  if (name.length < 1 || name.length > MAX.name) return { ok: false, error: "A name is required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > MAX.email)
    return { ok: false, error: "A valid email address is required." };
  if (message.length < 10 || message.length > MAX.message)
    return { ok: false, error: "A message of at least 10 characters is required." };

  return {
    ok: true,
    value: {
      name,
      email,
      message,
      topic: (TOPICS as readonly string[]).includes(topic) ? topic : TOPICS[3],
      publicIssue: b.publicIssue === true,
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
  const { name, email, topic, message, publicIssue } = parsed.value;

  const subject = oneLine(`[b3pay.net] ${topic} — ${name}`);
  const text = [
    `Topic:   ${topic}`,
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Public:  ${publicIssue ? "happy to discuss in a public issue" : "no"}`,
    "",
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
