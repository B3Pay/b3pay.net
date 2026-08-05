import type { HTMLAttributes } from "react";

/**
 * B3Pay brand lockup — the stroked B mark with the Forge node, optionally set
 * beside or above the wordmark.
 *
 */
export interface BrandMarkProps extends HTMLAttributes<HTMLSpanElement> {
  /** Lockup arrangement. @default "horizontal" */
  variant?: "horizontal" | "stacked" | "mark";
  /** Colour treatment. `current` inherits `color` from the parent. @default "onDark" */
  tone?: "onDark" | "onLight" | "forge" | "current";
  /** Height of the mark in px. The wordmark scales from it. @default 32 */
  size?: number;
  /** Override the wordmark text. @default "B3Pay" */
  wordmark?: string;
}

export declare function BrandMark(props: BrandMarkProps): JSX.Element;
