import React from "react";


export function Popover({ trigger, align = "start", width = 240, className = "", children }) {
  const [open, setOpen] = React.useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex" }} className={className}>
      <span onClick={() => setOpen((o) => !o)}>{trigger}</span>
      {open ? (
        <div className="b3-surface" style={{ position: "absolute", zIndex: 40, top: "calc(100% + 6px)", [align === "end" ? "right" : "left"]: 0, width, padding: 12, animation: "b3-dock-enter var(--dur-base) var(--ease-dock)" }}>
          {children}
        </div>
      ) : null}
    </span>
  );
}
