#!/usr/bin/env python3
"""test_keel_checks.py - test bank for keel_checks.py.

    python scripts/test_keel_checks.py     # exit 0 if all pass, 1 if any fails

WHY THIS EXISTS, and why it is shaped this way. A checks script that runs
against your real repo can only be exercised on the state your repo happens to
be in - which is, by definition, the state where nothing is wrong. The paths
that matter (a secret got committed, the state file fell behind, the budget was
blown) are exactly the ones a live run never takes.

So this builds a THROWAWAY repo, plants a specific problem in it, runs the REAL
script as a subprocess, and asserts on what it reports. Nothing here touches
your project.

THE PART PEOPLE SKIP: cases 3-6 are NEGATIVE CONTROLS. Each plants a defect and
fails if the checks stay quiet. Without them, a bank that only asserts "clean
repo reports clean" passes just as green with every check commented out - it
would be measuring nothing and looking healthy while it did.

It also runs on a fresh clone with nothing configured. A bank that dies on a
missing credential fails exactly where it matters most, and reads as "this
package is broken" rather than "you haven't configured it yet".
"""

import re
import shutil
import subprocess
import sys
import tempfile
from datetime import date, timedelta
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent / "keel_checks.py"

GOOD_POLICY = """# AGENT_POLICY.md

## 1. Hot zones
- `src/**`

```keel-policy
hot_paths:
  - "src/**"
hot_commands:
  - "git push"
```
"""


def have_git():
    return shutil.which("git") is not None


def build_repo(tmp, policy=GOOD_POLICY, state=None, history=None, extra=None,
               commit=True):
    """A synthetic project with the checks script installed the way a user
    would install it: at <root>/scripts/, so the script's own ROOT resolves to
    the project root exactly as it does in real life."""
    root = Path(tmp)
    (root / "scripts").mkdir(parents=True, exist_ok=True)
    shutil.copy(SCRIPT, root / "scripts" / "keel_checks.py")

    today = date.today().isoformat()
    if policy is not None:
        (root / "AGENT_POLICY.md").write_text(policy, encoding="utf-8")
    (root / "STATE.md").write_text(
        state if state is not None else f"# State\n\nUpdated {today}. Nothing open.\n",
        encoding="utf-8")
    (root / "CHANGELOG.md").write_text(
        history if history is not None else f"# History\n\n- {today} set up\n",
        encoding="utf-8")

    for rel, body in (extra or {}).items():
        p = root / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(body, encoding="utf-8")

    if commit and have_git():
        env_args = ["-c", "user.email=t@example.com", "-c", "user.name=t"]
        subprocess.run(["git", "-C", str(root), "init", "-q"], check=False,
                       capture_output=True)
        subprocess.run(["git", "-C", str(root), "add", "-A"], check=False,
                       capture_output=True)
        subprocess.run(["git", "-C", str(root), *env_args, "commit", "-q",
                        "-m", "fixture"], check=False, capture_output=True)
    return root


def run(root):
    out = subprocess.run([sys.executable, str(root / "scripts" / "keel_checks.py")],
                         capture_output=True, text=True)
    return out.returncode, out.stdout + out.stderr


# --------------------------------------------------------------------------
# Cases. Each returns (passed, detail).
# --------------------------------------------------------------------------

def case_clean_repo_is_clean(tmp):
    """A well-formed project reports no failures."""
    root = build_repo(tmp)
    code, out = run(root)
    return code == 0 and "RESULT: clean" in out, out


def case_output_is_deterministic(tmp):
    """Two runs of an unchanged repo produce identical output.

    Comparing runs is how drift gets spotted, so unstable ordering would make
    the whole tool useless. The timestamp line is excluded - it is the one
    thing that is supposed to differ.
    """
    root = build_repo(tmp)
    _, a = run(root)
    _, b = run(root)
    strip = lambda s: "\n".join(l for l in s.splitlines() if not l.startswith("Keel checks -"))
    return strip(a) == strip(b), "outputs differ between runs"


def case_catches_committed_secret(tmp):
    """NEGATIVE CONTROL: a committed private key must fail the run."""
    key = ("-----BEGIN RSA PRIVATE KEY-----\nMIIEow==\n"
           "-----END RSA PRIVATE KEY-----\n")
    root = build_repo(tmp, extra={"deploy/id_rsa": key})
    code, out = run(root)
    if not have_git():
        return True, "SKIPPED (no git: everything degrades to WARN by design)"
    return code == 1 and "private key" in out, out


def case_catches_empty_policy_block(tmp):
    """NEGATIVE CONTROL: a policy whose block refines nothing must fail."""
    hollow = "# AGENT_POLICY.md\n\n```keel-policy\nhot_paths:\n```\n"
    root = build_repo(tmp, policy=hollow)
    code, out = run(root)
    if not have_git():
        return True, "SKIPPED (no git)"
    return code == 1 and "refines nothing" in out, out


