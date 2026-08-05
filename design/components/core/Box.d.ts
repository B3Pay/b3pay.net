import type { HTMLAttributes } from "react";

export type SpaceStep = "none" | "xs" | "sm" | "md" | "lg" | "xl";

/** Layout primitive. Flex shorthands plus token-bound padding, background and radius. */
export interface BoxProps extends HTMLAttributes<HTMLElement> {
  as?: keyof JSX.IntrinsicElements;
  /** @default "none" */
  padding?: SpaceStep;
  gap?: SpaceStep;
  direction?: "row" | "column";
  align?: "flex-start" | "center" | "flex-end" | "stretch";
  justify?: "flex-start" | "center" | "flex-end" | "space-between";
  /** Token name without the -- prefix, e.g. "card", "secondary". */
  bg?: string;
  /** @default false */
  border?: boolean;
  radius?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}
export declare function Box(props: BoxProps): JSX.Element;
