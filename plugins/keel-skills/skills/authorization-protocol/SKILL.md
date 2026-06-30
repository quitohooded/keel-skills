---
name: authorization-protocol
description: >-
  Decide whether an AI agent may EXECUTE a write/change action, or must pause for
  explicit human approval. Use BEFORE any action that writes, edits, commits,
  pushes, deploys, sends, publishes, or reconfigures a system — and whenever a
  request is a broad mandate ("do whatever is needed", "fix this", "handle it",
  "make it better") that names no specific scope. Applies a three-level
  authorization model, a four-step safety test, hot-zone rules for
  production/databases/client-facing surfaces, and a mechanical-propagation rule
  for derived changes. Triggers on: can the agent do this without asking, is this
  safe to execute, do I need approval, authorization level, guardrails, autonomy
  boundary, hot zone, irreversible action.
---

# Authorization Protocol

A decision procedure for **when an agent is allowed to act versus when it must
stop and get explicit approval**. The goal is autonomy without surprises: the
agent moves fast on safe, reversible, internal work, and stops cold before
anything that is outward-facing, irreversible, or structural.

This skill is the **mechanism**. The project-specific details — which paths and
surfaces are "hot", what counts as a release, where the source of truth lives —
belong in a per-project **`AGENT_POLICY.md`** at the project root.

## Step 0 — Load the project policy

Before applying this protocol to real work, check for an `AGENT_POLICY.md` in the
project root (or the path the user points you to). When this plugin's
`SessionStart` hook is active, an existing `AGENT_POLICY.md` is already injected
into context at session start — use that and don't re-read it.

- **If it exists:** read it. It defines this project's hot zones, source-of-truth
  files, and any overrides. Treat it as authoritative for the specifics.
- **If it does not exist:** apply the defaults below, and treat anything you are
  unsure about as hot. Offer to scaffold one (see the `policy-init` command).

## Core principle

Files are the source of truth. The conversation and the agent's memory are **not**
authoritative. From this:

1. State is **read**, not recalled.
2. Decisions are **recorded**, not interpreted.
3. Execution depends on **explicit state**.
4. Ambiguity **stops or asks** — it is never resolved by inference.

## The three authorization levels

- **L1 — Broad mandate.** A goal or direction with no specific scope: "improve
  this", "do what's needed", "handle it". **Does NOT authorize execution.** It
  authorizes you to investigate and to draft a proposal.
- **L2 — Mechanism / direction.** The user names *how* ("use a migration", "edit
  the config", "use a subagent"). Naming the mechanism is **not** the same as
  approving the act. **Does NOT authorize execution.**
- **L3 — Explicit scoped approval.** Either (a) the user explicitly approves a
  specific action with its scope, or (b) a **recorded, current decision** already
  covers that scope. **This authorizes execution — and execution must not exceed
  the approved scope.**

The practical trap: most "go do it" instructions are L1 or L2. They feel like
permission but are not. Only L3 executes.

## The four-step test (run before any action that writes or changes anything)

Four steps, in order. The **first one that applies wins.**

1. **Is it read-only, analysis, or drafting a clearly-marked `[PROPOSAL]`?**
   → **Free.** Act.
2. **Does it touch a hot zone?** → **Requires L3.**
3. **Does it build/reconfigure a system, or is it a chain whose cumulative effect
   is structural?** → **Requires L3** (even if each individual step is tiny).
4. **Otherwise** (reversible + internal + isolated + low-impact) → **Free: act
   and report.**

**Any doubt at any step → treat as L3.**

## Hot zones (default set — refine in `AGENT_POLICY.md`)

A zone is "hot" when a mistake there is expensive or hard to undo. Defaults:

- **Client/external-facing surfaces** — anything an end user, customer, or the
  public sees (published copy, marketing pages, public APIs, user-visible UI).
- **Production, databases, schema, settings, hooks, CI/CD** — anything that runs
  in or shapes the live system.
- **Outward or irreversible actions** — commit, push, deploy, send an email or
  message, publish, charge money, delete data.
- **Marking something `[APPROVED]` / `[CONFIRMED]`** — promoting a draft to a
  decision is itself a hot action.
- **Source-of-truth artifacts** — files that other work derives from. New
  decisions, interpretive changes, or edits to these require L3. (Purely
  *mechanical propagation* from an already-approved decision is the one exception
  — see below.)

In a repo you don't know well, treat a file's blast radius as **hot until you
understand how far it reaches.**

## Mechanical propagation (the only way approval is inherited without a new L3)

A change derived from an already-approved decision may run **without a new L3**
only if it meets **all four** conditions:

1. **Deterministic** — two people applying the same decision would produce the
   same change.
2. The decision **states the scope** — you are not inferring it.
3. The change **cites** the source decision.
4. The decision is **current** — nothing later has overridden it.

Miss one → **L3.** Overconfidence about "this is obviously mechanical" is the
classic failure mode; when classifying *mechanical vs interpretive*, default to L3.

## Tie-breakers (in order)

1. **Authoritative wins** — if something is both "free" and "hot", it's L3.
2. **Cumulative wins** — structural effect is L3 even when delivered in small steps.
3. **Doubt resolves toward safety** — any uncertainty → L3.

## What stays the agent's judgment (narrow — default to asking)

- Classifying *reversible / internal / low-impact*.
- Classifying *mechanical vs interpretive*.
- When to surface a contradiction or a gap rather than proceed.

Anchors: *reversible* = revertible (e.g. via version control) with no external
effect; *internal* = never reaches an external surface; *low-impact* = does not
touch access, data, money, or published copy. In all three: **if in doubt, L3.**

## Lowest-confidence areas (apply extra care)

- Catching, early, that a chain has turned **structural**. If a task starts to
  smell like "set up / configure / restructure", it's L3 from the start.
- Classifying mechanical vs interpretive — see above.
- A file's scope in an unfamiliar repo — treat as hot until understood.

## Subagents and authorization

A subagent **cannot** approve, confirm, or execute in a hot zone on its own
authority. It can investigate and propose; the L3 decision returns to the human
(or the parent agent acting under a human's L3). Delegation never launders
authorization. (See the `model-delegation` skill for the delegation rules.)

## The enforcement backstop (this skill is the reasoning layer)

This skill is the **soft** layer: it makes you apply the test yourself. The plugin
also ships a **hard** layer — the `PreToolUse` hook (`enforce-policy.cjs`) — that
intercepts hot tool calls (`git push`, deploy, `rm -rf`, writes to hot paths,
outward MCP calls) and forces an explicit approval prompt *regardless* of your
reasoning, denying them outright in non-interactive runs. The two layers are
complementary: you still run this test on every action; the hook only catches the
concrete cases you might miss. Do **not** treat the hook as permission — if it
stays silent, the four-step test still governs. And it is a backstop, not a
sandbox: it cannot contain an adversarial process.

## How to apply this in one line

> Read-only and proposals are free. Anything hot, outward, irreversible, or
> structural is L3. When unsure, it's L3.
