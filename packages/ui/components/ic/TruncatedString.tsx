import React from "react";

/** Clips a long string to `max` characters and keeps the full value in the tooltip. */
export interface TruncatedStringProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  value?: string;
  /** @default 32 */
  max?: number;
  /** @default true */
  mono?: boolean;
}

export function TruncatedString({
  value = "",
  max = 32,
  mono = true,
  className = "",
  style,
  ...rest
}: TruncatedStringProps) {
  const short = value.length > max ? value.slice(0, max - 1) + "…" : value;
  return (
    <span
      className={className}
      title={value}
      style={{ fontFamily: mono ? "var(--font-mono)" : undefined, ...style }}
      {...rest}
    >
      {short}
    </span>
  );
}
