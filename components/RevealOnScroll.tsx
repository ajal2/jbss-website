"use client";

import { useEffect, useRef } from "react";

/**
 * Adds the `in` class to its children's wrapper when it enters the viewport.
 * Children should opt in via `className="reveal"` (handled by globals.css).
 * Honors prefers-reduced-motion via the CSS rule.
 */
export function RevealOnScroll({
  children,
  className = "",
  asTag: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  asTag?: keyof JSX.IntrinsicElements;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    // @ts-expect-error - ref typing for dynamic tag
    <Tag ref={ref} className={`reveal ${className}`.trim()}>
      {children}
    </Tag>
  );
}
