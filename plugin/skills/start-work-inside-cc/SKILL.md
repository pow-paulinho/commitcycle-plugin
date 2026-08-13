---
name: start-work-inside-cc
description: Files and scopes a CommitCycle task before touching anything, whenever someone asks for work in a repository that uses CC and no task is active. Use at the START of any request that will change files — "add a login page", "fix this bug", "refactor the parser", "can you update X" — in a repository containing .zones/zones.yml. Not for questions, reading, or explaining, and not when a task is already running.
---

# Starting work inside CommitCycle

This runs before the work, not after the refusal. The hook will deny a write
with no active task, and being told no is a worse way to learn the rule than
having the task already there.

## Whether this applies at all

Three checks, in this order, and each one that fails ends it silently:

1. **`.zones/zones.yml` exists.** No zone map means this repository never
   installed CommitCycle, and a plugin that spoke up anyway would be noise in
   every unrelated project on the machine — the exact thing the hook was fixed
   to stop doing.
2. **The request will change something.** Reading, explaining, answering a
   question about the code: none of that needs a task. Do not file one for
   "what does this function do".
3. **No task is already active.** Run `cycle status`. A branch named
   `task/CC-x-…` with a live grant means the person is already inside one —
   continue the work, do not file a second.

If all three hold, do not edit anything yet.

## What to do

Say what you are about to do in one line — *"this repository uses CC, so I'll
file the task first"* — and then:

**File it.** One line, the person's own words. `cc_intake` if the board is
reachable, and it lands in Triage without starting anything.

**Draft the four answers, and offer them as choices.** `cc_interview` returns a
draft the board has already checked against the real zone map. Present each of
the four as a suggestion the person can take, edit, or replace:

- what it should do
- what it must NOT do — the field that prevents most accidents
- which risky areas it touches
- how we will know it worked

Never save the draft as it stands. It is a starting point for a thirty-second
conversation, not an answer, and a spec nobody corrected is the one that gets
argued about at the end. If there is no board configured, ask the four questions
yourself and keep them just as short.

**Save it with `cc_scope`, then start it with `cycle start <id>`.**

## The line this does not cross

`cycle start` is the gate, and the gate is the person's call — it is what issues
the grant that opens a protected area. Run it when they say to, and if it
refuses, read the refusal out and stop. A high-risk zone needs its owner, and
the answer arrives in this session (`cycle requests`). **Do not offer to remove a
zone, widen one, or work around a block.** An agent proposing that is worse than
the block it is avoiding, and it is the exact failure this product exists to
catch.

## What good looks like

> **Them:** add rate limiting to the signup endpoint
>
> **You:** This repo uses CC, so I'll file the task first — one moment.
> Filed CC-91. Four quick answers and I can start:
> **What it should do:** limit signup attempts per IP and per address, 429 with a
> retry hint. **What it must NOT do:** *(suggested)* not touch the login path,
> and not add a dependency. **Risky areas:** none — it is all in the route.
> **Done when:** the eleventh attempt in a minute is refused, and a test proves
> it.
> Take these, or change any of them?

Four answers, thirty seconds, and the work is on the record before a file
changes. That is the whole trade this product asks for.
