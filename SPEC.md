# Keel Agent Governance Specification

- **Spec version:** 0.2 (draft)
- **Status:** open, runtime-neutral
- **License of this document:** MIT (same as the project); you may implement it freely.
- **Maintainer:** Esteban Aguilar — github.com/quitohooded

> **Note on terms (0.2).** This version replaces the old code names L1 / L2 / L3
> with plain words: a **goal**, a **method**, and a **green light**. Same model,
> readable names. If you saw the 0.1 draft: L1 = a goal, L2 = a method, L3 = a
> green light.

This document specifies, independently of any particular agent runtime, two
portable things:

1. The **Keel permission model** — how an autonomous agent decides whether it may
   act on its own or must stop and get a clear yes from a human.
2. The **`AGENT_POLICY.md` format** — the per-project configuration file that tells
   a conforming implementation what *this* project treats as risky, where its
   source of truth lives, and what approvals already stand.

The reference implementation is the Keel Skills plugin for Claude Code. Other
implementations (Agent SDK, other harnesses, CI gates) are encouraged. An
implementation that satisfies the **Conformance** section below may describe itself
as *Keel-compatible*.

---

## 1. Terminology

- **Agent** — an autonomous or semi-autonomous LLM-driven process that can take
  actions (write files, run commands, call tools, send messages).
- **Action** — anything the agent does that writes, edits, commits, pushes,
  deploys, sends, publishes, charges, deletes, or reconfigures a system. Reading,
  searching, and analysis are **not** actions in this sense.
- **Hot zone** — a path, surface, or action where a mistake is expensive or hard to
  undo. (§4.)
- **Source-of-truth file** — a file other work depends on.
- **Goal / Method / Green light** — the three things that get confused with
  permission; only one of them is. (§2.)

---

## 2. The permission model

Three things look like permission. Only one of them lets the agent act.

- **A goal.** A direction with no specific scope: *"improve this", "do what's
  needed", "handle it", "make it better"*. **Does NOT let the agent act.** It lets
  the agent look into it and write up a clearly-labeled proposal.
- **A method.** The human names *how*: *"use a migration", "edit the config", "use a
  subagent"*. Naming the method is **not** approving the action. **Does NOT let the
  agent act.**
- **A green light.** Either (a) the human clearly approves a specific action together
  with its scope, or (b) a **written-down, still-current decision** already covers
  that scope. **A green light lets the agent act — and the agent MUST NOT go beyond
  the approved scope.**

> The practical trap: most "go do it" instructions are just a goal or a method.
> They feel like permission but are not. Only a green light means go.

---

## 3. The four-step check

A conforming implementation MUST run this check before any action (per §1). The
**first step that applies wins.**

1. **Is it read-only, looking into something, or writing a clearly-labeled
   proposal?** → **Free.** Act.
2. **Does it touch a hot zone (§4)?** → **Needs a green light.**
3. **Does it build/reconfigure a system, or is it a chain whose combined effect
   rebuilds something?** → **Needs a green light**, even if each individual step is
   tiny.
4. **Otherwise** (undoable + internal + isolated + low-impact) → **Free: act and
   report.**

**Any doubt at any step → treat it as needing a green light.**

Tie-breakers, in order: (1) risk wins — if something is both "free" and "hot", it
needs a green light; (2) the whole picture wins — a system-rebuilding effect needs a
green light even when delivered in small steps; (3) doubt resolves toward stopping.

---

## 4. Hot zones

A conforming implementation MUST treat the following as hot by default. A project
MAY refine the specifics in its `AGENT_POLICY.md`, but MUST NOT remove a category
wholesale.

- **Anything users or the public see** — published copy, marketing pages, public
  APIs, user-visible UI.
- **Production, databases, schema, settings, hooks, CI/CD** — anything that runs in
  or shapes the live system.
- **Actions that reach outside or can't be undone** — commit, push, deploy, send an
  email or message, publish, charge money, delete data.
- **Turning a draft into a decision** — marking something `[APPROVED]` /
  `[CONFIRMED]` is itself a risky action.
- **Source-of-truth files** — files other work depends on. New decisions,
  meaning-changing edits, or other changes to these need a green light, except
  following through (§5).

In a repository the agent does not know well, a file's reach is **risky until the
agent understands how far it goes.**

---

## 5. Following through on a green light

A change that comes straight out of an already-approved decision MAY run **without a
new green light** only if it meets **all four** conditions:

1. **No judgment needed** — two people applying the same decision produce the same change.
2. The decision **states the scope** — it is not being guessed.
3. The change **points back to** the source decision.
4. The decision is **still current** — nothing later has overridden it.

Miss one → **needs a green light.** Being too sure that "this is obviously just
following through" is the classic failure mode; when deciding *following through vs.
a new call*, default to asking.

---

## 6. Delegation (optional but recommended)

An implementation that supports subagents SHOULD enforce:

