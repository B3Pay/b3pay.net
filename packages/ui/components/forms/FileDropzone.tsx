import React from "react";

/** Drag-and-drop file target. Used for Candid `.did` uploads and WASM modules. */
export interface FileDropzoneProps
  extends Omit<React.HTMLAttributes<HTMLLabelElement>, "onDrop"> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  icon?: React.ComponentType<React.SVGAttributes<SVGElement>>;
  onFiles?: (files: File[]) => void;
}

export function FileDropzone({
  label = "Drop a .did file",
  hint = "or click to browse",
  icon: Icon,
  onFiles,
  className = "",
  ...rest
}: FileDropzoneProps) {
  const [active, setActive] = React.useState(false);
  return (
    <label
      className={["b3-dropzone", className].filter(Boolean).join(" ")}
      data-active={active || undefined}
      onDragOver={(e) => {
        e.preventDefault();
        setActive(true);
      }}
      onDragLeave={() => setActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setActive(false);
        onFiles?.(Array.from(e.dataTransfer.files));
      }}
      {...rest}
    >
      {Icon ? <Icon width={20} height={20} aria-hidden /> : null}
      <span
        style={{
          fontSize: "var(--text-base)",
          fontWeight: "var(--weight-medium)" as React.CSSProperties["fontWeight"],
          color: "var(--foreground)",
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: "var(--text-sm)" }}>{hint}</span>
      <input
        type="file"
        hidden
        onChange={(e) => onFiles?.(Array.from(e.target.files ?? []))}
      />
    </label>
  );
}
