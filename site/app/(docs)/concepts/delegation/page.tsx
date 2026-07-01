import type { Metadata } from "next";
import { PageHeader, H2, Callout, PrevNext } from "@/components/prose";

export const metadata: Metadata = {
  title: "Model & delegation",
  description:
    "Choose the cheapest model that preserves quality and risk control; keep delegation shallow; reach for the lightest tool first.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Concepts"
        title="Model & delegation discipline"
        lead="Run agents the way you'd run a team: assign the cheapest worker who can do the job well, keep the org chart shallow, and don't let anyone quietly promote themselves."
      />

      <p>
        An over-powered model on a trivial task wastes money; an under-powered
        one on a judgment task produces confident garbage. The discipline
        protects both cost and quality.
      </p>

      <H2 id="tiers">Pick the cheapest tier that preserves quality</H2>
      <p>
        Match the model tier to the <em>kind of thinking</em> the task needs,
        not to how important the task feels.
      </p>
      <table>
        <thead>
          <tr>
            <th>Tier</th>
            <th>Use it for</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Cheapest / fastest</strong>
              <br />
              (e.g. Haiku)
            </td>
            <td>
              Mechanical work with no strong judgment: inventories, searches,
              counts, simple extraction, direct comparisons, repetitive cleanup,
              format conversions.
            </td>
          </tr>
          <tr>
            <td>
              <strong>Mid</strong>
              <br />
              (e.g. Sonnet)
            </td>
            <td>
              Research, code exploration, reading repos, diagnosis, synthesis,
              judgment-bearing writing, and tasks that combine several sources.
            </td>
          </tr>
          <tr>
            <td>
              <strong>Top</strong>
              <br />
              (e.g. Opus)
            </td>
            <td>
              Only real planning, conflicts between sources, complex trade-offs,
              architecture, product decisions, or cross-cutting changes with real
              impact.
            </td>
          </tr>
        </tbody>
      </table>
      <Callout type="key">
        Default downward. If you&apos;re unsure whether a task needs the higher
        tier, it usually doesn&apos;t — but a task that mixes mechanical and
        judgment work should be <strong>split</strong>, not promoted wholesale.
        Projects may override these mappings in{" "}
        <a href="/agent-policy">AGENT_POLICY.md</a>.
      </Callout>

      <H2 id="limits">Delegation limits</H2>
      <ul>
        <li>
          <strong>The cheapest tier never spawns its own subagents.</strong> If
          a mechanical task needs to delegate, it was scoped wrong — return it to
          the parent.
        </li>
        <li>
          <strong>Maximum depth: 2 levels</strong> (parent → subagent → one
          more). Deeper nesting loses context and accountability faster than it
          buys parallelism.
        </li>
        <li>
          <strong>No self-escalation.</strong> If a subagent decides it needs a
          smarter model, it does not upgrade itself — it returns to the parent
          with what it found and why. The parent decides.
        </li>
        <li>
          <strong>A subagent cannot approve, confirm, or do anything risky in a
          hot zone.</strong> The green light always comes back to the human (or
          the parent acting under a human&apos;s green light). See{" "}
          <a href="/concepts/authorization">the permission model</a>.
        </li>
        <li>
          <strong>Delegation does not replace reading the source.</strong> A
          summary from a subagent is an input, not the ground truth. Validate
          against the real files before acting.
        </li>
      </ul>

      <H2 id="tool-ladder">The tool ladder</H2>
      <p>
        Reach for the lightest tool that can do the job well, and only climb when
        it genuinely can&apos;t:
      </p>
      <ul>
        <li>
          <strong>Simple public pages</strong> → a plain fetch.
        </li>
        <li>
          <strong>Dynamic pages, pages behind a login, or pages needing
          interaction</strong> → a browser-driving tool.
        </li>
        <li>
          <strong>PDFs</strong> → extract the text first. Use a heavy
          visual/layout tool only when the layout itself carries meaning.
        </li>
        <li>
          <strong>Local repos</strong> → prefer fast search
          (<code>rg</code>/grep), per-folder inventories, and selective reads{" "}
          <em>before</em> loading large amounts of context.
        </li>
      </ul>

      <H2 id="encapsulate">Encapsulate repetition</H2>
      <p>
        If the same pattern shows up several times — the same multi-step lookup,
        the same cleanup, the same report — stop repeating it by hand and burning
        context. Turn it into a reusable tool, script, or documented procedure,
        then call that. Manual repetition is both a cost leak and an error
        source.
      </p>

      <H2 id="one-line">In one line</H2>
      <blockquote>
        Cheapest model that can do it well; shallow delegation (max depth 2, no
        self-escalation, no subagent approvals); lightest tool first; script
        anything you do more than a couple of times.
      </blockquote>

      <PrevNext current="/concepts/delegation" />
    </>
  );
}
