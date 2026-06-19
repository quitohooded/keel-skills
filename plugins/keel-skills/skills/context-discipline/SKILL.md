---
name: context-discipline
description: >-
  Keep agent sessions grounded in files rather than chat history, and know when to
  end a long session cleanly instead of letting it sprawl. Use when a session is
  getting long, context is piling up, you're unsure what the current state of a
  project actually is, or you need to hand off work so a future session can pick it
  up. Establishes files as the source of truth, gives a rule for when to stop
  expanding a session and record state instead, and shows how to leave a resumable
  pointer so a fresh session can continue from source files alone. Triggers on:
  long session, context bloat, running out of context, source of truth, session
  handoff, where did we leave off, resume work, summarize and continue later.
---

# Context Discipline

Long sessions don't fail because the model forgets — they fail because the
*conversation* quietly becomes the place the work "lives", and the conversation is
not trustworthy. This skill keeps the source of truth in files and tells you when
to close a session cleanly.

## The conversation is not the source of truth

The current conversation is **not** the authoritative record of the project. The
files are. Two consequences:

- Don't rely on chat history to know the current state — **read it from the
  files.** Verify before you assert that something is done.
- When you reach a decision or a new state, **write it to the appropriate file.**
  A conclusion that exists only in the transcript will be lost. If the project has
  an `AGENT_POLICY.md`, its section *"Where state and decisions get recorded"* names
  exactly where decisions, project state, and per-task notes belong — use those
  paths instead of guessing.

## Don't hoard context

In a long session, accumulated context stops being free. Past a point it adds no
operational value and actively raises the risk of confusion — stale assumptions,
contradicting half-decisions, conclusions you can no longer trace to a source.

When accumulated context stops adding operational value, or starts raising the
risk of confusion:

1. **Stop expanding the session.** Don't keep piling new threads onto it.
2. **Record the necessary state** in the files where it belongs (decisions log,
   project notes, the relevant source files).
3. **Leave a clear pointer** for how to continue in a new session.

## A new session must be able to resume from files alone

The test for whether you've recorded enough: **a fresh session, with no access to
this chat history, should be able to pick the work back up by reading the source
files.** If it couldn't, you haven't written down enough yet — the state still
only lives in the transcript.

When handing off, leave (in files, not just the chat):

- What the current state is and how it was verified.
- What the next concrete step is.
- Which files to read first to reconstruct context.

## The one thing you must never do

**Never drop context that the *current* task still needs just to make the session
smaller.** Trimming is for context that has stopped paying its way — not for
anything load-bearing for the work in front of you. When in doubt about whether a
piece of context is still needed, record it to a file before letting it go.

## How to apply this in one line

> Read state from files, write decisions to files, and when a session stops
> earning its length, record the state + a resume pointer and start fresh —
> without ever discarding what the current task still needs.
