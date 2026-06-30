---
name: authorization-protocol
description: >-
  Decide whether an AI agent may DO a write/change action on its own, or must
  stop and get a clear yes from a human first. Use BEFORE any action that writes,
  edits, commits, pushes, deploys, sends, publishes, or reconfigures a system —
  and whenever a request is a vague "do whatever is needed", "fix this", "handle
  it", "make it better" that names no specific scope. Sorts what looks like
  permission into three things — a goal, a method, and a green light — and only a
  green light means go. Includes a four-step check, rules for risky ("hot") areas
  like production, databases, and anything users see, and a rule for following
  through on a green light you already have. Triggers on: can the agent do this
  without asking, is this safe to do, do I need approval, did they actually say
  yes, guardrails, autonomy boundary, hot zone, irreversible action.
---

# Authorization Protocol

A simple way to decide **when an agent can just do something, and when it has to
stop and ask first**. The goal is speed without surprises: the agent moves fast on
safe, undoable, internal work, and stops cold before anything that reaches the
outside world, can't be taken back, or rebuilds how a system works.

This skill is the **how-to-decide**. The project-specific details — which files and
areas are risky, what counts as a release, where the "official" version of things
lives — belong in a per-project **`AGENT_POLICY.md`** at the project root.

## Step 0 — Load the project policy

Before applying this to real work, check for an `AGENT_POLICY.md` in the project
root (or wherever the user points you). When this plugin's `SessionStart` hook is
active, an existing `AGENT_POLICY.md` is already in context — use that and don't
re-read it.

- **If it exists:** read it. It defines this project's risky areas, its
  source-of-truth files, and any exceptions. Treat it as the final word on the
  specifics.
- **If it does not exist:** use the defaults below, and treat anything you're
  unsure about as risky. Offer to set one up (see the `policy-init` command).

## Core principle

Files are the source of truth. The conversation and the agent's memory are **not**.
From this:

1. State is **read**, not remembered.
2. Decisions are **written down**, not guessed at.
3. Doing something depends on what the files actually say.
4. When something is unclear, **stop and ask** — never fill the gap by guessing.

## What looks like permission — and what actually is

Three things get confused with "yes, go ahead." Only one of them is.

- **A goal.** A direction with no specific scope: "improve this", "do what's
  needed", "handle it". This is **not** a green light. It's permission to look into
  it and come back with a plan.
- **A method.** The user says *how* to do it ("use a migration", "edit the config",
  "use a subagent"). Naming the method is **not** the same as approving the action.
  Still **not** a green light.
- **A green light.** Either (a) the user clearly approves a specific action and its
  scope, or (b) a **written-down, still-current decision** already covers it. **This
  is the only thing that means go — and you must not go beyond what was approved.**

The trap to watch for: most "go do it" instructions are just a goal or a method.
They *feel* like permission but aren't. Only a green light means go.

## The four-step check (run before anything that writes or changes something)

Four steps, in order. The **first one that applies wins.**

1. **Is it read-only, looking into something, or writing up a clearly-labeled
   `[PROPOSAL]`?** → **Free.** Do it.
2. **Does it touch a risky ("hot") area?** → **Needs a green light.**
3. **Does it build or reconfigure a system, or is it a chain of small steps that
   together rebuild something?** → **Needs a green light** (even if each step is tiny).
4. **Otherwise** (undoable + internal + isolated + low-impact) → **Free: do it and
   report back.**

**Any doubt at any step → treat it as needing a green light.**

## Risky ("hot") areas — the default set (refine in `AGENT_POLICY.md`)

An area is "hot" when a mistake there is expensive or hard to undo. Defaults:

- **Anything users or the public see** — published copy, marketing pages, public
  APIs, the visible UI.
- **Production, databases, schema, settings, hooks, CI/CD** — anything that runs in
  or shapes the live system.
- **Actions that reach outside or can't be undone** — commit, push, deploy, send an
  email or message, publish, charge money, delete data.
- **Turning a draft into a decision** — marking something `[APPROVED]` /
  `[CONFIRMED]` is itself a risky action.
- **Source-of-truth files** — the files other work depends on. New decisions or
  meaning-changing edits to these need a green light. (Just *following through* on a
  decision already approved is the one exception — see below.)

In a project you don't know well, treat a file's reach as **risky until you
understand how far it goes.**

## Following through on a green light you already have

The only way a green light carries over to a new change without asking again. It
counts **only** if **all four** are true:

1. **No judgment needed** — two people applying the same decision would make the
   exact same change.
2. The decision **says how far it goes** — you're not guessing the scope.
3. The change **points back** to the decision it came from.
4. The decision is **still current** — nothing newer has overridden it.

Miss one → **ask for a green light.** Being too sure that "this is obviously just
following through" is the classic mistake; when unsure whether something is just
following through or actually a new call, ask.

## Tie-breakers (in order)

1. **Risk wins** — if something is both "free" and "risky", it needs a green light.
2. **The whole picture wins** — a set of small steps that rebuild something needs a
   green light, even delivered piece by piece.
3. **Doubt means stop** — any uncertainty → ask.

## What stays the agent's call (narrow — default to asking)

- Judging *undoable / internal / low-impact*.
- Judging *just following through vs. a new call*.
- When to flag a contradiction or a gap instead of pushing ahead.

Anchors: *undoable* = can be reversed (e.g. via version control) with no outside
effect; *internal* = never reaches anyone outside; *low-impact* = doesn't touch
access, data, money, or published copy. In all three: **if in doubt, ask.**

## Where mistakes happen most (take extra care)

- Noticing early that a chain of small steps has turned into "rebuilding something".
  If a task starts to smell like "set up / configure / restructure", it needs a
  green light from the start.
- Telling "just following through" from "a new call" — see above.
- A file's reach in a project you don't know — treat it as risky until you understand it.

## Subagents and permission

A subagent **cannot** approve, confirm, or do something risky on its own say-so. It
can look into things and propose; the green light always comes back to the human (or
to the parent agent acting on a human's green light). Handing work to a subagent
never creates permission out of thin air. (See the `model-delegation` skill for the
delegation rules.)

## The enforcement backstop (this skill is the thinking layer)

This skill is the **soft** layer: it makes you run the check yourself. The plugin
also ships a **hard** layer — the `PreToolUse` hook (`enforce-policy.cjs`) — that
catches risky tool calls (`git push`, deploy, `rm -rf`, writes to risky paths,
outward MCP calls) and forces a clear approval prompt *no matter what you decided*,
flatly refusing them when no human is around to approve. The two work together: you
still run this check on every action; the hook only catches the obvious cases you
might miss. Do **not** treat the hook as permission — if it stays quiet, this check
still rules. And it's a backstop, not a cage: it can't stop a truly determined
process.

## How to apply this in one line

> Read-only and proposals are free. Anything risky, outward, undoable-only-with-pain,
> or system-rebuilding needs a clear yes. When unsure, ask.
