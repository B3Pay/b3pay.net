import React from "react";

/** Hover/focus label. Mono face, one short line — never a paragraph. */
export interface TooltipProps {
  content: React.ReactNode;
  /** @default "top" */
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
  children?: React.ReactNode;
}

const POS: Record<
  NonNullable<TooltipProps["side"]>,
  React.CSSProperties
> = {
  top: { bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)" },
  bottom: { top: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)" },
  left: { right: "calc(100% + 6px)", top: "50%", transform: "translateY(-50%)" },
  right: { left: "calc(100% + 6px)", top: "50%", transform: "translateY(-50%)" },
};

export function Tooltip({ content, side = "top", className = "", children }: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const id = React.useId();
  return (
    <span
      className={className}
      style={{ position: "relative", display: "inline-flex" }}
      aria-describedby={open ? id : undefined}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      {children}
      {open ? (
        <span
          id={id}
          role="tooltip"
          className="b3-surface b3-tooltip"
          style={{ position: "absolute", zIndex: 40, whiteSpace: "nowrap", ...POS[side] }}
        >
          {content}
        </span>
      ) : null}
    </span>
  );
}
