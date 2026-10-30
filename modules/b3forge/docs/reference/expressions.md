---
title: Expressions
description: How a node's arguments refer to earlier results in B3Forge, with paths into records, variants, options and vectors, checked casts, and the runtime context.
---

A node's arguments are written in Candid's text format, the way you would write them for `dfx canister call`. Where a value comes from an earlier node, the text has a reference instead of a literal. When you bind a field in the studio, the studio writes the reference for you; this page is for reading one, or writing one by hand.

```txt
(record { owner = $ctx.caller; subaccount = null })
```

Before a node runs, each reference is replaced by the value it points to, and the result is parsed as Candid.

## References

`$N1` is the result of node `N1`. The studio names nodes `N1`, `N2` and so on, and shows each node's ID in its inspector.

- If the method returns one value, `$N1` is that value.
- If it returns several, `$N1.0`, `$N1.1` and so on are the first, the second and the rest.
- `$N1.ret` is the long form of `$N1`, and `$N1.ret.Ok` of `$N1.Ok`.

A reference can only point to a node that has already run in the same run. A reference to one that hasn't fails the run.

## Paths

A path follows the value's Candid type, one segment at a time:

| Value    | Segment                               | Example                                    |
| -------- | ------------------------------------- | ------------------------------------------ |
| record   | the field's name                      | `$N1.balance`                              |
| variant  | the name of the arm the value has     | `$N1.Ok`, `$N1.Err.InsufficientFunds`      |
| `opt`    | `.some`, for the value inside         | `$N1.some`                                 |
| `vec`    | a position, from 0                    | `$N1.0`                                    |
| tuple    | a position, from 0                    | `$N1.1`                                    |

Segments chain: `$N1.Ok.balance`, `$N1.Err.InsufficientFunds.balance`.

- A variant segment must name the arm the value actually has. `$N1.Ok` on a result that is `Err` fails, which is why a result's error path reads `$N1.Err`. See [branches on errors](../studio.mdx#branches-on-errors).
- An `opt` can't be crossed without `.some`, and `.some` on an empty `opt` fails.
- A position past the end of a `vec` fails.

## Casts

`: type` after a reference converts the value: `$N1.Ok.balance : nat64`.

- Numbers convert between `nat`, `nat8`, `nat16`, `nat32`, `nat64`, `int`, `int8`, `int16`, `int32` and `int64`. A value that doesn't fit the target, such as a negative number cast to `nat` or a large one cast to `nat8`, fails the run. It is never cut to fit.
- `bool`, `text`, `null` and `principal` only accept a value that already has that type.

## Wrapping values

Because a reference is replaced inside Candid text, the text around it does the wrapping:

- `opt $N1` puts the value in an `opt`.
- `record { amount = $N2.Ok; to = $N0.recipient }` builds a record from earlier values.
- `($N1)` passes a value through unchanged.

A `$` inside a quoted string is just a character: `"balance of $N1"` stays as written.

## The runtime context

`$ctx` holds values about the run itself:

- `$ctx.caller`: the principal running the workflow. Signed out, that is the anonymous principal.
- `$ctx.workflow_id`: the workflow's ID as a 32-byte blob, the right size for an ICRC-1 subaccount of the workflow's own.

The studio lists both under **Runtime Context**.

## What expressions can't do

An expression only picks and places values. It has no arithmetic, no comparisons, no string building, no conditions and no loops. For those, use a [Utility node](utility-nodes.md): it adds, subtracts, scales, compares, and reads lists, and its guards give a workflow its branches.
