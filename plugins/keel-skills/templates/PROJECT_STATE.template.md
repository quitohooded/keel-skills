# <Project> — State

> **Last reconciled: `<YYYY-MM-DD>`** — update this every time you close a
> session against this file. It is the one date that says how much to trust the
> rest of the document, and it is what a mechanical check can measure.
>
> **What this is.** What is true *right now* and what is open. Reconstructed
> from files and tools, never from a conversation or an agent's memory.
> **What this is NOT.** History. What happened and why lives in the history file
> next to this one, and is cited **by date, never by section number.**
> **Read at the start of every session. Written at the end of every one.**

---

## 0. Labels

| Label | Means | Rule |
|---|---|---|
| `[CONFIRMED]` | Verified in a file or a tool | Must cite the source (path or command) |
| `[INFERRED]` | Reasonable deduction, not directly proven | Say so; don't treat it as fact |
| `[PROPOSED]` | A candidate action, **not executed** | Needs a green light before it runs |
| `[UNKNOWN]` | A real gap — not inspected, or not knowable from files | **Don't invent the value.** Leave it open |
| `[REJECTED]` | Tried and discarded | Stays out of the reasoning unless explicitly reopened |

**Maintenance rules:**

1. An item changes state **only on new evidence** from a file or a tool, and the
   change gets a dated line in the history file.
2. **Contradictions get listed, not smoothed. Gaps get marked, not filled.**
3. This file records **structural state and decisions** — not every file edit.
   Per-area detail belongs in that area's own README.
4. **Closed items are history.** When something resolves, its body moves to the
   history file and one dated line stays here. A closed item left here is how a
   state file quietly triples in size.
5. Keep it short. Everything here is read in **every** session; that's the whole
   cost model.

---

## 1. What this project is `[CONFIRMED]`

<Two or three lines. What it does, who it's for, where it runs. Not a pitch —
the facts an agent needs before touching anything.>

---

## 2. Shape of the thing `[CONFIRMED]`

| Area | What it is | Where | Notes |
|---|---|---|---|
| `<src/>` | `<what lives here>` | `<repo/path>` | `<deployed? public?>` |

---

## 3. Open, and actionable

*One row per open item. When it closes, the body moves to the history file and
this row becomes a dated line.*

| # | What | Waiting on |
|---|---|---|
| 1 | `<the concrete thing that isn't done>` | `<a decision / a date / someone>` |

---

## 4. Known limits, accepted on purpose

*Not debt — things deliberately not solved. Writing them here stops them from
being rediscovered as bugs every few months.*

- `<what doesn't work, and why that's fine for now>`

---

## 5. Contradictions and gaps

- `[UNKNOWN]` `<what nobody has verified, stated as a question>`

---

## 6. History → the history file

The history of this document lives in `<CHANGELOG.md>`. Cited **by entry date**.

*Move it out when any one of these is true: the history section passes ~30 KB ·
it passes about two thirds of this file, even if small · it holds items that are
already closed.*
