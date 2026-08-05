import type { HTMLAttributes, ReactNode } from "react";
export interface NavLink { label: string; href?: string }
/** Marketing / docs top bar. Translucent with a blur, hairline bottom border. */
export interface NavBarProps extends HTMLAttributes<HTMLElement> {
  links?: NavLink[];
  /** Label of the current link. */
  active?: string;
  /** Left slot — normally `<BrandMark />`. */
  brand?: ReactNode;
  /** Right slot — normally two Buttons. */
  actions?: ReactNode;
  /** @default true */
  sticky?: boolean;
}
export declare function NavBar(props: NavBarProps): JSX.Element;
