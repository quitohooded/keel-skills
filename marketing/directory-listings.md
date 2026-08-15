# Directory listings — Keel Skills

Paste-ready submission material for getting Keel Skills listed in the public
Claude Code plugin directories. Every field below is copied from the source of
truth (`.claude-plugin/marketplace.json`, `plugins/keel-skills/.claude-plugin/plugin.json`)
so the listings match the plugin exactly. Just open each link and paste.

> ✅ **Homepage.** `plugin.json` lists `https://docs.estebanaguilar.me` (the docs
> site, live). Use it as-is. The repo URL
> `https://github.com/quitohooded/keel-skills` works as a fallback if any form
> rejects the domain.
>
> ⚠️ **Security scanning note (v0.4.0+).** The pipeline runs automated security
> screening. As of v0.4.0 the plugin ships a `PreToolUse` hook that executes
> `node` on every tool call and writes `.keel/audit.jsonl`. That's expected
> behavior, but be ready to explain it if screening flags the hook. The hook is
> read-only against your repo except for the audit log; it never modifies files.

---

## Canonical fields (reuse everywhere)

| Field | Value |
|-------|-------|
| **Plugin name** | `keel-skills` |
| **Display name** | Keel Skills |
| **Author** | Esteban Aguilar |
| **Repository** | `https://github.com/quitohooded/keel-skills` |
| **Homepage (use this)** | `https://docs.estebanaguilar.me` (repo URL as fallback) |
| **License** | MIT |
| **Version** | 0.6.0 |
| **Category** | Workflow / Development (pick whichever the form offers) |
| **Marketplace add** | `/plugin marketplace add https://github.com/quitohooded/keel-skills` |
| **Install** | `/plugin install keel-skills@keel-skills` |
| **Keywords / tags** | agent, governance, guardrails, authorization, autonomy, delegation, cost-control, context, safety, workflow |

### One-line tagline (≈90 chars)
> Disciplined operations for Claude agents: a permission model, mechanical enforcement, and a session loop.

*(The old tagline said "authorization levels", which is the pre-0.5 vocabulary
that was deliberately renamed to goal / method / green light. Copy written once
and pasted into directories is exactly the kind of text that keeps shipping an
abandoned word for a year — check it against the current README each release.)*

### Short description (≈160 chars)
> Guardrails for autonomous coding agents — a goal/method/green-light permission model the agent both reasons with *and* a hook enforces, plus cost-aware delegation.

### Long description (paste where a fuller blurb is allowed)
> Keel Skills is a portable governance framework for running Claude agents (Claude
> Code, Agent SDK) without breaking things or burning tokens. It works in two
> layers: skills that make the agent *reason* about whether it may act (it sorts
> what looks like permission into a goal, a method, and a green light — only a
> green light means go — with a four-step check before anything that writes,
> pushes, deploys, sends, or deletes), and a `PreToolUse` hook that *enforces* the same rules
> deterministically — stopping a hot action for explicit approval even if the
> model didn't stop itself, and denying it outright in non-interactive runs where
> no human can approve. Plus cost-aware model delegation and file-grounded context
> discipline. The framework ships generic — everything specific to your project
> lives in a single `AGENT_POLICY.md` you control, so it has none of your data
> inside. MIT, with a runtime-neutral open spec (SPEC.md) so it can be
> reimplemented outside Claude Code.

---

## Resubmission content (Console form) — paste-ready

For the https://platform.claude.com/plugins/submit resubmission. English (the form
and marketplace audience are English). Pick the description length that fits the
field; use the example use cases where the form allows a longer blurb.

### Plugin description

**Short (one field, ≈220 chars):**
> Guardrails for autonomous Claude agents. A goal/method/green-light permission
> model the agent reasons with — and a PreToolUse hook enforces — so it handles the
> small, safe things itself but stops and asks before anything risky or permanent.

