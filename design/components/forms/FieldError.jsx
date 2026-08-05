import React from "react";


export function FieldError({ className = "", children, ...rest }) {
  if (!children) return null;
  return <p role="alert" className={["b3-field-error", className].filter(Boolean).join(" ")} {...rest}><span aria-hidden>!</span>{children}</p>;
}
