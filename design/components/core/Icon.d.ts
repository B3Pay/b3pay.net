import type { SVGAttributes, ComponentType } from "react";
/**
 * Lucide icon, loaded from CDN. Lucide is the icon set the B3Forge app uses —
 * name icons exactly as Lucide does (PascalCase).
 */
export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, "name"> {
  /** Lucide icon name, PascalCase, e.g. "GitBranch". */
  name: string;
  /** @default 16 */
  size?: number;
  /** @default 2 */
  strokeWidth?: number;
}
export declare function Icon(props: IconProps): JSX.Element;
/** Bind a name into a component, for props like `Button.icon`. */
export declare function IconOf(name: string): ComponentType<SVGAttributes<SVGElement>>;
