"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/lib/nav";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Documentation" className="flex flex-col gap-8">
      {nav.map((group) => (
        <div key={group.label}>
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            {group.label}
          </p>
          <ul className="flex flex-col">
            {group.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="nav-link"
                  data-active={isActive(pathname, item.href)}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
