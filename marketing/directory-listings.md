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
| **Version** | 0.4.0 |
| **Category** | Workflow / Development (pick whichever the form offers) |
| **Marketplace add** | `/plugin marketplace add https://github.com/quitohooded/keel-skills` |
| **Install** | `/plugin install keel-skills@keel-skills` |
| **Keywords / tags** | agent, governance, guardrails, authorization, autonomy, delegation, cost-control, context, safety, workflow |

### One-line tagline (≈90 chars)
> Disciplined operations for Claude agents: authorization levels, cost-aware delegation, file-grounded context.

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
- **Source block** (if the form asks for structured source / a commit SHA, the
  current `main` HEAD is what they pin — get it with `git rev-parse HEAD` in the
  repo and paste it as the `sha`):

  ```json
  {
    "name": "keel-skills",
    "description": "Disciplined operations for Claude agents: a three-level authorization model, cost-aware model delegation, and file-grounded context discipline. Configured per project via an AGENT_POLICY.md you control.",
    "author": { "name": "Esteban Aguilar" },
    "category": "development",
    "source": {
      "source": "github",
      "url": "https://github.com/quitohooded/keel-skills.git",
      "ref": "main"
    },
    "homepage": "https://github.com/quitohooded/keel-skills"
  }
  ```

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
