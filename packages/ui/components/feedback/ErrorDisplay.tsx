import React from "react";

/** Full error panel with the raw payload. Use for failed canister calls and preflight rejections. */
export interface ErrorDisplayProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** @default "Call failed" */
  title?: React.ReactNode;
  /** Short machine code, e.g. "IC0503". */
  code?: string;
  /** Raw error text — rendered mono in a scrollable block. */
  detail?: string;
  onRetry?: () => void;
}

export function ErrorDisplay({
  title = "Call failed",
  code,
  detail,
  onRetry,
  className = "",
  ...rest
}: ErrorDisplayProps) {
  return (
    <div
      className={["b3-card", className].filter(Boolean).join(" ")}
      style={{
        borderColor: "color-mix(in srgb,var(--error) 45%,transparent)",
        background: "color-mix(in srgb,var(--error) 8%,var(--card))",
      }}
      {...rest}
    >
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span className="b3-eyebrow" style={{ color: "var(--error)" }}>
            Error
          </span>
          {code ? (
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--muted-foreground)",
              }}
            >
              {code}
            </span>
          ) : null}
        </div>
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-md)",
            fontWeight: "var(--weight-semibold)" as React.CSSProperties["fontWeight"],
            letterSpacing: "var(--tracking-tight)",
          }}
        >
          {title}
        </p>
        {detail ? (
          <pre
            tabIndex={0}
            style={{
              margin: "10px 0 0",
              padding: 10,
              background: "var(--ink-050)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              lineHeight: "var(--text-xs-lh)",
              color: "var(--muted-foreground)",
              overflow: "auto",
              whiteSpace: "pre-wrap",
            }}
          >
            {detail}
          </pre>
        ) : null}
        {onRetry ? (
          <button
            type="button"
            className="b3-btn b3-btn--sm b3-btn--outlined b3-btn--error"
            style={
              {
                marginTop: 12,
                "--c": "var(--error)",
                "--c-fg": "var(--error-foreground)",
              } as React.CSSProperties
            }
            onClick={onRetry}
          >
            Retry
          </button>
        ) : null}
      </div>
    </div>
  );
}
