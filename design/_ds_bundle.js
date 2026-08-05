/* @ds-bundle: {"format":4,"namespace":"B3PayDesignSystem_8a84cb","components":[{"name":"BrandMark","sourcePath":"components/brand/BrandMark.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Box","sourcePath":"components/core/Box.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"CardHeader","sourcePath":"components/core/Card.jsx"},{"name":"CardContent","sourcePath":"components/core/Card.jsx"},{"name":"CardFooter","sourcePath":"components/core/Card.jsx"},{"name":"CodeBlock","sourcePath":"components/core/CodeBlock.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconOf","sourcePath":"components/core/Icon.jsx"},{"name":"Kbd","sourcePath":"components/core/Kbd.jsx"},{"name":"Label","sourcePath":"components/core/Label.jsx"},{"name":"Alert","sourcePath":"components/feedback/Alert.jsx"},{"name":"ErrorDisplay","sourcePath":"components/feedback/ErrorDisplay.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Combobox","sourcePath":"components/forms/Combobox.jsx"},{"name":"FieldError","sourcePath":"components/forms/FieldError.jsx"},{"name":"FileDropzone","sourcePath":"components/forms/FileDropzone.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"PrincipalDisplay","sourcePath":"components/ic/PrincipalDisplay.jsx"},{"name":"TruncatedString","sourcePath":"components/ic/TruncatedString.jsx"},{"name":"WorkflowNode","sourcePath":"components/ic/WorkflowNode.jsx"},{"name":"NavBar","sourcePath":"components/navigation/NavBar.jsx"},{"name":"Shell","sourcePath":"components/navigation/Shell.jsx"},{"name":"SideNav","sourcePath":"components/navigation/SideNav.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"},{"name":"Command","sourcePath":"components/overlay/Command.jsx"},{"name":"Dialog","sourcePath":"components/overlay/Dialog.jsx"},{"name":"Drawer","sourcePath":"components/overlay/Drawer.jsx"},{"name":"DropdownMenu","sourcePath":"components/overlay/DropdownMenu.jsx"},{"name":"Popover","sourcePath":"components/overlay/Popover.jsx"}],"sourceHashes":{"components/brand/BrandMark.jsx":"dc23d6ed0cf9","components/core/Badge.jsx":"b7abb7606f3a","components/core/Box.jsx":"4801ea2bc31e","components/core/Button.jsx":"3277c0d38664","components/core/Card.jsx":"b18d3471982f","components/core/CodeBlock.jsx":"21e231078f19","components/core/Icon.jsx":"e116b3a28ce2","components/core/Kbd.jsx":"d68830508bf7","components/core/Label.jsx":"31b3bffd6a3d","components/core/tone.js":"f40b2e734300","components/feedback/Alert.jsx":"eb4d9075e1e5","components/feedback/ErrorDisplay.jsx":"2d1564397e0a","components/feedback/Toast.jsx":"2b663e4ff2d0","components/feedback/Tooltip.jsx":"e0bf0d9c9f93","components/forms/Checkbox.jsx":"a50b62b5abd2","components/forms/Combobox.jsx":"dde5a757b059","components/forms/FieldError.jsx":"2feefe64925f","components/forms/FileDropzone.jsx":"eac411570309","components/forms/Input.jsx":"8cff15548baa","components/forms/Select.jsx":"51b4c7f271e2","components/forms/Switch.jsx":"c99592ee0246","components/forms/Textarea.jsx":"0a1ab1e63d16","components/ic/PrincipalDisplay.jsx":"916e0cc9255d","components/ic/TruncatedString.jsx":"0a1df393e618","components/ic/WorkflowNode.jsx":"907e2b40c5bf","components/navigation/NavBar.jsx":"2c6dfde4e613","components/navigation/Shell.jsx":"f4e8b5bb03fd","components/navigation/SideNav.jsx":"0450bb03a804","components/navigation/Tabs.jsx":"d584de9bfa67","components/overlay/Command.jsx":"5bdadf474df2","components/overlay/Dialog.jsx":"af92a58e87ed","components/overlay/Drawer.jsx":"3e17dcaee8a2","components/overlay/DropdownMenu.jsx":"33e145bc794e","components/overlay/Popover.jsx":"86e3e08c81b0","ui_kits/docs/DocsApp.jsx":"fbd3122e4c5c","ui_kits/docs/content.jsx":"b3db123474b5","ui_kits/website/App.jsx":"396952961b1a","ui_kits/website/Home.jsx":"ae3dc739b0b5","ui_kits/website/Pages.jsx":"839195b4fd7a","ui_kits/website/Products.jsx":"286f438829fa","ui_kits/website/site.jsx":"1b110b373d1c"},"inlinedExternals":[],"unexposedExports":[{"name":"toneVars","sourcePath":"components/core/tone.js"}]} */

(() => {

const __ds_ns = (window.B3PayDesignSystem_8a84cb = window.B3PayDesignSystem_8a84cb || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/BrandMark.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Geometry transcribed verbatim from B3Pay.fig (node 421:73). viewBox 0 0 280 390.
const MARK = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
  d: "M 163.333 0 L 164.32 -10.956 L 163.828 -11 L 163.333 -11 L 163.333 0 Z M 228.556 186.173 L 234.576 195.379 L 234.951 195.133 L 235.305 194.858 L 228.556 186.173 Z M 228.556 189.097 L 222.535 198.303 L 222.824 198.492 L 223.124 198.662 L 228.556 189.097 Z M 168.932 390 L 168.932 401 L 169.079 401 L 169.227 400.996 L 168.932 390 Z M 11 362.535 C 11 356.46 6.075 351.535 0 351.535 C -6.075 351.535 -11 356.46 -11 362.535 L 0 362.535 L 11 362.535 Z M -11 27.465 C -11 33.54 -6.075 38.465 0 38.465 C 6.075 38.465 11 33.54 11 27.465 L 0 27.465 L -11 27.465 Z M 163.333 0 L 162.346 10.956 C 206.548 14.937 238.481 43.596 250.809 77.808 C 263.066 111.828 255.91 150.986 221.806 177.487 L 228.556 186.173 L 235.305 194.858 C 277.717 161.901 286.642 112.359 271.506 70.35 C 256.439 28.534 217.503 -6.165 164.32 -10.956 L 163.333 0 Z M 228.556 189.097 L 223.124 198.662 C 265.153 222.529 276.411 266.312 264.606 305.373 C 252.758 344.581 217.968 377.684 168.638 379.004 L 168.932 390 L 169.227 400.996 C 229.206 399.392 271.429 358.848 285.666 311.738 C 299.947 264.481 286.362 209.274 233.987 179.531 L 228.556 189.097 Z M 228.556 186.173 L 222.535 176.966 C 221.181 177.851 216.438 181.207 216.438 187.635 C 216.438 194.062 221.181 197.418 222.535 198.303 L 228.556 189.097 L 234.576 179.89 C 234.817 180.048 235.627 180.6 236.455 181.684 C 237.351 182.855 238.438 184.897 238.438 187.635 C 238.438 190.372 237.351 192.414 236.455 193.585 C 235.627 194.669 234.817 195.221 234.576 195.379 L 228.556 186.173 Z M 0.01 0 L 0.01 11 L 163.333 11 L 163.333 0 L 163.333 -11 L 0.01 -11 L 0.01 0 Z M 168.932 390 L 168.932 379 L 0.01 379 L 0.01 390 L 0.01 401 L 168.932 401 L 168.932 390 Z M 0 389.99 L 11 389.99 L 11 362.535 L 0 362.535 L -11 362.535 L -11 389.99 L 0 389.99 Z M 0 0.01 L -11 0.01 L -11 27.465 L 0 27.465 L 11 27.465 L 11 0.01 L 0 0.01 Z M 0.01 390 L 0.01 379 C 6.082 379 11 383.922 11 389.99 L 0 389.99 L -11 389.99 C -11 396.069 -6.073 401 0.01 401 L 0.01 390 Z M 0.01 0 L 0.01 -11 C -6.071 -11 -11 -6.071 -11 0.01 L 0 0.01 L 11 0.01 C 11 6.08 6.08 11 0.01 11 L 0.01 0 Z",
  fill: "currentColor",
  fillRule: "nonzero"
}), /*#__PURE__*/React.createElement("g", {
  transform: "translate(33 70)"
}, /*#__PURE__*/React.createElement("g", {
  transform: "translate(35.858 0) scale(1 1) translate(0 0)"
}, /*#__PURE__*/React.createElement("path", {
  d: "M 0 -10 C -5.523 -10 -10 -5.523 -10 0 C -10 5.523 -5.523 10 0 10 L 0 0 L 0 -10 Z M 69.56 86.152 L 69.56 96.152 C 87.052 96.152 100.966 89.748 110.448 79.473 C 119.785 69.353 124.278 56.079 124.278 43.076 C 124.278 30.073 119.785 16.799 110.448 6.68 C 100.966 -3.595 87.052 -10 69.56 -10 L 69.56 0 L 69.56 10 C 81.88 10 90.325 14.364 95.749 20.243 C 101.317 26.277 104.278 34.541 104.278 43.076 C 104.278 51.611 101.317 59.875 95.749 65.91 C 90.325 71.788 81.88 76.152 69.56 76.152 L 69.56 86.152 Z M 69.56 0 L 69.56 -10 L 0 -10 L 0 0 L 0 10 L 69.56 10 L 69.56 0 Z",
  fill: "currentColor",
  fillRule: "nonzero"
})), /*#__PURE__*/React.createElement("g", {
  transform: "translate(35.858 145.839) scale(1 1) translate(0 0)"
}, /*#__PURE__*/React.createElement("path", {
  d: "M 0 79.089 C -5.523 79.089 -10 83.567 -10 89.089 C -10 94.612 -5.523 99.089 0 99.089 L 0 89.089 L 0 79.089 Z M 0 89.089 L 0 99.089 L 72.542 99.089 L 72.542 89.089 L 72.542 79.089 L 0 79.089 L 0 89.089 Z M 72.542 89.089 L 72.542 99.089 C 90.923 99.089 105.556 92.577 115.55 82.057 C 125.42 71.666 130.191 57.97 130.116 44.489 C 130.04 31.004 125.115 17.325 115.079 6.963 C 104.926 -3.52 90.132 -10 71.548 -10 L 71.548 0 L 71.548 10 C 85.259 10 94.688 14.657 100.713 20.877 C 106.856 27.22 110.067 35.813 110.116 44.6 C 110.165 53.392 107.048 61.968 101.05 68.282 C 95.175 74.466 85.96 79.089 72.542 79.089 L 72.542 89.089 Z",
  fill: "currentColor",
  fillRule: "nonzero"
})), /*#__PURE__*/React.createElement("g", {
  transform: "translate(0 117) scale(1 1) translate(0 10)"
}, /*#__PURE__*/React.createElement("path", {
  d: "M 0 -10 C -5.523 -10 -10 -5.523 -10 0 C -10 5.523 -5.523 10 0 10 L 0 0 L 0 -10 Z M 0 0 L 0 10 L 32.828 10 L 32.828 0 L 32.828 -10 L 0 -10 L 0 0 Z",
  fill: "currentColor",
  fillRule: "nonzero"
})), /*#__PURE__*/React.createElement("g", {
  transform: "translate(39.054 76.592) scale(1 1) translate(0 0)"
}, /*#__PURE__*/React.createElement("path", {
  d: "M 80.305 40.153 L 72.305 40.153 C 72.305 58.952 58.952 72.305 40.153 72.305 L 40.153 80.305 L 40.153 88.305 C 67.788 88.305 88.305 67.788 88.305 40.153 L 80.305 40.153 Z M 40.153 0 L 40.153 8 C 58.952 8 72.305 21.353 72.305 40.153 L 80.305 40.153 L 88.305 40.153 C 88.305 12.517 67.788 -8 40.153 -8 L 40.153 0 Z M 0 40.153 L 8 40.153 C 8 21.353 21.353 8 40.153 8 L 40.153 0 L 40.153 -8 C 12.517 -8 -8 12.517 -8 40.153 L 0 40.153 Z M 40.153 80.305 L 40.153 72.305 C 21.353 72.305 8 58.952 8 40.153 L 0 40.153 L -8 40.153 C -8 67.788 12.517 88.305 40.153 88.305 L 40.153 80.305 Z",
  fill: "currentColor",
  fillRule: "nonzero"
})), /*#__PURE__*/React.createElement("g", {
  transform: "translate(54.351 91.888) scale(1 1) translate(0 0)"
}, /*#__PURE__*/React.createElement("path", {
  d: "M 24.856 49.713 C 39.229 49.713 49.713 39.229 49.713 24.856 C 49.713 10.484 39.229 0 24.856 0 C 10.484 0 0 10.484 0 24.856 C 0 39.229 10.484 49.713 24.856 49.713 Z",
  fill: "#ED7437",
  fillRule: "evenodd"
}))));

/**
 * B3Pay brand lockup. The mark is a stroked B with the Forge node at its centre.
 */
