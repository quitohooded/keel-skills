# Example: the hard brake (enforcement hook)

[`green-light-brake.md`](green-light-brake.md) shows the **soft** brake — the agent *reasoning* its
way to a stop. This shows the **hard** brake: the `PreToolUse` hook
(`enforce-policy.cjs`) intercepting a tool call and stopping it *regardless* of
what the model decided. Two layers, defense in depth.

The difference matters in one sentence: the soft layer depends on the model
choosing to comply; the hard layer doesn't.

---

## The setup

The project's `AGENT_POLICY.md` has a machine-readable block:

```keel-policy
hot_paths:
  - "src/**"
hot_commands:
  - "git push"
standing_allow_commands:
  - "npm run build"
```

Plus the SPEC §4 defaults the hook always enforces (`git push`, deploy, `rm -rf`,
schema changes, outward MCP calls), even with no block at all.

---

## What the hook does, call by call

Every tool call is inspected *before* it runs. The hook emits a decision
(`allow` / `ask` / `deny`). `ask` becomes an explicit human-approval prompt — the
request for a green light.

**The agent tries to read a file** → free, never interrupts.
```json
in : { "tool_name": "Read", "tool_input": { "file_path": "src/x.ts" } }
out: { "permissionDecision": "allow", "reason": "keel: read-only tool" }
```

**The agent tries to push** → hot, stops for approval.
```json
in : { "tool_name": "Bash", "tool_input": { "command": "git push origin main" } }
out: { "permissionDecision": "ask",
       "reason": "keel: needs a green light (explicit approval) — command matches hot pattern `git push`" }
```

**The agent tries to run the approved build** → standing approval lets it through.
```json
in : { "tool_name": "Bash", "tool_input": { "command": "npm run build" } }
out: { "permissionDecision": "allow", "reason": "keel: covered by standing approval (npm run build)" }
```

**The agent tries to edit client-facing code** → hot path, stops.
```json
in : { "tool_name": "Write", "tool_input": { "file_path": "src/app/page.tsx" } }
out: { "permissionDecision": "ask",
       "reason": "keel: needs a green light (explicit approval) — writes to hot path `src/app/page.tsx` (matches `src/**`)" }
```

**The agent chains the approved build to a push** → still hot. The standing
approval covers `npm run build`, and *only* `npm run build`.
```json
in : { "tool_name": "Bash",
       "tool_input": { "command": "npm run build && git push --force origin main" } }
out: { "permissionDecision": "ask",
       "reason": "keel: needs a green light (explicit approval) — command matches hot pattern `git push`" }
```

> **This one was a real bug, fixed in 0.6.0.** Until then the hook matched
> `standing_allow_commands` against the whole command string and checked it
> *before* the hot patterns, so the call above came back `allow` — "covered by
> standing approval (npm run build)". The allowance was vouching for whatever it
> happened to be chained to, and the same held for `;`, `|`, newlines and
> `$(…)`. Commands are now split on the shell's chaining operators and judged
> per segment: **an allowance clears only the segment it matches, and one hot
> segment makes the whole call hot.** The rule is normative in
> [SPEC.md](../SPEC.md) §7.1 and §8.1.5, because it is a bypass of the backstop
> rather than a lenient setting. Chaining two benign commands still passes.

---

## The part the soft layer can't do: no human, no pass

Run the same push in a **non-interactive** context (CI, a headless agent, a
scheduled job — `KEEL_NONINTERACTIVE=1` or `CI`). There's no one to give a green
light, so `ask` can't be answered. The hook **denies** outright:

```json
in : { "tool_name": "Bash", "tool_input": { "command": "git push --force origin main" } }
out: { "permissionDecision": "deny",
       "reason": "keel: BLOCKED (no human present to give a green light) — command matches hot pattern `git push`" }
```

This is the case the reasoning layer fundamentally can't cover: when the agent
runs unattended, "stop and ask" has to mean **stop**, because asking goes nowhere.

---

## The audit trail

Every decision lands in `.keel/audit.jsonl` — so after the fact you can answer
"what did the agent try, and what did we stop?"

```json
{"ts":"2026-06-30T18:56:08.520Z","tool":"Write","input":"src/app/page.tsx","verdict":"ask","rule":"hot_path:src/**"}
{"ts":"2026-06-30T18:56:08.795Z","tool":"Bash","input":"npm run build","verdict":"allow","rule":"standing_allow:npm run build"}
{"ts":"2026-06-30T18:56:09.110Z","tool":"Bash","input":"git push --force origin main","verdict":"deny","rule":"hot_command:git push"}
```

---

## Honest scope — this is a backstop, not a sandbox

The hook catches accidents, drift, and hallucinated actions — a large lift in
assurance. It does **not** contain an adversarial or jailbroken agent: shell
command matching can be routed around (`g=push; git $g`), and an agent with real
credentials can still do real damage. Pair enforcement with scoped credentials and
a sandbox for actual isolation. Keel raises the floor; it is not the wall.

## Why both layers

| | Soft layer (skills) | Hard layer (hook) |
|---|---|---|
| **What it is** | The agent applies the four-step check itself | Deterministic code intercepts the call |
| **Strength** | Context-aware, smart, explains itself | Fires regardless of the model's choice |
| **Weakness** | Depends on the model complying | Only catches concrete, pattern-matchable cases |
| **Covers headless?** | No (assumes a human is asked) | Yes (denies when no human present) |

You want both: the skill reasons, the hook backstops. See
[SPEC.md](../SPEC.md) §8.1 for the enforcing-implementation conformance.
