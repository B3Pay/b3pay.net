import React from "react";

/** Binary toggle for settings that apply immediately. */
export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  function Switch({ label, className = "", id, ...rest }, ref) {
    const control = (
      <input
        ref={ref}
        id={id}
        type="checkbox"
        role="switch"
        className={["b3-switch", className].filter(Boolean).join(" ")}
        {...rest}
      />
    );
    if (!label) return control;
    return (
      <label
        htmlFor={id}
        style={{
          display: "inline-flex",
          gap: 8,
          alignItems: "center",
          cursor: "pointer",
          fontSize: "var(--text-base)",
        }}
      >
        {control}
        <span>{label}</span>
      </label>
    );
  },
);
