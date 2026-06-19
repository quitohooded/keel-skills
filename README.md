# Keel Skills — disciplined operations for Claude agents

> *Read this in [Spanish / Español](README.es.md).*

> A portable governance framework for running Claude agents (Claude Code, Agent
> SDK) without breaking things or burning tokens. Three skills + one command +
> one hook — install, configure per project, done.
>
> **Keel Skills is [Esteban Aguilar](#author)'s agent-governance methodology**,
> distilled from operating agents in production every day — not from theory.

A keel is the part of a ship you never see, the one that keeps everything stable
and on course. That's what this plugin does to an agent: it lets it move fast on
the safe stuff and **stops it cold before the irreversible**.

## The problem it solves

An autonomous agent is useful right up until it touches production, overwrites
something already published, runs a `push`/deploy that wasn't its call, or burns
your token budget running the most expensive model on a mechanical task. Most
teams have **no explicit rule** for when the agent may act alone and when it must
stop and ask. Keel Skills is that rule, already written.

You usually discover you needed it the day *after* the bad push. The point of
Keel Skills is to have it in place before that day.

## What's inside

Three skills (they trigger themselves when the situation calls for it), one
command, and one hook:

| Component | What it does |
|-----------|--------------|
| **`authorization-protocol`** skill | Decides whether the agent may execute or must ask for approval. Three-level model (broad mandate / mechanism / explicit scoped approval), four-step test, hot zones, mechanical-propagation rule. |
| **`model-delegation`** skill | Pick the cheapest model that still preserves quality and risk control. Tiers by task type, max subagent depth, no self-escalation, cheapest-first tool ladder. |
| **`context-discipline`** skill | Keep the session anchored in files, not chat. When to end a long session, what to record, how to leave a resumable handoff. |
| **`/keel-skills:policy-init`** command | Generates your project's `AGENT_POLICY.md` by interviewing you about your hot zones and sources of truth. |
| **`SessionStart` hook** | If your project has an `AGENT_POLICY.md`, it's injected into context at the start of every session — so the policy no longer depends on the agent *remembering* to read it. |

## The authorization model, at a glance

The core of Keel Skills: a four-step test that decides, before any action that
writes or changes something, whether the agent can act alone or must stop and ask
for explicit approval (L3).

![Keel Skills authorization model: four-step test](assets/authorization-flow.svg)

> Read-only and proposals are free. Anything **hot, outward, irreversible, or
> structural** is L3. When in doubt, it's L3.

The model is specified runtime-neutral in **[SPEC.md](SPEC.md)** so it can be
cited and reimplemented outside Claude Code.

## The key separation: mechanism vs. your data

The skills are **generic**: they describe the *pattern* (what a hot zone is, what
mechanical propagation means, how a model gets chosen). Everything specific to
your project — which paths are hot, where your source of truth lives, what counts
as a release — lives in a single file you control: **`AGENT_POLICY.md`** at your
project root.

The result: the framework ships clean, with none of your company's data inside,
and each user configures it for their own work. The template is in
[`plugins/keel-skills/templates/AGENT_POLICY.template.md`](plugins/keel-skills/templates/AGENT_POLICY.template.md),
and ready-made packs for common stacks live in [`policies/`](policies/).

## Install

Keel Skills ships as a single-plugin marketplace.

```text
# In Claude Code:
/plugin marketplace add https://github.com/quitohooded/keel-skills
/plugin install keel-skills@keel-skills
```

Then, in your project:

```text
/keel-skills:policy-init
```

to generate the `AGENT_POLICY.md`. See [DISTRIBUTION.md](DISTRIBUTION.md) for the
publishing paths (git repo, local path, or package).

## See it in 60 seconds

A concrete before/after of the L3 brake — the agent about to force-push a
"cleanup", and Keel stopping it — is in
[`examples/l3-brake.md`](examples/l3-brake.md). The recordable demo script is in
[`examples/demo-script.md`](examples/demo-script.md).

## How to use it, in one line

> Read-only and proposals are free. Anything hot, outward-facing, irreversible or
> structural needs explicit approval. When in doubt, ask. Cheapest model that does
> the job; shallow delegation; lightest tool first.

## Author

Created by **Esteban Aguilar** — [estebanaguilar.com.ar](https://estebanaguilar.com.ar)
· [github.com/quitohooded](https://github.com/quitohooded). Keel Skills distills
the judgment I use to operate agents in real work: when an agent can act alone and
when it has to stop, which model to assign to each task, and how to keep a session
anchored in files. If it helps you, tell me what you applied it to.

## Contributing

Policy packs for new stacks and implementations for other runtimes are very
welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

**MIT.** Use it, fork it, build on it, including in commercial work. Keeping the
copyright notice is all MIT requires; a visible credit to *Keel Skills by Esteban
Aguilar* is the norm we ask you to follow (see [NOTICE](NOTICE)). © 2026 Esteban
Aguilar.
