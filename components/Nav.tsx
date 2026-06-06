"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { href: "/#what", label: "What we do" },
  { href: "/#capabilities", label: "Capabilities" },
  { href: "/projects", label: "Projects" },
  { href: "/#about", label: "About" },
];

export function Nav() {
  const pathname = usePathname();
  const [elevated, setElevated] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 border-b border-line backdrop-blur"
      style={{
        backgroundColor: "color-mix(in srgb, var(--mist) 92%, transparent)",
        boxShadow: elevated
          ? "0 10px 30px -22px rgba(32,37,31,.45)"
          : "none",
        transition: "box-shadow .25s ease",
      }}
    >
      <div className="container-x">
        <div className="flex h-[86px] items-center gap-7">
          <Link
            href="/"
            aria-label="JBSS LLP home"
            className="flex items-center"
          >
            <Image
              src="/logo.svg"
              alt="JBSS LLP"
              width={180}
              height={50}
              priority
              className="h-[50px] w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="ml-2 hidden items-center gap-8 md:flex">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/projects"
                  ? pathname.startsWith("/projects")
                  : false; // Anchor links don't have active state
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative py-1.5 text-[0.95rem] font-medium transition-colors hover:text-ink ${
                    isActive ? "text-ink" : "text-tx-soft"
                  }`}
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={`absolute -bottom-0 left-0 h-[2px] bg-terra transition-all duration-200 ease-out ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <span className="ml-auto" />

          {/* Discuss a project (desktop) */}
          <Link
            href="/#contact"
            className="hidden items-center gap-2.5 rounded-[4px] border-[1.5px] border-green bg-green px-[22px] py-[13px] text-[0.95rem] font-semibold text-white transition-colors hover:border-green-700 hover:bg-green-700 md:inline-flex"
          >
            Discuss a project
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="ml-auto inline-flex items-center gap-2 rounded-[4px] border-[1.5px] border-line px-[22px] py-[13px] text-[0.95rem] font-semibold text-ink md:hidden"
          >
            {mobileOpen ? "Close" : "Menu"}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <nav className="flex flex-col items-start gap-1 border-t border-line py-4 md:hidden">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="w-full py-2 text-[1rem] font-medium text-tx-soft hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/#contact"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex items-center gap-2 rounded-[4px] bg-green px-5 py-3 text-[0.95rem] font-semibold text-white"
            >
              Discuss a project →
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
