---
name: workspace-hygiene
description: >-
  Keep a project's documents and state honest as they age, and catch the drift
  that written rules alone don't prevent. Use when a doc might no longer be
  true, when the state file and the code disagree, when a status/state file is
  growing, when writing or reviewing a "current state" claim, when setting up
  mechanical checks, or when running a periodic maintenance sweep. Covers
  separating state from history, why a bootstrap must carry no state, dated
  state snapshots, checks that each exist because a real drift already got
  through, three finding levels so parallel sessions don't fix each other's
  files, ratchet budgets, and what an unattended sweep may never do. Triggers
  on: is this still true, stale docs, doc contradicts the code, drift, state
  file too long, changelog, weekly cleanup, maintenance routine, my docs lie.
---

# Workspace Hygiene

Written rules decay. Not because anyone disagrees with them — because the world
moves and the document doesn't. A file that was accurate in March is a
confident liar in July, and an agent reading it will act on the lie. This skill
is about the two things that keep that from happening: **documents shaped so
they don't age**, and **checks that catch the drift anyway**.

If the project has an `AGENT_POLICY.md`, its *"Where state and decisions get
recorded"* and *"Checks"* sections name the concrete files and commands. Use
those; what follows is the pattern.

## Part 1 — Documents that don't age

### Separate state from history

**State is read to work. History is read to understand why something is the way
it is.** They are not read at the same frequency, so they must not cost the
same to read. Keep them in two files side by side:

| | What it holds | Read when |
|---|---|---|
| **State** (`STATE.md`, `STATUS.md`, …) | What is true *now*, what is open | Every session |
| **History** (`CHANGELOG.md`, …) | What happened and why, dated | Rarely, on purpose |

When something closes, its body **moves to history** and the state keeps one
dated line. Resolved items left in the state file are the most common way a
state file quietly triples in size.

### When to cut history out of a document — three bars, any one is enough

1. **Size.** The history section passes roughly 30 KB.
2. **Proportion.** History passes about two thirds of the file, *even if it is
   small in absolute terms*. A small document that is mostly history costs the
   same as a big one: **you pay for what is read, not for what the file
   measures.**
3. **Nature.** **A closed item is history even when it lives in a section not
   called "History."** Bars 1 and 2 only look at the section with the label, so
   a "Pending" section can be more than half closed items and neither bar sees
   it.

Each bar exists because the one before it let a real case through. Don't drop
to one.

### A bootstrap carries no state

The file an agent reads *first* — the onboarding prompt, the README's "current
status", the top of `CLAUDE.md` — must **point at where state lives, not
contain it**. State written into a bootstrap ages invisibly, and worse, it gets
read as *criteria* rather than as a fact: nobody re-checks it, because it looks
like a rule.

The same failure hits **numbers written into method documents**. "Runs 14
checks", "takes about 1.5 seconds", "there are 6 packs" — every one of those is
a fact filed inside a rule, and no one ever looks at it again. Either keep the
number where it can be verified, or don't write it.

### Date every snapshot

When a document genuinely must hold a picture of the world, mark it:

```markdown
### Current state (2026-08-14)
> Snapshot, not criteria. Regenerate by running <command>.
```

A dated snapshot can be *measured* — you can ask how old it is, and a check can
flag it. An undated one just rots.

### Prefer generated over maintained

An index built from the filesystem at run time cannot go stale; a hand-written
one always does. If a listing can be generated — the file map, the check count,
the component table — generate it and delete the copy.

## Part 2 — Checks that catch what the rules didn't

A rule tells a careful reader what to do. A check notices when it didn't
happen. You want both, and they fail differently.

### Every check earns its place by a drift that already happened

Don't write speculative checks. **Add a check when a real drift got through and
survived undetected** — that way the suite stays small, every failure means
something, and nobody learns to ignore it. Write *why the check exists* in a
comment next to it; a check whose reason is forgotten gets deleted the first
time it's inconvenient.

### Three levels, not pass/fail — because sessions run in parallel

A finding is not equally actionable depending on whether someone is working on
the file right now. Use version control to tell them apart:

| Level | The file is… | What to do |
|---|---|---|
| **FAIL** | committed and clean | **Real drift** — it survived a session close. Safe to fix: nobody has it in flight |
| **WARN** | modified or untracked | **Someone is working on it.** Report; don't fix what isn't yours. Doesn't block |
| **info** | — | A soft finding that needs human judgment. Look, don't auto-correct |

Skipping this distinction has a specific consequence: with several sessions
open, "fix all findings before closing" tells one session to **edit another
session's in-flight files**, which is exactly the collision the checks were
meant to prevent.

### Ratchets for anything with a budget

For things that must not grow — the startup context cost, a bundle size, an
index that loads every session — check against the *last recorded value*, not
against a generous ceiling. **When a ratchet fails, remove content; do not
raise the ceiling.** A ceiling that gets raised on every failure is a log, not
a limit.

### What a check must be

Read-only. No cache between runs. Safe when two sessions run it at once.
Deterministic and sorted output — comparing two runs is how drift gets spotted,
and unstable ordering destroys that. Clear exit code. (See the
`repeatable-work` skill for building one.)

## Part 3 — The periodic sweep

A short, scheduled, **read-only** pass over the workspace. Typical contents:

- Version-control status per repo: uncommitted and untracked files, classified
  as *legitimate work in progress* / *ignorable noise* (propose the ignore line,
  don't edit) / *obvious regenerable junk* (report as a deletion candidate).
- A secret scan over modified and untracked files. Anything found in a **tracked**
  file goes at the top of the report as an alert.
- State drift: is there shipped work that the state and history files never
  recorded?
- Stale drafts: list files untouched past some age. **List, don't delete.**

### What an unattended run may never do

This matters more than the contents, because **an unattended run has no human
in it — so no green light exists for it to receive**:

- **No commit, no push, no deploy, no send.** All hot; all need a green light.
- **Nothing deleted by inference.**
- **No fixing what it finds broken.** It reports with a recommendation.
- **No promoting anything to approved/confirmed.**

If a routine needs something on that list, the routine was scoped wrong and the
work goes back to a session with a human in it. Write these limits *into the
routine's own prompt* — each run starts with no memory of any conversation, so
a limit that lives only in your head does not exist.

Output format that survives being skimmed: **what's clean / what I fixed (with
detail) / what needs your decision (with a recommendation)**. If everything is
clean, say so in three lines and stop.

## How to apply this in one line

> State and history live in different files; bootstraps point instead of
> telling; snapshots carry dates; checks exist because something already broke,
> report at three levels so parallel sessions don't collide, and an unattended
> sweep reports but never acts.
