import React from "react";

/** Form-control label. Pair with the control's id via htmlFor. */
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Appends a Forge-orange asterisk. @default false */
  required?: boolean;
  /** @default false */
  disabled?: boolean;
}

export function Label({
  required = false,
  disabled = false,
  className = "",
  children,
  ...rest
}: LabelProps) {
  return (
    <label
      className={["b3-label", disabled && "b3-label--disabled", className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
      {required ? (
        <span style={{ color: "var(--forge-500)", marginLeft: 3 }} aria-hidden>
          *
        </span>
      ) : null}
    </label>
  );
}
