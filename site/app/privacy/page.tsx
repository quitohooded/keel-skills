import type { Metadata } from "next";
import { PageHeader, H2, Callout } from "@/components/prose";
import { REPO_URL } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "Privacy policy for Keel Skills — an open-source Claude Code plugin that runs locally and collects no personal data.",
  alternates: { canonical: "/privacy" },
};

const CONTACT_EMAIL = "estebanaguilar0404@gmail.com";
const EFFECTIVE_DATE = "June 21, 2026";

export default function Page() {
  return (
    <div className="mx-auto max-w-content px-5 md:px-8">
      <main id="main" className="py-12 md:py-16">
        <article className="doc-prose mx-auto max-w-prose">
          <PageHeader
            eyebrow="Legal"
            title="Privacy policy"
            lead="Keel Skills is an open-source Claude Code plugin that runs entirely on your machine. It does not collect, transmit, or store any personal data."
          />

          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            Effective {EFFECTIVE_DATE}
          </p>

          <H2 id="summary">In short</H2>
          <p>
            Keel Skills (&ldquo;the plugin&rdquo;) is a set of skills, one
            command, and a session-start hook for Claude Code. It is distributed
            as open source under the MIT license. The plugin has no backend, no
            servers, no user accounts, and no analytics. It does not collect
            personal information from you, and it does not phone home.
          </p>
          <Callout type="key" title="No data collection">
            We do not collect, receive, store, sell, or share any personal data
            through the plugin. Everything it does happens locally inside your
            own Claude Code environment.
          </Callout>

          <H2 id="how-it-works">How the plugin works</H2>
          <p>
            The plugin operates entirely within Claude Code on your own machine.
            It reads and reasons over files in your project — most importantly an{" "}
            <code>AGENT_POLICY.md</code> that you create and control — to help an
            agent decide when it may act and when it must pause for your
            approval.
          </p>
          <ul>
            <li>
              Your <code>AGENT_POLICY.md</code> and any project files the plugin
              reads stay in your own repository, on your own machine. The plugin
              never transmits them anywhere.
            </li>
            <li>
              The plugin makes no network requests of its own. It has no
              telemetry, no tracking, and no remote logging.
            </li>
            <li>
              We never receive your code, your prompts, your policy file, or any
              other content you work with.
            </li>
          </ul>

          <H2 id="third-parties">Third-party services</H2>
          <p>
            The plugin runs inside Claude Code, which is a product of Anthropic.
            Your use of Claude Code itself is governed by{" "}
            <a
              href="https://www.anthropic.com/legal/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Anthropic&apos;s privacy policy
            </a>
            . The plugin does not change what Claude Code sends to Anthropic, and
            it does not add any third-party data processors of its own.
          </p>
          <p>
            If you install the plugin from a marketplace (for example the
            official Claude Code plugin directory or GitHub), the platform that
            hosts the download — Anthropic, GitHub, or another host you choose —
            handles that distribution under its own terms.
          </p>

          <H2 id="docs-site">This documentation site</H2>
          <p>
            This site (<code>docs.estebanaguilar.me</code>) is a static website
            hosted on Vercel. We do not add analytics, advertising, or tracking
            cookies. Vercel, as the hosting provider, may collect standard,
            aggregated server request logs (such as IP address and user agent)
            for operational and security purposes, as described in{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vercel&apos;s privacy policy
            </a>
            . We do not have access to identifiable analytics about you.
          </p>

          <H2 id="children">Children&apos;s privacy</H2>
          <p>
            The plugin is a developer tool and is not directed to children. We do
            not knowingly collect any information from anyone, including
            children.
          </p>

          <H2 id="changes">Changes to this policy</H2>
          <p>
            If this policy changes, the updated version will be published on this
            page with a new effective date. Because the documentation lives in
            the{" "}
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
              plugin&apos;s public repository
            </a>
            , the full history of changes is visible there.
          </p>

          <H2 id="contact">Contact</H2>
          <p>
            Questions about this policy or the plugin can be sent to{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, or opened as
            an issue in the{" "}
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
              GitHub repository
            </a>
            .
          </p>
        </article>
      </main>
    </div>
  );
}
