import React from "react";

/** App chrome: fixed bar over a sidebar + scrolling main. The bar carries a Forge heat line. */
export interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Contents of the top bar. */
  bar?: React.ReactNode;
  /** Contents of the left rail. Omit for a full-width layout. */
  aside?: React.ReactNode;
}

export function Shell({ bar, aside, className = "", children, ...rest }: ShellProps) {
  return (
    <div className={["b3-shell", className].filter(Boolean).join(" ")} {...rest}>
      {bar ? <div className="b3-shell__bar">{bar}</div> : null}
      <div className="b3-shell__body">
        {aside ? <aside className="b3-shell__aside">{aside}</aside> : null}
        <main className="b3-shell__main">{children}</main>
      </div>
    </div>
  );
}
