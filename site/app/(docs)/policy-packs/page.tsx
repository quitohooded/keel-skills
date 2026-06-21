import type { Metadata } from "next";
import { PageHeader, H2, Callout, CardGrid, Card, PrevNext } from "@/components/prose";
import { REPO_URL } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Policy packs",
  description:
    "Ready-made AGENT_POLICY.md starters for common stacks — copy one, then trim it to your project.",
};

const PACKS_BASE = `${REPO_URL}/blob/main/policies`;

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Configure"
        title="Policy packs"
        lead="Starter AGENT_POLICY.md files for common stacks. Copy the closest one to your project root, then cut it down to what's actually true for you."
      />

      <p>
        A policy pack is just a pre-filled{" "}
        <a href="/agent-policy">AGENT_POLICY.md</a> with the hot zones a given
        stack usually has — deploy surfaces, the database, the published site.
        It saves you the blank-page problem. They live in the{" "}
        <a href={`${REPO_URL}/tree/main/policies`}>
          <code>policies/</code>
        </a>{" "}
        directory of the repo.
      </p>

      <H2 id="available">Available packs</H2>
      <CardGrid>
        <Card href={`${PACKS_BASE}/web-app-deploy/AGENT_POLICY.md`} title="web-app-deploy">
          A generic web app with a deploy step and a published front end.
        </Card>
        <Card href={`${PACKS_BASE}/nextjs-vercel/AGENT_POLICY.md`} title="nextjs-vercel">
          Next.js on Vercel — build, preview, and production deploy surfaces.
        </Card>
        <Card href={`${PACKS_BASE}/supabase/AGENT_POLICY.md`} title="supabase">
          Supabase — schema, migrations, RLS, and the live database as hot zones.
        </Card>
      </CardGrid>

      <H2 id="how">How to use one</H2>
      <ol>
        <li>Open the pack closest to your stack and copy its contents.</li>
        <li>
          Save it as <code>AGENT_POLICY.md</code> at your project root.
        </li>
        <li>
          <strong>Trim and correct it.</strong> Delete what doesn&apos;t apply,
          and replace the placeholder paths with your real ones — a hot zone that
          points at a path you don&apos;t have is noise.
        </li>
        <li>
          Fill in section 3 (where decisions and state get recorded) — that one
          is project-specific and the packs can only guess.
        </li>
      </ol>
      <Callout type="key">
        A pack is a head start, not a finished policy. The value is in section 1
        being <strong>concrete and true</strong> for your repo.
      </Callout>

      <H2 id="contribute">Contribute a pack</H2>
      <p>
        Policy packs for new stacks are very welcome. See{" "}
        <a href={`${REPO_URL}/blob/main/CONTRIBUTING.md`}>CONTRIBUTING.md</a> in
        the repo for how to add one.
      </p>

      <PrevNext current="/policy-packs" />
    </>
  );
}
