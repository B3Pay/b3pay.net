import type { ReactNode, ComponentType, SVGAttributes } from "react";
export interface MenuItem {
  type?: "item" | "separator" | "label";
  label?: ReactNode;
  icon?: ComponentType<SVGAttributes<SVGElement>>;
  shortcut?: string;
  active?: boolean;
  color?: "default" | "error";
  onSelect?: () => void;
}
/** Action menu hung off a trigger. Group with `separator`, head sections with `label`. */
export interface DropdownMenuProps {
  trigger: ReactNode;
  items?: MenuItem[];
  /** @default "start" */
  align?: "start" | "end";
  className?: string;
}
export declare function DropdownMenu(props: DropdownMenuProps): JSX.Element;
