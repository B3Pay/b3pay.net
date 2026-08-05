import React from "react";

import { toneVars } from "./tone.js";

export function Badge({ variant = "soft", color = "secondary", size = "sm", dot = false, className = "", style, children, ...rest }) {
  return (
    <span className={["b3-badge", `b3-badge--${size}`, `b3-badge--${variant}`, className].filter(Boolean).join(" ")}
      style={{ ...toneVars(color), ...style }} {...rest}>
      {dot ? <span className="b3-badge__dot" /> : null}
      {children}
    </span>
  );
}
