import type { HTMLAttributes } from "react";

/**
 * Truncated, click-to-copy principal or canister ID. Always mono.
 *
 */
export interface PrincipalDisplayProps extends HTMLAttributes<HTMLSpanElement> {
  /** Full principal text. */
  value?: string;
  /** Dash-separated groups kept at the start. @default 5 */
  head?: number;
  /** Groups kept at the end. @default 3 */
  tail?: number;
  /** @default true */
  copyable?: boolean;
}
export declare function PrincipalDisplay(props: PrincipalDisplayProps): JSX.Element;
