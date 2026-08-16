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
  // Reaches into subprojects on purpose: it is what lets a case show that the
  // session-root policy still applies where a nested policy says nothing.
  '  - "**/deploy/**"',
  // Also reaches inside, and the nested policy standing-allows it. That pair is
  // what makes the "a subproject may loosen, but only by saying so" rule
  // testable: without the nested layer this path comes back hot.
  '  - "**/vendor/**"',
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

// A project nested inside it, with a policy of its own. This is the ordinary
// case of opening a session on a workspace of several repos, and it is where
// resolving the policy from the session directory alone silently governs a
// subproject with the wrong rules.
fs.mkdirSync(path.join(PROJ, "sub"), { recursive: true });
fs.writeFileSync(path.join(PROJ, "sub", "AGENT_POLICY.md"), [
  "# Nested policy",
  "",
  "```keel-policy",
  "hot_paths:",
  '  - "lib/**"',
  "standing_allow_paths:",
  '  - "scratch/**"',
  '  - "vendor/**"',
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

  // --- The approval channel. `ask` only brakes if somebody can answer it.
  // Measured 2026-08-16: under bypassPermissions an `ask` is inert and the
  // action runs, while a `deny` blocks. These cases pin that distinction.
  ["bypassPermissions denies hot command",
    { tool_name: "Bash", tool_input: { command: "git push origin main" }, permission_mode: "bypassPermissions" }, {}, "deny"],
  ["bypassPermissions denies hot path",
    { tool_name: "Write", tool_input: { file_path: "src/app/page.tsx" }, permission_mode: "bypassPermissions" }, {}, "deny"],
  ["bypassPermissions denies hot mcp",
    { tool_name: "mcp__x__deploy_to_vercel", tool_input: {}, permission_mode: "bypassPermissions" }, {}, "deny"],
  ["dontAsk denies hot command",
    { tool_name: "Bash", tool_input: { command: "rm -rf build/" }, permission_mode: "dontAsk" }, {}, "deny"],

  // Negative controls: the degrade must not swallow everything. A closed
  // channel changes the verdict for HOT actions only — it never makes a benign
  // call hot, and it never overrides a standing approval.
  ["bypassPermissions still allows benign",
    { tool_name: "Bash", tool_input: { command: "ls -la" }, permission_mode: "bypassPermissions" }, {}, "allow"],
  ["bypassPermissions still honours standing allow",
    { tool_name: "Bash", tool_input: { command: "npm run build" }, permission_mode: "bypassPermissions" }, {}, "allow"],
  ["bypassPermissions still allows read-only",
    { tool_name: "Read", tool_input: { file_path: "src/x.ts" }, permission_mode: "bypassPermissions" }, {}, "allow"],

  // Modes where prompting still works keep asking. Denying here would fire the
  // brake on a healthy state, which is the failure mode the repo already names.
  ["default mode still asks",
    { tool_name: "Bash", tool_input: { command: "git push origin main" }, permission_mode: "default" }, {}, "ask"],
  ["acceptEdits still asks",
    { tool_name: "Bash", tool_input: { command: "git push origin main" }, permission_mode: "acceptEdits" }, {}, "ask"],
  ["auto still asks",
    { tool_name: "Bash", tool_input: { command: "git push origin main" }, permission_mode: "auto" }, {}, "ask"],
  ["absent permission_mode still asks",
    { tool_name: "Bash", tool_input: { command: "git push origin main" } }, {}, "ask"],
  ["unknown permission_mode still asks",
    { tool_name: "Bash", tool_input: { command: "git push origin main" }, permission_mode: "some-future-mode" }, {}, "ask"],

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

  // --- Nested projects. The policy that governs a write is the nearest one
  // above the file, matched against a path relative to *its* root. Before this,
  // `sub/lib/**` was invisible: the subproject's policy was never read, and its
  // globs could not have matched the session-relative path even if it had been.
  ["nested policy governs its own path",
    { tool_name: "Write", tool_input: { file_path: "sub/lib/db.ts" } }, {}, "ask"],
  ["nested standing allow is honoured",
    { tool_name: "Edit", tool_input: { file_path: "sub/scratch/tmp.md" } }, {}, "allow"],
  // Discriminating: the root declares `**/vendor/**` hot and the subproject
  // standing-allows `vendor/**`. Nearest speaks first, so the subproject's own
  // declaration wins — a project may loosen a rule about its own files, but
  // only by saying so. Without the nested layer this comes back `ask`.
  ["nested standing allow overrides a root hot path",
    { tool_name: "Write", tool_input: { file_path: "sub/vendor/lib.js" } }, {}, "allow"],

  // The nearest policy wins only where it speaks. Silence falls through to the
  // session root, so a subproject cannot loosen a rule by merely existing —
  // only by declaring a standing allowance.
  // The root's `**/deploy/**` reaches inside the subproject; the nested policy
  // says nothing about it, so the root's rule stands.
  ["nested silence falls through to session root",
    { tool_name: "Write", tool_input: { file_path: "sub/deploy/ship.sh" } }, {}, "ask"],
  // And an anchored root pattern does NOT leak into the subproject: the root
  // says `src/**`, which is its own src, not `sub/src`.
  ["anchored root pattern does not reach into the subproject",
    { tool_name: "Write", tool_input: { file_path: "sub/src/x.ts" } }, {}, "allow"],
  ["nested path nobody declares stays allowed",
    { tool_name: "Write", tool_input: { file_path: "sub/notes.md" } }, {}, "allow"],

  // The outer policy keeps working unchanged for files it owns.
  ["session-root policy still applies outside the subproject",
    { tool_name: "Write", tool_input: { file_path: "src/app/page.tsx" } }, {}, "ask"],

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
      // Spread the case, don't rebuild it. This line used to pick out
      // `tool_name` and `tool_input` by hand, which silently dropped every
      // other field the harness sends — so a case about `permission_mode`
      // could be written, run, and pass against the old behaviour, because the
      // field never reached the hook. A bank that cannot express an input
      // cannot verify anything about it.
      got = run({ ...input, cwd: PROJ }, env);
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
