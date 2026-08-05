import React from "react";

/** Multi-line input. Renders in the mono face — its main use is Candid expressions. */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** @default false */
  invalid?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ invalid = false, rows = 4, className = "", ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        rows={rows}
        aria-invalid={invalid || undefined}
        className={["b3-field", "b3-field--area", className]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      />
    );
  },
);
