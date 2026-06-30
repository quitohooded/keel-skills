# Recordable demo script (≈60 seconds)

A tight, recordable walkthrough of the green-light brake for the README / social / landing.
This file is the **script**; recording it is a manual step (see "How to record").

Goal of the clip: a viewer who has never heard of Keel Skills understands the value
in under a minute — *the agent was about to do something irreversible, and Keel
stopped it and asked first.*

---

## Beat sheet

| t (s) | On screen | Narration / caption |
|-------|-----------|---------------------|
| 0–5   | Title card: "Keel Skills — the brake your agent doesn't have" | — |
| 5–15  | A messy repo + the prompt typed in: *"clean it up and push so the build is green"* | "A vague instruction. Feels like permission." |
| 15–25 | **Split A (no Keel):** agent runs `git rm -r`, `commit`, `git push --force` | "Without a rule, the agent just… does it. Force-push included." |
| 25–35 | Red flash: "overwrote a colleague's commit · deleted a file still imported" | "Three undoable actions it was never actually scoped to take." |
| 35–50 | **Split B (Keel on):** four-step check runs → STOP → `[PROPOSAL]` with the scoped options + the ⚠ on `legacy/` | "With Keel: risky zone → stop → propose. It even flags the unsafe delete." |
| 50–60 | You approve `1,3` + normal push; agent does exactly that. End card: install command. | "You approve the scope. It does exactly that. Nothing more." |

End card text:

```text
/plugin marketplace add https://github.com/quitohooded/keel-skills
/plugin install keel-skills@keel-skills

Read-only is free. Risky, outward, undoable → it asks first.
github.com/quitohooded/keel-skills
```

---

## How to record (manual — pick one)

**Option A — terminal cast (recommended, lightest):**

1. Install [asciinema](https://asciinema.org): `npm i -g asciinema` (or `brew install asciinema`).
2. Record: `asciinema rec keel-demo.cast` — run through the beat sheet in a throwaway
   repo, then `Ctrl-D` to stop.
3. Turn it into a GIF with [agg](https://github.com/asciinema/agg):
   `agg keel-demo.cast keel-demo.gif`.
4. Drop `keel-demo.gif` into `assets/` and embed it near the top of `README.md`.

**Option B — screen recording:** record the two Claude Code sessions side by side
(no-Keel vs Keel), trim to ~60s, export GIF/MP4.

**Tip:** the contrast *is* the demo. Keep "Split A does the scary thing" and "Split
B stops and proposes" visually adjacent. Use the exact scenario from
[`green-light-brake.md`](green-light-brake.md) so the clip and the written example reinforce each other.

> This is the single highest-leverage marketing artifact for the project: it turns
> an invisible, text-only governance plugin into something a stranger can *see* the
> value of in one minute. Worth doing well once.
