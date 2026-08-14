import type { Metadata } from "next";
import CodeBlock from "@/components/CodeBlock";
import { PageHeader, H2, H3, Callout, Pill, PrevNext } from "@/components/prose";

export const metadata: Metadata = {
  title: "The operating loop",
  description:
    "Open a session on state, work under a mechanical check, close by writing state back — plus documents that don't age, unattended routines, and turning repetition into tools.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Concepts"
        title="The operating loop"
        lead="The permission model decides what an agent may do. This is the loop it runs inside: where state comes from at the start, what catches drift while you work, what gets written back at the end, and how repeated work turns into tooling instead of habit."
      />

      <p>
        A brake on its own is a good day&apos;s protection. What breaks a project
        over months is quieter: documents that were true in March and are
        confidently wrong in July, state that lives in a chat window and
        disappears with it, and the same manual sequence done for the ninth time
        because nobody counted.
      </p>

      <Callout type="key">
        <strong>State is read to work; history is read to understand why.</strong>{" "}
        They are not read at the same frequency, so they must not cost the same
        to read. Almost everything on this page follows from that one line.
      </Callout>

      <H2 id="two-ends">The two ends of a session</H2>

      <p>
        A session that reads state at the start and writes it back at the end is
        what makes &ldquo;files are the source of truth&rdquo; actually hold.
        Both ends matter, and the opening one is the one people skip.
      </p>

      <H3 id="opening">Opening</H3>
      <p>
        Read the rules, then the state file, then only the docs for the area you
        are about to touch — not all of them. Then{" "}
        <strong>run the project&apos;s checks before doing any work</strong>.
      </p>
      <p>
        The order is the whole point. If the last session left drift, you want it
        now, while it is cheap and clearly not yours. Finding it after two hours
        of building on top of it means choosing between rework and knowingly
        shipping on a bad foundation.
      </p>
      <CodeBlock>/keel-skills:session-start</CodeBlock>

      <H3 id="closing">Closing</H3>
      <p>
        Reconcile what happened into the files: resolved items move to history,
        new <em>verified</em> facts go where they belong, open questions get
        recorded as open. Re-run the checks. Leave a short handoff.
      </p>
      <CodeBlock>/keel-skills:session-close</CodeBlock>
      <p>Two rules keep the close from becoming its own problem:</p>
      <ul>
        <li>
          <strong>One line of history per close.</strong> The reasoning belongs
          in the document it is about — the decision, the process doc, the draft
          — not in the history entry. Entries that grow into essays are how a
          changelog gains tens of kilobytes a month and stops being read.
        </li>
        <li>
          <strong>The close records; it does not build.</strong> No new work, no
          reopening decisions. If it finds something worth doing, it writes it
          down as open and stops.
        </li>
      </ul>

      <Callout type="note">
        <strong>The test for whether you wrote enough:</strong> a fresh session
        with no access to the conversation should be able to pick the work up
        from the files alone. If it couldn&apos;t, the state is still living in
        the transcript — and the transcript is about to disappear.
      </Callout>

      <H2 id="docs-that-age">Documents that don&apos;t age</H2>

      <p>
        Written rules decay — not because anyone disagrees with them, but
        because the world moves and the document doesn&apos;t. Three shapes stop
        that.
      </p>

      <H3 id="state-vs-history">Split state from history</H3>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>What it holds</th>
            <th>Read when</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>State</strong></td>
            <td>What is true now, what is open</td>
            <td>Every session</td>
          </tr>
          <tr>
            <td><strong>History</strong></td>
            <td>What happened and why, dated</td>
            <td>Rarely, on purpose</td>
          </tr>
        </tbody>
      </table>
      <p>
        When something closes, its body <strong>moves to history</strong> and the
        state keeps one dated line. Resolved items left in the state file are the
        most common way a state file quietly triples in size.
      </p>
      <p>
        Cut history out of a document when <strong>any one</strong> of these is
        true — each bar exists because the one before it let a real case through:
      </p>
      <ol>
        <li><strong>Size.</strong> The history section passes roughly 30 KB.</li>
        <li>
          <strong>Proportion.</strong> History passes about two thirds of the
          file, <em>even if it is small</em>. You pay for what is read, not for
          what the file measures.
        </li>
        <li>
          <strong>Nature.</strong> A closed item is history even when it lives in
          a section not called &ldquo;History&rdquo;. The first two bars only
          look at the labelled section, so a &ldquo;Pending&rdquo; section can be
          more than half closed items and neither one sees it.
        </li>
      </ol>

      <H3 id="bootstrap">A bootstrap carries no state</H3>
      <p>
        The file an agent reads <em>first</em> must point at where state lives,
        not contain it. State written into a bootstrap ages invisibly and, worse,
        gets read as <em>criteria</em> rather than as a fact — nobody re-checks
        it, because it looks like a rule.
      </p>
      <p>
        The same failure hits numbers written into method documents.{" "}
        <em>&ldquo;Runs 14 checks&rdquo;, &ldquo;takes about 1.5
        seconds&rdquo;</em> — each one is a fact filed inside a rule, and no one
        looks at it again. Either keep the number where it can be verified, or
        don&apos;t write it.
      </p>

      <H3 id="snapshots">Date every snapshot, and prefer generated over maintained</H3>
      <p>
        When a document genuinely must hold a picture of the world, mark it{" "}
        <code>Current state (2026-08-14)</code> and say it is a snapshot. A dated
        snapshot can be <em>measured</em>; an undated one just rots.
      </p>
      <p>
        Better still: if a listing can be generated from the filesystem at run
        time, generate it and delete the copy. An index built at run time cannot
        go stale.
      </p>

      <H2 id="checks">Checks that catch what the rules didn&apos;t</H2>

      <p>
        A rule tells a careful reader what to do. A check notices when it
        didn&apos;t happen. You want both, and they fail differently.
      </p>
      <p>
        <strong>
          Add a check when a real drift already got through undetected
        </strong>{" "}
        — not speculatively. That keeps the suite small enough that every failure
        means something and nobody learns to ignore it. Write down why each one
        exists, right next to it.
      </p>

      <H3 id="three-levels">Three levels, not pass/fail</H3>
      <p>
        A finding means different things depending on whether someone has that
        file open right now, so version control decides:
      </p>
      <table>
        <thead>
          <tr>
            <th>Level</th>
            <th>The file is…</th>
            <th>What to do</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>FAIL</strong></td>
            <td>committed and clean</td>
            <td>Real drift — it survived a session close. Safe to fix: nobody has it in flight</td>
          </tr>
          <tr>
            <td><strong>WARN</strong></td>
            <td>modified or untracked</td>
            <td>Someone is working on it. Report; don&apos;t fix what isn&apos;t yours</td>
          </tr>
          <tr>
            <td><strong>info</strong></td>
            <td>—</td>
            <td>Needs human judgment. Look, don&apos;t auto-correct</td>
          </tr>
        </tbody>
      </table>
      <Callout type="warn">
        Skipping this split has a specific consequence. With several sessions
        open, &ldquo;fix all findings before closing&rdquo; tells one session to{" "}
        <strong>edit another session&apos;s in-flight files</strong> — the exact
        collision the checks were meant to prevent.
      </Callout>

      <H3 id="ratchets">Ratchets</H3>
      <p>
        For anything that must not grow — startup context cost, bundle size, an
        index loaded every session — check against the <em>last recorded value</em>,
        not a generous ceiling.{" "}
        <strong>
          When a ratchet fails, remove content; do not raise the ceiling.
        </strong>{" "}
        A ceiling raised on every failure is a log, not a limit.
      </p>
      <p>
        A runnable starter — five universal checks, the FAIL/WARN split, and a
        documented extension point — ships with the plugin:
      </p>
      <CodeBlock>{`cp "$CLAUDE_PLUGIN_ROOT/templates/checks/keel_checks.py" scripts/
python scripts/keel_checks.py`}</CodeBlock>

      <H2 id="unattended">Unattended runs</H2>

      <p>
        A scheduled sweep, a CI job, a background agent. Here the rule
        doesn&apos;t get looser — it gets <strong>stricter</strong>:
      </p>
      <Callout type="key">
        <strong>
          With no human present, there is no one who could give a green light —
          so anything that needs one cannot happen.
        </strong>{" "}
        Not &ldquo;proceed carefully&rdquo;. It does not happen.
      </Callout>
      <p>
        An unattended run may look, measure, and report with a recommendation. It
        must not commit, push, deploy, send, delete by inference, mark anything
        approved, or &ldquo;fix&rdquo; what it finds broken. If the job needs any
        of those, it was scoped wrong.
      </p>
      <p>
        Write those limits into the routine&apos;s own prompt.{" "}
        <strong>Every run starts with no memory of any conversation</strong>, so
        a limit agreed once in chat does not exist for it. The enforcement hook
        does the mechanical half: a hot action degrades from <em>ask</em> to{" "}
        <em>deny</em> when nobody can answer.
      </p>
      <p>
        <Pill>command</Pill> <code>/keel-skills:hygiene</code> — a read-only
        sweep for uncommitted work, leaked secrets, state drift and stale drafts.
        Run it on demand, or schedule it from{" "}
        <code>templates/routines/weekly-hygiene.md</code>.
      </p>

      <H2 id="repetition">Turning repetition into tools</H2>

      <p>
        <strong>Encapsulate what has already been done three times.</strong>{" "}
        Fewer is premature abstraction: you pay maintenance forever and — the
        real cost — one or two occurrences don&apos;t show you what varies, so
        you build the wrong shape and then work around it.
      </p>
      <p>Count carefully, because the number lies in both directions:</p>
      <ul>
        <li>
          <strong>Normalize before counting.</strong> The same command with a
          different id inside is the same command. Counting raw text splits one
          repetition into five.
        </li>
        <li>
          <strong>Then check the opposite.</strong> A form appearing 200 times
          may be a truncation artifact. Look at whether the occurrences{" "}
          <em>do</em> the same thing or merely <em>start</em> the same.
        </li>
      </ul>

      <H3 id="test-banks">Test banks need a case that must fail</H3>
      <p>
        A script that touches a live system can only be exercised on the state
        things happen to be in — which is the state where nothing is wrong. Build
        a bank that substitutes the reads, runs the real routine, and captures
        what <em>would</em> have been sent.
      </p>
      <Callout type="warn">
        <strong>Include a negative control:</strong> a case where the code{" "}
        <em>must</em> act, and the bank fails if it doesn&apos;t. Without one, a
        suite that only checks &ldquo;nothing bad happened&rdquo; passes just as
        green with the entire engine commented out — measuring nothing while
        looking healthy.
      </Callout>

      <H3 id="loop">Capture is free, adopting is not</H3>
      <p>
        Repetition is invisible from inside a session: each one starts blind, so
        nobody looks <em>across</em> them. The loop has three separate times:
      </p>
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>When</th>
            <th>Who</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Capture</strong></td>
            <td>during real work</td>
            <td>the agent — one line, then keep going</td>
          </tr>
          <tr>
            <td><strong>Harvest</strong></td>
            <td>when capacity is spare</td>
            <td>its own session</td>
          </tr>
          <tr>
            <td><strong>Adopt</strong></td>
            <td>on review</td>
            <td><strong>the human only</strong></td>
          </tr>
        </tbody>
      </table>
      <p>
        <strong>Capture is the asset.</strong> If the harvest has to begin by
        thinking of what to improve, it doesn&apos;t happen. So: notice the
        friction, write one line, keep working. Do not design the fix in the
        moment — that derails the task, and it is exactly why nothing ever gets
        written down.
      </p>
      <p>
        <strong>Adopting is the green light.</strong> A backlog file decides
        nothing and deleting it breaks nothing, so writing to it is free. The
        moment an item becomes a tool, a command, or a rule something obeys, it
        changes how the system works. The agent fills the funnel; the human opens
        the gate.
      </p>
      <p>
        Record discards <em>with their reason</em> — a discard without one gets
        proposed again next quarter.
      </p>
      <CodeBlock>/keel-skills:harvest</CodeBlock>

      <PrevNext current="/concepts/operating-loop" />
    </>
  );
}
