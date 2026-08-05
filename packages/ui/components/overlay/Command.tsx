import React from "react";

import { useOverlay } from "./use-overlay";

export interface CommandItem {
  label: string;
  icon?: React.ComponentType<React.SVGAttributes<SVGElement>>;
  hint?: string;
  onSelect?: () => void;
}
export interface CommandGroup {
  label: string;
  items: CommandItem[];
}

/** ⌘K palette. The fastest path across canisters, methods and docs. */
export interface CommandProps {
  /** @default true */
  open?: boolean;
  placeholder?: string;
  groups?: CommandGroup[];
  onClose?: () => void;
  className?: string;
}

export function Command({
  open = true,
  placeholder = "Search canisters, methods, docs…",
  groups = [],
  onClose,
  className = "",
}: CommandProps) {
  const [q, setQ] = React.useState("");
  const [cursor, setCursor] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);
  const listId = React.useId();
  useOverlay(open, onClose, ref);

  const filtered = groups
    .map((g) => ({
      ...g,
      items: g.items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase())),
    }))
    .filter((g) => g.items.length);

  // One flat index across groups, so Up/Down walks the whole palette.
  const flat = filtered.flatMap((g) => g.items);
  const clamped = flat.length ? Math.min(cursor, flat.length - 1) : 0;

  React.useEffect(() => {
    setCursor(0);
  }, [q]);

  if (!open) return null;

  const run = (item: CommandItem) => {
    item.onSelect?.();
    onClose?.();
  };

  return (
    <>
      <div className="b3-overlay" onClick={onClose} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className={["b3-dialog", "b3-command", className].filter(Boolean).join(" ")}
        style={{ top: "22%", transform: "translate(-50%,0)", padding: 0 }}
      >
        <input
          // No autoFocus: useOverlay focuses the first control, and doing it
          // there keeps the trigger recoverable for focus return on close.
          className="b3-command__input"
          placeholder={placeholder}
          aria-label={placeholder}
          aria-controls={listId}
          role="combobox"
          aria-expanded
          aria-autocomplete="list"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setCursor((c) => (flat.length ? (c + 1) % flat.length : 0));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setCursor((c) => (flat.length ? (c - 1 + flat.length) % flat.length : 0));
            } else if (e.key === "Enter" && flat[clamped]) {
              e.preventDefault();
              run(flat[clamped]);
            }
          }}
        />
        <div id={listId} role="listbox" style={{ maxHeight: 320, overflow: "auto", padding: 6 }}>
          {filtered.length === 0 ? <div className="b3-menu__label">No results</div> : null}
          {filtered.map((g, gi) => (
            <div key={gi} role="group" aria-label={g.label}>
              <div className="b3-menu__label">{g.label}</div>
              {g.items.map((it, i) => {
                const Icon = it.icon;
                const index = flat.indexOf(it);
                const selected = index === clamped;
                return (
                  <button
                    key={i}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    className="b3-menu__item"
                    data-active={selected || undefined}
                    onMouseEnter={() => setCursor(index)}
                    onClick={() => run(it)}
                  >
                    {Icon ? <Icon width={13} height={13} aria-hidden /> : null}
                    <span style={{ flex: 1 }}>{it.label}</span>
                    {it.hint ? (
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 10,
                          color: "var(--muted-foreground)",
                        }}
                      >
                        {it.hint}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
