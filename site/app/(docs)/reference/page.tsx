import type { Metadata } from "next";
import { PageHeader, H2, H3, Pill, Callout, PrevNext } from "@/components/prose";

export const metadata: Metadata = {
  title: "Skills, commands & hooks",
  description:
    "Reference for every component Keel Skills ships: five skills, six commands, two hooks, and the runnable templates — what each does and how it triggers.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Reference"
        title="Skills, commands & hooks"
        lead="Everything the plugin ships. Skills are model-invoked — they trigger themselves when the situation calls for it. Commands are things you run. Hooks run automatically, and one of them can stop a tool call outright."
      />

      <H2 id="skills">Skills</H2>

      <H3 id="authorization-protocol">authorization-protocol</H3>
      <p>
        <Pill>skill</Pill> <Pill>model-invoked</Pill>
      </p>
      <p>
        Decides whether the agent may act or must stop and ask — goal / method /
        green light (only a green light means go), the four-step check, hot
        zones, the following-through rule, and the rule for unattended runs.
        Triggers before any action that writes, edits, commits, pushes, deploys,
        sends, publishes, or reconfigures, and whenever a request is a vague goal
        (&ldquo;do whatever is needed&rdquo;, &ldquo;fix this&rdquo;,
        &ldquo;handle it&rdquo;) with no specific scope.
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
        Keeps the session anchored in files rather than chat, covers what to do
        at the two ends of a session, and signals when to end a long one and hand
        off cleanly. Triggers on long sessions, context bloat, &ldquo;where did
        we leave off&rdquo;, source of truth, session handoff, and wrapping up.
      </p>
      <p>
        Full write-up: <a href="/concepts/context">context discipline</a>.
      </p>

      <H3 id="workspace-hygiene">workspace-hygiene</H3>
      <p>
        <Pill>skill</Pill> <Pill>model-invoked</Pill> <Pill>new in 0.6</Pill>
      </p>
      <p>
        Keeps documents and state honest as they age, and catches the drift a
        written rule didn&apos;t prevent: separating state from history and when
        to cut, why a bootstrap carries no state, dated snapshots, checks that
        each exist because a real drift already got through, the three finding
        levels, ratchet budgets, and what a periodic sweep may never do. Triggers
        on &ldquo;is this still true&rdquo;, stale docs, a doc contradicting the
        code, drift, a state file growing, and maintenance routines.
      </p>
      <p>
        Full write-up: <a href="/concepts/operating-loop">the operating loop</a>.
      </p>

      <H3 id="repeatable-work">repeatable-work</H3>
      <p>
        <Pill>skill</Pill> <Pill>model-invoked</Pill> <Pill>new in 0.6</Pill>
      </p>
      <p>
        Turns repeated manual work into a script or documented procedure: the
        rule of three, counting occurrences without fooling yourself, the
        properties an agent-run tool needs, test banks with a negative control,
        and the capture → harvest → adopt loop. Triggers on &ldquo;I keep doing
        this&rdquo;, third time, &ldquo;write a script&rdquo;, automate,
        encapsulate, and improvement backlog.
      </p>
      <p>
        Full write-up:{" "}
        <a href="/concepts/operating-loop#repetition">the operating loop</a>.
      </p>

      <H2 id="commands">Commands</H2>

      <H3 id="onboard">/keel-skills:onboard</H3>
      <p>
        <Pill>command</Pill> <Pill>you run it</Pill> <Pill>new in 0.6</Pill>
      </p>
      <p>
        The initiation program — run this first. It inspects what is actually in
        the directory (a repo or not, one project or several, the stack, existing
        agent instructions, existing state files, <em>or nothing at all</em>),
        reports what it found <em>and what it could not tell</em>, then offers
        three sizes and builds only the one you pick: the brake alone, plus the
        session loop, or plus the maintenance loop.
      </p>
      <Callout type="note">
        It ends by making the brake fire on a real command and showing you the
        audit line — because &ldquo;it&apos;s set up&rdquo; is a claim, not
        evidence. If the hook doesn&apos;t fire, that&apos;s a finding to chase,
        not something to gloss over.
      </Callout>

      <H3 id="policy-init">/keel-skills:policy-init</H3>
      <p>
        <Pill>command</Pill> <Pill>you run it</Pill>
      </p>
      <p>
        Scaffolds your project&apos;s <a href="/agent-policy">AGENT_POLICY.md</a>{" "}
        by exploring the repo and interviewing you about your hot zones and
        sources of truth. Checks for an existing policy first and offers to
        extend rather than overwrite. <code>onboard</code> calls this for its
        policy step, so the interview lives in one place.
      </p>

      <H3 id="session-start-cmd">/keel-skills:session-start</H3>
      <p>
        <Pill>command</Pill> <Pill>you run it</Pill> <Pill>new in 0.6</Pill>
      </p>
      <p>
        Opens a session from files: rules, then state, then only the docs for the
        area you&apos;re touching — and runs the project&apos;s checks{" "}
        <strong>before</strong> the work, so drift from the last session surfaces
        while it is still cheap and clearly not yours.
      </p>

      <H3 id="session-close-cmd">/keel-skills:session-close</H3>
      <p>
        <Pill>command</Pill> <Pill>you run it</Pill> <Pill>new in 0.6</Pill>
      </p>
      <p>
        Reconciles the session into the files: resolved items move to history,
        verified facts land where they belong, gaps get recorded as gaps. One
        line of history. Re-runs the checks, reports what&apos;s uncommitted, and
        leaves a handoff a fresh session can resume from.
      </p>

      <H3 id="hygiene-cmd">/keel-skills:hygiene</H3>
      <p>
        <Pill>command</Pill> <Pill>you run it</Pill> <Pill>schedulable</Pill>{" "}
        <Pill>new in 0.6</Pill>
      </p>
      <p>
        A read-only sweep: uncommitted work, secrets in tracked files, state
        drift, stale drafts. <strong>It never fixes, commits, or deletes</strong>{" "}
        — everything needing a change is reported with a recommendation, which is
        what makes it safe to run unattended.
      </p>

      <H3 id="harvest-cmd">/keel-skills:harvest</H3>
      <p>
        <Pill>command</Pill> <Pill>you run it</Pill> <Pill>new in 0.6</Pill>
      </p>
      <p>
        Reviews what repeated across recent sessions and drafts the tools worth
        building. <strong>It proposes; it never adopts.</strong> Run it in its own
        session when capacity is spare — it costs a lot and produces no product.
      </p>

      <H2 id="hooks">Hooks</H2>

      <H3 id="session-start-hook">SessionStart — inject-policy.cjs</H3>
      <p>
        <Pill>hook</Pill> <Pill>automatic</Pill>
      </p>
      <p>
        If your project has an <code>AGENT_POLICY.md</code>, it&apos;s injected
        into context at the start of every session — so the policy no longer
        depends on the agent <em>remembering</em> to read it. If there&apos;s no
        policy it prints a two-line nudge pointing at <code>onboard</code>, since
        installed-but-unconfigured is the most common way this framework silently
        does nothing. Silence the nudge with a policy, or{" "}
        <code>.keel/skip-onboarding</code>.
      </p>

      <H3 id="pretooluse-hook">PreToolUse — enforce-policy.cjs</H3>
      <p>
        <Pill>hook</Pill> <Pill>automatic</Pill> <Pill>can deny</Pill>
      </p>
      <p>
        The hard backstop. Inspects every tool call <em>before</em> it runs and
        returns allow / ask / deny against the spec&apos;s hot defaults plus your
        policy&apos;s concrete paths, commands and MCP tools. <em>Ask</em> is the
        request for a green light. In a non-interactive run
        (<code>CI</code>, <code>KEEL_NONINTERACTIVE=1</code>) a hot action is{" "}
        <strong>denied</strong> instead, because no human is there to approve it.
        Every decision lands in <code>.keel/audit.jsonl</code>.
      </p>
      <p>
        Shell commands are matched <strong>per segment</strong>: a standing
        allowance clears only the command it matches, never what that command is
        chained to, so <code>npm run build &amp;&amp; git push</code> stays hot.
      </p>
      <Callout type="warn">
        <strong>A backstop, not a sandbox.</strong> It catches accidents, drift
        and hallucinated actions — a large lift in assurance — but a determined
        or jailbroken agent with shell access can route around pattern matching.
        Scoped credentials and real isolation are complementary, not replaced.
      </Callout>

      <H2 id="templates">Runnable templates</H2>
      <p>
        Copy these into your project — <code>onboard</code> does it for you at
        the level you pick.
      </p>
      <table>
        <thead>
          <tr>
            <th>Template</th>
            <th>What it is</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>checks/keel_checks.py</code></td>
            <td>Dependency-free, read-only checks script: five universal checks, the FAIL/WARN/info split from git status, and a documented extension point</td>
          </tr>
          <tr>
            <td><code>checks/test_keel_checks.py</code></td>
            <td>Its test bank — ten cases, four of them negative controls that fail if the checks go quiet</td>
          </tr>
          <tr>
            <td><code>PROJECT_STATE.template.md</code></td>
            <td>What is true now and what is open, with the status labels</td>
          </tr>
          <tr>
            <td><code>HISTORY.template.md</code></td>
            <td>What happened, dated — and the one-line rule that keeps it readable</td>
          </tr>
          <tr>
            <td><code>IMPROVEMENTS.template.md</code></td>
            <td>The capture file for the improvement loop</td>
          </tr>
          <tr>
            <td><code>routines/weekly-hygiene.md</code></td>
            <td>A ready-made prompt for an unattended weekly sweep</td>
          </tr>
          <tr>
            <td><code>AGENT_POLICY.template.md</code></td>
            <td>The canonical policy template</td>
          </tr>
        </tbody>
      </table>

      <H2 id="layout">Repository layout</H2>
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
            <td>Commands</td>
            <td><code>plugins/keel-skills/commands/&lt;name&gt;.md</code></td>
          </tr>
          <tr>
            <td>Hooks</td>
            <td><code>plugins/keel-skills/hooks/hooks.json</code> + <code>inject-policy.cjs</code> + <code>enforce-policy.cjs</code></td>
          </tr>
          <tr>
            <td>Templates</td>
            <td><code>plugins/keel-skills/templates/</code></td>
          </tr>
          <tr>
            <td>Policy packs</td>
            <td><code>policies/&lt;stack&gt;/AGENT_POLICY.md</code></td>
          </tr>
          <tr>
            <td>This repo&apos;s own policy</td>
            <td><code>AGENT_POLICY.md</code> — Keel Skills runs on Keel Skills</td>
          </tr>
        </tbody>
      </table>

      <PrevNext current="/reference" />
    </>
  );
}
