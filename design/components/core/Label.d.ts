import type { LabelHTMLAttributes } from "react";
/** Form-control label. Pair with the control's id via htmlFor. */
export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /** Appends a Forge-orange asterisk. @default false */
  required?: boolean;
  /** @default false */
  disabled?: boolean;
}
export declare function Label(props: LabelProps): JSX.Element;
