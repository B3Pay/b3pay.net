import type { MouseEvent } from "react";
import type { NavigateFunction } from "react-router-dom";

/**
 * Props that make a `Button` a real link and a client-side route at once.
 *
 * `Button` renders whatever `as` says, so a CTA can carry a genuine href —
 * middle-click, "open in new tab" and crawlers all work — while a plain left
 * click still routes without a page load.
 */
export function linkProps(navigate: NavigateFunction, to: string) {
  return {
    as: "a" as const,
    href: to,
    onClick: (e: MouseEvent<HTMLElement>) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      navigate(to);
    },
  };
}
