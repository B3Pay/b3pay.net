import React from "react";

/** Panel surface. The app's primary container for workflows, packages and docs. */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Adds pointer cursor plus a Forge-tinted border on hover. @default false */
  interactive?: boolean;
  /** Transparent background — for cards sitting on an already-raised surface. @default false */
  flush?: boolean;
  /** Machined corner cut. @default false */
  bevel?: boolean;
}

// `title` is a ReactNode here, not the DOM's tooltip string — so it replaces
// the inherited attribute rather than colliding with it.
export interface CardHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Glyph shown in the Forge-tinted icon tile. */
  icon?: React.ComponentType<React.SVGAttributes<SVGElement>>;
  /** Right-aligned slot — usually a Badge or icon Button. */
  action?: React.ReactNode;
}

export function Card({
  interactive = false,
  flush = false,
  bevel = false,
  className = "",
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={[
        "b3-card",
        interactive && "b3-card--interactive",
        flush && "b3-card--flush",
        bevel && "b3-bevel",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  description,
  icon: Icon,
  action,
  className = "",
  children,
  ...rest
}: CardHeaderProps) {
  return (
    <div className={["b3-card__header", className].filter(Boolean).join(" ")} {...rest}>
      <div style={{ display: "flex", gap: 10, minWidth: 0 }}>
        {Icon ? (
          <span className="b3-card__icon">
            <Icon aria-hidden width={16} height={16} />
          </span>
        ) : null}
        <div style={{ minWidth: 0 }}>
          {title ? <h3 className="b3-card__title">{title}</h3> : null}
          {description ? <p className="b3-card__desc">{description}</p> : null}
          {children}
        </div>
      </div>
      {action ? <div style={{ flex: "none" }}>{action}</div> : null}
    </div>
  );
}

export function CardContent({
  className = "",
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={["b3-card__content", className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </div>
  );
}

export function CardFooter({
  className = "",
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={["b3-card__footer", className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </div>
  );
}
