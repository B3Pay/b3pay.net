import React from "react";


export function Drawer({ open = true, title, onClose, footer, width, className = "", children }) {
  if (!open) return null;
  return (
    <>
      <div className="b3-overlay" onClick={onClose} />
      <aside className={["b3-drawer", className].filter(Boolean).join(" ")} style={width ? { width } : undefined}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "0 16px", height: 52, borderBottom: "1px solid var(--border)", flex: "none" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-md)", fontWeight: "var(--weight-semibold)" }}>{title}</span>
          {onClose ? <button type="button" onClick={onClose} aria-label="Close" style={{ background: "none", border: 0, color: "var(--muted-foreground)", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button> : null}
        </header>
        <div style={{ flex: 1, minHeight: 0, overflow: "auto", padding: 16 }}>{children}</div>
        {footer ? <footer style={{ display: "flex", gap: 8, padding: 16, borderTop: "1px solid var(--border)", flex: "none" }}>{footer}</footer> : null}
      </aside>
    </>
  );
}
