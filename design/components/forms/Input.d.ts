import type { InputHTMLAttributes, ComponentType, SVGAttributes } from "react";
import type { B3Size } from "../core/Button";

/**
 * Text input. Shares its height scale with Button, so the two line up in a row.
 *
 */
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** @default "md" */
  size?: B3Size;
  /** Leading glyph. */
  icon?: ComponentType<SVGAttributes<SVGElement>>;
  /** Shows a trailing clear button wired to this handler. */
  onClear?: () => void;
  /** Renders the error border and ring. @default false */
  invalid?: boolean;
  /** Use the mono face — for principals, canister IDs, Candid. @default false */
  mono?: boolean;
}
export declare function Input(props: InputProps): JSX.Element;
