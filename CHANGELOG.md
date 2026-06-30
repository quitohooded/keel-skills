# Changelog

All notable changes to the Keel Skills plugin are documented here.

## [Unreleased]

Plain-language vocabulary — same model, readable names. No behavior change.

- **Renamed the three permission levels** from the code names `L1` / `L2` / `L3`
  to plain words: **a goal** (was L1), **a method** (was L2), and **a green light**
  (was L3). "Only a green light means go." Other jargon was humanized too:
  *mechanical propagation* → "following through on a green light you already have";
  *four-step test* → "four-step check"; *source-of-truth artifact* →
  "source-of-truth file". *Hot zone* was kept (already intuitive).
- Applied across the skills, `SPEC.md` (bumped to **spec 0.2** with a terms
  migration note), both READMEs, the policy template and packs, the enforcement
  hook's user-facing reason strings, the examples (`l3-brake.md` →
  `green-light-brake.md`), the docs site, the diagrams, and the marketing copy.
- Historical changelog entries below are left as-is — they describe what shipped at
  the time, under the old names.

## [0.4.0] — 2026-06-30

Enforcement layer — Keel goes from a framework the agent *tries* to follow to a
guardrail that *backstops* it.

- **`PreToolUse` hook** (`hooks/enforce-policy.cjs`) — deterministic enforcement.
  Inspects every tool call before it runs and returns allow / ask / deny against
  the SPEC §4 hot defaults plus your policy's concrete hot paths and commands.
  `ask` is the L3 event (an explicit human-approval prompt); in a non-interactive
  run (`KEEL_NONINTERACTIVE=1` / `CI`) a hot action is **denied** since no human
  can grant L3. Standing approvals in the policy let scoped exceptions through.
  Fails open on malformed hook input so it never wedges a workflow. Dependency-free.
- **Audit trail** — every decision is appended to `.keel/audit.jsonl`
  (timestamp, tool, matched rule, verdict).
- **`AGENT_POLICY.md` machine-readable block** — an optional fenced
  ` ```keel-policy ` block (flat lists: `hot_paths`, `hot_commands`,
  `standing_allow_commands`, `standing_allow_paths`) that the hook parses, kept in
  the same single file as the prose. Documented in `SPEC.md` §7.1; added to the
  template.
- **`SPEC.md`** — §7.1 (machine-readable block) and §8.1 (enforcing
  implementations, optional & stricter) added, both runtime-neutral. The model is
  explicit that enforcement is a backstop, **not** a security boundary.
- **Tests** — `hooks/enforce-policy.test.cjs`, a dependency-free runner (16 cases)
  wired into CI (`validate.yml`).
- **Docs** — root and plugin READMEs gain a "two layers (judgment + enforcement)"
  section and the not-a-security-boundary caveat; `authorization-protocol` skill
  notes the hard backstop.
- No change to the existing skills' decision logic or the `SessionStart` hook.

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
