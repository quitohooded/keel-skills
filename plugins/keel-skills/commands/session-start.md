---
description: Open a working session — load the rules and current state from files, run the project's checks before building anything, and report what you're standing on.
---

# Start a session

Get oriented from **files**, not from memory or from what a previous chat said.
This takes a minute and prevents the expensive failure: building on top of a
state that isn't true any more.

Read `AGENT_POLICY.md` for the paths and commands named below. If there is no
policy, run `/keel-skills:onboard` instead — there is nothing to orient against
yet.

## 1. Rules

The policy is already in context via the `SessionStart` hook. Don't re-read it.
If it is *not* in context, read it now and say so — a missing injection means
the hook isn't running, which also means the enforcement backstop probably
isn't either.

## 2. State

Read the **state file** the policy names, in full. Read the **history file**
only if you need to know *why* something is the way it is — it is not needed to
work.

Then read the docs for **the area you're about to touch, and only that area.**
Reading every project doc "to be safe" is the single most expensive habit in a
long session, and it buys nothing.

## 3. Checks — before the work, not after

Run the check command from the policy's *"Checks"* section.

**Run it first.** If the last session left drift, you want it now, while it is
cheap and clearly not yours. Finding it after two hours of building on top of it
means choosing between rework and knowingly shipping on a bad foundation.

Read the output by level:

- **FAIL** — the file is committed and clean, so this is real drift that survived
  a session close. Understand *what changed* before fixing anything.
- **WARN** — the file is modified or untracked; someone may have it in flight.
  If it's yours, fix it. If you don't know whose it is, leave it and note it.
- **info** — needs judgment. Read it, don't auto-correct it.

If a check fails in a way you don't understand, **say so and stop** rather than
fixing it into a shape that merely makes the check pass.

## 4. Report, in four lines

- What the state file says is currently open.
- What the checks found (or "clean").
- What you understand the task to be.
- Anything that contradicts between the two — **contradictions get surfaced,
  not smoothed over.**

Then wait for direction. Opening a session is not a green light to start
building; it's how you find out what building would mean.
