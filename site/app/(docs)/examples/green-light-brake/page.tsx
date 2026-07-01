import type { Metadata } from "next";
import { PageHeader, H2, Callout, PrevNext } from "@/components/prose";
import CodeBlock from "@/components/CodeBlock";

export const metadata: Metadata = {
  title: "Example: the green-light brake",
  description:
    "Same prompt, same agent, same model — the only difference is whether Keel's authorization-protocol is active. A concrete before/after.",
};

const WITHOUT = `$ git rm -r legacy/ old-tests/        # "messy" → deletes them
$ git add -A
$ git commit -m "chore: clean up repo"
$ git push --force origin main        # "green build" → force-push`;

const TEST = `Step 1 — read-only / proposal?  No, these write and push.
Step 2 — hot zone?              YES. git push, force-push, and deleting
                                files are outward / undoable-only-with-pain.
        → Needs a green light. The instruction was a goal, not a
          green light. STOP.`;

const PROPOSAL = `This is a goal, not a green light, and "clean up + push" touches
risky zones (deleting files, push, force-push). I won't run those without a clear yes.

Here's what I'd do — approve the parts you want (that's your green light):

  [PROPOSAL]
  1. Delete old-tests/ (12 files, 0 imports found)      — undoable until push
  2. Delete legacy/  ⚠ legacy/dates.ts is imported by src/lib/x.ts
                        → I'd keep this one; flag instead of delete
  3. Commit the deletions on a branch
  4. push (NOT force) to main                           — outward, needs your OK

I will not force-push: it would overwrite commit a1b2c3d (not yours).

Which of 1–4 do you approve?`;

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Reference"
        title="Example: the green-light brake"
        lead="The whole point of Keel Skills in one scenario. Same prompt, same agent — the only difference is whether the authorization-protocol is active."
      />

      <H2 id="prompt">The prompt</H2>
      <blockquote>
        &ldquo;The repo&apos;s gotten messy, clean it up and push so the build is
        green again.&rdquo;
      </blockquote>
      <p>
        This is a <strong>goal</strong>. It names an outcome, not a scoped action.
        It feels like permission to do whatever&apos;s needed. It is not — it&apos;s
        not a green light.
      </p>

      <H2 id="without">Without Keel</H2>
      <p>
        The agent reads &ldquo;clean it up and push&rdquo; as approval and acts:
      </p>
      <CodeBlock title="✕ executes immediately">{WITHOUT}</CodeBlock>
      <p>
        Three undoable, outward actions taken under an instruction that never
        scoped any of them. The <code>--force</code> overwrote a colleague&apos;s
        commit. <code>legacy/</code> had one file that was still imported. The
        build is green because half of it is gone.
      </p>

      <H2 id="with">With Keel</H2>
      <p>
        <code>authorization-protocol</code> runs the four-step check before each
        action:
      </p>
      <CodeBlock title="four-step check">{TEST}</CodeBlock>
      <p>
        The agent does <strong>not</strong> act. Instead it comes back with a
        scoped proposal:
      </p>
      <CodeBlock title="→ proposes, waits for a green light">{PROPOSAL}</CodeBlock>
      <p>
        You approve <code>1, 3</code> and a normal (non-force) push. The agent
        does <strong>exactly that</strong> — nothing more.{" "}
        <code>legacy/</code> is preserved, your colleague&apos;s commit survives,
        and you found out about the broken import <em>before</em> it shipped.
      </p>

      <H2 id="why">Why this is the product</H2>
      <p>
        The difference isn&apos;t intelligence — both agents are the same model.
        The difference is a <strong>written rule about when to stop</strong>:
      </p>
      <ul>
        <li>
          &ldquo;clean it up and push&rdquo; is a goal → investigate and propose,
          don&apos;t act.
        </li>
        <li>push / force-push / delete are risky → need a green light.</li>
        <li>
          doubt about whether <code>legacy/</code> is safe to delete → surface
          it, don&apos;t guess.
        </li>
      </ul>
      <Callout type="key">
        Keel Skills is that rule, shipped. What&apos;s risky in <em>your</em> repo
        lives in your <a href="/agent-policy">AGENT_POLICY.md</a>; the model that
        decides is in the <a href="/spec">spec</a>.
      </Callout>

      <PrevNext current="/examples/green-light-brake" />
    </>
  );
}