function BrandMark({
  variant = "horizontal",
  tone = "onDark",
  size = 32,
  wordmark = "B3Pay",
  className,
  style,
  ...rest
}) {
  const strokeColor = tone === "onLight" ? "var(--ink-100)" : tone === "forge" ? "var(--forge-600)" : tone === "current" ? "currentColor" : "var(--white)";
  const textColor = tone === "onLight" ? "var(--ink-100)" : tone === "forge" ? "var(--forge-600)" : tone === "current" ? "currentColor" : "var(--white)";
  const glyph = /*#__PURE__*/React.createElement("svg", {
    viewBox: "-11 -11 302 412",
    width: size * 302 / 412,
    height: size,
    fill: "none",
    style: {
      color: strokeColor,
      display: "block",
      flex: "none"
    },
    "aria-hidden": "true"
  }, MARK);
  if (variant === "mark") {
    return /*#__PURE__*/React.createElement("span", _extends({
      className: className,
      style: {
        display: "inline-flex",
        ...style
      }
    }, rest), glyph);
  }
  const word = /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: size * 0.8,
      letterSpacing: "-0.03em",
      lineHeight: 1,
      display: "block",
      color: textColor,
      whiteSpace: "nowrap"
    }
  }, wordmark);
  const stacked = variant === "stacked";
  return /*#__PURE__*/React.createElement("span", _extends({
    className: className,
    "aria-label": "B3Pay",
    style: {
      display: "inline-flex",
      flexDirection: stacked ? "column" : "row",
      alignItems: "center",
      gap: stacked ? size * 0.3 : size * 0.34,
      ...style
    }
  }, rest), glyph, word);
}
Object.assign(__ds_scope, { BrandMark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/BrandMark.jsx", error: String((e && e.message) || e) }); }

// components/core/Box.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SCALE = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32
};
function Box({
  as = "div",
  padding = "none",
  gap,
  direction,
  align,
  justify,
  bg,
  border = false,
  radius,
  className = "",
  style,
  children,
  ...rest
}) {
  const Comp = as;
  const s = {
    padding: SCALE[padding] ?? padding,
    display: direction || gap != null || align || justify ? "flex" : undefined,
    flexDirection: direction,
    gap: SCALE[gap] ?? gap,
    alignItems: align,
    justifyContent: justify,
    background: bg ? `var(--${bg})` : undefined,
    border: border ? "1px solid var(--border)" : undefined,
    borderRadius: radius ? `var(--radius-${radius})` : undefined,
    ...style
  };
  return /*#__PURE__*/React.createElement(Comp, _extends({
    className: className,
    style: s
  }, rest), children);
}
Object.assign(__ds_scope, { Box });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Box.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Card({
  interactive = false,
  flush = false,
  bevel = false,
  className = "",
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ["b3-card", interactive && "b3-card--interactive", flush && "b3-card--flush", bevel && "b3-bevel", className].filter(Boolean).join(" ")
  }, rest), children);
}
function CardHeader({
  title,
  description,
  icon: Icon,
  action,
  className = "",
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ["b3-card__header", className].filter(Boolean).join(" ")
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      minWidth: 0
    }
  }, Icon ? /*#__PURE__*/React.createElement("span", {
    className: "b3-card__icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    "aria-hidden": true,
    width: 16,
    height: 16
  })) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, title ? /*#__PURE__*/React.createElement("h3", {
    className: "b3-card__title"
  }, title) : null, description ? /*#__PURE__*/React.createElement("p", {
    className: "b3-card__desc"
  }, description) : null, children)), action ? /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none"
    }
  }, action) : null);
}
function CardContent({
  className = "",
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ["b3-card__content", className].filter(Boolean).join(" ")
  }, rest), children);
}
function CardFooter({
  className = "",
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ["b3-card__footer", className].filter(Boolean).join(" ")
  }, rest), children);
}
Object.assign(__ds_scope, { Card, CardHeader, CardContent, CardFooter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/CodeBlock.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function CodeBlock({
  code = "",
  lang,
  filename,
  copyable = true,
  numbered = false,
  className = "",
  style,
  ...rest
}) {
  const [copied, setCopied] = React.useState(false);
  const lines = String(code).replace(/\n$/, "").split("\n");
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ["b3-card", className].filter(Boolean).join(" "),
    style: {
      overflow: "hidden",
      background: "var(--ink-050)",
      ...style
    }
  }, rest), filename || lang || copyable ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
      padding: "0 10px",
      height: 32,
      borderBottom: "1px solid var(--border)",
      background: "var(--card)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      letterSpacing: "var(--tracking-wide)",
      color: "var(--muted-foreground)"
    }
  }, filename || lang), copyable ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      try {
        navigator.clipboard.writeText(code);
      } catch (e) {}
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    },
    style: {
      background: "none",
      border: 0,
      color: copied ? "var(--forge-500)" : "var(--muted-foreground)",
      cursor: "pointer",
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      letterSpacing: "var(--tracking-wide)",
      textTransform: "uppercase"
    }
  }, copied ? "Copied" : "Copy") : null) : null, /*#__PURE__*/React.createElement("pre", {
    style: {
      margin: 0,
      padding: "12px 14px",
      overflow: "auto",
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-sm)",
      lineHeight: "20px",
      color: "var(--ink-800)"
    }
  }, /*#__PURE__*/React.createElement("code", null, lines.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 14
    }
  }, numbered ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink-500)",
      userSelect: "none",
      minWidth: 18,
      textAlign: "right"
    }
  }, i + 1) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      whiteSpace: "pre"
    }
  }, l || " "))))));
}
Object.assign(__ds_scope, { CodeBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/CodeBlock.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CDN = "https://unpkg.com/lucide@0.469.0/dist/umd/lucide.js";
let loading = null;
function ensureLucide() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.lucide) return Promise.resolve(window.lucide);
  if (!loading) {
    loading = new Promise(res => {
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
  const props = {
    key
  };
  for (const k in attrs) props[k.replace(/-([a-z])/g, (m, c) => c.toUpperCase())] = attrs[k];
  return React.createElement(tag, props, Array.isArray(kids) ? kids.map(toElements) : null);
}

/** Lucide icon. The B3Forge app's icon set, loaded from CDN. */
function Icon({
  name,
  size = 16,
  strokeWidth = 2,
  className = "",
  style,
  ...rest
}) {
  const [lib, setLib] = React.useState(typeof window !== "undefined" ? window.lucide : null);
  React.useEffect(() => {
    let m = true;
    ensureLucide().then(l => m && setLib(l));
    return () => {
      m = false;
    };
  }, []);
  const node = lib && lib.icons && lib.icons[name];
  const kids = Array.isArray(node) && Array.isArray(node[2]) ? node[2] : [];
  return /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: className,
    style: {
      flex: "none",
      display: "block",
      ...style
    },
    "aria-hidden": true
  }, rest), kids.map((n, i) => toElements(n, i)));
}

/** Returns a component bound to `name`, for props that take an icon component. */
function IconOf(name) {
  const C = p => /*#__PURE__*/React.createElement(Icon, _extends({
    name: name
  }, p));
  C.displayName = `Icon(${name})`;
  return C;
}
Object.assign(__ds_scope, { Icon, IconOf });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Kbd.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Kbd({
  className = "",
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("kbd", _extends({
    className: ["b3-kbd", className].filter(Boolean).join(" ")
  }, rest), children);
}
Object.assign(__ds_scope, { Kbd });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Kbd.jsx", error: String((e && e.message) || e) }); }

// components/core/Label.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Label({
  required = false,
  disabled = false,
  className = "",
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", _extends({
    className: ["b3-label", disabled && "b3-label--disabled", className].filter(Boolean).join(" ")
  }, rest), children, required ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--forge-500)",
      marginLeft: 3
    }
  }, "*") : null);
}
Object.assign(__ds_scope, { Label });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Label.jsx", error: String((e && e.message) || e) }); }

// components/core/tone.js
try { (() => {
const TONE = {
  primary: ["var(--primary)", "var(--primary-foreground)"],
  secondary: ["var(--foreground)", "var(--background)"],
  error: ["var(--error)", "var(--error-foreground)"],
  success: ["var(--success)", "var(--success-foreground)"],
  warning: ["var(--warning)", "var(--warning-foreground)"],
  info: ["var(--info)", "var(--info-foreground)"],
  alert: ["var(--alert)", "var(--alert-foreground)"],
  muted: ["var(--muted-foreground)", "var(--background)"]
};
function toneVars(color) {
  const [c, fg] = TONE[color] || TONE.secondary;
  return {
    "--c": c,
    "--c-fg": fg
  };
}
Object.assign(__ds_scope, { toneVars });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/tone.js", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Badge({
  variant = "soft",
  color = "secondary",
  size = "sm",
  dot = false,
  className = "",
  style,
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ["b3-badge", `b3-badge--${size}`, `b3-badge--${variant}`, className].filter(Boolean).join(" "),
    style: {
      ...__ds_scope.toneVars(color),
      ...style
    }
  }, rest), dot ? /*#__PURE__*/React.createElement("span", {
    className: "b3-badge__dot"
  }) : null, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Button({
  variant = "default",
  color = "secondary",
  size = "md",
  icon: IconLeft,
  iconRight: IconRight,
  isActive = false,
  isLoading = false,
  asIconButton = false,
  fullWidth = false,
  bevel = false,
  as = "button",
  className = "",
  style,
  disabled,
  children,
  ...rest
}) {
  const Comp = as;
  const cls = ["b3-btn", `b3-btn--${size}`, `b3-btn--${variant}`, `b3-btn--${color}`, asIconButton && "b3-btn--icon", fullWidth && "b3-btn--full", isActive && "b3-btn--active", isLoading && "b3-btn--loading", bevel && "b3-bevel", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement(Comp, _extends({
    className: cls,
    style: {
      ...__ds_scope.toneVars(color),
      ...style
    },
    disabled: as === "button" ? disabled || isLoading || undefined : undefined,
    "aria-disabled": disabled || isLoading || undefined,
    "aria-pressed": isActive || undefined,
    "aria-busy": isLoading || undefined
  }, rest), IconLeft ? /*#__PURE__*/React.createElement(IconLeft, {
    "aria-hidden": true
  }) : null, children, IconRight ? /*#__PURE__*/React.createElement(IconRight, {
    "aria-hidden": true
  }) : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Alert.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Alert({
  color = "info",
  title,
  icon: Icon,
  action,
  className = "",
  style,
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "status",
    className: ["b3-alert", className].filter(Boolean).join(" "),
    style: {
      ...__ds_scope.toneVars(color),
      ...style
    }
  }, rest), Icon ? /*#__PURE__*/React.createElement("span", {
    className: "b3-alert__icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    width: 16,
    height: 16,
    "aria-hidden": true
  })) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, title ? /*#__PURE__*/React.createElement("p", {
    className: "b3-alert__title"
  }, title) : null, children ? /*#__PURE__*/React.createElement("p", {
    className: "b3-alert__body"
  }, children) : null), action ? /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none"
    }
  }, action) : null);
}
Object.assign(__ds_scope, { Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Alert.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ErrorDisplay.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ErrorDisplay({
  title = "Call failed",
  code,
  detail,
  onRetry,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ["b3-card", className].filter(Boolean).join(" "),
    style: {
      borderColor: "color-mix(in srgb,var(--error) 45%,transparent)",
      background: "color-mix(in srgb,var(--error) 8%,var(--card))"
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "b3-eyebrow",
    style: {
      color: "var(--error)"
    }
  }, "Error"), code ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-xs)",
      color: "var(--muted-foreground)"
    }
  }, code) : null), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: "var(--font-display)",
      fontSize: "var(--text-md)",
      fontWeight: "var(--weight-semibold)",
      letterSpacing: "var(--tracking-tight)"
    }
  }, title), detail ? /*#__PURE__*/React.createElement("pre", {
    style: {
      margin: "10px 0 0",
      padding: 10,
      background: "var(--ink-050)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-sm)",
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-xs)",
      lineHeight: "var(--text-xs-lh)",
      color: "var(--muted-foreground)",
      overflow: "auto",
      whiteSpace: "pre-wrap"
    }
  }, detail) : null, onRetry ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "b3-btn b3-btn--sm b3-btn--outlined b3-btn--error",
    style: {
      marginTop: 12,
      "--c": "var(--error)",
      "--c-fg": "var(--error-foreground)"
    },
    onClick: onRetry
  }, "Retry") : null));
}
Object.assign(__ds_scope, { ErrorDisplay });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ErrorDisplay.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Toast({
  color = "secondary",
  title,
  icon: Icon,
  onDismiss,
  className = "",
  style,
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "status",
    className: ["b3-toast", className].filter(Boolean).join(" "),
    style: {
      ...__ds_scope.toneVars(color),
      position: "relative",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "b3-toast__bar"
  }), Icon ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--c)",
      flex: "none",
      marginTop: 1
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    width: 15,
    height: 15,
    "aria-hidden": true
  })) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, title ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-base)",
      fontWeight: "var(--weight-medium)"
    }
  }, title) : null, children ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "3px 0 0",
      fontSize: "var(--text-sm)",
      lineHeight: "var(--text-sm-lh)",
      color: "var(--muted-foreground)"
    }
  }, children) : null), onDismiss ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onDismiss,
    "aria-label": "Dismiss",
    style: {
      background: "none",
      border: 0,
      color: "var(--muted-foreground)",
      cursor: "pointer",
      fontSize: 15,
      lineHeight: 1,
      flex: "none"
    }
  }, "\xD7") : null);
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function Tooltip({
  content,
  side = "top",
  className = "",
  children
}) {
  const [open, setOpen] = React.useState(false);
  const pos = {
    top: {
      bottom: "calc(100% + 6px)",
      left: "50%",
      transform: "translateX(-50%)"
    },
    bottom: {
      top: "calc(100% + 6px)",
      left: "50%",
      transform: "translateX(-50%)"
    },
    left: {
      right: "calc(100% + 6px)",
      top: "50%",
      transform: "translateY(-50%)"
    },
    right: {
      left: "calc(100% + 6px)",
      top: "50%",
      transform: "translateY(-50%)"
    }
  }[side];
  return /*#__PURE__*/React.createElement("span", {
    className: className,
    style: {
      position: "relative",
      display: "inline-flex"
    },
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false)
  }, children, open ? /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    className: "b3-surface b3-tooltip",
    style: {
      position: "absolute",
      zIndex: 40,
      whiteSpace: "nowrap",
      ...pos
    }
  }, content) : null);
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Checkbox({
  label,
  description,
  type = "checkbox",
  className = "",
  id,
  ...rest
}) {
  const control = /*#__PURE__*/React.createElement("input", _extends({
    id: id,
    type: type,
    className: ["b3-check", type === "radio" && "b3-check--radio", className].filter(Boolean).join(" ")
  }, rest));
  if (!label) return control;
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      display: "flex",
      gap: 8,
      alignItems: description ? "flex-start" : "center",
      cursor: "pointer"
    }
  }, control, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-base)",
      color: "var(--foreground)"
    }
  }, label), description ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontSize: "var(--text-sm)",
      color: "var(--muted-foreground)",
      marginTop: 2
    }
  }, description) : null));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Combobox.jsx
