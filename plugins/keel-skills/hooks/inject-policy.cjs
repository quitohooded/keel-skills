const fs = require("fs");
const path = require("path");

const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const policyPath = path.join(projectDir, "AGENT_POLICY.md");

let content;
try {
  content = fs.readFileSync(policyPath, "utf8");
} catch {
  process.exit(0);
}

if (!content.trim()) process.exit(0);

process.stdout.write(
  "=== AGENT_POLICY.md — Keel Skills project governance policy ===\n" +
  "This project ships a Keel Skills AGENT_POLICY.md. Treat it as AUTHORITATIVE for\n" +
  "this project's hot zones, source-of-truth files, where to record state, and any\n" +
  "standing approvals. It overrides the generic defaults in the Keel Skills skills.\n\n" +
  content.trimEnd() + "\n" +
  "=== end AGENT_POLICY.md ===\n"
);
