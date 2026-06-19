---
name: Keel-compatible implementation
about: You built an implementation of the Keel authorization model for another runtime and want it listed
title: "[impl] <runtime> — <name>"
labels: implementation
---

Thanks for building a Keel-compatible implementation! Fill this in so it can be
listed in the README.

**Name / link:**

**Runtime it targets** (Claude Code, Agent SDK, other harness, CI gate, …):

**Spec version it targets** (see [SPEC.md](../../SPEC.md), §9):

**Conformance** — confirm it satisfies [SPEC.md §8](../../SPEC.md):
- [ ] Reads `AGENT_POLICY.md` and treats it as authoritative
- [ ] Runs the four-step test before every action (§3)
- [ ] Treats every §4 default category as hot unless concretely refined
- [ ] Only inherits approval via mechanical propagation when all §5 conditions hold
- [ ] Never lets a subagent grant L3 (if it supports delegation)
- [ ] Resolves any doubt toward L3

**Anything that diverges from the spec, and why:**
