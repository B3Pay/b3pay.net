import React from "react";


export function Label({ required = false, disabled = false, className = "", children, ...rest }) {
  return (
    <label className={["b3-label", disabled && "b3-label--disabled", className].filter(Boolean).join(" ")} {...rest}>
      {children}
      {required ? <span style={{ color: "var(--forge-500)", marginLeft: 3 }}>*</span> : null}
    </label>
  );
}
