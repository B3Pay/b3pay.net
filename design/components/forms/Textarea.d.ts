import type { TextareaHTMLAttributes } from "react";
/** Multi-line input. Renders in the mono face — its main use is Candid expressions. */
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** @default false */
  invalid?: boolean;
}
export declare function Textarea(props: TextareaProps): JSX.Element;
