#!/usr/bin/env python3
"""keel_checks.py - mechanical drift checks for this project.

    python scripts/keel_checks.py          # exit 0 if no FAIL, 1 if any

WHY THIS EXISTS. Written rules decay: not because anyone disagrees with them,
but because the world moves and the document doesn't. This catches what a rule
written down could not prevent. Run it at BOTH ends of a session - at the start,
so drift from the last one shows up before you build on top of it, and at the
close, so you don't leave any.

THE CONTRACT, and any change must preserve it:
  * READ-ONLY. Writes nothing, leaves no marks, caches nothing between runs.
    Two sessions can run it at the same time without colliding.
  * DETERMINISTIC. Sorted output. Comparing two runs is how drift gets spotted,
    and unstable ordering destroys that.
  * DEPENDENCY-FREE. Standard library only, so it runs on a fresh clone.
  * AGGREGATES, NOT DUMPS. It reports conclusions. A tool an agent runs should
    never spend the context window it is trying to save.

THREE LEVELS, not pass/fail. A finding means different things depending on
whether someone has the file open right now, so version control decides:
  FAIL  the file is committed and clean -> real drift, it survived a session
        close. Blocks (exit 1), and is safe to fix: nobody has it in flight.
  WARN  the file is modified or untracked -> someone is working on it, and with
        parallel sessions it may not be you. Does not block; don't fix what
        isn't yours.
  info  a soft finding that needs human judgment, not a regex.
Without this split, "fix every finding before closing" ends up telling one
session to edit another session's in-flight files - the exact collision the
checks exist to prevent.

ADDING A CHECK. Add it under PROJECT CHECKS and register it in CHECKS at the
bottom. Two rules:
  1. Add a check when a real drift already got through undetected - not
     speculatively. That keeps the suite small enough that every failure means
     something and nobody learns to ignore it.
  2. Write down WHY it exists, right next to it. A check whose reason has been
     forgotten gets deleted the first time it is inconvenient.
"""

import os
import re
import subprocess
import sys
from datetime import date, datetime
from pathlib import Path

# --------------------------------------------------------------------------
# Configuration. Adjust to your project; keep every path relative to the root.
# --------------------------------------------------------------------------

# Assumes the script sits one level down from the project root (e.g. scripts/).
# KEEL_CHECKS_ROOT overrides it, for running the checks against a directory
# other than the one the script lives in.
ROOT = Path(os.environ.get("KEEL_CHECKS_ROOT")
            or Path(__file__).resolve().parent.parent).resolve()

POLICY = "AGENT_POLICY.md"
STATE_FILE = "STATE.md"        # what is true now - see AGENT_POLICY.md
HISTORY_FILE = "CHANGELOG.md"  # what happened, dated

# Ratchet: the files read at the start of EVERY session, in bytes. When this
# fails, remove content - do not raise the number. A ceiling that gets raised on
# every failure is a log, not a limit. Raising it deliberately is fine, but it
# happens in a commit where a human can see it.
CONTEXT_BUDGET_BYTES = 20_000

# A dated snapshot older than this is worth re-measuring or turning into a
# pointer. It is `info`, not FAIL: only a human can tell stale from stable.
SNAPSHOT_MAX_AGE_DAYS = 45

# The literal the shipped templates use for a date the user has to fill in. Its
# presence is how a never-filled template is told apart from a state file that
# genuinely lost its dates - the first is an unfinished setup, the second is drift.
TEMPLATE_PLACEHOLDER = "<YYYY-MM-DD>"

SKIP_DIRS = {".git", "node_modules", ".next", "dist", "build", "__pycache__",
             ".venv", "venv", ".mypy_cache", ".pytest_cache", "vendor"}

# Files exempt from the secret scan because containing secret-shaped strings is
# their job: this script (it defines the patterns), its test bank (it plants
# fake keys on purpose), and anywhere you keep fixtures. A file that describes
# what it is looking for will always match itself, and that is a failure mode of
# the method, not a finding. Keep this list short and justified - every entry is
# a place a real leak could hide.
SECRET_SCAN_SKIP = ("keel_checks.py", "test_keel_checks.py")

# --------------------------------------------------------------------------
# Reporting
# --------------------------------------------------------------------------

fails = 0
warns = 0


def title(text):
    print("\n== " + text)


