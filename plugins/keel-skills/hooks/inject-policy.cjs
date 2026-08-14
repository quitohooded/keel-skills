/**
 * inject-policy.cjs — Keel Skills SessionStart hook.
 * ----------------------------------------------------------------------------
 * Puts the project's AGENT_POLICY.md into context at the start of every session,
 * so the policy stops depending on the agent choosing to read it.
 *
 * When there is no policy the hook emits one short nudge instead. A framework
 * that is installed but never configured is the most common way this fails:
 * the enforcement hook still runs on the SPEC §4 defaults, but nothing knows
 * what *this* project treats as hot. The nudge is deliberately two lines and
 * self-silencing — see SKIP below.
 */

const fs = require("fs");
const path = require("path");

const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const policyPath = path.join(projectDir, "AGENT_POLICY.md");

let content;
try {
  content = fs.readFileSync(policyPath, "utf8");
} catch {
  nudge();
  process.exit(0);
}

if (!content.trim()) {
  nudge();
  process.exit(0);
}

process.stdout.write(
  "=== AGENT_POLICY.md — Keel Skills project governance policy ===\n" +
  "This project ships a Keel Skills AGENT_POLICY.md. Treat it as AUTHORITATIVE for\n" +
  "this project's hot zones, source-of-truth files, where to record state, and any\n" +
  "standing approvals. It overrides the generic defaults in the Keel Skills skills.\n\n" +
  content.trimEnd() + "\n" +
  "=== end AGENT_POLICY.md ===\n"
);

/**
 * One line, once the user has opted out it never prints again. Two ways to
 * silence it: create the policy (the point), or `.keel/skip-onboarding` (for a
 * project that deliberately runs on the defaults). Anything noisier than this
 * gets ignored, and an ignored warning is worse than no warning.
 */
function nudge() {
  try {
    if (fs.existsSync(path.join(projectDir, ".keel", "skip-onboarding"))) return;
  } catch {
    return;
  }
  process.stdout.write(
    "Keel Skills is installed but this project has no AGENT_POLICY.md, so the guardrails\n" +
    "are running on generic defaults and know nothing about this project. Run " +
    "/keel-skills:onboard\n" +
    "to set it up (or `touch .keel/skip-onboarding` to keep the defaults and silence this).\n"
  );
}
