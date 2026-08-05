import type { HTMLAttributes, ComponentType, SVGAttributes, ReactNode } from "react";
export interface TabItem { value: string; label: ReactNode; icon?: ComponentType<SVGAttributes<SVGElement>>; count?: number }

/**
 * Tab switcher. `segmented` for in-panel view swaps, `underline` for page-level sections.
 *
 */
export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  tabs?: Array<string | TabItem>;
  value?: string;
  onChange?: (value: string) => void;
  /** @default "segmented" */
  variant?: "segmented" | "underline";
}
export declare function Tabs(props: TabsProps): JSX.Element;
