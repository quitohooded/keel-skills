# Launch drafts — Keel Skills

Build-in-public copy. Edit to taste, then post from your own accounts.

> **Attach something visual when you post — it's what makes this land.**
> For the **v0.6.0 angle below, the visual is the one-liner itself** (`npm run
> build && git push --force` → `allow`) as a code screenshot: the bug *is* the
> image, and it reads in under a second. Keep `assets/demo-keelskills.mp4` (the
> hard brake firing live) for the second half of the thread, and
> `assets/keel-demo.gif` (the older soft brake) for the failure-story openings
> further down. On X, attach to the **first** tweet; on LinkedIn, to the post.

---

## 🆕 v0.6.0 angle — "I found the bug in my own brake" (use this as the headline)

**Lead with this.** It is the sharpest hook the project has had, and it works
*because* it's uncomfortable: a guardrail tool whose author publicly documents a
bypass he found in his own guardrail. Nobody expects that, which is exactly why
it lands — and it is the most credible thing you can say about a safety tool.

> ⚠️ **This is a skeleton — the creative voice is yours.** The beats and the
> honest facts are below; the punch is yours to write.

**The story, in one breath.** Keel's whole pitch is that it stops the agent
before `git push`. While building v0.6 I found that a policy allowing
`npm run build` also allowed this:

```
npm run build && git push --force origin main   →  allow
```

The standing approval was matched against the **whole** command string, and
matched *before* the dangerous patterns. So the allowance vouched for whatever
it happened to be chained to. Same for `;`, `|`, newlines and `$(…)`. The brake
had a hole exactly where a brake is not allowed to have one.

**Talking points (true, use freely):**
- **The reveal:** it was found by *me*, extending my own tool, not by a user and
  not in the wild. Say that — it's the truth and it's better than pretending
  nobody could have hit it.
- **The fix is the interesting part:** commands are now split on the shell's
  chaining operators and judged per segment. An allowance clears only the
  segment it matches; one hot segment makes the whole call hot.
- **It went into the spec as a MUST**, not just into my code — so any other
  implementation of the model is now *wrong* if it does what mine did. That's
  the difference between publishing a spec and publishing a standard.
- **Six regression tests** ship with it. The suite went 16 → 25.
- **The honest generalization:** pattern-matching enforcement has a class of
  bugs like this. Still a *backstop, not a sandbox*. Keep saying it.

**The second half of the release — the part with the substance.** v0.6 also
turns Keel from a brake into the way a session runs: open on state, work under
a mechanical check, close by writing state back, sweep weekly, and turn what
repeats into a tool. Five skills, six commands, two hooks.

- **`/keel-skills:onboard`** — the setup command that **assumes nothing**. It
  looks at what's actually in your directory (repo or not, one project or
  several, existing agent instructions, or an empty folder), tells you what it
  found *and what it couldn't tell*, then offers three sizes — 5, 15 or 30
  minutes — and builds only the one you pick. Good line: *"level 1 is a
  legitimate final answer."*
- **Documents that don't age** — state and history in separate files, because
  state is read to work and history is read to understand why, and they
  shouldn't cost the same to read.
- **Checks with three levels, not pass/fail** — a finding on a committed clean
  file is real drift; a finding on a file you have open belongs to whoever has
  it open. Without that split, "fix everything before you close" tells one
  session to edit another session's work.
- **Unattended runs** — the rule tightens rather than loosens: with no human
  present there is no one who *could* approve, so anything needing approval
  doesn't happen. Same line as v0.4, now written into the spec (§6.1).

**Two more honest details worth using — they make the rest believable:**
- Running the shipped checks against Keel's own repo immediately found a true
  positive: the changelog had recorded nothing for 17 days of commits.
- Walking a fake project through `onboard` from zero found two more defects,
  both fixed before release: a brand-new user got red failures for doing
  everything right, and in a monorepo the three-level split silently stopped
  working. *"I tested the onboarding by pretending to be a stranger, and the
  stranger had a bad time."*

**Skeleton thread (rewrite in your voice):**

