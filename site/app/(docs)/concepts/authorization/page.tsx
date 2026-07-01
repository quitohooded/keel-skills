import type { Metadata } from "next";
import { PageHeader, H2, H3, Callout, PrevNext } from "@/components/prose";
import AuthDiagram from "@/components/AuthDiagram";

export const metadata: Metadata = {
  title: "Permission model",
  description:
    "Goal, method, green light — only a green light means go. Plus the four-step check, hot zones, and following through on a green light you already have. The core of Keel Skills.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Concepts"
        title="The permission model"
        lead="A way to decide when an agent may act versus when it must stop and get a clear yes. Speed without surprises."
      />

      <p>
        The agent moves fast on safe, undoable, internal work, and stops cold
        before anything outward-facing, hard to undo, or system-rebuilding. This
        page is the how-to-decide; the project-specific details live in your{" "}
        <a href="/agent-policy">AGENT_POLICY.md</a>.
      </p>

      <H2 id="core-principle">Core principle</H2>
      <p>
        Files are the source of truth. The conversation and the agent&apos;s
        memory are <strong>not</strong>. From this follow four rules:
      </p>
      <ol>
        <li>State is <strong>read</strong>, not remembered.</li>
        <li>Decisions are <strong>written down</strong>, not guessed at.</li>
        <li>Acting depends on <strong>what the files actually say</strong>.</li>
        <li>
          When something is unclear, <strong>stop and ask</strong> — never fill
          the gap by guessing.
        </li>
      </ol>

      <H2 id="levels">What looks like permission — and what is</H2>
      <p>
        Three things get confused with &ldquo;yes, go ahead.&rdquo; Only one of
        them is.
      </p>
      <AuthDiagram />
      <H3 id="goal">A goal</H3>
      <p>
        A direction with no specific scope: &ldquo;improve this&rdquo;,
        &ldquo;do what&apos;s needed&rdquo;, &ldquo;handle it&rdquo;. This is{" "}
        <strong>not</strong> a green light. It&apos;s permission to look into it
        and come back with a plan.
      </p>
      <H3 id="method">A method</H3>
      <p>
        The user says <em>how</em>: &ldquo;use a migration&rdquo;, &ldquo;edit
        the config&rdquo;, &ldquo;use a subagent&rdquo;. Naming the method is{" "}
        <strong>not</strong> the same as approving the action. Still{" "}
        <strong>not</strong> a green light.
      </p>
      <H3 id="green-light">A green light</H3>
      <p>
        Either (a) the user clearly approves a specific action with its scope, or
        (b) a written-down, still-current decision already covers it.{" "}
        <strong>
          This is the only thing that means go — and you must not go beyond what
          was approved.
        </strong>
      </p>
      <Callout type="warn" title="The practical trap">
        Most &ldquo;go do it&rdquo; instructions are just a goal or a method. They
        feel like permission but aren&apos;t.{" "}
        <strong>Only a green light means go.</strong>
      </Callout>

      <H2 id="four-step">The four-step check</H2>
      <p>
        Run this before any action that writes or changes anything. Four steps,
        in order — the <strong>first one that applies wins</strong>.
      </p>
      <ol>
        <li>
          Is it read-only, looking into something, or drafting a clearly-labeled{" "}
          <code>[PROPOSAL]</code>? → <strong>Free.</strong> Do it.
        </li>
        <li>
          Does it touch a hot zone? → <strong>Needs a green light.</strong>
        </li>
        <li>
          Does it build/reconfigure a system, or is it a chain whose combined
          effect rebuilds something? → <strong>Needs a green light</strong> (even
          if each step is tiny).
        </li>
        <li>
          Otherwise (undoable + internal + isolated + low-impact) →{" "}
          <strong>Free: do it and report.</strong>
        </li>
      </ol>
      <Callout type="key">
        Any doubt at any step → treat it as needing a green light.
      </Callout>

      <H2 id="hot-zones">Hot zones</H2>
      <p>
        A zone is &ldquo;hot&rdquo; when a mistake there is expensive or hard to
        undo. The default set (refine the specifics in your{" "}
        <a href="/agent-policy">AGENT_POLICY.md</a>, but never remove a category
        wholesale):
      </p>
      <ul>
        <li>
          <strong>Anything users or the public see</strong> — published copy,
          marketing pages, public APIs, user-visible UI.
        </li>
        <li>
          <strong>Production, databases, schema, settings, hooks, CI/CD</strong>{" "}
          — anything that runs in or shapes the live system.
        </li>
        <li>
          <strong>Actions that reach outside or can&apos;t be undone</strong> —
          commit, push, deploy, send an email or message, publish, charge money,
          delete data.
        </li>
        <li>
          <strong>Turning a draft into a decision</strong> — marking something{" "}
          <code>[APPROVED]</code> / <code>[CONFIRMED]</code> is itself a risky
          action.
        </li>
        <li>
          <strong>Source-of-truth files</strong> — files other work depends on.
          New decisions or meaning-changing edits need a green light (following
          through is the one exception, below).
        </li>
      </ul>
      <Callout type="note">
        In a repo you don&apos;t know well, treat a file&apos;s reach as{" "}
        <strong>risky until you understand how far it goes.</strong>
      </Callout>

      <H2 id="following-through">Following through on a green light</H2>
      <p>
        The only way a green light carries over to a new change without asking
        again. A change that comes straight out of an already-approved decision
        may run <strong>without a new green light</strong> only if it meets{" "}
        <strong>all four</strong> conditions:
      </p>
      <ol>
        <li>
          <strong>No judgment needed</strong> — two people applying the same
          decision produce the same change.
        </li>
        <li>The decision <strong>states the scope</strong> — you&apos;re not guessing it.</li>
        <li>The change <strong>points back to</strong> the source decision.</li>
        <li>The decision is <strong>still current</strong> — nothing later overrode it.</li>
      </ol>
      <p>
        Miss one → <strong>ask for a green light.</strong> Being too sure that
        &ldquo;this is obviously just following through&rdquo; is the classic
        failure mode; when deciding{" "}
        <em>following through vs. a new call</em>, default to asking.
      </p>

      <H2 id="tie-breakers">Tie-breakers</H2>
      <ol>
        <li>
          <strong>Risk wins</strong> — if something is both &ldquo;free&rdquo;
          and &ldquo;hot&rdquo;, it needs a green light.
        </li>
        <li>
          <strong>The whole picture wins</strong> — a system-rebuilding effect
          needs a green light even when delivered in small steps.
        </li>
        <li>
          <strong>Doubt means stop</strong> — any uncertainty → ask.
        </li>
      </ol>

      <H2 id="judgment">What stays the agent&apos;s call</H2>
      <p>Narrow, and it defaults to asking:</p>
      <ul>
        <li>Judging <em>undoable / internal / low-impact</em>.</li>
        <li>Judging <em>just following through vs. a new call</em>.</li>
        <li>When to surface a contradiction or a gap rather than push ahead.</li>
      </ul>
      <p>
        Anchors: <em>undoable</em> = can be reversed (e.g. via version control)
        with no outside effect; <em>internal</em> = never reaches anyone outside;{" "}
        <em>low-impact</em> = doesn&apos;t touch access, data, money, or published
        copy. In all three: if in doubt, ask.
      </p>

      <H2 id="subagents">Subagents and permission</H2>
      <p>
        A subagent <strong>cannot</strong> approve, confirm, or do anything risky
        in a hot zone on its own say-so. It can look into things and propose; the
        green light returns to the human (or a parent acting under a human&apos;s
        green light). <strong>Delegation never creates permission out of thin
        air.</strong> See <a href="/concepts/delegation">Model &amp; delegation</a>.
      </p>

      <H2 id="one-line">In one line</H2>
      <blockquote>
        Read-only and proposals are free. Anything risky, outward,
        undoable-only-with-pain, or system-rebuilding needs a green light. When
        unsure, ask.
      </blockquote>

      <PrevNext current="/concepts/authorization" />
    </>
  );
}