def ok(msg):
    print("   OK    " + msg)


def info(msg):
    print("   info  " + msg)


def finding(path, msg):
    """Report at FAIL or WARN depending on whether the file is in flight."""
    global fails, warns
    if path is not None and _is_dirty(path):
        warns += 1
        print("   WARN  " + msg + "  (file is modified/untracked - may be another session's)")
    else:
        fails += 1
        print("   FAIL  " + msg)


# --------------------------------------------------------------------------
# Git state, read once
# --------------------------------------------------------------------------

def _git(*args):
    # errors="replace" on purpose: a non-UTF8 filename somewhere in the tree
    # must not crash the whole suite with a decode error.
    try:
        out = subprocess.run(["git", "-C", str(ROOT), *args], capture_output=True,
                             text=True, encoding="utf-8", errors="replace", timeout=30)
        return out.stdout if out.returncode == 0 else ""
    except (OSError, subprocess.SubprocessError):
        return ""


IS_REPO = bool(_git("rev-parse", "--git-dir").strip())

# The two git commands below disagree about what their paths are relative to, and
# getting this wrong is silent: `git status --porcelain` prints paths from the
# REPOSITORY ROOT, while `git ls-files` prints them from the CURRENT DIRECTORY.
# Resolving both against ROOT works only while ROOT happens to be the repo root.
# In a monorepo or any nested layout it makes every dirty path miss, so every
# finding reports FAIL even on a file another session has open — the exact
# collision the three levels exist to prevent, failing toward the unsafe side.
_TOPLEVEL = _git("rev-parse", "--show-toplevel").strip()
_REPO_ROOT = Path(_TOPLEVEL) if _TOPLEVEL else ROOT

_dirty = set()
for _line in _git("status", "--porcelain").splitlines():
    if len(_line) < 4:
        continue
    _rel = _line[3:].strip().strip('"')
    if " -> " in _rel:                      # renames
        _rel = _rel.split(" -> ")[-1]
    _dirty.add(str((_REPO_ROOT / _rel).resolve()))


def _is_dirty(path):
    """True when the file is uncommitted, or when we cannot tell.

    Not knowing resolves toward WARN on purpose: a false FAIL invites one
    session to 'fix' another session's work, which is worse than a soft report.
    """
    if not IS_REPO:
        return True
    return str(Path(path).resolve()) in _dirty


def tracked_files():
    """Committed files only, sorted. Untracked files belong to whoever is
    working right now, and scanning them produces noise, not drift."""
    if not IS_REPO:
        return sorted(p for p in ROOT.rglob("*")
                      if p.is_file() and not (SKIP_DIRS & set(p.parts)))
    out = []
    for rel in _git("ls-files").splitlines():
        p = ROOT / rel
        if p.is_file() and not (SKIP_DIRS & set(p.parts)):
            out.append(p)
    return sorted(out)


def read(path):
    try:
        return Path(path).read_text(encoding="utf-8", errors="ignore")
    except OSError:
        return ""


DATE_RE = re.compile(r"(20\d{2})-(\d{2})-(\d{2})")


def newest_date(text):
    """The most recent YYYY-MM-DD in the text, or None."""
    found = []
    for m in DATE_RE.finditer(text):
        try:
            found.append(date(int(m.group(1)), int(m.group(2)), int(m.group(3))))
        except ValueError:
            continue
    return max(found) if found else None


# ==========================================================================
# UNIVERSAL CHECKS - true for any project running Keel Skills
# ==========================================================================

