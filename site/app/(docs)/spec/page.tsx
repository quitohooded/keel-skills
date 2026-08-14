import type { Metadata } from "next";
import { PageHeader, H2, Callout, Pill, PrevNext } from "@/components/prose";
import { REPO_URL } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Specification",
  description:
    "The Keel Agent Governance Specification — a runtime-neutral statement of the permission model (goal / method / green light) and the AGENT_POLICY.md format, so Keel can be reimplemented anywhere.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Reference"
        title="The specification"
        lead="The permission model written down independently of any runtime — so it can be cited, audited, and reimplemented outside Claude Code."
      />

      <p>
        <Pill>spec v0.3 · draft</Pill> <Pill>MIT</Pill>
      </p>
      <p>
        The Keel Skills plugin for Claude Code is the <em>reference</em>{" "}
        implementation. The spec itself is runtime-neutral: an Agent SDK app,
        another harness, or a CI gate can implement it too. It specifies two
        portable things — the <strong>permission model</strong> and the{" "}
        <strong>
          <code>AGENT_POLICY.md</code> format
        </strong>
        . The canonical document is{" "}
        <a href={`${REPO_URL}/blob/main/SPEC.md`}>SPEC.md</a> in the repo.
      </p>

      <H2 id="what-it-pins">What the spec pins down</H2>
      <ul>
        <li>
          <strong>Terminology</strong> — what counts as an <em>action</em>{" "}
          (writes, edits, commits, pushes, deploys, sends, deletes,
          reconfigures); reading and analysis are not actions.
        </li>
        <li>
          <strong>The three things (§2)</strong> — a goal, a method, a green
          light, of which only a green light means go. See{" "}
          <a href="/concepts/authorization">the permission model</a>.
        </li>
        <li>
          <strong>The four-step check (§3)</strong> — run before every action;
          first step that applies wins; any doubt → ask.
        </li>
        <li>
          <strong>Hot zones (§4)</strong> — the default categories a conforming
          implementation must treat as hot.
        </li>
        <li>
          <strong>Following through (§5)</strong> — the only way a green light
          carries over without asking again, gated on all four conditions.
        </li>
        <li>
          <strong>Delegation (§6)</strong> — subagents never grant a green light;
          shallow nesting; no self-escalation.
        </li>
        <li>
          <strong>Unattended agents (§6.1)</strong> — with no human present, no
          green light exists to be given, so anything needing one must not
          happen.
        </li>
        <li>
          <strong>The <code>AGENT_POLICY.md</code> format (§7)</strong> — the
          eight sections and the rules that keep them honest, plus the
          machine-readable block an enforcing implementation reads.
        </li>
      </ul>

      <H2 id="conformance">Conformance</H2>
      <p>
        An implementation is <strong>Keel-compatible</strong> if it:
      </p>
      <ol>
        <li>
          Reads <code>AGENT_POLICY.md</code> from the project root (or a path the
          user designates) and treats it as authoritative over the defaults.
        </li>
        <li>Runs the four-step check before every action.</li>
        <li>
          Treats every default hot-zone category as hot unless the policy
          concretely refines it.
        </li>
        <li>
          Only lets a green light carry over through following-through when all
          four conditions hold.
        </li>
        <li>Never lets a subagent grant a green light (if it supports delegation).</li>
        <li>Resolves any doubt toward stopping and asking.</li>
      </ol>
      <Callout type="key">
        An implementation may add <strong>stricter</strong> rules. It must{" "}
        <strong>not</strong> relax §3–§5 below what the spec requires.
      </Callout>
      <p>
        An implementation that additionally <em>enforces</em> the policy with
        deterministic code has extra requirements (§8.1), including one added in
        0.3: <strong>shell commands must be matched per segment</strong>, so a
        standing allowance can never clear a compound command it happens to
        start. Matching the whole string lets{" "}
        <code>npm run build &amp;&amp; git push --force</code> through as
        &ldquo;approved&rdquo; — a bypass, not a looser setting.
      </p>

      <H2 id="versioning">Versioning &amp; changes</H2>
      <p>
        The spec uses <code>MAJOR.MINOR</code>. A MINOR bump adds or clarifies
        without breaking a conforming implementation; a MAJOR bump may change
        required behavior. Implementations should declare which spec version they
        target.
      </p>
      <ul>
        <li>
          <strong>0.2</strong> renamed the three permission levels to plain words
          (goal / method / green light) without changing how they work.
        </li>
        <li>
          <strong>0.3</strong> added unattended agents (§6.1), two optional
          policy sections, and per-segment command matching. A{" "}
          <em>reasoning</em> implementation conforming to 0.2 still conforms; an{" "}
          <em>enforcing</em> one must adopt §8.1.5.
        </li>
      </ul>
      <p>
        It&apos;s a draft, and proposals to clarify, tighten, or extend it are
        welcome via issues and PRs. If you build a Keel-compatible implementation
        for another runtime, open an issue so it can be listed.
      </p>

      <PrevNext current="/spec" />
    </>
  );
}
