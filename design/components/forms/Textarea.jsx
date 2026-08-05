import React from "react";


export function Textarea({ invalid = false, rows = 4, className = "", ...rest }) {
  return <textarea rows={rows} aria-invalid={invalid || undefined} className={["b3-field", "b3-field--area", className].filter(Boolean).join(" ")} {...rest} />;
}
