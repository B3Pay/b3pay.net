import React from "react";

export type SpaceStep = "none" | "xs" | "sm" | "md" | "lg" | "xl";

const SCALE: Record<SpaceStep, number> = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

/** Layout primitive. Flex shorthands plus token-bound padding, background and radius. */
export interface BoxProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  /** @default "none" */
  padding?: SpaceStep | number | string;
  gap?: SpaceStep | number | string;
  direction?: "row" | "column";
  align?: "flex-start" | "center" | "flex-end" | "stretch";
  justify?: "flex-start" | "center" | "flex-end" | "space-between";
  /** Token name without the -- prefix, e.g. "card", "secondary". */
  bg?: string;
  /** @default false */
  border?: boolean;
  radius?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

export function Box({
  as = "div",
  padding = "none",
  gap,
  direction,
  align,
  justify,
  bg,
  border = false,
  radius,
  className = "",
  style,
  children,
  ...rest
}: BoxProps) {
  const Comp = as as React.ElementType;
  const s: React.CSSProperties = {
    padding: SCALE[padding as SpaceStep] ?? padding,
    display:
      direction || gap != null || align || justify ? "flex" : undefined,
    flexDirection: direction,
    gap: SCALE[gap as SpaceStep] ?? gap,
    alignItems: align,
    justifyContent: justify,
    background: bg ? `var(--${bg})` : undefined,
    border: border ? "1px solid var(--border)" : undefined,
    borderRadius: radius ? `var(--radius-${radius})` : undefined,
    ...style,
  };
  return (
    <Comp className={className} style={s} {...rest}>
      {children}
    </Comp>
  );
}
