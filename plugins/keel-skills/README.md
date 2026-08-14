# Keel Skills (plugin)

Disciplined operations for Claude agents. Five skills + six commands + two hooks.

- `skills/authorization-protocol` — when the agent may execute vs. must stop and
  ask (goal / method / green light, the four-step check, hot zones, following
  through on a green light you already have, and unattended runs).
- `skills/model-delegation` — cheapest-capable model selection, subagent depth
  limits, no self-escalation, cheapest-first tool ladder.
- `skills/context-discipline` — files as source of truth, the two ends of a
  session, clean handoff.
- `skills/workspace-hygiene` — state vs. history and when to cut, bootstraps
  that carry no state, dated snapshots, checks that earn their place, the
  FAIL/WARN/info split, what an unattended sweep may never do.
- `skills/repeatable-work` — the rule of three, what an agent-run script must
  be, test banks with a negative control, capture → harvest → adopt.
- `commands/onboard.md` — **start here.** Inspects the directory, reports what it
  found *and what it couldn't tell*, offers three levels, builds the one chosen.
- `commands/policy-init.md` — scaffolds a per-project `AGENT_POLICY.md`.
- `commands/session-start.md` · `session-close.md` — the two ends of a session.
- `commands/hygiene.md` — read-only sweep, safe to schedule.
- `commands/harvest.md` — review what repeated; proposes, never adopts.
- `templates/checks/` — a runnable, dependency-free checks script and its test
  bank. `templates/routines/` — an unattended weekly-sweep prompt.
- `hooks/inject-policy.cjs` (`SessionStart`) — injects your `AGENT_POLICY.md` into
  context each session, so the policy doesn't depend on the agent reading it;
  nudges toward `onboard` when there is no policy.
- `hooks/enforce-policy.cjs` (`PreToolUse`) — deterministic backstop: inspects
  each tool call before it runs and returns allow / ask / deny against your
  policy's hot paths and commands (plus SPEC §4 defaults). `ask` is the green-light prompt;
  in non-interactive runs a hot action is denied. Decisions log to
  `.keel/audit.jsonl`. It is a backstop, **not** a security boundary — see the
  root `README.md`.

## Configuration

All project-specific detail lives in an `AGENT_POLICY.md` at the consuming
project's root. The skills read it at runtime. A template ships in
`templates/AGENT_POLICY.template.md`. Run `/keel-skills:onboard` to set it up
(or `/keel-skills:policy-init` for just the file).

The plugin itself contains no project-, client-, or company-specific data by
design.

The authorization model and the `AGENT_POLICY.md` format are specified
runtime-neutral in the repository root `SPEC.md`, so they can be reimplemented
outside Claude Code.

See the repository root `README.md` (English; Spanish in `README.es.md`) for the
overview and `DISTRIBUTION.md` for publishing. MIT-licensed.
