import Link from "next/link";
import type { ReactNode } from "react";
import { flatNav } from "@/lib/nav";

/* ----------------------------------------------------------------
   Page header — the eyebrow + title + lead at the top of each page.
   ---------------------------------------------------------------- */
export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: ReactNode;
}) {
  return (
    <header className="mb-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
        {eyebrow}
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-ink md:text-5xl">
        {title}
      </h1>
      {lead ? (
        <p className="mt-5 max-w-prose text-lg leading-relaxed text-ink-soft">
          {lead}
        </p>
      ) : null}
      <div className="mt-7 h-px w-full bg-line" />
    </header>
  );
}

/* ----------------------------------------------------------------
   Anchored headings — hoverable # link, stable ids for deep links.
   ---------------------------------------------------------------- */
export function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id}>
      {children}
      <a href={`#${id}`} className="heading-anchor no-prose" aria-label="Link to this section">
        #
      </a>
    </h2>
  );
}

export function H3({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h3 id={id}>
      {children}
      <a href={`#${id}`} className="heading-anchor no-prose" aria-label="Link to this section">
        #
      </a>
    </h3>
  );
}

/* ----------------------------------------------------------------
   Callout — note / warning / tip boxes.
   ---------------------------------------------------------------- */
const CALLOUT_STYLES: Record<string, { ring: string; tag: string; label: string }> = {
  note: { ring: "border-line bg-paper-2", tag: "text-muted", label: "Note" },
  key: { ring: "border-accent/40 bg-accent-soft", tag: "text-accent", label: "Key idea" },
  warn: { ring: "border-accent/40 bg-accent-soft", tag: "text-accent", label: "Watch out" },
};

export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: "note" | "key" | "warn";
  title?: string;
  children: ReactNode;
}) {
  const s = CALLOUT_STYLES[type];
  return (
    <div className={`not-prose my-6 rounded-xl border px-5 py-4 ${s.ring}`}>
      <p className={`mb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] ${s.tag}`}>
        {title ?? s.label}
      </p>
      <div className="text-[0.95rem] leading-relaxed text-ink-soft [&_strong]:text-ink [&_strong]:font-semibold">
        {children}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
   Cards — a grid of links (used on the overview & index pages).
   ---------------------------------------------------------------- */
export function CardGrid({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose my-7 grid gap-4 sm:grid-cols-2">{children}</div>
  );
}

export function Card({
  href,
  title,
  children,
}: {
  href: string;
  title: string;
  children?: ReactNode;
}) {
  const external = href.startsWith("http");
  const inner = (
    <>
      <div className="flex items-center justify-between">
        <span className="font-display text-lg font-semibold text-ink transition-colors group-hover:text-accent">
          {title}
        </span>
        <span
          className="font-mono text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
          aria-hidden
        >
          →
        </span>
      </div>
      {children ? (
        <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{children}</p>
      ) : null}
    </>
  );
  const cls =
    "group block rounded-xl border border-line bg-paper-2 px-5 py-4 transition-colors hover:border-accent/50";
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

/* ----------------------------------------------------------------
   Pill — small inline tag.
   ---------------------------------------------------------------- */
export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-paper-2 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
      {children}
    </span>
  );
}

/* ----------------------------------------------------------------
   PrevNext — derived from the flat nav order.
   ---------------------------------------------------------------- */
export function PrevNext({ current }: { current: string }) {
  const idx = flatNav.findIndex((i) => i.href === current);
  const prev = idx > 0 ? flatNav[idx - 1] : null;
  const next = idx >= 0 && idx < flatNav.length - 1 ? flatNav[idx + 1] : null;

  if (!prev && !next) return null;

  return (
    <nav className="not-prose mt-16 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
      {prev ? (
        <Link
          href={prev.href}
          className="group rounded-xl border border-line bg-paper-2 px-5 py-4 transition-colors hover:border-accent/50"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            ← Previous
          </span>
          <span className="mt-1 block font-display text-base font-semibold text-ink transition-colors group-hover:text-accent">
            {prev.title}
          </span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
      {next ? (
        <Link
          href={next.href}
          className="group rounded-xl border border-line bg-paper-2 px-5 py-4 text-right transition-colors hover:border-accent/50"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            Next →
          </span>
          <span className="mt-1 block font-display text-base font-semibold text-ink transition-colors group-hover:text-accent">
            {next.title}
          </span>
        </Link>
      ) : null}
    </nav>
  );
}
