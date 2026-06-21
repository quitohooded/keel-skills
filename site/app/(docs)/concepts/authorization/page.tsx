import type { Metadata } from "next";
import { PageHeader, H2, H3, Callout, PrevNext } from "@/components/prose";
import AuthDiagram from "@/components/AuthDiagram";

export const metadata: Metadata = {
  title: "Authorization model",
  description:
    "The three-level authorization model, the four-step test, hot zones, and mechanical propagation — the core of Keel Skills.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Concepts"
        title="The authorization model"
        lead="A decision procedure for when an agent may act versus when it must stop and get explicit approval. Autonomy without surprises."
      />

      <p>
        The agent moves fast on safe, reversible, internal work, and stops cold
        before anything outward-facing, irreversible, or structural. This page
        is the mechanism; the project-specific details live in your{" "}
        <a href="/agent-policy">AGENT_POLICY.md</a>.
      </p>

      <H2 id="core-principle">Core principle</H2>
      <p>
        Files are the source of truth. The conversation and the agent&apos;s
        memory are <strong>not</strong> authoritative. From this follow four
        rules:
      </p>
      <ol>
        <li>State is <strong>read</strong>, not recalled.</li>
        <li>Decisions are <strong>recorded</strong>, not interpreted.</li>
        <li>Execution depends on <strong>explicit state</strong>.</li>
        <li>
          Ambiguity <strong>stops or asks</strong> — it is never resolved by
          inference.
        </li>
      </ol>

      <H2 id="levels">The three authorization levels</H2>
      <AuthDiagram />
      <H3 id="l1">L1 — Broad mandate</H3>
      <p>
        A goal or direction with no specific scope: &ldquo;improve this&rdquo;,
        &ldquo;do what&apos;s needed&rdquo;, &ldquo;handle it&rdquo;. It does{" "}
        <strong>not</strong> authorize execution. It authorizes you to
        investigate and to draft a proposal.
      </p>
      <H3 id="l2">L2 — Mechanism / direction</H3>
      <p>
        The user names <em>how</em>: &ldquo;use a migration&rdquo;, &ldquo;edit
        the config&rdquo;, &ldquo;use a subagent&rdquo;. Naming the mechanism is{" "}
        <strong>not</strong> the same as approving the act. It does{" "}
        <strong>not</strong> authorize execution.
      </p>
      <H3 id="l3">L3 — Explicit scoped approval</H3>
      <p>
        Either (a) the user explicitly approves a specific action with its
        scope, or (b) a recorded, current decision already covers that scope.{" "}
        <strong>
          This authorizes execution — and execution must not exceed the approved
          scope.
        </strong>
      </p>
      <Callout type="warn" title="The practical trap">
        Most &ldquo;go do it&rdquo; instructions are L1 or L2. They feel like
        permission but are not. <strong>Only L3 executes.</strong>
      </Callout>

      <H2 id="four-step">The four-step test</H2>
      <p>
        Run this before any action that writes or changes anything. Four steps,
        in order — the <strong>first one that applies wins</strong>.
      </p>
      <ol>
        <li>
          Is it read-only, analysis, or drafting a clearly-marked{" "}
          <code>[PROPOSAL]</code>? → <strong>Free.</strong> Act.
        </li>
        <li>
          Does it touch a hot zone? → <strong>Requires L3.</strong>
        </li>
        <li>
          Does it build/reconfigure a system, or is it a chain whose cumulative
          effect is structural? → <strong>Requires L3</strong> (even if each
          step is tiny).
        </li>
        <li>
          Otherwise (reversible + internal + isolated + low-impact) →{" "}
          <strong>Free: act and report.</strong>
        </li>
      </ol>
      <Callout type="key">
        Any doubt at any step → treat as L3.
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
          <strong>Client / external-facing surfaces</strong> — anything an end
          user, customer, or the public sees: published copy, marketing pages,
          public APIs, user-visible UI.
        </li>
        <li>
          <strong>Production, databases, schema, settings, hooks, CI/CD</strong>{" "}
          — anything that runs in or shapes the live system.
        </li>
        <li>
          <strong>Outward or irreversible actions</strong> — commit, push,
          deploy, send an email or message, publish, charge money, delete data.
        </li>
        <li>
          <strong>Promoting a draft to a decision</strong> — marking something{" "}
          <code>[APPROVED]</code> / <code>[CONFIRMED]</code> is itself a hot
          action.
        </li>
        <li>
          <strong>Source-of-truth artifacts</strong> — files other work derives
          from. New decisions or interpretive edits require L3 (mechanical
          propagation is the one exception, below).
        </li>
      </ul>
      <Callout type="note">
        In a repo you don&apos;t know well, treat a file&apos;s blast radius as{" "}
        <strong>hot until you understand how far it reaches.</strong>
      </Callout>

      <H2 id="mechanical-propagation">Mechanical propagation</H2>
      <p>
        The only way approval is inherited without a new L3. A change derived
        from an already-approved decision may run <strong>without a new L3</strong>{" "}
        only if it meets <strong>all four</strong> conditions:
      </p>
      <ol>
        <li>
          <strong>Deterministic</strong> — two people applying the same decision
          produce the same change.
        </li>
        <li>The decision <strong>states the scope</strong> — you are not inferring it.</li>
        <li>The change <strong>cites</strong> the source decision.</li>
        <li>The decision is <strong>current</strong> — nothing later overrode it.</li>
      </ol>
      <p>
        Miss one → <strong>L3.</strong> Overconfidence that &ldquo;this is
        obviously mechanical&rdquo; is the classic failure mode; when classifying{" "}
        <em>mechanical vs. interpretive</em>, default to L3.
      </p>

      <H2 id="tie-breakers">Tie-breakers</H2>
      <ol>
        <li>
          <strong>Authoritative wins</strong> — if something is both
          &ldquo;free&rdquo; and &ldquo;hot&rdquo;, it&apos;s L3.
        </li>
        <li>
          <strong>Cumulative wins</strong> — structural effect is L3 even when
          delivered in small steps.
        </li>
        <li>
          <strong>Doubt resolves toward safety</strong> — any uncertainty → L3.
        </li>
      </ol>

      <H2 id="judgment">What stays the agent&apos;s judgment</H2>
      <p>Narrow, and it defaults to asking:</p>
      <ul>
        <li>Classifying <em>reversible / internal / low-impact</em>.</li>
        <li>Classifying <em>mechanical vs. interpretive</em>.</li>
        <li>When to surface a contradiction or a gap rather than proceed.</li>
      </ul>
      <p>
        Anchors: <em>reversible</em> = revertible (e.g. via version control) with
        no external effect; <em>internal</em> = never reaches an external
        surface; <em>low-impact</em> = does not touch access, data, money, or
        published copy. In all three: if in doubt, L3.
      </p>

      <H2 id="subagents">Subagents and authorization</H2>
      <p>
        A subagent <strong>cannot</strong> approve, confirm, or execute in a hot
        zone on its own authority. It can investigate and propose; the L3
        decision returns to the human (or a parent acting under a human&apos;s
        L3). <strong>Delegation never launders authorization.</strong> See{" "}
        <a href="/concepts/delegation">Model &amp; delegation</a>.
      </p>

      <H2 id="one-line">In one line</H2>
      <blockquote>
        Read-only and proposals are free. Anything hot, outward, irreversible, or
        structural is L3. When unsure, it&apos;s L3.
      </blockquote>

      <PrevNext current="/concepts/authorization" />
    </>
  );
}
