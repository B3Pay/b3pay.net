import type { HTMLAttributes } from "react";
/** Clips a long string to `max` characters and keeps the full value in the tooltip. */
export interface TruncatedStringProps extends HTMLAttributes<HTMLSpanElement> {
  value?: string;
  /** @default 32 */
  max?: number;
  /** @default true */
  mono?: boolean;
}
export declare function TruncatedString(props: TruncatedStringProps): JSX.Element;
