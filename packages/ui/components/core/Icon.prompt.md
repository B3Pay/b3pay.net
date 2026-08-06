Lucide, at 2px stroke. Never hand-draw an icon; never use emoji as one.

```jsx
<Icon name="GitBranch" size={16} />
<Button icon={IconOf("Play")}>Run workflow</Button>
```

Stroke width stays 2 at every size. At 12–14px drop to `strokeWidth={1.75}` only if the glyph fills in.
