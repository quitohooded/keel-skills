# AGENT_POLICY.md — one workspace, several projects, one operator

> Pack for the shape where **several projects live under one root** and one
> person runs them with agents — often with more than one session open at once.
> The distinguishing problems are not the ones a single-repo policy solves:
> keeping projects from bleeding into each other, keeping shared governance out
> of any single project, and keeping two concurrent sessions from editing each
> other's work.
>
> Copy to your workspace root as `AGENT_POLICY.md`, replace every
> `<angle-bracket>` with something real, and delete what doesn't apply. A hot
> zone that isn't a real path or a real action gets ignored by the reasoning
> layer and can't be matched by the enforcement layer.

## 1. Hot zones (need a green light before any change)

- **Anything published or client-facing:**
  - `<projects/*/src/**>` — anything rendered to users
  - `<projects/*/content/**>` — published copy
  - `<any public repo>` — a public repo is hot **because it is public**, even
    for changes that would be trivial in a private one
- **Production / data / infra:**
  - `<deploy config, CI workflow files>`
  - `<database, migrations, schema>`
  - `<.claude/settings.json, hooks, scheduled task definitions>` — these change
    how the agent itself behaves
- **Outward or irreversible actions:**
  - `git push`, deploy/publish, sending anything, charging, deleting data
- **Cross-project changes:** anything that touches more than one project at
  once, even if each individual edit looks small. The combined effect is
  structural.
- **The shared governance layer** (§2) — the files that govern every project.

## 2. Source-of-truth files

New decisions or meaning-changing edits need a green light. Only *following
through* on an already-approved decision runs without one — and only when all
four hold: no judgment needed, the decision states its scope, the change points
back to it, and the decision is still current.

- `<workspace-root/AGENT_POLICY.md>` — this file
- `<workspace-root/GOVERNANCE.md or _shared/>` — rules that apply to every
  project, kept **outside every project**. If it lived inside one, the others
  would depend on that project, and the boundary would be gone.
- `<projects/*/STATE.md>` — each project's own state
- `<the canonical spec or master doc of each project>`

> **The boundary rule.** A project must not cite another project's documents. If
> something is genuinely needed by two, it belongs in the shared layer, not
> copied into both — a copy is a second source of truth, and one of the two will
> be wrong within a month.

## 3. Where state and decisions get recorded

State is read to work; history is read to understand why. They are read at
different frequencies, so they live in different files.

- **Workspace state / history:** `<STATE.md>` / `<CHANGELOG.md>`
- **Per-project state / history:** `<projects/<name>/STATE.md>` / `<.../CHANGELOG.md>`
- **Decisions log:** `<docs/decisions/>`
- **Improvement backlog:** `<IMPROVEMENTS.md>` — capture is free; adopting needs
  a green light
- **Drafts / scratch:** `<_drafts/>` — free to write, never authoritative

**Which file:** a change to how *work* is done goes to the workspace state; a
change to a project goes to that project's. Never both, and never the wrong one
to save a step.

## 4. Model tier overrides

Defaults from the `model-delegation` skill apply. Notable here:

- Cross-project changes are **planning work** even when each edit is mechanical —
  the judgment is in the coordination, and that's where the top tier earns its
  cost.
- Inventories and status sweeps across many repos are mechanical: cheapest tier.

## 5. Definitions for this project

- **"Reversible"** = revertible through version control with no outward effect.
  Anything already pushed to a public remote is **not** reversible in this sense.
- **"Internal"** = never reaches anyone outside. A public repo is never internal.
- **"A release"** = `<tag + published artifact + announcement — name yours>`.
- **"Done"** = verifiable in a file, not asserted in a conversation.

## 6. Standing approvals

Each must state its scope explicitly. A standing approval without a stated
scope is **not** a green light — the agent must not guess how far it goes.

- `[APPROVED <date>]` Commit and push to `<the private meta repo>` as part of
  closing a session, **by explicit path only**. Rationale: it's a private
  backup that reaches no production surface.
  > **Never `git add -A` under this approval.** With parallel sessions it
  > sweeps up another session's in-flight files. List what is yours, stage those
  > paths. If it happens anyway: **say so and move on** — deleting a file
  > someone else is using is worse, and rewriting a pushed branch is worse still.
- `[APPROVED <date>]` Run read-only checks and inventories in any repo, at any
  time.

## 7. Checks

- **Command:** `<python scripts/keel_checks.py>`
- **When:** at the start of a session, before any work, and again at the close.
  Finding drift after two hours of building on it means choosing between rework
  and knowingly shipping on a bad foundation.
- **Reading the output with parallel sessions open:** **FAIL** is committed and
  clean, so it is real drift — safe to fix, nobody has it in flight. **WARN** is
  a modified or untracked file — **someone is working on it, possibly not you;
  report, don't fix.** **info** needs judgment.

## 8. Unattended runs

- **What runs unattended:** `<the weekly hygiene sweep — cron, in words>`
- **Ceiling: read and report only.** No commit, push, deploy, send; nothing
  deleted by inference; nothing marked approved; nothing "fixed". There is no
  human in the run, so **no green light exists to be given** — this is not
  caution, it is the operating condition.
- These limits go **in the routine's own prompt**, because every run starts with
  no memory of any conversation.

## 9. Machine-readable block

Refines the SPEC §4 defaults for the enforcement hook; never removes a category.
Anything not listed still goes through the four-step check.

```keel-policy
hot_paths:
  - "projects/*/src/**"
  - "projects/*/content/**"
  - "**/migrations/**"
  - ".claude/**"
  - ".github/workflows/**"
hot_commands:
  - "git push"
  - "git reset --hard"
  - "git clean -fd"
  - "deploy"
  - "npm publish"
standing_allow_commands:
  - "git commit"
  - "npm run build"
  - "npm test"
standing_allow_paths:
  - "_drafts/**"
  - "**/STATE.md"
  - "**/IMPROVEMENTS.md"
```

> `git commit` is a SPEC §4 default and stays gated unless you allow it here.
> Allowing it is the designed pressure valve — an explicit, recorded choice
> rather than silent erosion. `git push` stays hot regardless: that is the one
> that reaches outside.
>
> A standing allowance clears only the command it matches, never what that
> command is chained to — `npm run build && git push` is still hot.
