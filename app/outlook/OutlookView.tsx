"use client";

import { useEffect, useRef } from "react";
import "./outlook.css";
import { SheetHead, SurveyField, Ticks } from "@/components/Atlas";

// Inline CSS custom properties (--h, --w, --i …) typed for React.
const v = (vars: Record<string, string | number>): React.CSSProperties =>
  vars as React.CSSProperties;

export function OutlookView() {
  const rootRef = useRef<HTMLDivElement>(null);

  // Ported from the design's outlook.js: scroll reveals, the staircase chart
  // entrance, and the material-flow dot. Scoped to this component's subtree and
  // gated on prefers-reduced-motion.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasIO = "IntersectionObserver" in window;
    const cleanups: Array<() => void> = [];

    // reveals
    const reveals = root.querySelectorAll<HTMLElement>(".reveal");
    if (hasIO && !reduced) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io.unobserve(e.target);
            }
          });
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
      );
      reveals.forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());
    } else {
      reveals.forEach((el) => el.classList.add("in"));
    }

    // staircase chart entrance
    const climb = root.querySelector<HTMLElement>(".climb");
    if (climb) {
      if (reduced || !hasIO) {
        climb.classList.add("in");
      } else {
        const cio = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                climb.classList.add("in");
                cio.unobserve(e.target);
              }
            });
          },
          { threshold: 0.32 },
        );
        cio.observe(climb);
        cleanups.push(() => cio.disconnect());
      }
    }

    // material-flow dot along the process line
    const proc = root.querySelector<HTMLElement>(".proc");
    const dot = root.querySelector<HTMLElement>(".flow-dot");
    const steps = Array.from(root.querySelectorAll<HTMLElement>(".proc-step"));
    if (proc && dot && steps.length && !reduced) {
      const n = steps.length;
      const a = 100 / (2 * n);
      const b = 100 - a;
      const dur = 5200;
      let raf = 0;
      let running = false;
      let t0 = 0;
      const frame = (t: number) => {
        if (!t0) t0 = t;
        const p = ((t - t0) % dur) / dur;
        dot.style.left = a + (b - a) * p + "%";
        const idx = Math.min(n - 1, Math.floor(p * n));
        steps.forEach((s, i) => s.classList.toggle("lit", i === idx));
        raf = requestAnimationFrame(frame);
      };
      const start = () => {
        if (running) return;
        running = true;
        t0 = 0;
        dot.style.opacity = "1";
        raf = requestAnimationFrame(frame);
      };
      const stop = () => {
        running = false;
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        dot.style.opacity = "0";
        steps.forEach((s) => s.classList.remove("lit"));
      };
      if (hasIO) {
        const pio = new IntersectionObserver(
          (entries) => entries.forEach((e) => (e.isIntersecting ? start() : stop())),
          { threshold: 0.25 },
        );
        pio.observe(proc);
        cleanups.push(() => {
          pio.disconnect();
          stop();
        });
      } else {
        start();
        cleanups.push(stop);
      }
    }

    return () => cleanups.forEach((c) => c());
  }, []);

  return (
    <div className="outlook" ref={rootRef}>
      <main>
        {/* ===== 01 — THE ARGUMENT (light) ===== */}
        <section className="lede section" id="lede">
          <div className="container-x">
            <div className="lede-grid">
              <div className="lede-text">
                <SheetHead
                  label="Outlook · Market direction"
                  index="01"
                  total={4}
                  accent="terra"
                />
                <h1 className="lede-h1 reveal">
                  India&apos;s waste rules now mandate what we build and operate.
                </h1>
                <p className="lede-sub reveal d1">
                  Over the last ten years, the rules for municipal waste and
                  building debris have gone from loose guidance to constitutional
                  duty.
                </p>
              </div>
              <aside className="lede-ladder reveal d2" aria-hidden="true">
                <ol className="ladder">
                  <li className="lad" style={v({ "--w": "38%" })}>
                    <span className="lad-k">Then</span>
                    <span className="lad-v">Guideline</span>
                  </li>
                  <li className="lad" style={v({ "--w": "66%" })}>
                    <span className="lad-k">2016 to 2024</span>
                    <span className="lad-v">Statutory</span>
                  </li>
                  <li className="lad" style={v({ "--w": "100%" })}>
                    <span className="lad-k">2025 to 2026</span>
                    <span className="lad-v">Constitutional</span>
                  </li>
                </ol>
              </aside>
            </div>
          </div>
        </section>

        {/* ===== 02 — THE DIRECTION (dark · rising chart) ===== */}
        <section className="direction overflow-hidden" id="direction">
          <SurveyField tone="dark" />
          <Ticks tone="dark" />
          <div className="container-x relative z-10">
            <div className="dir-head">
              <SheetHead
                label="The direction"
                index="02"
                total={4}
                tone="dark"
                accent="terra"
              />
              <h2 className="dir-h2 reveal">
                Ten years, from guideline to constitutional obligation.
              </h2>
            </div>

            <div className="climb-wrap reveal d1">
              <div
                className="climb"
                role="img"
                aria-label="Stepped chart of India's waste regulation hardening from 2016 to 2026: 2016 SWM and C&D Rules, 2022 single-use plastic ban and EPR, 2025 C&D Waste Rules, 2026 SWM Rules, and the February 2026 Supreme Court Bhopal ruling reading waste compliance into Article 21."
              >
                <div className="tiers" aria-hidden="true">
                  <div className="tier" style={v({ "--y": "90%" })}>
                    <span className="t-lbl">Constitutional obligation</span>
                  </div>
                  <div className="tier" style={v({ "--y": "76%" })}>
                    <span className="t-lbl">Statutory · digitally enforced</span>
                  </div>
                  <div className="tier" style={v({ "--y": "40%" })}>
                    <span className="t-lbl">Regulated on paper</span>
                  </div>
                  <div className="tier base" style={v({ "--y": "8%" })}>
                    <span className="t-lbl">Informal · unregulated</span>
                  </div>
                </div>

                <div className="plot">
                  <div className="steps">
                    <div className="step" data-line="both" style={v({ "--h": "40%", "--hp": "8%", "--i": 0 })}>
                      <div className="cap">
                        <span className="cap-tag both">SWM + C&amp;D</span>
                        <span className="cap-year tnum">2016</span>
                        <span className="cap-name">SWM &amp; C&amp;D Rules notified</span>
                      </div>
                      <span className="drop" />
                      <div className="fill" />
                      <span className="riser" />
                      <span className="node" />
                    </div>

                    <div className="step" data-line="epr" style={v({ "--h": "52%", "--hp": "40%", "--i": 1 })}>
                      <div className="cap">
                        <span className="cap-tag epr">EPR</span>
                        <span className="cap-year tnum">2022</span>
                        <span className="cap-name">Single-use plastic ban · EPR</span>
                      </div>
                      <span className="drop" />
                      <div className="fill" />
                      <span className="riser" />
                      <span className="node" />
                    </div>

                    <div className="step" data-line="cd" style={v({ "--h": "64%", "--hp": "52%", "--i": 2 })}>
                      <div className="cap">
                        <span className="cap-tag cd">C&amp;D</span>
                        <span className="cap-year tnum">2025</span>
                        <span className="cap-name">C&amp;D Waste Rules, 2025</span>
                      </div>
                      <span className="drop" />
                      <div className="fill" />
                      <span className="riser" />
                      <span className="node" />
                    </div>

                    <div className="step" data-line="swm" style={v({ "--h": "76%", "--hp": "64%", "--i": 3 })}>
                      <div className="cap">
                        <span className="cap-tag swm">SWM</span>
                        <span className="cap-year tnum">2026</span>
                        <span className="cap-name">SWM Rules, 2026 effective</span>
                      </div>
                      <span className="drop" />
                      <div className="fill" />
                      <span className="riser" />
                      <span className="node" />
                    </div>

                    <div className="step apex" data-line="law" style={v({ "--h": "90%", "--hp": "76%", "--i": 4 })}>
                      <div className="cap">
                        <span className="cap-tag law">Article 21</span>
                        <span className="cap-year tnum">Feb 2026</span>
                        <span className="cap-name">Supreme Court ruling</span>
                      </div>
                      <span className="drop" />
                      <div className="fill" />
                      <span className="riser" />
                      <span className="node" />
                    </div>
                  </div>

                  <div className="xaxis" aria-hidden="true">
                    <span className="xt tnum">2016</span>
                    <span className="xt tnum">2022</span>
                    <span className="xt tnum">2025</span>
                    <span className="xt tnum">2026</span>
                    <span className="xt">Feb 2026</span>
                  </div>
                </div>
              </div>
            </div>

            <figure className="apex-quote reveal d1">
              <p className="aq-intro">
                In February 2026, the Supreme Court read waste compliance into the
                Article 21 right to a clean environment, turning what had been an
                administrative requirement into a constitutional one. The 2026
                Rules became the standard a city is held to.
              </p>
              <span className="aq-mark" aria-hidden="true">
                &ldquo;
              </span>
              <blockquote className="aq-q">
                Solid Waste Management Rules 2026 are as good as the will expressed
                by Parliament.
              </blockquote>
              <figcaption className="aq-cite">
                <b>Supreme Court of India</b>
                <span>
                  Bhopal Municipal Corporation v. Dr Subhash C. Pandey · 19
                  February 2026
                </span>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ===== BRIDGE ===== */}
        <section className="bridge">
          <div className="container-x">
            <p className="bridge-line reveal">
              We already build and operate{" "}
              <span className="em">to these rules.</span>
            </p>
          </div>
        </section>

        {/* ===== 03 — THE MODEL (light · process) ===== */}
        <section className="model section" id="model">
          <div className="container-x">
            <div className="model-head">
              <SheetHead
                label="The model · C&D processing"
                index="03"
                total={4}
                accent="green"
              />
              <h2 className="model-h2 reveal">From rubble to graded aggregate.</h2>
              <p className="model-sub reveal d1">
                What a C&amp;D plant does. Demolition waste goes in, building
                material comes out, across seven stages of treatment.
              </p>
            </div>

            <div className="flowband reveal d1">
              <div className="fb-end fb-in">
                <span className="fb-k">Input</span>
                <span className="fb-v">Mixed C&amp;D waste</span>
                <span className="fb-sub">Concrete · masonry · rebar · soil</span>
              </div>

              <ol className="proc">
                <span className="flow-dot" aria-hidden="true" />
                <li className="proc-step" style={v({ "--i": 0 })}>
                  <span className="proc-ic">
                    <svg viewBox="0 0 40 40" aria-hidden="true">
                      <path d="M8 13h24l-6 11H14z" />
                      <path d="M17 24v5h6v-5" />
                      <circle className="f" cx="14" cy="8" r="1.4" />
                      <circle className="f" cx="20" cy="7" r="1.4" />
                      <circle className="f" cx="26" cy="8" r="1.4" />
                    </svg>
                  </span>
                  <span className="ps-n tnum">01</span>
                  <h3>Feed &amp; screen</h3>
                  <p>A grizzly screen scalps off soil and fines.</p>
                </li>
                <li className="proc-step" style={v({ "--i": 1 })}>
                  <span className="proc-ic">
                    <svg viewBox="0 0 40 40" aria-hidden="true">
                      <path d="M13 11v9a7 7 0 0 0 14 0v-9" />
                      <rect className="f" x="10.5" y="8" width="5.5" height="4" />
                      <rect className="f" x="24" y="8" width="5.5" height="4" />
                    </svg>
                  </span>
                  <span className="ps-n tnum">02</span>
                  <h3>Sort</h3>
                  <p>Pickers and an overband magnet pull wood, plastic and steel.</p>
                </li>
                <li className="proc-step" style={v({ "--i": 2 })}>
                  <span className="proc-ic">
                    <svg viewBox="0 0 40 40" aria-hidden="true">
                      <path d="M11 9 18 20 11 31" />
                      <path d="M29 9 22 20 29 31" />
                      <path className="f" d="M18.5 18l3-1 2.2 2-1 3-3 .3-2-2.3z" />
                    </svg>
                  </span>
                  <span className="ps-n tnum">03</span>
                  <h3>Crush</h3>
                  <p>Jaw and impact crushers reduce masonry to sized aggregate.</p>
                </li>
                <li className="proc-step" style={v({ "--i": 3 })}>
                  <span className="proc-ic">
                    <svg viewBox="0 0 40 40" aria-hidden="true">
                      <circle cx="17" cy="20" r="8" />
                      <circle className="f" cx="17" cy="20" r="1.6" />
                      <path d="M17 20 22 16M17 20 12 16M17 20 17 27" />
                      <path d="M28 14c4 0 4 4 4 4M28 22c5 0 5 5 5 5" />
                    </svg>
                  </span>
                  <span className="ps-n tnum">04</span>
                  <h3>Air separation</h3>
                  <p>A wind sifter lifts off the remaining light material.</p>
                </li>
                <li className="proc-step" style={v({ "--i": 4 })}>
                  <span className="proc-ic">
                    <svg viewBox="0 0 40 40" aria-hidden="true">
                      <g transform="rotate(-8 20 20)">
                        <path d="M9 14h22M9 20h22M9 26h22" />
                      </g>
                      <circle className="f" cx="14" cy="11" r="1.3" />
                      <circle className="f" cx="22" cy="30" r="1.3" />
                    </svg>
                  </span>
                  <span className="ps-n tnum">05</span>
                  <h3>Screen</h3>
                  <p>Vibrating decks grade the flow into clean size fractions.</p>
                </li>
                <li className="proc-step" style={v({ "--i": 5 })}>
                  <span className="proc-ic">
                    <svg viewBox="0 0 40 40" aria-hidden="true">
                      <path d="M20 8c4 6 6 8.5 6 11.5a6 6 0 0 1-12 0C14 16.5 16 14 20 8z" />
                      <path d="M10 31q3-2.5 6 0t6 0 6 0" />
                    </svg>
                  </span>
                  <span className="ps-n tnum">06</span>
                  <h3>Wash</h3>
                  <p>Wet washing removes silt and clay from sand and aggregate.</p>
                </li>
                <li className="proc-step out" style={v({ "--i": 6 })}>
                  <span className="proc-ic">
                    <svg viewBox="0 0 40 40" aria-hidden="true">
                      <path d="M6 30h28" />
                      <path className="f" d="M8 30 13 21 18 30z" />
                      <path className="f" d="M16 30 22 18 28 30z" />
                      <path className="f" d="M26 30 31 23 36 30z" />
                    </svg>
                  </span>
                  <span className="ps-n tnum">07</span>
                  <h3>Graded output</h3>
                  <p>Recycled aggregate, manufactured sand, paver feedstock.</p>
                </li>
              </ol>

              <div className="fb-end fb-out">
                <span className="fb-k">Output</span>
                <span className="fb-v">Building material</span>
                <span className="fb-sub">Aggregate · M-sand · paver blocks</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CLOSING — output destinations (dark) ===== */}
        <section className="closing overflow-hidden" id="loop">
          <SurveyField tone="dark" />
          <Ticks tone="dark" />
          <div className="container-x relative z-10">
            <SheetHead
              label="Output · End use"
              index="04"
              total={4}
              tone="dark"
              accent="terra"
            />
            <div className="loop-head">
              <h2 className="loop-h2 reveal">
                Where the recovered material goes.
              </h2>
              <p className="loop-sub reveal d1">
                Graded output from the line is specified back into the works it
                came from — road sub-base, ready-mix concrete and paver blocks.
              </p>
            </div>

            <div className="destinations reveal d1">
              <div className="dest">
                <span className="dest-n tnum">01</span>
                <span className="dest-out">Recycled aggregate</span>
                <span className="dest-to">
                  Road sub-base, embankment and structural fill
                </span>
              </div>
              <div className="dest">
                <span className="dest-n tnum">02</span>
                <span className="dest-out">Manufactured sand (M-sand)</span>
                <span className="dest-to">
                  Ready-mix concrete, mortar and plaster
                </span>
              </div>
              <div className="dest">
                <span className="dest-n tnum">03</span>
                <span className="dest-out">Recycled concrete blocks</span>
                <span className="dest-to">
                  Paver blocks, kerbstones and boundary walls
                </span>
              </div>
              <div className="dest">
                <span className="dest-n tnum">04</span>
                <span className="dest-out">Inert reject</span>
                <span className="dest-to">
                  Engineered landfill cover and low-grade fill
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
