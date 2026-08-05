import type { InputHTMLAttributes, ReactNode } from "react";
/** Binary toggle for settings that apply immediately. */
export interface SwitchProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
}
export declare function Switch(props: SwitchProps): JSX.Element;
