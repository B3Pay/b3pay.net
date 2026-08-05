import type { HTMLAttributes } from "react";
/**
 * Code sample with an optional filename bar and copy button. The docs workhorse.
 *
 */
export interface CodeBlockProps extends HTMLAttributes<HTMLDivElement> {
  code?: string;
  /** Shown in the header when no filename is given. */
  lang?: string;
  filename?: string;
  /** @default true */
  copyable?: boolean;
  /** @default false */
  numbered?: boolean;
}
export declare function CodeBlock(props: CodeBlockProps): JSX.Element;
