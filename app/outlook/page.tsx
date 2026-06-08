import type { Metadata } from "next";
import Link from "next/link";
import { getProjects, type Project } from "@/lib/cms";
import { RevealObserver } from "@/components/RevealOnScroll";
import { CountUp } from "@/components/outlook/CountUp";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Outlook — JBSS LLP",
  description:
    "India's waste rules are tightening from guideline to statutory and constitutional obligation. JBSS builds and operates the C&D and sanitation infrastructure those rules require.",
};

// Bind the two Evidence records to real Notion projects by name. Dynamic
// fields (label/accent/model/location/status/cover) come from the matched
// project; Bareilly's capacity is derived live (dailyCapacityKgPerDay → TPD).
// Metrics that live in Notion fields the Project type doesn't expose
// (lib/cms.ts is off-limits per CLAUDE.md) are baked in as real reviewed
// constants — Bareilly 15-yr O&M term (from the project name/capacity
// headline), IIT Delhi 1,850 households + 26 on-site crew (Capacity Headline /
// Headcount on Site). All values verified against Notion 2026-06; the earlier
// draft figures (300 TPD, 100% composted, 4 streams) were placeholders.
function findProject(projects: Project[], ...needles: string[]) {
  return projects.find((p) => {
    const hay = `${p.displayName ?? ""} ${p.projectName}`.toLowerCase();
    return needles.every((n) => hay.includes(n.toLowerCase()));
  });
}

const city = (p?: Project) => p?.city?.name?.split(",")[0]?.trim();
const blLabel = (line?: string) =>
  line === "SWM"
    ? "Solid Waste Management"
    : line === "C&D"
      ? "Construction & Demolition"
      : undefined;

