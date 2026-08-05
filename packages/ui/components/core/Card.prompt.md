Use `Card` for any bounded panel: a workflow in the Community catalog, a package in the ecosystem grid, a doc callout.

```jsx
<Card interactive>
  <CardHeader title="Token transfer" description="Transfers ICP with a balance check." icon={Coins} action={<Badge color="success">Public</Badge>} />
  <CardContent>2.4 T cycles remaining</CardContent>
  <CardFooter><Button size="sm" variant="filled" color="primary">Run</Button></CardFooter>
</Card>
```

`CardHeader` takes `title`/`description`/`icon`/`action` as props — do not hand-roll the header row.
