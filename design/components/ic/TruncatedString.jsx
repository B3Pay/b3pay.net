import React from "react";


export function TruncatedString({ value = "", max = 32, mono = true, className = "", style, ...rest }) {
  const short = value.length > max ? value.slice(0, max - 1) + "…" : value;
  return <span className={className} title={value} style={{ fontFamily: mono ? "var(--font-mono)" : undefined, ...style }} {...rest}>{short}</span>;
}
