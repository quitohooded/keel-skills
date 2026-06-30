# Example: the hard brake (enforcement hook)

[`l3-brake.md`](l3-brake.md) shows the **soft** brake — the agent *reasoning* its
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
L3 event.

**The agent tries to read a file** → free, never interrupts.
```json
in : { "tool_name": "Read", "tool_input": { "file_path": "src/x.ts" } }
out: { "permissionDecision": "allow", "reason": "keel: read-only tool" }
```

**The agent tries to push** → hot, stops for approval.
```json
in : { "tool_name": "Bash", "tool_input": { "command": "git push origin main" } }
out: { "permissionDecision": "ask",
       "reason": "keel: needs explicit approval (L3) — command matches hot pattern `git push`" }
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
       "reason": "keel: needs explicit approval (L3) — writes to hot path `src/app/page.tsx` (matches `src/**`)" }
```

---

## The part the soft layer can't do: no human, no pass

Run the same push in a **non-interactive** context (CI, a headless agent, a
scheduled job — `KEEL_NONINTERACTIVE=1` or `CI`). There's no one to grant L3, so
`ask` can't be answered. The hook **denies** outright:

```json
in : { "tool_name": "Bash", "tool_input": { "command": "git push --force origin main" } }
out: { "permissionDecision": "deny",
       "reason": "keel: BLOCKED (no human present to grant L3) — command matches hot pattern `git push`" }
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
| **What it is** | The agent applies the four-step test itself | Deterministic code intercepts the call |
| **Strength** | Context-aware, smart, explains itself | Fires regardless of the model's choice |
| **Weakness** | Depends on the model complying | Only catches concrete, pattern-matchable cases |
| **Covers headless?** | No (assumes a human is asked) | Yes (denies when no human present) |

You want both: the skill reasons, the hook backstops. See
[SPEC.md](../SPEC.md) §8.1 for the enforcing-implementation conformance.
