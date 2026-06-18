# Changelog

All notable changes to the Keel plugin are documented here.

## [0.1.0] — 2026-06-17

Initial release.

- `authorization-protocol` skill — three-level authorization model (broad mandate
  / mechanism / explicit scoped approval), four-step safety test, hot-zone
  defaults, mechanical-propagation rule, tie-breakers.
- `model-delegation` skill — model tiering by task type, subagent depth limit (2),
  no-self-escalation rule, no-subagent-approvals rule, cheapest-first tool ladder,
  encapsulate-repetition guidance.
- `context-discipline` skill — files as source of truth, when to stop expanding a
  session, resumable handoff requirements.
- `/keel:policy-init` command and `AGENT_POLICY.template.md` — per-project
  configuration that keeps the framework generic and the buyer's data separate.
