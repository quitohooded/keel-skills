---
description: Close a working session — reconcile what happened into the state and history files, re-run the checks, and leave a handoff a fresh session can resume from.
---

# Close a session

Get what happened **out of this conversation and into the files**, so the next
session is accurate without reading a transcript. This is bookkeeping, not work.

> **The close records and reconciles. It does not build.** No new features, no
> reopening decisions, no redesigning the process. If it turns up something
> worth doing, write it down as open and stop.

Use the paths from `AGENT_POLICY.md` §*"Where state and decisions get
recorded"*. If the project has no state file, don't invent one mid-close — note
it and point at `/keel-skills:onboard`.

## 1. Update the state file

- **Things that got resolved** → move the body to the **history file** and leave
  **one dated line** in the state. Don't leave them in the state marked
  "resolved": a closed item is history even when it lives in a section that
  isn't called history, and that is how state files quietly triple in size.
- **New facts** → only if **verified against a file or a tool**. Anything you
  believe but haven't checked goes in marked as unverified, or doesn't go in.
- **New contradictions or gaps** → record them as open. **Contradictions get
  listed, not smoothed. Gaps get marked, not filled with a guess.**
- **Half-finished work** → what's done, what's left, and what the next concrete
  step is.

## 2. One line of history

Date + what was done. **One line.**

The reasoning goes in the document it belongs to — the decision, the process
doc, the draft. Not here. History entries that grow into essays are how a
changelog gains tens of kilobytes a month and stops being read at all. If you
have written 200 words, that content has a different owner.

## 3. Re-run the checks

Run the check command from the policy. **FAIL** findings on committed, clean
files get fixed before closing, or the reason they weren't gets written down.
**WARN** findings on files someone else may have in flight are reported, not
touched.

## 4. Leave the code in a known state

Report version-control status for every repo you touched, and say plainly what
is uncommitted.

**Committing, pushing, and deploying are hot** and need an explicit green light
— they don't happen as part of closing unless the policy has a standing
approval that covers exactly this, or the human says so now. If something
deserves a commit, say so and leave the decision with them.

If you do commit under a standing approval: **commit by path, never `git add
-A`.** With more than one session open, `add -A` sweeps up another session's
in-flight files. List which files are yours before staging.

## 5. Handoff, in three to five lines

Plain language, no internal jargon:

- what got done
- what's still open
- the next obvious step
- which files to read first to reconstruct this

**The test:** a fresh session with no access to this conversation should be able
to pick the work up from the files alone. If it couldn't, you haven't written
enough down yet — the state is still living in the transcript, and the
transcript is about to disappear.

Don't state anything as "done" that isn't verifiable in a file.
