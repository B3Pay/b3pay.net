import type { ReactNode } from "react";
/** Right-hand panel. The node inspector idiom — edit alongside the thing being edited. */
export interface DrawerProps {
  /** @default true */
  open?: boolean;
  title?: ReactNode;
  onClose?: () => void;
  footer?: ReactNode;
  width?: number | string;
  className?: string;
  children?: ReactNode;
}
export declare function Drawer(props: DrawerProps): JSX.Element | null;
