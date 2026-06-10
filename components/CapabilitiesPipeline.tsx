"use client";

import { useEffect, useRef, useState } from "react";
import { SheetHead, SurveyField } from "@/components/Atlas";

const STEPS = [
  {
    icon: "✎",
    num: "01",
    title: "Design",
    body: "Plant design & engineering to site and capacity.",
    om: false,
  },
  {
    icon: "▤",
    num: "02",
    title: "Build",
    body: "Supply, civil works & installation.",
    om: false,
  },
  {
    icon: "⚙",
    num: "03",
    title: "Commission",
    body: "Testing and handover to a running state.",
    om: false,
  },
  {
    icon: "◷",
    num: "04",
    title: "Operate",
    body: "Day-to-day plant & sanitation operations.",
    om: true,
  },
  {
    icon: "✦",
    num: "05",
    title: "Maintain",
    body: "Upkeep and performance over the O&M term.",
    om: true,
  },
];

const THRESH = [0.04, 0.28, 0.5, 0.72, 0.95];

export function CapabilitiesPipeline() {
  const flowRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReducedMotion(true);
      setProgress(1);
      return;
    }

    let ticking = false;
    const update = () => {
      ticking = false;
      const el = flowRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const start = vh * 0.85;
      const end = vh * 0.42;
      let p = (start - r.top) / (start - end);
      p = Math.max(0, Math.min(1, p));
      setProgress(p);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const fillWidth = reducedMotion ? 86 : progress * 86;
  const unitLeft = 7 + progress * 86;
  const unitVisible = progress > 0.02 && progress < 0.99;

  return (
    <section
      id="capabilities"
      className="relative overflow-hidden bg-ink text-white scroll-mt-[100px]"
    >
      <SurveyField tone="dark" />
      <div className="relative container-x py-[clamp(48px,6vw,88px)]">
        <SheetHead label="Capabilities" index="03" tone="dark" accent="terra" />

        <div className="max-w-[62ch]">
          <h2 className="text-h1 text-white">
            One pipeline, two ways to contract.
          </h2>
        </div>

        {/* Flow */}
        <div
          ref={flowRef}
          className="relative mt-[clamp(28px,4vw,46px)] grid grid-cols-2 gap-y-[28px] sm:grid-cols-3 md:grid-cols-5 md:gap-y-0"
        >
          {/* Track (gradient bg) */}
          <div
            aria-hidden
            className="absolute top-[34px] hidden h-[2px] md:block"
            style={{
              left: "7%",
              right: "7%",
              background:
                "linear-gradient(90deg, var(--green) 0%, var(--green) 58%, var(--terra) 58%, var(--terra) 100%)",
              opacity: 0.22,
            }}
          />
          {/* Filled track (progress) */}
          <div
            aria-hidden
            className="absolute top-[34px] hidden h-[3px] rounded-[2px] md:block"
            style={{
              left: "7%",
              width: `${fillWidth}%`,
              background:
                "linear-gradient(90deg, var(--green) 0%, var(--green) 58%, var(--terra) 58%, var(--terra) 100%)",
              boxShadow: "0 0 12px rgba(95,176,121,.5)",
              willChange: "width",
            }}
          />
          {/* Travelling unit */}
          <div
            aria-hidden
            className="absolute top-[34px] hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full md:block"
            style={{
              left: `${unitLeft}%`,
              background: "var(--paper)",
              border: "2.5px solid var(--terra)",
              opacity: unitVisible ? 1 : 0,
              transition: "opacity .3s ease",
              boxShadow: "0 3px 10px rgba(0,0,0,.4)",
              zIndex: 3,
              willChange: "left",
            }}
          />

          {STEPS.map((step, i) => {
            const lit = progress >= THRESH[i];
            const ringColor = step.om ? "var(--terra)" : "var(--green)";
            const litBoxShadow = step.om
              ? "0 0 0 5px rgba(226,145,106,.16)"
              : "0 0 0 5px rgba(95,176,121,.16)";
            return (
              <div
                key={step.num}
                className="relative px-3.5 text-center"
              >
                <div
                  className="mx-auto grid h-[70px] w-[70px] place-items-center rounded-full text-2xl"
                  style={{
                    background: lit
                      ? step.om
                        ? "var(--terra)"
                        : "var(--green)"
                      : "var(--ink-2)",
                    color: lit
                      ? "#fff"
                      : step.om
                        ? "var(--terra-300)"
                        : "var(--green-300)",
                    border: `2px ${step.om ? (lit ? "solid" : "dashed") : "solid"} ${ringColor}`,
                    transform: lit ? "scale(1.12)" : "scale(1)",
                    opacity: lit ? 1 : 0.7,
                    boxShadow: lit ? litBoxShadow : "none",
                    transition:
                      "transform .4s cubic-bezier(.2,.7,.2,1), background .4s ease, color .4s ease, border-color .4s ease, box-shadow .4s ease",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {step.icon}
                </div>
                <div className="mt-4 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-tx-dim">
                  {step.num}
                </div>
                <h4 className="mt-1.5 text-[1.15rem] font-bold text-white">
                  {step.title}
                </h4>
                <p className="mt-2 text-[0.9rem] leading-[1.5] text-tx-dim">
                  {step.body}
                </p>
              </div>
            );
          })}
        </div>

        {/* Key strip */}
        <div className="mt-[clamp(26px,3.5vw,38px)] flex flex-wrap gap-[22px] border-t border-line-dk pt-[20px]">
          <div className="flex items-center gap-2.5 text-[0.92rem] text-tx-dim">
            <span
              aria-hidden
              className="h-[3px] w-[34px] rounded-[2px]"
              style={{ background: "var(--green)" }}
            />
            <b className="font-bold text-white">EPC</b>: Design to Commission,
            handed over turnkey
          </div>
          <div className="flex items-center gap-2.5 text-[0.92rem] text-tx-dim">
            <span
              aria-hidden
              className="h-[3px] w-[34px]"
              style={{
                background:
                  "repeating-linear-gradient(90deg, var(--terra) 0 6px, transparent 6px 11px)",
              }}
            />
            <b className="font-bold text-white">EPC + O&amp;M</b>: the full
            pipeline, up to 15 years
          </div>
        </div>
      </div>
    </section>
  );
}
