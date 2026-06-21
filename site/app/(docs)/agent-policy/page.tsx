import type { Metadata } from "next";
import { PageHeader, H2, Callout, PrevNext } from "@/components/prose";
import CodeBlock from "@/components/CodeBlock";

export const metadata: Metadata = {
  title: "AGENT_POLICY.md",
  description:
    "The single per-project file where your hot zones, sources of truth, and standing approvals live. The skills ship generic; this is the only place your data lives.",
};

const TEMPLATE = `# AGENT_POLICY.md — project configuration for the Keel Skills framework

## 1. Hot zones (require explicit L3 approval before any change)
- **Client/external-facing surfaces:**
  - <e.g. src/pages, content/, public API routes>
- **Production / data / infra:**
  - <e.g. database, schema/migrations, settings, CI/CD, deploy config, hooks>
- **Outward / irreversible actions:**
  - <e.g. git push, deploy, sending email, charging, deleting data>
- **Anything else this project treats as hot:**
  - <...>

## 2. Source-of-truth artifacts
- <e.g. docs/decisions.md, the canonical spec, the master copy doc>

## 3. Where state and decisions get recorded
- **Decisions log:** <path>
- **Project state / status file:** <path>
- **Per-task notes:** <path or convention>

## 4. Model tier overrides (optional)
- Mechanical work → <default: cheapest tier>
- Research / synthesis → <default: mid tier>
- Planning / architecture / cross-cutting → <default: top tier>

## 5. Definitions for this project (optional)
- "Reversible" here means: <...>
- "Internal" here means: <...>
- A "release" here means: <...>

## 6. Standing approvals (optional)
- [APPROVED <date>] <action + exact scope it covers>`;

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Configure"
        title="AGENT_POLICY.md"
        lead="The skills describe the pattern. This file describes your project. It's the only place your specifics live — so the framework ships clean, with none of your data inside."
      />

      <p>
        A single Markdown file at your project root. The skills read it to learn
        what&apos;s hot here, where your source of truth lives, and what standing
        approvals exist. Generate it with{" "}
        <code>/keel-skills:policy-init</code>, or copy the template below. Keep it{" "}
        <strong>short and concrete</strong>.
      </p>

      <H2 id="sections">The sections</H2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Section</th>
            <th>Required</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td><strong>Hot zones</strong></td>
            <td>Yes</td>
            <td>Concrete paths / surfaces / actions that require L3.</td>
          </tr>
          <tr>
            <td>2</td>
            <td><strong>Source-of-truth artifacts</strong></td>
            <td>Yes</td>
            <td>Files where only mechanical propagation runs without L3.</td>
          </tr>
          <tr>
            <td>3</td>
            <td><strong>Where state &amp; decisions get recorded</strong></td>
            <td>Yes</td>
            <td>Decisions log, project-state file, per-task notes.</td>
          </tr>
          <tr>
            <td>4</td>
            <td>Model tier overrides</td>
            <td>No</td>
            <td>Project-specific overrides of the delegation defaults.</td>
          </tr>
          <tr>
            <td>5</td>
            <td>Definitions for this project</td>
            <td>No</td>
            <td>Pin down &ldquo;reversible&rdquo;, &ldquo;internal&rdquo;, &ldquo;release&rdquo;, etc.</td>
          </tr>
          <tr>
            <td>6</td>
            <td>Standing approvals</td>
            <td>No</td>
            <td>Recorded decisions granting L3 in advance for a defined scope.</td>
          </tr>
        </tbody>
      </table>

      <H2 id="rules">Rules that keep it honest</H2>
      <ul>
        <li>
          Hot zones must be <strong>concrete</strong> — a real path or a real
          action. Vague hot zones get ignored.
        </li>
        <li>
          Anything not listed is treated as potentially hot{" "}
          <strong>only</strong> when the four-step test says so; under doubt, the
          implementation escalates to L3.
        </li>
        <li>
          A standing approval that does not state its scope explicitly is{" "}
          <strong>not</strong> a valid L3 source — the implementation must not
          infer the scope.
        </li>
      </ul>
      <Callout type="warn" title="Don't gut the defaults">
        A project may refine the specifics of a hot-zone category, but must{" "}
        <strong>not</strong> remove a category wholesale. The defaults are the
        floor.
      </Callout>

      <H2 id="template">The template</H2>
      <p>Copy this to your project root and fill it in:</p>
      <CodeBlock title="AGENT_POLICY.md">{TEMPLATE}</CodeBlock>
      <p>
        Prefer to start from something closer to your stack? See{" "}
        <a href="/policy-packs">policy packs</a> for ready-made starters.
      </p>

      <PrevNext current="/agent-policy" />
    </>
  );
}
