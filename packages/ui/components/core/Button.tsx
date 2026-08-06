import React from "react";

import { toneVars } from "./tone";
import type { B3Color, B3Size } from "./tone";

export type { B3Color, B3Size };

/**
 * The B3Pay button. A (variant x color) matrix over five sizes — the same
 * contract the B3Forge app ships.
 */
export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  /** Surface treatment. @default "default" */
  variant?: "default" | "filled" | "outlined" | "ghost" | "link";
  /** Semantic colour. @default "secondary" */
  color?: B3Color;
  /** Height/padding/type step. @default "md" */
  size?: B3Size;
  /** Icon component rendered before the label (lucide icons work directly). */
  icon?: React.ComponentType<React.SVGAttributes<SVGElement>>;
  /** Icon component rendered after the label. */
  iconRight?: React.ComponentType<React.SVGAttributes<SVGElement>>;
  /** Pressed / selected state. @default false */
  isActive?: boolean;
  /** Pulses the border and disables interaction. @default false */
  isLoading?: boolean;
  /** Square button sized to its icon. @default false */
  asIconButton?: boolean;
  /** Stretch to the container width. @default false */
  fullWidth?: boolean;
  /** Machined corner cut — reserve for primary CTAs. @default false */
  bevel?: boolean;
  /** Render as another element, e.g. "a". @default "button" */
  as?: "button" | "a";
  href?: string;
  target?: string;
  rel?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
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
    },
    ref,
  ) {
    const Comp = as as React.ElementType;
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
    ]
      .filter(Boolean)
      .join(" ");
    return (
      <Comp
        ref={ref}
        className={cls}
        style={{ ...toneVars(color), ...style }}
        disabled={as === "button" ? disabled || isLoading || undefined : undefined}
        aria-disabled={disabled || isLoading || undefined}
        aria-pressed={isActive || undefined}
        aria-busy={isLoading || undefined}
        {...rest}
      >
        {IconLeft ? <IconLeft aria-hidden /> : null}
        {children}
        {IconRight ? <IconRight aria-hidden /> : null}
      </Comp>
    );
  },
);
