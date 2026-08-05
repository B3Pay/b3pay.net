```jsx
<Alert color="warning" title="Beta: browser execution only" icon={TriangleAlert}>
  Workflows run in your browser with a delegated identity. The canister does not execute them.
</Alert>
```

Use `Alert` for conditions the user should keep seeing. Use `Toast` for the result of an action they just took.
