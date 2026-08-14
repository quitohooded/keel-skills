import Link from "next/link";
// The demo GIF lives once in the plugin repo (assets/). Next emits a hashed
// copy at build, so we don't duplicate the 9 MB asset inside site/public.
import demoGif from "../../assets/keel-demo.gif";
import AuthDiagram from "@/components/AuthDiagram";
import CodeBlock from "@/components/CodeBlock";
import GithubIcon from "@/components/GithubIcon";
import { CardGrid, Card } from "@/components/prose";
import {
  REPO_URL,
  INSTALL_MARKETPLACE,
  INSTALL_PLUGIN,
  VERSION,
} from "@/lib/nav";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-content px-5 md:px-8">
      {/* ---------------------------------------------------------- Hero */}
      <section className="grid items-center gap-10 py-14 md:grid-cols-[1.05fr_0.95fr] md:gap-12 md:py-20">
        <div>
          <p className="reveal font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
            Documentation · v{VERSION} · MIT
          </p>
          <h1
            className="reveal mt-4 font-display text-[2.6rem] font-semibold leading-[1.04] tracking-tight text-ink md:text-[3.5rem]"
            style={{ animationDelay: "60ms" }}
          >
            Disciplined operations for Claude agents.
          </h1>
          <p
            className="reveal mt-5 max-w-prose text-lg leading-relaxed text-ink-soft"
            style={{ animationDelay: "120ms" }}
          >
            Keel Skills is a portable governance framework for running Claude
            agents without breaking things or burning tokens — a
            goal/method/green-light permission model, cost-aware delegation, and
            file-grounded context discipline. Install it, configure it per project, done.
          </p>
          <div
            className="reveal mt-7 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "180ms" }}
          >
            <Link
              href="/getting-started"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.14em] text-paper transition-opacity hover:opacity-90"
            >
              Get started →
            </Link>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.14em] text-ink transition-colors hover:border-accent hover:text-accent"
            >
              <GithubIcon className="h-4 w-4" />
              GitHub
            </a>
          </div>
        </div>

        {/* Demo proof */}
        <figure className="reveal" style={{ animationDelay: "160ms" }}>
          <div className="overflow-hidden rounded-2xl border border-line bg-paper-2 p-2 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={demoGif.src}
              alt="Keel Skills stopping an agent told to 'clean up and push': it runs the four-step check, stops at the risky zone, and proposes a scoped plan instead."
              className="w-full rounded-xl"
              width={demoGif.width}
              height={demoGif.height}
            />
          </div>
          <figcaption className="mt-3 font-mono text-[11px] leading-relaxed text-muted">
            The agent got "clean it up and push." Without a rule it just does it.
            With Keel it hits a hot zone, stops, and proposes a scoped plan.
          </figcaption>
        </figure>
      </section>

      {/* ---------------------------------------------------------- In plain words */}
      <section className="border-t border-line py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-[15rem_1fr] md:gap-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            In plain words
          </p>
          <p className="max-w-prose text-lg leading-relaxed text-ink-soft">
            AI assistants that write code can now act on their own — and
            sometimes they do something you can&apos;t undo, like permanently
            deleting work or publishing to the live system before anyone checked
            it. Keel Skills is a set of house rules: it lets the assistant handle
            the small, safe things by itself, but makes it{" "}
            <strong className="text-ink">stop and ask you first</strong> before
            anything risky or permanent. You stay in control without watching
            every step.
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------- Auth model */}
      <section className="border-t border-line py-12 md:py-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          The core idea
        </p>
        <h2 className="mt-3 max-w-[20ch] font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          A four-step check before anything that writes or changes.
        </h2>
        <AuthDiagram />
        <p className="text-sm text-ink-soft">
          The full model — hot zones, following through, tie-breakers — is
          on the{" "}
          <Link href="/concepts/authorization" className="text-accent underline underline-offset-2">
            Permission model
          </Link>{" "}
          page, and specified runtime-neutral in the{" "}
          <Link href="/spec" className="text-accent underline underline-offset-2">
            spec
          </Link>
          .
        </p>
      </section>

      {/* ---------------------------------------------------------- Install */}
      <section className="border-t border-line py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-[15rem_1fr] md:gap-12">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              Install
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Two lines in Claude Code, then scaffold your policy. Full steps in{" "}
              <Link href="/getting-started" className="text-accent underline underline-offset-2">
                Getting started
              </Link>
              .
            </p>
          </div>
          <div className="max-w-prose">
            <CodeBlock title="Claude Code">{`${INSTALL_MARKETPLACE}\n${INSTALL_PLUGIN}`}</CodeBlock>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- Explore */}
      <section className="border-t border-line py-12 md:py-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          Explore the docs
        </p>
        <CardGrid>
          <Card href="/getting-started" title="Getting started">
            Install, scaffold an AGENT_POLICY.md, and run your first guarded
            session.
          </Card>
          <Card href="/concepts/authorization" title="Permission model">
            Goal, method, green light; the four-step check; hot zones; following through.
          </Card>
          <Card href="/agent-policy" title="AGENT_POLICY.md">
            The single file where your project&apos;s hot zones and sources of
            truth live.
          </Card>
          <Card href="/spec" title="Specification">
            The runtime-neutral spec so Keel can be reimplemented anywhere.
          </Card>
        </CardGrid>
      </section>
    </div>
  );
}
