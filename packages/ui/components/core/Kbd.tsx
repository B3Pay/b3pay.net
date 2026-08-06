import React from "react";

/** Keyboard key cap. Used in the command palette and docs shortcuts. */
export interface KbdProps extends React.HTMLAttributes<HTMLElement> {}

export function Kbd({ className = "", children, ...rest }: KbdProps) {
  return (
    <kbd className={["b3-kbd", className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </kbd>
  );
}
