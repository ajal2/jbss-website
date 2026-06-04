"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-charcoal/10 bg-offwhite/95 backdrop-blur-sm">
      {/* Hairline brand-green seam — ties the nav to the editorial spine
          vocabulary used throughout the page */}
      <div aria-hidden className="h-[2px] w-full bg-brand-green" />

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt="JBSS LLP"
            width={44}
            height={44}
            priority
            className="h-11 w-auto"
          />
          <span className="text-base font-semibold tracking-tight text-charcoal transition-colors group-hover:text-brand-green">
            JBSS LLP
          </span>
        </Link>
        <nav className="flex items-center gap-8 text-sm text-charcoal">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative py-1 transition-colors hover:text-brand-green"
              >
                {item.label}
                {/* Active-state indicator — brand-green underline.
                    Hidden on hover (whose own indicator) to avoid double rules */}
                <span
                  aria-hidden
                  className={`absolute -bottom-[5px] left-0 h-[2px] w-full origin-left bg-brand-green transition-transform duration-200 ${
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
