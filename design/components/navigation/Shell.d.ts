import type { HTMLAttributes, ReactNode } from "react";
/** App chrome: fixed bar over a sidebar + scrolling main. The bar carries a Forge heat line. */
export interface ShellProps extends HTMLAttributes<HTMLDivElement> {
  /** Contents of the top bar. */
  bar?: ReactNode;
  /** Contents of the left rail. Omit for a full-width layout. */
  aside?: ReactNode;
}
export declare function Shell(props: ShellProps): JSX.Element;
