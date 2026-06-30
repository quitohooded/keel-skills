# AGENT_POLICY.md — Supabase / Postgres backend

> Pack for a project backed by Supabase (Postgres + Auth + RLS + edge functions).
> Copy to your repo root as `AGENT_POLICY.md` and adjust paths. The database is the
> sharpest hot zone here — treat schema and RLS with extra care.

## 1. Hot zones (need a green light before any change)

- **Production / data / infra (sharpest here):**
  - `supabase/migrations/**` — schema changes
  - **Row Level Security (RLS) policies** — a wrong policy leaks or locks data
  - `supabase/functions/**` — edge functions
  - `supabase/config.toml`, project settings, secrets, service-role keys
  - **Any direct SQL** that writes, alters schema, or changes grants/policies
  - Running migrations against a **remote/production** project
- **Client/external-facing surfaces:**
  - the app code that reads/writes user data
  - public API routes / RPC exposed to clients
- **Outward / irreversible actions:**
  - `git push`, deploy, `supabase db push`, applying a migration remotely,
    deleting rows/tables, rotating keys, sending email, charging money
- **Promoting a draft to a decision** — `[APPROVED]` / `[CONFIRMED]`.

Everything not listed is hot **only** when the four-step check says so; under doubt, ask.
**Prefer local/branch databases and test before touching a remote project.**

## 2. Source-of-truth artifacts

- `supabase/migrations/**` — the schema's history; never rewrite, only add
- generated DB types (`*.types.ts`) — regenerate, don't hand-edit interpretively
- the decisions log (below)

## 3. Where state and decisions get recorded

- **Decisions log:** `<docs/decisions.md>`
- **Project state / status file:** `<STATUS.md>`
- **Per-task notes:** `<convention>`

## 4. Model tier overrides (optional)

- Mechanical (list tables, inventory columns, regenerate types) → cheapest tier
- Query writing, diagnosis from logs/advisors → mid tier
- Schema design, RLS design, data-model or migration strategy → top tier

## 5. Definitions for this project (optional)

- "Reversible" here means: a local/branch DB change with a down-migration; a
  remote schema change is **not** reversible for this policy's purposes.
- "Internal" here means: local stack or a Supabase branch, never the production project.
- A "release" here means: a migration applied to the production project.

## 6. Standing approvals (optional)

- `[APPROVED <date>]` `<e.g. "agent may run read-only queries and list_* tools against the linked project">`
