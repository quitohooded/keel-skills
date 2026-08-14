# Mechanical checks

Two files: a checks script you copy into your project, and its test bank.

```bash
cp "$CLAUDE_PLUGIN_ROOT/templates/checks/keel_checks.py"      scripts/
cp "$CLAUDE_PLUGIN_ROOT/templates/checks/test_keel_checks.py" scripts/
python scripts/keel_checks.py
python scripts/test_keel_checks.py
```

Then record the command in your `AGENT_POLICY.md` under **Checks**, so
`/keel-skills:session-start` and `/keel-skills:session-close` know to run it.
Requires Python 3.8+ and nothing else.

## What it checks out of the box

| # | Check | Why it exists |
|---|-------|---------------|
| 1 | Policy present, parses, and is concrete | A policy with an empty or placeholder-filled machine block looks configured and enforces nothing |
| 2 | No secrets in **tracked** files | A secret in an untracked file is a mistake; in a tracked one it is already in everyone's clone |
| 3 | State and history keep up with commits | Work that shipped and was never written down makes every later session start from a stale picture |
| 4 | Startup context budget (ratchet) | The files read every session grow one defensible addition at a time; only a number that refuses to move catches the sum |
| 5 | Dated snapshots still fresh | A dated snapshot can be measured; an undated one just rots |

Checks 1–4 can fail the run. Check 5 only ever reports `info`, because stale
and stable look identical to a regex.

## Three levels, not pass/fail

A finding means different things depending on whether someone has the file open
right now, so version control decides:

- **FAIL** — committed and clean, so it is real drift that survived a session
  close. Exits 1. Safe to fix: nobody has it in flight.
- **WARN** — modified or untracked, so someone may be working on it. Doesn't
  block. **Don't fix what isn't yours.**
- **info** — needs human judgment.

Without this split, "fix everything before closing" ends up telling one session
to edit another session's in-flight files — the exact collision the checks
exist to prevent. Outside a git repo everything degrades to WARN, since nothing
can be told apart.

## Adding your own

Write the function under `PROJECT CHECKS`, register it in the `CHECKS` list, and
follow two rules:

1. **Add a check when a real drift already got through undetected** — not
   speculatively. A suite small enough that every failure means something is a
   suite people still read.
2. **Write down why it exists, right next to it.** A check whose reason has been
   forgotten gets deleted the first time it's inconvenient.

Report through `finding(path, msg)` so your check inherits the FAIL/WARN split,
or `info(msg)` when it needs judgment.

## The contract — preserve it in anything you add

- **Read-only.** No writes, no cache, no lock file, no last-run marker. Two
  sessions must be able to run it simultaneously.
- **Deterministic, sorted output.** Comparing two runs is how drift gets
  spotted; unstable ordering destroys that.
- **Standard library only**, so it runs on a fresh clone.
- **Aggregates, not dumps.** A tool an agent runs should never spend the context
  window it exists to save.

The test bank enforces the first two directly (`writes nothing to the project`,
`output is deterministic across runs`), so breaking them fails the suite rather
than quietly becoming the new behaviour.

## Why the test bank has cases that must fail

Four of its ten cases are **negative controls**: they plant a defect and fail if
the checks stay quiet. Without them, a bank that only asserts "a clean repo
reports clean" passes just as green with every check commented out — measuring
nothing while looking healthy.

To confirm yours are real, break a check on purpose and watch the bank go red.
If it doesn't, the case is decorative.
