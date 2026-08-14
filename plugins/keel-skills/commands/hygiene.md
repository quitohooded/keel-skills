---
description: Read-only maintenance sweep over the project or workspace — uncommitted work, leaked secrets, state drift, stale drafts. Reports with recommendations; never fixes, commits, or deletes.
---

# Maintenance sweep

A short, **read-only** pass over the workspace looking for the things that rot
quietly between sessions. Run it on demand, or schedule it weekly.

> **This command never writes to the project.** No commits, no pushes, no
> deletes, no "quick fixes." Everything that needs a change is **reported with a
> recommendation** and left alone. That constraint is what makes it safe to run
> unattended — see below.

Read `AGENT_POLICY.md` for which repos and paths are in scope, and what this
project treats as hot.

## What to check, per repo

**1. Version-control status.** List uncommitted and untracked files, and sort
each into one of three:

- **legitimate work in progress** — report it, don't touch it. It probably
  belongs to another session.
- **ignorable noise** (logs, build output, editor files) — propose the exact
  ignore-file line, citing a precedent if another repo here already ignores that
  pattern. **Don't edit the ignore file.**
- **obvious regenerable junk** — report as a deletion candidate. **Don't delete.**

**2. Secrets.** Scan modified and untracked files for credential patterns —
`API_KEY`, `SECRET`, `token`, `Bearer`, `PRIVATE KEY`, `.env` contents,
long high-entropy strings. A hit in a **tracked** file is an **alert at the top
of the report**, above everything else. Report the file and line; do not paste
the secret value into the report.

**3. State drift.** Compare the date of the last commit in each repo against
the last entry in the state and history files the policy names. Work that
shipped and was never recorded is a reconciliation item — **report it; doing the
reconciliation is a separate, human-approved job.**

**4. Stale drafts.** In whatever draft/scratch directories the project uses,
list files untouched beyond some age (45 days is a reasonable default). **List
only.** Some of them are referenced from the state file, and deleting those
breaks references to save nothing.

**5. Project checks.** Run the check command from the policy and fold its
findings in at their own level (FAIL / WARN / info).

## Output

Three sections, short, no filler:

- ✅ **Clean** — what's fine
- 🔧 **Fixed** — only ever things outside the project itself (see below), with detail
- ⚠️ **Needs your decision** — each with a concrete recommendation

If everything is clean, say so in three lines and stop. Don't open process
discussions or propose redesigns — **this is maintenance.** Anything you notice
that deserves a redesign goes as one line in the improvement backlog
(`/keel-skills:harvest` reviews those later), not into this report.

## When this runs unattended

If this is running on a schedule with nobody watching, the rule tightens rather
than loosens: **there is no human present, so no green light exists to be
given.** Anything that would need one cannot happen — not "proceed carefully."

Write these limits into the scheduled prompt itself. Every run starts with no
memory of any conversation, so a limit agreed once in chat does not exist for
it. A ready-made prompt is at
`${CLAUDE_PLUGIN_ROOT}/templates/routines/weekly-hygiene.md`.
