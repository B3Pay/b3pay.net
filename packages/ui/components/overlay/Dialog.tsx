import React from "react";

import { useOverlay } from "./use-overlay";

/** Modal dialog. Blocks the page — reserve it for decisions that cannot be deferred. */
export interface DialogProps {
  /** @default true */
  open?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Action row, right-aligned. */
  footer?: React.ReactNode;
  onClose?: () => void;
  /** Override the 520px default width. */
  width?: number | string;
  className?: string;
  children?: React.ReactNode;
}

export function Dialog({
  open = true,
  title,
  description,
  footer,
  onClose,
  width,
  className = "",
  children,
}: DialogProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();
  const descId = React.useId();
  useOverlay(open, onClose, ref);
  if (!open) return null;
  return (
    <>
      <div className="b3-overlay" onClick={onClose} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        className={["b3-dialog", className].filter(Boolean).join(" ")}
        style={width ? { width } : undefined}
      >
        <div
          style={{
            padding: "18px 20px 0",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            {title ? (
              <h2
                id={titleId}
                style={{
                  margin: 0,
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-xl)",
                  fontWeight: "var(--weight-semibold)" as React.CSSProperties["fontWeight"],
                  letterSpacing: "var(--tracking-tighter)",
                }}
              >
                {title}
              </h2>
            ) : null}
            {description ? (
              <p
                id={descId}
                style={{
                  margin: "6px 0 0",
                  fontSize: "var(--text-base)",
                  lineHeight: "var(--text-base-lh)",
                  color: "var(--muted-foreground)",
                }}
              >
                {description}
              </p>
            ) : null}
          </div>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              style={{
                background: "none",
                border: 0,
                color: "var(--muted-foreground)",
                cursor: "pointer",
                fontSize: 18,
                lineHeight: 1,
              }}
            >
              ×
            </button>
          ) : null}
        </div>
        <div style={{ padding: "16px 20px" }}>{children}</div>
        {footer ? (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              padding: "0 20px 18px",
            }}
          >
            {footer}
          </div>
        ) : null}
      </div>
    </>
  );
}
