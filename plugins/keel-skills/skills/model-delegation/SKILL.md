---
name: model-delegation
description: >-
  Choose the cheapest model and delegation strategy that still preserves quality,
  judgment, and risk control when running agents or subagents. Use when deciding
  which model to assign to a task, whether to spawn a subagent, how deeply to nest
  agents, or which tool to reach for first. Covers model tiering (mechanical vs
  research vs planning work), subagent depth limits, no-self-escalation rules, a
  cheapest-first tool ladder, and when to turn a repeated pattern into a reusable
  script. Triggers on: which model should I use, model selection, delegate this,
  spawn a subagent, agent depth, cost control, token budget, tool choice,
  Haiku vs Sonnet vs Opus.
---

# Model & Delegation Discipline

Run agents the way you'd run a team: assign the **cheapest worker who can do the
job well**, keep the org chart shallow, and don't let anyone quietly promote
themselves to a harder problem. This protects both cost and quality — an
over-powered model on a trivial task wastes money; an under-powered one on a
judgment task produces confident garbage.

## Pick the cheapest model that preserves quality, judgment, and risk

Match the model tier to the *kind of thinking* the task needs, not to how
important the task feels.

- **Cheapest / fastest tier (e.g. Haiku)** — mechanical work with no strong
  judgment: inventories, searches, counts, simple extraction, direct
  comparisons, repetitive cleanup, format conversions.
- **Mid tier (e.g. Sonnet)** — research, code exploration, reading repos,
  diagnosis, synthesis, judgment-bearing writing, and tasks that combine several
  sources.
- **Top tier (e.g. Opus)** — only for real planning, conflicts between sources,
  complex trade-offs, architecture, product decisions, or cross-cutting changes
  with real impact.

Default downward. Reach for the top tier only when the task genuinely has the
shape that tier is for. If you're unsure whether a task needs the higher tier, it
usually doesn't — but a task that mixes mechanical and judgment work should be
*split*, not promoted wholesale.

> Projects may override these tier mappings in `AGENT_POLICY.md`. Read it if
> present before assigning models.

## Delegation limits

- **The cheapest tier never spawns its own subagents.** If a mechanical task
  needs to delegate, the task was scoped wrong — return it to the parent.
- **Maximum depth: 2 levels** (`parent → subagent → one more`). Deeper nesting
  loses context and accountability faster than it buys parallelism.
- **No self-escalation.** If a subagent decides it needs a smarter model, it does
  **not** upgrade itself — it returns to the parent with what it found and why a
  stronger model is warranted. The parent decides.
- **A subagent cannot approve, confirm, or do anything risky in a hot zone.** The
  green light always comes back to the human (or the parent acting under a human's
  green light). See the `authorization-protocol` skill.
- **Delegation does not replace reading the source.** A summary from a subagent is
  an input, not the ground truth. Validate against the real files before acting.

## The tool ladder (cheapest capable option first)

Reach for the lightest tool that can do the job well, and only climb when it
genuinely can't:

- **Simple public pages** → a plain fetch.
- **Dynamic pages, pages behind a login, or pages needing interaction** → a
  browser-driving tool.
- **PDFs** → extract the text first. Use a heavy visual/layout tool only when the
  layout itself carries meaning.
- **Local repos** → prefer fast search (`rg`/grep), per-folder inventories, and
  selective reads *before* loading large amounts of context. Don't pull a whole
  tree into context when a search answers the question.

## Encapsulate repetition

If the same pattern shows up several times — the same multi-step lookup, the same
cleanup, the same report — stop repeating it by hand and burning context. Turn it
into a **reusable tool, script, or documented procedure**, then call that. Manual
repetition is both a cost leak and an error source.

## How to apply this in one line

> Cheapest model that can do it well; shallow delegation (max depth 2, no
> self-escalation, no subagent approvals); lightest tool first; script anything
> you do more than a couple of times.
