import React from "react";


export function Tabs({ tabs = [], value, onChange, variant = "segmented", className = "", ...rest }) {
  return (
    <div role="tablist" className={["b3-tabs", variant === "underline" && "b3-tabs--underline", className].filter(Boolean).join(" ")} {...rest}>
      {tabs.map((t) => {
        const v = typeof t === "string" ? t : t.value;
        const l = typeof t === "string" ? t : t.label;
        const Icon = typeof t === "string" ? null : t.icon;
        return (
          <button key={v} type="button" role="tab" className="b3-tab" data-state={v === value ? "active" : undefined}
            aria-selected={v === value} onClick={() => onChange && onChange(v)}>
            {Icon ? <Icon width={13} height={13} aria-hidden /> : null}
            {l}
            {typeof t === "object" && t.count != null ? (
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted-foreground)" }}>{t.count}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
