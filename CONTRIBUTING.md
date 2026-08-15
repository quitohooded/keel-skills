# Contributing to Keel Skills

Keel Skills is MIT-licensed and wants to become a shared standard for governing AI
agents. The two highest-value contributions are **policy packs** and
**implementations for other runtimes**. Both are easy to start.

## 0. The narrowing rule — read this before proposing anything new

**This project grows by getting narrower, not wider.** Every component added here
is paid for by every user in every session, forever, whether or not they use it.
The cost is permanent; the benefit is occasional. That asymmetry is the whole
reason this section exists.

v0.6.0 roughly doubled the surface that has to stay coherent — five skills, six
commands, two hooks, a runnable checks script, a spec. That was a deliberate bet,
not a licence to keep going. **From v0.7 onward the default answer to "let's add a
component" is no.** What the project needs next is not more mechanism; it is real
users, real policy packs, and the existing mechanism proven in someone else's repo.

**The gate.** A proposal that adds a skill, a command, a hook, a template, or a
spec section has to clear all four:

1. **A real failure caused it.** Something actually went wrong — in this repo or a
   user's — and the existing surface could not have caught it. "Someone might want
   this" is not a cause. Speculative components are how a framework becomes
   something people learn to route around.
2. **No existing piece can absorb it.** Extending a skill, adding a section to an
   existing one, or making a command do one more thing beats a new component
   almost every time. Say explicitly which existing piece you considered and why
   it doesn't fit.
3. **It states what it costs.** A skill costs context in every session because its
   description loads whether or not it triggers (§4). A command costs its
   description line. A spec section costs every implementer. Name the price.
4. **Something comes out, or the total is argued.** If the surface only ever
   grows, the gate isn't a gate. Either retire something, or make the case that
   the total is still small enough to hold in one head.

Fail any one → the proposal is a **no**, or it becomes documentation, an example,
or a policy pack instead. Those three are the growth paths that cost nothing
permanent, and they're where contributions are actually wanted.

**What this does not block:** fixing bugs, tightening the spec, sharpening wording,
adding test cases, adding policy packs, writing examples, and building
implementations for other runtimes. Narrowing is about new *surface*, not new
*work*.

> The precedent this comes from: the Paperclip analysis this repo's strategy is
> built on named "12 subsystems of surface area for a one-person team" as the
> single thing not to copy — and v0.6 drifted toward it anyway. The rule is
> written down here, in the file contributors read, precisely because it was
> already known and still nearly lost.

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

The skills (`authorization-protocol`, `model-delegation`, `context-discipline`,
`workspace-hygiene`, `repeatable-work`) are the reference implementation. When
editing them:

- keep them **generic** — no project-, client-, or company-specific data ever goes
  in a skill; that belongs in the consumer's `AGENT_POLICY.md`;
- keep each skill's concept **disjoint** from the others (don't blur authorization,
  delegation, context, hygiene, and tooling together);
- **every skill costs context in every session**, because its description is
  loaded whether or not it triggers. A new skill has to earn that, and the bar
  is a concept the existing five genuinely don't cover — not a subtopic of one
  of them. Prefer extending an existing skill, or adding a command (which costs
  only its description line and is invoked deliberately);
- update [`CHANGELOG.md`](CHANGELOG.md) and bump the version in `plugin.json` and
  `.claude-plugin/marketplace.json` together.

## 5. Improve the checks template

`templates/checks/keel_checks.py` ships with a contract: read-only, no cache,
deterministic sorted output, standard library only, safe under concurrent runs.
Its test bank asserts the first two directly. Anything you add must preserve all
five, come with a case in `test_keel_checks.py`, and — if it's a new check —
exist because a **real** drift already got through undetected. Speculative checks
are how a suite becomes something people learn to ignore.

## Ground rules

- **No telemetry or network calls** are added without an explicit, documented,
  opt-in design.
- **Attribution:** keep the MIT notice; a visible credit to *Keel Skills by Esteban
  Aguilar* is the norm (see [NOTICE](NOTICE)).
- Discussion and questions: open a GitHub issue.
