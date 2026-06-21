"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import GithubIcon from "@/components/GithubIcon";
import { REPO_URL, SITE_URL } from "@/lib/nav";

export default function DocHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-line bg-paper-blur backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="relative mx-auto flex h-16 max-w-content items-center justify-between px-5 md:px-8">
        {/* Left — subtle cross-link back to the personal site */}
        <a
          href={SITE_URL}
          title="Esteban Aguilar — estebanaguilar.me"
          className="group/home inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-accent"
        >
          <span className="hidden sm:inline">Esteban Aguilar</span>
          <span className="sm:hidden">E. Aguilar</span>
          <span
            className="text-[9px] transition-transform duration-300 group-hover/home:-translate-y-0.5 group-hover/home:translate-x-0.5"
            aria-hidden
          >
            ↗
          </span>
        </a>

        {/* Center — the docs wordmark (absolutely centered) */}
        <Link
          href="/"
          aria-label="Keel Skills docs — home"
          className="group/brand absolute left-1/2 inline-flex -translate-x-1/2 items-baseline gap-2"
        >
          <span className="font-display text-base font-semibold tracking-tight text-ink transition-colors group-hover/brand:text-accent md:text-lg">
            Keel Skills
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            docs
          </span>
        </Link>

        {/* Right — utilities */}
        <div className="flex items-center gap-3.5 justify-self-end font-mono text-[11px] uppercase tracking-[0.16em] sm:gap-5">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-ink"
          >
            <GithubIcon className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <ThemeToggle label="Toggle theme" />
        </div>
      </div>
    </header>
  );
}
