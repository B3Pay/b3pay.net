import React from "react";


export function Shell({ bar, aside, className = "", children, ...rest }) {
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
