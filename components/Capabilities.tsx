import type { Project } from "@/lib/cms";

type Props = {
  projects: Project[];
};

type Capability = {
  number: string;
  title: string;
  description: string;
  workflow: string[];
  stats: { value: string; label: string }[];
};

function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-IN").format(Math.round(n));
}

// Longest O&M term we hold — Bareilly NCAP. Hardcoded because Notion's
// `dateTo` for ongoing projects doesn't carry the contracted term length.
const LONGEST_OM_TERM_YEARS = 15;

function buildCapabilities(projects: Project[]): Capability[] {
  const visible = projects.filter((p) => p.visibleOnWebsite);

  // Card 01 — Plant EPC Delivery: C&D plants delivered turnkey, no O&M tail
  const epcOnly = visible.filter(
    (p) => p.businessLine === "C&D" && p.serviceModel === "EPC",
  );
  const epcPlants = epcOnly.reduce((sum, p) => sum + (p.subSites ?? 1), 0);
  const epcTpd =
    epcOnly.reduce((sum, p) => sum + (p.dailyCapacityKgPerDay ?? 0), 0) / 1000;

  // Card 02 — Plant EPC + Multi-Year O&M: EPC scope plus recurring operations.
  // Sub-sites matter here because DDA carries 13 composting plants under one
  // Notion project record.
  const epcAndOm = visible.filter((p) => p.serviceModel === "EPC + O&M");
  const omPlants = epcAndOm.reduce((sum, p) => sum + (p.subSites ?? 1), 0);

  return [
    {
      number: "01",
      title: "Plant EPC Delivery",
      description:
        "Design, supply, build, install, and commission Construction & Demolition processing plants and on-site composting plants. Plants delivered turnkey to the client; operations transfer on commissioning.",
      workflow: ["Design", "Supply", "Build", "Commission"],
      stats: [
        { value: `${epcPlants}`, label: "plants" },
        { value: `${formatNumber(epcTpd)}`, label: "TPD installed" },
      ],
    },
    {
      number: "02",
      title: "Plant EPC + Multi-Year O&M",
      description:
        "Same end-to-end EPC scope, plus 2–15 year operations & maintenance contracts. Recurring revenue stream; JBSS retains operational responsibility for the full O&M term. Bareilly's 15-year O&M under NCAP is the flagship of the model.",
      workflow: ["Build", "Commission", "Operate", "Maintain"],
      stats: [
        { value: `${omPlants}+`, label: "plants under O&M" },
        { value: `${LONGEST_OM_TERM_YEARS}`, label: "yr longest term" },
      ],
    },
  ];
}

export function Capabilities({ projects }: Props) {
  const capabilities = buildCapabilities(projects);

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
              Capabilities
            </p>
            <h2 className="mt-4 text-balance text-3xl font-medium leading-[1.05] tracking-tight text-charcoal md:text-4xl">
              How JBSS delivers.
            </h2>
          </div>
          <p className="shrink-0 text-[11px] font-medium uppercase tracking-[0.16em] text-steel">
            <span className="text-base font-medium tabular-nums text-charcoal md:text-lg">
              2
            </span>{" "}
            service models · EPC · EPC + O&amp;M
          </p>
        </header>

        {/* 2-column band — hairline divider between cards */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {capabilities.map((cap, idx) => (
            <article
              key={cap.number}
              className={`relative flex flex-col gap-y-6 py-8 md:py-0 md:px-10 ${
                idx > 0 ? "border-t border-charcoal/15 md:border-l md:border-t-0" : ""
              } ${idx === 0 ? "md:pl-0" : ""} ${idx === 1 ? "md:pr-0" : ""}`}
            >
              {/* Brand-green tick — measurement notch above the number */}
              <span
                aria-hidden
                className="block h-[2px] w-6 bg-brand-green"
              />

              {/* Numbered eyebrow */}
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-brand-green">
                {cap.number}
              </p>

              {/* Title */}
              <h3 className="text-balance text-2xl font-medium leading-[1.15] tracking-tight text-charcoal md:text-[1.75rem]">
                {cap.title}
              </h3>

              {/* Description */}
              <p className="text-[15px] leading-relaxed text-steel">
                {cap.description}
              </p>

              {/* Workflow strip — inline text, brand-green arrows */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px] font-medium uppercase tracking-[0.16em] text-charcoal">
                {cap.workflow.map((step, i) => (
                  <span key={step} className="inline-flex items-center gap-2">
                    <span>{step}</span>
                    {i < cap.workflow.length - 1 && (
                      <span aria-hidden className="text-brand-green">
                        →
                      </span>
                    )}
                  </span>
                ))}
              </div>

              {/* Stats line — tabular nums */}
              <dl className="mt-auto flex items-baseline gap-x-6 border-t border-charcoal/15 pt-4 text-[11px] font-medium uppercase tracking-[0.16em] text-steel">
                {cap.stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="text-base font-medium tabular-nums text-charcoal md:text-lg">
                        {stat.value}
                      </span>{" "}
                      {stat.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>

        {/* Atlas plate */}
        <p className="mt-10 text-right text-[10px] uppercase leading-[1.4] tracking-[0.18em] text-steel md:mt-12">
          <span className="font-medium text-charcoal">JBSS LLP</span> ·
          Capabilities · {new Date().getFullYear()}
        </p>
      </div>
    </section>
  );
}
