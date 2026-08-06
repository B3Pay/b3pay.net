import React from "react";

import { toneVars } from "../core/tone";
import type { B3Color } from "../core/tone";

/**
 * Inline banner for state that persists on the page — beta limits, deprecations,
 * failed preflight checks.
 */
export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color" | "title"> {
  /** @default "info" */
  color?: B3Color;
  title?: React.ReactNode;
  icon?: React.ComponentType<React.SVGAttributes<SVGElement>>;
  /** Right-aligned slot, usually a small Button. */
  action?: React.ReactNode;
}

export function Alert({
  color = "info",
  title,
  icon: Icon,
  action,
  className = "",
  style,
  children,
  ...rest
}: AlertProps) {
  return (
    <div
      role="status"
      className={["b3-alert", className].filter(Boolean).join(" ")}
      style={{ ...toneVars(color), ...style }}
      {...rest}
    >
      {Icon ? (
        <span className="b3-alert__icon">
          <Icon width={16} height={16} aria-hidden />
        </span>
      ) : null}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title ? <p className="b3-alert__title">{title}</p> : null}
        {children ? <p className="b3-alert__body">{children}</p> : null}
      </div>
      {action ? <div style={{ flex: "none" }}>{action}</div> : null}
    </div>
  );
}
