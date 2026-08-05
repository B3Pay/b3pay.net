import type { HTMLAttributes } from "react";
import type { B3Color } from "./Button";

/** Status label at metadata scale. Always mono, always uppercase. */
export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, "color"> {
  /** @default "soft" */
  variant?: "soft" | "filled" | "outlined";
  /** @default "secondary" */
  color?: B3Color;
  /** @default "sm" */
  size?: "xs" | "sm" | "md";
  /** Leading status dot. @default false */
  dot?: boolean;
}

export declare function Badge(props: BadgeProps): JSX.Element;
