---
description: Scaffold an AGENT_POLICY.md in the current project by interviewing the user about their hot zones, source-of-truth files, and overrides.
---

# Initialize an AGENT_POLICY.md

Create a project-specific `AGENT_POLICY.md` so the Keel Skills framework knows this
project's specifics.

Steps:

1. Check whether an `AGENT_POLICY.md` already exists at the project root. If it
   does, read it and offer to review/extend it rather than overwriting.
2. Read the template at `${CLAUDE_PLUGIN_ROOT}/templates/AGENT_POLICY.template.md`
   to recall the structure.
3. Briefly explore the project (top-level layout, build/deploy config, any
   existing decisions or docs) to make informed suggestions — don't ask the user
   things you can infer from the repo.
4. Ask the user, concisely, for the parts you cannot infer:
   - Which surfaces are **client/external-facing**?
   - What counts as **production / data / infra** here?
   - Which **outward/irreversible actions** matter (push, deploy, send, charge)?
   - Where does the **source of truth** live, and where should **decisions/state**
     be recorded?
   - Any **model-tier overrides** or project-specific definitions?
5. Write a filled-in `AGENT_POLICY.md` at the project root. Keep it short and
   concrete — every hot zone should be a real path or a real action.
6. Show the user the result and confirm before treating it as authoritative.

This file is configuration, not source code — creating it is a low-impact,
reversible action. But the *content* defines what the agent will treat as hot, so
have the user confirm it.