**Full:**
> Keel Skills is a portable governance framework for running Claude agents (Claude
> Code, Agent SDK) without breaking things or burning tokens.
>
> It works in two layers. First, skills that make the agent *reason* about whether
> it may act: it sorts what looks like permission into a goal ("make it better"), a
> method ("use a migration"), and a green light (a clear yes to this exact thing) —
> only a green light means go — and runs a four-step check before anything that
> writes, pushes, deploys, sends, or deletes. Second, a `PreToolUse` hook that
> *enforces* the same rules deterministically: it stops a hot action for explicit
> approval even if the model didn't stop itself, and denies it outright in
> non-interactive runs (CI, scheduled jobs) where no human is there to approve.
> Every decision is logged to an append-only `.keel/audit.jsonl`.
>
> It also brings cost-aware model delegation (use the cheapest model that preserves
> quality; don't run the top model on mechanical work) and file-grounded context
> discipline (files are the source of truth, not the chat).
>
> The framework ships generic — everything specific to your project lives in a
> single `AGENT_POLICY.md` you control, so the plugin contains none of your data.
> MIT-licensed, with a runtime-neutral open spec (SPEC.md) so the model can be
> reimplemented outside Claude Code.
>
> Honest scope: the enforcement hook is a *backstop, not a sandbox*. It catches
> accidents, drift, and hallucinated actions — a large lift in assurance — but real
> isolation still needs scoped credentials and a sandbox.

### Example use cases

1. **"Clean up the repo and push so the build is green."** A vague instruction that
   *feels* like permission but is really a goal. Without a rule, an agent may delete
   a still-imported file and force-push over a teammate's commit. Keel stops at the
   push, flags the unsafe delete, and proposes a scoped plan instead of acting.

2. **A scheduled / CI agent about to deploy.** Running headless, there's no human to
   approve a hot action. "Stop and ask" goes nowhere — so Keel *denies* the deploy
   outright rather than proceeding unattended, and records why in the audit log.

3. **An agent editing client-facing code or a migration.** Writes to your declared
   hot paths (e.g. `src/**`, `supabase/migrations/**`) are intercepted for a green
   light before they land, while read-only work and non-hot files flow freely.

4. **Keeping model spend sane on a big task.** Delegation guidance routes mechanical
   work (inventories, searches, cleanup) to a cheap model and reserves the top model
   for real planning and cross-cutting decisions — with shallow subagents and no
   self-escalation.

5. **A long session that's lost the plot.** Context discipline pushes the agent to
   treat files as the source of truth and hand off cleanly, so a fresh session can
   resume from the source files instead of a bloated chat history.

6. **A hot command the model *would have* run anyway.** Even if the agent decides a
   `git push`, `rm -rf`, or schema change is fine, the deterministic hook still
   intercepts it — the reasoning layer and the enforcement layer back each other up.

---

## 1. Official Anthropic directory  ·  **recommended, do this first**

Submissions land in the **community marketplace** (`anthropics/claude-plugins-community`)
after automated validation + safety screening. Two forms feed the same pipeline:

- **Console (use this one):** https://platform.claude.com/plugins/submit — for
  individual authors who are **not** part of a Team/Enterprise org. This is the
  right path for Esteban.
- **claude.ai:** https://claude.ai/admin-settings/directory/submissions/plugins/new
  — requires a Team/Enterprise org with directory-management access. Not available
  to a solo account.

Notes on how approval works:
- Approved plugins are pinned to a specific **commit SHA** in the catalog; CI
  bumps the pin automatically as you push new commits to `main`.
- The public catalog **syncs nightly**, so expect a delay between approval and the
  plugin appearing. Check by searching `keel-skills` in
  https://github.com/anthropics/claude-plugins-community/blob/main/.claude-plugin/marketplace.json
- Run `claude plugin validate` locally before submitting (the pipeline runs the
  same check).
- Users install with: `/plugin marketplace add anthropics/claude-plugins-community`
  then `/plugin install keel-skills@claude-community`.

- **What it asks for:** plugin name, description, repo URL, author, category,
  and the source commit. All of that is in the table above.

> ⚠️ **Get the SHA with `git rev-parse origin/main`, not `git rev-parse HEAD`.**
> They are not the same thing whenever the local branch is ahead, and they were
> not the same on 2026-08-14. The catalog pins a commit it can *fetch*; a local
> unpushed SHA fails validation with an error that looks like a broken repo
> rather than a wrong paste.

**Verified state for the 0.6.0 resubmission — 2026-08-14:**

| What | Value |
|---|---|
| `origin/main` SHA to pin | **run the command below** — do not trust a number written here |
| Version in both manifests | `0.6.0` (checked 2026-08-14, they agree) |
| `claude plugin validate .` | ✅ passed 2026-08-14 |
| GitHub Release | [`v0.6.0`](https://github.com/quitohooded/keel-skills/releases/tag/v0.6.0), marked latest |

```
git rev-parse origin/main
```

*This field used to be a literal SHA. It was wrong within an hour, twice: the
commit that pinned it changed `main`, and so did the commit that re-pinned it.
A value that every commit invalidates cannot be maintained by hand — the only
stable thing to write down is how to derive it. The other three rows are safe to
write down because a commit doesn't change them; re-check them at each release.*

- **Source block** (if the form asks for structured source / a commit SHA):

  ```json
  {
    "name": "keel-skills",
    "description": "Disciplined operations for Claude agents: a goal/method/green-light permission model (only a green light means go), cost-aware model delegation, and file-grounded context discipline. Configured per project via an AGENT_POLICY.md you control.",
    "author": { "name": "Esteban Aguilar" },
    "category": "development",
    "source": {
      "source": "github",
      "url": "https://github.com/quitohooded/keel-skills.git",
      "ref": "main",
      "sha": "<paste `git rev-parse origin/main` here>"
    },
    "homepage": "https://docs.estebanaguilar.me"
  }
  ```

  *(`homepage` was `github.com/quitohooded/keel-skills` here while the table
  above said to use the docs site — the two disagreed. Aligned to the docs site
  on 2026-08-14; the repo URL stays the fallback if a form rejects the domain.)*

---

## 2. claudecodecommands.directory  (cc-marketplace community directory)

- **Submit at:** https://claudecodecommands.directory/submit
- **Type:** web form, auto-synced to the listing site.
- Use the canonical fields + short description + tags above.

---

## 3. Directory / aggregator sites (lower effort, optional)

These mostly index from your public marketplace, but several accept a manual
submission to speed things up. Same canonical fields apply.

- **claudemarketplaces.com** — https://claudemarketplaces.com (look for "Submit"
  / "Add marketplace"; point it at the repo URL).
- **claudepluginhub.com** — https://www.claudepluginhub.com
- **aitmpl.com/plugins** — https://www.aitmpl.com/plugins

---

## Suggested order of effort

1. **Official Anthropic form** (#1) — highest-signal placement, do it first.
2. **claudecodecommands.directory** (#2) — quick, broad community reach.
3. The aggregator sites (#3) — only if you want max coverage; low marginal value.
