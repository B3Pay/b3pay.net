import React from "react";


export function Dialog({ open = true, title, description, footer, onClose, width, className = "", children }) {
  if (!open) return null;
  return (
    <>
      <div className="b3-overlay" onClick={onClose} />
      <div role="dialog" aria-modal="true" className={["b3-dialog", className].filter(Boolean).join(" ")} style={width ? { width } : undefined}>
        <div style={{ padding: "18px 20px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            {title ? <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", fontWeight: "var(--weight-semibold)", letterSpacing: "var(--tracking-tighter)" }}>{title}</h2> : null}
            {description ? <p style={{ margin: "6px 0 0", fontSize: "var(--text-base)", lineHeight: "var(--text-base-lh)", color: "var(--muted-foreground)" }}>{description}</p> : null}
          </div>
          {onClose ? <button type="button" onClick={onClose} aria-label="Close" style={{ background: "none", border: 0, color: "var(--muted-foreground)", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button> : null}
        </div>
        <div style={{ padding: "16px 20px" }}>{children}</div>
        {footer ? <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "0 20px 18px" }}>{footer}</div> : null}
      </div>
    </>
  );
}
