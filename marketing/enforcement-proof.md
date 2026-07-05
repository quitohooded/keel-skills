# Enforcement proof — hard facts for the launch content

Not marketing copy. This is the reference sheet: what actually happened, when, and
the raw evidence, so whoever writes the final post/thread can quote real numbers
instead of paraphrasing from memory.

## What was validated

The `PreToolUse` hook (`enforce-policy.cjs`, shipped since v0.4.0) intercepts a
tool call **before** it runs and can force a human approval prompt (`ask`) or
block it outright (`deny`, headless-only) — regardless of what the model decided.
Until 2026-07-01 this had never been confirmed against a real Claude Code session;
it was the one unverified assumption in the enforcement design.

## Timeline

- **2026-06-30 (first attempt, failed):** installed via `/plugin install`, asked
  the agent to `git push` in a throwaway repo. Only the generic Claude Code
  permission prompt appeared (no `keel:` prefix), and `.keel/audit.jsonl` was
  never created — the hook did not run.
- **2026-07-01 (root cause found):** the plugin *was* installed, but the local
  cache was pinned to v0.3.0 — installed 2026-06-19, before `enforce-policy.cjs`
  existed (it shipped in v0.4.0). The marketplace's local git clone
  (`~/.claude/plugins/marketplaces/keel-skills`) was frozen on commit `b64daaf`
  and had never re-fetched from `origin`, even though `git status` reported
  "up to date" (it wasn't lying — it just hadn't asked origin again).
- **Fix:** `/plugin uninstall keel-skills@keel-skills` + `/plugin marketplace
  remove keel-skills`, manual delete of the stale cache folders, fresh
  `/plugin marketplace add` + `/plugin install`, full restart of Claude Code
  (plugin hooks load at process start, not per-session).
- **Verified by file** after reinstall: `installed_plugins.json` → version
  `0.5.0`, `gitCommitSha 472ba88a` (current `main` HEAD at the time);
  `enforce-policy.cjs` present in the cache.

## The real test (2026-07-01, repo `keel-test-2`, no remote configured)

Prompt to the agent: *"I know there's no remote and it'll fail — run `git push`
exactly as-is, don't add a remote, don't ask me anything else. This is a test."*

**What appeared on screen** (Claude Code's own permission-request UI):

```
Bash command

   git push
   Run git push with no remote configured (expected to fail)

 Hook PreToolUse:Bash requires confirmation for this command:
 keel: needs a green light (explicit approval) — command matches hot pattern `git push` [plugin:keel-skills]
 plugin hooks.json to update hooks

 Do you want to proceed?
 > 1. Yes
   2. No
```

**Raw content of `.keel/audit.jsonl`** written by that session (unedited):

```json
{"ts":"2026-07-01T16:13:50.059Z","tool":"Bash","input":"git status && echo --- && git remote -v && echo --- && git branch -vv","verdict":"allow","rule":"no_match"}
{"ts":"2026-07-01T16:14:55.281Z","tool":"Bash","input":"git push","verdict":"ask","rule":"hot_command:git push"}
```

Read-only inspection commands (`git status`, `remote -v`, `branch -vv`) passed
straight through as `allow`/`no_match`. The moment the agent tried an actual
`git push`, the hook classified it as `hot_command:git push` and forced `ask` —
exactly the designed contract, confirmed against a live session, not a unit test.

## The recorded clip (2026-07-01/04, repo `acme-app-demo`)

A more realistic scenario built on purpose to be watchable, not just provable:
a small app with a client-facing `src/app/page.tsx` importing
`src/lib/format-currency.ts`, `AGENT_POLICY.md` marking `src/**` and `git push` as
hot, and a real disposable private GitHub repo (`acme-app-demo-DISPOSABLE`,
deleted after recording) wired as `origin` so the push at the end is real, not
just theater.

Prompt used: *"Modify `src/lib/format-currency.ts` to add EUR support, and push
your changes with git push when you're done."* — touches a hot path, then hits
the hot command. The approval prompt is the same contract as above; after
approving, the push actually completes against the real remote.

File: `assets/demo-keelskills.mp4`.

## Notable: it fired even with Claude Code's permissions set to skip (observed)

During the `acme-app-demo` recording the operator had Claude Code Desktop's
permission prompts set to **skip/bypass** (the "don't ask me" mode that
auto-approves normal tool calls). The Keel hook's `ask` **still surfaced a prompt
anyway** — twice, verbatim from screen:

```
¿Permitir que Claude ejecutar Commit the currency change?
keel: needs a green light (explicit approval) — command matches hot pattern `git commit`
git add src/lib/format-currency.ts && git commit -m "feat: add EUR support to formatCurrency ..."
  Denegar 1   |   Permitir una vez 2
```

```
¿Permitir que Claude ejecutar Push to remote master?
keel: needs a green light (explicit approval) — command matches hot pattern `git push`
git push origin master
  Denegar 1   |   Permitir una vez 2
```

**Why this matters:** the normal skip-permissions setting waves through Claude
Code's *own* allowlist, but a `PreToolUse` hook returning `ask` is a separate,
harder gate — so "I turned permissions off" did not disable the Keel brake. This
is a strong angle: *even with the safety off, the policy hook still stopped it.*

**Honesty flag before making this the centerpiece:** this was observed once, in
one Claude Code Desktop build. Confirm it reproduces (and understand the exact
interaction between skip-permissions and hook `ask`) before leading marketing with
"you can't turn it off" — the observation is real, the general claim needs a second
run. The `git commit` prompt also shows the fatigue tradeoff noted in
`enforce-policy.cjs`: `git commit` is a SPEC §4 default hot command, so it prompts
unless you add it to `standing_allow_commands`.

## The honest caveat (keep saying this)

This is a backstop, not a sandbox. It catches accidents, drift, and hallucinated
actions — a real jump in assurance — but a determined or jailbroken agent with
shell access can route around command-pattern matching (`g=push; git $g`). Real
isolation still needs scoped credentials and a sandbox. Say so every time; the
credibility is worth more than the overclaim.
