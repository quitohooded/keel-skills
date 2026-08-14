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

## 7. Checks (optional)

- **Command:** `supabase db diff --schema public` (uncommitted schema drift) plus
  your test suite and type generation check.
- **When:** at the start of a session before any work, and again at the close.
- **Reading it:** a finding on a committed, clean file is real drift and safe to
  fix; one on a modified or untracked file may be in flight elsewhere — report it.
- **Also worth running:** the security advisors, since RLS gaps are the failure
  that stays invisible until it isn't.

## 8. Unattended runs (optional)

Any scheduled job or CI step runs with **no human present**, so no green light
can be given. In particular: **no migration is ever applied by an unattended
run**, not even to a branch — applying schema is the irreversible action this
whole policy is built around. It may diff, lint, generate types, and report.

## 9. Machine-readable block

Read by the `PreToolUse` enforcement hook.

```keel-policy
hot_paths:
  - "supabase/migrations/**"
  - "supabase/config.toml"
  - "supabase/functions/**"
  - "supabase/seed.sql"
  - "**/*.types.ts"
  - ".env*"
hot_commands:
  - "supabase db push"
  - "supabase db reset"
  - "supabase migration up"
  - "supabase functions deploy"
  - "supabase link"
  - "supabase secrets"
  - "psql"
  - "drop table"
  - "drop policy"
  - "truncate"
  - "git push"
hot_mcp:
  - "apply_migration"
  - "execute_sql"
  - "deploy_edge_function"
  - "merge_branch"
  - "delete_branch"
  - "pause_project"
standing_allow_mcp:
  - "list_tables"
  - "list_migrations"
  - "get_advisors"
  - "generate_typescript_types"
```

> `execute_sql` is hot even though it is often used read-only: the tool name
> cannot tell a `SELECT` from a `DELETE`, and this is the one place where being
> wrong is unrecoverable. The read-only MCP tools are allowed by name instead,
> which is the narrow, recorded way to open that valve.
>
> Migration files are listed as hot paths *and* the apply commands are hot
> separately — writing a migration and running it are two different decisions,
> and only the second one is irreversible.
