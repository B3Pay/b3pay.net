import type { CSSProperties } from "react";

export type B3Color =
  | "primary"
  | "secondary"
  | "error"
  | "success"
  | "warning"
  | "info"
  | "alert"
  | "muted";

export type B3Size = "xs" | "sm" | "md" | "lg" | "xl";

const TONE: Record<B3Color, [string, string]> = {
  primary: ["var(--primary)", "var(--primary-foreground)"],
  secondary: ["var(--foreground)", "var(--background)"],
  error: ["var(--error)", "var(--error-foreground)"],
  success: ["var(--success)", "var(--success-foreground)"],
  warning: ["var(--warning)", "var(--warning-foreground)"],
  info: ["var(--info)", "var(--info-foreground)"],
  alert: ["var(--alert)", "var(--alert-foreground)"],
  muted: ["var(--muted-foreground)", "var(--background)"],
};

/** The --c / --c-fg indirection every variant in b3-components.css reads. */
export function toneVars(color?: B3Color): CSSProperties {
  const [c, fg] = TONE[color as B3Color] || TONE.secondary;
  return { "--c": c, "--c-fg": fg } as CSSProperties;
}
