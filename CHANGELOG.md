# Changelog

All notable changes to the Keel Skills plugin are documented here.

## [0.6.0] — 2026-08-14

The operating loop. Keel stops being only a brake and becomes the way a session
runs: open on state, work under the check, close by writing state back, sweep
weekly, and turn what repeats into a tool. Plus a **security fix** in the
enforcement hook — see below; it is the reason to upgrade even if you want none
of the rest.

### Fixed — a standing approval could clear a compound command

`enforce-policy.cjs` matched `standing_allow_commands` against the **whole**
command string, and matched it *before* the hot patterns. So a policy allowing
`npm run build` also allowed:

```
npm run build && git push --force origin main   →  allow  (before)
                                                →  ask    (now)
```

The same held for `;`, `|`, newlines and `$(…)`. Commands are now split into
segments on the shell's chaining and substitution operators and each is judged
on its own: **a standing allowance clears only the segment it matches**, and one
hot segment makes the whole call hot. The valve still opens — chaining two
benign commands is still allowed.

This was a bypass of the hard backstop, not a lenient setting, so the rule is
now **normative** in the spec (§7.1, §8.1.5) rather than an implementation
detail. Six regression cases added; the suite goes 16 → 25.

### Added — skills

- **`workspace-hygiene`** — keeping documents and state honest as they age.
  Separating state from history and the three-bar rule for when to cut; why a
  bootstrap must carry no state and why numbers written into method documents
  rot unseen; dated snapshots; preferring generated over maintained. Then the
  mechanical half: checks that each exist because a real drift already got
  through, **three finding levels tied to version-control status** so parallel
  sessions don't fix each other's files, ratchet budgets, and what a periodic
  sweep may never do.
- **`repeatable-work`** — turning repetition into tooling. The rule of three and
  why fewer is premature abstraction; counting occurrences without fooling
  yourself in either direction; the properties an agent-run script needs
  (read-only, deterministic, no shared state, dependency-free, aggregates not
  dumps); test banks with a **negative control**; and the capture → harvest →
  adopt loop, where capture is free and adopting needs a green light.

### Added — commands

- **`/keel-skills:onboard`** — the initiation program. Inspects what is actually
  in the directory (repo or not, one project or several, stack, existing agent
  instructions, existing state files, **or nothing at all**), reports what it
  found *and what it could not tell*, then offers three sizes — the brake alone,
  plus the session loop, plus the maintenance loop — and builds only the one
  chosen. Ends by making the brake fire on a real command, because "it's set up"
  is not evidence.
- **`/keel-skills:session-start`** — load rules and state from files, run the
  checks **before** the work, report what you're standing on.
- **`/keel-skills:session-close`** — reconcile state, one line of history,
  re-run the checks, leave a handoff a fresh session can resume from.
- **`/keel-skills:hygiene`** — read-only sweep: uncommitted work, leaked
  secrets, state drift, stale drafts. Reports; never fixes, commits or deletes.
- **`/keel-skills:harvest`** — review what repeated and draft the tools worth
  building. Proposes; never adopts.

### Added — templates you can run

- **`templates/checks/keel_checks.py`** — a real, dependency-free, read-only
  checks script with five universal checks (policy is concrete and has no
  leftover placeholders · no secrets in *tracked* files · state and history keep
  up with commits · a startup-context ratchet · dated snapshots still fresh),
  a documented extension point, and the FAIL/WARN/info split derived from git
  status.
- **`templates/checks/test_keel_checks.py`** — its test bank, ten cases, **four
  of them negative controls** that plant a defect and fail if the checks stay
  quiet. It also asserts the contract directly: the script writes nothing to the
  project, and two runs produce identical output.
- **`templates/PROJECT_STATE.template.md`**, **`templates/HISTORY.template.md`**,
  **`templates/IMPROVEMENTS.template.md`**, and
  **`templates/routines/weekly-hygiene.md`** — the state/history pair, the
  capture file, and a ready-made unattended routine prompt.

### Added — spec 0.3

- **§6.1 Unattended agents.** With no human present, **no green light exists to
  be given**, so anything requiring one MUST NOT happen — not "proceed
  carefully". Following through (§5) does not lift this.
- **§7 rows 7–8** — two optional policy sections: *Checks* and *Unattended runs*.
- **§7.1** — `hot_mcp` and `standing_allow_mcp` keys (MCP tools were previously
  hardcoded and unrefinable), plus the normative per-segment matching rule.
- **§8.1** — the compound-command requirement, a SHOULD on failing open, and an
  explicit **known-limits** list, so nobody infers more assurance than exists.

### Added — the project runs on itself

- **`AGENT_POLICY.md` at the repo root.** Keel Skills had never had one. Its own
  policy notably declines the `git commit` standing approval the template
  recommends, and says why.
- **`policies/solo-workspace/`** — a pack for several projects under one root
  operated by one person, where the problems are cross-project bleed and
  concurrent sessions.
- **The three existing packs finally enforce.** `web-app-deploy`,
  `nextjs-vercel` and `supabase` shipped in 0.3 with prose only — they predate
  the enforcement layer and were never given a ` ```keel-policy ` block, so
  copying one got you the reasoning layer and **no hard backstop at all**. All
  three now carry a concrete block, plus the two new sections. The supabase pack
  uses the new MCP keys to gate `apply_migration` / `execute_sql` while allowing
  the read-only tools by name.
- CI now runs the Python test bank and validates command front matter.

### Changed

- `inject-policy.cjs` emits a **two-line nudge** when a project has no policy —
  installed-but-unconfigured is the most common way this framework silently does
  nothing. Silence it with the policy, or `.keel/skip-onboarding`.
- `authorization-protocol` gains the unattended-runs rule; `context-discipline`
  gains the two ends of a session and the one-line-of-history rule;
  `model-delegation` points at `repeatable-work` for the threshold and the
  build rules.
- `AGENT_POLICY.template.md` gains §7 Checks and §8 Unattended runs; the
  machine-readable block moves to §9 and documents per-segment matching and the
  placeholder trap.

## [0.5.0] — 2026-06-30

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
