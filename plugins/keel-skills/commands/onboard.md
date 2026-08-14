---
description: Set up Keel Skills for this project or workspace from scratch — inspects what's actually here, then builds only the level the user picks. Assumes nothing.
---

# Onboard this project to Keel Skills

Someone just installed the plugin. Your job is to get them from *installed* to
*actually governing this project*, without assuming a single thing about how
they work.

**The governing rule of this command: look first, then say what you found, then
ask, then build.** Never present a default as if it were their situation. A
setup built on a guess is worse than no setup, because they will trust it.

Everything this command creates is a plain file at a path you show them first.
Nothing here is irreversible; say so, because people are cautious with a tool
whose whole pitch is stopping the agent.

---

## Step 1 — Read the ground (do this silently, before saying anything)

Find out what is actually here. Don't ask the user anything you can determine
yourself:

- **Is this a repo?** Is there a `.git`? What's the default branch? Is there a
  remote, and is it public or private?
- **Is this one project or a workspace of several?** Look for nested `.git`
  directories, a workspace/monorepo config, or several unrelated project roots
  side by side. This changes where the policy goes.
- **Is it empty?** A brand-new or nearly-empty folder is a real case — handle it
  in Step 3b, do not treat it as an error.
- **What is it built with?** Package manifests, lockfiles, framework configs,
  migration folders, IaC, CI workflow files, deploy configs.
- **What is client-facing?** Rendered routes/pages, published content
  directories, public API handlers, anything that ships to users.
- **What already governs the agent here?** `CLAUDE.md`, `AGENTS.md`,
  `.cursorrules`, `.github/copilot-instructions.md`, an existing
  `AGENT_POLICY.md`, existing hooks in `.claude/settings.json`.
- **Where does state seem to live already?** A `STATUS.md`, `CHANGELOG.md`,
  `docs/decisions/`, an ADR folder, a project board referenced in the README.
- **What commands exist?** Test, build, lint, typecheck, deploy scripts.

**If an `AGENT_POLICY.md` already exists:** stop the fresh-install path. Read
it, tell them what it currently covers, and offer to *extend* it to a higher
level (Step 3) or review it against the repo. Never overwrite it.

## Step 2 — Report what you found, and name what you could not tell

Six to ten lines, concrete, in their vocabulary. For example: *"This is a single
Next.js repo on a public GitHub remote. Client-facing: `app/` and `content/`.
Deploys from `main`. You already have a `CLAUDE.md` with build instructions and
no agent permission rules. I could not tell whether `scripts/seed.ts` touches
production data."*

Then state plainly: **anything you could not determine, you will ask about
rather than assume.** Especially:

- which surfaces are genuinely client-facing vs. just look like it
- what actually reaches production, and how
- which outward/irreversible actions matter here (push, deploy, send, charge,
  delete)
- whether there are files other work depends on

## Step 3 — Offer the three levels, and let them choose

Present these as sizes, not as a maturity ladder — **level 1 is a legitimate
final answer.** Say what each costs and what it gets them. They are additive:
running this command again moves up a level without redoing the earlier one.

| Level | Time | What gets created | What changes |
|---|---|---|---|
| **1. The brake** | ~5 min | `AGENT_POLICY.md` | The agent runs the four-step check against *your* hot zones, and the enforcement hook hard-stops your real risky commands and paths |
| **2. + the session loop** | ~15 min | a state file + a history file, wired into the policy | State survives across sessions; the agent reads it at the start and reconciles it at the end instead of trusting chat history |
| **3. + the maintenance loop** | ~30 min | a checks script, an improvement backlog, a scheduled sweep | Drift gets caught mechanically; repeated friction gets captured and reviewed instead of forgotten |

Ask which one they want. If they don't care, **recommend level 1** and say they
can come back — an unused level 3 is worse than a used level 1.

### Step 3a — Where the policy goes, if this is a workspace of several projects

Two shapes, and the right one depends on whether the projects share risk:

- **One policy at the workspace root** when the projects share a deploy, a
  database, or a release process. Simpler, and the hot zones stay in one place.
- **One policy per project** when they're genuinely independent. The enforcement
  hook reads the policy from the project root it's invoked in.

Show them both, recommend based on what you found in Step 1, and let them pick.

