import type { HTMLAttributes, ComponentType, SVGAttributes, ReactNode } from "react";
import type { B3Color } from "../core/Button";

/**
 * Inline banner for state that persists on the page — beta limits, deprecations,
 * failed preflight checks.
 *
 */
export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "color" | "title"> {
  /** @default "info" */
  color?: B3Color;
  title?: ReactNode;
  icon?: ComponentType<SVGAttributes<SVGElement>>;
  /** Right-aligned slot, usually a small Button. */
  action?: ReactNode;
}
export declare function Alert(props: AlertProps): JSX.Element;
