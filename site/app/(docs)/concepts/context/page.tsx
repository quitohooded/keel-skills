import type { Metadata } from "next";
import { PageHeader, H2, Callout, PrevNext } from "@/components/prose";

export const metadata: Metadata = {
  title: "Context discipline",
  description:
    "Keep agent sessions grounded in files rather than chat history, and know when to end a long session cleanly and hand off.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Concepts"
        title="Context discipline"
        lead="Long sessions don't fail because the model forgets. They fail because the conversation quietly becomes the place the work 'lives' — and the conversation is not trustworthy."
      />

      <H2 id="not-source-of-truth">The conversation is not the source of truth</H2>
      <p>The files are. Two consequences:</p>
      <ul>
        <li>
          Don&apos;t rely on chat history to know the current state —{" "}
          <strong>read it from the files.</strong> Verify before you assert that
          something is done.
        </li>
        <li>
          When you reach a decision or a new state,{" "}
          <strong>write it to the appropriate file.</strong> A conclusion that
          exists only in the transcript will be lost.
        </li>
      </ul>
      <Callout type="note">
        If the project has an <a href="/agent-policy">AGENT_POLICY.md</a>, its
        section <em>&ldquo;Where state and decisions get recorded&rdquo;</em>{" "}
        names exactly where decisions, project state, and per-task notes belong —
        use those paths instead of guessing.
      </Callout>

      <H2 id="dont-hoard">Don&apos;t hoard context</H2>
      <p>
        In a long session, accumulated context stops being free. Past a point it
        adds no operational value and actively raises the risk of confusion —
        stale assumptions, contradicting half-decisions, conclusions you can no
        longer trace to a source. When that happens:
      </p>
      <ol>
        <li>
          <strong>Stop expanding the session.</strong> Don&apos;t keep piling
          new threads onto it.
        </li>
        <li>
          <strong>Record the necessary state</strong> in the files where it
          belongs (decisions log, project notes, the relevant source files).
        </li>
        <li>
          <strong>Leave a clear pointer</strong> for how to continue in a new
          session.
        </li>
      </ol>

      <H2 id="resume-test">A new session must resume from files alone</H2>
      <p>
        The test for whether you&apos;ve recorded enough:{" "}
        <strong>
          a fresh session, with no access to this chat history, should be able to
          pick the work back up by reading the source files.
        </strong>{" "}
        If it couldn&apos;t, you haven&apos;t written down enough yet — the state
        still only lives in the transcript.
      </p>
      <p>When handing off, leave (in files, not just the chat):</p>
      <ul>
        <li>What the current state is and how it was verified.</li>
        <li>What the next concrete step is.</li>
        <li>Which files to read first to reconstruct context.</li>
      </ul>

      <H2 id="never">The one thing you must never do</H2>
      <Callout type="warn">
        <strong>
          Never drop context that the current task still needs just to make the
          session smaller.
        </strong>{" "}
        Trimming is for context that has stopped paying its way — not for
        anything load-bearing for the work in front of you. When in doubt about
        whether a piece of context is still needed, record it to a file before
        letting it go.
      </Callout>

      <H2 id="one-line">In one line</H2>
      <blockquote>
        Read state from files, write decisions to files, and when a session stops
        earning its length, record the state + a resume pointer and start fresh —
        without ever discarding what the current task still needs.
      </blockquote>

      <PrevNext current="/concepts/context" />
    </>
  );
}
