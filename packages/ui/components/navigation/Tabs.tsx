import React from "react";

export interface TabItem {
  value: string;
  label: React.ReactNode;
  icon?: React.ComponentType<React.SVGAttributes<SVGElement>>;
  count?: number;
}

/**
 * Tab switcher. `segmented` for in-panel view swaps, `underline` for page-level
 * sections.
 */
export interface TabsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  tabs?: Array<string | TabItem>;
  value?: string;
  onChange?: (value: string) => void;
  /** @default "segmented" */
  variant?: "segmented" | "underline";
}

export function Tabs({
  tabs = [],
  value,
  onChange,
  variant = "segmented",
  className = "",
  ...rest
}: TabsProps) {
  const values = tabs.map((t) => (typeof t === "string" ? t : t.value));

  // Roving arrow-key selection is what `role="tablist"` promises a screen reader.
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const i = values.indexOf(value ?? "");
    if (i < 0) return;
    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? (i + 1) % values.length
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? (i - 1 + values.length) % values.length
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? values.length - 1
              : -1;
    if (next < 0) return;
    e.preventDefault();
    onChange?.(values[next]);
    (e.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]')[next])?.focus();
  };

  return (
    <div
      role="tablist"
      onKeyDown={onKeyDown}
      className={["b3-tabs", variant === "underline" && "b3-tabs--underline", className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {tabs.map((t) => {
        const v = typeof t === "string" ? t : t.value;
        const l = typeof t === "string" ? t : t.label;
        const Icon = typeof t === "string" ? null : t.icon;
        const selected = v === value;
        return (
          <button
            key={v}
            type="button"
            role="tab"
            className="b3-tab"
            data-state={selected ? "active" : undefined}
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange?.(v)}
          >
            {Icon ? <Icon width={13} height={13} aria-hidden /> : null}
            {l}
            {typeof t === "object" && t.count != null ? (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--muted-foreground)",
                }}
              >
                {t.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
