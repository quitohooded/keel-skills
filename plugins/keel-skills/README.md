# Keel Skills (plugin)

Disciplined operations for Claude agents. Three skills + one command + two hooks.

- `skills/authorization-protocol` — when the agent may execute vs. must get
  explicit approval (3 levels, 4-step test, hot zones, mechanical propagation).
- `skills/model-delegation` — cheapest-capable model selection, subagent depth
  limits, no self-escalation, cheapest-first tool ladder.
- `skills/context-discipline` — files as source of truth, clean session handoff.
- `commands/policy-init.md` — scaffolds a per-project `AGENT_POLICY.md`.
- `hooks/inject-policy.cjs` (`SessionStart`) — injects your `AGENT_POLICY.md` into
  context each session, so the policy doesn't depend on the agent reading it.
- `hooks/enforce-policy.cjs` (`PreToolUse`) — deterministic backstop: inspects
  each tool call before it runs and returns allow / ask / deny against your
  policy's hot paths and commands (plus SPEC §4 defaults). `ask` is the L3 prompt;
  in non-interactive runs a hot action is denied. Decisions log to
  `.keel/audit.jsonl`. It is a backstop, **not** a security boundary — see the
  root `README.md`.

## Configuration

All project-specific detail lives in an `AGENT_POLICY.md` at the consuming
project's root. The skills read it at runtime. A template ships in
`templates/AGENT_POLICY.template.md`. Run `/keel-skills:policy-init` to generate one.

The plugin itself contains no project-, client-, or company-specific data by
design.

The authorization model and the `AGENT_POLICY.md` format are specified
runtime-neutral in the repository root `SPEC.md`, so they can be reimplemented
outside Claude Code.

See the repository root `README.md` (English; Spanish in `README.es.md`) for the
overview and `DISTRIBUTION.md` for publishing. MIT-licensed.
