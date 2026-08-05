import React from "react";


const KIND = {
  trigger:   { accent: "var(--node-trigger)",   strong: "var(--node-trigger-strong)" },
  variables: { accent: "var(--node-variables)", strong: "var(--node-variables-strong)" },
  query:     { accent: "var(--node-query)",     strong: "var(--node-query-strong)" },
  update:    { accent: "var(--node-update)",    strong: "var(--node-update-strong)" },
  utility:   { accent: "var(--node-utility)",   strong: "var(--node-utility-strong)" },
};

export function WorkflowNode({ kind = "query", index = 0, title, subtitle, icon: Icon, selected = false, ports = true, className = "", style, children, ...rest }) {
  const k = KIND[kind] || KIND.query;
  return (
    <div className={["b3-node", className].filter(Boolean).join(" ")} data-node-kind={kind} data-selected={selected || undefined}
      style={{
        "--node-accent": k.accent, "--node-accent-strong": k.strong,
        "--node-glyph-bg": `color-mix(in srgb, ${k.accent} 12%, var(--card))`,
        "--node-glyph-border": `color-mix(in srgb, ${k.accent} 22%, var(--card))`,
        ...style,
      }} {...rest}>
      <div className="b3-node__head">
        <span className="b3-node__glyph">{Icon ? <Icon width={12} height={12} aria-hidden /> : <span style={{ fontSize: 9, fontFamily: "var(--font-mono)" }}>{kind[0].toUpperCase()}</span>}</span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</div>
          {subtitle ? <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--muted-foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{subtitle}</div> : null}
        </div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--node-accent)" }}>$N{index}</span>
      </div>
      {children ? <div style={{ padding: "8px 10px", fontFamily: "var(--font-mono)", fontSize: 10, lineHeight: "15px", color: "var(--muted-foreground)" }}>{children}</div> : null}
      {ports ? (
        <>
          <span className="b3-node__port" style={{ position: "absolute", left: -5, top: "50%", marginTop: -4 }} />
          <span className="b3-node__port" style={{ position: "absolute", right: -5, top: "50%", marginTop: -4 }} />
        </>
      ) : null}
    </div>
  );
}
