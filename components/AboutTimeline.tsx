import type { Project } from "@/lib/cms";

type Props = {
  projects: Project[];
};

const FOUNDING_YEAR = 2016;

export function AboutTimeline({ projects }: Props) {
  const visible = projects.filter((p) => p.visibleOnWebsite);
  const omSites = visible
    .filter((p) => p.serviceModel?.includes("O&M"))
    .reduce((sum, p) => sum + (p.subSites ?? 1), 0);
  const cities = new Set<string>();
  visible.forEach((p) => {
    const first = p.city?.name?.split(",")[0]?.trim();
    if (first) cities.add(first);
  });

  return (
    <section id="about" className="pad-section scroll-mt-[86px]">
      <div className="container-x">
        <div className="grid grid-cols-1 items-center gap-[clamp(34px,5vw,72px)] md:grid-cols-[1.1fr_1fr]">
          <div>
            <div className="mb-[22px] flex items-center gap-3">
              <span className="font-mono text-[0.72rem] font-bold uppercase tracking-[0.18em] text-tx-faint">
                About
              </span>
            </div>
            <h2 className="text-h1 text-ink">
              A growing operator with real ground experience.
            </h2>
            <p className="mt-[18px] text-lead">
              From single EPC jobs in {FOUNDING_YEAR} to multi-year operation of
              critical municipal infrastructure today, JBSS has grown by doing
              the hard, unglamorous work — and staying accountable for how
              plants run long after handover.
            </p>
            <div className="mt-[26px]">
              <a
                href="#about"
                className="group inline-flex items-center gap-2.5 border-b-2 border-terra pb-[3px] font-semibold text-ink"
              >
                Read our story
                <span className="text-terra transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </div>
          <div className="reveal flex flex-col">
            {[
              {
                yr: "2016",
                ev: (
                  <>
                    Founded in Gurgaon. First <b>EPC</b> plant deliveries.
                  </>
                ),
              },
              {
                yr: "2019",
                ev: (
                  <>
                    First multi-year <b>O&amp;M</b> contracts won.
                  </>
                ),
              },
              {
                yr: "2022",
                ev: (
                  <>
                    <b>Bareilly NCAP</b> — 15-year O&amp;M flagship.
                  </>
                ),
              },
              {
                yr: "2026",
                ev: (
                  <>
                    <b>{omSites}+ sites</b> across {cities.size} cities, and
                    growing.
                  </>
                ),
              },
            ].map((row, idx, arr) => (
              <div
                key={row.yr}
                className={`grid grid-cols-[90px_1fr] items-baseline gap-5 border-t border-line py-[18px] ${
                  idx === arr.length - 1 ? "border-b border-line" : ""
                }`}
              >
                <span className="font-mono text-[1.05rem] font-bold text-terra-700">
                  {row.yr}
                </span>
                <span className="text-tx-soft">{row.ev}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
