---
description: Review what repeated across recent sessions and draft the tools worth building — reads the improvement backlog, measures, and proposes. Never adopts anything itself.
---

# Harvest the improvement backlog

Repetition is invisible from inside a single session: each one starts blind, so
nobody ever looks *across* them and the same friction gets paid over and over.
This command is the look-across.

> **This session proposes. It does not adopt.** Nothing here moves into the
> project's tools, commands, hooks, or rules. Drafting is free; adopting is a
> change to how the system works and needs an explicit green light from a human.
> That split is the whole design — the agent fills the funnel, the human opens
> the gate.

**Run it in its own session**, when there's spare capacity. It costs a lot and
produces no product; run it inside a working session and it eats that session's
context. There's no schedule — if nobody runs it for a month, nothing rots, the
material just gets better.

## 1. Read the backlog

Read the improvement backlog file the policy names (the template creates
`IMPROVEMENTS.md`). Take everything captured since the last harvest.

## 2. Measure

Look for what actually repeated. Depending on what's available: session
transcripts, shell history, CI logs, the version-control log, repeated file
touches.

Two rules, and skipping either produces a confident wrong answer:

- **Normalize before counting.** The same command with a different id, path, or
  timestamp inside is *the same command*. Counting raw text splits one
  repetition into five and you conclude nothing repeats.
- **Then check the number isn't an artifact.** A form that appears 200 times may
  be a grouping or truncation effect. Look at whether the occurrences **do** the
  same thing or only **start** the same.

**Emit aggregates only.** Never dump transcripts or logs into context — spending
half a window to find out how to spend less window is self-defeating.

## 3. Run the project's checks and read the `info` findings

The `info`-level findings are the ones that need judgment, which is exactly why
nobody attends to them at session start. This is when they get read.

## 4. Cross the sources

A strong candidate shows up in **more than one**: something captured in the
backlog that the measurement also counts three times, or an `info` finding that
has been repeating for weeks. One source alone is usually a coincidence.

## 5. Draft

For each candidate, write a proposal, clearly marked as a proposal, in a drafts
directory:

- **what repeated**, with the number that justifies it
- **what would replace it** — and if the answer is a script, a command, or a
  skill, **write it out in full, ready to adopt**, not described
- **what it would cost** to build and to maintain
- **what breaks if it's wrong**

Apply the filter honestly: **encapsulate what has already been done three
times.** Fewer is premature abstraction — it costs maintenance forever and
guesses the shape wrong, because one or two occurrences don't show what varies.

Two things don't wait for three: **a document the tooling contradicts** (fix on
confirmation) and **a gap where something happens and nobody can see it** (worth
an instrument first).

**Don't propose for tidiness.** That something *could* be encapsulated is not a
reason to encapsulate it.

## 6. Report

One line per candidate, **each with the number behind it.** Without the number
it's an opinion.

Then stop. For each item the human says *adopt*: build only what was approved,
move the item to an "adopted" section with the date and what got built. For each
*discard*: move it to a discarded section **with the reason** — a discard
without a reason gets proposed again next quarter, and the backlog fills with
the same rejected ideas.

## What this session must not do

- **Not adopt.** Nothing moves into tools, routines, hooks, settings, or a state
  file.
- **No commit, push, or deploy.**
- **Not redesign the working system.** A process improvement gets written down,
  not applied.
- **Not touch product work.** Anything from the main line goes into the backlog
  as one line and the harvest moves on.
