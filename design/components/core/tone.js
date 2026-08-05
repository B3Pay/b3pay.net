const TONE = {
  primary: ["var(--primary)", "var(--primary-foreground)"],
  secondary: ["var(--foreground)", "var(--background)"],
  error: ["var(--error)", "var(--error-foreground)"],
  success: ["var(--success)", "var(--success-foreground)"],
  warning: ["var(--warning)", "var(--warning-foreground)"],
  info: ["var(--info)", "var(--info-foreground)"],
  alert: ["var(--alert)", "var(--alert-foreground)"],
  muted: ["var(--muted-foreground)", "var(--background)"],
};
export function toneVars(color) {
  const [c, fg] = TONE[color] || TONE.secondary;
  return { "--c": c, "--c-fg": fg };
}