def case_catches_unfilled_placeholder(tmp):
    """NEGATIVE CONTROL: a template copied but never filled in must fail.

    This is the realistic version of the failure - not an empty policy, but one
    that still has `<your path here>` in it and therefore matches nothing.
    """
    stub = ('# AGENT_POLICY.md\n\n```keel-policy\nhot_paths:\n'
            '  - "<e.g. src/**>"\nhot_commands:\n  - "git push"\n```\n')
    root = build_repo(tmp, policy=stub)
    code, out = run(root)
    if not have_git():
        return True, "SKIPPED (no git)"
    return code == 1 and "placeholder" in out, out


def case_catches_state_drift(tmp):
    """NEGATIVE CONTROL: state that fell far behind the last commit must fail."""
    old = (date.today() - timedelta(days=90)).isoformat()
    root = build_repo(tmp, state=f"# State\n\nAs of {old}.\n",
                      history=f"# History\n\n- {old} set up\n")
    code, out = run(root)
    if not have_git():
        return True, "SKIPPED (no git)"
    return code == 1 and "unrecorded work" in out, out


def case_dirty_file_warns_not_fails(tmp):
    """A defect in an UNCOMMITTED file warns instead of failing.

    This is the parallel-sessions rule: an in-flight file may belong to someone
    else, and a hard failure there tells one session to edit another's work.
    """
    root = build_repo(tmp)
    if not have_git():
        return True, "SKIPPED (no git: cannot distinguish committed from dirty)"
    (root / "AGENT_POLICY.md").write_text(
        "# AGENT_POLICY.md\n\n```keel-policy\nhot_paths:\n```\n", encoding="utf-8")
    code, out = run(root)
    return code == 0 and "WARN" in out, out


def case_no_git_still_runs(tmp):
    """Runs on a plain folder that was never a repo, without crashing.

    Somebody will try this before running `git init`, and a traceback there
    reads as 'this tool is broken'.
    """
    root = build_repo(tmp, commit=False)
    shutil.rmtree(root / ".git", ignore_errors=True)
    code, out = run(root)
    return "Traceback" not in out and code in (0, 1), out


def case_does_not_write_to_the_project(tmp):
    """The script is read-only: the tree is byte-identical after a run.

    Two sessions must be able to run it at the same time, which is only true if
    it writes nothing at all - no cache, no lock, no last-run marker.
    """
    root = build_repo(tmp)
    before = {p.relative_to(root).as_posix(): p.stat().st_mtime_ns
              for p in sorted(root.rglob("*")) if p.is_file() and ".git" not in p.parts}
    run(root)
    after = {p.relative_to(root).as_posix(): p.stat().st_mtime_ns
             for p in sorted(root.rglob("*")) if p.is_file() and ".git" not in p.parts}
    return before == after, f"{set(after) ^ set(before)} changed"


def case_self_scan_does_not_self_report(tmp):
    """The secret scan does not flag its own pattern definitions.

    An inventory that counts itself is a failure mode of the method, not a
    finding. Left unhandled, the suite would fail on every clean repo.
    """
    root = build_repo(tmp)
    _, out = run(root)
    return "keel_checks.py" not in out, out


CASES = [
    ("clean repo reports clean", case_clean_repo_is_clean),
    ("output is deterministic across runs", case_output_is_deterministic),
    ("NEG: committed secret fails", case_catches_committed_secret),
    ("NEG: hollow policy block fails", case_catches_empty_policy_block),
    ("NEG: unfilled placeholder fails", case_catches_unfilled_placeholder),
    ("NEG: state drift fails", case_catches_state_drift),
    ("dirty file warns, does not fail", case_dirty_file_warns_not_fails),
    ("runs outside a git repo", case_no_git_still_runs),
    ("writes nothing to the project", case_does_not_write_to_the_project),
    ("does not flag its own patterns", case_self_scan_does_not_self_report),
]


def main():
    if not have_git():
        print("note: git not on PATH - the cases that need it report SKIPPED "
              "rather than failing against working code.\n")

    failed = 0
    for name, fn in CASES:
        with tempfile.TemporaryDirectory() as tmp:
            try:
                passed, detail = fn(tmp)
            except Exception as exc:                  # noqa: BLE001
                passed, detail = False, f"{type(exc).__name__}: {exc}"
        if passed:
            skip = isinstance(detail, str) and detail.startswith("SKIPPED")
            print(f"{'SKIP' if skip else 'PASS'}  {name}")
        else:
            failed += 1
            first = re.sub(r"\s+", " ", str(detail))[:200]
            print(f"FAIL  {name}\n      {first}")

    print(f"\n{len(CASES) - failed}/{len(CASES)} passed")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
