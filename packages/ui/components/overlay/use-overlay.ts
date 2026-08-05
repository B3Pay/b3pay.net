import React from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type=hidden])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function focusables(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement,
  );
}

/**
 * The behaviour a modal surface owes the keyboard: Escape closes it, Tab stays
 * inside it, and focus goes back where it came from on close.
 *
 * The prototype had none of this — it had no router either. Overlays that trap
 * a keyboard user are the one thing a design prototype can hide and a shipped
 * site cannot.
 */
export function useOverlay(
  open: boolean,
  onClose: (() => void) | undefined,
  ref: React.RefObject<HTMLElement | null>,
) {
  const restoreTo = React.useRef<HTMLElement | null>(null);

  // Captured during render, not in the effect: React applies `autoFocus` during
  // commit, so by the time an effect runs the active element is already inside
  // the overlay and the trigger is lost.
  if (open && !restoreTo.current && typeof document !== "undefined") {
    restoreTo.current = document.activeElement as HTMLElement | null;
  }

  React.useEffect(() => {
    if (!open) {
      restoreTo.current = null;
      return;
    }

    const node = ref.current;
    if (node) {
      const first = focusables(node)[0];
      if (first) first.focus();
      else {
        node.tabIndex = -1;
        node.focus();
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose?.();
        return;
      }
      if (e.key !== "Tab") return;
      const el = ref.current;
      if (!el) return;
      const items = focusables(el);
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || !el.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !el.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = prevOverflow;
      const back = restoreTo.current;
      restoreTo.current = null;
      if (back && document.contains(back)) back.focus();
    };
  }, [open, onClose, ref]);
}
