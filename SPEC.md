# Keel Agent Governance Specification

- **Spec version:** 0.1 (draft)
- **Status:** open, runtime-neutral
- **License of this document:** MIT (same as the project); you may implement it freely.
- **Maintainer:** Esteban Aguilar — github.com/quitohooded

This document specifies, independently of any particular agent runtime, two
portable things:

1. The **Keel Authorization Model** — how an autonomous agent decides whether it
   may execute an action or must stop and obtain explicit human approval.
2. The **`AGENT_POLICY.md` format** — the per-project configuration file that
   tells a conforming implementation what *this* project treats as hot, where its
   source of truth lives, and what standing approvals exist.

The reference implementation is the Keel Skills plugin for Claude Code. Other
implementations (Agent SDK, other harnesses, CI gates) are encouraged. An
implementation that satisfies the **Conformance** section below may describe
itself as *Keel-compatible*.

---

## 1. Terminology

- **Agent** — an autonomous or semi-autonomous LLM-driven process that can take
  actions (write files, run commands, call tools, send messages).
- **Action** — anything the agent does that writes, edits, commits, pushes,
  deploys, sends, publishes, charges, deletes, or reconfigures a system. Reading,
  searching, and analysis are **not** actions in this sense.
- **Hot zone** — a path, surface, or action where a mistake is expensive or hard
  to undo. (§4.)
- **Source-of-truth artifact** — a file other work derives from.
- **L1 / L2 / L3** — the three authorization levels. (§2.)

---

## 2. The authorization model

Three levels. Only one of them authorizes execution.

- **L1 — Broad mandate.** A goal or direction with no specific scope: *"improve
  this", "do what's needed", "handle it", "make it better"*. **Does NOT authorize
  execution.** It authorizes investigation and drafting a clearly-marked proposal.
- **L2 — Mechanism / direction.** The human names *how*: *"use a migration", "edit
  the config", "use a subagent"*. Naming the mechanism is **not** approving the
  act. **Does NOT authorize execution.**
- **L3 — Explicit scoped approval.** Either (a) the human explicitly approves a
  specific action together with its scope, or (b) a **recorded, current decision**
  already covers that scope. **L3 authorizes execution — and execution MUST NOT
  exceed the approved scope.**

> The practical trap: most "go do it" instructions are L1 or L2. They feel like
> permission but are not. Only L3 executes.

---

## 3. The four-step test

A conforming implementation MUST run this test before any action (per §1). The
**first step that applies wins.**

1. **Is it read-only, analysis, or drafting a clearly-marked proposal?**
   → **Free.** Act.
2. **Does it touch a hot zone (§4)?** → **Requires L3.**
3. **Does it build/reconfigure a system, or is it a chain whose cumulative effect
   is structural?** → **Requires L3**, even if each individual step is tiny.
4. **Otherwise** (reversible + internal + isolated + low-impact) → **Free: act and
   report.**

**Any doubt at any step → treat as L3.**

Tie-breakers, in order: (1) authoritative wins — if something is both "free" and
"hot", it is L3; (2) cumulative wins — structural effect is L3 even when delivered
in small steps; (3) doubt resolves toward safety.

---

## 4. Hot zones

A conforming implementation MUST treat the following as hot by default. A project
MAY refine the specifics in its `AGENT_POLICY.md`, but MUST NOT remove a category
wholesale.

- **Client / external-facing surfaces** — anything an end user, customer, or the
  public sees (published copy, marketing pages, public APIs, user-visible UI).
- **Production, databases, schema, settings, hooks, CI/CD** — anything that runs
  in or shapes the live system.
- **Outward or irreversible actions** — commit, push, deploy, send an email or
  message, publish, charge money, delete data.
- **Promoting a draft to a decision** — marking something `[APPROVED]` /
  `[CONFIRMED]` is itself a hot action.
- **Source-of-truth artifacts** — files other work derives from. New decisions,
  interpretive changes, or edits to these require L3, except mechanical
  propagation (§5).

In a repository the agent does not know well, a file's blast radius is **hot until
the agent understands how far it reaches.**

---

## 5. Mechanical propagation

A change derived from an already-approved decision MAY run **without a new L3**
only if it meets **all four** conditions:

1. **Deterministic** — two people applying the same decision produce the same change.
2. The decision **states the scope** — it is not being inferred.
3. The change **cites** the source decision.
4. The decision is **current** — nothing later has overridden it.

Miss one → **L3.** Overconfidence that "this is obviously mechanical" is the
classic failure mode; when classifying *mechanical vs. interpretive*, default to L3.

---

## 6. Delegation (optional but recommended)

An implementation that supports subagents SHOULD enforce:

- A subagent **cannot** approve, confirm, or execute in a hot zone on its own
  authority. Authorization always returns to the human (or to a parent acting
  under a human's L3). **Delegation never launders authorization.**
- Cheapest-capable model selection; the cheapest tier never spawns subagents;
  maximum nesting depth 2; no self-escalation.

---

## 7. The `AGENT_POLICY.md` format

A project configures a conforming implementation through a single Markdown file at
its root, named `AGENT_POLICY.md`. It SHOULD contain these sections (all may be
brief; empty optional sections may be omitted):

| # | Section | Required | Purpose |
|---|---------|----------|---------|
| 1 | **Hot zones** | yes | Concrete paths/surfaces/actions that require L3. |
| 2 | **Source-of-truth artifacts** | yes | Files where only mechanical propagation runs without L3. |
| 3 | **Where state and decisions get recorded** | yes | Decisions log, project-state file, per-task notes. |
| 4 | **Model tier overrides** | no | Project-specific overrides of the delegation defaults. |
| 5 | **Definitions for this project** | no | Pin down "reversible", "internal", "release", etc. |
| 6 | **Standing approvals** | no | Recorded decisions that grant L3 in advance for a defined scope. Each MUST state its scope explicitly. |

Rules:

- Hot zones MUST be **concrete** (a real path or a real action). Vague hot zones
  get ignored.
- Anything not listed is treated as potentially hot **only** when the four-step
  test says so; under doubt, the implementation escalates to L3.
- A standing approval (§7.6) that does not state its scope explicitly is **not**
  a valid L3 source — the implementation MUST NOT infer the scope.

The canonical template is
[`plugins/keel-skills/templates/AGENT_POLICY.template.md`](plugins/keel-skills/templates/AGENT_POLICY.template.md).

---

## 8. Conformance

An implementation is **Keel-compatible** if it:

1. Reads `AGENT_POLICY.md` from the project root (or a path the user designates)
   and treats it as authoritative over these defaults.
2. Runs the four-step test (§3) before every action (§1).
3. Treats every §4 default category as hot unless the policy concretely refines it.
4. Only inherits approval through mechanical propagation when all four §5
   conditions hold.
5. Never lets a subagent grant L3 (§6) if it supports delegation.
6. Resolves any doubt toward L3.

An implementation MAY add stricter rules. It MUST NOT relax §3–§5 below what is
specified here.

---

## 9. Versioning

This spec uses `MAJOR.MINOR`. A MINOR bump adds or clarifies without breaking a
conforming implementation; a MAJOR bump may change required behavior.
Implementations SHOULD declare which spec version they target.

---

## 10. Changes welcome

This is a draft. Proposals to clarify, tighten, or extend the model and the file
format are welcome via issues/PRs. If you build a Keel-compatible implementation
for another runtime, open an issue so it can be listed.
