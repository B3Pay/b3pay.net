/**
 * @b3pay/ui — the B3Pay design system.
 *
 * Tokens and interaction states are CSS (`@b3pay/ui/styles.css`); this barrel is
 * the component surface. 30 primitives, converted from the design-system
 * prototype with the props contracts from each `<Name>.d.ts` folded in.
 *
 * Read `readme.md` for the brand guide and `components/<group>/<Name>.prompt.md`
 * for per-component usage.
 */

/* ── brand ─────────────────────────────────────────────────────────── */
export { BrandMark } from "./components/brand/BrandMark";
export type { BrandMarkProps } from "./components/brand/BrandMark";

/* ── core ──────────────────────────────────────────────────────────── */
export { Button } from "./components/core/Button";
export type { ButtonProps } from "./components/core/Button";
export { Badge } from "./components/core/Badge";
export type { BadgeProps } from "./components/core/Badge";
export { Card, CardHeader, CardContent, CardFooter } from "./components/core/Card";
export type { CardProps, CardHeaderProps } from "./components/core/Card";
export { Box } from "./components/core/Box";
export type { BoxProps, SpaceStep } from "./components/core/Box";
export { Kbd } from "./components/core/Kbd";
export type { KbdProps } from "./components/core/Kbd";
export { Label } from "./components/core/Label";
export type { LabelProps } from "./components/core/Label";
export { Icon, IconOf, registerIcons, iconNames } from "./components/core/Icon";
export type { IconProps } from "./components/core/Icon";
export { CodeBlock } from "./components/core/CodeBlock";
export type { CodeBlockProps } from "./components/core/CodeBlock";
export { toneVars } from "./components/core/tone";
export type { B3Color, B3Size } from "./components/core/tone";

/* ── forms ─────────────────────────────────────────────────────────── */
export { Input } from "./components/forms/Input";
export type { InputProps } from "./components/forms/Input";
export { Textarea } from "./components/forms/Textarea";
export type { TextareaProps } from "./components/forms/Textarea";
export { Select } from "./components/forms/Select";
export type { SelectProps, SelectOption } from "./components/forms/Select";
export { Checkbox } from "./components/forms/Checkbox";
export type { CheckboxProps } from "./components/forms/Checkbox";
export { Switch } from "./components/forms/Switch";
export type { SwitchProps } from "./components/forms/Switch";
export { Combobox } from "./components/forms/Combobox";
export type { ComboboxProps, ComboboxOption } from "./components/forms/Combobox";
export { FieldError } from "./components/forms/FieldError";
export type { FieldErrorProps } from "./components/forms/FieldError";
export { FileDropzone } from "./components/forms/FileDropzone";
export type { FileDropzoneProps } from "./components/forms/FileDropzone";

/* ── feedback ──────────────────────────────────────────────────────── */
export { Alert } from "./components/feedback/Alert";
export type { AlertProps } from "./components/feedback/Alert";
export { Toast } from "./components/feedback/Toast";
export type { ToastProps } from "./components/feedback/Toast";
export { Toaster, toast } from "./components/feedback/toaster";
export type { ToasterProps, ToastOptions } from "./components/feedback/toaster";
export { Tooltip } from "./components/feedback/Tooltip";
export type { TooltipProps } from "./components/feedback/Tooltip";
export { ErrorDisplay } from "./components/feedback/ErrorDisplay";
export type { ErrorDisplayProps } from "./components/feedback/ErrorDisplay";

/* ── overlay ───────────────────────────────────────────────────────── */
export { Dialog } from "./components/overlay/Dialog";
export type { DialogProps } from "./components/overlay/Dialog";
export { Drawer } from "./components/overlay/Drawer";
export type { DrawerProps } from "./components/overlay/Drawer";
export { Popover } from "./components/overlay/Popover";
export type { PopoverProps } from "./components/overlay/Popover";
export { DropdownMenu } from "./components/overlay/DropdownMenu";
export type { DropdownMenuProps, MenuItem } from "./components/overlay/DropdownMenu";
export { Command } from "./components/overlay/Command";
export type {
  CommandProps,
  CommandGroup,
  CommandItem,
} from "./components/overlay/Command";
export { useOverlay } from "./components/overlay/use-overlay";

/* ── navigation ────────────────────────────────────────────────────── */
export { Tabs } from "./components/navigation/Tabs";
export type { TabsProps, TabItem } from "./components/navigation/Tabs";
export { NavBar } from "./components/navigation/NavBar";
export type { NavBarProps, NavLink } from "./components/navigation/NavBar";
export { SideNav } from "./components/navigation/SideNav";
export type {
  SideNavProps,
  SideNavItem,
  SideNavSection,
} from "./components/navigation/SideNav";
export { Shell } from "./components/navigation/Shell";
export type { ShellProps } from "./components/navigation/Shell";

/* ── internet computer ─────────────────────────────────────────────── */
export { PrincipalDisplay } from "./components/ic/PrincipalDisplay";
export type { PrincipalDisplayProps } from "./components/ic/PrincipalDisplay";
export { TruncatedString } from "./components/ic/TruncatedString";
export type { TruncatedStringProps } from "./components/ic/TruncatedString";
export { WorkflowNode } from "./components/ic/WorkflowNode";
export type {
  WorkflowNodeProps,
  WorkflowNodeKind,
} from "./components/ic/WorkflowNode";
