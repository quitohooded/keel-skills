import type { Metadata } from "next";
import { PageHeader, H2, Callout, Pill, PrevNext } from "@/components/prose";
import { REPO_URL } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Specification",
  description:
    "The Keel Agent Governance Specification — a runtime-neutral statement of the authorization model and the AGENT_POLICY.md format, so Keel can be reimplemented anywhere.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Reference"
        title="The specification"
        lead="The authorization model written down independently of any runtime — so it can be cited, audited, and reimplemented outside Claude Code."
      />

      <p>
        <Pill>spec v0.1 · draft</Pill> <Pill>MIT</Pill>
      </p>
      <p>
        The Keel Skills plugin for Claude Code is the <em>reference</em>{" "}
        implementation. The spec itself is runtime-neutral: an Agent SDK app,
        another harness, or a CI gate can implement it too. It specifies two
        portable things — the <strong>authorization model</strong> and the{" "}
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
          <strong>The three levels (§2)</strong> — L1 / L2 / L3, of which only L3
          authorizes execution. See{" "}
          <a href="/concepts/authorization">the authorization model</a>.
        </li>
        <li>
          <strong>The four-step test (§3)</strong> — run before every action;
          first step that applies wins; any doubt → L3.
        </li>
        <li>
          <strong>Hot zones (§4)</strong> — the default categories a conforming
          implementation must treat as hot.
        </li>
        <li>
          <strong>Mechanical propagation (§5)</strong> — the only way approval is
          inherited without a new L3, gated on all four conditions.
        </li>
        <li>
          <strong>Delegation (§6)</strong> — subagents never grant L3; shallow
          nesting; no self-escalation.
        </li>
        <li>
          <strong>The <code>AGENT_POLICY.md</code> format (§7)</strong> — the six
          sections and the rules that keep them honest.
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
        <li>Runs the four-step test before every action.</li>
        <li>
          Treats every default hot-zone category as hot unless the policy
          concretely refines it.
        </li>
        <li>
          Only inherits approval through mechanical propagation when all four
          conditions hold.
        </li>
        <li>Never lets a subagent grant L3 (if it supports delegation).</li>
        <li>Resolves any doubt toward L3.</li>
      </ol>
      <Callout type="key">
        An implementation may add <strong>stricter</strong> rules. It must{" "}
        <strong>not</strong> relax §3–§5 below what the spec requires.
      </Callout>

      <H2 id="versioning">Versioning &amp; changes</H2>
      <p>
        The spec uses <code>MAJOR.MINOR</code>. A MINOR bump adds or clarifies
        without breaking a conforming implementation; a MAJOR bump may change
        required behavior. Implementations should declare which spec version they
        target.
      </p>
      <p>
        It&apos;s a draft, and proposals to clarify, tighten, or extend it are
        welcome via issues and PRs. If you build a Keel-compatible implementation
        for another runtime, open an issue so it can be listed.
      </p>

      <PrevNext current="/spec" />
    </>
  );
}
