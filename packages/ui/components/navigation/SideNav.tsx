import React from "react";

export interface SideNavItem {
  value: string;
  label: React.ReactNode;
  icon?: React.ComponentType<React.SVGAttributes<SVGElement>>;
  badge?: string;
}
export interface SideNavSection {
  label?: string;
  items: SideNavItem[];
}

/** Grouped left-rail navigation. Section labels render as mono eyebrows. */
// `onSelect` here is the item callback, not the DOM select event.
export interface SideNavProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onSelect"> {
  sections?: SideNavSection[];
  active?: string;
  onSelect?: (value: string) => void;
}

export function SideNav({
  sections = [],
  active,
  onSelect,
  className = "",
  ...rest
}: SideNavProps) {
  return (
    <nav
      className={className}
      style={{ display: "flex", flexDirection: "column", gap: 18 }}
      {...rest}
    >
      {sections.map((s, i) => (
        <div key={i}>
          {s.label ? (
            <div className="b3-eyebrow" style={{ padding: "0 8px 6px" }}>
              {s.label}
            </div>
          ) : null}
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {s.items.map((it) => {
              const Icon = it.icon;
              const isActive = it.value === active;
              return (
                <button
                  key={it.value}
                  type="button"
                  className="b3-menu__item"
                  data-active={isActive || undefined}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => onSelect?.(it.value)}
                >
                  {Icon ? <Icon width={13} height={13} aria-hidden /> : null}
                  <span style={{ flex: 1 }}>{it.label}</span>
                  {it.badge ? (
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 9,
                        color: "var(--muted-foreground)",
                      }}
                    >
                      {it.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
