import React from "react";


export function Card({ interactive = false, flush = false, bevel = false, className = "", children, ...rest }) {
  return <div className={["b3-card", interactive && "b3-card--interactive", flush && "b3-card--flush", bevel && "b3-bevel", className].filter(Boolean).join(" ")} {...rest}>{children}</div>;
}
export function CardHeader({ title, description, icon: Icon, action, className = "", children, ...rest }) {
  return (
    <div className={["b3-card__header", className].filter(Boolean).join(" ")} {...rest}>
      <div style={{ display: "flex", gap: 10, minWidth: 0 }}>
        {Icon ? <span className="b3-card__icon"><Icon aria-hidden width={16} height={16} /></span> : null}
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
export function CardContent({ className = "", children, ...rest }) {
  return <div className={["b3-card__content", className].filter(Boolean).join(" ")} {...rest}>{children}</div>;
}
export function CardFooter({ className = "", children, ...rest }) {
  return <div className={["b3-card__footer", className].filter(Boolean).join(" ")} {...rest}>{children}</div>;
}
