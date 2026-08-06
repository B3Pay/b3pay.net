import React from "react";

import { useOverlay } from "./use-overlay";

/** Right-hand panel. The node inspector idiom — edit alongside the thing being edited. */
export interface DrawerProps {
  /** @default true */
  open?: boolean;
  title?: React.ReactNode;
  onClose?: () => void;
  footer?: React.ReactNode;
  width?: number | string;
  className?: string;
  children?: React.ReactNode;
}

export function Drawer({
  open = true,
  title,
  onClose,
  footer,
  width,
  className = "",
  children,
}: DrawerProps) {
  const ref = React.useRef<HTMLElement>(null);
  const titleId = React.useId();
  useOverlay(open, onClose, ref);
  if (!open) return null;
  return (
    <>
      <div className="b3-overlay" onClick={onClose} />
      <aside
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={["b3-drawer", className].filter(Boolean).join(" ")}
        style={width ? { width } : undefined}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "0 16px",
            height: 52,
            borderBottom: "1px solid var(--border)",
            flex: "none",
          }}
        >
          <span
            id={titleId}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-md)",
              fontWeight: "var(--weight-semibold)" as React.CSSProperties["fontWeight"],
            }}
          >
            {title}
          </span>
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
        </header>
        <div style={{ flex: 1, minHeight: 0, overflow: "auto", padding: 16 }}>
          {children}
        </div>
        {footer ? (
          <footer
            style={{
              display: "flex",
              gap: 8,
              padding: 16,
              borderTop: "1px solid var(--border)",
              flex: "none",
            }}
          >
            {footer}
          </footer>
        ) : null}
      </aside>
    </>
  );
}