try { (() => {
function Combobox({
  options = [],
  value,
  onSelect,
  placeholder = "Search…",
  size = "md",
  className = "",
  style
}) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const list = options.filter(o => (typeof o === "string" ? o : o.label).toLowerCase().includes(q.toLowerCase()));
  const label = value ? options.find(o => (typeof o === "string" ? o : o.value) === value) || value : null;
  return /*#__PURE__*/React.createElement("div", {
    className: className,
    style: {
      position: "relative",
      width: "100%",
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: ["b3-field", `b3-field--${size}`].join(" "),
    style: {
      justifyContent: "space-between",
      cursor: "pointer",
      textAlign: "left"
    },
    onClick: () => setOpen(o => !o),
    "aria-expanded": open
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: label ? "var(--foreground)" : "var(--muted-foreground)",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, label ? typeof label === "string" ? label : label.label : placeholder), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      fontSize: 9,
      color: "var(--muted-foreground)"
    }
  }, "\u25BC")), open ? /*#__PURE__*/React.createElement("div", {
    className: "b3-surface b3-menu",
    style: {
      position: "absolute",
      zIndex: 30,
      top: "calc(100% + 4px)",
      left: 0,
      right: 0
    }
  }, /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "Filter\u2026",
    className: "b3-field b3-field--sm",
    style: {
      marginBottom: 4,
      fontFamily: "var(--font-mono)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: 200,
      overflow: "auto"
    }
  }, list.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "b3-menu__label"
  }, "No matches") : null, list.map(o => {
    const v = typeof o === "string" ? o : o.value;
    const l = typeof o === "string" ? o : o.label;
    return /*#__PURE__*/React.createElement("button", {
      key: v,
      type: "button",
      className: "b3-menu__item",
      "data-active": v === value || undefined,
      onClick: () => {
        onSelect && onSelect(v);
        setOpen(false);
        setQ("");
      }
    }, l);
  }))) : null);
}
Object.assign(__ds_scope, { Combobox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Combobox.jsx", error: String((e && e.message) || e) }); }

// components/forms/FieldError.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function FieldError({
  className = "",
  children,
  ...rest
}) {
  if (!children) return null;
  return /*#__PURE__*/React.createElement("p", _extends({
    role: "alert",
    className: ["b3-field-error", className].filter(Boolean).join(" ")
  }, rest), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true
  }, "!"), children);
}
Object.assign(__ds_scope, { FieldError });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/FieldError.jsx", error: String((e && e.message) || e) }); }

// components/forms/FileDropzone.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function FileDropzone({
  label = "Drop a .did file",
  hint = "or click to browse",
  icon: Icon,
  onFiles,
  className = "",
  ...rest
}) {
  const [active, setActive] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", _extends({
    className: ["b3-dropzone", className].filter(Boolean).join(" "),
    "data-active": active || undefined,
    onDragOver: e => {
      e.preventDefault();
      setActive(true);
    },
    onDragLeave: () => setActive(false),
    onDrop: e => {
      e.preventDefault();
      setActive(false);
      onFiles && onFiles(Array.from(e.dataTransfer.files));
    }
  }, rest), Icon ? /*#__PURE__*/React.createElement(Icon, {
    width: 20,
    height: 20,
    "aria-hidden": true
  }) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-base)",
      fontWeight: "var(--weight-medium)",
      color: "var(--foreground)"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-sm)"
    }
  }, hint), /*#__PURE__*/React.createElement("input", {
    type: "file",
    hidden: true,
    onChange: e => onFiles && onFiles(Array.from(e.target.files))
  }));
}
Object.assign(__ds_scope, { FileDropzone });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/FileDropzone.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input({
  size = "md",
  icon: Icon,
  onClear,
  invalid = false,
  mono = false,
  className = "",
  style,
  ...rest
}) {
  const pad = {
    xs: 22,
    sm: 28,
    md: 30,
    lg: 34,
    xl: 40
  }[size];
  return /*#__PURE__*/React.createElement("div", {
    className: ["b3-input-wrap", className].filter(Boolean).join(" "),
    style: {
      position: "relative",
      width: "100%",
      ...style
    }
  }, Icon ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 10,
      top: "50%",
      transform: "translateY(-50%)",
      color: "var(--muted-foreground)",
      pointerEvents: "none",
      display: "flex"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    width: 14,
    height: 14,
    "aria-hidden": true
  })) : null, /*#__PURE__*/React.createElement("input", _extends({
    className: ["b3-field", `b3-field--${size}`].join(" "),
    "aria-invalid": invalid || undefined,
    style: {
      paddingLeft: Icon ? pad : undefined,
      paddingRight: onClear ? pad : undefined,
      fontFamily: mono ? "var(--font-mono)" : undefined
    }
  }, rest)), onClear ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClear,
    "aria-label": "Clear",
    style: {
      position: "absolute",
      right: 8,
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: 0,
      color: "var(--muted-foreground)",
      cursor: "pointer",
      lineHeight: 1,
      fontSize: 14
    }
  }, "\xD7") : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Select({
  size = "md",
  options = [],
  invalid = false,
  className = "",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      ...style
    },
    className: className
  }, /*#__PURE__*/React.createElement("select", _extends({
    className: ["b3-field", `b3-field--${size}`].join(" "),
    "aria-invalid": invalid || undefined,
    style: {
      appearance: "none",
      paddingRight: 28,
      cursor: "pointer"
    }
  }, rest), options.map(o => {
    const v = typeof o === "string" ? o : o.value;
    const l = typeof o === "string" ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      position: "absolute",
      right: 10,
      top: "50%",
      transform: "translateY(-50%)",
      color: "var(--muted-foreground)",
      pointerEvents: "none",
      fontSize: 9
    }
  }, "\u25BC"));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Switch({
  label,
  className = "",
  id,
  ...rest
}) {
  const control = /*#__PURE__*/React.createElement("input", _extends({
    id: id,
    type: "checkbox",
    role: "switch",
    className: ["b3-switch", className].filter(Boolean).join(" ")
  }, rest));
  if (!label) return control;
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      display: "inline-flex",
      gap: 8,
      alignItems: "center",
      cursor: "pointer",
      fontSize: "var(--text-base)"
    }
  }, control, /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Textarea({
  invalid = false,
  rows = 4,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("textarea", _extends({
    rows: rows,
    "aria-invalid": invalid || undefined,
    className: ["b3-field", "b3-field--area", className].filter(Boolean).join(" ")
  }, rest));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/ic/PrincipalDisplay.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function PrincipalDisplay({
  value = "",
  head: h = 5,
  tail = 3,
  copyable = true,
  className = "",
  ...rest
}) {
  const [copied, setCopied] = React.useState(false);
  const parts = value.split("-");
  const short = parts.length > h + tail ? [...parts.slice(0, h), "…", ...parts.slice(-tail)].join("-") : value;
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ["b3-principal", className].filter(Boolean).join(" "),
    title: value,
    onClick: () => {
      if (!copyable) return;
      try {
        navigator.clipboard.writeText(value);
      } catch (e) {}
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  }, rest), short, copyable ? /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .6,
      fontSize: 9
    }
  }, copied ? "copied" : "copy") : null);
}
Object.assign(__ds_scope, { PrincipalDisplay });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/ic/PrincipalDisplay.jsx", error: String((e && e.message) || e) }); }

// components/ic/TruncatedString.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function TruncatedString({
  value = "",
  max = 32,
  mono = true,
  className = "",
  style,
  ...rest
}) {
  const short = value.length > max ? value.slice(0, max - 1) + "…" : value;
  return /*#__PURE__*/React.createElement("span", _extends({
    className: className,
    title: value,
    style: {
      fontFamily: mono ? "var(--font-mono)" : undefined,
      ...style
    }
  }, rest), short);
}
Object.assign(__ds_scope, { TruncatedString });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/ic/TruncatedString.jsx", error: String((e && e.message) || e) }); }

// components/ic/WorkflowNode.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const KIND = {
  trigger: {
    accent: "var(--node-trigger)",
    strong: "var(--node-trigger-strong)"
  },
  variables: {
    accent: "var(--node-variables)",
    strong: "var(--node-variables-strong)"
  },
  query: {
    accent: "var(--node-query)",
    strong: "var(--node-query-strong)"
  },
  update: {
    accent: "var(--node-update)",
    strong: "var(--node-update-strong)"
  },
  utility: {
    accent: "var(--node-utility)",
    strong: "var(--node-utility-strong)"
  }
};
function WorkflowNode({
  kind = "query",
  index = 0,
  title,
  subtitle,
  icon: Icon,
  selected = false,
  ports = true,
  className = "",
  style,
  children,
  ...rest
}) {
  const k = KIND[kind] || KIND.query;
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ["b3-node", className].filter(Boolean).join(" "),
    "data-node-kind": kind,
    "data-selected": selected || undefined,
    style: {
      "--node-accent": k.accent,
      "--node-accent-strong": k.strong,
      "--node-glyph-bg": `color-mix(in srgb, ${k.accent} 12%, var(--card))`,
      "--node-glyph-border": `color-mix(in srgb, ${k.accent} 22%, var(--card))`,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "b3-node__head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "b3-node__glyph"
  }, Icon ? /*#__PURE__*/React.createElement(Icon, {
    width: 12,
    height: 12,
    "aria-hidden": true
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      fontFamily: "var(--font-mono)"
    }
  }, kind[0].toUpperCase())), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-sm)",
      fontWeight: "var(--weight-medium)",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, title), subtitle ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 9,
      color: "var(--muted-foreground)",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, subtitle) : null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 9,
      color: "var(--node-accent)"
    }
  }, "$N", index)), children ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 10px",
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      lineHeight: "15px",
      color: "var(--muted-foreground)"
    }
  }, children) : null, ports ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "b3-node__port",
    style: {
      position: "absolute",
      left: -5,
      top: "50%",
      marginTop: -4
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "b3-node__port",
    style: {
      position: "absolute",
      right: -5,
      top: "50%",
      marginTop: -4
    }
  })) : null);
}
Object.assign(__ds_scope, { WorkflowNode });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/ic/WorkflowNode.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function NavBar({
  links = [],
  active,
  brand,
  actions,
  sticky = true,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("header", _extends({
    className: className,
    style: {
      position: sticky ? "sticky" : "relative",
      top: 0,
      zIndex: 30,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 24,
      height: 64,
      padding: "0 24px",
      borderBottom: "1px solid var(--border)",
      background: "color-mix(in srgb,var(--background) 78%,transparent)",
      backdropFilter: "blur(14px)"
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 28,
      minWidth: 0
    }
  }, brand, /*#__PURE__*/React.createElement("nav", {
    className: "b3-nav"
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l.href || l.label,
    href: l.href || "#",
    className: "b3-nav__link",
    "data-active": l.label === active || undefined
  }, l.label)))), actions ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      flex: "none"
    }
  }, actions) : null);
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Shell.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Shell({
  bar,
  aside,
  className = "",
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ["b3-shell", className].filter(Boolean).join(" ")
  }, rest), bar ? /*#__PURE__*/React.createElement("div", {
    className: "b3-shell__bar"
  }, bar) : null, /*#__PURE__*/React.createElement("div", {
    className: "b3-shell__body"
  }, aside ? /*#__PURE__*/React.createElement("aside", {
    className: "b3-shell__aside"
  }, aside) : null, /*#__PURE__*/React.createElement("main", {
    className: "b3-shell__main"
  }, children)));
}
Object.assign(__ds_scope, { Shell });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Shell.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SideNav.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SideNav({
  sections = [],
  active,
  onSelect,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("nav", _extends({
    className: className,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 18
    }
  }, rest), sections.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, s.label ? /*#__PURE__*/React.createElement("div", {
    className: "b3-eyebrow",
    style: {
      padding: "0 8px 6px"
    }
  }, s.label) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 1
    }
  }, s.items.map(it => {
    const Icon = it.icon;
    const isActive = it.value === active;
    return /*#__PURE__*/React.createElement("button", {
      key: it.value,
      type: "button",
      className: "b3-menu__item",
      "data-active": isActive || undefined,
      onClick: () => onSelect && onSelect(it.value)
    }, Icon ? /*#__PURE__*/React.createElement(Icon, {
      width: 13,
      height: 13,
      "aria-hidden": true
    }) : null, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }, it.label), it.badge ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 9,
        color: "var(--muted-foreground)"
      }
    }, it.badge) : null);
  })))));
}
Object.assign(__ds_scope, { SideNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SideNav.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tabs({
  tabs = [],
  value,
  onChange,
  variant = "segmented",
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "tablist",
    className: ["b3-tabs", variant === "underline" && "b3-tabs--underline", className].filter(Boolean).join(" ")
  }, rest), tabs.map(t => {
    const v = typeof t === "string" ? t : t.value;
    const l = typeof t === "string" ? t : t.label;
    const Icon = typeof t === "string" ? null : t.icon;
    return /*#__PURE__*/React.createElement("button", {
      key: v,
      type: "button",
      role: "tab",
      className: "b3-tab",
      "data-state": v === value ? "active" : undefined,
      "aria-selected": v === value,
      onClick: () => onChange && onChange(v)
    }, Icon ? /*#__PURE__*/React.createElement(Icon, {
      width: 13,
      height: 13,
      "aria-hidden": true
    }) : null, l, typeof t === "object" && t.count != null ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        color: "var(--muted-foreground)"
      }
    }, t.count) : null);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/overlay/Command.jsx
try { (() => {
function Command({
  open = true,
  placeholder = "Search canisters, methods, docs…",
  groups = [],
  onClose,
  className = ""
}) {
  const [q, setQ] = React.useState("");
  if (!open) return null;
  const filtered = groups.map(g => ({
    ...g,
    items: g.items.filter(i => i.label.toLowerCase().includes(q.toLowerCase()))
  })).filter(g => g.items.length);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "b3-overlay",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    className: ["b3-dialog", "b3-command", className].filter(Boolean).join(" "),
    style: {
      top: "22%",
      transform: "translate(-50%,0)",
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    className: "b3-command__input",
    placeholder: placeholder,
    value: q,
    onChange: e => setQ(e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: 320,
      overflow: "auto",
      padding: 6
    }
  }, filtered.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "b3-menu__label"
  }, "No results") : null, filtered.map((g, gi) => /*#__PURE__*/React.createElement("div", {
    key: gi
  }, /*#__PURE__*/React.createElement("div", {
    className: "b3-menu__label"
  }, g.label), g.items.map((it, i) => {
    const Icon = it.icon;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      className: "b3-menu__item",
      onClick: () => {
        it.onSelect && it.onSelect();
        onClose && onClose();
      }
    }, Icon ? /*#__PURE__*/React.createElement(Icon, {
      width: 13,
      height: 13,
      "aria-hidden": true
    }) : null, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }, it.label), it.hint ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        color: "var(--muted-foreground)"
      }
    }, it.hint) : null);
  }))))));
}
Object.assign(__ds_scope, { Command });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlay/Command.jsx", error: String((e && e.message) || e) }); }

