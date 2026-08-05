import React from "react";

/** Truncated, click-to-copy principal or canister ID. Always mono. */
export interface PrincipalDisplayProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /** Full principal text. */
  value?: string;
  /** Dash-separated groups kept at the start. @default 5 */
  head?: number;
  /** Groups kept at the end. @default 3 */
  tail?: number;
  /** @default true */
  copyable?: boolean;
}

export function PrincipalDisplay({
  value = "",
  head: h = 5,
  tail = 3,
  copyable = true,
  className = "",
  ...rest
}: PrincipalDisplayProps) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const parts = value.split("-");
  const short =
    parts.length > h + tail
      ? [...parts.slice(0, h), "…", ...parts.slice(-tail)].join("-")
      : value;

  const copy = () => {
    if (!copyable) return;
    try {
      navigator.clipboard.writeText(value);
    } catch {
      /* clipboard unavailable — the full value is in the title attribute */
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1200);
  };

  return (
    <span
      className={["b3-principal", className].filter(Boolean).join(" ")}
      title={value}
      role={copyable ? "button" : undefined}
      tabIndex={copyable ? 0 : undefined}
      aria-label={copyable ? `Copy ${value}` : undefined}
      style={copyable ? undefined : { cursor: "default" }}
      onClick={copy}
      onKeyDown={
        copyable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                copy();
              }
            }
          : undefined
      }
      {...rest}
    >
      {short}
      {copyable ? (
        <span style={{ opacity: 0.6, fontSize: 9 }} aria-hidden>
          {copied ? "copied" : "copy"}
        </span>
      ) : null}
    </span>
  );
}
