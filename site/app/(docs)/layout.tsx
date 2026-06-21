import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-content px-5 md:px-8">
      <div className="lg:grid lg:grid-cols-[15rem_1fr] lg:gap-12">
        {/* Sidebar — sticky on large screens */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto py-12 pr-2">
            <Sidebar />
          </div>
        </aside>

        {/* Content */}
        <main id="main" className="min-w-0 py-10 md:py-14">
          <MobileNav />
          <article className="doc-prose max-w-prose">{children}</article>
        </main>
      </div>
    </div>
  );
}
