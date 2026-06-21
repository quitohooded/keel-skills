# Keel Skills — documentation site

The documentation site for Keel Skills, served at **docs.estebanaguilar.me**.

It lives **inside the plugin repo on purpose** (`keel-skills/site/`): the docs
restate the plugin's `SPEC.md`, `README.md`, and `SKILL.md` files, so they must
version together. A change to a skill and its docs is one commit.

Built to match the branding of the personal site
([estebanaguilar.me](https://estebanaguilar.me)): same design tokens, fonts
(Fraunces / Hanken Grotesk / JetBrains Mono), dark-mode-default, and
blueprint-grid aesthetic. English only.

## Stack

- Next.js 15 (App Router) + React 19 + Tailwind 3
- No content framework — pages are TSX using a small set of prose primitives
  (`components/prose.tsx`), so the brand styling is fully under control.
- Design tokens live in `app/globals.css` (kept in sync with the personal site
  by hand — if you change them there, mirror them here).

## Develop

```bash
cd site
npm install
npm run dev      # http://localhost:3000
npm run build    # static build check
```

## Structure

```
app/
  layout.tsx            root: fonts, theme, header, footer
  page.tsx              landing / overview (full-width hero)
  (docs)/
    layout.tsx          sidebar + content shell for all doc pages
    getting-started/
    concepts/{authorization,delegation,context}/
    agent-policy/
    policy-packs/
    reference/
    spec/
    examples/l3-brake/
components/              header, sidebar, prose primitives, AuthDiagram, CodeBlock
lib/nav.ts              the single source of nav order + install commands
```

The L3-brake demo GIF is **not duplicated** — it's imported directly from the
repo's `../assets/keel-demo.gif`, and Next emits a hashed copy at build.

Content is sourced from the repo's `README.md`, `SPEC.md`, the three `SKILL.md`
files, and `examples/l3-brake.md`. When those change, update the matching page.

## Deploy

A **separate Vercel project** with **Root Directory = `site`**, pointed at the
domain `docs.estebanaguilar.me`. Auto-deploys on push to `main` (the plugin's
own validation CI ignores this subdirectory).

MIT · © 2026 Esteban Aguilar
