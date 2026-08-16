# Keel Agent Governance Specification

- **Spec version:** 0.4 (draft)
- **Status:** open, runtime-neutral
- **License of this document:** MIT (same as the project); you may implement it freely.
- **Maintainer:** Esteban Aguilar — github.com/quitohooded

> **What 0.4 adds, part two.** Where the policy is read from (§7.2). A session
> opened above the project — a workspace, a monorepo — never read the
> subproject's own policy, and could not have matched its globs if it had. The
> governing policy is now the nearest one above the file, with the session root
> as the fallback, and a subproject may loosen a rule only by declaring a
> standing allowance rather than by silence. Actions that carry no file target
> (commands, MCP calls) still resolve at the session root, and §7.2 says so
> instead of leaving it to be discovered.
>
> **What 0.4 adds.** A closed approval channel (§6.2). 0.3 required an
> *unattended* run to deny what it cannot get approved; 0.4 generalises that to
> any state where the approval prompt will not reach a human — including an
> attended session whose prompts are switched off. An implementation that emits
> an "ask" the host silently ignores, and then lets the action run, is **not
> conforming**: it reports a brake it does not apply. Plus the matching
> known-limit disclosure in §8.1. Nothing in §2–§5 changed; §6.2 is the one
> addition an *enforcing* implementation must adopt.
>
> *This was found in the reference implementation, which had the defect from the
> day the hook shipped: it degraded correctly in CI and not at all in an
> interactive session with prompts off — the case covering most of the
> irreversible actions people actually take.*

> **What 0.3 adds.** Unattended agents (§6.1) — when no human is present, no
> green light exists to be given, so anything requiring one MUST NOT happen. Two
> new optional policy sections (§7, rows 7–8), two new keys and a **normative
> per-segment matching rule** for the machine-readable block (§7.1), and a
> matching requirement for enforcing implementations (§8.1). Nothing in §2–§5
> changed, so a 0.2 implementation stays conforming; §8.1.5 is the one addition
> an *enforcing* implementation must adopt.
>
> **Note on terms (0.2).** That version replaced the old code names L1 / L2 / L3
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

### 6.1 Unattended agents

An **unattended run** is any execution with no human able to answer in real time:
a scheduled routine, a CI job, a background or headless agent.

In an unattended run there is **no party who could give a green light**.
Therefore a conforming implementation MUST treat every action that requires one
(§3.2, §3.3, and anything reached through the doubt rule) as **unavailable**,
not as permitted-with-care. Specifically, an unattended run:

1. MUST NOT commit, push, deploy, publish, send, charge, or delete.
2. MUST NOT mark anything approved or confirmed (§4).
3. MUST NOT repair, refactor, or redesign what it finds broken — it reports with
   a recommendation.
4. MAY read, measure, analyse, and write clearly-labeled proposals (§3.1).

An implementation SHOULD require these limits to be stated **in the unattended
job's own instructions**, because such a run begins with no access to any prior
conversation: a limit agreed once interactively does not exist for it.

Following through (§5) does **not** lift this. A standing approval may cover an
unattended action only if it names that unattended context explicitly in its
scope.

### 6.2 When the approval channel is closed

An unattended run is one case of a more general condition: **the green light
cannot arrive**. The other case is a human who *is* present but has turned the
approval prompts off — a "bypass" or "don't ask" mode in the host runtime.

The two are not the same situation and MUST NOT be described as one. In the
second there is a person who could be asked by other means, and who made a
deliberate choice about being interrupted. But the consequence for a hot action
is identical, because the channel that would carry the approval is closed.

A conforming enforcing implementation MUST therefore apply §6.1's rule whenever
it can determine that no approval prompt will reach a human — whatever the
cause. Two requirements follow:

1. An implementation MUST NOT let an unanswerable request for approval stand in
   for an approval. If it emits an "ask" the host will not surface, and the
   action then proceeds, the implementation is **not conforming**: it is
   reporting a brake it does not apply.
2. It MUST read that state from the host wherever the host exposes it, rather
   than inferring it from the environment alone. Where the state cannot be
   determined, it MUST default to asking rather than denying, and MUST disclose
   the gap (§8.1).

Requirement 1 is normative because the failure is **silent**. The decision log
records `ask`, the audit trail records `ask`, the operator reads both as a brake
that engaged — and the action happened anyway. Nothing in the system reports a
problem. An implementation that degrades correctly in CI can still fail this
requirement completely in an interactive session, which is where most of the
irreversible actions actually occur.

A blocked action SHOULD say how to become unblocked — a standing approval that
would cover it, or the setting that would reopen the channel. A block with no
route out teaches the operator to remove the guardrail.

---

## 7. The `AGENT_POLICY.md` format

A project configures a conforming implementation through a single Markdown file at
its root, named `AGENT_POLICY.md`. It SHOULD contain these sections (all may be
brief; empty optional sections may be omitted):

| # | Section | Required | Purpose |
|---|---------|----------|---------|
| 1 | **Hot zones** | yes | Concrete paths/surfaces/actions that need a green light. |
| 2 | **Source-of-truth files** | yes | Files where only following-through runs without a green light. |
| 3 | **Where state and decisions get recorded** | yes | The state file, the history file, decisions log, per-task notes. |
| 4 | **Model tier overrides** | no | Project-specific overrides of the delegation defaults. |
| 5 | **Definitions for this project** | no | Pin down "undoable", "internal", "release", etc. |
| 6 | **Standing approvals** | no | Written decisions that grant a green light in advance for a defined scope. Each MUST state its scope explicitly. |
| 7 | **Checks** | no | The command that verifies this project mechanically, and when to run it. |
| 8 | **Unattended runs** | no | What runs with no human present, and the ceiling it operates under (§6.1). |

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
hot_mcp:
  - "notion-update-page"
