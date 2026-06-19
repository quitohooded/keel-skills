# Launch drafts — Keel Skills v0.3.0

Build-in-public copy for the v0.3.0 repositioning (MIT + open spec). Edit to taste,
then post from your own accounts. Three formats: an X/Twitter thread, a longer
LinkedIn/blog post, and a Spanish version for your channels.

> Replace `[DEMO_GIF]` once you've recorded the 60s demo (`examples/demo-script.md`).
> The clip is what makes this land — lead with it if you have it.

---

## X / Twitter thread (EN)

**1/**
I gave an AI agent a normal instruction — "clean up the repo and push so the build
is green."

It deleted a file that was still imported and force-pushed over a teammate's commit.

The fix isn't a smarter model. It's a written rule about when to stop.

That rule is Keel Skills. [DEMO_GIF]

**2/**
Most "go do it" instructions aren't actually permission to do *it*. They're a goal.

Keel Skills gives an agent a 3-level model:
• broad mandate → investigate + propose
• naming the mechanism → still not approval
• explicit scoped approval → execute, and don't exceed the scope

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

- **Authorization** — a 3-level model (broad mandate / mechanism / explicit scoped
  approval) and a 4-step test the agent runs before anything that writes, pushes,
  deploys, sends, or deletes. Read-only is free; anything hot, outward, or
  irreversible stops and asks; in doubt, it asks.
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

- **Autorización** — modelo de 3 niveles (mandato amplio / mecanismo / aprobación
  explícita con scope) y un test de 4 pasos antes de cualquier acción que escriba,
  pushee, deploye, envíe o borre. Lo read-only es libre; lo caliente, hacia afuera
  o irreversible frena y pregunta; ante la duda, pregunta.
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
