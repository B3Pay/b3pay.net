import React from "react";


export function FileDropzone({ label = "Drop a .did file", hint = "or click to browse", icon: Icon, onFiles, className = "", ...rest }) {
  const [active, setActive] = React.useState(false);
  return (
    <label className={["b3-dropzone", className].filter(Boolean).join(" ")} data-active={active || undefined}
      onDragOver={(e) => { e.preventDefault(); setActive(true); }}
      onDragLeave={() => setActive(false)}
      onDrop={(e) => { e.preventDefault(); setActive(false); onFiles && onFiles(Array.from(e.dataTransfer.files)); }}
      {...rest}>
      {Icon ? <Icon width={20} height={20} aria-hidden /> : null}
      <span style={{ fontSize: "var(--text-base)", fontWeight: "var(--weight-medium)", color: "var(--foreground)" }}>{label}</span>
      <span style={{ fontSize: "var(--text-sm)" }}>{hint}</span>
      <input type="file" hidden onChange={(e) => onFiles && onFiles(Array.from(e.target.files))} />
    </label>
  );
}
