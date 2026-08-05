import React from "react";

/** Code sample with an optional filename bar and copy button. The docs workhorse. */
export interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  code?: string;
  /** Shown in the header when no filename is given. */
  lang?: string;
  filename?: string;
  /** @default true */
  copyable?: boolean;
  /** @default false */
  numbered?: boolean;
}

export function CodeBlock({
  code = "",
  lang,
  filename,
  copyable = true,
  numbered = false,
  className = "",
  style,
  ...rest
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const lines = String(code).replace(/\n$/, "").split("\n");
  return (
    <div
      className={["b3-card", className].filter(Boolean).join(" ")}
      style={{ overflow: "hidden", background: "var(--ink-050)", ...style }}
      {...rest}
    >
      {filename || lang || copyable ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            padding: "0 10px",
            height: 32,
            borderBottom: "1px solid var(--border)",
            background: "var(--card)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "var(--tracking-wide)",
              color: "var(--muted-foreground)",
            }}
          >
            {filename || lang}
          </span>
          {copyable ? (
            <button
              type="button"
              aria-label={`Copy ${filename || lang || "code"} to clipboard`}
              onClick={() => {
                try {
                  navigator.clipboard.writeText(code);
                } catch {
                  /* clipboard unavailable — the sample is still selectable */
                }
                setCopied(true);
                if (timer.current) clearTimeout(timer.current);
                timer.current = setTimeout(() => setCopied(false), 1200);
              }}
              style={{
                background: "none",
                border: 0,
                color: copied ? "var(--forge-500)" : "var(--muted-foreground)",
                cursor: "pointer",
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "var(--tracking-wide)",
                textTransform: "uppercase",
              }}
            >
              {copied ? "Copied" : "Copy"}
            </button>
          ) : null}
        </div>
      ) : null}
      <pre
        style={{
          margin: 0,
          padding: "12px 14px",
          overflow: "auto",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-sm)",
          lineHeight: "20px",
          color: "var(--ink-800)",
        }}
        tabIndex={0}
      >
        <code>
          {lines.map((l, i) => (
            <div key={i} style={{ display: "flex", gap: 14 }}>
              {numbered ? (
                <span
                  style={{
                    // --ink-500 on --ink-050 is 2.25:1. The gutter is still
                    // visibly quieter than the code (--ink-800) at
                    // --muted-foreground, and it clears AA.
                    color: "var(--muted-foreground)",
                    userSelect: "none",
                    minWidth: 18,
                    textAlign: "right",
                  }}
                  aria-hidden
                >
                  {i + 1}
                </span>
              ) : null}
              <span style={{ whiteSpace: "pre" }}>{l || " "}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
