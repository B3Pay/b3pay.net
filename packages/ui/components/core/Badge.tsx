import React from "react";

import { toneVars } from "./tone";
import type { B3Color } from "./tone";

/** Status label at metadata scale. Always mono, always uppercase. */
export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color"> {
  /** @default "soft" */
  variant?: "soft" | "filled" | "outlined";
  /** @default "secondary" */
  color?: B3Color;
  /** @default "sm" */
  size?: "xs" | "sm" | "md";
  /** Leading status dot. @default false */
  dot?: boolean;
}

export function Badge({
  variant = "soft",
  color = "secondary",
  size = "sm",
  dot = false,
  className = "",
  style,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={["b3-badge", `b3-badge--${size}`, `b3-badge--${variant}`, className]
        .filter(Boolean)
        .join(" ")}
      style={{ ...toneVars(color), ...style }}
      {...rest}
    >
      {dot ? <span className="b3-badge__dot" /> : null}
      {children}
    </span>
  );
}
