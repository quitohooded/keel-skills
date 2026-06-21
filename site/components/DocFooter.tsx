import { REPO_URL, SITE_URL } from "@/lib/nav";
import GithubIcon from "@/components/GithubIcon";

export default function DocFooter() {
  return (
    <footer className="mx-auto max-w-content border-t border-line px-5 py-10 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
        <span>
          Keel Skills · MIT · © {new Date().getFullYear()} Esteban Aguilar
        </span>
        <div className="flex items-center gap-5">
          <a
            href={SITE_URL}
            className="transition-colors hover:text-ink"
          >
            estebanaguilar.me
          </a>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-ink"
          >
            <GithubIcon className="h-3.5 w-3.5" />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
