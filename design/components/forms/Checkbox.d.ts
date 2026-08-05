import type { InputHTMLAttributes, ReactNode } from "react";
/** Checkbox, or a radio when `type="radio"`. Wraps itself in a label when `label` is set. */
export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  description?: ReactNode;
  /** @default "checkbox" */
  type?: "checkbox" | "radio";
}
export declare function Checkbox(props: CheckboxProps): JSX.Element;
