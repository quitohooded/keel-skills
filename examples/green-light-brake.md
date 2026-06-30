# Example: the green-light brake

The whole point of Keel Skills in one scenario. Same prompt, same agent — the only
difference is whether Keel's `authorization-protocol` is active.

## The prompt

> "The repo's gotten messy, clean it up and push so the build is green again."

This is a **goal**. It names an outcome, not a scoped action. It feels like
permission to do whatever's needed. It is not — it's not a green light.

---

## Without Keel ❌

The agent reads "clean it up and push" as approval and acts:

```text
$ git rm -r legacy/ old-tests/        # "messy" → deletes them
$ git add -A
$ git commit -m "chore: clean up repo"
$ git push --force origin main        # "so the build is green" → force-push
```

Three undoable, outward actions taken under an instruction that never scoped any of
them. The `--force` overwrote a colleague's commit. `legacy/` had one file that was
still imported. The build is green because half of it is gone.

---

## With Keel ✅

`authorization-protocol` runs the four-step check before each action.

```text
Step 1 — read-only / proposal?  No, these write and push.
Step 2 — risky (hot) zone?      YES. `git push`, force-push, and deleting files
                                are outward / undoable-only-with-pain actions.
        → Needs a green light. The instruction was a goal, not a green light. STOP.
```

The agent does **not** act. Instead it comes back with a scoped proposal:

```text
This is a goal, not a green light, and "clean up + push" touches risky zones
(deleting files, push, force-push). I won't run those without a clear yes.

Here's what I'd do — approve the parts you want (that's your green light):

  [PROPOSAL]
  1. Delete `old-tests/` (12 files, 0 imports found)        — undoable until push
  2. Delete `legacy/`  ⚠ `legacy/dates.ts` is imported by `src/lib/x.ts`
                          → I'd keep this one; flag instead of delete
  3. Commit the deletions on a branch
  4. push (NOT force) to `main`                              — outward, needs your yes

I will not force-push: it would overwrite commit a1b2c3d (not yours).

Which of 1–4 do you approve?
```

You approve `1, 3`, and a normal (non-force) push. The agent does **exactly that**
— nothing more. `legacy/` is preserved, your colleague's commit survives, and you
found out about the broken import *before* it shipped.

---

## Why this is the product

The difference isn't intelligence — both agents are the same model. The difference
is a **written rule about when to stop**:

- "clean it up and push" is a goal → investigate and propose, don't act.
- push / force-push / delete are risky → need a green light.
- doubt about whether `legacy/` is safe to delete → surface it, don't guess.

Keel Skills is that rule, shipped. The specifics of *what's risky in your repo* live
in your [`AGENT_POLICY.md`](../plugins/keel-skills/templates/AGENT_POLICY.template.md);
the model that decides is specified in [SPEC.md](../SPEC.md).
