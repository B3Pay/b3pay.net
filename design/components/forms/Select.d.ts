import type { SelectHTMLAttributes } from "react";
import type { B3Size } from "../core/Button";
/** Single-choice select using the shared form-control geometry. */
export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  /** @default "md" */
  size?: B3Size;
  /** Strings, or {value,label} pairs. */
  options?: Array<string | { value: string; label: string }>;
  /** @default false */
  invalid?: boolean;
}
export declare function Select(props: SelectProps): JSX.Element;
