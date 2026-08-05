import React from "react";

export interface MenuItem {
  type?: "item" | "separator" | "label";
  label?: React.ReactNode;
  icon?: React.ComponentType<React.SVGAttributes<SVGElement>>;
  shortcut?: string;
  active?: boolean;
  color?: "default" | "error";
  onSelect?: () => void;
}

/** Action menu hung off a trigger. Group with `separator`, head sections with `label`. */
export interface DropdownMenuProps {
  trigger: React.ReactNode;
  items?: MenuItem[];
  /** @default "start" */
  align?: "start" | "end";
  className?: string;
}

export function DropdownMenu({
  trigger,
  items = [],
  align = "start",
  className = "",
}: DropdownMenuProps) {
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
          role="menu"
          className="b3-surface b3-menu"
          style={{
            position: "absolute",
            zIndex: 40,
            top: "calc(100% + 6px)",
            [align === "end" ? "right" : "left"]: 0,
          }}
        >
          {items.map((it, i) => {
            if (it.type === "separator") return <div key={i} className="b3-menu__sep" />;
            if (it.type === "label")
              return (
                <div key={i} className="b3-menu__label">
                  {it.label}
                </div>
              );
            const Icon = it.icon;
            return (
              <button
                key={i}
                type="button"
                role="menuitem"
                className="b3-menu__item"
                data-active={it.active || undefined}
                style={it.color === "error" ? { color: "var(--error)" } : undefined}
                onClick={() => {
                  it.onSelect?.();
                  setOpen(false);
                }}
              >
                {Icon ? <Icon width={13} height={13} aria-hidden /> : null}
                <span style={{ flex: 1 }}>{it.label}</span>
                {it.shortcut ? <kbd className="b3-kbd">{it.shortcut}</kbd> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </span>
  );
}
