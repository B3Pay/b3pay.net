import React from "react";

/** Anchored floating panel for secondary content — filters, quick settings, share links. */
export interface PopoverProps {
  /** Element that toggles the panel. */
  trigger: React.ReactNode;
  /** @default "start" */
  align?: "start" | "end";
  /** @default 240 */
  width?: number | string;
  className?: string;
  children?: React.ReactNode;
}

export function Popover({
  trigger,
  align = "start",
  width = 240,
  className = "",
  children,
}: PopoverProps) {
  const [open, setOpen] = React.useState(false);
  const root = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
        root.current?.querySelector<HTMLElement>("button,a")?.focus();
      }
    };
    const onPointer = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [open]);

  return (
    <span
      ref={root}
      style={{ position: "relative", display: "inline-flex" }}
      className={className}
    >
      <span onClick={() => setOpen((o) => !o)}>{trigger}</span>
      {open ? (
        <div
          className="b3-surface"
          style={{
            position: "absolute",
            zIndex: 40,
            top: "calc(100% + 6px)",
            [align === "end" ? "right" : "left"]: 0,
            width,
            padding: 12,
            animation: "b3-dock-enter var(--dur-base) var(--ease-dock)",
          }}
        >
          {children}
        </div>
      ) : null}
    </span>
  );
}
