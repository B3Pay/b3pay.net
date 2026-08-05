import type { HTMLAttributes, ComponentType, SVGAttributes, ReactNode } from "react";
export interface SideNavItem { value: string; label: ReactNode; icon?: ComponentType<SVGAttributes<SVGElement>>; badge?: string }
export interface SideNavSection { label?: string; items: SideNavItem[] }
/** Grouped left-rail navigation. Section labels render as mono eyebrows. */
export interface SideNavProps extends HTMLAttributes<HTMLElement> {
  sections?: SideNavSection[];
  active?: string;
  onSelect?: (value: string) => void;
}
export declare function SideNav(props: SideNavProps): JSX.Element;
