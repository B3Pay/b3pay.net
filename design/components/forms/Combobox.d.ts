import type { B3Size } from "../core/Button";
/** Searchable single-select. Use when the option list is long or unbounded (canisters, methods). */
export interface ComboboxProps {
  options?: Array<string | { value: string; label: string }>;
  value?: string;
  onSelect?: (value: string) => void;
  /** @default "Search…" */
  placeholder?: string;
  /** @default "md" */
  size?: B3Size;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Combobox(props: ComboboxProps): JSX.Element;
