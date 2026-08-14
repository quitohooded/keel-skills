# AGENT_POLICY.md — generic web app with deploy

> Baseline pack for any web app that has a build, a deploy, and a client-facing
> surface. Copy to your repo root as `AGENT_POLICY.md` and replace the angle-bracket
> paths with your real ones. Delete what doesn't apply. Keep it short and concrete.

## 1. Hot zones (need a green light before any change)

- **Client/external-facing surfaces:**
  - `<src/ or app/ — anything rendered to users>`
  - `<content/, copy, marketing pages>`
  - `<public API routes>`
- **Production / data / infra:**
  - `<environment variables / secrets>`
  - `<build & deploy config (CI workflow files, deploy config)>`
  - `<any database or migration>`
- **Outward / irreversible actions:**
  - `git push`, deploy / publish, sending email, charging money, deleting data
- **Promoting a draft to a decision** — marking anything `[APPROVED]` / `[CONFIRMED]`.

Everything not listed is hot **only** when the four-step check says so; under doubt, ask.

## 2. Source-of-truth files

Files other work depends on — new decisions or meaning-changing edits need a green
light; only following through (no judgment needed, scope stated, points back to its
source, still current) runs without a new green light.

- `<the canonical spec / master copy doc>`
- `<the decisions log (below)>`

## 3. Where state and decisions get recorded

- **Decisions log:** `<docs/decisions.md>`
- **Project state / status file:** `<STATUS.md or equivalent>`
- **Per-task notes:** `<convention, e.g. a per-task file or PR description>`

## 4. Model tier overrides (optional)

Defaults from the `model-delegation` skill apply unless overridden here.

- Mechanical work → cheapest tier
- Research / synthesis → mid tier
- Planning / architecture / cross-cutting → top tier

## 5. Definitions for this project (optional)

- "Reversible" here means: revertible via version control with no external effect.
- "Internal" here means: never reaches a deployed/published surface.
- A "release" here means: `<a deploy to production / a published build>`.

## 6. Standing approvals (optional)

- `[APPROVED <date>]` `<action + exact scope it covers>`

## 7. Checks (optional)

- **Command:** `<npm test && npm run build — or your project's equivalent>`
- **When:** at the start of a session, before any work, and again at the close.
- **Reading it:** a finding on a committed, clean file is real drift and safe to
  fix; a finding on a modified or untracked file may belong to another session —
  report it rather than fixing it.

## 8. Unattended runs (optional)

Anything scheduled or in CI runs with **no human present**, so no green light can
be given: it reads, reports, and stops. No commit, push, deploy or send; nothing
deleted by inference; nothing "fixed". Write these limits into the job's own
prompt — each run starts with no memory of any conversation.

## 9. Machine-readable block

Read by the `PreToolUse` enforcement hook. **Replace the angle-bracket entries
with real paths before relying on it** — a placeholder matches nothing.

```keel-policy
hot_paths:
  - "src/**"
  - "app/**"
  - "content/**"
  - "public/**"
  - ".github/workflows/**"
hot_commands:
  - "git push"
  - "git reset --hard"
  - "deploy"
  - "npm publish"
standing_allow_commands:
  - "npm run build"
  - "npm test"
  - "npm ci"
```

> These refine the SPEC §4 defaults; they never remove a category. `git commit`
> stays gated by default — add it to `standing_allow_commands` if that friction
> doesn't fit your workflow, as an explicit recorded choice. A standing
> allowance clears only the command it matches, never what it is chained to.
