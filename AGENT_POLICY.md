# AGENT_POLICY.md — Keel Skills itself

> Keel Skills runs on Keel Skills. A governance framework without its own policy
> is a diet book by someone who doesn't cook, so this file is both the real
> configuration for this repo and the worked example the docs point at.
>
> Format: [`SPEC.md`](SPEC.md) §7 · targets **spec 0.3**.

## 1. Hot zones (need a green light before any change)

- **What users install** — a bug here ships to every install:
  - `plugins/keel-skills/**` — skills, commands, hooks, templates
  - `.claude-plugin/marketplace.json`, `plugins/keel-skills/.claude-plugin/plugin.json`
- **Published surfaces:**
  - `site/**` — the docs site, deployed on merge
  - `README.md`, `README.es.md` — the first thing anyone reads
- **The standard others implement against:**
  - `SPEC.md` — third parties may already be building on it; a silent change
    breaks them with no signal
- **Infra:** `.github/workflows/**`
- **Outward / irreversible:** `git push`, deploy, publishing a release, `npm publish`.
- **This repo is public.** That makes changes hot that would be routine in a
  private one: anything committed is permanent for everyone who has cloned it,
  and "revert it" is not the same as "it never happened".

## 2. Source-of-truth files

New decisions or meaning-changing edits need a green light; only *following
through* (no judgment needed, scope stated by the decision, points back to it,
decision still current) runs without one.

- `SPEC.md` — the model. Everything else is downstream of it, including the
  hook: if the two disagree, **the spec is right and the code is a bug.**
- `plugins/keel-skills/templates/AGENT_POLICY.template.md` — the canonical
  template; the packs in `policies/` are derived from it and must not drift.
- `STRATEGY.md` — why the repo is shaped the way it is, and what comes next.

## 3. Where state and decisions get recorded

- **History:** `CHANGELOG.md` — one entry per release, newest first.
- **State / roadmap:** `STRATEGY.md` — what's decided, what's next, and what
  only a human can do.
- **Decisions:** in `CHANGELOG.md` with the release that carried them; the
  reasoning goes in the file it is about (the spec, the skill, the hook comment),
  not in the changelog entry.

## 4. Model tier overrides

Defaults from the `model-delegation` skill apply. Two notes specific here:

- **Skill and spec wording is planning work**, not copy-editing. These files are
  read by models as instructions; an imprecise sentence becomes wrong behaviour
  at scale.
- Version bumps, link checks and inventories are mechanical: cheapest tier.

## 5. Definitions for this project

- **"Reversible"** = revertible in git *and not yet pushed*. Once it is on the
  public remote it is not reversible in the sense this framework means.
- **"Internal"** = not in `plugins/`, not in `site/`, not in a README. In a
  public repo that is a short list.
- **"A release"** = version bumped in both manifests + a `CHANGELOG.md` entry +
  a git tag. All three, or it is not a release.
- **"Done"** = the test suites pass and the site builds. Not "the diff looks right".

## 6. Standing approvals

- `[APPROVED 2026-06-30]` Run the test suites and the site build at any time.
  Read-only with respect to the repo.
- `[APPROVED 2026-08-14]` Write to `plugins/keel-skills/templates/checks/` while
  developing checks, provided the test bank passes before the change is offered
  for commit. Scope: those two files only.

> Everything else — commit, push, tag, deploy, release — is hot and needs an
> explicit green light each time. **Notably: this repo does not have a standing
> approval for `git commit`,** even though the template calls that out as the
> designed pressure valve. In a public repo the commit is the last cheap moment
> to catch something, so the friction is deliberate.

## 7. Checks

- **Commands:**
  ```
  node plugins/keel-skills/hooks/enforce-policy.test.cjs
  python plugins/keel-skills/templates/checks/test_keel_checks.py
  cd site && npm run build
  ```
- **When:** the two test suites before any commit that touches `plugins/`; the
  site build before any commit that touches `site/`.
- **Reading it:** the suites are pass/fail, not three-level — they test code, and
  code doesn't have half-finished states the way documents do. A failure is a
  failure.

## 8. Unattended runs

CI (`.github/workflows/validate.yml`) runs on every push and pull request.

- It is **read-only** with respect to the repo: it validates and reports, and
  never writes back.
- The enforcement hook detects CI and degrades every `ask` to `deny` — there is
  no human in a CI run, so no green light exists to be given (SPEC §6.1). The
  hook's own test suite explicitly strips the ambient `CI` variable so it can
  test both behaviours; that is the one place the distinction is deliberately
  neutralised, and it is neutralised in the *test*, never in the hook.

## 9. Machine-readable block

```keel-policy
hot_paths:
  - "plugins/**"
  - "site/**"
  - "SPEC.md"
  - "README.md"
  - "README.es.md"
  - ".github/workflows/**"
  - ".claude-plugin/**"
hot_commands:
  - "git push"
  - "git tag"
  - "npm publish"
  - "vercel"
  - "gh release"
standing_allow_commands:
  - "node plugins/keel-skills/hooks/enforce-policy.test.cjs"
  - "python plugins/keel-skills/templates/checks/test_keel_checks.py"
  - "npm run build"
  - "npm ci"
standing_allow_paths:
  - "plugins/keel-skills/templates/checks/**"
```

> `hot_paths` includes `plugins/**`, which is most of this repo — that is
> correct and not an oversight. Nearly every file here either ships to users or
> is read by them. The pressure valve is the standing allowance on
> `templates/checks/**`, which is the one place active development happens
> without shipping a behaviour change.
>
> `standing_allow_commands` lists the test commands in full rather than as
> `node` or `python`, because a bare interpreter name would clear **any** script
> — including one that pushes.
