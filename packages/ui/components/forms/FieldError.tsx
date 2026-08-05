import React from "react";

/** Inline validation message under a control. Renders nothing when empty. */
export interface FieldErrorProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export function FieldError({ className = "", children, ...rest }: FieldErrorProps) {
  if (!children) return null;
  return (
    <p
      role="alert"
      className={["b3-field-error", className].filter(Boolean).join(" ")}
      {...rest}
    >
      <span aria-hidden>!</span>
      {children}
    </p>
  );
}
