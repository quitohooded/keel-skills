# Policy packs

Ready-made `AGENT_POLICY.md` starting points for common stacks. Copy the one
closest to your project to your repo root as `AGENT_POLICY.md`, then trim and
adjust — every hot zone should be a **real path or a real action** in *your*
project.

These are starting points, not finished policies. `/keel-skills:policy-init` can
generate one tailored to your repo by interviewing you; these packs are for when
you'd rather start from a known-good baseline and edit.

| Pack | Use it when your project is… |
|------|------------------------------|
| [`web-app-deploy/`](web-app-deploy/AGENT_POLICY.md) | Any web app with a build + deploy and some client-facing surface. The generic baseline. |
| [`nextjs-vercel/`](nextjs-vercel/AGENT_POLICY.md) | A Next.js / Astro / SvelteKit app deployed on Vercel (or similar). |
| [`supabase/`](supabase/AGENT_POLICY.md) | Backed by Supabase / Postgres with migrations, RLS, and edge functions. |

## Contributing a pack

Adding a pack for a stack that isn't here is one of the easiest and most useful
ways to contribute — see [`../CONTRIBUTING.md`](../CONTRIBUTING.md). A good pack:

- lists **concrete** hot zones (real paths, real actions), not vague categories;
- names the source-of-truth files typical of that stack;
- says where decisions/state are usually recorded;
- stays short — a pack you have to trim is better than one you have to research.
