import React from "react";

import { toneVars } from "../core/tone.js";

export function Toast({ color = "secondary", title, icon: Icon, onDismiss, className = "", style, children, ...rest }) {
  return (
    <div role="status" className={["b3-toast", className].filter(Boolean).join(" ")} style={{ ...toneVars(color), position: "relative", ...style }} {...rest}>
      <span className="b3-toast__bar" />
      {Icon ? <span style={{ color: "var(--c)", flex: "none", marginTop: 1 }}><Icon width={15} height={15} aria-hidden /></span> : null}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title ? <p style={{ margin: 0, fontSize: "var(--text-base)", fontWeight: "var(--weight-medium)" }}>{title}</p> : null}
        {children ? <p style={{ margin: "3px 0 0", fontSize: "var(--text-sm)", lineHeight: "var(--text-sm-lh)", color: "var(--muted-foreground)" }}>{children}</p> : null}
      </div>
      {onDismiss ? (
        <button type="button" onClick={onDismiss} aria-label="Dismiss"
          style={{ background: "none", border: 0, color: "var(--muted-foreground)", cursor: "pointer", fontSize: 15, lineHeight: 1, flex: "none" }}>×</button>
      ) : null}
    </div>
  );
}