### Step 3b — If there is no workspace at all

An empty or near-empty folder is not a failure case. Offer to scaffold the
minimum that makes the rest coherent, and **say exactly what each file is for**:

- `AGENT_POLICY.md` — what's risky here (start with just the outward actions)
- a state file — what's true now and what's open
- a history file — what happened, dated
- optionally `git init`, because most of the guardrails assume "undoable" means
  "revertible"

Don't create a directory structure they didn't ask for. Four files and a repo
is the whole scaffold.

## Step 4 — Build the level they chose

**Level 1.** Follow `/keel-skills:policy-init` — it is the single source of
truth for the policy interview, don't duplicate its questions here. Two things
to get right, because they're what makes the difference between a policy that
works and a decorative one:

- **Every hot zone must be a real path or a real action.** Vague hot zones get
  ignored by the reasoning layer and can't be matched by the enforcement layer.
- **Fill in the ` ```keel-policy ` block**, not just the prose. The prose is
  what the model reasons with; the block is what the hook can actually enforce.
  A policy with prose only has no hard backstop.

**Level 2.** Create the state and history pair from
`${CLAUDE_PLUGIN_ROOT}/templates/PROJECT_STATE.template.md` and
`${CLAUDE_PLUGIN_ROOT}/templates/HISTORY.template.md`, at paths they approve
(respect an existing `CHANGELOG.md` — extend, don't replace). Then record those
paths in the policy's *"Where state and decisions get recorded"* section, which
is how every other component finds them. Show them
`/keel-skills:session-start` and `/keel-skills:session-close`.

**Level 3.** Copy `${CLAUDE_PLUGIN_ROOT}/templates/checks/keel_checks.py` into
the repo (suggest `scripts/`), run it once so they see real output, and record
the command in the policy's *"Checks"* section. Create the improvement backlog
from `${CLAUDE_PLUGIN_ROOT}/templates/IMPROVEMENTS.template.md`. Offer the
weekly sweep from `${CLAUDE_PLUGIN_ROOT}/templates/routines/weekly-hygiene.md`
— explain that it is read-only and report-only, and that scheduling it is
their action, not yours.

Before writing anything: **show the file, then write it.** After writing: list
every path you created or touched.

## Step 5 — Prove the brake actually works

Do not end on "it's set up." Demonstrate it, with something safe:

1. Pick a hot command from their new policy that is harmless to *attempt* —
   `git push --dry-run` against a hot pattern is ideal, or any real hot command
   they can decline at the prompt.
2. Run it and let the hook stop it. Show them the approval prompt, and say
   plainly: *that stop is the product.*
3. Show them the audit line it wrote to `.keel/audit.jsonl`, and explain that
   every decision — allowed and stopped alike — lands there.

If the hook does *not* fire, that is a real finding, not something to gloss
over. Check that the plugin's hooks are registered, that the policy is at the
project root the session is actually running in, and that the pattern matches
the command as typed. Say what you checked.

## Step 6 — Tell them what changed, in five lines

Close with what is now different, in plain language:

- what the agent will now stop for, in their terms
- what it will now do freely that it might otherwise have asked about
- which single file to edit to change any of that (`AGENT_POLICY.md`)
- where the audit trail is
- what the next level would add, and that there is no obligation to take it

Then add the one caveat, because leaving it out is how people get hurt: **this
is a backstop, not a sandbox.** It catches accidents, drift, and hallucinated
actions. It cannot contain an agent that is actively working around it. Scoped
credentials and real isolation are complementary and not replaced by this.

---

## Rules for you while running this command

- **Never write a file the user hasn't seen.** Show, then write.
- **Never overwrite existing agent instructions.** `CLAUDE.md`, `AGENTS.md` and
  friends are theirs. Offer to add a pointer to `AGENT_POLICY.md`; don't merge
  their content into it.
- **Don't invent hot zones to look thorough.** A policy listing paths that
  aren't actually risky trains them to approve everything, which is the exact
  failure this framework exists to prevent.
- **Don't push, deploy, or commit** as part of onboarding — those are the very
  actions the policy is about to govern. Leave the new files uncommitted and
  say so.
- **Stay within the level they picked.** Building level 3 for someone who asked
  for level 1 is the ordinary way this kind of setup becomes shelfware.
