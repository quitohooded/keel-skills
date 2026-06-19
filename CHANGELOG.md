# Changelog

All notable changes to the Keel Skills plugin are documented here.

## [0.3.0] — 2026-06-19

Strategic repositioning toward an open governance standard.

- **License → MIT.** Relicensed from source-available (Attribution, No-Resale) to
  MIT to enable free adoption, forking, and reimplementation. Attribution is
  preserved via the MIT notice and a new `NOTICE` file. This unblocks the
  distribution model the project's growth strategy depends on.
- **`SPEC.md`** — the authorization model (L1/L2/L3, four-step test, hot zones,
  mechanical propagation) and the `AGENT_POLICY.md` format are now specified
  **runtime-neutral**, with a Conformance section, so they can be cited and
  reimplemented outside Claude Code (the "open standard" play).
- **English is now the primary repo language** (`README.md`); the Spanish version
  is preserved as `README.es.md`.
- **`policies/`** — ready-made `AGENT_POLICY.md` packs for common stacks
  (`web-app-deploy`, `nextjs-vercel`, `supabase`) + a registry index.
- **`examples/`** — `l3-brake.md` (a concrete before/after of the brake) and
  `demo-script.md` (a recordable 60-second demo script).
- **`CONTRIBUTING.md`** — how to add policy packs, build Keel-compatible
  implementations, and improve the spec.
- **`STRATEGY.md`** — the growth strategy and roadmap (internal source of truth).
- No behavioral change to the three skills, the command, or the hook.

## [0.2.0] — 2026-06-19

- **`SessionStart` hook** (`hooks/hooks.json` + `hooks/inject-policy.cjs`) — when a
  project has an `AGENT_POLICY.md`, its contents are injected into context at the
  start of every session, so the policy no longer depends on the agent choosing to
  read it. Cross-platform (runs via Node); stays silent when no policy is present.
- `authorization-protocol` — Step 0 now notes the policy may already be in context
  via the hook.
- `context-discipline` — now points to `AGENT_POLICY.md`'s "where state and
  decisions get recorded" section instead of leaving the location to guesswork.
- Docs — README embeds the authorization-model diagram (`assets/authorization-flow.svg`);
  `DISTRIBUTION.md` updated (repo already published, hook added to layout/checklist).

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
- `/keel-skills:policy-init` command and `AGENT_POLICY.template.md` — per-project
  configuration that keeps the framework generic and the buyer's data separate.
