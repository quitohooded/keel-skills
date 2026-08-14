# AGENT_POLICY.md — Next.js / Astro / SvelteKit on Vercel

> Pack for a JS/TS web app deployed on Vercel (or similar PaaS). Copy to your repo
> root as `AGENT_POLICY.md` and adjust paths. Delete what doesn't apply.

## 1. Hot zones (need a green light before any change)

- **Client/external-facing surfaces:**
  - `src/app/**`, `src/pages/**`, `app/**`, `pages/**` — rendered routes
  - `src/components/**` that ship to users
  - `content/**`, `lib/content.*` — published copy
  - `public/**` — assets served as-is
  - `src/app/api/**`, `app/api/**` — public API routes
- **Production / data / infra:**
  - `.env*`, environment variables, Vercel project settings
  - `next.config.*`, `astro.config.*`, `svelte.config.*`, `vercel.json`
  - `.github/workflows/**`, any CI/CD config
  - `middleware.ts` — runs on every request
- **Outward / irreversible actions:**
  - `git push`, `vercel deploy` / `vercel --prod`, promoting a preview to production
  - sending email, charging money, deleting data
- **Promoting a draft to a decision** — `[APPROVED]` / `[CONFIRMED]`.

Everything not listed is hot **only** when the four-step check says so; under doubt, ask.

## 2. Source-of-truth files

- `lib/content.*` or wherever canonical copy lives
- the decisions log (below)
- `package.json` dependencies/scripts (meaning-changing edits → green light)

## 3. Where state and decisions get recorded

- **Decisions log:** `<docs/decisions.md>`
- **Project state / status file:** `<STATUS.md>`
- **Per-task notes:** `<PR description or a per-task note>`

## 4. Model tier overrides (optional)

- Mechanical (rename, move files, format) → cheapest tier
- Component/code exploration, copy drafting → mid tier
- Architecture, routing/data-flow changes, cross-cutting refactors → top tier

## 5. Definitions for this project (optional)

- "Reversible" here means: revertible via git with no deploy/publish side effect.
- "Internal" here means: stays in a preview/branch, never promoted to production.
- A "release" here means: a production deploy on Vercel.

## 6. Standing approvals (optional)

- `[APPROVED <date>]` `<e.g. "agent may run the local dev server and tests freely">`

## 7. Checks (optional)

- **Command:** `npm run lint && npx tsc --noEmit && npm run build`
- **When:** at the start of a session before any work, and again at the close.
  A build that only breaks at deploy time is drift that survived a session.
- **Reading it:** a finding on a committed, clean file is real drift and safe to
  fix; one on a modified or untracked file may be another session's work in
  flight — report it rather than fixing it.

## 8. Unattended runs (optional)

CI and any scheduled job run with **no human present**, so no green light can be
given: read, report, stop. Notably, **a preview deploy is still a deploy** — if
a job can promote to production, it is outside what an unattended run may do.

## 9. Machine-readable block

Read by the `PreToolUse` enforcement hook.

```keel-policy
hot_paths:
  - "app/**"
  - "src/**"
  - "content/**"
  - "public/**"
  - "middleware.ts"
  - "next.config.*"
  - "vercel.json"
  - ".env*"
  - ".github/workflows/**"
hot_commands:
  - "git push"
  - "git reset --hard"
  - "vercel deploy"
  - "vercel --prod"
  - "vercel promote"
  - "vercel env"
standing_allow_commands:
  - "npm run dev"
  - "npm run build"
  - "npm run lint"
  - "npm test"
  - "npx tsc --noEmit"
  - "npm ci"
```

> `next.config.*` and `middleware.ts` are hot because they change behaviour for
> every route at once — the blast radius is the whole site, not one page. `.env*`
> is hot even though it is usually gitignored: the hook sees the write attempt
> either way.
