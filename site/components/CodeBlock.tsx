"use client";

import { useState } from "react";

export default function CodeBlock({
  children,
  title,
  lang,
}: {
  children: string;
  title?: string;
  lang?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(children.trimEnd());
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="not-prose my-5 overflow-hidden rounded-xl border border-line bg-paper-2">
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
          {title ?? lang ?? "shell"}
        </span>
        <button
          type="button"
          onClick={copy}
          className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent"
          aria-label="Copy code"
        >
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-3.5 text-[13px] leading-relaxed">
        <code className="font-mono text-ink">{children.trimEnd()}</code>
      </pre>
    </div>
  );
}
