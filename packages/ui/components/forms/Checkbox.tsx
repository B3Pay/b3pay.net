import React from "react";

/** Checkbox, or a radio when `type="radio"`. Wraps itself in a label when `label` is set. */
export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  /** @default "checkbox" */
  type?: "checkbox" | "radio";
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    { label, description, type = "checkbox", className = "", id, ...rest },
    ref,
  ) {
    const control = (
      <input
        ref={ref}
        id={id}
        type={type}
        className={["b3-check", type === "radio" && "b3-check--radio", className]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      />
    );
    if (!label) return control;
    return (
      <label
        htmlFor={id}
        style={{
          display: "flex",
          gap: 8,
          alignItems: description ? "flex-start" : "center",
          cursor: "pointer",
        }}
      >
        {control}
        <span>
          <span style={{ fontSize: "var(--text-base)", color: "var(--foreground)" }}>
            {label}
          </span>
          {description ? (
            <span
              style={{
                display: "block",
                fontSize: "var(--text-sm)",
                color: "var(--muted-foreground)",
                marginTop: 2,
              }}
            >
              {description}
            </span>
          ) : null}
        </span>
      </label>
    );
  },
);
