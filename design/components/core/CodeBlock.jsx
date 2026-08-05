import React from "react";


export function CodeBlock({ code = "", lang, filename, copyable = true, numbered = false, className = "", style, ...rest }) {
  const [copied, setCopied] = React.useState(false);
  const lines = String(code).replace(/\n$/, "").split("\n");
  return (
    <div className={["b3-card", className].filter(Boolean).join(" ")} style={{ overflow: "hidden", background: "var(--ink-050)", ...style }} {...rest}>
      {(filename || lang || copyable) ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "0 10px", height: 32, borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "var(--tracking-wide)", color: "var(--muted-foreground)" }}>{filename || lang}</span>
          {copyable ? (
            <button type="button" onClick={() => { try { navigator.clipboard.writeText(code); } catch (e) {} setCopied(true); setTimeout(() => setCopied(false), 1200); }}
              style={{ background: "none", border: 0, color: copied ? "var(--forge-500)" : "var(--muted-foreground)", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "var(--tracking-wide)", textTransform: "uppercase" }}>
              {copied ? "Copied" : "Copy"}
            </button>
          ) : null}
        </div>
      ) : null}
      <pre style={{ margin: 0, padding: "12px 14px", overflow: "auto", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)", lineHeight: "20px", color: "var(--ink-800)" }}>
        <code>
          {lines.map((l, i) => (
            <div key={i} style={{ display: "flex", gap: 14 }}>
              {numbered ? <span style={{ color: "var(--ink-500)", userSelect: "none", minWidth: 18, textAlign: "right" }}>{i + 1}</span> : null}
              <span style={{ whiteSpace: "pre" }}>{l || " "}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
