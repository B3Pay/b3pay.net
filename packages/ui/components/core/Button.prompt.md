Use `Button` for every action. `variant` sets the surface, `color` sets the semantic hue, `size` sets the geometry.

```jsx
<Button variant="filled" color="primary" size="lg">Read the docs</Button>
<Button variant="outlined" size="md" icon={GitBranch}>Fork workflow</Button>
<Button variant="ghost" color="error" size="sm">Delete</Button>
<Button asIconButton size="md" icon={Settings} aria-label="Settings" />
```

Defaults are `variant="default" color="secondary" size="md"` — a soft bordered card surface. Use `variant="filled" color="primary"` for the one primary action on a view; it picks up the Forge heat glow on hover.
`bevel` adds the machined corner cut. Use it on hero CTAs only, never in dense UI.
Destructive actions use `color="error"`, not a separate variant.
