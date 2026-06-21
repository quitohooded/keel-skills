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
      <div className="mx-auto flex h-16 max-w-content items-center justify-between px-5 md:px-8">
        <div className="flex items-baseline gap-2.5">
          <Link
            href="/"
            className="font-display text-lg font-semibold tracking-tight text-ink transition-colors hover:text-accent"
          >
            Keel Skills
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            docs
          </span>
        </div>

        <div className="flex items-center gap-3.5 font-mono text-[11px] uppercase tracking-[0.16em] sm:gap-5">
          {/* Author mark — doubles as the way home to estebanaguilar.me */}
          <a
            href={SITE_URL}
            title="Esteban Aguilar — estebanaguilar.me"
            className="group/home inline-flex items-center gap-2 text-muted transition-colors hover:text-ink"
          >
            <span className="grid h-[26px] w-[26px] place-items-center rounded-[8px] bg-accent font-display text-[12px] font-semibold leading-none text-paper transition-transform duration-300 group-hover/home:-rotate-6">
              EA
            </span>
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="text-[9px] tracking-[0.14em] text-muted">by</span>
              <span className="text-[11px] tracking-[0.12em] text-ink">
                Esteban Aguilar
              </span>
            </span>
            <span
              className="hidden text-[9px] text-muted transition-transform duration-300 group-hover/home:-translate-y-0.5 group-hover/home:translate-x-0.5 sm:inline"
              aria-hidden
            >
              ↗
            </span>
          </a>
          <span className="text-line" aria-hidden>
            |
          </span>
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
