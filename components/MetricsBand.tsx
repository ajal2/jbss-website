import { getVisibleProjects, type Project } from "@/lib/cms";
import { formatNumber } from "@/lib/format";
import { deriveStateName } from "@/lib/location";
import { SheetHead, AtlasFooter, SurveyField } from "@/components/Atlas";

const FOUNDING_YEAR = 2016;

type Props = {
  projects: Project[];
};

export function MetricsBand({ projects }: Props) {
  const visible = getVisibleProjects(projects);

  const yearsOperating = new Date().getFullYear() - FOUNDING_YEAR;

  // TPD installed = sum of dailyCapacityKgPerDay for C&D, divided by 1000
  const tpdCnd =
    visible
      .filter((p) => p.businessLine === "C&D")
      .reduce((sum, p) => sum + (p.dailyCapacityKgPerDay ?? 0), 0) / 1000;

  // Sites operated under O&M — includes both "EPC + O&M" and any service model with "O&M"
  const omSites = visible
    .filter((p) => p.serviceModel?.includes("O&M"))
    .reduce((sum, p) => sum + (p.subSites ?? 1), 0);

  // Cities + states (distinct, derived from city.name)
  const cities = new Set<string>();
  const states = new Set<string>();
  visible.forEach((p) => {
    const first = p.city?.name?.split(",")[0]?.trim();
    if (first) cities.add(first);
    const st = deriveStateName(p.city?.name);
    if (st) states.add(st);
  });

  const items = [
    {
      tick: "var(--green-300)",
      n: `${yearsOperating}`,
      plus: true,
      l1: "Years operating",
      l2: `since ${FOUNDING_YEAR}`,
    },
    {
      tick: "var(--terra-300)",
      n: formatNumber(tpdCnd),
      plus: false,
      l1: "TPD C&D capacity",
      l2: "installed",
    },
    {
      tick: "var(--green-300)",
      n: `${omSites}`,
      plus: true,
      l1: "Sites operated",
      l2: "under O&M",
    },
    {
      tick: "var(--terra-300)",
      n: `${cities.size}`,
      plus: false,
      l1: `Cities across`,
      l2: `${states.size} states`,
    },
  ];

  return (
    <section className="relative overflow-hidden border-t border-line-dk bg-ink-2 text-white">
      <SurveyField tone="dark" />
      <div className="relative mx-auto max-w-container">
        <div className="px-[var(--gutter)] pt-[clamp(28px,3.4vw,46px)]">
          <SheetHead label="Key figures" index="01" tone="dark" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4">
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`px-[var(--gutter)] py-[clamp(26px,3vw,40px)] ${
                idx > 0 ? "border-l border-line-dk" : ""
              } ${
                idx === 2
                  ? "border-l-0 border-t border-line-dk md:border-l md:border-t-0"
                  : ""
              } ${
                idx === 3 ? "border-t border-line-dk md:border-t-0" : ""
              } reveal`}
            >
              <div
                className="mb-4 h-[3px] w-[26px] rounded-[2px]"
                style={{ background: item.tick }}
              />
              <div className="text-[clamp(2.2rem,3.4vw,3.1rem)] font-extrabold leading-none tracking-[-0.04em] tabular-nums text-white">
                {item.n}
                {item.plus && (
                  <em className="not-italic" style={{ color: item.tick }}>
                    +
                  </em>
                )}
              </div>
              <div className="mt-3 font-mono text-[0.68rem] uppercase tracking-[0.12em] leading-[1.5] text-tx-dim">
                {item.l1}
                <br />
                {item.l2}
              </div>
            </div>
          ))}
        </div>
        <div className="px-[var(--gutter)] pb-[clamp(26px,3vw,42px)]">
          <AtlasFooter
            section="Key figures"
            note="Operating since 2016 · Gurgaon, Haryana"
            tone="dark"
          />
        </div>
      </div>
    </section>
  );
}
