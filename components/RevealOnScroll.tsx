"use client";

import { useEffect } from "react";

/**
 * Global reveal-on-scroll observer.
 *
 * Mount once near the root. It watches every `.reveal` element in the document
 * and adds `.in` when each enters the viewport. CSS in globals.css handles the
 * fade/slide. Honors prefers-reduced-motion (CSS reveals immediately in that case).
 *
 * Mirrors the original homepage.js IntersectionObserver behavior.
 */
export function RevealObserver() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
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
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
