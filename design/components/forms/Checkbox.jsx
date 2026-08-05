import React from "react";


export function Checkbox({ label, description, type = "checkbox", className = "", id, ...rest }) {
  const control = <input id={id} type={type} className={["b3-check", type === "radio" && "b3-check--radio", className].filter(Boolean).join(" ")} {...rest} />;
  if (!label) return control;
  return (
    <label htmlFor={id} style={{ display: "flex", gap: 8, alignItems: description ? "flex-start" : "center", cursor: "pointer" }}>
      {control}
      <span>
        <span style={{ fontSize: "var(--text-base)", color: "var(--foreground)" }}>{label}</span>
        {description ? <span style={{ display: "block", fontSize: "var(--text-sm)", color: "var(--muted-foreground)", marginTop: 2 }}>{description}</span> : null}
      </span>
    </label>
  );
}
