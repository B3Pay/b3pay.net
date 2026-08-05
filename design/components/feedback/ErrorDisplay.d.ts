import type { HTMLAttributes, ReactNode } from "react";
/** Full error panel with the raw payload. Use for failed canister calls and preflight rejections. */
export interface ErrorDisplayProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** @default "Call failed" */
  title?: ReactNode;
  /** Short machine code, e.g. "IC0503". */
  code?: string;
  /** Raw error text — rendered mono in a scrollable block. */
  detail?: string;
  onRetry?: () => void;
}
export declare function ErrorDisplay(props: ErrorDisplayProps): JSX.Element;
