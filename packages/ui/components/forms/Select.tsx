import React from "react";

import type { B3Size } from "../core/tone";

export type SelectOption = string | { value: string; label: string };

/** Single-choice select using the shared form-control geometry. */
export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  /** @default "md" */
  size?: B3Size;
  /** Strings, or {value,label} pairs. */
  options?: SelectOption[];
  /** @default false */
  invalid?: boolean;
  /** Applied to the positioning wrapper, not the control. */
  className?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { size = "md", options = [], invalid = false, className = "", style, ...rest },
    ref,
  ) {
    return (
      <div
        style={{ position: "relative", width: "100%", ...style }}
        className={className}
      >
        <select
          ref={ref}
          className={["b3-field", `b3-field--${size}`].join(" ")}
          aria-invalid={invalid || undefined}
          style={{ appearance: "none", paddingRight: 28, cursor: "pointer" }}
          {...rest}
        >
          {options.map((o) => {
            const v = typeof o === "string" ? o : o.value;
            const l = typeof o === "string" ? o : o.label;
            return (
              <option key={v} value={v}>
                {l}
              </option>
            );
          })}
        </select>
        <span
          aria-hidden
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--muted-foreground)",
            pointerEvents: "none",
            fontSize: 9,
          }}
        >
          ▼
        </span>
      </div>
    );
  },
);
