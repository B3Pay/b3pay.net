import React from "react";


export function Switch({ label, className = "", id, ...rest }) {
  const control = <input id={id} type="checkbox" role="switch" className={["b3-switch", className].filter(Boolean).join(" ")} {...rest} />;
  if (!label) return control;
  return (
    <label htmlFor={id} style={{ display: "inline-flex", gap: 8, alignItems: "center", cursor: "pointer", fontSize: "var(--text-base)" }}>
      {control}<span>{label}</span>
    </label>
  );
}
