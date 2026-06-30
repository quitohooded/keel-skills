# AGENT_POLICY.md — project configuration for the Keel Skills framework

> Copy this file to the root of YOUR project and fill it in. The Keel Skills skills read
> it to learn *your* specifics: what's hot here, where the source of truth lives,
> and any overrides. The skills ship generic; this file is the only place your
> project's details live. Keep it short and concrete.
>
> Copiá este archivo a la raíz de TU proyecto y completalo. Las skills de Keel Skills lo
> leen para conocer lo específico de tu proyecto. Las skills son genéricas; este
> archivo es el único lugar donde viven tus datos. Mantenelo corto y concreto.

## 1. Hot zones (need a clear yes — a green light — before any change)

List the paths, surfaces, and actions where a mistake is expensive or hard to
undo. Be specific — vague hot zones get ignored.

- **Client/external-facing surfaces:**
  - `<e.g. src/pages, content/, public API routes>`
- **Production / data / infra:**
  - `<e.g. database, schema/migrations, settings, CI/CD, deploy config, hooks>`
- **Outward / irreversible actions:**
  - `<e.g. git push, deploy, sending email, charging, deleting data>`
- **Anything else this project treats as hot:**
  - `<...>`

Everything not listed here is treated as potentially hot **only** when the
four-step check says so; when in doubt, the agent stops and asks for a green light.

## 2. Source-of-truth files

Files that other work depends on. New decisions or meaning-changing edits to these
need a green light; only *following through* on an already-approved decision (no
judgment needed, scope stated by the decision, points back to its source, decision
still current) runs without a new green light.

- `<e.g. docs/decisions.md, the canonical spec, the master copy doc>`

## 3. Where state and decisions get recorded

When a session reaches a decision or a new verified state, write it here:

- **Decisions log:** `<path>`
- **Project state / status file:** `<path>`
- **Per-task notes:** `<path or convention>`

## 4. Model tier overrides (optional)

Keep the defaults from the `model-delegation` skill unless you have a reason.
Note any project-specific overrides here.

- Mechanical work → `<default: cheapest tier>`
- Research / synthesis → `<default: mid tier>`
- Planning / architecture / cross-cutting → `<default: top tier>`
- Overrides: `<...>`

## 5. Definitions for this project (optional)

Pin down anything ambiguous so the agent doesn't have to guess:

- "Reversible" here means: `<...>`
- "Internal" here means: `<...>`
- A "release" here means: `<...>`

## 6. Standing approvals (optional)

Written decisions that give a green light in advance for a defined scope. Each entry
must state its scope explicitly so the agent never has to guess it.

- `[APPROVED <date>]` `<action + exact scope it covers>`

## 7. Machine-readable block (optional — powers the enforcement hook)

The prose above is for the agent to *reason* with. The `PreToolUse` enforcement
hook (`enforce-policy.cjs`) is deterministic code, so it reads a concrete,
machine-readable subset from a fenced ` ```keel-policy ` block. Keep the two in
sync. Flat lists only (no nesting). Anything not listed here still falls under the
agent's four-step check; this block just adds a *hard* backstop for the concrete
cases. See `SPEC.md` §7 for the format.

```keel-policy
hot_paths:
  - "src/**"
  - "supabase/migrations/**"
hot_commands:
  - "git push"
  - "vercel deploy"
standing_allow_commands:
  - "npm run build"
standing_allow_paths:
  - "_borradores/**"
```

> The hook ships with SPEC §4 defaults (`git push`, deploy, `rm -rf`, schema
> changes, outward MCP calls) already hot, so it protects you even with no block
> at all. This block *refines* — it never removes a default category. In a
> non-interactive run (CI, `KEEL_NONINTERACTIVE=1`) a hot action that would prompt
> for approval is denied instead, since no human is present to give a green light.
