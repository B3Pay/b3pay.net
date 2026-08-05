import type { HTMLAttributes, ComponentType, SVGAttributes, ReactNode } from "react";

/**
 * Panel surface. The app's primary container for workflows, packages and docs.
 *
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Adds pointer cursor plus a Forge-tinted border on hover. @default false */
  interactive?: boolean;
  /** Transparent background — for cards sitting on an already-raised surface. @default false */
  flush?: boolean;
  /** Machined corner cut. @default false */
  bevel?: boolean;
}
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: ReactNode;
  description?: ReactNode;
  /** Glyph shown in the Forge-tinted icon tile. */
  icon?: ComponentType<SVGAttributes<SVGElement>>;
  /** Right-aligned slot — usually a Badge or icon Button. */
  action?: ReactNode;
}
export declare function Card(props: CardProps): JSX.Element;
export declare function CardHeader(props: CardHeaderProps): JSX.Element;
export declare function CardContent(props: HTMLAttributes<HTMLDivElement>): JSX.Element;
export declare function CardFooter(props: HTMLAttributes<HTMLDivElement>): JSX.Element;