standing_allow_commands:
  - "npm run build"
standing_allow_paths:
  - "_drafts/**"
standing_allow_mcp:
  - "delete_temp_file"
```

- `hot_paths` / `hot_commands` / `hot_mcp` — glob paths, command substrings, and
  tool-name substrings that are hot.
- `standing_allow_*` — scoped exceptions, the machine-readable form of §7.6.
- The block **refines** the §4 defaults; it MUST NOT be read as removing a default
  category. Anything not in the block still falls under the four-step check (§3).
- The block is **optional**. Its absence means the enforcing layer runs on §4
  defaults alone; the reasoning layer (the LLM) is unaffected either way.

**Matching rules (normative).**

- A **shell command MUST be matched per segment**, where segments are the
  individual commands separated by the shell's chaining and substitution
  operators (`&&`, `||`, `;`, `|`, `&`, newline, command substitution). A
  `standing_allow_commands` entry clears **only the segment it matches** and
  MUST NOT clear the rest of a compound command. If any segment is hot, the
  whole call is hot. *(Matching the whole string instead lets
  `npm run build && git push --force` pass as "covered by a standing
  approval" — the allowance vouching for what it was chained to.)*
- It follows that a pattern MUST NOT itself contain a chaining operator; such a
  pattern can never match a segment.
- Matching is case-insensitive and on **substrings**, so it over-catches by
  design. `standing_allow_*` is the mechanism for narrowing it, and narrowing
  is a recorded choice rather than a silent one.

### 7.2 Where the policy is read from

A session is often opened **above** the project being edited: a workspace of
several repositories, a monorepo, a parent directory holding both. 0.3 said only
that an implementation reads `AGENT_POLICY.md` "from the project root", which is
silent about that case — and silence here fails toward the unsafe side twice
over. A subproject's own policy is never read, and its globs could not match even
if it were: the policy writes `src/**` while the session sees
`packages/api/src/**`.

For an action with a **file target**, a conforming implementation:

1. MUST resolve the target to an absolute path **once**, against the session
   root, before matching anything. A relative tool path is relative to the
   session root; re-resolving it against some other directory nests it twice.
2. MUST evaluate against the **nearest** `AGENT_POLICY.md` at or above the
   target, bounded by the session root, with globs matched relative to *that*
   policy's directory.
3. MUST fall back to the session-root policy for what the nearest one does not
   mention, so a subproject cannot loosen a rule by merely existing.
4. MAY let a nearer policy override a broader one, but **only through an
   explicit standing allowance**. A project may relax a rule about its own
   files; it may not do so by silence.
5. MUST NOT walk above the session root. A target outside it has no governing
   policy in scope, and searching upward would attach an unrelated one.

**Known limit, and it is not small.** This applies to actions that *name* a
file. A shell command and an MCP call carry no target path, so they are
classified against the session-root policy alone. In a workspace of several
projects, a command's hot patterns are therefore the outer project's — which is
usually the safer direction, since the outer policy is the broader one, but it
means a subproject cannot declare a command hot for itself. Implementations
SHOULD say which of the two they do.

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
   action it would otherwise have asked about — the mechanical face of §6.1.
4. Is understood to be a **backstop, not a cage** — it raises assurance against
   accident, drift, and hallucination, but cannot contain an adversarial agent. Real
   isolation (scoped credentials, sandboxing) is complementary, not replaced.
5. **Matches shell commands per segment** (§7.1). A standing allowance MUST NOT
   clear a compound command on the strength of one matching segment. *(New in
   0.3, and the one change an existing enforcing implementation has to make: a
   whole-string match is a bypass, not a looser policy.)*

It SHOULD additionally **fail open on malformed input** — a backstop that wedges
the workflow when its own contract is violated gets removed, and then there is
no backstop at all.

**Known limits of pattern-based enforcement.** State them in your docs rather
than letting users infer more assurance than exists:

- Indirection defeats command matching (`g=push; git $g`).
- A file written by a shell command rather than a file-writing tool is matched
  as a *command*, not against `hot_paths`.
- Substring matching cannot see intent: it over-catches, and narrowing it is a
  policy decision, not an implementation detail.
- **Whether an "ask" will actually reach a human is only as good as what the
  host reports** (§6.2). An implementation can cover the modes it can name and
  no others. In the reference implementation that means: fully covered where the
  host reports a bypass-style mode or a headless environment; **not** covered
  where a mode auto-approves only *part* of the surface — an edits-accepting
  mode leaves `hot_paths` unenforced while `hot_commands` still prompts, so the
  brake is half-engaged and says nothing about it. State which modes you cover.
  This limit was itself undisclosed until 2026-08-16, and its absence is what
  let the reference implementation run inert under a bypass mode.

The reference enforcing implementation is the Keel Skills `PreToolUse` hook
(`enforce-policy.cjs`).

---

## 9. Versioning

This spec uses `MAJOR.MINOR`. A MINOR bump adds or clarifies without breaking a
conforming implementation; a MAJOR bump may change required behavior.

- **0.2** renamed the three permission levels (goal / method / green light)
  without changing how they work.
- **0.3** added unattended agents (§6.1), two optional policy sections, and the
  per-segment command-matching rule (§7.1, §8.1.5). A *reasoning* implementation
  conforming to 0.2 still conforms; an *enforcing* one must adopt §8.1.5, since
  whole-string matching is a bypass rather than a laxer setting.

Implementations SHOULD declare which spec version they target.

---

## 10. Changes welcome

This is a draft. Proposals to clarify, tighten, or extend the model and the file
format are welcome via issues/PRs. If you build a Keel-compatible implementation for
another runtime, open an issue so it can be listed.
