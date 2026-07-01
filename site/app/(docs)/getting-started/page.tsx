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
        This adds three skills, one command, and a <code>SessionStart</code>{" "}
        hook. The skills are model-invoked: they trigger themselves when the
        situation calls for it, so there&apos;s nothing to remember to run.
      </p>

      <H2 id="policy">2 · Scaffold your AGENT_POLICY.md</H2>
      <p>
        The skills ship generic. Everything specific to your project — which
        paths are hot, where your source of truth lives, what counts as a
        release — lives in a single file you control. Generate it with the
        command:
      </p>
      <CodeBlock title="In your project">{`/keel-skills:policy-init`}</CodeBlock>
      <p>
        It explores your repo, asks only what it can&apos;t infer, and writes a
        short, concrete <code>AGENT_POLICY.md</code> at the project root. Review
        it before treating it as authoritative — its content defines what the
        agent will stop for.
      </p>
      <Callout type="key" title="Why a separate file">
        The framework stays clean — none of your company&apos;s data is baked
        into the plugin — and each project configures it for its own work. See{" "}
        <a href="/agent-policy">AGENT_POLICY.md</a> for the format, or start from
        a <a href="/policy-packs">policy pack</a> for a common stack.
      </Callout>

      <H2 id="hook">3 · Let the hook load it</H2>
      <p>
        From then on, the <code>SessionStart</code> hook injects your{" "}
        <code>AGENT_POLICY.md</code> into context at the start of every session.
        The policy no longer depends on the agent <em>remembering</em> to read
        it. If a project has no policy, the hook is silent and the skills fall
        back to safe defaults.
      </p>

      <H2 id="verify">4 · See it work</H2>
      <p>
        Ask the agent to do something that touches a hot zone — for example,
        &ldquo;clean this up and push.&rdquo; Instead of executing, the{" "}
        <code>authorization-protocol</code> skill recognizes the push as a hot
        zone, returns a clearly-marked proposal with the exact scope, and waits
        for your explicit approval.
      </p>
      <Callout type="note">
        That&apos;s the whole point: autonomy on the safe, undoable, internal
        work — and a hard stop before anything outward-facing, hard to undo, or
        system-rebuilding. Walk through a concrete case on{" "}
        <a href="/examples/green-light-brake">the green-light brake</a>.
      </Callout>

      <H2 id="next">Where to go next</H2>
      <ul>
        <li>
          <a href="/concepts/authorization">Permission model</a> — the core:
          goal / method / green light, the four-step check, hot zones.
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
