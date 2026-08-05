import React from "react";


export function PrincipalDisplay({ value = "", head: h = 5, tail = 3, copyable = true, className = "", ...rest }) {
  const [copied, setCopied] = React.useState(false);
  const parts = value.split("-");
  const short = parts.length > h + tail ? [...parts.slice(0, h), "…", ...parts.slice(-tail)].join("-") : value;
  return (
    <span className={["b3-principal", className].filter(Boolean).join(" ")} title={value}
      onClick={() => { if (!copyable) return; try { navigator.clipboard.writeText(value); } catch (e) {} setCopied(true); setTimeout(() => setCopied(false), 1200); }} {...rest}>
      {short}
      {copyable ? <span style={{ opacity: .6, fontSize: 9 }}>{copied ? "copied" : "copy"}</span> : null}
    </span>
  );
}
