/* The signature diagram of the personal site, rebuilt for the docs:
   the three things that look like permission, with the green light (the only
   one that lets the agent act) highlighted and gently pulsing. */

const LEVELS = [
  {
    tag: "Goal",
    name: "A goal",
    note: '"improve this", "do what\'s needed", "handle it"',
    verdict: "Investigate + propose",
    executes: false,
  },
  {
    tag: "Method",
    name: "A method",
    note: '"use a migration", "edit the config", "use a subagent"',
    verdict: "Still not permission",
    executes: false,
  },
  {
    tag: "Green light",
    name: "A green light",
    note: "a clear yes to this exact action, or a recorded current decision",
    verdict: "Acts — within scope",
    executes: true,
  },
];

export default function AuthDiagram() {
  return (
    <div className="not-prose my-8 rounded-2xl border border-line bg-paper-2 p-6 md:p-8">
      <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
        Three things look like permission. Only one means go.
      </h3>
      <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
        Most "go do it" instructions are just a goal or a method
      </p>

      <ul className="mt-6 space-y-3">
        {LEVELS.map((level) => (
          <li
            key={level.tag}
            className={`flex items-center gap-4 rounded-xl border px-4 py-4 md:gap-6 md:px-6 ${
              level.executes
                ? "auth-row-l3 border-accent bg-accent-soft"
                : "border-line bg-paper"
            }`}
          >
            <span
              className={`w-24 shrink-0 font-display text-lg font-semibold leading-tight md:w-28 md:text-xl ${
                level.executes ? "text-accent" : "text-ink"
              }`}
            >
              {level.tag}
            </span>
            <span className="flex-1">
              <span className="block font-medium text-ink">{level.name}</span>
              <span className="block font-mono text-xs leading-relaxed text-muted">
                {level.note}
              </span>
            </span>
            <span
              className={`flex shrink-0 items-center gap-1.5 text-right font-mono text-[10px] uppercase tracking-[0.14em] md:text-[11px] ${
                level.executes ? "text-accent" : "text-muted"
              }`}
            >
              <span aria-hidden>{level.executes ? "→" : "✕"}</span>
              {level.verdict}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-ink">
        Read-only & proposals are free · risky / outward / undoable / system-rebuilding → ask · doubt → ask
      </p>
    </div>
  );
}
