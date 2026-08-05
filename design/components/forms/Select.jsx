import React from "react";


export function Select({ size = "md", options = [], invalid = false, className = "", style, ...rest }) {
  return (
    <div style={{ position: "relative", width: "100%", ...style }} className={className}>
      <select className={["b3-field", `b3-field--${size}`].join(" ")} aria-invalid={invalid || undefined}
        style={{ appearance: "none", paddingRight: 28, cursor: "pointer" }} {...rest}>
        {options.map((o) => {
          const v = typeof o === "string" ? o : o.value;
          const l = typeof o === "string" ? o : o.label;
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
      <span aria-hidden style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)", pointerEvents: "none", fontSize: 9 }}>▼</span>
    </div>
  );
}
