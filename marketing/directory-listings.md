# Directory listings — Keel Skills

Paste-ready submission material for getting Keel Skills listed in the public
Claude Code plugin directories. Every field below is copied from the source of
truth (`.claude-plugin/marketplace.json`, `plugins/keel-skills/.claude-plugin/plugin.json`)
so the listings match the plugin exactly. Just open each link and paste.

> ⚠️ **Homepage heads-up.** `plugin.json` lists the homepage as
> `https://estebanaguilar.com.ar`, which doesn't resolve yet (the site is live at
> `https://estebanaguilar.vercel.app`). When a form asks for a homepage/website,
> use **`https://github.com/quitohooded/keel-skills`** (always works) or the
> Vercel URL — not the `.com.ar` until the domain is pointed.

---

## Canonical fields (reuse everywhere)

| Field | Value |
|-------|-------|
| **Plugin name** | `keel-skills` |
| **Display name** | Keel Skills |
| **Author** | Esteban Aguilar |
| **Repository** | `https://github.com/quitohooded/keel-skills` |
| **Homepage (use this)** | `https://github.com/quitohooded/keel-skills` |
| **License** | MIT |
| **Version** | 0.3.0 |
| **Category** | Workflow / Development (pick whichever the form offers) |
| **Marketplace add** | `/plugin marketplace add https://github.com/quitohooded/keel-skills` |
| **Install** | `/plugin install keel-skills@keel-skills` |
| **Keywords / tags** | agent, governance, guardrails, authorization, autonomy, delegation, cost-control, context, safety, workflow |

### One-line tagline (≈90 chars)
> Disciplined operations for Claude agents: authorization levels, cost-aware delegation, file-grounded context.

### Short description (≈160 chars)
> Guardrails for autonomous coding agents — a three-level authorization model, cost-aware model delegation, and file-as-source-of-truth context discipline.

### Long description (paste where a fuller blurb is allowed)
> Keel Skills is a portable governance framework for running Claude agents (Claude
> Code, Agent SDK) without breaking things or burning tokens. It gives an agent
> three skills, one command, and a session-start hook: a three-level authorization
> model (broad mandate / mechanism / explicit scoped approval) with a four-step
> test the agent runs before anything that writes, pushes, deploys, sends, or
> deletes; cost-aware model delegation; and file-grounded context discipline. The
> framework ships generic — everything specific to your project lives in a single
> `AGENT_POLICY.md` you control, so it has none of your data inside. MIT, with a
> runtime-neutral open spec (SPEC.md) so it can be reimplemented outside Claude Code.

---

## 1. Official Anthropic directory  ·  **recommended, do this first**

- **Submit at:** https://clau.de/plugin-directory-submission
- **Type:** web form (reviewed for quality + security before it appears in
  `/external_plugins`).
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