export default async function OutlookPage() {
  const projects = await getProjects();
  const visible = projects.filter((p) => p.visibleOnWebsite);

  const bareilly = findProject(visible, "bareilly");
  const iit = findProject(visible, "iit", "delhi");

  // Record 1 — Bareilly C&D (terracotta)
  const r1 = {
    label: blLabel(bareilly?.businessLine) ?? "Construction & Demolition",
    model: bareilly?.serviceModel ?? "EPC + O&M",
    location: city(bareilly) ?? "Bareilly, Uttar Pradesh",
    status: bareilly?.status ?? "Ongoing",
    title:
      bareilly?.displayName ??
      bareilly?.projectName ??
      "Bareilly C&D Plant + 15-Year O&M",
    cover: bareilly?.coverImageUrl ?? "/capabilities/C&D_Plant.jpg",
    // Derive TPD from kg/day when present; else the reviewed draft figure.
    capacityTpd: bareilly?.dailyCapacityKgPerDay
      ? Math.round(bareilly.dailyCapacityKgPerDay / 1000)
      : 300,
  };

  // Record 2 — IIT Delhi SWM (green)
  const r2 = {
    label: blLabel(iit?.businessLine) ?? "Solid Waste Management",
    model: iit?.serviceModel ?? "O&M",
    location: city(iit) ?? "IIT Delhi",
    status: iit?.status ?? "Ongoing",
    title:
      iit?.displayName ??
      iit?.projectName ??
      "IIT Delhi Institutional Sanitation Services",
    cover: iit?.coverImageUrl ?? "/capabilities/swm.jpg",
  };

  return (
    <div className="outlook">
      <main>
        {/* ===== ACT 01 — THE LENS ===== */}
        <section className="ol-lens" id="lens">
          <div className="container-x">
            <p className="ol-tag">
              <span className="ol-tag-t">Context</span>
            </p>
            <h1 className="reveal">
              India&apos;s waste rules now require what JBSS already{" "}
              <span className="ol-uline">builds and operates.</span>
            </h1>
            <p className="ol-sub reveal">
              This page sets out where the regulation is heading, and the two
              operations that already meet it.
            </p>
          </div>
        </section>

        {/* ===== ACT 02 — THE DIRECTION (vertical timeline) ===== */}
        <section className="ol-direction ol-section" id="direction">
          <div className="container-x">
            <div className="ol-tl-intro">
              <p className="ol-tag">
                <span className="ol-tag-t">Regulatory direction</span>
              </p>
              <h2>
                In a decade, India&apos;s waste regulation has hardened from
                guideline to statutory and constitutional obligation.
              </h2>
            </div>

            <div className="ol-tl-track">
              {/* Era 1 */}
              <div className="ol-era reveal">
                <span className="ol-era-yrs">Pre-2016</span>
                <div className="ol-era-name">Informal, unregulated.</div>
                <p className="ol-era-line">
                  Recovery happened in the informal economy, off the books and
                  outside any standard. Nothing required a city to account for
                  what it discarded.
                </p>
              </div>

              {/* Era 2 */}
              <div className="ol-era reveal">
                <span className="ol-era-yrs">2016–2024</span>
                <div className="ol-era-name">
                  Regulated on paper, enforced administratively.
                </div>
                <div className="ol-anchors">
                  <div className="ol-anchor">
                    <div className="ol-ay">2016</div>
                    <div className="ol-an">SWM &amp; C&amp;D Rules notified</div>
                    <div className="ol-as">
                      Source segregation and C&amp;D recovery written into
                      national law for the first time.
                    </div>
                  </div>
                  <div className="ol-anchor">
                    <div className="ol-ay">2022</div>
                    <div className="ol-an">
                      Single-use plastic ban; EPR formalised
                    </div>
                    <div className="ol-as">
                      Producer responsibility moves from principle to a
                      registered, tracked obligation.
                    </div>
                  </div>
                </div>
              </div>

              {/* Era 3 */}
              <div className="ol-era reveal">
                <span className="ol-era-yrs">2025–26</span>
                <div className="ol-era-name">
                  Statutory, digitally tracked, and enforced by the courts.
                </div>
                <div className="ol-anchors">
                  <div className="ol-anchor">
                    <div className="ol-ay">2025</div>
                    <div className="ol-an">C&amp;D Waste Rules, 2025</div>
                    <div className="ol-as">
                      EPR extended to rubble; a demand-side mandate for recycled
                      content in construction.
                    </div>
                  </div>
                  <div className="ol-anchor">
                    <div className="ol-ay">2026</div>
                    <div className="ol-an">SWM Rules, 2026 effective</div>
                    <div className="ol-as">
                      Four-stream segregation, digital portals and environmental
                      compensation for default.
                    </div>
                  </div>
                  <div className="ol-anchor">
                    <div className="ol-ay">Feb 2026</div>
                    <div className="ol-an">Supreme Court, Bhopal order</div>
                    <div className="ol-as">
                      Waste compliance read into the Article 21 right to a clean
                      environment.
                    </div>
                  </div>
                </div>
              </div>

              {/* Culminating quote */}
              <div className="ol-quote reveal">
                <blockquote>
                  <p className="ol-q">
                    Solid Waste Management Rules 2026 are as good as the will
                    expressed by Parliament.
                  </p>
                  <p className="ol-cite">
                    <b>Supreme Court of India</b>
                    <br />
                    Bhopal Municipal Corporation v. Dr Subhash C. Pandey · 19
                    February 2026
                  </p>
                </blockquote>
              </div>
            </div>

          </div>
        </section>

        {/* ===== THE PROCESS ===== */}
        <section className="ol-process ol-section">
          <div className="container-x">
            <p className="ol-tag">
              <span className="ol-tag-t">The process</span>
            </p>
            <h2 className="ol-proc-h2">From rubble to graded aggregate.</h2>
            <p className="ol-proc-sub">
              What a C&amp;D plant does: demolition waste in, building material
              out, across seven stages.
            </p>
            <ol className="ol-flow">
              <li className="ol-step reveal">
                <span className="ol-ic">
                  <svg viewBox="0 0 40 40">
                    <path d="M8 13h24l-6 11H14z" />
                    <path d="M17 24v5h6v-5" />
                    <circle className="f" cx="14" cy="8" r="1.4" />
                    <circle className="f" cx="20" cy="7" r="1.4" />
                    <circle className="f" cx="26" cy="8" r="1.4" />
                  </svg>
                </span>
                <span className="ol-ps-n">01</span>
                <h3>Feed &amp; pre-screen</h3>
                <p>
                  Mixed C&amp;D waste is loaded in; a grizzly screen scalps off
                  soil and fines.
                </p>
              </li>
              <li className="ol-step reveal">
                <span className="ol-ic">
                  <svg viewBox="0 0 40 40">
                    <path d="M13 11v9a7 7 0 0 0 14 0v-9" />
                    <rect className="f" x="10.5" y="8" width="5.5" height="4" />
                    <rect className="f" x="24" y="8" width="5.5" height="4" />
                  </svg>
                </span>
                <span className="ol-ps-n">02</span>
                <h3>Sort</h3>
                <p>
                  Pickers and an overband magnet pull out wood, plastic and
                  steel reinforcement.
                </p>
              </li>
              <li className="ol-step reveal">
                <span className="ol-ic">
                  <svg viewBox="0 0 40 40">
                    <path d="M11 9 18 20 11 31" />
                    <path d="M29 9 22 20 29 31" />
                    <path
                      className="f"
                      d="M18.5 18l3-1 2.2 2-1 3-3 .3-2-2.3z"
                    />
                  </svg>
                </span>
                <span className="ol-ps-n">03</span>
                <h3>Crush</h3>
                <p>
                  Jaw and impact crushers reduce concrete and masonry to sized
                  aggregate.
                </p>
              </li>
              <li className="ol-step reveal">
                <span className="ol-ic">
                  <svg viewBox="0 0 40 40">
                    <circle cx="17" cy="20" r="8" />
                    <circle className="f" cx="17" cy="20" r="1.6" />
                    <path d="M17 20 22 16M17 20 12 16M17 20 17 27" />
                    <path d="M28 14c4 0 4 4 4 4M28 22c5 0 5 5 5 5" />
                  </svg>
                </span>
                <span className="ol-ps-n">04</span>
                <h3>Air separation</h3>
                <p>A wind sifter lifts off the remaining light material.</p>
              </li>
              <li className="ol-step reveal">
                <span className="ol-ic">
                  <svg viewBox="0 0 40 40">
                    <g transform="rotate(-8 20 20)">
                      <path d="M9 14h22M9 20h22M9 26h22" />
                    </g>
                    <circle className="f" cx="14" cy="11" r="1.3" />
                    <circle className="f" cx="22" cy="30" r="1.3" />
                  </svg>
                </span>
                <span className="ol-ps-n">05</span>
                <h3>Screen</h3>
                <p>Vibrating decks grade the flow into clean size fractions.</p>
              </li>
              <li className="ol-step reveal">
                <span className="ol-ic">
                  <svg viewBox="0 0 40 40">
                    <path d="M20 8c4 6 6 8.5 6 11.5a6 6 0 0 1-12 0C14 16.5 16 14 20 8z" />
                    <path d="M10 31q3-2.5 6 0t6 0 6 0" />
                  </svg>
                </span>
                <span className="ol-ps-n">06</span>
                <h3>Wash</h3>
                <p>Wet washing removes silt and clay from the sand and aggregate.</p>
              </li>
              <li className="ol-step reveal">
                <span className="ol-ic">
                  <svg viewBox="0 0 40 40">
                    <path d="M6 30h28" />
                    <path className="f" d="M8 30 13 21 18 30z" />
                    <path className="f" d="M16 30 22 18 28 30z" />
                    <path className="f" d="M26 30 31 23 36 30z" />
                  </svg>
                </span>
                <span className="ol-ps-n">07</span>
                <h3>Graded output</h3>
                <p>
                  Recycled aggregate, manufactured sand and paver-block
                  feedstock.
                </p>
              </li>
            </ol>
          </div>
        </section>

        {/* ===== ACT 03 — THE EVIDENCE ===== */}
        <section className="ol-evidence ol-section" id="evidence">
          <div className="container-x">
            <div className="ol-act-head reveal">
              <p className="ol-tag">
                <span className="ol-tag-t">Evidence</span>
              </p>
              <h2>Two plants already in operation.</h2>
              <p className="ol-sub">
                C&amp;D processing and institutional sanitation, under long-term
                contract.
              </p>
            </div>

            {/* Record 1 — Bareilly · C&D · terracotta */}
            <article className="ol-record">
              <div className="ol-media reveal">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={r1.cover}
                  alt="JBSS construction &amp; demolition processing line"
                />
              </div>
              <div className="ol-text reveal d1">
                <p className="ol-meta">
                  <span className="ol-acc">{r1.label}</span> · {r1.model} ·{" "}
                  {r1.location} · {r1.status}
                </p>
                <h3>{r1.title}</h3>
                <div className="ol-longform">
                  <p>
                    Under the National Clean Air Programme, JBSS designed, built
                    and now operates Bareilly&apos;s construction-and-demolition
                    processing plant on a fifteen-year term. Rubble that would
                    have gone to land — or to the roadside — is sized, washed and
                    remade into aggregate, paver blocks and manufactured sand for
                    the city&apos;s own works.
                  </p>
                  <p>
                    The same team that built the line operates it, so recovery
                    is measured in operation, not only at commissioning. Over a
                    fifteen-year term, the plant is accountable for what it
                    diverts each year.
                  </p>
                </div>
                <div className="ol-metrics">
                  <div className="ol-metric">
                    <CountUp value={r1.capacityTpd} unit="TPD" />
                    <div className="ol-ml">Design processing capacity · C&amp;D</div>
                  </div>
                  <div className="ol-metric ol-second">
                    <CountUp value={15} unit="yr" />
                    <div className="ol-ml">O&amp;M term</div>
                  </div>
                </div>
                <Link className="ol-readlink" href="/projects">
                  Read the Bareilly project
                </Link>
              </div>
            </article>

            {/* Record 2 — IIT Delhi · SWM · green (swapped) */}
            <article className="ol-record ol-record--green ol-swap">
              <div className="ol-media reveal">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={r2.cover}
                  alt="JBSS sanitation crew on campus operations"
                />
              </div>
              <div className="ol-text reveal d1">
                <p className="ol-meta">
                  <span className="ol-acc">{r2.label}</span> · {r2.model} ·{" "}
                  {r2.location} · {r2.status}
                </p>
                <h3>{r2.title}</h3>
                <div className="ol-longform">
                  <p>
                    At IIT Delhi, JBSS runs full campus sanitation —
                    door-to-door collection across residential quarters,
                    hostels, academic blocks, the hospital and guest houses.
                    Waste is segregated at source into three streams: municipal
                    solid waste, horticulture waste and recyclables.
                  </p>
                  <p>
                    Within a single institution, output is{" "}
                    <em>measured by stream, by building and by day</em> — the
                    discipline the new national rules now ask of every city.
                  </p>
                </div>
                <div className="ol-metrics">
                  <div className="ol-metric">
                    <CountUp value={1850} unit="homes" />
                    <div className="ol-ml">Campus households served</div>
                  </div>
                  <div className="ol-metric ol-second">
                    <CountUp value={26} unit="on site" />
                    <div className="ol-ml">Sanitation crew, daily</div>
                  </div>
                </div>
                <Link className="ol-readlink" href="/projects">
                  Read the IIT Delhi project
                </Link>
              </div>
            </article>
          </div>
        </section>

        {/* ===== CLOSING ===== */}
        <section className="ol-closing ol-section">
          <div className="container-x">
            <p className="reveal">
              JBSS has built and operated waste infrastructure{" "}
              <span className="ol-muted">since 2016.</span>
            </p>
          </div>
        </section>
      </main>

      <RevealObserver />
    </div>
  );
}
