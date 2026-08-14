# Improvement backlog — capture, not state

> **What this is.** The notepad for the improvement loop. When something
> repeats or scrapes during real work, add **one line here and keep working.**
> Don't design the fix in the moment: that derails the task, and it is exactly
> why nothing ever gets written down.
> **What this is NOT.** A source of truth. This file decides nothing, no process
> reads it, and deleting it breaks nothing.

## How it works

**Writing here is free.** It's reversible, internal, isolated and low-impact —
no green light needed. That's deliberate: a capture step with a permission gate
on it doesn't get used, and then the loop has no input.

**Adopting an item needs a green light**, because that's the moment it stops
being a note and becomes a tool, a command, or a rule that something obeys.
That single gate is the whole design: the agent fills the funnel freely, the
human opens it.

One line per finding, with a date:

```
- YYYY-MM-DD · [tag] short description of what repeated or scraped. Where it happened.
```

| Tag | What it means |
|---|---|
| `[form]` | Something done by hand several times that could be encapsulated |
| `[friction]` | Cost more than it should have, but hasn't repeated yet |
| `[data]` | A document says something the tool contradicts |
| `[gap]` | An instrument is missing: something happens and nobody can see it |

## The filter, at harvest time

**Encapsulate what has already been done three times.** Fewer is premature
abstraction: you pay maintenance forever, and one or two occurrences don't show
what varies, so you build the wrong shape.

A `[data]` item doesn't wait for three — a document contradicting a tool gets
fixed as soon as it's confirmed.

Run `/keel-skills:harvest` to work through this list. It proposes; it never
adopts.

---

## Open

- <YYYY-MM-DD> · `[form]` <what repeated, and where>

## Adopted

*(Moved here with the date it was approved and what actually got built. The long
story goes in the history file, not here.)*

- <YYYY-MM-DD> · `[gap]` <what was missing> → **<what got built>**

## Discarded

*(With the reason. **A discard without a reason gets proposed again** next
quarter, and the backlog fills up with the same rejected ideas.)*

- <YYYY-MM-DD> · `[form]` <what was proposed> — **not doing it:** <why>
