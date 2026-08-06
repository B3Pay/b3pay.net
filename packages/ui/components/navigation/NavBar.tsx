import React from "react";

export interface NavLink {
  label: string;
  href?: string;
  /** Render the link with something other than <a> — e.g. a router <Link>. */
  render?: (props: {
    className: string;
    "data-active"?: true;
    children: React.ReactNode;
  }) => React.ReactNode;
}

/** Marketing / docs top bar. Translucent with a blur, hairline bottom border. */
export interface NavBarProps extends React.HTMLAttributes<HTMLElement> {
  links?: NavLink[];
  /** Label of the current link. */
  active?: string;
  /** Left slot — normally `<BrandMark />`. */
  brand?: React.ReactNode;
  /** Right slot — normally two Buttons. */
  actions?: React.ReactNode;
  /** @default true */
  sticky?: boolean;
}

export function NavBar({
  links = [],
  active,
  brand,
  actions,
  sticky = true,
  className = "",
  style,
  ...rest
}: NavBarProps) {
  return (
    <header
      className={className}
      style={{
        position: sticky ? "sticky" : "relative",
        top: 0,
        zIndex: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
        height: 64,
        padding: "0 24px",
        borderBottom: "1px solid var(--border)",
        background: "color-mix(in srgb,var(--background) 78%,transparent)",
        backdropFilter: "blur(14px)",
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 28, minWidth: 0 }}>
        {brand}
        <nav className="b3-nav" aria-label="Primary">
          {links.map((l) => {
            const isActive = l.label === active || undefined;
            const props = {
              className: "b3-nav__link",
              "data-active": isActive,
              children: l.label,
            } as const;
            return (
              <React.Fragment key={l.href || l.label}>
                {l.render ? (
                  l.render(props)
                ) : (
                  <a href={l.href || "#"} {...props} aria-current={isActive && "page"} />
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>
      {actions ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: "none" }}>
          {actions}
        </div>
      ) : null}
    </header>
  );
}
