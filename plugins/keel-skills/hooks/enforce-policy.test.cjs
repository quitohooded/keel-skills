/**
 * enforce-policy.test.cjs — dependency-free test runner for the PreToolUse hook.
 * Run: node plugins/keel-skills/hooks/enforce-policy.test.cjs
 * Exits non-zero on any failure (used by CI).
 */

"use strict";

const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const HOOK = path.join(__dirname, "enforce-policy.cjs");

// A throwaway project dir with a policy that exercises paths + standing approvals.
const PROJ = fs.mkdtempSync(path.join(os.tmpdir(), "keel-test-"));
fs.writeFileSync(path.join(PROJ, "AGENT_POLICY.md"), [
  "# Test policy",
  "",
  "```keel-policy",
  "hot_paths:",
  '  - "src/**"',
  '  - "supabase/migrations/**"',
  "hot_mcp:",
  '  - "notion-update-page"',
  "standing_allow_commands:",
  '  - "npm run build"',
  "standing_allow_paths:",
  '  - "_borradores/**"',
  "standing_allow_mcp:",
  '  - "delete_draft"',
  "```",
  "",
].join("\n"));

// Build a hermetic child env: strip any ambient CI / KEEL_NONINTERACTIVE (GitHub
// Actions sets CI=true, which would otherwise force every `ask` case to `deny`),
// then apply the per-case overrides so headless cases opt in explicitly.
function childEnv(env) {
  const base = { ...process.env, CLAUDE_PROJECT_DIR: PROJ };
  delete base.CI;
  delete base.KEEL_NONINTERACTIVE;
  return { ...base, ...env };
}

function run(input, env) {
  const out = execFileSync("node", [HOOK], {
    input: JSON.stringify(input),
    env: childEnv(env),
    encoding: "utf8",
  });
  return JSON.parse(out).hookSpecificOutput.permissionDecision;
}

const cases = [
  // [name, toolInput, env, expected]
  ["read-only Read", { tool_name: "Read", tool_input: { file_path: "src/x.ts" } }, {}, "allow"],
  ["Grep", { tool_name: "Grep", tool_input: { pattern: "x" } }, {}, "allow"],
  ["git push", { tool_name: "Bash", tool_input: { command: "git push origin main" } }, {}, "ask"],
  ["git push headless", { tool_name: "Bash", tool_input: { command: "git push origin main" } }, { KEEL_NONINTERACTIVE: "1" }, "deny"],
  ["git push --force", { tool_name: "Bash", tool_input: { command: "git push --force origin main" } }, {}, "ask"],
  ["rm -rf", { tool_name: "Bash", tool_input: { command: "rm -rf build/" } }, {}, "ask"],
  ["benign ls", { tool_name: "Bash", tool_input: { command: "ls -la" } }, {}, "allow"],
  ["npm run build (standing)", { tool_name: "Bash", tool_input: { command: "npm run build" } }, {}, "allow"],
  ["write src/** hot", { tool_name: "Write", tool_input: { file_path: "src/app/page.tsx" } }, {}, "ask"],
  ["write migrations hot", { tool_name: "Write", tool_input: { file_path: "supabase/migrations/001.sql" } }, {}, "ask"],
  ["edit _borradores (standing)", { tool_name: "Edit", tool_input: { file_path: "_borradores/nota.md" } }, {}, "allow"],
  ["write README not hot", { tool_name: "Write", tool_input: { file_path: "README.md" } }, {}, "allow"],
  ["mcp deploy", { tool_name: "mcp__x__deploy_to_vercel", tool_input: {} }, {}, "ask"],
  ["mcp execute_sql headless", { tool_name: "mcp__db__execute_sql", tool_input: {} }, { KEEL_NONINTERACTIVE: "1" }, "deny"],
  ["mcp read-ish list", { tool_name: "mcp__x__list_channels", tool_input: {} }, {}, "allow"],
  ["malformed input fails open", "__RAW__", {}, "allow"],

  // --- Compound commands. A standing allowance must not vouch for what it is
  // --- chained to. Before the per-segment split these five all returned allow.
  ["standing allow && hot", { tool_name: "Bash", tool_input: { command: "npm run build && git push --force origin main" } }, {}, "ask"],
  ["standing allow ; hot", { tool_name: "Bash", tool_input: { command: "npm run build; git push" } }, {}, "ask"],
  ["standing allow | hot", { tool_name: "Bash", tool_input: { command: "npm run build | tee log && rm -rf dist" } }, {}, "ask"],
  ["hot inside $( )", { tool_name: "Bash", tool_input: { command: "echo $(git push origin main)" } }, {}, "ask"],
  ["hot on a second line", { tool_name: "Bash", tool_input: { command: "npm run build\ngit push" } }, {}, "ask"],
  ["chained hot headless", { tool_name: "Bash", tool_input: { command: "npm run build && git push" } }, { KEEL_NONINTERACTIVE: "1" }, "deny"],
  // The valve still opens: chaining two benign commands stays allowed.
  ["standing allow && benign", { tool_name: "Bash", tool_input: { command: "npm run build && ls -la" } }, {}, "allow"],

  // --- MCP refinement from the policy.
  ["mcp hot from policy", { tool_name: "mcp__notion__notion-update-page", tool_input: {} }, {}, "ask"],
  ["mcp standing allow beats default", { tool_name: "mcp__notes__delete_draft", tool_input: {} }, {}, "allow"],
];

let failed = 0;
for (const [name, input, env, expected] of cases) {
  let got;
  try {
    if (input === "__RAW__") {
      const out = execFileSync("node", [HOOK], { input: "not json", env: childEnv({}), encoding: "utf8" });
      got = JSON.parse(out).hookSpecificOutput.permissionDecision;
    } else {
      got = run({ tool_name: input.tool_name, tool_input: input.tool_input, cwd: PROJ }, env);
    }
  } catch (e) {
    got = "ERROR:" + e.message;
  }
  const ok = got === expected;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}  → ${got}${ok ? "" : "  (expected " + expected + ")"}`);
}

try { fs.rmSync(PROJ, { recursive: true, force: true }); } catch {}

console.log(`\n${cases.length - failed}/${cases.length} passed`);
if (failed) process.exit(1);
