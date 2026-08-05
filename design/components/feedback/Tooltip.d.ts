import type { ReactNode } from "react";
/** Hover/focus label. Mono face, one short line — never a paragraph. */
export interface TooltipProps {
  content: ReactNode;
  /** @default "top" */
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
  children?: ReactNode;
}
export declare function Tooltip(props: TooltipProps): JSX.Element;
