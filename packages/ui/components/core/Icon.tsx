import React from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowRightLeft,
  ArrowUpRight,
  BookOpen,
  Bot,
  Box,
  Braces,
  Check,
  CircleAlert,
  CircleCheck,
  Coins,
  Copy,
  FileCode,
  FileText,
  Filter,
  GitBranch,
  GitCompare,
  Github,
  Info,
  Key,
  Mail,
  Menu,
  MessageSquare,
  MoreVertical,
  Package,
  Pencil,
  Play,
  RotateCcw,
  Search,
  Settings,
  Share2,
  Terminal,
  Timer,
  Trash2,
  TriangleAlert,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * The registry backing `Icon`.
 *
 * The prototype resolved names against the Lucide UMD bundle at runtime, which
 * a real build cannot do — a `<Icon name={string} />` API and tree-shaking are
 * mutually exclusive unless the reachable set is written down. This is that
 * set: every glyph the design system and b3pay.net use. Names are Lucide's own
 * PascalCase, so they map 1:1 with `lucide-react`'s named exports.
 *
 * Consuming apps add their own with `registerIcons`.
 */
const REGISTRY: Record<string, LucideIcon> = {
  ArrowLeft,
  ArrowRight,
  ArrowRightLeft,
  ArrowUpRight,
  BookOpen,
  Bot,
  Box,
  Braces,
  Check,
  CircleAlert,
  CircleCheck,
  Coins,
  Copy,
  FileCode,
  FileText,
  Filter,
  GitBranch,
  GitCompare,
  Github,
  Info,
  Key,
  Mail,
  Menu,
  MessageSquare,
  MoreVertical,
  Package,
  Pencil,
  Play,
  RotateCcw,
  Search,
  Settings,
  Share2,
  Terminal,
  Timer,
  Trash2,
  TriangleAlert,
  Wrench,
  X,
  Zap,
};

const warned = new Set<string>();
const bound = new Map<
  string,
  React.ComponentType<React.SVGAttributes<SVGElement>>
>();

/** Add glyphs to the registry, e.g. `registerIcons({ Rocket })`. */
export function registerIcons(icons: Record<string, LucideIcon>): void {
  Object.assign(REGISTRY, icons);
  for (const name of Object.keys(icons)) bound.delete(name);
}

/** The names `Icon` currently resolves. */
export function iconNames(): string[] {
  return Object.keys(REGISTRY).sort();
}

/**
 * Lucide icon. Lucide is the icon set the B3Forge app uses — name icons
 * exactly as Lucide does (PascalCase).
 */
export interface IconProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, "name"> {
  /** Lucide icon name, PascalCase, e.g. "GitBranch". */
  name: string;
  /** @default 16 */
  size?: number;
  /** @default 2 */
  strokeWidth?: number;
}

export function Icon({
  name,
  size = 16,
  strokeWidth = 2,
  className = "",
  style,
  ...rest
}: IconProps) {
  const Glyph = REGISTRY[name];
  const shared = {
    width: size,
    height: size,
    strokeWidth,
    className,
    style: { flex: "none", display: "block", ...style } as React.CSSProperties,
    "aria-hidden": true as const,
    ...rest,
  };
  if (!Glyph) {
    if (!warned.has(name)) {
      warned.add(name);
      console.warn(
        `[b3pay/ui] Icon "${name}" is not registered. Add it with registerIcons({ ${name} }).`,
      );
    }
    // Same empty frame the prototype rendered before the CDN bundle resolved,
    // so layout does not shift on a missing name.
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...shared}
      />
    );
  }
  return <Glyph {...shared} />;
}

/**
 * Returns a component bound to `name`, for props that take an icon component.
 *
 * Cached by name: call sites pass this inline (`icon={IconOf("Play")}`), and a
 * fresh component identity on every render would remount the glyph each time.
 */
export function IconOf(
  name: string,
): React.ComponentType<React.SVGAttributes<SVGElement>> {
  const hit = bound.get(name);
  if (hit) return hit;
  // SVGAttributes types strokeWidth as string | number; Icon takes a number.
  const C = ({ strokeWidth, ...p }: React.SVGAttributes<SVGElement>) => (
    <Icon
      name={name}
      strokeWidth={strokeWidth == null ? undefined : Number(strokeWidth)}
      {...p}
    />
  );
  C.displayName = `Icon(${name})`;
  bound.set(name, C);
  return C;
}
