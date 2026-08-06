import { useRef, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Checkbox,
  Icon,
  IconOf,
  Input,
  Label,
  Select,
  Textarea,
  toast,
} from "@b3pay/ui";

import { GITHUB_ORG } from "../site/products";
import { Section } from "../site/furniture";
import { routeMeta } from "../site/routes";
import { useSeo } from "../lib/seo";

const TOPICS = [
  "Integration question",
  "Grant / partnership",
  "Bug report",
  "Something else",
];

const LINKS: { label: string; sub: string; icon: string; href: string }[] = [
  { label: "GitHub", sub: "github.com/B3Pay", icon: "Github", href: GITHUB_ORG },
  {
    label: "Documentation",
    sub: "IC Reactor docs and package READMEs",
    icon: "BookOpen",
    href: `${GITHUB_ORG}/ic-reactor#readme`,
  },
  {
    label: "Live demo",
    sub: "B3Note on icp0.io",
    icon: "Play",
    href: `${GITHUB_ORG}/B3Note#readme`,
  },
];

type State = "idle" | "sending" | "sent";

export default function Contact() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  useSeo(routeMeta("/contact"));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "sending") return;
    setError(null);
    setState("sending");

    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          topic: String(data.get("topic") ?? TOPICS[0]),
          message: String(data.get("message") ?? ""),
          publicIssue: data.get("publicIssue") === "on",
        }),
      });
      // Only a JSON body that says { ok: true } counts as delivered. A 200 that
      // is not JSON means the SPA rewrite answered instead of the function —
      // reporting success on that would be exactly the silent discard the
      // endpoint exists to prevent.
      const isJson = (res.headers.get("content-type") || "").includes("application/json");
      const body = isJson
        ? ((await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null)
        : null;
      if (!res.ok) {
        throw new Error(body?.error || `The server refused the message (${res.status}).`);
      }
      if (body?.ok !== true) {
        throw new Error("The contact endpoint did not confirm delivery.");
      }
      setState("sent");
      formRef.current?.reset();
    } catch (err) {
      setState("idle");
      const message =
        err instanceof Error ? err.message : "The message could not be sent.";
      setError(message);
      toast.error("Message not sent", { description: message });
    }
  }

  return (
    <Section
      as="h1"
      eyebrow="Get started"
      title="Tell us what you are building."
      lead="Grant applications, integration questions and bug reports all land in the same inbox. We answer in engineering terms."
    >
      <div className="site-grid-half" style={{ alignItems: "start" }}>
        <Card>
          <CardContent style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {state === "sent" ? (
              <div style={{ padding: "40px 0", textAlign: "center" }}>
                <div style={{ color: "var(--success)" }}>
                  <Icon name="Check" size={28} style={{ margin: "0 auto" }} />
                </div>
                <p
                  style={{
                    margin: "14px 0 0",
                    fontFamily: "var(--font-display)",
                    fontSize: 20,
                    fontWeight: 600,
                  }}
                >
                  Message sent
                </p>
                <p style={{ margin: "8px 0 0", fontSize: 14, color: "var(--muted-foreground)" }}>
                  We reply within two working days.
                </p>
                <Button
                  style={{ marginTop: 20 }}
                  variant="outlined"
                  size="sm"
                  onClick={() => setState("idle")}
                >
                  Send another
                </Button>
              </div>
            ) : (
              <form
                ref={formRef}
                onSubmit={onSubmit}
                noValidate={false}
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                <div>
                  <Label htmlFor="n" required>
                    Name
                  </Label>
                  <Input
                    id="n"
                    name="name"
                    size="lg"
                    required
                    autoComplete="name"
                    placeholder="Ada Lovelace"
                  />
                </div>
                <div>
                  <Label htmlFor="e" required>
                    Email
                  </Label>
                  <Input
                    id="e"
                    name="email"
                    type="email"
                    size="lg"
                    required
                    autoComplete="email"
                    placeholder="ada@example.org"
                  />
                </div>
                <div>
                  <Label htmlFor="t">Topic</Label>
                  <Select id="t" name="topic" size="lg" options={TOPICS} defaultValue={TOPICS[0]} />
                </div>
                <div>
                  <Label htmlFor="m" required>
                    Message
                  </Label>
                  <Textarea
                    id="m"
                    name="message"
                    rows={5}
                    required
                    minLength={10}
                    placeholder="What are you building, and where are you stuck?"
                  />
                </div>
                <Checkbox
                  id="oss"
                  name="publicIssue"
                  label="I am happy for this to be discussed in a public issue"
                />
                {error ? (
                  <Alert color="error" title="Message not sent" icon={IconOf("CircleAlert")}>
                    {error} You can also open an issue on GitHub.
                  </Alert>
                ) : null}
                <Button
                  type="submit"
                  variant="filled"
                  color="primary"
                  size="lg"
                  fullWidth
                  isLoading={state === "sending"}
                >
                  {state === "sending" ? "Sending" : "Send"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="site-link-list" style={{ display: "flex", flexDirection: "column" }}>
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="site-row-link"
              style={{
                display: "flex",
                gap: 16,
                alignItems: "center",
                padding: "20px 0",
                borderTop: "1px solid var(--border)",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <span style={{ color: "var(--forge-500)" }}>
                <Icon name={l.icon} size={18} />
              </span>
              <span style={{ flex: 1 }}>
                <span style={{ display: "block", fontSize: 15, fontWeight: 500 }}>{l.label}</span>
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--muted-foreground)",
                    marginTop: 3,
                  }}
                >
                  {l.sub}
                </span>
              </span>
              <Icon name="ArrowUpRight" size={15} style={{ color: "var(--muted-foreground)" }} />
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
}
