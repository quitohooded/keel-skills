# Keel Skills — disciplined operations for Claude agents

> *Read this in [Spanish / Español](README.es.md).*

> A portable governance framework for running Claude agents (Claude Code, Agent
> SDK) without breaking things or burning tokens. Five skills, six commands and
> two hooks — install, run `/keel-skills:onboard`, done.
>
> **Keel Skills is [Esteban Aguilar](#author)'s agent-governance methodology**,
> distilled from operating agents in production every day — not from theory.

A keel is the part of a ship you never see, the one that keeps everything stable
and on course. That's what this plugin does to an agent: it lets it move fast on
the safe stuff and **stops it cold before the irreversible**.

![Keel Skills stopping an agent that was told to "clean up and push": it runs the four-step check, stops at the risky zone, and proposes a scoped plan instead](assets/keel-demo.gif)

*The agent got "clean it up and push." Without a rule it just does it — delete,
force-push, done. With Keel it hits a risky zone, stops, and proposes a scoped plan,
flagging the unsafe delete. ([full walkthrough](examples/green-light-brake.md))*

> **In plain words.** AI assistants that write code can now act on their own — and
> sometimes they do something you can't undo, like permanently deleting work or
> publishing a change to the live system before anyone checked it. Keel Skills is a
> set of house rules: it lets the assistant handle the small, safe things by itself,
> but makes it **stop and ask you first** before anything risky or permanent. You
> stay in control without having to watch every step.

## The problem it solves

An autonomous agent is useful right up until it touches production, overwrites
something already published, runs a `push`/deploy that wasn't its call, or burns
your token budget running the most expensive model on a mechanical task. Most
teams have **no explicit rule** for when the agent may act alone and when it must
stop and ask. Keel Skills is that rule, already written.

You usually discover you needed it the day *after* the bad push. The point of
Keel Skills is to have it in place before that day.

## What's inside

Skills trigger themselves when the situation calls for it. Commands are things
you run. Hooks run automatically, and one of them can stop a tool call outright.

| Component | What it does |
|-----------|--------------|
| **`authorization-protocol`** skill | Decides whether the agent may act or must stop and ask. Sorts what looks like permission into three things — a goal, a method, and a green light (only a green light means go) — with a four-step check, risky "hot" zones, a rule for following through on a green light you already have, and the rule for unattended runs. |
| **`model-delegation`** skill | Pick the cheapest model that still preserves quality and risk control. Tiers by task type, max subagent depth, no self-escalation, cheapest-first tool ladder. |
| **`context-discipline`** skill | Keep the session anchored in files, not chat. The two ends of a session, when to end a long one, what to record, how to leave a resumable handoff. |
| **`workspace-hygiene`** skill *(0.6)* | Keep documents and state from aging into lies, and catch the drift anyway. State vs. history and when to cut, why a bootstrap carries no state, checks that each exist because something already broke, and what an unattended sweep may never do. |
| **`repeatable-work`** skill *(0.6)* | Turn work you've done three times into a script instead of habit. What an agent-run tool must be, test banks with a case that *must* fail, and the capture → harvest → adopt loop. |
| **`/keel-skills:onboard`** command *(0.6)* | **Start here.** The initiation program: it looks at what's actually in your directory — repo or not, one project or several, existing agent docs, or nothing at all — tells you what it found *and what it couldn't tell*, then builds only the level you pick. |
| **`policy-init`** · **`session-start`** · **`session-close`** · **`hygiene`** · **`harvest`** commands | Scaffold the policy · open a session on state and checks · reconcile state and hand off · a read-only weekly sweep · review what repeated and draft the tools worth building. |
| **`SessionStart` hook** | If your project has an `AGENT_POLICY.md`, it's injected into context at the start of every session — so the policy no longer depends on the agent *remembering* to read it. If there's no policy, a two-line nudge instead. |
| **`PreToolUse` hook** *(0.4)* | The hard backstop. Inspects every tool call *before* it runs and stops a hot one (`git push`, deploy, `rm -rf`, writes to your hot paths, outward MCP calls) for explicit approval — even if the agent didn't stop itself. Logs every decision to `.keel/audit.jsonl`. |

Plus runnable templates: a dependency-free [checks script](plugins/keel-skills/templates/checks/README.md)
with its test bank, a state/history pair, an improvement backlog, and an
unattended weekly-sweep prompt.

## The permission model, at a glance

The core of Keel Skills: a four-step check that decides, before any action that
writes or changes something, whether the agent can act alone or must stop and ask
for a clear yes — a **green light**.

![Keel Skills permission model: the four-step check](assets/authorization-flow.svg)

> Read-only and proposals are free. Anything **risky, outward, undoable-only-with-pain,
> or system-rebuilding** needs a green light. When in doubt, ask.

The model is specified runtime-neutral in **[SPEC.md](SPEC.md)** so it can be
cited and reimplemented outside Claude Code.

## Two layers: judgment and enforcement

Keel works in two layers, and you want both:

- **Soft (reasoning).** The skills make the agent *apply the test itself* and stop
  before hot work. Smart, context-aware — but it depends on the model choosing to
  comply.
- **Hard (enforcement).** The `PreToolUse` hook is deterministic code that
  intercepts hot tool calls and blocks them for approval *regardless* of what the
  model decided. It reads the concrete `hot_paths` / `hot_commands` from your
  policy's [machine-readable block](SPEC.md#71-optional-machine-readable-block-for-enforcing-implementations)
  (plus the SPEC §4 defaults), turns a hot action into an explicit approval
  prompt, and in a non-interactive run (CI) **denies** it outright since no human
  is there to approve. Every decision lands in `.keel/audit.jsonl`.

> **It is a backstop, not a sandbox.** Enforcement catches accidents, drift, and
> hallucinated actions — a huge lift in assurance — but a determined or
> jailbroken agent with shell access can still route around command matching.
> Real isolation (scoped credentials, a sandbox) is complementary; Keel does not
> replace it. We say this plainly so nobody leans on it as a security boundary.

## The key separation: mechanism vs. your data

The skills are **generic**: they describe the *pattern* (what a risky zone is, what
following through on a green light means, how a model gets chosen). Everything specific to
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

Then, in the project you want to govern:

```text
/keel-skills:onboard
```

It **assumes nothing**: it inspects what's actually there first, tells you what
it found and what it couldn't determine, then offers three sizes — the brake
alone (~5 min), plus the session loop (~15), plus the maintenance loop (~30) —
and builds only the one you choose. Level 1 is a legitimate final answer; you
can move up later by running it again. It finishes by making the brake fire on a
real command, because "it's set up" is a claim and not evidence.

If you only want the policy file, `/keel-skills:policy-init` does that one step.
See [DISTRIBUTION.md](DISTRIBUTION.md) for the publishing paths (git repo, local
path, or package).

## Once it's set up

If you took the session loop, the rhythm is:

```text
/keel-skills:session-start     # load state, run the checks, before the work
/keel-skills:session-close      # write state back, one line of history, hand off
/keel-skills:hygiene            # weekly, read-only, reports but never acts
/keel-skills:harvest            # when capacity is spare: what repeated, what to build
```

Why it's shaped this way — documents that don't age, checks that earn their
place, unattended runs, the rule of three — is on
[the operating loop](https://docs.estebanaguilar.me/concepts/operating-loop).

## See it in 60 seconds

A concrete before/after of the green-light brake — the agent about to force-push a
"cleanup", and Keel stopping it — is in
[`examples/green-light-brake.md`](examples/green-light-brake.md) (the **soft**
brake: the agent reasoning its way to a stop). The **hard** brake — the
`PreToolUse` hook intercepting the call and denying it when no human is present — is
in [`examples/enforcement.md`](examples/enforcement.md). The recordable demo script
is in [`examples/demo-script.md`](examples/demo-script.md).

## How to use it, in one line

> Read-only and proposals are free. Anything risky, outward-facing,
> undoable-only-with-pain or system-rebuilding needs a green light. When in doubt,
> ask. Cheapest model that does the job; shallow delegation; lightest tool first.

## Author

Created by **Esteban Aguilar** — [estebanaguilar.me](https://estebanaguilar.me)
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
