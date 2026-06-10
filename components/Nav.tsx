"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { livePages } from "@/lib/nav";
import "./nav.css";

export function Nav() {
  const pathname = usePathname();
  // The home page has a dark hero, so the transparent (un-scrolled) nav sits
  // on the photo and needs light links. Other pages have light headers.
  const onDark = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const fillRef = useRef<HTMLElement>(null);
  const navItems = livePages();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
      if (fillRef.current) fillRef.current.style.width = `${pct}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the mobile menu when the route changes
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => href !== "/" && pathname.startsWith(href);
  const navClass = `jbss-nav${scrolled ? " scrolled" : ""}${onDark ? " nav-on-dark" : ""}`;

  return (
    <>
      <div className="jbss-nav-wrap">
        <nav className={navClass} aria-label="Main">
          <Link href="/" className="logo-box" aria-label="JBSS LLP home">
            <Image
              src="/logo.svg"
              alt="JBSS LLP"
              width={122}
              height={34}
              priority
              style={{ height: 34, width: "auto" }}
            />
          </Link>

          <div className="nlinks">
            {navItems.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className={isActive(it.href) ? "active" : undefined}
              >
                {it.label}
              </Link>
            ))}
          </div>

          <span className="spacer" />

          <Link href="/#contact" className="ctabtn">
            Discuss a project <span className="arr">→</span>
          </Link>

          <button
            type="button"
            className="menu-btn"
            aria-expanded={open}
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>

          <span className="jbss-nav-progress" aria-hidden>
            <i ref={fillRef} />
          </span>
        </nav>

        <div className={`jbss-nav-mobile${open ? " open" : ""}`}>
          {navItems.map((it) => (
            <Link key={it.href} href={it.href} onClick={() => setOpen(false)}>
              {it.label}
            </Link>
          ))}
          <Link href="/#contact" onClick={() => setOpen(false)}>
            Discuss a project →
          </Link>
        </div>
      </div>

      {/* The nav is fixed/floating. On the home page it sits over the dark hero
          (no spacer). Other pages have light headers, so reserve the nav's
          height here — keeping the page layouts exactly as before. */}
      {!onDark && <div aria-hidden style={{ height: 86, flexShrink: 0 }} />}
    </>
  );
}
