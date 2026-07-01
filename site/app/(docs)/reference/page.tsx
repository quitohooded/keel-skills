import type { Metadata } from "next";
import { PageHeader, H2, H3, Pill, Callout, PrevNext } from "@/components/prose";

export const metadata: Metadata = {
  title: "Skills, command & hook",
  description:
    "Reference for every component Keel Skills ships: three skills, one command, and a SessionStart hook — what each does and how it triggers.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Reference"
        title="Skills, command & hook"
        lead="Everything the plugin ships. The skills are model-invoked — they trigger themselves when the situation calls for it. The command is something you run."
      />

      <H2 id="skills">Skills</H2>

      <H3 id="authorization-protocol">authorization-protocol</H3>
      <p>
        <Pill>skill</Pill> <Pill>model-invoked</Pill>
      </p>
      <p>
        Decides whether the agent may act or must stop and ask — goal / method /
        green light (only a green light means go), the four-step check, hot
        zones, and the following-through rule. Triggers before any action that
        writes, edits, commits, pushes, deploys, sends, publishes, or
        reconfigures, and whenever a request is a vague goal (&ldquo;do whatever
        is needed&rdquo;, &ldquo;fix this&rdquo;, &ldquo;handle it&rdquo;) with no
        specific scope.
      </p>
      <p>
        Full write-up: <a href="/concepts/authorization">the permission model</a>.
      </p>

      <H3 id="model-delegation">model-delegation</H3>
      <p>
        <Pill>skill</Pill> <Pill>model-invoked</Pill>
      </p>
      <p>
        Picks the cheapest model that still preserves quality and risk control,
        and keeps delegation shallow — tiers by task type, max subagent depth,
        no self-escalation, and a cheapest-first tool ladder. Triggers on model
        selection, &ldquo;delegate this&rdquo;, &ldquo;spawn a subagent&rdquo;,
        agent depth, cost control, and tool choice.
      </p>
      <p>
        Full write-up: <a href="/concepts/delegation">model &amp; delegation</a>.
      </p>

      <H3 id="context-discipline">context-discipline</H3>
      <p>
        <Pill>skill</Pill> <Pill>model-invoked</Pill>
      </p>
      <p>
        Keeps the session anchored in files rather than chat, and signals when to
        end a long session and hand off cleanly. Triggers on long sessions,
        context bloat, &ldquo;where did we leave off&rdquo;, source of truth, and
        session handoff.
      </p>
      <p>
        Full write-up: <a href="/concepts/context">context discipline</a>.
      </p>

      <H2 id="command">Command</H2>

      <H3 id="policy-init">/keel-skills:policy-init</H3>
      <p>
        <Pill>command</Pill> <Pill>you run it</Pill>
      </p>
      <p>
        Scaffolds your project&apos;s <a href="/agent-policy">AGENT_POLICY.md</a>{" "}
        by exploring the repo and interviewing you about your hot zones and
        sources of truth. It checks for an existing policy first (and offers to
        extend rather than overwrite), asks only what it can&apos;t infer, and
        shows you the result before treating it as authoritative.
      </p>
      <Callout type="note">
        Creating the file is a low-impact, reversible action — but its{" "}
        <em>content</em> defines what the agent treats as hot, so the command
        always has you confirm it.
      </Callout>

      <H2 id="hook">Hook</H2>

      <H3 id="session-start">SessionStart</H3>
      <p>
        <Pill>hook</Pill> <Pill>automatic</Pill>
      </p>
      <p>
        If your project has an <code>AGENT_POLICY.md</code>, it&apos;s injected
        into context at the start of every session — so the policy no longer
        depends on the agent <em>remembering</em> to read it. If there&apos;s no
        policy, the hook is silent and the skills fall back to safe defaults. It
        runs as a cross-platform Node script, so it works the same on macOS,
        Linux, and Windows.
      </p>

      <H2 id="layout">Repository layout</H2>
      <p>Where each component lives in the plugin:</p>
      <table>
        <thead>
          <tr>
            <th>Component</th>
            <th>Path</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Skills</td>
            <td><code>plugins/keel-skills/skills/&lt;name&gt;/SKILL.md</code></td>
          </tr>
          <tr>
            <td>Command</td>
            <td><code>plugins/keel-skills/commands/policy-init.md</code></td>
          </tr>
          <tr>
            <td>Hook</td>
            <td><code>plugins/keel-skills/hooks/hooks.json</code> + <code>inject-policy.cjs</code></td>
          </tr>
          <tr>
            <td>Policy template</td>
            <td><code>plugins/keel-skills/templates/AGENT_POLICY.template.md</code></td>
          </tr>
          <tr>
            <td>Policy packs</td>
            <td><code>policies/&lt;stack&gt;/AGENT_POLICY.md</code></td>
          </tr>
        </tbody>
      </table>

      <PrevNext current="/reference" />
    </>
  );
}
