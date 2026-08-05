import React from "react";

import type { B3Size } from "../core/tone";

/** Text input. Shares its height scale with Button, so the two line up in a row. */
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** @default "md" */
  size?: B3Size;
  /** Leading glyph. */
  icon?: React.ComponentType<React.SVGAttributes<SVGElement>>;
  /** Shows a trailing clear button wired to this handler. */
  onClear?: () => void;
  /** Renders the error border and ring. @default false */
  invalid?: boolean;
  /** Use the mono face — for principals, canister IDs, Candid. @default false */
  mono?: boolean;
  /** Applied to the positioning wrapper, not the control. */
  className?: string;
}

const PAD: Record<B3Size, number> = { xs: 22, sm: 28, md: 30, lg: 34, xl: 40 };

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      size = "md",
      icon: Icon,
      onClear,
      invalid = false,
      mono = false,
      className = "",
      style,
      ...rest
    },
    ref,
  ) {
    const pad = PAD[size];
    return (
      <div
        className={["b3-input-wrap", className].filter(Boolean).join(" ")}
        style={{ position: "relative", width: "100%", ...style }}
      >
        {Icon ? (
          <span
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--muted-foreground)",
              pointerEvents: "none",
              display: "flex",
            }}
          >
            <Icon width={14} height={14} aria-hidden />
          </span>
        ) : null}
        <input
          ref={ref}
          className={["b3-field", `b3-field--${size}`].join(" ")}
          aria-invalid={invalid || undefined}
          style={{
            paddingLeft: Icon ? pad : undefined,
            paddingRight: onClear ? pad : undefined,
            fontFamily: mono ? "var(--font-mono)" : undefined,
          }}
          {...rest}
        />
        {onClear ? (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear"
            style={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: 0,
              color: "var(--muted-foreground)",
              cursor: "pointer",
              lineHeight: 1,
              fontSize: 14,
            }}
          >
            ×
          </button>
        ) : null}
      </div>
    );
  },
);