// components/overlay/Dialog.jsx
try { (() => {
function Dialog({
  open = true,
  title,
  description,
  footer,
  onClose,
  width,
  className = "",
  children
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "b3-overlay",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    className: ["b3-dialog", className].filter(Boolean).join(" "),
    style: width ? {
      width
    } : undefined
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 20px 0",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, title ? /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: "var(--font-display)",
      fontSize: "var(--text-xl)",
      fontWeight: "var(--weight-semibold)",
      letterSpacing: "var(--tracking-tighter)"
    }
  }, title) : null, description ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "6px 0 0",
      fontSize: "var(--text-base)",
      lineHeight: "var(--text-base-lh)",
      color: "var(--muted-foreground)"
    }
  }, description) : null), onClose ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClose,
    "aria-label": "Close",
    style: {
      background: "none",
      border: 0,
      color: "var(--muted-foreground)",
      cursor: "pointer",
      fontSize: 18,
      lineHeight: 1
    }
  }, "\xD7") : null), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 20px"
    }
  }, children), footer ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 8,
      padding: "0 20px 18px"
    }
  }, footer) : null));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlay/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/overlay/Drawer.jsx
try { (() => {
function Drawer({
  open = true,
  title,
  onClose,
  footer,
  width,
  className = "",
  children
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "b3-overlay",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("aside", {
    className: ["b3-drawer", className].filter(Boolean).join(" "),
    style: width ? {
      width
    } : undefined
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      padding: "0 16px",
      height: 52,
      borderBottom: "1px solid var(--border)",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "var(--text-md)",
      fontWeight: "var(--weight-semibold)"
    }
  }, title), onClose ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClose,
    "aria-label": "Close",
    style: {
      background: "none",
      border: 0,
      color: "var(--muted-foreground)",
      cursor: "pointer",
      fontSize: 18,
      lineHeight: 1
    }
  }, "\xD7") : null), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      overflow: "auto",
      padding: 16
    }
  }, children), footer ? /*#__PURE__*/React.createElement("footer", {
    style: {
      display: "flex",
      gap: 8,
      padding: 16,
      borderTop: "1px solid var(--border)",
      flex: "none"
    }
  }, footer) : null));
}
Object.assign(__ds_scope, { Drawer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlay/Drawer.jsx", error: String((e && e.message) || e) }); }

// components/overlay/DropdownMenu.jsx
try { (() => {
function DropdownMenu({
  trigger,
  items = [],
  align = "start",
  className = ""
}) {
  const [open, setOpen] = React.useState(false);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "inline-flex"
    },
    className: className
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => setOpen(o => !o)
  }, trigger), open ? /*#__PURE__*/React.createElement("div", {
    role: "menu",
    className: "b3-surface b3-menu",
    style: {
      position: "absolute",
      zIndex: 40,
      top: "calc(100% + 6px)",
      [align === "end" ? "right" : "left"]: 0
    }
  }, items.map((it, i) => {
    if (it.type === "separator") return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "b3-menu__sep"
    });
    if (it.type === "label") return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "b3-menu__label"
    }, it.label);
    const Icon = it.icon;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      role: "menuitem",
      className: "b3-menu__item",
      "data-active": it.active || undefined,
      style: it.color === "error" ? {
        color: "var(--error)"
      } : undefined,
      onClick: () => {
        it.onSelect && it.onSelect();
        setOpen(false);
      }
    }, Icon ? /*#__PURE__*/React.createElement(Icon, {
      width: 13,
      height: 13,
      "aria-hidden": true
    }) : null, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }, it.label), it.shortcut ? /*#__PURE__*/React.createElement("kbd", {
      className: "b3-kbd"
    }, it.shortcut) : null);
  })) : null);
}
Object.assign(__ds_scope, { DropdownMenu });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlay/DropdownMenu.jsx", error: String((e && e.message) || e) }); }

// components/overlay/Popover.jsx
try { (() => {
function Popover({
  trigger,
  align = "start",
  width = 240,
  className = "",
  children
}) {
  const [open, setOpen] = React.useState(false);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "inline-flex"
    },
    className: className
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => setOpen(o => !o)
  }, trigger), open ? /*#__PURE__*/React.createElement("div", {
    className: "b3-surface",
    style: {
      position: "absolute",
      zIndex: 40,
      top: "calc(100% + 6px)",
      [align === "end" ? "right" : "left"]: 0,
      width,
      padding: 12,
      animation: "b3-dock-enter var(--dur-base) var(--ease-dock)"
    }
  }, children) : null);
}
Object.assign(__ds_scope, { Popover });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlay/Popover.jsx", error: String((e && e.message) || e) }); }

