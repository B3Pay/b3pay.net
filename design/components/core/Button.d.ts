import type { ButtonHTMLAttributes, ComponentType, SVGAttributes } from "react";

export type B3Color = "primary" | "secondary" | "error" | "success" | "warning" | "info" | "alert" | "muted";
export type B3Size = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * The B3Pay button. A (variant x color) matrix over five sizes — the same
 * contract the B3Forge app ships.
 *
 */
export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  /** Surface treatment. @default "default" */
  variant?: "default" | "filled" | "outlined" | "ghost" | "link";
  /** Semantic colour. @default "secondary" */
  color?: B3Color;
  /** Height/padding/type step. @default "md" */
  size?: B3Size;
  /** Icon component rendered before the label (lucide icons work directly). */
  icon?: ComponentType<SVGAttributes<SVGElement>>;
  /** Icon component rendered after the label. */
  iconRight?: ComponentType<SVGAttributes<SVGElement>>;
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
}

export declare function Button(props: ButtonProps): JSX.Element;
