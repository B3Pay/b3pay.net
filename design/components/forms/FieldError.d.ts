import type { HTMLAttributes } from "react";
/** Inline validation message under a control. Renders nothing when empty. */
export interface FieldErrorProps extends HTMLAttributes<HTMLParagraphElement> {}
export declare function FieldError(props: FieldErrorProps): JSX.Element | null;
