import type { Project } from "@/lib/cms";

type Props = {
  projects: Project[];
};

const FOUNDING_YEAR = 2016;

function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-IN").format(Math.round(n));
}

function computeStats(projects: Project[]) {
  const visible = projects.filter((p) => p.visibleOnWebsite);

  const yearsOperating = new Date().getFullYear() - FOUNDING_YEAR;

  const swmKgPerDay = visible
    .filter((p) => p.businessLine === "SWM")
    .reduce((sum, p) => sum + (p.dailyCapacityKgPerDay ?? 0), 0);

  const cndKgPerDay = visible
    .filter((p) => p.businessLine === "C&D")
    .reduce((sum, p) => sum + (p.dailyCapacityKgPerDay ?? 0), 0);

  const cndTpd = cndKgPerDay / 1000;
  const cndPlants = visible.filter((p) => p.businessLine === "C&D").length;

  const totalSites = visible.reduce((sum, p) => sum + (p.subSites ?? 1), 0);

  const cities = new Set<string>();
  visible.forEach((p) => {
    const name = p.city?.name;
    if (!name) return;
    const firstSegment = name.split(",")[0]?.trim();
    if (firstSegment) cities.add(firstSegment);
  });

  return {
    yearsOperating,
    swmKgPerDay,
    cndTpd,
    cndPlants,
    totalSites,
    citiesCount: cities.size,
  };
}

export function StatsBanner({ projects }: Props) {
  const stats = computeStats(projects);

  const items = [
    {
      value: `${stats.yearsOperating}+`,
      label: "Years operating",
      sub: `Since ${FOUNDING_YEAR}`,
    },
    {
      value: `~${formatNumber(stats.swmKgPerDay)}`,
      label: "kg / day under O&M",
      sub: "Solid Waste Management",
    },
    {
      value: `${formatNumber(stats.cndTpd)}`,
      label: "TPD C&D installed",
      sub: `Across ${stats.cndPlants} plants`,
    },
    {
      value: `${stats.totalSites}`,
      label: "Sites operated",
      sub: `Across ${stats.citiesCount} cities`,
    },
  ];

  return (
    <section className="border-y border-charcoal/10 bg-offwhite">
      <div className="relative mx-auto max-w-7xl px-6 py-14 md:py-16">
        {/* Editorial spine */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-[3px] bg-brand-green"
        />

        <header className="mb-10 flex flex-col gap-y-3 md:mb-12 md:flex-row md:items-end md:justify-between md:gap-x-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-brand-green">
              Operating scale
            </p>
            <h2 className="mt-4 text-balance text-3xl font-medium leading-[1.05] tracking-tight text-charcoal md:text-4xl">
              Ten years building India&apos;s waste infrastructure.
            </h2>
          </div>
          {/* Atlas-style metadata in the header right */}
          <dl className="flex shrink-0 items-baseline gap-x-6 text-[11px] font-medium uppercase tracking-[0.16em] text-steel md:gap-x-8">
            <div>
              <dt className="sr-only">Established</dt>
              <dd>
                <span className="text-base font-medium tabular-nums text-charcoal md:text-lg">
                  {FOUNDING_YEAR}
                </span>{" "}
                est.
              </dd>
            </div>
            <div>
              <dt className="sr-only">Total sites</dt>
              <dd>
                <span className="text-base font-medium tabular-nums text-charcoal md:text-lg">
                  {stats.totalSites}
                </span>{" "}
                sites
              </dd>
            </div>
          </dl>
        </header>

        {/* Big-number grid with hairline column dividers — gives the row a
            chart/spec-sheet feeling rather than four loose tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4">
          {items.map((item, idx) => (
            <div
              key={item.label}
              className={`relative py-2 md:py-0 md:px-6 lg:px-8 ${
                idx > 0 ? "md:border-l md:border-charcoal/15" : ""
              } ${
                idx === 2 ? "border-t border-charcoal/15 pt-8 md:border-t-0 md:pt-0" : ""
              } ${idx === 3 ? "border-t border-charcoal/15 pt-8 md:border-t-0 md:pt-0" : ""} ${
                idx === 0 || idx === 1 ? "pb-8 md:pb-0" : ""
              } ${idx === 0 ? "md:pl-0" : ""} ${idx === 3 ? "md:pr-0" : ""}`}
            >
              {/* Tiny brand-green tick — measurement notch above each value */}
              <span
                aria-hidden
                className="mb-3 block h-[2px] w-6 bg-brand-green md:mb-4"
              />
              <p className="text-5xl font-medium leading-none tracking-tight tabular-nums text-charcoal md:text-6xl lg:text-7xl">
                {item.value}
              </p>
              <p className="mt-5 text-sm font-medium uppercase tracking-wide text-charcoal">
                {item.label}
              </p>
              <p className="mt-1 text-sm text-steel">{item.sub}</p>
            </div>
          ))}
        </div>

        {/* Atlas title block — bottom-right corner */}
        <p className="mt-10 text-right text-[10px] uppercase leading-[1.4] tracking-[0.18em] text-steel md:mt-12">
          <span className="text-charcoal font-medium">JBSS LLP</span>{" "}
          · Operating scale · {new Date().getFullYear()}
        </p>
      </div>
    </section>
  );
}