// ui_kits/docs/DocsApp.jsx
try { (() => {
const {
  IconOf,
  Button,
  Badge,
  Card,
  CardHeader,
  BrandMark,
  Icon,
  CodeBlock,
  SideNav,
  Shell,
  Alert,
  Command,
  Input,
  Kbd,
  Select,
  Tooltip
} = typeof window !== "undefined" && window.B3PayDesignSystem_8a84cb || {};
const icon = IconOf;
const H2 = ({
  children
}) => /*#__PURE__*/React.createElement("h2", {
  id: String(children).toLowerCase().replace(/\s+/g, "-"),
  style: {
    margin: "44px 0 16px",
    fontFamily: "var(--font-display)",
    fontSize: 26,
    fontWeight: 600,
    letterSpacing: "-0.022em",
    scrollMarginTop: 70
  }
}, children);
function Block({
  b
}) {
  if (b.type === "h") return /*#__PURE__*/React.createElement(H2, null, b.text);
  if (b.type === "p") return /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 16px",
      fontSize: 15,
      lineHeight: "26px",
      color: "var(--muted-foreground)",
      maxWidth: "68ch",
      textWrap: "pretty"
    }
  }, b.text);
  if (b.type === "code") return /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "0 0 20px"
    }
  }, /*#__PURE__*/React.createElement(CodeBlock, {
    filename: b.file,
    code: b.code
  }));
  if (b.type === "callout") return /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "0 0 20px"
    }
  }, /*#__PURE__*/React.createElement(Alert, {
    color: b.color,
    title: b.title,
    icon: icon("TriangleAlert")
  }, b.text));
  if (b.type === "table") return /*#__PURE__*/React.createElement("div", {
    className: "b3-card",
    style: {
      overflow: "hidden",
      margin: "0 0 20px"
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, b.head.map(h => /*#__PURE__*/React.createElement("th", {
    key: h,
    style: {
      textAlign: "left",
      padding: "10px 14px",
      borderBottom: "1px solid var(--border)",
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "var(--muted-foreground)",
      fontWeight: 400
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, b.rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, r.map((c, j) => /*#__PURE__*/React.createElement("td", {
    key: j,
    style: {
      padding: "10px 14px",
      borderTop: i ? "1px solid var(--border)" : 0,
      color: j === 0 ? "var(--foreground)" : c === "yes" ? "var(--success)" : c === "no" ? "var(--ink-600)" : "var(--muted-foreground)",
      fontFamily: j > 0 ? "var(--font-mono)" : undefined,
      fontSize: j > 0 ? 11 : 13
    }
  }, c)))))));
  if (b.type === "api") return /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "0 0 20px"
    }
  }, b.rows.map(([sig, pkg, desc]) => /*#__PURE__*/React.createElement("div", {
    key: sig,
    style: {
      padding: "16px 0",
      borderTop: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("code", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 13,
      color: "var(--forge-500)"
    }
  }, sig), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      color: "var(--ink-600)"
    }
  }, pkg)), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "8px 0 0",
      fontSize: 14,
      lineHeight: "22px",
      color: "var(--muted-foreground)",
      maxWidth: "68ch"
    }
  }, desc))));
  return null;
}
function DocsApp() {
  const [page, setPage] = React.useState("quickstart");
  const [palette, setPalette] = React.useState(false);
  const doc = DOCS[page] || DOCS.quickstart;
  React.useEffect(() => {
    const h = e => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPalette(p => !p);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  const select = v => {
    setPage(DOCS[v] ? v : "quickstart");
  };
  return /*#__PURE__*/React.createElement(Shell, {
    bar: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(BrandMark, {
      size: 22
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 1,
        height: 18,
        background: "var(--border)"
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "var(--muted-foreground)"
      }
    }, "Docs"), /*#__PURE__*/React.createElement(Badge, {
      size: "xs",
      color: "secondary"
    }, "IC Reactor")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => setPalette(true),
      className: "b3-field b3-field--md",
      style: {
        width: 260,
        justifyContent: "space-between",
        cursor: "pointer",
        color: "var(--muted-foreground)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "Search",
      size: 13
    }), " Search docs"), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        gap: 3
      }
    }, /*#__PURE__*/React.createElement(Kbd, null, "\u2318"), /*#__PURE__*/React.createElement(Kbd, null, "K"))), /*#__PURE__*/React.createElement(Select, {
      size: "md",
      options: ["v1.2.0", "v1.1.4", "v1.0.9"],
      style: {
        width: 96
      }
    }), /*#__PURE__*/React.createElement(Tooltip, {
      content: "View on GitHub"
    }, /*#__PURE__*/React.createElement(Button, {
      asIconButton: true,
      size: "md",
      icon: icon("Github"),
      "aria-label": "GitHub"
    })))),
    aside: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SideNav, {
      active: page,
      onSelect: select,
      sections: DOC_NAV
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 24,
        paddingTop: 16,
        borderTop: "1px solid var(--border)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "b3-eyebrow",
      style: {
        padding: "0 8px 8px"
      }
    }, "Other projects"), ["B3Forge", "B3Wallet", "B3Note", "B3Utils"].map(p => /*#__PURE__*/React.createElement("button", {
      key: p,
      type: "button",
      className: "b3-menu__item"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "ArrowUpRight",
      size: 12
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }, p)))))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "minmax(0,1fr) 200px",
      gap: 48,
      padding: "40px 48px 120px",
      maxWidth: 1080
    }
  }, /*#__PURE__*/React.createElement("article", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "var(--muted-foreground)"
    }
  }, doc.crumb.map((c, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: c
  }, i ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink-500)"
    }
  }, "/") : null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: i === doc.crumb.length - 1 ? "var(--forge-500)" : undefined
    }
  }, c)))), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: "16px 0 0",
      fontFamily: "var(--font-display)",
      fontSize: 46,
      lineHeight: "50px",
      fontWeight: 600,
      letterSpacing: "-0.032em"
    }
  }, doc.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "18px 0 34px",
      fontSize: 17,
      lineHeight: "28px",
      color: "var(--muted-foreground)",
      maxWidth: "68ch",
      textWrap: "pretty"
    }
  }, doc.lead), doc.blocks.map((b, i) => /*#__PURE__*/React.createElement(Block, {
    key: i,
    b: b
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      gap: 12,
      marginTop: 56,
      paddingTop: 24,
      borderTop: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outlined",
    icon: icon("ArrowLeft"),
    onClick: () => select("install")
  }, "Install"), /*#__PURE__*/React.createElement(Button, {
    variant: "outlined",
    iconRight: icon("ArrowRight"),
    onClick: () => select("api")
  }, "API reference"))), /*#__PURE__*/React.createElement("nav", {
    style: {
      position: "sticky",
      top: 24,
      alignSelf: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "b3-eyebrow",
    style: {
      marginBottom: 12
    }
  }, "On this page"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 9,
      borderLeft: "1px solid var(--border)"
    }
  }, doc.toc.map((t, i) => /*#__PURE__*/React.createElement("a", {
    key: t,
    href: "#" + t.toLowerCase().replace(/\s+/g, "-"),
    style: {
      fontSize: 12,
      lineHeight: "18px",
      color: i === 0 ? "var(--forge-500)" : "var(--muted-foreground)",
      textDecoration: "none",
      paddingLeft: 12,
      borderLeft: i === 0 ? "1px solid var(--forge-500)" : "1px solid transparent",
      marginLeft: -1
    }
  }, t))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28,
      paddingTop: 16,
      borderTop: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontSize: 12,
      color: "var(--muted-foreground)",
      textDecoration: "none",
      display: "flex",
      gap: 6,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Pencil",
    size: 12
  }), " Edit this page"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontSize: 12,
      color: "var(--muted-foreground)",
      textDecoration: "none",
      display: "flex",
      gap: 6,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "MessageSquare",
    size: 12
  }), " Report an issue")))), palette ? /*#__PURE__*/React.createElement(Command, {
    onClose: () => setPalette(false),
    placeholder: "Search canisters, methods, docs\u2026",
    groups: [{
      label: "Docs",
      items: Object.keys(DOCS).map(k => ({
        label: DOCS[k].title,
        hint: DOCS[k].crumb[0],
        icon: icon("FileText"),
        onSelect: () => select(k)
      }))
    }, {
      label: "Canisters",
      items: [{
        label: "icp-ledger",
        hint: "ryjl3-tyaaa-aaaaa-aaaba-cai",
        icon: icon("Box")
      }, {
        label: "ckbtc-minter",
        hint: "mqygn-kiaaa-aaaar-qaadq-cai",
        icon: icon("Box")
      }]
    }]
  }) : null);
}
Object.assign(window, {
  DocsApp,
  Block,
  H2
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/docs/DocsApp.jsx", error: String((e && e.message) || e) }); }

// ui_kits/docs/content.jsx
try { (() => {
const DOC_NAV = [{
  label: "Getting started",
  items: [{
    value: "why",
    label: "Why IC Reactor"
  }, {
    value: "install",
    label: "Install"
  }, {
    value: "quickstart",
    label: "Quick start",
    badge: "★"
  }]
}, {
  label: "Core patterns",
  items: [{
    value: "hooks",
    label: "Generic hooks"
  }, {
    value: "factories",
    label: "Query factories"
  }, {
    value: "display",
    label: "DisplayReactor"
  }]
}, {
  label: "Codegen",
  items: [{
    value: "vite",
    label: "Vite plugin"
  }, {
    value: "cli",
    label: "CLI"
  }]
}, {
  label: "Reference",
  items: [{
    value: "api",
    label: "API reference"
  }, {
    value: "candid",
    label: "Dynamic Candid"
  }]
}];
const DOCS = {
  quickstart: {
    crumb: ["Getting started", "Quick start"],
    title: "Quick start",
    lead: "One call creates the QueryClient, ClientManager, reactor and bound hooks — including useAuth, useAgentState, useUserPrincipal and useIdentityAttributes.",
    toc: ["Fastest path", "Use in components", "What you get"],
    blocks: [{
      type: "h",
      text: "Fastest path: defineReactor"
    }, {
      type: "p",
      text: "Point defineReactor at a canister and it wires the whole client for you. The manual construction order still exists for when you need explicit control."
    }, {
      type: "code",
      file: "src/reactor.ts",
      code: `import { defineReactor } from "@ic-reactor/react"
import { idlFactory, type _SERVICE } from "./declarations/my_canister"

export const {
  reactor: backendReactor,
  queryClient,
  clientManager,
  useActorQuery,
  useActorMutation,
  useAuth,
} = defineReactor<_SERVICE>({
  name: "backend",
  idlFactory,
  canisterId: "rrkah-fqaaa-aaaaa-aaaaq-cai",
  display: true,
})`
    }, {
      type: "h",
      text: "Use in components"
    }, {
      type: "code",
      file: "src/App.tsx",
      code: `function Greeting() {
  const { data, isPending, error } = useActorQuery({
    functionName: "greet",
    args: ["World"],
  })

  if (isPending) return <div>Loading…</div>
  if (error) return <div>Error: {error.message}</div>
  return <h1>{data}</h1>
}`
    }, {
      type: "callout",
      color: "warning",
      title: "Hooks are React-only",
      text: "Do not call useActorQuery, .useQuery() or .useMutation() outside React components or custom hooks. For loaders and services use fetch() and execute()."
    }, {
      type: "h",
      text: "What you get"
    }, {
      type: "table",
      head: ["Feature", "Standard Actor", "IC Reactor"],
      rows: [["Type-safe method calls", "yes", "yes"], ["Query caching", "no", "yes"], ["Background refetching", "no", "yes"], ["Typed Ok/Err handling", "manual", "yes"], ["Shared auth + cache", "no", "ClientManager"], ["Display transforms", "no", "DisplayReactor"]]
    }]
  },
  api: {
    crumb: ["Reference", "API reference"],
    title: "API reference",
    lead: "Every export in @ic-reactor/react, with the package that owns it.",
    toc: ["Factories", "Hooks", "Managers"],
    blocks: [{
      type: "h",
      text: "Factories"
    }, {
      type: "api",
      rows: [["defineReactor<T>(config)", "@ic-reactor/react", "Creates QueryClient, ClientManager, Reactor and bound hooks in one call."], ["createActorHooks(reactor)", "@ic-reactor/react", "Returns useActorQuery, useActorMutation, useActorSuspenseQuery, useActorInfiniteQuery."], ["createAuthHooks(auth)", "@ic-reactor/react", "Returns useAuth and useUserPrincipal."], ["createQuery(reactor, opts)", "@ic-reactor/react", "Reusable query object usable inside and outside React."], ["createMutation(reactor, opts)", "@ic-reactor/react", "Reusable mutation with invalidateQueries support."]]
    }, {
      type: "h",
      text: "Managers"
    }, {
      type: "api",
      rows: [["ClientManager", "@ic-reactor/core", "Shared agent and cache coordination."], ["AuthenticationManager", "@ic-reactor/react", "Internet Identity login, logout and delegation."], ["Reactor<T>", "@ic-reactor/core", "Typed canister runtime: fetchQuery, callMethod, invalidateQueries."], ["DisplayReactor", "@ic-reactor/core", "Reactor with UI-friendly transforms — bigint and Principal as strings."], ["CandidDisplayReactor", "@ic-reactor/candid", "Runtime Candid parsing for explorers and dev tools."]]
    }]
  },
  install: {
    crumb: ["Getting started", "Install"],
    title: "Install",
    lead: "Pick the entry point that matches your app.",
    toc: ["React", "Non-React", "Optional"],
    blocks: [{
      type: "h",
      text: "React apps"
    }, {
      type: "code",
      file: "terminal",
      code: "pnpm add @ic-reactor/react @icp-sdk/core @tanstack/react-query"
    }, {
      type: "h",
      text: "Non-React apps"
    }, {
      type: "code",
      file: "terminal",
      code: "pnpm add @ic-reactor/core @icp-sdk/core @tanstack/query-core"
    }, {
      type: "h",
      text: "Optional packages"
    }, {
      type: "code",
      file: "terminal",
      code: `# Internet Identity auth helpers
pnpm add @icp-sdk/auth

# Dynamic Candid support (explorers / dev tools)
pnpm add @ic-reactor/candid @ic-reactor/parser`
    }]
  }
};
Object.assign(window, {
  DOC_NAV,
  DOCS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/docs/content.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/App.jsx
try { (() => {
const {
  IconOf,
  Button,
  BrandMark,
  NavBar,
  Icon,
  Command
} = typeof window !== "undefined" && window.B3PayDesignSystem_8a84cb || {};
const icon = IconOf;
const ROUTES = [{
  key: "home",
  label: "Home"
}, {
  key: "products",
  label: "Products"
}, {
  key: "developers",
  label: "Developers"
}, {
  key: "about",
  label: "About"
}, {
  key: "blog",
  label: "Blog"
}, {
  key: "contact",
  label: "Contact"
}];
function Footer({
  go
}) {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: "1px solid var(--border)",
      background: "var(--ink-100)",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      height: 1,
      background: "var(--heat-edge)",
      opacity: 0.6
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1240,
      margin: "0 auto",
      padding: "64px 24px 40px",
      display: "grid",
      gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
      gap: 40
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(BrandMark, {
    size: 26
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "18px 0 0",
      fontSize: 14,
      lineHeight: "22px",
      color: "var(--muted-foreground)",
      maxWidth: 300
    }
  }, "Open-source infrastructure for decentralized applications, wallets and payments on the Internet Computer.")), [{
    h: "Products",
    items: ["B3Forge", "B3Wallet", "IC Reactor", "B3Note", "B3Utils"]
  }, {
    h: "Developers",
    items: ["Documentation", "npm packages", "docs.rs", "Agent skills"]
  }, {
    h: "Organisation",
    items: ["About", "Blog", "GitHub", "Contact"]
  }].map(col => /*#__PURE__*/React.createElement("div", {
    key: col.h
  }, /*#__PURE__*/React.createElement("div", {
    className: "b3-eyebrow"
  }, col.h), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
      marginTop: 16
    }
  }, col.items.map(i => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "#",
    style: {
      fontSize: 14,
      color: "var(--muted-foreground)",
      textDecoration: "none"
    }
  }, i)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1240,
      margin: "0 auto",
      padding: "20px 24px 40px",
      borderTop: "1px solid var(--border)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      letterSpacing: "0.1em",
      color: "var(--ink-600)"
    }
  }, "\xA9 2026 B3PAY \xB7 MIT LICENCE"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      letterSpacing: "0.1em",
      color: "var(--ink-600)"
    }
  }, "BUILT ON THE INTERNET COMPUTER")));
}
function App() {
  const [route, setRoute] = React.useState("home");
  const [palette, setPalette] = React.useState(false);
  const go = r => {
    setRoute(r);
    window.scrollTo(0, 0);
  };
  React.useEffect(() => {
    const h = e => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPalette(p => !p);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  const Page = {
    home: Home,
    products: Products,
    developers: Developers,
    about: About,
    blog: Blog,
    contact: Contact
  }[route];
  return /*#__PURE__*/React.createElement("div", {
    onClick: e => {
      const a = e.target.closest("a[href^='#']");
      if (a) {
        const k = a.getAttribute("href").slice(1);
        if (ROUTES.some(r => r.key === k)) {
          e.preventDefault();
          go(k);
        }
      }
    }
  }, /*#__PURE__*/React.createElement(NavBar, {
    brand: /*#__PURE__*/React.createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        go("home");
      },
      style: {
        display: "flex"
      }
    }, /*#__PURE__*/React.createElement(BrandMark, {
      size: 26
    })),
    active: ROUTES.find(r => r.key === route).label,
    links: ROUTES.slice(1, 5).map(r => ({
      label: r.label,
      href: "#" + r.key
    })),
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "ghost",
      icon: icon("Search"),
      onClick: () => setPalette(true)
    }, "\u2318K"), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "ghost",
      icon: icon("Github")
    }, "GitHub"), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "filled",
      color: "primary",
      onClick: () => go("contact")
    }, "Get started"))
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Page, {
    go: go
  })), /*#__PURE__*/React.createElement(Footer, {
    go: go
  }), palette ? /*#__PURE__*/React.createElement(Command, {
    onClose: () => setPalette(false),
    placeholder: "Search products, packages and docs\u2026",
    groups: [{
      label: "Pages",
      items: ROUTES.map(r => ({
        label: r.label,
        icon: icon("FileText"),
        onSelect: () => go(r.key)
      }))
    }, {
      label: "Packages",
      items: [{
        label: "@ic-reactor/react",
        hint: "npm",
        icon: icon("Package")
      }, {
        label: "@ic-reactor/core",
        hint: "npm",
        icon: icon("Package")
      }, {
        label: "b3_utils",
        hint: "crates.io",
        icon: icon("Package")
      }]
    }]
  }) : null);
}
Object.assign(window, {
  App,
  Footer,
  ROUTES
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Home.jsx
try { (() => {
const {
  IconOf,
  Button,
  Badge,
  Card,
  CardHeader,
  CardFooter,
  BrandMark,
  CodeBlock,
  WorkflowNode,
  PrincipalDisplay
} = typeof window !== "undefined" && window.B3PayDesignSystem_8a84cb || {};
const icon = IconOf;

/* The background is a payment-gateway topology: every node is a real hop a
   ckBTC checkout passes through. The run panel lights them as it executes. */
const NODES = [{
  x: 6,
  y: 18,
  l: "checkout"
}, {
  x: 6,
  y: 72,
  l: "merchant"
}, {
  x: 17,
  y: 42,
  l: "invoice"
}, {
  x: 28,
  y: 13,
  l: "wallet"
}, {
  x: 27,
  y: 67,
  l: "kyt-check"
}, {
  x: 38,
  y: 89,
  l: "rate-oracle"
}, {
  x: 39,
  y: 34,
  l: "icp-ledger"
}, {
  x: 50,
  y: 58,
  l: "ckbtc-ledger"
}, {
  x: 51,
  y: 9,
  l: "fee-vault"
}, {
  x: 63,
  y: 30,
  l: "settlement"
}, {
  x: 74,
  y: 56,
  l: "receipt"
}, {
  x: 76,
  y: 12,
  l: "webhook"
}, {
  x: 85,
  y: 84,
  l: "audit-log"
}, {
  x: 88,
  y: 40,
  l: "payout"
}, {
  x: 95,
  y: 66,
  l: "refund"
}];
const EDGES = [[0, 2], [1, 2], [2, 3], [2, 6], [3, 4], [3, 6], [4, 6], [4, 7], [5, 7], [6, 7], [6, 8], [7, 8], [7, 9], [8, 9], [9, 10], [9, 11], [10, 12], [10, 13], [11, 13], [12, 14], [13, 14]];

/* Payment-gateway topology behind the hero. Blurred at rest; the cursor carries
   a spotlight that brings it into focus. `active` switches nodes on. */
function NodeField({
  active
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const host = el.parentElement;
    const move = e => {
      const r = host.getBoundingClientRect();
      el.style.setProperty("--mx", e.clientX - r.left + "px");
      el.style.setProperty("--my", e.clientY - r.top + "px");
      el.dataset.live = "true";
    };
    const leave = () => {
      el.dataset.live = "false";
    };
    host.addEventListener("mousemove", move);
    host.addEventListener("mouseleave", leave);
    return () => {
      host.removeEventListener("mousemove", move);
      host.removeEventListener("mouseleave", leave);
    };
  }, []);
  const layer = sharp => /*#__PURE__*/React.createElement("div", {
    className: "b3-nodefield__layer b3-nodefield__layer--" + (sharp ? "sharp" : "blur"),
    key: sharp ? "s" : "b"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "100%",
    height: "100%",
    viewBox: "0 0 100 100",
    preserveAspectRatio: "none",
    style: {
      position: "absolute",
      inset: 0
    },
    "aria-hidden": true
  }, EDGES.map(([i, j], k) => {
    const on = active.has(i) && active.has(j);
    return /*#__PURE__*/React.createElement("line", {
      key: k,
      x1: NODES[i].x,
      y1: NODES[i].y,
      x2: NODES[j].x,
      y2: NODES[j].y,
      stroke: on ? "var(--forge-500)" : "var(--ink-500)",
      strokeWidth: on ? 1.6 : 1,
      vectorEffect: "non-scaling-stroke",
      style: {
        transition: "stroke var(--dur-slow) var(--ease-out)"
      }
    });
  })), NODES.map((n, i) => {
    const on = active.has(i);
    const flip = n.x > 68;
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      className: "b3-nodefield__node" + (flip ? " b3-nodefield__node--flip" : ""),
      style: {
        left: n.x + "%",
        top: n.y + "%"
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "b3-nodefield__dot" + (on ? " b3-nodefield__dot--hot" : "")
    }), /*#__PURE__*/React.createElement("span", {
      className: "b3-nodefield__label",
      style: {
        color: on ? "var(--forge-500)" : "var(--text-mark)"
      }
    }, n.l));
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: "b3-nodefield",
    ref: ref,
    "data-live": "false"
  }, layer(false), layer(true));
}

/* One checkout: two B3Forge seats, paid in ckBTC. Each call lights the hops it
   touches in the background topology. */
const STEPS = [{
  fn: "invoice_create",
  target: "merchant",
  ms: "9ms",
  lights: [0, 1, 2]
}, {
  fn: "icrc2_approve",
  target: "wallet",
  ms: "12ms",
  lights: [3, 4, 6]
}, {
  fn: "icrc1_transfer",
  target: "ckbtc-ledger",
  ms: "38ms",
  lights: [5, 7, 8]
}, {
  fn: "settle_receipt",
  target: "browser",
  ms: "4ms",
  lights: [9, 10, 11, 12, 13]
} // refund stays dark
];
function Hero({
  go
}) {
  const [step, setStep] = React.useState(0);
  const [run, setRun] = React.useState(0);
  React.useEffect(() => {
    setStep(0);
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setStep(i);
      if (i >= STEPS.length) clearInterval(t);
    }, 1100);
    return () => clearInterval(t);
  }, [run]);
  const active = React.useMemo(() => {
    const s = new Set();
    STEPS.slice(0, step).forEach(st => st.lights.forEach(n => s.add(n)));
    return s;
  }, [step]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      overflow: "hidden",
      borderBottom: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "b3-colgrid"
  }), /*#__PURE__*/React.createElement(NodeField, {
    active: active
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--heat-glow)",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      height: 2,
      background: "var(--gradient-brand)",
      animation: "b3-glow-breathe 4s var(--ease-in-out) infinite"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "b3-spine"
  }, "B3PAY / ORG / EST 2023 / INTERNET COMPUTER"), /*#__PURE__*/React.createElement("span", {
    className: "b3-tick b3-tick--hot",
    style: {
      left: 18,
      top: 18
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "b3-tick",
    style: {
      right: 18,
      top: 18
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      maxWidth: 1240,
      margin: "0 auto",
      padding: "116px 24px 56px",
      display: "grid",
      gridTemplateColumns: "minmax(0,1.05fr) minmax(0,0.95fr)",
      gap: 56,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "b3-eyebrow",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: 9999,
      background: "var(--forge-500)",
      boxShadow: "var(--glow-forge-sm)"
    }
  }), "Open source \xB7 Internet Computer \xB7 since 2023"), /*#__PURE__*/React.createElement("h1", {
    className: "b3-display",
    style: {
      margin: "26px 0 0",
      fontSize: "clamp(44px, 6.6vw, 92px)"
    }
  }, "Infrastructure for apps that hold their own keys."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 18,
      marginTop: 30,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 1,
      background: "var(--forge-600)",
      marginTop: 14,
      flex: "none"
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 19,
      lineHeight: "30px",
      color: "var(--muted-foreground)",
      maxWidth: 520,
      textWrap: "pretty"
    }
  }, "B3Pay builds open-source wallets, TypeScript libraries and workflow tooling for the Internet Computer. No centralized backend sits between your users and their assets.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginTop: 38
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "xl",
    variant: "filled",
    color: "primary",
    bevel: true,
    onClick: () => go("developers"),
    iconRight: icon("ArrowRight")
  }, "Start building"), /*#__PURE__*/React.createElement(Button, {
    size: "xl",
    variant: "outlined",
    onClick: () => go("products"),
    icon: icon("Github")
  }, "View the repos")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      marginTop: 46,
      borderTop: "1px solid var(--border)"
    }
  }, [["03", "chains"], ["05", "projects"], ["07", "packages"], ["MIT", "licence"]].map(([v, l], i) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      flex: 1,
      paddingTop: 14,
      borderRight: i < 3 ? "1px solid var(--border)" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: "-0.03em",
      fontVariantNumeric: "tabular-nums"
    }
  }, v), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "var(--muted-foreground)",
      marginTop: 5
    }
  }, l))))), /*#__PURE__*/React.createElement(HeroRun, {
    step: step,
    onRetry: () => setRun(r => r + 1)
  })));
}

