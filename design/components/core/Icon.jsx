import React from "react";

const CDN = "https://unpkg.com/lucide@0.469.0/dist/umd/lucide.js";
let loading = null;
function ensureLucide() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.lucide) return Promise.resolve(window.lucide);
  if (!loading) {
    loading = new Promise((res) => {
      const s = document.createElement("script");
      s.src = CDN;
      s.onload = () => res(window.lucide || null);
      s.onerror = () => res(null);
      document.head.appendChild(s);
    });
  }
  return loading;
}
function toElements(node, key) {
  if (!Array.isArray(node)) return null;
  const [tag, attrs, kids] = node;
  const props = { key };
  for (const k in attrs) props[k.replace(/-([a-z])/g, (m, c) => c.toUpperCase())] = attrs[k];
  return React.createElement(tag, props, Array.isArray(kids) ? kids.map(toElements) : null);
}

/** Lucide icon. The B3Forge app's icon set, loaded from CDN. */
export function Icon({ name, size = 16, strokeWidth = 2, className = "", style, ...rest }) {
  const [lib, setLib] = React.useState(typeof window !== "undefined" ? window.lucide : null);
  React.useEffect(() => { let m = true; ensureLucide().then((l) => m && setLib(l)); return () => { m = false; }; }, []);
  const node = lib && lib.icons && lib.icons[name];
  const kids = Array.isArray(node) && Array.isArray(node[2]) ? node[2] : [];
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      className={className} style={{ flex: "none", display: "block", ...style }} aria-hidden {...rest}>
      {kids.map((n, i) => toElements(n, i))}
    </svg>
  );
}

/** Returns a component bound to `name`, for props that take an icon component. */
export function IconOf(name) {
  const C = (p) => <Icon name={name} {...p} />;
  C.displayName = `Icon(${name})`;
  return C;
}
