import type { ComponentType, SVGAttributes } from "react";
export interface CommandItem { label: string; icon?: ComponentType<SVGAttributes<SVGElement>>; hint?: string; onSelect?: () => void }
export interface CommandGroup { label: string; items: CommandItem[] }
/** ⌘K palette. The fastest path across canisters, methods and docs. */
export interface CommandProps {
  /** @default true */
  open?: boolean;
  placeholder?: string;
  groups?: CommandGroup[];
  onClose?: () => void;
  className?: string;
}
export declare function Command(props: CommandProps): JSX.Element | null;