/* The right column shows that checkout processing, then its result. */
function HeroRun({
  step,
  onRetry
}) {
  const done = step >= STEPS.length;
  return /*#__PURE__*/React.createElement("div", {
    className: "b3-scan",
    style: {
      position: "relative",
      background: "var(--ink-050)",
      border: "1px solid var(--border)",
      boxShadow: "var(--shadow-lg)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      height: 40,
      padding: "0 14px",
      borderBottom: "1px solid var(--border)",
      background: "var(--card)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "var(--muted-foreground)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, "Checkout \u2014 order 4821 \xB7 2 seats"), /*#__PURE__*/React.createElement(Badge, {
    color: done ? "success" : "warning",
    size: "xs",
    dot: true
  }, done ? "Paid" : "Running")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 16px 14px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "b3-eyebrow",
    style: {
      marginBottom: 12
    }
  }, "Processing"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column"
    }
  }, STEPS.map((s, i) => {
    const ran = step > i;
    const active = step === i + 1;
    return /*#__PURE__*/React.createElement("div", {
      key: s.fn,
      style: {
        display: "grid",
        gridTemplateColumns: "12px minmax(0,1fr) auto auto",
        gap: 10,
        alignItems: "center",
        padding: "8px 0",
        borderTop: i ? "1px solid var(--border)" : 0,
        opacity: ran ? 1 : 0.34,
        transition: "opacity var(--dur-slow) var(--ease-dock)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 6,
        height: 6,
        borderRadius: 9999,
        background: ran ? "var(--success)" : "var(--ink-500)",
        boxShadow: active ? "0 0 8px 1px var(--success)" : "none",
        justifySelf: "center"
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        color: "var(--foreground)",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, s.fn), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        color: "var(--muted-foreground)"
      }
    }, s.target), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        color: ran ? "var(--success)" : "var(--text-mark)",
        minWidth: 34,
        textAlign: "right"
      }
    }, ran ? s.ms : "—"));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      margin: "18px 0 12px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "b3-eyebrow"
  }, "Result"), /*#__PURE__*/React.createElement("hr", {
    className: "b3-rule-hot",
    style: {
      flex: 1
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid " + (done ? "color-mix(in srgb,var(--success) 45%,transparent)" : "var(--border)"),
      background: done ? "color-mix(in srgb,var(--success) 8%,transparent)" : "transparent",
      padding: "14px",
      transition: "border-color var(--dur-slow) var(--ease-out), background-color var(--dur-slow) var(--ease-out)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "b3-display",
    style: {
      fontSize: 30,
      fontVariantNumeric: "tabular-nums",
      color: done ? "var(--foreground)" : "var(--ink-500)",
      transition: "color var(--dur-slow) var(--ease-out)"
    }
  }, done ? "0.0241" : "0.0000", " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 13,
      fontWeight: 400,
      letterSpacing: 0,
      color: "var(--muted-foreground)"
    }
  }, "ckBTC")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: done ? "var(--success)" : "var(--text-mark)"
    }
  }, done ? "Settled" : "Pending")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      color: "var(--muted-foreground)",
      marginTop: 8
    }
  }, done ? "block 1 284 907 · fee 0.0000021 · payout to merchant" : "awaiting settlement"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    fullWidth: true,
    style: {
      marginTop: 14
    },
    variant: done ? "outlined" : "filled",
    color: done ? "secondary" : "primary",
    isLoading: step > 0 && !done,
    icon: icon(done ? "RotateCcw" : "Zap"),
    onClick: done ? onRetry : undefined
  }, done ? "Run it again" : "Pay 0.0241 ckBTC"))));
}
function Home({
  go
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Hero, {
    go: go
  }), /*#__PURE__*/React.createElement(Section, {
    eyebrow: "What we build",
    spec: "FIG. 01",
    title: "Five open-source projects, one thesis.",
    lead: "Users should keep custody. Developers should not have to give up type safety to make that happen. Everything below is MIT-licensed and runs on the Internet Computer."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,minmax(0,1fr))",
      gap: 16
    }
  }, PRODUCTS.map((p, i) => /*#__PURE__*/React.createElement(Card, {
    key: p.key,
    interactive: true,
    onClick: () => go("products"),
    style: {
      borderRadius: 0,
      ...(i === 0 ? {
        gridColumn: "span 2"
      } : null)
    }
  }, /*#__PURE__*/React.createElement(CardHeader, {
    title: /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-display)",
        fontSize: 22,
        letterSpacing: "-0.022em"
      }
    }, p.name),
    description: p.line,
    action: /*#__PURE__*/React.createElement(Badge, {
      color: p.tagColor,
      size: "xs"
    }, p.tag)
  }), /*#__PURE__*/React.createElement(CardFooter, null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--muted-foreground)",
      letterSpacing: "0.06em"
    }
  }, p.lang)))))), /*#__PURE__*/React.createElement(Rule, null), /*#__PURE__*/React.createElement(Section, {
    eyebrow: "How it works",
    spec: "FIG. 02",
    title: "No backend. No custody handover.",
    lead: "Every product here runs its logic on the client or inside a canister the user owns. That constraint shapes the whole stack."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,minmax(0,1fr))",
      gap: 44
    }
  }, [{
    n: "01",
    h: "Identity stays with the user",
    b: "Internet Identity issues a delegated identity in the browser. B3Pay never holds a key, a seed phrase or a session on a server."
  }, {
    n: "02",
    h: "State lives in a canister",
    b: "A B3Wallet is a canister the user controls. Upgrades, signers and thresholds are decisions they make on-chain, not requests to us."
  }, {
    n: "03",
    h: "Types survive the boundary",
    b: "IC Reactor generates TypeScript from Candid, so a canister method signature is a compile error in your editor before it is a runtime failure."
  }].map(s => /*#__PURE__*/React.createElement("div", {
    key: s.n
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      color: "var(--forge-500)",
      letterSpacing: "0.14em"
    }
  }, s.n), /*#__PURE__*/React.createElement("hr", {
    className: "b3-rule-hot",
    style: {
      margin: "14px 0 18px"
    }
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: "var(--font-display)",
      fontSize: 21,
      fontWeight: 600,
      letterSpacing: "-0.018em"
    }
  }, s.h), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "12px 0 0",
      fontSize: 15,
      lineHeight: "24px",
      color: "var(--muted-foreground)",
      textWrap: "pretty"
    }
  }, s.b))))), /*#__PURE__*/React.createElement(Section, {
    bg: "var(--ink-100)",
    tight: true
  }, /*#__PURE__*/React.createElement(Slab, {
    style: {
      padding: 0
    },
    part: "IC-REACTOR / 1.2.0"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "56px 48px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "b3-eyebrow"
  }, "For developers"), /*#__PURE__*/React.createElement("h2", {
    className: "b3-display",
    style: {
      margin: "18px 0 0",
      fontSize: 40
    }
  }, "One call wires the client, the cache and the hooks."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "18px 0 0",
      fontSize: 16,
      lineHeight: "26px",
      color: "var(--muted-foreground)"
    }
  }, /*#__PURE__*/React.createElement("code", {
    style: {
      fontFamily: "var(--font-mono)",
      color: "var(--forge-500)"
    }
  }, "defineReactor"), " creates the QueryClient, ClientManager, reactor and bound hooks \u2014 including ", /*#__PURE__*/React.createElement("code", {
    style: {
      fontFamily: "var(--font-mono)"
    }
  }, "useAuth"), " and ", /*#__PURE__*/React.createElement("code", {
    style: {
      fontFamily: "var(--font-mono)"
    }
  }, "useUserPrincipal"), "."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 30
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "filled",
    color: "primary",
    onClick: () => go("developers")
  }, "Read the guide"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    icon: icon("Package")
  }, "npm"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "48px 40px 48px 0"
    }
  }, /*#__PURE__*/React.createElement(CodeBlock, {
    filename: "src/reactor.ts",
    code: `import { defineReactor } from "@ic-reactor/react"
import { idlFactory, type _SERVICE } from "./declarations/backend"

export const {
  reactor,
  useActorQuery,
  useActorMutation,
  useAuth,
} = defineReactor<_SERVICE>({
  name: "backend",
  idlFactory,
  canisterId: "rrkah-fqaaa-aaaaa-aaaaq-cai",
  display: true,
})`
  }))))));
}
Object.assign(window, {
  Home,
  Hero,
  HeroRun,
  NodeField
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Pages.jsx
try { (() => {
const {
  IconOf,
  Button,
  Badge,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Icon,
  CodeBlock,
  Tabs,
  Input,
  Alert,
  Label,
  Select,
  Textarea,
  Checkbox,
  BrandMark
} = typeof window !== "undefined" && window.B3PayDesignSystem_8a84cb || {};
const icon = IconOf;

/* ── Developers ────────────────────────────────────────────────── */
function Developers({
  go
}) {
  const [tab, setTab] = React.useState("react");
  const samples = {
    react: {
      file: "src/App.tsx",
      code: `function Greeting() {
  const { data, isPending, error } = useActorQuery({
    functionName: "greet",
    args: ["World"],
  })

  if (isPending) return <div>Loading…</div>
  if (error) return <div>Error: {error.message}</div>
  return <h1>{data}</h1>
}`
    },
    factory: {
      file: "src/queries.ts",
      code: `export const getProfile = createQuery(backendReactor, {
  functionName: "get_profile",
})

export const updateProfile = createMutation(backendReactor, {
  functionName: "update_profile",
  invalidateQueries: [getProfile.getQueryKey()],
})`
    },
    codegen: {
      file: "vite.config.ts",
      code: `export default defineConfig({
  plugins: [
    react(),
    icReactor({
      canisters: [{ name: "backend", didFile: "./backend/backend.did" }],
    }),
  ],
})`
    }
  };
  const s = samples[tab];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Section, {
    eyebrow: "For developers",
    title: "Typed canister calls, cached and invalidated for you.",
    lead: "IC Reactor sits above the raw Actor API. You keep type safety and control; you stop writing cache keys by hand."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1240,
      margin: "0 auto",
      padding: "0 24px 96px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "minmax(0,0.85fr) minmax(0,1.15fr)",
      gap: 48,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "b3-eyebrow",
    style: {
      marginBottom: 16
    }
  }, "Install"), /*#__PURE__*/React.createElement(CodeBlock, {
    filename: "React apps",
    code: "pnpm add @ic-reactor/react @icp-sdk/core @tanstack/react-query"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 10
    }
  }), /*#__PURE__*/React.createElement(CodeBlock, {
    filename: "Non-React",
    code: "pnpm add @ic-reactor/core @icp-sdk/core @tanstack/query-core"
  }), /*#__PURE__*/React.createElement("div", {
    className: "b3-eyebrow",
    style: {
      margin: "40px 0 14px"
    }
  }, "Packages"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column"
    }
  }, [["@ic-reactor/core", "ClientManager, Reactor, DisplayReactor"], ["@ic-reactor/react", "Hooks and query/mutation factories"], ["@ic-reactor/candid", "Dynamic Candid parsing"], ["@ic-reactor/parser", "WASM Candid parser"], ["@ic-reactor/codegen", "Shared codegen pipeline"], ["@ic-reactor/cli", "Declarations and typed hooks"], ["@ic-reactor/vite-plugin", "Watch-mode hook generation"]].map(([n, d]) => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      padding: "12px 0",
      borderTop: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      color: "var(--forge-500)"
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--muted-foreground)",
      marginTop: 3
    }
  }, d))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Tabs, {
    variant: "underline",
    value: tab,
    onChange: setTab,
    tabs: [{
      value: "react",
      label: "Hooks"
    }, {
      value: "factory",
      label: "Query factories"
    }, {
      value: "codegen",
      label: "Codegen"
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(CodeBlock, {
    filename: s.file,
    code: s.code,
    numbered: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28
    }
  }, /*#__PURE__*/React.createElement(Alert, {
    color: "info",
    title: "Do not call hooks outside React",
    icon: icon("Info")
  }, "Use ", /*#__PURE__*/React.createElement("code", {
    style: {
      fontFamily: "var(--font-mono)"
    }
  }, "getProfile.fetch()"), " and ", /*#__PURE__*/React.createElement("code", {
    style: {
      fontFamily: "var(--font-mono)"
    }
  }, "updateProfile.execute()"), " in loaders, services and tests.")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28,
      display: "grid",
      gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, {
    title: "Reactor vs Actor",
    description: "Caching, background refetch, typed Ok/Err and shared auth \u2014 none of which the standard Actor gives you.",
    icon: icon("GitCompare")
  })), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, {
    title: "Agent skills",
    description: "ic-reactor-hooks ships as an installable skill for AI coding agents.",
    icon: icon("Bot")
  })))))));
}

