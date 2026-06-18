# Keel (plugin)

Disciplined operations for Claude agents. Three skills + one command.

- `skills/authorization-protocol` — when the agent may execute vs. must get
  explicit approval (3 levels, 4-step test, hot zones, mechanical propagation).
- `skills/model-delegation` — cheapest-capable model selection, subagent depth
  limits, no self-escalation, cheapest-first tool ladder.
- `skills/context-discipline` — files as source of truth, clean session handoff.
- `commands/policy-init.md` — scaffolds a per-project `AGENT_POLICY.md`.

## Configuration

All project-specific detail lives in an `AGENT_POLICY.md` at the consuming
project's root. The skills read it at runtime. A template ships in
`templates/AGENT_POLICY.template.md`. Run `/keel:policy-init` to generate one.

The plugin itself contains no project-, client-, or company-specific data by
design.

See the repository root `README.md` (Spanish) for the commercial overview and
`DISTRIBUTION.md` for publishing.
