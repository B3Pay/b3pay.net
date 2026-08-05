import type { HTMLAttributes, ComponentType, SVGAttributes, ReactNode } from "react";
/**
 * A node in the B3Forge workflow graph. `kind` selects the accent colour —
 * the same five-kind system the app ships (`data-node-kind`).
 */
export interface WorkflowNodeProps extends HTMLAttributes<HTMLDivElement> {
  /** @default "query" */
  kind?: "trigger" | "variables" | "query" | "update" | "utility";
  /** Position in the graph — rendered as the `$N<index>` reference handle. @default 0 */
  index?: number;
  title?: ReactNode;
  /** Usually the canister ID or method name. */
  subtitle?: ReactNode;
  icon?: ComponentType<SVGAttributes<SVGElement>>;
  /** @default false */
  selected?: boolean;
  /** Show the left/right connection ports. @default true */
  ports?: boolean;
}
export declare function WorkflowNode(props: WorkflowNodeProps): JSX.Element;
