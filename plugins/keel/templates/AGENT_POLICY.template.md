# AGENT_POLICY.md — project configuration for the Keel framework

> Copy this file to the root of YOUR project and fill it in. The Keel skills read
> it to learn *your* specifics: what's hot here, where the source of truth lives,
> and any overrides. The skills ship generic; this file is the only place your
> project's details live. Keep it short and concrete.
>
> Copiá este archivo a la raíz de TU proyecto y completalo. Las skills de Keel lo
> leen para conocer lo específico de tu proyecto. Las skills son genéricas; este
> archivo es el único lugar donde viven tus datos. Mantenelo corto y concreto.

## 1. Hot zones (require explicit L3 approval before any change)

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
four-step test says so; when in doubt, the agent escalates to L3.

## 2. Source-of-truth artifacts

Files that other work derives from. New decisions or interpretive edits to these
require L3; only *mechanical propagation* (deterministic, scope stated by the
decision, cites its source, decision still current) runs without a new L3.

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

Recorded decisions that grant L3 in advance for a defined scope. Each entry must
state its scope explicitly so the agent never has to infer it.

- `[APPROVED <date>]` `<action + exact scope it covers>`
