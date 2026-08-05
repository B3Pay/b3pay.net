import type { ReactNode } from "react";
/** Anchored floating panel for secondary content — filters, quick settings, share links. */
export interface PopoverProps {
  /** Element that toggles the panel. */
  trigger: ReactNode;
  /** @default "start" */
  align?: "start" | "end";
  /** @default 240 */
  width?: number | string;
  className?: string;
  children?: ReactNode;
}
export declare function Popover(props: PopoverProps): JSX.Element;
