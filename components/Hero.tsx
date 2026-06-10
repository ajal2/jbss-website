"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// Hero backdrop rotates through field photos every ROTATE_MS with a crossfade.
// Add more by dropping a file in /public/capabilities and appending here — the
// component handles any number of slides (and shows a single static image if
// there's only one, or the user prefers reduced motion).
const SLIDES = [
  {
    src: "/capabilities/swm.jpg",
    credit: "JBSS field operations · Solid Waste Management",
  },
  {
    src: "/capabilities/C&D_Plant.jpg",
    credit: "JBSS field operations · Construction & Demolition",
  },
  {
    src: "/capabilities/Shiv_Nadar_School_Visit.jpeg",
    credit: "JBSS · Shiv Nadar School site visit",
  },
];
const ROTATE_MS = 3000;

export function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (SLIDES.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(
      () => setActive((i) => (i + 1) % SLIDES.length),
      ROTATE_MS,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden bg-ink text-white">
      {/* Rotating backdrop — crossfade between field photos */}
      <div aria-hidden className="absolute inset-0">
        {SLIDES.map((s, i) => (
          <Image
            key={s.src}
            src={s.src}
            alt=""
            fill
            sizes="100vw"
            priority={i === 0}
            className="object-cover transition-opacity duration-[1200ms] ease-in-out"
            style={{ opacity: i === active ? 1 : 0 }}
          />
        ))}
      </div>

      {/* Legibility scrim — two gradients per CSS */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,28,20,.40) 0%, rgba(20,28,20,.22) 42%, rgba(22,28,20,.80) 100%), linear-gradient(90deg, rgba(20,28,20,.66) 0%, rgba(20,28,20,.12) 55%, rgba(20,28,20,0) 78%)",
        }}
      />

      <div className="container-x relative">
        <div className="pb-[clamp(32px,5vw,58px)] pt-[clamp(60px,10vw,120px)]">
          <h1 className="max-w-[17ch] text-display text-white">
            We build{" "}
            <em className="not-italic" style={{ color: "var(--green-300)" }}>
              and operate
            </em>{" "}
            waste infrastructure across India.
          </h1>
          <p className="mt-[26px] max-w-[46ch] text-[clamp(1.05rem,1.6vw,1.3rem)] leading-[1.5] text-[#e7e3d8]">
            Construction &amp; Demolition processing plants and municipal
            sanitation systems. We deliver them turnkey, then run them for up to
            15 years.
          </p>
          <div className="mt-[34px] flex flex-wrap gap-3.5">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2.5 rounded-[4px] border-[1.5px] border-white bg-white px-[22px] py-[13px] text-[0.95rem] font-semibold text-ink transition-transform hover:-translate-y-[2px]"
            >
              View our projects
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
            <a
              href="mailto:aryanjalota@jbssgroup.com?subject=Hello%20JBSS&body=Hi%20JBSS%20team%2C%0A%0A"
              className="group inline-flex items-center gap-2.5 rounded-[4px] border-[1.5px] border-white/45 bg-transparent px-[22px] py-[13px] text-[0.95rem] font-semibold text-white transition-colors hover:border-white"
            >
              Get in touch
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Atlas baseline — datum strip grounding the cover plate */}
      <div className="container-x relative">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1.5 border-t border-white/15 py-3.5 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-white/50">
          <span className="flex flex-wrap items-center gap-x-3.5 gap-y-1 tabular-nums">
            <span>Est. 2016</span>
            <span className="text-white/25">·</span>
            <span>28.47°N 77.03°E · Gurgaon, Haryana</span>
          </span>
          <span className="text-white/40">{SLIDES[active].credit}</span>
        </div>
      </div>
    </section>
  );
}