> **1/** I build a tool whose one job is to stop an AI agent before it does
> something irreversible. Last week I found a hole in it. Here's the hole.
>
> **2/** [show the one-liner: `npm run build && git push --force` → allow]
> My policy said `npm run build` was safe. It is. The problem is what you can
> staple to the end of something safe.
>
> **3/** The approval was matched against the whole command, before the
> dangerous patterns. So "you may run the build" quietly became "you may run
> the build and anything after it."
>
> **4/** Fixed: commands get split on `&&`, `;`, `|`, `$(…)` and judged one at a
> time. An approval covers only its own command. One dangerous piece makes the
> whole thing dangerous.
>
> **5/** I put the rule in the open spec as a MUST, not just in my code — any
> other implementation that matches the whole string is now wrong, not lenient.
>
> **6/** Same release turns Keel into the whole loop, not just the brake:
> [onboard / state that doesn't rot / checks / unattended runs]. Still MIT,
> still your rules in one file. Still a backstop, not a sandbox.
> github.com/quitohooded/keel-skills

---

## Earlier — v0.4.0 angle — "now it has teeth"

**Superseded as the headline by v0.6.0 above, but the beats still work** as the
middle of a thread: this is where the hard brake was introduced. Until v0.4.0 Keel
*advised* the agent to stop — it depended on the model choosing to comply. v0.4.0
adds a `PreToolUse` hook that *enforces* it: the action is intercepted before it
runs and stopped regardless of what the model decided, and **denied outright** when
there's no human present to approve (CI, headless). The story shifts from
"a smart agent that should stop" to **"a brake that actually engages."**

> ⚠️ **This is a skeleton — the creative voice is yours.** Below are the structural
> beats and the facts, not the final punch. Drop in your own angle and personality;
> I'm only giving you the bones and the honest claims so they stay accurate.
>
> **The clip to lead with:** `assets/demo-keelskills.mp4` — a real (not staged)
> `PreToolUse` interception recorded live 2026-07-01/04: an agent asked to edit a
> hot path and push gets stopped with `keel: needs a green light...`, approved, and
> the push completes for real. Hard facts + the raw audit-log proof backing this
> clip are in [`marketing/enforcement-proof.md`](enforcement-proof.md). The old GIF
> (`assets/keel-demo.gif`) shows the *soft* brake; this new clip is the *hard* one.

**Talking points (true, use freely):**
- The old failure story still opens it: agent told "clean up and push," deletes a
  live file, force-pushes over a teammate. *(Your existing thread below nails this.)*
- The new twist: *"I shipped the fix that would've stopped it — not a smarter
  prompt, an actual brake."*
- Two layers: the skill **reasons**; the hook **enforces**. The hook fires even if
  the model wouldn't have stopped.
- The killer line for production people: **no human present → it doesn't ask, it
  denies.** Headless agents and CI can't "stop and ask" — so Keel stops.
- Every decision is logged to `.keel/audit.jsonl` — an audit trail of what the
  agent tried and what got blocked.
- **Spicy angle (observed, verify before headlining):** in the recorded demo,
  Claude Code's own permission prompts were set to *skip* — and the Keel hook
  stopped the commit and push *anyway*. "I turned the safety off and it still
  braked." Real, but seen once so far — see `enforcement-proof.md` before making it
  the centerpiece.
- **Stay honest (this builds trust):** it's a *backstop, not a sandbox*. It catches
  accidents and drift, not an adversarial agent. Say so — the credibility is worth
  more than the overclaim.

**Skeleton thread (rewrite in your voice):**

> **1/** [the failure hook — your voice. The "clean up and push" disaster.]
> *(attach the new enforcement clip)*
>
> **2/** Last time I shared this, Keel *told* the agent to stop. Honest gap: that
> still depended on the model listening.
>
> **3/** v0.4.0 closes it. A hook now checks every action *before* it runs — push,
> deploy, rm, writes to your hot paths — and stops the dangerous ones cold.
>
> **4/** The part I care about most: when the agent runs headless — CI, a scheduled
> job — there's no one to approve. So it doesn't ask. It **denies**. "Stop and ask"
> only works if someone's there to ask.
>
> **5/** Still MIT, still a runtime-neutral open spec, still your rules in one
> `AGENT_POLICY.md`. And still honest: it's a backstop, not a sandbox.
> github.com/quitohooded/keel-skills

---

## Earlier drafts — v0.3.0 repositioning (MIT + open spec)

Still usable, especially the failure-story opening. Four formats: a full X thread,
a short punchy X variant, a LinkedIn/blog post, and a Spanish version.

---

## X / Twitter thread (EN)

**1/**
I gave an AI agent a normal instruction — "clean up the repo and push so the build
is green."

It deleted a file that was still imported and force-pushed over a teammate's commit.

The fix isn't a smarter model. It's a written rule about when to stop.

That rule is Keel Skills.

*(Attach `assets/keel-demo.gif` to this first tweet.)*

**2/**
Most "go do it" instructions aren't actually permission to do *it*. They're a goal.

Keel Skills sorts what looks like permission into three things:
• a goal ("make it better") → investigate + propose
• a method ("use a migration") → still not a yes
• a green light (a clear yes to this exact thing) → act, and don't exceed the scope

**3/**
Before any action that writes, pushes, deploys, sends, or deletes, it runs a
4-step test:

read-only? → free
hot zone? → ask
structural? → ask
otherwise → act and report

Anything outward or irreversible stops and asks. In doubt → it asks.

**4/**
It ships generic. Your specifics — which paths are hot, where your source of truth
lives — go in one file you control: `AGENT_POLICY.md`.

The framework has zero of your data inside. There are ready-made packs for
Next.js/Vercel and Supabase.

**5/**
Today it's MIT and the model is a runtime-neutral open spec — so it can be
reimplemented outside Claude Code. I want this to be a *standard* for agent
governance, not a walled product.

Install + spec + demo 👇
github.com/quitohooded/keel-skills

---

## X / Twitter — short variant (EN, 3 tweets)

A punchier cut for when you don't want the full thread. Same demo, lead with it.

**1/**
I told an AI agent: "clean up the repo and push so the build's green."

It deleted a still-imported file and force-pushed over a teammate's commit. Green
build, real damage.

The fix isn't a smarter model — it's a written rule for when to stop. That's Keel Skills.

*(Attach `assets/keel-demo.gif` to this first tweet.)*

**2/**
Keel Skills gives the agent one reflex before it writes, pushes, deploys, or deletes:

read-only? → go
hot / outward / irreversible? → stop and ask
in doubt? → ask

Generic by default. Your specifics live in one file *you* control.

**3/**
MIT, self-hosted, runtime-neutral open spec. I'd rather agent governance be a shared
standard than a walled product.

github.com/quitohooded/keel-skills

---

## LinkedIn / blog post (EN)

**The brake your AI agent doesn't have**

I run coding agents in production every day. The failure that scared me wasn't a
hallucination — it was an agent doing exactly what I literally said.

"Clean up the repo and push so the build is green." It deleted a directory that
still had a live import and force-pushed over a colleague's commit. Green build,
real damage. The instruction was a *goal*, and the agent treated it as *permission*.

A smarter model doesn't fix that. A written rule about when to stop does.

That's what Keel Skills is. Three things, distilled from operating agents in real
work:

- **Permission** — it sorts what looks like permission into three things (a goal /
  a method / a green light, and only a green light means go) and runs a 4-step
  check before anything that writes, pushes, deploys, sends, or deletes. Read-only
  is free; anything risky, outward, or hard to undo stops and asks; in doubt, it asks.
- **Delegation** — cheapest model that does the job well, shallow subagents, no
  self-escalation. Don't burn the budget running the top model on a mechanical task.
- **Context discipline** — files are the source of truth, not the chat. Know when
  to end a long session and hand off cleanly.

It ships generic. Everything specific to your project lives in a single
`AGENT_POLICY.md` you control — so the framework has none of your data in it.

I just relicensed it to **MIT** and published the authorization model as a
**runtime-neutral open spec**. The bet: fine-grained governance — *when an agent
may act alone* — is exactly where the big orchestration platforms are coarse. I'd
rather it become a shared standard than a walled product.

It's free, self-hosted, MIT. If it helps you, tell me what you applied it to.

→ github.com/quitohooded/keel-skills

---

## Versión en español (para tus canales)

**El freno que tu agente de IA no tiene**

Corro agentes de código en producción todos los días. El error que me asustó no fue
una alucinación: fue un agente haciendo *exactamente* lo que le dije.

"Limpiá el repo y pusheá para que el build quede verde." Borró una carpeta que
todavía tenía un import vivo e hizo force-push encima del commit de un compañero.
Build verde, daño real. La instrucción era un *objetivo*, y el agente la trató como
*permiso*.

Un modelo más inteligente no arregla eso. Una regla escrita de cuándo frenar, sí.

Eso es Keel Skills. Tres cosas, destiladas de operar agentes en trabajo real:

- **Permisos** — ordena lo que parece permiso en tres cosas (un objetivo / un
  método / una luz verde, y solo la luz verde habilita) y corre un chequeo de 4
  pasos antes de cualquier acción que escriba, pushee, deploye, envíe o borre. Lo
  read-only es libre; lo riesgoso, hacia afuera o difícil de deshacer frena y
  pregunta; ante la duda, pregunta.
- **Delegación** — el modelo más barato que rinda, subagentes poco profundos, sin
  auto-escalar. No quemes el presupuesto corriendo el modelo más caro en una tarea
  mecánica.
- **Disciplina de contexto** — los archivos son la fuente de verdad, no el chat.

Se distribuye genérico. Todo lo específico de tu proyecto vive en un solo
`AGENT_POLICY.md` que vos controlás.

Lo relicencié a **MIT** y publiqué el modelo de autorización como un **spec abierto
y neutral al runtime**. La apuesta: la gobernanza fina —*cuándo un agente puede
actuar solo*— es justo donde las plataformas grandes de orquestación son gruesas.
Prefiero que sea un estándar compartido y no un producto cerrado.

Es gratis, self-hosted, MIT. Si te sirve, contame en qué lo aplicaste.

→ github.com/quitohooded/keel-skills
