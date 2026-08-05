import type { ReactNode } from "react";

/**
 * Modal dialog. Blocks the page — reserve it for decisions that cannot be deferred.
 *
 */
export interface DialogProps {
  /** @default true */
  open?: boolean;
  title?: ReactNode;
  description?: ReactNode;
  /** Action row, right-aligned. */
  footer?: ReactNode;
  onClose?: () => void;
  /** Override the 520px default width. */
  width?: number | string;
  className?: string;
  children?: ReactNode;
}
export declare function Dialog(props: DialogProps): JSX.Element | null;
