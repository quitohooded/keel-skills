# Keel Skills — Growth Strategy

> Internal strategy doc. Source of truth for *why* the repo is shaped the way it
> is, and what comes next. Derived from a case study of Paperclip
> (github.com/paperclipai/paperclip), the open-source agent-orchestration platform
> that went 0 → ~71k GitHub stars in ~3 months (launched early March 2026).
> A fresh session should be able to continue the work from this file alone.

## The thesis in one paragraph

Don't try to be Paperclip — **be the keel of Paperclip.** Orchestration platforms
(Paperclip and its clones) will commoditize *coordinating many agents*; they treat
*fine-grained governance* (when an agent may act alone) shallowly — in Paperclip
it's subsystem 6 of 12. That precision is exactly where Keel is strong and they are
coarse. The winning play: make the **goal/method/green-light model + `AGENT_POLICY.md`
format the open standard for agent governance**, dogfooded in public on real work, distributed
with zero friction, and monetized *above* the mechanism (packs, compliance,
consulting) — never by selling the mechanism.

## What the Paperclip case proved (and what we copied / rejected)

**Copied:**
- Open source as the *distribution channel*, not ideology → **relicensed to MIT**
  (was source-available/no-resale, which directly blocked viral forking).
- Time-to-value must be immediate and **visible** → built `examples/green-light-brake.md`
  + `examples/demo-script.md` (the invisible text plugin needs a "see it" moment).
- Distribution = the product's own output (Paperclip analyzed 14k commits made by
  its users) → our equivalent metric is **repos with an `AGENT_POLICY.md`
  committed**.
- Become a platform by exposing stable abstractions others build on → **SPEC.md**
  (runtime-neutral) + `policies/` packs + `CONTRIBUTING.md`.
- Built for the founder's own acute daily pain (20-30 Claude Code windows).

**Rejected (don't copy):**
- The heavy stack (server + Postgres + UI). Keel's strength is being weightless.
- "Zero-human" marketing the product can't back up. Our thesis is the *opposite*:
  the human in the loop, placed well.
- 12 subsystems of surface area for a one-person team.
- Launching with no monetization runway for 12 months.

## Decisions taken (2026-06-19)

1. **License → MIT.** (Recommended option A: viral adoption over protection.)
   Attribution preserved via MIT notice + `NOTICE`.
2. **English is the primary repo language**; Spanish kept as brand voice
   (`README.es.md`). Market + the wave are English.
3. **Publish the open spec** (`SPEC.md`) so the model is citable/reimplementable
   beyond Claude Code → the standard play, the moat against being absorbed.

## The contradiction we resolved

You cannot "grow like Paperclip" *and* keep a no-resale source-available license —
they fight. Paperclip grew on MIT + self-host + no account = zero friction +
forkable. We picked growth.

## Where the product is now (2026-08-14, v0.6.0)

The repo shipped **the operating loop**: Keel stopped being only a brake and
became the way a session runs. Two new skills (`workspace-hygiene`,
`repeatable-work`), five new commands headed by `/keel-skills:onboard`, runnable
check/state/routine templates, spec **0.3**, and this repo's own
`AGENT_POLICY.md`.

Strategically this does three things the brake alone couldn't:

1. **It widens the wedge past "the day after the bad push."** The brake sells to
   someone who already got burned. The loop sells to someone whose docs are
   drifting and whose sessions keep restarting from zero — a much larger and
   *earlier* group, and one that feels the pain weekly rather than once.
2. **`onboard` attacks the real drop-off.** The metric that matters is repos
   with a committed `AGENT_POLICY.md`, and the gap was never installing — it was
   the blank template. A command that inspects the repo, assumes nothing, and
   offers a 5-minute level converts far more of that gap than better docs would.
3. **The spec gained a normative rule with teeth** (§8.1.5, per-segment command
   matching, from a real bypass found in our own hook). A spec that only
   restates good intentions is not a standard; one that other implementations
   can be *wrong* against is.

**The honest risk this adds:** surface area. It is the thing the Paperclip
analysis said to reject, and this release roughly doubles what has to stay
coherent. The mitigations are in place — every skill has to earn a permanent
context cost (written into `CONTRIBUTING.md`), the checks template has a test
bank with negative controls, and the repo now runs on its own policy — but the
next release should be **narrowing, not widening**: real users, real packs, no
new subsystems.

## Roadmap (by impact)

**0–30 days — make value visible + free the distribution.** ✅ mostly done in repo:
MIT relicense, English README, SPEC, policy packs, green-light-brake example + demo script.
Remaining (manual, see below): record the demo GIF; push; run the end-to-end
install test; first build-in-public post.
- Metrics: installs, ⭐, **# repos with `AGENT_POLICY.md` committed**, "got it in 30s?" on 5 testers.

**30–90 days — first external users + concept travels beyond our repo.**
More policy packs; a technical post on the goal/method/green-light model *as an idea*; weekly
build-in-public on real daily usage; open Discussions; list in plugin directories.
- Metrics: external repos with a policy, contributed packs, organic mentions, first third-party issues.

**3–6 months — the format starts being cited as a concept, not just our plugin.**
Publish/version the spec publicly; a second runtime implementation (Agent SDK);
POC of Keel as the governance layer inside an orchestrator; decide on open-core.
- Metrics: format adoption by third parties, # implementations, first commercial interest.

**6–12 months — position as *the* agent-governance standard + validate sustainability.**
Premium packs / compliance / consulting as revenue; living ecosystem of contributed
policies; form a company only if commercial demand is proven; integrate with 1–2 orchestrators.
- Metrics: recurring revenue or real pipeline, # ecosystem packs, active integrations, cited as authority.

## Honest risk

The likely failure mode is not loud — it's staying *a tidy repo with 30 stars*.
The two things that prevent it: (1) **sharpen the pain** — tie the skill to the
moment of the burn (the bad push, the broken deploy, the absurd token bill); the
demo does this. (2) **keep distribution frictionless** — MIT + one-command install.
If those two hold for 90 days, the standard play has a real shot.

## What only Esteban can do (out of agent scope)

- `git push` the `strategy/v0.3-reposition` branch / merge to `main` (outward, needs a green light).
- Record the demo GIF (`examples/demo-script.md`) and embed it in the README.
- Run the interactive `/plugin marketplace add … → install → policy-init` end-to-end test.
- Publish the build-in-public post and list the plugin in directories.
- Cut a GitHub release for the version tag.
