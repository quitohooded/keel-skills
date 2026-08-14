---
name: repeatable-work
description: >-
  Turn work that keeps repeating into a script or documented procedure instead
  of redoing it by hand and re-spending context every time, and run the capture
  → harvest → adopt loop that finds the repetition in the first place. Use when
  you notice you've done something before, when deciding whether to write a
  helper script or automate a process, when writing a script an agent will run
  unattended, when writing tests for one, or when reviewing what could be
  improved across sessions. Covers the rule of three, counting occurrences
  without fooling yourself, the properties an agent-run tool needs, test banks
  with a negative control, and why capturing an idea is free but adopting it
  needs a green light. Triggers on: I keep doing this, third time, write a
  script, automate this, make a tool, encapsulate, helper, test the script,
  improvement backlog, retrospective, what should we automate.
---

# Repeatable Work

Doing the same multi-step thing by hand a fourth time is two leaks at once:
the tokens spent re-deriving it, and the errors that come from doing it
slightly differently each time. The fix is to encapsulate it. The trap is
encapsulating too early, which costs more than the repetition did.

## The rule of three

**Encapsulate what has already been done three times.** Fewer is premature
abstraction: you pay maintenance forever, and — the real cost — **one or two
occurrences don't show you what varies**, so you build the wrong shape and then
work around it.

Two exceptions to waiting:

- **A document that contradicts a tool** gets corrected the moment it's
  confirmed. That's not abstraction, it's a lie with a known truth value.
- **A gap where something happens and nobody can see it** is worth an
  instrument before it's worth a script.

## Count honestly, in both directions

Before claiming something repeats, check the number twice — it lies both ways.

- **Normalize before counting.** The same command with a different id, path, or
  timestamp inside it is *the same command*. Counting raw text splits one
  repetition into five and you conclude nothing repeats.
- **Then check the opposite failure.** A form that appears 200 times may be an
  artifact of how you truncated or grouped, not a real repetition. Before
  proposing anything, look at whether the occurrences **do** the same thing or
  merely **start** the same.
- **Don't count a list of the things you're counting.** An inventory document
  that enumerates every tool will make every tool look "mentioned", including
  the ones nothing uses.

A proposal without a number is an opinion. A number without this check is
worse, because it looks like evidence.

## What an agent-run script must be

Whatever the language, a tool an agent invokes on its own has requirements a
one-off script doesn't:

- **Say why it exists, at the top.** What it checks, what happens if it fails,
  and when to run it. A script whose reason is lost gets deleted the first time
  it's inconvenient.
- **Read-only unless writing is the whole point** — and if it writes, say so
  loudly and keep it to one named place.
- **No shared state between runs.** No cache, no lock file, no "last run"
  marker unless that's the feature. **Two sessions must be able to run it
  simultaneously without colliding.**
- **Deterministic and sorted output.** Comparing two runs is how you detect
  drift; unstable ordering destroys that.
- **Dependency-free where you can manage it.** Something that runs on a fresh
  clone with no install step actually gets run.
- **Meaningful exit code**, so it can be wired into CI or a hook.
- **Aggregate, don't dump.** A tool an agent runs should emit conclusions. It
  is absurd to spend half a context window finding out how to spend less
  context.

## Test banks: prove it can still fail

A script that touches a live system can't be exercised safely against it — the
risky paths are exactly the ones a live run won't take. So build a bank that
substitutes the reads with synthetic data, **runs the real routine**, and
captures what *would* have been sent.

Two things people skip, both of which void the whole bank:

1. **Include a negative control** — at least one case where the code *must*
   act, and the bank fails if it doesn't. Without it, a suite that only checks
   "nothing bad happened" passes just as green with the entire engine commented
   out.
2. **Make it run on a fresh clone.** If the bank dies with a missing-credential
   traceback on a machine that never configured anything, it fails exactly
   where it matters most, and it reads as *"this package is broken"* rather
   than *"you haven't configured it"*.

Also: when a test can't distinguish two outcomes because of how the fixture is
set up, **say so and skip**, rather than reporting failures against working
code.

## The improvement loop: capture is free, adopting is not

Repetition is invisible from inside a single session — each one starts blind,
and nobody ever looks across them. So the loop has three separate times, with
different costs and different permissions:

| Time | When | Who | Cost |
|---|---|---|---|
| **Capture** | during real work | the agent, without derailing | one line in a backlog file |
| **Harvest** | when there's spare capacity | its own session | tokens that were going spare |
| **Adopt** | when the human reviews | **the human only** | seconds per item |

**Capture is the asset.** If the harvest has to start by *thinking of* what to
improve, it doesn't happen. So during real work: notice the friction, write
**one line and keep going**. Do not design the solution in the moment — that
derails the task, and it's precisely why nothing ever gets written down.

Tag each line so the harvest can group without re-reading everything: something
done repeatedly by hand · something that cost more than it should have but
hasn't repeated · a document the tool contradicts · a gap where nothing is
watching.

**Harvest in its own session.** It costs a lot and produces no product; running
it inside a working session spends that session's context on it.

**Adopting is the green light.** Capturing and drafting are free — a backlog
file decides nothing, no process reads it, and deleting it breaks nothing. The
moment an item becomes a tool, a command, or a rule that something obeys, it is
a change to how the system works and needs explicit approval. See the
`authorization-protocol` skill. This split is the point: the agent may fill the
funnel freely; only the human opens the gate.

**Record discards with their reason.** A discard without one gets proposed
again next quarter, and the backlog fills with the same rejected ideas.

## How to apply this in one line

> Encapsulate on the third time, not the first; count occurrences after
> normalizing and then check the number isn't an artifact; make agent-run tools
> read-only, deterministic and dependency-free with a test bank that includes a
> case that must fail; capture friction in one line as it happens, harvest in
> its own session, and only a human adopts.
