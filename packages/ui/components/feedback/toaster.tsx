import React from "react";
import { Toaster as SonnerToaster, toast as sonner } from "sonner";
import type { ToasterProps as SonnerToasterProps } from "sonner";

import { Toast } from "./Toast";
import type { B3Color } from "../core/tone";

/**
 * Toast, wired to a real provider.
 *
 * `Toast` on its own is presentational. Sonner is what the B3Forge app uses
 * (`frontend/shared/ui/sonner`), so both apps queue, stack and dismiss the same
 * way. Sonner supplies only the lifecycle here — every toast renders through
 * `Toast`, so the visual output is the design system's, not sonner's.
 */
export interface ToastOptions {
  /** @default "secondary" */
  color?: B3Color;
  icon?: React.ComponentType<React.SVGAttributes<SVGElement>>;
  description?: React.ReactNode;
  /** ms before auto-dismiss. @default 4000 */
  duration?: number;
  /** Keep it up until dismissed. */
  persist?: boolean;
}

function push(title: React.ReactNode, opts: ToastOptions = {}) {
  const { color = "secondary", icon, description, duration = 4000, persist } = opts;
  return sonner.custom(
    (id) => (
      <Toast color={color} title={title} icon={icon} onDismiss={() => sonner.dismiss(id)}>
        {description}
      </Toast>
    ),
    { duration: persist ? Infinity : duration },
  );
}

/**
 * Fire a toast. `toast("Copied")`, or with a tone:
 * `toast.success("Workflow published", { description: "Anyone can fork it." })`.
 */
export const toast = Object.assign(push, {
  success: (t: React.ReactNode, o: ToastOptions = {}) => push(t, { ...o, color: "success" }),
  error: (t: React.ReactNode, o: ToastOptions = {}) => push(t, { ...o, color: "error" }),
  warning: (t: React.ReactNode, o: ToastOptions = {}) => push(t, { ...o, color: "warning" }),
  info: (t: React.ReactNode, o: ToastOptions = {}) => push(t, { ...o, color: "info" }),
  primary: (t: React.ReactNode, o: ToastOptions = {}) => push(t, { ...o, color: "primary" }),
  dismiss: sonner.dismiss,
  /** The raw sonner instance, for promise toasts and other lifecycle helpers. */
  raw: sonner,
});

export type ToasterProps = SonnerToasterProps;

/**
 * Mount once, near the root.
 *
 * Every toast goes through `sonner.custom`, which sonner renders with
 * `data-styled="false"` — it contributes stacking and lifecycle, none of its
 * own surface. `.b3-toast` in `b3-components.css` stays the only thing painting.
 */
export function Toaster(props: ToasterProps) {
  return <SonnerToaster position="bottom-right" gap={10} offset={24} visibleToasts={4} {...props} />;
}
