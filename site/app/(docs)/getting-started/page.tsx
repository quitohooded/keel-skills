import type { Metadata } from "next";
import { PageHeader, H2, Callout, PrevNext } from "@/components/prose";
import CodeBlock from "@/components/CodeBlock";
import {
  INSTALL_MARKETPLACE,
  INSTALL_PLUGIN,
  INSTALL_COMMUNITY_MARKET,
  INSTALL_COMMUNITY,
} from "@/lib/nav";

export const metadata: Metadata = {
  title: "Getting started",
  description:
    "Install Keel Skills in Claude Code, scaffold your AGENT_POLICY.md, and run your first guarded session.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Start"
        title="Getting started"
        lead="Install the plugin, generate a project policy, and watch the authorization protocol take over. About five minutes."
      />

      <H2 id="requirements">Requirements</H2>
      <p>
        Claude Code with the <code>/plugin</code> command. If you don&apos;t see
        it, update Claude Code to the latest version. Keel Skills is a
        single-plugin marketplace — nothing else to install.
      </p>

      <H2 id="install">1 · Install the plugin</H2>
      <p>Inside Claude Code, add the marketplace and install:</p>
      <CodeBlock title="Claude Code">{`${INSTALL_MARKETPLACE}\n${INSTALL_PLUGIN}`}</CodeBlock>
      <p>
        Once it&apos;s approved in the community marketplace you&apos;ll also be
        able to install it the shorter way:
      </p>
      <CodeBlock title="Claude Code · community marketplace">{`${INSTALL_COMMUNITY_MARKET}\n${INSTALL_COMMUNITY}`}</CodeBlock>
      <p>
        This adds five skills, six commands, and two hooks. The skills are
        model-invoked: they trigger themselves when the situation calls for it,
        so there&apos;s nothing to remember to run.
      </p>

      <H2 id="onboard">2 · Run the onboarding</H2>
      <p>
        In the project you want to govern, run:
      </p>
      <CodeBlock title="In your project">{`/keel-skills:onboard`}</CodeBlock>
      <p>
        It <strong>assumes nothing</strong>. First it looks at what is actually
        there — whether this is a repo, one project or several, the stack, any
        agent instructions you already have, where state seems to live, or
        whether the folder is empty. Then it tells you what it found{" "}
        <em>and what it could not tell</em>, and asks about the rest rather than
        guessing.
      </p>
      <p>Then it offers three sizes and builds only the one you pick:</p>
      <table>
        <thead>
          <tr>
            <th>Level</th>
            <th>Time</th>
            <th>What you get</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>1 · The brake</strong></td>
            <td>~5 min</td>
            <td>An <code>AGENT_POLICY.md</code> with your real hot zones, enforced by the hook</td>
          </tr>
          <tr>
            <td><strong>2 · + session loop</strong></td>
            <td>~15 min</td>
            <td>A state/history pair, so work survives across sessions</td>
          </tr>
          <tr>
            <td><strong>3 · + maintenance loop</strong></td>
            <td>~30 min</td>
            <td>Mechanical checks, an improvement backlog, a scheduled sweep</td>
          </tr>
        </tbody>
      </table>
      <Callout type="note">
        <strong>Level 1 is a legitimate final answer.</strong> They&apos;re
        sizes, not a maturity ladder — an unused level 3 is worth less than a
        used level 1, and you can move up later by running the command again.
      </Callout>
      <p>
        If you only want the policy file and none of the interview around it,{" "}
        <code>/keel-skills:policy-init</code> does that one step on its own.
      </p>
      <Callout type="key" title="Why a separate file">
        The framework stays clean — none of your company&apos;s data is baked
        into the plugin — and each project configures it for its own work. See{" "}
        <a href="/agent-policy">AGENT_POLICY.md</a> for the format, or start from
        a <a href="/policy-packs">policy pack</a> for a common stack.
      </Callout>

      <H2 id="hook">3 · Let the hooks do their jobs</H2>
      <p>
        From then on the <code>SessionStart</code> hook injects your{" "}
        <code>AGENT_POLICY.md</code> into context at the start of every session,
        so the policy no longer depends on the agent <em>remembering</em> to read
        it. If a project has no policy, it prints a two-line nudge instead.
      </p>
      <p>
        The <code>PreToolUse</code> hook is the hard half: it inspects each tool
        call before it runs and stops a hot one for explicit approval — and{" "}
        <strong>denies</strong> it outright in a non-interactive run, since
        nobody is there to approve. Every decision is appended to{" "}
        <code>.keel/audit.jsonl</code>.
      </p>

      <H2 id="verify">4 · See it work</H2>
      <p>
        Ask the agent to do something that touches a hot zone — for example,
        &ldquo;clean this up and push.&rdquo; Instead of executing, the{" "}
        <code>authorization-protocol</code> skill recognizes the push as a hot
        zone, returns a clearly-marked proposal with the exact scope, and waits
        for your explicit approval. If it doesn&apos;t stop itself, the hook
        stops it anyway.
      </p>
      <Callout type="note">
        That&apos;s the whole point: autonomy on the safe, undoable, internal
        work — and a hard stop before anything outward-facing, hard to undo, or
        system-rebuilding. Walk through a concrete case on{" "}
        <a href="/examples/green-light-brake">the green-light brake</a>.
      </Callout>

      <H2 id="daily">5 · The daily loop (optional)</H2>
      <p>
        If you took level 2 or 3, the rhythm is:{" "}
        <code>/keel-skills:session-start</code> to load state and run the checks
        before working, <code>/keel-skills:session-close</code> to write state
        back and leave a handoff, <code>/keel-skills:hygiene</code> weekly, and{" "}
        <code>/keel-skills:harvest</code> whenever there&apos;s spare capacity.
      </p>

      <H2 id="next">Where to go next</H2>
      <ul>
        <li>
          <a href="/concepts/authorization">Permission model</a> — the core:
          goal / method / green light, the four-step check, hot zones.
        </li>
        <li>
          <a href="/concepts/operating-loop">The operating loop</a> — sessions,
          documents that don&apos;t age, checks, and turning repetition into
          tools.
        </li>
        <li>
          <a href="/concepts/delegation">Model &amp; delegation</a> — pick the
          cheapest capable model; keep delegation shallow.
        </li>
        <li>
          <a href="/concepts/context">Context discipline</a> — keep sessions
          grounded in files, not chat.
        </li>
      </ul>

      <PrevNext current="/getting-started" />
    </>
  );
}
