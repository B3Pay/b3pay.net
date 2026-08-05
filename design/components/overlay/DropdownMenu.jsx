import React from "react";


export function DropdownMenu({ trigger, items = [], align = "start", className = "" }) {
  const [open, setOpen] = React.useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex" }} className={className}>
      <span onClick={() => setOpen((o) => !o)}>{trigger}</span>
      {open ? (
        <div role="menu" className="b3-surface b3-menu" style={{ position: "absolute", zIndex: 40, top: "calc(100% + 6px)", [align === "end" ? "right" : "left"]: 0 }}>
          {items.map((it, i) => {
            if (it.type === "separator") return <div key={i} className="b3-menu__sep" />;
            if (it.type === "label") return <div key={i} className="b3-menu__label">{it.label}</div>;
            const Icon = it.icon;
            return (
              <button key={i} type="button" role="menuitem" className="b3-menu__item" data-active={it.active || undefined}
                style={it.color === "error" ? { color: "var(--error)" } : undefined}
                onClick={() => { it.onSelect && it.onSelect(); setOpen(false); }}>
                {Icon ? <Icon width={13} height={13} aria-hidden /> : null}
                <span style={{ flex: 1 }}>{it.label}</span>
                {it.shortcut ? <kbd className="b3-kbd">{it.shortcut}</kbd> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </span>
  );
}
