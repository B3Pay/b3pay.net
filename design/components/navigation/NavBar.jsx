import React from "react";


export function NavBar({ links = [], active, brand, actions, sticky = true, className = "", ...rest }) {
  return (
    <header className={className} style={{
      position: sticky ? "sticky" : "relative", top: 0, zIndex: 30,
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
      height: 64, padding: "0 24px",
      borderBottom: "1px solid var(--border)",
      background: "color-mix(in srgb,var(--background) 78%,transparent)",
      backdropFilter: "blur(14px)",
    }} {...rest}>
      <div style={{ display: "flex", alignItems: "center", gap: 28, minWidth: 0 }}>
        {brand}
        <nav className="b3-nav">
          {links.map((l) => (
            <a key={l.href || l.label} href={l.href || "#"} className="b3-nav__link" data-active={l.label === active || undefined}>{l.label}</a>
          ))}
        </nav>
      </div>
      {actions ? <div style={{ display: "flex", alignItems: "center", gap: 8, flex: "none" }}>{actions}</div> : null}
    </header>
  );
}
