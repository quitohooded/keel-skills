/**
 * enforce-policy.cjs — Keel Skills PreToolUse enforcement hook.
 * ----------------------------------------------------------------------------
 * The "hard" counterpart to inject-policy.cjs. Where inject-policy.cjs only
 * injects an AGENT_POLICY.md into context (soft), this hook inspects each tool
 * call BEFORE it runs and returns allow / ask / deny. `ask` is the request for a
 * green light: it forces an explicit human approval prompt.
 *
 * TWO LAYERS, DEFENSE IN DEPTH. This hook does NOT re-implement the interpretive
 * four-step check (SPEC §3) — that stays the model's job via the
 * authorization-protocol skill. The hook enforces only the *concrete, mechanical*
 * subset of a policy: hot paths (globs) and hot commands (patterns). The skill
 * reasons; the hook backstops.
 *
 * NOT A SECURITY BOUNDARY. A determined or jailbroken model can evade
 * command-pattern matching (e.g. `g=push; git $g`). This catches accidents,
 * drift, and hallucinated actions — it raises assurance a lot — but real
 * isolation needs scoped credentials and a sandbox. Say so in your docs.
 *
 * DECISION CONTRACT (Claude Code PreToolUse):
 *   stdin  = JSON { tool_name, tool_input, cwd, ... }
 *   stdout = JSON { hookSpecificOutput: {
 *              hookEventName: "PreToolUse",
 *              permissionDecision: "allow" | "ask" | "deny",
 *              permissionDecisionReason: string } }
 *
 * POLICY BLOCK. Reads an optional fenced ```keel-policy block from the project's
 * AGENT_POLICY.md (the prose stays for the model; this block is for the hook).
 * Flat lists only, so the parser stays dependency-free. See SPEC §7 and the
 * template at templates/AGENT_POLICY.template.md.
 *
 * Headless (KEEL_NONINTERACTIVE=1 or CI): `ask` cannot be answered, so a hot
 * action degrades to `deny`.
 */

"use strict";

const fs = require("fs");
const path = require("path");

// --- Defaults from SPEC §4. A policy MAY refine these but MUST NOT remove a
// --- category, so these stay in effect even with a minimal (or absent) policy.
const DEFAULT_HOT_COMMANDS = [
  "git push",
  "git commit",          // spec lists commit as outward; gate it, see note below
  "git reset --hard",
  "rm -rf",
  "rm -fr",
  "drop table",
  "drop database",
  "truncate",
  "vercel deploy",
  "vercel --prod",
  "supabase db push",
  "migrate",
  "npm publish",
];
// Note on fatigue: `git commit` gating is faithful to SPEC §4 but noisy for some
// workflows. The designed pressure valve is to add `git commit` to
// standing_allow_commands in your AGENT_POLICY.md — an explicit, recorded choice.

// MCP tool name substrings that are outward/irreversible by nature.
const DEFAULT_HOT_MCP = [
  "deploy", "execute_sql", "apply_migration", "create_post", "delete",
  "send", "publish", "merge_branch", "create_short_link", "charge",
];

const READONLY_TOOLS = new Set([
  "Read", "Grep", "Glob", "LS", "WebFetch", "WebSearch", "NotebookRead", "TodoWrite",
]);

const FILE_WRITE_TOOLS = new Set([
  "Write", "Edit", "MultiEdit", "NotebookEdit",
]);

// Headless / non-interactive: `ask` can't be answered, so it must degrade to deny.
// Detecting headless reliably from a hook is an open problem — this is pragmatic.
const NONINTERACTIVE =
  truthy(process.env.KEEL_NONINTERACTIVE) || truthy(process.env.CI);

const HOT_VERDICT = NONINTERACTIVE ? "deny" : "ask";

main();

function main() {
  let input;
  try {
    input = JSON.parse(readStdin());
  } catch {
    // Malformed hook input is the harness's contract, not the user's action.
    // Fail open so the workflow never wedges; this is a backstop layer.
    return decide("allow", "keel: unreadable hook input, deferring");
  }

  const toolName = input.tool_name || "";
  const toolInput = input.tool_input || {};
  const projectDir =
    process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();

  // Rule 1 — read-only tools are always free.
  if (READONLY_TOOLS.has(toolName)) {
    return decide("allow", "keel: read-only tool");
  }

  const policy = loadPolicy(projectDir);

  try {
    if (toolName === "Bash") {
      return classifyCommand(String(toolInput.command || ""), policy, projectDir);
    }
    if (FILE_WRITE_TOOLS.has(toolName)) {
      return classifyPath(String(toolInput.file_path || toolInput.notebook_path || ""), policy, projectDir, toolName);
    }
    if (toolName.startsWith("mcp__")) {
      return classifyMcp(toolName, projectDir);
    }
  } catch (e) {
    // Any internal error: fail open, but record it loudly.
    audit(projectDir, { tool: toolName, verdict: "allow", rule: "error:" + e.message });
    return decide("allow", "keel: internal error, deferring");
  }

  // Rule 4 — otherwise defer to the model + normal permission system.
  return decide("allow", "keel: not a concrete hot pattern");
}

// --- Classifiers -------------------------------------------------------------

