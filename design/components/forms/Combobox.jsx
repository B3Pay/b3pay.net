import React from "react";


export function Combobox({ options = [], value, onSelect, placeholder = "Search…", size = "md", className = "", style }) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const list = options.filter((o) => (typeof o === "string" ? o : o.label).toLowerCase().includes(q.toLowerCase()));
  const label = value ? (options.find((o) => (typeof o === "string" ? o : o.value) === value) || value) : null;
  return (
    <div className={className} style={{ position: "relative", width: "100%", ...style }}>
      <button type="button" className={["b3-field", `b3-field--${size}`].join(" ")}
        style={{ justifyContent: "space-between", cursor: "pointer", textAlign: "left" }} onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span style={{ color: label ? "var(--foreground)" : "var(--muted-foreground)", overflow: "hidden", textOverflow: "ellipsis" }}>
          {label ? (typeof label === "string" ? label : label.label) : placeholder}
        </span>
        <span aria-hidden style={{ fontSize: 9, color: "var(--muted-foreground)" }}>▼</span>
      </button>
      {open ? (
        <div className="b3-surface b3-menu" style={{ position: "absolute", zIndex: 30, top: "calc(100% + 4px)", left: 0, right: 0 }}>
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter…"
            className="b3-field b3-field--sm" style={{ marginBottom: 4, fontFamily: "var(--font-mono)" }} />
          <div style={{ maxHeight: 200, overflow: "auto" }}>
            {list.length === 0 ? <div className="b3-menu__label">No matches</div> : null}
            {list.map((o) => {
              const v = typeof o === "string" ? o : o.value;
              const l = typeof o === "string" ? o : o.label;
              return (
                <button key={v} type="button" className="b3-menu__item" data-active={v === value || undefined}
                  onClick={() => { onSelect && onSelect(v); setOpen(false); setQ(""); }}>{l}</button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
