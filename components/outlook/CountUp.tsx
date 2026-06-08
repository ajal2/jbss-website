"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Count-up metric for the Outlook page. Counts 0 → `value` (easeOutCubic,
 * 1.3s) when ≥20% scrolled into view, formatted with en-IN grouping.
 * Mirrors outlook.js: honors prefers-reduced-motion (lands final value
 * immediately) and a setTimeout backstop so a throttled rAF still settles.
 * Keeps tabular-nums via the .ol-mn class so width doesn't jitter.
 */
const DURATION = 1300;

function formatNum(n: number, decimals: number): string {
  return n.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function CountUp({
  value,
  unit,
  decimals = 0,
}: {
  value: number;
  unit: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(() => formatNum(0, decimals));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const settle = () => setDisplay(formatNum(value, decimals));

    if (reduced || !("IntersectionObserver" in window)) {
      settle();
      return;
    }

    let raf = 0;
    let timeout = 0;
    const run = () => {
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / DURATION);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        setDisplay(formatNum(value * eased, decimals));
        if (p < 1) raf = requestAnimationFrame(tick);
        else settle();
      };
      raf = requestAnimationFrame(tick);
      // guarantee the final value lands even if rAF is throttled
      timeout = window.setTimeout(settle, DURATION + 700);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            run();
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
  }, [value, decimals]);

  return (
    <div ref={ref} className="ol-mn">
      <span>{display}</span>
      <span className="ol-u">{unit}</span>
    </div>
  );
}