/* ── About ─────────────────────────────────────────────────────── */
function About() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Section, {
    eyebrow: "About",
    title: "A small team building in the open since 2023.",
    lead: "B3Pay started as a self-custodial wallet experiment on the Internet Computer and grew into a set of libraries other teams now depend on. Every line is public."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1240,
      margin: "0 auto",
      padding: "0 24px 120px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
      gap: 64
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: "var(--font-display)",
      fontSize: 26,
      fontWeight: 600,
      letterSpacing: "-0.022em"
    }
  }, "What we are working toward"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "16px 0 0",
      fontSize: 16,
      lineHeight: "26px",
      color: "var(--muted-foreground)",
      textWrap: "pretty"
    }
  }, "Decentralized payments that are simple enough for everyday users and businesses. That is a long way off, and the honest path there runs through tooling: wallets people can actually recover, libraries that make canister integration boring, and workflows a non-programmer can read."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32,
      display: "flex",
      flexDirection: "column"
    }
  }, [["2023", "B3Wallet — multi-chain, multi-owner canister wallet"], ["2023", "b3_utils published to crates.io"], ["2023", "B3Note — witness-like encryption demo on VetKeys"], ["2024", "IC Reactor reaches seven packages"], ["2025", "B3Forge enters beta — browser workflow execution"]].map(([y, t]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: "flex",
      gap: 20,
      padding: "14px 0",
      borderTop: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      color: "var(--forge-500)",
      width: 40,
      flex: "none"
    }
  }, y), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      lineHeight: "22px"
    }
  }, t))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Slab, {
    style: {
      padding: 40
    }
  }, /*#__PURE__*/React.createElement(BrandMark, {
    variant: "stacked",
    size: 64
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "32px 0 0",
      fontFamily: "var(--font-accent)",
      fontSize: 24,
      lineHeight: "34px",
      color: "var(--ink-800)",
      textWrap: "pretty"
    }
  }, "Users maintain exclusive control over their canisters, and therefore their funds."), /*#__PURE__*/React.createElement("div", {
    className: "b3-eyebrow",
    style: {
      marginTop: 18
    }
  }, "B3Wallet README")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      display: "grid",
      gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, {
    title: "Open by default",
    description: "MIT on every repository. Issues and PRs welcome.",
    icon: icon("Github")
  })), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, {
    title: "Agent-ready",
    description: "llms.txt, AGENTS.md and skill packages ship with the code.",
    icon: icon("Terminal")
  })))))));
}

/* ── Blog ──────────────────────────────────────────────────────── */
const POSTS = [{
  t: "Candid expressions: referencing prior node outputs",
  d: "2025-11-04",
  tag: "B3Forge",
  e: "How $N0.Ok.amount resolves, why opt-depth matters, and what the Rust compatibility engine rejects at edit time."
}, {
  t: "defineReactor: one call instead of three",
  d: "2025-09-18",
  tag: "IC Reactor",
  e: "The manual construction order still works. Here is when you still need it."
}, {
  t: "Why B3Wallet upgrades itself",
  d: "2025-06-02",
  tag: "B3Wallet",
  e: "Self-upgrade keeps a user-owned canister current without asking us for permission."
}, {
  t: "Timelock notes with VetKeys",
  d: "2024-12-11",
  tag: "B3Note",
  e: "Identity-based encryption without email addresses or pre-shared keys."
}];
function Blog() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Section, {
    eyebrow: "Writing",
    title: "Notes from the build.",
    lead: "Implementation write-ups, not announcements."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1240,
      margin: "0 auto",
      padding: "0 24px 120px"
    }
  }, POSTS.map(p => /*#__PURE__*/React.createElement("a", {
    key: p.t,
    href: "#",
    style: {
      display: "grid",
      gridTemplateColumns: "120px 1fr auto",
      gap: 28,
      alignItems: "baseline",
      padding: "26px 0",
      borderTop: "1px solid var(--border)",
      textDecoration: "none",
      color: "inherit"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--ink-600)"
    }
  }, p.d), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 24,
      fontWeight: 600,
      letterSpacing: "-0.022em"
    }
  }, p.t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      lineHeight: "24px",
      color: "var(--muted-foreground)",
      marginTop: 8,
      maxWidth: 620
    }
  }, p.e)), /*#__PURE__*/React.createElement(Badge, {
    size: "xs",
    color: "secondary"
  }, p.tag)))));
}

