---
title: Utility nodes
description: The 20 operations a B3Forge Utility node can run in your browser, with their Candid signatures, rounding rules and errors, and how guards make branches.
---

A Utility node runs one operation in your browser, with no canister and no network call. Each operation has a Candid signature, so its arguments are bound like a canister call's (see [Expressions](expressions.md)), and its result is there for the nodes after it.

An operation whose result is `variant { Ok : …; Err : text }` can fail. A Utility node running one has an error path: the run takes it when the result is `Err`, and `$N1.Err` holds the message.

All amounts are whole numbers (`nat`) in a token's smallest unit, such as e8s for ICP. Nothing here uses floating point.

## Arithmetic

| Operation       | Signature                                                   | What it does                                                                                    |
| --------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `add`           | `(nat, nat) -> (nat)`                                       | a + b                                                                                           |
| `sub`           | `(nat, nat) -> (variant { Ok : nat; Err : text })`          | a − b. `Err` if b is larger than a.                                                             |
| `mul`           | `(nat, nat) -> (nat)`                                       | a × b                                                                                           |
| `div`           | `(nat, nat) -> (variant { Ok : nat; Err : text })`          | a ÷ b, rounded down. `Err` if b is 0.                                                           |
| `scale_bps`     | `(nat, nat) -> (nat)`                                       | a × bps ÷ 10,000, rounded down. 10,000 bps is 100%, so 9,700 keeps 97%.                         |
| `rescale`       | `(nat, nat8, nat8) -> (variant { Ok : nat; Err : text })`   | Converts an amount from one number of decimals to another. Going down drops the extra digits.  |
| `format_amount` | `(nat, nat8, opt text) -> (text)`                           | Writes an amount with its decimals for display, with an optional suffix: `"0.12345678 TOKEN"`. |

## Guards

A guard checks a value. If the check passes, the result is `Ok` with the same value, and the run goes on along the success path. If it fails, the result is `Err` and the run takes the guard's error path, or ends there if it has none. Every guard returns `variant { Ok : nat; Err : text }`.

| Operation       | Arguments         | Passes when    |
| --------------- | ----------------- | -------------- |
| `guard_gte`     | `(nat, nat)`      | a ≥ b          |
| `guard_gt`      | `(nat, nat)`      | a > b          |
| `guard_lte`     | `(nat, nat)`      | a ≤ b          |
| `guard_lt`      | `(nat, nat)`      | a < b          |
| `guard_eq`      | `(nat, nat)`      | a = b          |
| `guard_nonzero` | `(nat)`           | a ≠ 0          |
| `guard_between` | `(nat, nat, nat)` | low ≤ a ≤ high |

For example, to send a transfer only when the balance is at least 1 ICP:

1. A Canister Call reads the balance with `icrc1_balance_of`.
2. A Utility node runs `guard_gte` on that balance and `100_000_000`, which is 1 ICP in e8s.
3. Its success path leads to the Canister Call that transfers, and its error path to whatever should happen instead.

## Lists

| Operation         | Signature                                                                                  | What it does                                                         |
| ----------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| `vec_project_nat` | `(vec record { amount : nat }, variant { amount }) -> (variant { Ok : vec nat; Err : text })` | Takes one whole-number field from every record in a list. See below. |
| `vec_sum`         | `(vec nat) -> (nat)`                                                                       | The sum of the list.                                                 |
| `vec_min`         | `(vec nat) -> (variant { Ok : nat; Err : text })`                                         | The smallest element. `Err` if the list is empty.                    |
| `vec_max`         | `(vec nat) -> (variant { Ok : nat; Err : text })`                                         | The largest element. `Err` if the list is empty.                     |
| `vec_get`         | `(vec nat, nat32) -> (variant { Ok : nat; Err : text })`                                  | The element at a position, from 0. `Err` past the end.               |
| `vec_length`      | `(vec nat) -> (nat)`                                                                       | How many elements the list has.                                      |

`vec_project_nat` turns a list of records, such as a canister's list of transactions, into a list of numbers the other operations can use. The field is named by a variant, such as `variant { amount }`, not by a text. The signature above is its default; when you bind the list in the studio, the signature takes the shape of the records you bound. The field can be any Candid integer type, and the operation fails with `Err` if any element lacks it or holds a negative number. A common chain is a Canister Call that returns records, then `vec_project_nat`, then `vec_sum`, `vec_min` or `vec_max`.

## Identity

| Operation                 | Signature                 | What it does                                                                                                                                    |
| ------------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `principal_to_subaccount` | `(principal) -> (blob)`   | Turns a principal into a 32-byte ICRC-1 subaccount: the principal's length in the first byte, then its bytes, then zeros. |
