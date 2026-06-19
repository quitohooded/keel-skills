# Contributing to Keel Skills

Keel Skills is MIT-licensed and wants to become a shared standard for governing AI
agents. The two highest-value contributions are **policy packs** and
**implementations for other runtimes**. Both are easy to start.

## 1. Add a policy pack (easiest, very useful)

A policy pack is a ready-made `AGENT_POLICY.md` for a stack that isn't covered yet
(e.g. Django, Rails, a mobile app, a monorepo, a data pipeline).

1. Copy an existing pack from [`policies/`](policies/) as a starting point.
2. Make every hot zone **concrete** — a real path or a real action for that stack,
   not a vague category.
3. Add it under `policies/<your-stack>/AGENT_POLICY.md` and list it in
   [`policies/README.md`](policies/README.md).
4. Open a PR. Keep it short — a pack someone has to trim beats one they have to research.

## 2. Build a Keel-compatible implementation

The authorization model and the `AGENT_POLICY.md` format are specified
runtime-neutral in [SPEC.md](SPEC.md). An implementation for another runtime
(Agent SDK, a different harness, a CI gate) is **Keel-compatible** if it satisfies
the Conformance section (§8). If you build one:

- target a stated spec version;
- don't relax §3–§5 below what the spec requires;
- open an issue so it can be listed in the README.

## 3. Improve the spec

This is a draft. Proposals to clarify, tighten, or extend the authorization model
or the file format are welcome via issues and PRs. Changes that affect required
behavior get a spec version bump (§9).

## 4. Improve the skills

The three skills (`authorization-protocol`, `model-delegation`,
`context-discipline`) are the reference implementation. When editing them:

- keep them **generic** — no project-, client-, or company-specific data ever goes
  in a skill; that belongs in the consumer's `AGENT_POLICY.md`;
- keep each skill's concept **disjoint** from the others (don't blur authorization,
  delegation, and context discipline together);
- update [`CHANGELOG.md`](CHANGELOG.md) and bump the version in `plugin.json` and
  `.claude-plugin/marketplace.json` together.

## Ground rules

- **No telemetry or network calls** are added without an explicit, documented,
  opt-in design.
- **Attribution:** keep the MIT notice; a visible credit to *Keel Skills by Esteban
  Aguilar* is the norm (see [NOTICE](NOTICE)).
- Discussion and questions: open a GitHub issue.
