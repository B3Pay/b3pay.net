import type { MouseEvent } from "react";
import type { NavigateFunction } from "react-router-dom";

/**
 * Props that make a `Button` a real link and a client-side route at once.
 *
 * `Button` renders whatever `as` says, so the pager can carry a genuine href —
 * middle-click, "open in new tab" and crawlers all work — while a plain left
 * click still routes without a page load.
 *
 * Same helper as apps/web/src/lib/router-link.ts. Duplicated rather than
 * hoisted into @b3pay/ui: it is app composition over the router, and the design
 * system has no router dependency.
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
