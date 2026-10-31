---
title: Limits of the beta
description: What B3Forge's beta doesn't do yet, and the limits it sets on runs, workflows and Forge AI.
---

B3Forge is in beta. This page lists what it doesn't do yet, and the limits it sets.

## What workflows don't do yet

- **Run on their own.** A workflow runs when someone runs it, in their browser. There is no schedule, and nothing runs it on a server.
- **Branch on anything but a failure.** A workflow branches when a call returns `Err` or a [guard](reference/utility-nodes.md#guards) fails. It can't branch on a text, a `bool`, or whether an `opt` has a value.
- **Compute in expressions.** [Expressions](reference/expressions.md) only pick and place values. Arithmetic and comparisons are Utility nodes, which work on whole numbers only.
- **Retry.** A call that is rejected, traps or can't be decoded stops the run.

## Runs

- A run stops after 128 steps, or after 8 steps per node in a workflow of more than 16 nodes.
- One step can make at most 10 update calls in one run, and each one asks for approval.
- The approval dialog shows ICRC amounts in token units for ICP, ckBTC, ckETH, ckUSDC, ckUSDT and TCYCLES. For any other ledger it shows the raw amount and says the decimals are unknown.

## Workflows and accounts

- A workflow can have up to 100 nodes.
- An account can keep up to 200 workflows, have up to 100 of them published at once, and favorite up to 500.
- The playground keeps its workspaces in your browser, so they don't follow you to another browser or device.

## Forge AI

- Each account has a daily number of Forge AI requests. **Settings → Forge AI** shows how many are left today and when they reset.
- What you type to Forge goes through B3Pay's AI service to an AI model, and so do the parts of a workflow Forge reads to help, such as its node labels, canisters and methods. Keep anything private out of your prompts and labels.
- Forge checks types, not meaning. Read what it builds before you run it.