/* ── Contact / get started ─────────────────────────────────────── */
function Contact() {
  const [sent, setSent] = React.useState(false);
  return /*#__PURE__*/React.createElement(Section, {
    eyebrow: "Get started",
    title: "Tell us what you are building.",
    lead: "Grant applications, integration questions and bug reports all land in the same inbox. We answer in engineering terms."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
      gap: 64,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardContent, {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "40px 0",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--success)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Check",
    size: 28,
    style: {
      margin: "0 auto"
    }
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "14px 0 0",
      fontFamily: "var(--font-display)",
      fontSize: 20,
      fontWeight: 600
    }
  }, "Message sent"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "8px 0 0",
      fontSize: 14,
      color: "var(--muted-foreground)"
    }
  }, "We reply within two working days."), /*#__PURE__*/React.createElement(Button, {
    style: {
      marginTop: 20
    },
    variant: "outlined",
    size: "sm",
    onClick: () => setSent(false)
  }, "Send another")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "n",
    required: true
  }, "Name"), /*#__PURE__*/React.createElement(Input, {
    id: "n",
    size: "lg",
    placeholder: "Ada Lovelace"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "e",
    required: true
  }, "Email"), /*#__PURE__*/React.createElement(Input, {
    id: "e",
    size: "lg",
    placeholder: "ada@example.org"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "t"
  }, "Topic"), /*#__PURE__*/React.createElement(Select, {
    id: "t",
    size: "lg",
    options: ["Integration question", "Grant / partnership", "Bug report", "Something else"]
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "m"
  }, "Message"), /*#__PURE__*/React.createElement(Textarea, {
    id: "m",
    rows: 5,
    placeholder: "What are you building, and where are you stuck?"
  })), /*#__PURE__*/React.createElement(Checkbox, {
    id: "oss",
    label: "I am happy for this to be discussed in a public issue"
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "filled",
    color: "primary",
    size: "lg",
    fullWidth: true,
    onClick: () => setSent(true)
  }, "Send")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column"
    }
  }, [["GitHub", "github.com/B3Pay", "Github"], ["Documentation", "IC Reactor docs and package READMEs", "BookOpen"], ["Crates", "docs.rs/b3_utils", "Package"], ["Live demo", "B3Note on icp0.io", "Play"]].map(([k, v, ic]) => /*#__PURE__*/React.createElement("a", {
    key: k,
    href: "#",
    style: {
      display: "flex",
      gap: 16,
      alignItems: "center",
      padding: "20px 0",
      borderTop: "1px solid var(--border)",
      textDecoration: "none",
      color: "inherit"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--forge-500)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 18
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontSize: 15,
      fontWeight: 500
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--muted-foreground)",
      marginTop: 3
    }
  }, v)), /*#__PURE__*/React.createElement(Icon, {
    name: "ArrowUpRight",
    size: 15,
    style: {
      color: "var(--muted-foreground)"
    }
  }))))));
}
Object.assign(window, {
  Developers,
  About,
  Blog,
  Contact,
  POSTS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Pages.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Products.jsx
try { (() => {
const {
  IconOf,
  Icon,
  Button,
  Badge,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CodeBlock,
  Tabs,
  Alert,
  PrincipalDisplay,
  WorkflowNode
} = typeof window !== "undefined" && window.B3PayDesignSystem_8a84cb || {};
const icon = IconOf;
function Products() {
  const [sel, setSel] = React.useState("b3forge");
  const p = PRODUCTS.find(x => x.key === sel);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Section, {
    eyebrow: "Products & ecosystem",
    title: "Everything B3Pay ships is public.",
    lead: "Pick a project to see what it does, how it is built and where the code lives. All five are MIT-licensed and developed in the open."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1240,
      margin: "0 auto",
      padding: "0 24px 120px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 0,
      borderTop: "1px solid var(--border)",
      borderBottom: "1px solid var(--border)",
      marginBottom: 40
    }
  }, PRODUCTS.map(x => /*#__PURE__*/React.createElement("button", {
    key: x.key,
    type: "button",
    onClick: () => setSel(x.key),
    style: {
      flex: 1,
      background: sel === x.key ? "var(--card)" : "transparent",
      border: 0,
      borderRight: "1px solid var(--border)",
      padding: "20px 18px",
      textAlign: "left",
      cursor: "pointer",
      borderTop: sel === x.key ? "2px solid var(--forge-500)" : "2px solid transparent",
      transition: "background-color var(--dur-fast) var(--ease-out)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 17,
      fontWeight: 600,
      color: sel === x.key ? "var(--foreground)" : "var(--muted-foreground)",
      letterSpacing: "-0.018em"
    }
  }, x.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 9,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "var(--ink-600)",
      marginTop: 6
    }
  }, x.tag)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "minmax(0,1.15fr) minmax(0,0.85fr)",
      gap: 48,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: "var(--font-display)",
      fontSize: 42,
      fontWeight: 600,
      letterSpacing: "-0.03em"
    }
  }, p.name), /*#__PURE__*/React.createElement(Badge, {
    color: p.tagColor
  }, p.tag)), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "18px 0 0",
      fontSize: 18,
      lineHeight: "28px",
      color: "var(--muted-foreground)",
      textWrap: "pretty"
    }
  }, p.line), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      padding: 0,
      margin: "34px 0 0",
      display: "flex",
      flexDirection: "column",
      gap: 0
    }
  }, p.points.map(pt => /*#__PURE__*/React.createElement("li", {
    key: pt,
    style: {
      display: "flex",
      gap: 14,
      alignItems: "flex-start",
      padding: "14px 0",
      borderTop: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--forge-500)",
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Check",
    size: 15
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      lineHeight: "23px"
    }
  }, pt)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "filled",
    color: "primary",
    icon: icon("Github")
  }, p.repo), /*#__PURE__*/React.createElement(Button, {
    variant: "outlined",
    icon: icon("BookOpen")
  }, "Documentation"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, {
    title: "Stack"
  }), /*#__PURE__*/React.createElement(CardContent, {
    style: {
      paddingTop: 4,
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, [["Language", p.lang], ["Modules", p.ic], ["Licence", "MIT"], ["Repository", p.repo]].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: "flex",
      justifyContent: "space-between",
      gap: 16,
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "b3-eyebrow"
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      textAlign: "right",
      color: "var(--ink-800)"
    }
  }, v))))), /*#__PURE__*/React.createElement(ProductAside, {
    sel: sel
  })))));
}
function ProductAside({
  sel
}) {
  if (sel === "ic-reactor") {
    return /*#__PURE__*/React.createElement(CodeBlock, {
      filename: "install",
      code: "pnpm add @ic-reactor/react \\\n  @icp-sdk/core @tanstack/react-query"
    });
  }
  if (sel === "b3forge") {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CodeBlock, {
      filename: "expression.candid",
      code: `(record {
  owner  = $N0.recipient_account.owner;
  amount = $N1.Ok.amount : nat;
  memo   = opt $N2.memo
})`
    }), /*#__PURE__*/React.createElement(Alert, {
      color: "warning",
      title: "Beta",
      icon: icon("TriangleAlert")
    }, "The canister stores and shares workflows. It does not execute them \u2014 execution is browser-only."));
  }
  if (sel === "b3wallet") {
    return /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, {
      title: "Signer consensus",
      description: "50% + 1. Three signers require two approvals."
    }), /*#__PURE__*/React.createElement(CardContent, {
      style: {
        paddingTop: 0,
        display: "flex",
        flexDirection: "column",
        gap: 8
      }
    }, [["Signer 1", "approved"], ["Signer 2", "approved"], ["Signer 3", "pending"]].map(([n, s]) => /*#__PURE__*/React.createElement("div", {
      key: n,
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 0",
        borderTop: "1px solid var(--border)"
      }
    }, /*#__PURE__*/React.createElement(PrincipalDisplay, {
      value: `${n === "Signer 3" ? "aaaaa" : "mxzaz"}-hqaaa-aaaar-qaada-cai`,
      head: 2,
      tail: 2,
      copyable: false
    }), /*#__PURE__*/React.createElement(Badge, {
      size: "xs",
      color: s === "approved" ? "success" : "muted",
      dot: true
    }, s)))));
  }
  if (sel === "b3note") {
    return /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, {
      title: "Expiry model",
      icon: icon("Timer")
    }), /*#__PURE__*/React.createElement(CardContent, {
      style: {
        paddingTop: 0,
        fontSize: 13,
        lineHeight: "21px",
        color: "var(--muted-foreground)"
      }
    }, "Anonymous users get 5 notes. Each note and each share link lives one hour. A canister global timer clears expired users and one-time keys. Notes also delete on first read."));
  }
  return /*#__PURE__*/React.createElement(CodeBlock, {
    filename: "Cargo.toml",
    code: '[dependencies]\nb3_utils = "0.11"'
  });
}
Object.assign(window, {
  Products
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Products.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/site.jsx
try { (() => {
const B = typeof window !== "undefined" && window.B3PayDesignSystem_8a84cb || {};
const {
  IconOf,
  Button,
  Badge,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  BrandMark,
  Icon,
  CodeBlock,
  PrincipalDisplay,
  WorkflowNode,
  Tabs,
  NavBar,
  Alert,
  Input
} = B;
const icon = IconOf;

/* ── Shared site furniture ─────────────────────────────────────── */

const Section = ({
  eyebrow,
  title,
  lead,
  children,
  tight,
  bg,
  spec,
  style
}) => /*#__PURE__*/React.createElement("section", {
  style: {
    padding: `${tight ? 72 : 120}px 24px`,
    background: bg,
    position: "relative",
    ...style
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "b3-colgrid"
}), /*#__PURE__*/React.createElement("span", {
  className: "b3-tick",
  style: {
    left: 18,
    top: 18
  }
}), /*#__PURE__*/React.createElement("span", {
  className: "b3-tick",
  style: {
    right: 18,
    bottom: 18
  }
}), /*#__PURE__*/React.createElement("div", {
  style: {
    maxWidth: 1240,
    margin: "0 auto",
    position: "relative"
  }
}, eyebrow ? /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 20
  }
}, /*#__PURE__*/React.createElement("span", {
  className: "b3-eyebrow"
}, eyebrow), /*#__PURE__*/React.createElement("hr", {
  className: "b3-rule-hot",
  style: {
    flex: 1
  }
}), spec ? /*#__PURE__*/React.createElement("span", {
  style: {
    fontFamily: "var(--font-mono)",
    fontSize: 9,
    letterSpacing: ".18em",
    color: "var(--text-mark)"
  }
}, spec) : null) : null, title ? /*#__PURE__*/React.createElement("h2", {
  className: "b3-display",
  style: {
    margin: 0,
    fontSize: 52,
    maxWidth: 820
  }
}, title) : null, lead ? /*#__PURE__*/React.createElement("p", {
  style: {
    margin: "22px 0 0",
    fontSize: 18,
    lineHeight: "28px",
    color: "var(--muted-foreground)",
    maxWidth: 620,
    textWrap: "pretty"
  }
}, lead) : null, children ? /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: title || lead ? 60 : 0
  }
}, children) : null));
const Rule = () => /*#__PURE__*/React.createElement("div", {
  style: {
    height: 1,
    background: "var(--border)"
  }
});
const Stat = ({
  value,
  label,
  unit
}) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "var(--font-display)",
    fontSize: 42,
    fontWeight: 600,
    letterSpacing: "-0.03em",
    fontVariantNumeric: "tabular-nums",
    lineHeight: 1
  }
}, value, unit ? /*#__PURE__*/React.createElement("span", {
  style: {
    fontFamily: "var(--font-mono)",
    fontSize: 14,
    color: "var(--muted-foreground)",
    marginLeft: 6
  }
}, unit) : null), /*#__PURE__*/React.createElement("div", {
  className: "b3-eyebrow",
  style: {
    marginTop: 10
  }
}, label));

/* Machined stock: square corners, diagonal brackets, scanline, part number. */
const Slab = ({
  children,
  style,
  glow = true,
  part
}) => /*#__PURE__*/React.createElement("div", {
  className: "b3-bracket b3-scan",
  style: {
    position: "relative",
    background: "var(--ink-100)",
    border: "1px solid var(--border)",
    overflow: "hidden",
    ...style
  }
}, glow ? /*#__PURE__*/React.createElement("div", {
  style: {
    position: "absolute",
    inset: 0,
    background: "var(--heat-glow)",
    pointerEvents: "none"
  }
}) : null, /*#__PURE__*/React.createElement("div", {
  style: {
    position: "absolute",
    inset: 0,
    backgroundImage: "linear-gradient(90deg,var(--hairline) 1px,transparent 1px)",
    backgroundSize: "calc(100% / 8) 100%",
    pointerEvents: "none"
  }
}), part ? /*#__PURE__*/React.createElement("span", {
  style: {
    position: "absolute",
    right: 14,
    top: 12,
    fontFamily: "var(--font-mono)",
    fontSize: 9,
    letterSpacing: ".18em",
    color: "var(--text-mark)"
  }
}, part) : null, /*#__PURE__*/React.createElement("div", {
  style: {
    position: "relative"
  }
}, children));
const PRODUCTS = [{
  key: "b3forge",
  name: "B3Forge",
  tag: "Beta",
  tagColor: "warning",
  lang: "Rust · TypeScript",
  line: "Candid-native workflow platform. Compose canister calls into typed workflows in a visual graph editor and run them in the browser.",
  points: ["Visual node graph with type-checked bindings", "Expressions reference prior outputs as $N0.amount", "Browser execution with a delegated identity", "Community catalog — publish and fork workflows"],
  repo: "B3Pay/b3forge",
  ic: "Rust/WASM compatibility engine"
}, {
  key: "b3wallet",
  name: "B3Wallet",
  tag: "Live",
  tagColor: "success",
  lang: "Rust · React",
  line: "Self-custodial multi-chain, multi-owner wallet. Bitcoin, Ethereum and Internet Computer from one canister you control.",
  points: ["Single-owner, multi-owner and multi-signature", "50%+1 consensus for transaction approval", "No registration, no backup phrase to lose", "Self-upgrading canister"],
  repo: "B3Pay/B3Wallet",
  ic: "b3wallet_lib · operations · b3_utils"
}, {
  key: "ic-reactor",
  name: "IC Reactor",
  tag: "MIT",
  tagColor: "info",
  lang: "TypeScript · React",
  line: "Type-safe Internet Computer integration for TypeScript and React. Seven packages, end-to-end types, TanStack Query caching.",
  points: ["defineReactor() wires the whole client in one call", "useActorQuery / useActorMutation hook factories", "Typed Ok/Err result handling", "Codegen via CLI or the Vite plugin"],
  repo: "B3Pay/ic-reactor",
  ic: "@ic-reactor/core · react · candid · cli"
}, {
  key: "b3note",
  name: "B3Note",
  tag: "Demo",
  tagColor: "muted",
  lang: "Rust",
  line: "Anonymous note sharing with witness-like encryption. Notes and share links expire in an hour, then the canister timer deletes them.",
  points: ["No login — up to 5 notes per anonymous user", "Identity-based encryption via the VetKeys API", "Share links carry an on-chain verifiable signature", "Auto-delete on first read or after one hour"],
  repo: "B3Pay/B3Note",
  ic: "BLS pairing · VetKeys · timelock"
}, {
  key: "b3utils",
  name: "B3Utils",
  tag: "Crate",
  tagColor: "secondary",
  lang: "Rust",
  line: "The foundation crate. Stable memory, timers, logging, transfers, tokens and timestamps for canister development.",
  points: ["Reserved stable-memory IDs 248–254", "Transfer and token primitives", "Timer and notifier memory", "Published on docs.rs"],
  repo: "B3Pay/b3_utils",
  ic: "docs.rs/b3_utils"
}];
Object.assign(window, {
  B,
  Section,
  Rule,
  Stat,
  Slab,
  PRODUCTS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/site.jsx", error: String((e && e.message) || e) }); }

__ds_ns.BrandMark = __ds_scope.BrandMark;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Box = __ds_scope.Box;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.CardHeader = __ds_scope.CardHeader;

__ds_ns.CardContent = __ds_scope.CardContent;

__ds_ns.CardFooter = __ds_scope.CardFooter;

__ds_ns.CodeBlock = __ds_scope.CodeBlock;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconOf = __ds_scope.IconOf;

__ds_ns.Kbd = __ds_scope.Kbd;

__ds_ns.Label = __ds_scope.Label;

__ds_ns.Alert = __ds_scope.Alert;

__ds_ns.ErrorDisplay = __ds_scope.ErrorDisplay;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Combobox = __ds_scope.Combobox;

__ds_ns.FieldError = __ds_scope.FieldError;

__ds_ns.FileDropzone = __ds_scope.FileDropzone;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.PrincipalDisplay = __ds_scope.PrincipalDisplay;

__ds_ns.TruncatedString = __ds_scope.TruncatedString;

__ds_ns.WorkflowNode = __ds_scope.WorkflowNode;

__ds_ns.NavBar = __ds_scope.NavBar;

__ds_ns.Shell = __ds_scope.Shell;

__ds_ns.SideNav = __ds_scope.SideNav;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Command = __ds_scope.Command;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Drawer = __ds_scope.Drawer;

__ds_ns.DropdownMenu = __ds_scope.DropdownMenu;

__ds_ns.Popover = __ds_scope.Popover;

})();