def check_policy():
    """The policy exists, parses, and has something concrete in it.

    Why: a policy with prose but an empty machine-readable block looks
    configured and enforces nothing - the hook has no concrete pattern to match,
    so the hard backstop silently runs on defaults alone. That is the most
    common way this framework is installed but not actually working.
    """
    title("1. Policy present, parseable, and concrete")
    path = ROOT / POLICY
    if not path.exists():
        finding(path, f"{POLICY} not found at the project root. Run /keel-skills:onboard")
        return

    text = read(path)
    block = re.search(r"```keel-policy\s*\n(.*?)```", text, re.S)
    if not block:
        info(f"{POLICY} has no ```keel-policy block: the reasoning layer works, "
             "the enforcement hook falls back to defaults only")
        return

    keys = {}
    key = None
    for line in block.group(1).splitlines():
        km = re.match(r"^([a-z_]+):\s*$", line)
        if km:
            key = km.group(1)
            keys.setdefault(key, [])
            continue
        im = re.match(r"^\s*-\s*(.+?)\s*$", line)
        if im and key:
            keys[key].append(im.group(1).strip("\"'"))

    concrete = len(keys.get("hot_paths", [])) + len(keys.get("hot_commands", []))
    if concrete == 0:
        finding(path, "the keel-policy block declares no hot_paths and no hot_commands, "
                      "so it refines nothing")
        return

    unfilled = [v for vs in keys.values() for v in vs if v.startswith("<") and v.endswith(">")]
    if unfilled:
        finding(path, f"{len(unfilled)} placeholder(s) left in the keel-policy block "
                      f"(e.g. `{unfilled[0]}`): they match nothing")
        return

    ok(f"{concrete} concrete hot path(s)/command(s) declared")


