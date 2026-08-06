```jsx
<ErrorDisplay title="Canister rejected the call" code="IC0503"
  detail={'Reject code: 5\nReject message: Canister trapped: unreachable'} onRetry={run} />
```

Always show the raw reject text. Engineers need it; hiding it costs more than it saves.
