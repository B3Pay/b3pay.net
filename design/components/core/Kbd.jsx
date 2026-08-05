import React from "react";


export function Kbd({ className = "", children, ...rest }) {
  return <kbd className={["b3-kbd", className].filter(Boolean).join(" ")} {...rest}>{children}</kbd>;
}