function classifyCommand(command, policy, projectDir) {
  const norm = command.toLowerCase().replace(/\s+/g, " ").trim();

  // Rule 2 — standing approval (scoped) wins. SPEC §5 inheritance.
  for (const allow of policy.standing_allow_commands) {
    if (norm.includes(allow.toLowerCase())) {
      audit(projectDir, { tool: "Bash", input: digest(command), verdict: "allow", rule: "standing_allow:" + allow });
      return decide("allow", "keel: covered by standing approval (" + allow + ")");
    }
  }

  // Rule 3 — hot command pattern.
  const hot = [...DEFAULT_HOT_COMMANDS, ...policy.hot_commands];
  for (const pat of hot) {
    if (norm.includes(pat.toLowerCase())) {
      audit(projectDir, { tool: "Bash", input: digest(command), verdict: HOT_VERDICT, rule: "hot_command:" + pat });
      return decide(HOT_VERDICT, reasonHot("command matches hot pattern `" + pat + "`"));
    }
  }

  audit(projectDir, { tool: "Bash", input: digest(command), verdict: "allow", rule: "no_match" });
  return decide("allow", "keel: command not in hot set");
}

function classifyPath(filePath, policy, projectDir, toolName) {
  if (!filePath) return decide("allow", "keel: no file path");
  const rel = toRel(filePath, projectDir);

  for (const allow of policy.standing_allow_paths) {
    if (globMatch(allow, rel)) {
      audit(projectDir, { tool: toolName, input: rel, verdict: "allow", rule: "standing_allow_path:" + allow });
      return decide("allow", "keel: path covered by standing approval (" + allow + ")");
    }
  }

  for (const pat of policy.hot_paths) {
    if (globMatch(pat, rel)) {
      audit(projectDir, { tool: toolName, input: rel, verdict: HOT_VERDICT, rule: "hot_path:" + pat });
      return decide(HOT_VERDICT, reasonHot("writes to hot path `" + rel + "` (matches `" + pat + "`)"));
    }
  }

  audit(projectDir, { tool: toolName, input: rel, verdict: "allow", rule: "no_match" });
  return decide("allow", "keel: path not in hot set");
}

function classifyMcp(toolName, projectDir) {
  const lower = toolName.toLowerCase();
  for (const sub of DEFAULT_HOT_MCP) {
    if (lower.includes(sub)) {
      audit(projectDir, { tool: toolName, verdict: HOT_VERDICT, rule: "hot_mcp:" + sub });
      return decide(HOT_VERDICT, reasonHot("MCP tool `" + toolName + "` is outward/irreversible"));
    }
  }
  audit(projectDir, { tool: toolName, verdict: "allow", rule: "no_match" });
  return decide("allow", "keel: MCP tool not in hot set");
}

// --- Policy loading ----------------------------------------------------------

function loadPolicy(projectDir) {
  const empty = { hot_paths: [], hot_commands: [], standing_allow_commands: [], standing_allow_paths: [] };
  let text;
  try {
    text = fs.readFileSync(path.join(projectDir, "AGENT_POLICY.md"), "utf8");
  } catch {
    return empty;
  }
  const m = text.match(/```keel-policy\s*\n([\s\S]*?)```/);
  if (!m) return empty;
  return parseFlatLists(m[1], empty);
}

// Deliberately tiny flat-list parser: `key:` then `  - "value"` lines. No nesting,
// no YAML dependency. Anything fancier is ignored rather than mis-parsed.
function parseFlatLists(block, base) {
  const out = { ...base };
  let key = null;
  for (const raw of block.split("\n")) {
    const line = raw.replace(/\r$/, "");
    const keyMatch = line.match(/^([a-z_]+):\s*$/);
    if (keyMatch) { key = keyMatch[1]; if (!out[key]) out[key] = []; continue; }
    const itemMatch = line.match(/^\s*-\s*(.+?)\s*$/);
    if (itemMatch && key && out[key]) {
      out[key].push(unquote(itemMatch[1]));
    }
  }
  return out;
}

// --- Helpers -----------------------------------------------------------------

function decide(permissionDecision, permissionDecisionReason) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision,
      permissionDecisionReason,
    },
  }));
  process.exit(0);
}

function reasonHot(why) {
  return NONINTERACTIVE
    ? "keel: BLOCKED (no human present to give a green light) — " + why
    : "keel: needs a green light (explicit approval) — " + why;
}

function audit(projectDir, record) {
  try {
    const dir = path.join(projectDir, ".keel");
    fs.mkdirSync(dir, { recursive: true });
    const line = JSON.stringify({ ts: new Date().toISOString(), ...record }) + "\n";
    fs.appendFileSync(path.join(dir, "audit.jsonl"), line);
  } catch {
    // Logging must never block an action. Swallow.
  }
}

function toRel(filePath, projectDir) {
  let abs;
  try { abs = path.resolve(projectDir, filePath); } catch { abs = filePath; }
  let rel = path.relative(projectDir, abs);
  return rel.split(path.sep).join("/"); // normalize Windows backslashes
}

// Minimal glob: `**` = any chars incl. `/`; `*` = any chars except `/`.
function globMatch(pattern, value) {
  const re = "^" + pattern
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*/g, " ")
    .replace(/\*/g, "[^/]*")
    .replace(/ /g, ".*") + "$";
  return new RegExp(re).test(value);
}

function unquote(s) {
  return s.replace(/^["']/, "").replace(/["']$/, "").trim();
}

function digest(s) {
  return s.length > 200 ? s.slice(0, 197) + "..." : s;
}

function truthy(v) {
  return v != null && v !== "" && v !== "0" && String(v).toLowerCase() !== "false";
}

function readStdin() {
  try { return fs.readFileSync(0, "utf8"); } catch { return ""; }
}
