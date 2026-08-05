import type { HTMLAttributes, ComponentType, SVGAttributes, ReactNode } from "react";
import type { B3Color } from "../core/Button";
/** Transient confirmation of an action. Stack bottom-right; auto-dismiss after ~4s. */
export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, "color" | "title"> {
  /** @default "secondary" */
  color?: B3Color;
  title?: ReactNode;
  icon?: ComponentType<SVGAttributes<SVGElement>>;
  onDismiss?: () => void;
}
export declare function Toast(props: ToastProps): JSX.Element;