def check_secrets():
    """No credential-shaped strings in committed files.

    Why: a secret in an untracked file is a mistake; a secret in a tracked one
    is already in the history of everyone who cloned. This only scans tracked
    files for exactly that reason.
    """
    title("2. No secrets in committed files")

    patterns = [
        ("private key", re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----")),
        ("AWS access key", re.compile(r"\bAKIA[0-9A-Z]{16}\b")),
        ("GitHub token", re.compile(r"\bgh[pousr]_[A-Za-z0-9]{36}\b")),
        ("Slack token", re.compile(r"\bxox[baprs]-[A-Za-z0-9-]{10,}")),
        ("OpenAI-style key", re.compile(r"\bsk-[A-Za-z0-9]{32,}\b")),
        ("assigned credential", re.compile(
            r"(?i)\b(api[_-]?key|secret|password|access[_-]?token)\b\s*[:=]\s*"
            r"[\"'][^\"'\s]{16,}[\"']")),
    ]
    hits = 0
    for path in tracked_files():
        if path.name in SECRET_SCAN_SKIP:
            continue
        if path.suffix in {".lock", ".png", ".jpg", ".gif", ".pdf"}:
            continue
        text = read(path)
        if not text:
            continue
        for label, rx in patterns:
            m = rx.search(text)
            if m:
                line = text[:m.start()].count("\n") + 1
                rel = path.relative_to(ROOT).as_posix()
                finding(path, f"possible {label} in a tracked file: {rel}:{line}")
                hits += 1
                break
    if not hits:
        ok("scanned tracked files, nothing credential-shaped")


def check_state_drift():
    """Shipped work that the state and history files never recorded.

    Why: the state file is what the next session believes. When commits land
    and nothing gets written down, every later session starts from a state that
    is quietly a month behind, and nobody notices until it contradicts reality.
    """
    title("3. State and history keep up with what shipped")
    if not IS_REPO:
        info("not a git repo: cannot compare state against commit history")
        return

    last_commit = _git("log", "-1", "--format=%cs").strip()
    if not last_commit:
        info("no commits yet")
        return

    for name in (STATE_FILE, HISTORY_FILE):
        path = ROOT / name
        if not path.exists():
            info(f"{name} not found: level 2 of /keel-skills:onboard creates it")
            continue
        text = read(path)
        newest = newest_date(text)
        if newest is None:
            # An unfilled template is an incomplete setup, not drift. Reporting
            # it as FAIL means the first thing a brand-new user sees after doing
            # everything right is a red failure caused by our own placeholder -
            # which is how people learn to ignore a suite on day one.
            if TEMPLATE_PLACEHOLDER in text:
                info(f"{name} is still the unfilled template: replace the "
                     f"{TEMPLATE_PLACEHOLDER} placeholders with your first real entry")
            else:
                finding(path, f"{name} carries no date at all, so its age cannot be measured")
            continue
        try:
            commit_day = datetime.strptime(last_commit, "%Y-%m-%d").date()
        except ValueError:
            continue
        gap = (commit_day - newest).days
        if gap > 14:
            finding(path, f"{name} last records {newest}, but the last commit is "
                          f"{last_commit} ({gap} days of unrecorded work)")
        else:
            ok(f"{name} is current with the last commit ({last_commit})")


def check_context_budget():
    """Ratchet on what every session pays before it does anything.

    Why: the files read at the start of every session grow one reasonable
    addition at a time, and each one is defensible on its own. Only a number
    that refuses to move catches the sum. When this fails, cut content.
    """
    title("4. Startup context budget (ratchet)")
    total = 0
    parts = []
    in_flight = None
    for name in (POLICY, STATE_FILE):
        path = ROOT / name
        if path.exists():
            size = path.stat().st_size
            total += size
            parts.append(f"{name} {size}B")
            # If one of the inputs is being edited right now, the overrun may be
            # someone's work in progress rather than committed drift. Attribute
            # the finding to that file so it reports as WARN, not FAIL.
            if in_flight is None and _is_dirty(path):
                in_flight = path
    if not parts:
        info("no policy or state file to measure yet")
        return

    detail = " + ".join(sorted(parts))
    if total > CONTEXT_BUDGET_BYTES:
        over = total - CONTEXT_BUDGET_BYTES
        finding(in_flight, f"every-session read is {total}B (~{total // 3.6:.0f} tok), "
                           f"{over}B over budget: {detail}. Remove content, or raise "
                           f"CONTEXT_BUDGET_BYTES in a commit someone can review")
    else:
        left = CONTEXT_BUDGET_BYTES - total
        ok(f"{total}B (~{total // 3.6:.0f} tok), {left}B under budget: {detail}")


def check_snapshot_age():
    """Dated snapshots that have gone stale.

    Why: a document that holds a picture of the world is fine as long as the
    picture is dated - a dated snapshot can be measured, an undated one just
    rots and gets read as criteria instead of as a fact.
    """
    title("5. Dated snapshots still fresh")
    marker = re.compile(r"(?i)(current state|snapshot|as of)\s*\(?\s*"
                        r"(20\d{2}-\d{2}-\d{2})")
    today = date.today()
    stale = []
    for path in tracked_files():
        if path.suffix != ".md":
            continue
        for m in marker.finditer(read(path)):
            try:
                y, mo, d = m.group(2).split("-")
                when = date(int(y), int(mo), int(d))
            except ValueError:
                continue
            age = (today - when).days
            if age > SNAPSHOT_MAX_AGE_DAYS:
                stale.append((age, path.relative_to(ROOT).as_posix(), m.group(2)))
    if stale:
        stale.sort(reverse=True)
        oldest = stale[0]
        info(f"{len(stale)} snapshot(s) older than {SNAPSHOT_MAX_AGE_DAYS} days; "
             f"oldest {oldest[1]} ({oldest[2]}, {oldest[0]} days). "
             "Re-measure them, or turn them into a pointer")
    else:
        ok("no dated snapshot past its age limit")


# ==========================================================================
# PROJECT CHECKS - add yours here, then register in CHECKS below.
#
# Template. Delete this example once you have a real one; an example left in
# place is the fastest way for a suite to stop being read.
#
# def check_two_configs_agree():
#     """The two places that declare the supported locales must match.
#
#     Why: they drifted on 2026-05-04 and shipped a half-translated page. There
#     is no way to derive one from the other, so a mirror check is the only
#     option available.
#     """
#     title("6. The two locale lists agree")
#     a = read(ROOT / "app/config.ts")
#     b = read(ROOT / "scripts/build-locales.ts")
#     ...
#     finding(ROOT / "app/config.ts", "locale lists differ: ...")
# ==========================================================================


CHECKS = [
    check_policy,
    check_secrets,
    check_state_drift,
    check_context_budget,
    check_snapshot_age,
]


def main():
    global fails
    stamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    print(f"Keel checks - {ROOT.name} - {stamp}")
    for check in CHECKS:
        try:
            check()
        except Exception as exc:                      # noqa: BLE001
            # One broken check must not hide the others. Report it loudly as a
            # failure of the suite, not silently as a pass.
            fails += 1
            print(f"   FAIL  check {check.__name__} raised {type(exc).__name__}: {exc}")

    print()
    if fails:
        print(f"RESULT: {fails} failure(s), {warns} warning(s).")
        print("FAIL = committed and clean, so it is real drift: fix it, or write "
              "down why you didn't.")
        return 1
    if warns:
        print(f"RESULT: no failures, {warns} warning(s) on files someone may have "
              "in flight. Fix only what is yours.")
        return 0
    print("RESULT: clean.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
