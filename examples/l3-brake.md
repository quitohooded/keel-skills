# Example: the L3 brake

The whole point of Keel Skills in one scenario. Same prompt, same agent — the only
difference is whether Keel's `authorization-protocol` is active.

## The prompt

> "The repo's gotten messy, clean it up and push so the build is green again."

This is a **broad mandate (L1)**. It names a goal, not a scoped action. It feels
like permission to do whatever's needed. It is not.

---

## Without Keel ❌

The agent interprets "clean it up and push" as approval and acts:

```text
$ git rm -r legacy/ old-tests/        # "messy" → deletes them
$ git add -A
$ git commit -m "chore: clean up repo"
$ git push --force origin main        # "so the build is green" → force-push
```

Three irreversible, outward actions taken under an instruction that never scoped
any of them. The `--force` overwrote a colleague's commit. `legacy/` had one file
that was still imported. The build is green because half of it is gone.

---

## With Keel ✅

`authorization-protocol` runs the four-step test before each action.

```text
Step 1 — read-only / proposal?  No, these write and push.
Step 2 — hot zone?              YES. `git push`, force-push, and deleting files
                                are outward / irreversible actions.
        → Requires L3. The broad mandate is L1, not L3. STOP.
```

The agent does **not** execute. Instead it comes back with a scoped proposal:

```text
This is a broad mandate (L1), and "clean up + push" touches hot zones
(deleting files, push, force-push). I won't run those without explicit approval.

Here's what I'd do — approve the parts you want (L3):

  [PROPOSAL]
  1. Delete `old-tests/` (12 files, 0 imports found)        — reversible until push
  2. Delete `legacy/`  ⚠ `legacy/dates.ts` is imported by `src/lib/x.ts`
                          → I'd keep this one; flag instead of delete
  3. Commit the deletions on a branch
  4. push (NOT force) to `main`                              — outward, needs your OK

I will not force-push: it would overwrite commit a1b2c3d (not yours).

Which of 1–4 do you approve?
```

You approve `1, 3`, and a normal (non-force) push. The agent executes **exactly
that scope** — nothing more. `legacy/` is preserved, your colleague's commit
survives, and you found out about the broken import *before* it shipped.

---

## Why this is the product

The difference isn't intelligence — both agents are the same model. The difference
is a **written rule about when to stop**:

- "clean it up and push" is L1 → investigate and propose, don't execute.
- push / force-push / delete are hot → L3.
- doubt about whether `legacy/` is safe to delete → surface it, don't infer.

Keel Skills is that rule, shipped. The specifics of *what's hot in your repo* live
in your [`AGENT_POLICY.md`](../plugins/keel-skills/templates/AGENT_POLICY.template.md);
the model that decides is specified in [SPEC.md](../SPEC.md).