- A subagent **cannot** approve, confirm, or act in a hot zone on its own say-so.
  Permission always returns to the human (or to a parent acting under a human's
  green light). **Delegation never creates permission out of thin air.**
- Cheapest-capable model selection; the cheapest tier never spawns subagents;
  maximum nesting depth 2; no self-escalation.

---

## 7. The `AGENT_POLICY.md` format

A project configures a conforming implementation through a single Markdown file at
its root, named `AGENT_POLICY.md`. It SHOULD contain these sections (all may be
brief; empty optional sections may be omitted):

| # | Section | Required | Purpose |
|---|---------|----------|---------|
| 1 | **Hot zones** | yes | Concrete paths/surfaces/actions that need a green light. |
| 2 | **Source-of-truth files** | yes | Files where only following-through runs without a green light. |
| 3 | **Where state and decisions get recorded** | yes | Decisions log, project-state file, per-task notes. |
| 4 | **Model tier overrides** | no | Project-specific overrides of the delegation defaults. |
| 5 | **Definitions for this project** | no | Pin down "undoable", "internal", "release", etc. |
| 6 | **Standing approvals** | no | Written decisions that grant a green light in advance for a defined scope. Each MUST state its scope explicitly. |

Rules:

- Hot zones MUST be **concrete** (a real path or a real action). Vague hot zones
  get ignored.
- Anything not listed is treated as potentially risky **only** when the four-step
  check says so; under doubt, the implementation stops and asks.
- A standing approval (§7.6) that does not state its scope explicitly is **not** a
  valid green light — the implementation MUST NOT guess the scope.

The canonical template is
[`plugins/keel-skills/templates/AGENT_POLICY.template.md`](plugins/keel-skills/templates/AGENT_POLICY.template.md).

### 7.1 Optional machine-readable block (for enforcing implementations)

The prose sections above are written for an LLM to *reason* with. An implementation
that enforces the policy with deterministic code (e.g. a pre-action hook, §8.1)
needs a concrete, parseable subset. It SHOULD read it from a single fenced
` ```keel-policy ` block inside the same `AGENT_POLICY.md`, so the project keeps
**one file**. The block uses flat lists only:

```keel-policy
hot_paths:
  - "src/**"
hot_commands:
  - "git push"
standing_allow_commands:
  - "npm run build"
standing_allow_paths:
  - "_borradores/**"
```

- `hot_paths` / `hot_commands` — glob paths and command substrings that are hot.
- `standing_allow_*` — scoped exceptions, the machine-readable form of §7.6.
- The block **refines** the §4 defaults; it MUST NOT be read as removing a default
  category. Anything not in the block still falls under the four-step check (§3).
- The block is **optional**. Its absence means the enforcing layer runs on §4
  defaults alone; the reasoning layer (the LLM) is unaffected either way.

---

## 8. Conformance

An implementation is **Keel-compatible** if it:

1. Reads `AGENT_POLICY.md` from the project root (or a path the user designates)
   and treats it as authoritative over these defaults.
2. Runs the four-step check (§3) before every action (§1).
3. Treats every §4 default category as hot unless the policy concretely refines it.
4. Only lets a green light carry over through following-through when all four §5
   conditions hold.
5. Never lets a subagent grant a green light (§6) if it supports delegation.
6. Resolves any doubt toward stopping and asking.

An implementation MAY add stricter rules. It MUST NOT relax §3–§5 below what is
specified here.

### 8.1 Enforcing implementations (optional, stricter)

The conformance above is satisfied by a *reasoning* implementation — one where the
agent applies the check itself. An implementation MAY additionally **enforce** the
policy with deterministic code that intercepts actions before they run and blocks
risky ones that lack a green light. An enforcing implementation:

1. Intercepts actions (§1) **before they run** and maps them to allow / ask / deny,
   where *ask* is the request for a green light (an explicit human-approval prompt).
2. Treats the §4 defaults as hot even with no machine-readable block (§7.1) present.
3. In a non-interactive context (no human able to give a green light), **denies** any
   action it would otherwise have asked about.
4. Is understood to be a **backstop, not a cage** — it raises assurance against
   accident, drift, and hallucination, but cannot contain an adversarial agent. Real
   isolation (scoped credentials, sandboxing) is complementary, not replaced.

The reference enforcing implementation is the Keel Skills `PreToolUse` hook
(`enforce-policy.cjs`).

---

## 9. Versioning

This spec uses `MAJOR.MINOR`. A MINOR bump adds or clarifies without breaking a
conforming implementation; a MAJOR bump may change required behavior. The 0.2 bump
renamed the three permission levels (goal / method / green light) without changing
how they work. Implementations SHOULD declare which spec version they target.

---

## 10. Changes welcome

This is a draft. Proposals to clarify, tighten, or extend the model and the file
format are welcome via issues/PRs. If you build a Keel-compatible implementation for
another runtime, open an issue so it can be listed.
