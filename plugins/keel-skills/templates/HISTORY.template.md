# <Project> — History

> **What this is.** What happened, dated, newest first. Read to understand *why*
> something is the way it is — not to work. The current state lives in the state
> file next door.
> **Cited by date**, never by section number: section numbers move, dates don't.

## The rule that keeps this file readable

**One line per session close: date + what was done.**

The reasoning goes in the document it is *about* — the decision, the spec, the
process doc, the draft. Not here. Entries that grow into essays are how a
changelog gains tens of kilobytes a month and stops being read at all; at that
point it costs real money and delivers nothing, because nobody opens it.

If an entry wants to be 200 words, that content has a different owner. Write it
there and link to it in one line.

**Closed items land here.** When something in the state file resolves, its body
moves here with its date and the state keeps a single line pointing at it.

**Archiving.** Keep the current month and the two before it in this file. Older
than that gets archived (by half-year is a reasonable default) into
`history/<period>.md`, so this file stays the size of a thing people open.

---

## <YYYY>

- **<YYYY-MM-DD>** — <what was done, one line. Link the detail: `[why](docs/decisions/0004.md)`>
- **<YYYY-MM-DD>** — <…>
