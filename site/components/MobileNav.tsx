"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, flatNav } from "@/lib/nav";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function MobileNav() {
  const pathname = usePathname();
  const current = flatNav.find((i) => isActive(pathname, i.href));

  return (
    <details className="group mb-8 rounded-xl border border-line bg-paper-2 lg:hidden">
      <summary className="flex cursor-pointer items-center justify-between px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted [&::-webkit-details-marker]:hidden">
        <span>
          Menu{current ? <span className="text-ink"> · {current.title}</span> : null}
        </span>
        <span className="transition-transform group-open:rotate-45" aria-hidden>
          +
        </span>
      </summary>
      <div className="flex flex-col gap-6 border-t border-line px-4 py-4">
        {nav.map((group) => (
          <div key={group.label}>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              {group.label}
            </p>
            <ul className="flex flex-col">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="nav-link"
                    data-active={isActive(pathname, item.href)}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </details>
  );
}
