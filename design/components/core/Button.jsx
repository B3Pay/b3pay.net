import React from "react";

import { toneVars } from "./tone.js";

export function Button({
  variant = "default",
  color = "secondary",
  size = "md",
  icon: IconLeft,
  iconRight: IconRight,
  isActive = false,
  isLoading = false,
  asIconButton = false,
  fullWidth = false,
  bevel = false,
  as = "button",
  className = "",
  style,
  disabled,
  children,
  ...rest
}) {
  const Comp = as;
  const cls = [
    "b3-btn",
    `b3-btn--${size}`,
    `b3-btn--${variant}`,
    `b3-btn--${color}`,
    asIconButton && "b3-btn--icon",
    fullWidth && "b3-btn--full",
    isActive && "b3-btn--active",
    isLoading && "b3-btn--loading",
    bevel && "b3-bevel",
    className,
  ].filter(Boolean).join(" ");
  return (
    <Comp className={cls} style={{ ...toneVars(color), ...style }}
      disabled={as === "button" ? disabled || isLoading || undefined : undefined}
      aria-disabled={disabled || isLoading || undefined}
      aria-pressed={isActive || undefined} aria-busy={isLoading || undefined} {...rest}>
      {IconLeft ? <IconLeft aria-hidden /> : null}
      {children}
      {IconRight ? <IconRight aria-hidden /> : null}
    </Comp>
  );
}
