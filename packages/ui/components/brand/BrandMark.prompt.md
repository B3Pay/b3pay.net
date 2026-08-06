Use `BrandMark` anywhere the B3Pay identity appears — headers, footers, favicons, splash states, slide corners.

```jsx
<BrandMark variant="horizontal" tone="onDark" size={28} />
<BrandMark variant="stacked" tone="forge" size={64} />
<BrandMark variant="mark" tone="current" size={20} />
```

Variants: `horizontal` (default, mark + wordmark side by side), `stacked` (mark above wordmark), `mark` (glyph only — use below 24px, where the wordmark stops being legible).
Tones: `onDark` (white), `onLight` (ink #111), `forge` (brand orange), `current` (inherits `color`).
The Forge node at the mark's centre is always #ED7437 — it never changes with tone. Never recolour it, never remove it.
Clear space: at least half the mark's width on every side.
