import React from "react";

const SCALE = { none: 0, xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

export function Box({ as = "div", padding = "none", gap, direction, align, justify, bg, border = false, radius, className = "", style, children, ...rest }) {
  const Comp = as;
  const s = {
    padding: SCALE[padding] ?? padding,
    display: direction || gap != null || align || justify ? "flex" : undefined,
    flexDirection: direction,
    gap: SCALE[gap] ?? gap,
    alignItems: align,
    justifyContent: justify,
    background: bg ? `var(--${bg})` : undefined,
    border: border ? "1px solid var(--border)" : undefined,
    borderRadius: radius ? `var(--radius-${radius})` : undefined,
    ...style,
  };
  return <Comp className={className} style={s} {...rest}>{children}</Comp>;
}
