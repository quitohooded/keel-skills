# AGENT_POLICY.md — Next.js / Astro / SvelteKit on Vercel

> Pack for a JS/TS web app deployed on Vercel (or similar PaaS). Copy to your repo
> root as `AGENT_POLICY.md` and adjust paths. Delete what doesn't apply.

## 1. Hot zones (require explicit L3 approval before any change)

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

Everything not listed is hot **only** when the four-step test says so; under doubt, L3.

## 2. Source-of-truth artifacts

- `lib/content.*` or wherever canonical copy lives
- the decisions log (below)
- `package.json` dependencies/scripts (interpretive edits → L3)

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
