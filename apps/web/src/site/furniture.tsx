import React from "react";

/**
 * Shared site furniture, from the design system's `ui_kits/website/site.jsx`.
 *
 * These are page composition, not design-system primitives — they live in the
 * app, not in @b3pay/ui, because only b3pay.net uses them.
 */

export interface SectionProps {
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  lead?: React.ReactNode;
  children?: React.ReactNode;
  /** 72px vertical rhythm instead of 120px. */
  tight?: boolean;
  bg?: string;
  /** The FIG. NN spec number in the eyebrow row. Decoration — `--text-mark`. */
  spec?: string;
  style?: React.CSSProperties;
  /**
   * Heading level for `title`. Page titles pass "h1"; in-page sections keep the
   * default so a document never skips a level.
   * @default "h2"
   */
  as?: "h1" | "h2";
  className?: string;
}

export function Section({
  eyebrow,
  title,
  lead,
  children,
  tight,
  bg,
  spec,
  style,
  as: Heading = "h2",
  className = "",
}: SectionProps) {
  return (
    <section
      className={["site-section", tight && "site-section--tight", className]
        .filter(Boolean)
        .join(" ")}
      style={{ background: bg, position: "relative", ...style }}
    >
      <div className="b3-colgrid" />
      <span className="b3-tick" style={{ left: 18, top: 18 }} />
      <span className="b3-tick" style={{ right: 18, bottom: 18 }} />
      <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative" }}>
        {eyebrow ? (
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <span className="b3-eyebrow">{eyebrow}</span>
            <hr className="b3-rule-hot" style={{ flex: 1 }} />
            {spec ? (
              <span
                aria-hidden
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  letterSpacing: ".18em",
                  color: "var(--text-mark)",
                }}
              >
                {spec}
              </span>
            ) : null}
          </div>
        ) : null}
        {title ? (
          <Heading className="b3-display site-section__title" style={{ margin: 0, maxWidth: 820 }}>
            {title}
          </Heading>
        ) : null}
        {lead ? (
          <p
            style={{
              margin: "22px 0 0",
              fontSize: 18,
              lineHeight: "28px",
              color: "var(--muted-foreground)",
              maxWidth: 620,
              textWrap: "pretty",
            }}
          >
            {lead}
          </p>
        ) : null}
        {children ? (
          <div style={{ marginTop: title || lead ? 60 : 0 }}>{children}</div>
        ) : null}
      </div>
    </section>
  );
}

export const Rule = () => <div style={{ height: 1, background: "var(--border)" }} />;

export interface StatProps {
  value: React.ReactNode;
  label: React.ReactNode;
  unit?: string;
}

export const Stat = ({ value, label, unit }: StatProps) => (
  <div>
    <div
      style={{
        fontFamily: "var(--font-display)",
        fontSize: 42,
        fontWeight: 600,
        letterSpacing: "-0.03em",
        fontVariantNumeric: "tabular-nums",
        lineHeight: 1,
      }}
    >
      {value}
      {unit ? (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 14,
            color: "var(--muted-foreground)",
            marginLeft: 6,
          }}
        >
          {unit}
        </span>
      ) : null}
    </div>
    <div className="b3-eyebrow" style={{ marginTop: 10 }}>
      {label}
    </div>
  </div>
);

export interface SlabProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  /** @default true */
  glow?: boolean;
  /** Part number, top-right. Decoration — `--text-mark`. */
  part?: string;
  className?: string;
}

/** Machined stock: square corners, diagonal brackets, scanline, part number. */
export const Slab = ({ children, style, glow = true, part, className = "" }: SlabProps) => (
  <div
    className={["b3-bracket", "b3-scan", className].filter(Boolean).join(" ")}
    style={{
      position: "relative",
      background: "var(--ink-100)",
      border: "1px solid var(--border)",
      overflow: "hidden",
      ...style,
    }}
  >
    {glow ? (
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "var(--heat-glow)",
          pointerEvents: "none",
        }}
      />
    ) : null}
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "linear-gradient(90deg,var(--hairline) 1px,transparent 1px)",
        backgroundSize: "calc(100% / 8) 100%",
        pointerEvents: "none",
      }}
    />
    {part ? (
      <span
        aria-hidden
        style={{
          position: "absolute",
          right: 14,
          top: 12,
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: ".18em",
          color: "var(--text-mark)",
          zIndex: 1,
        }}
      >
        {part}
      </span>
    ) : null}
    <div style={{ position: "relative" }}>{children}</div>
  </div>
);
