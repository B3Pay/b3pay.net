import type { HTMLAttributes, ComponentType, SVGAttributes, ReactNode } from "react";
/** Drag-and-drop file target. Used for Candid `.did` uploads and WASM modules. */
export interface FileDropzoneProps extends Omit<HTMLAttributes<HTMLLabelElement>, "onDrop"> {
  label?: ReactNode;
  hint?: ReactNode;
  icon?: ComponentType<SVGAttributes<SVGElement>>;
  onFiles?: (files: File[]) => void;
}
export declare function FileDropzone(props: FileDropzoneProps): JSX.Element;
