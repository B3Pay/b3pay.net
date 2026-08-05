import React from "react";


export function Command({ open = true, placeholder = "Search canisters, methods, docs…", groups = [], onClose, className = "" }) {
  const [q, setQ] = React.useState("");
  if (!open) return null;
  const filtered = groups
    .map((g) => ({ ...g, items: g.items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase())) }))
    .filter((g) => g.items.length);
  return (
    <>
      <div className="b3-overlay" onClick={onClose} />
      <div role="dialog" aria-modal="true" className={["b3-dialog", "b3-command", className].filter(Boolean).join(" ")} style={{ top: "22%", transform: "translate(-50%,0)", padding: 0 }}>
        <input autoFocus className="b3-command__input" placeholder={placeholder} value={q} onChange={(e) => setQ(e.target.value)} />
        <div style={{ maxHeight: 320, overflow: "auto", padding: 6 }}>
          {filtered.length === 0 ? <div className="b3-menu__label">No results</div> : null}
          {filtered.map((g, gi) => (
            <div key={gi}>
              <div className="b3-menu__label">{g.label}</div>
              {g.items.map((it, i) => {
                const Icon = it.icon;
                return (
                  <button key={i} type="button" className="b3-menu__item" onClick={() => { it.onSelect && it.onSelect(); onClose && onClose(); }}>
                    {Icon ? <Icon width={13} height={13} aria-hidden /> : null}
                    <span style={{ flex: 1 }}>{it.label}</span>
                    {it.hint ? <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted-foreground)" }}>{it.hint}</span> : null}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
