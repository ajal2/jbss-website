import type { Project } from "@/lib/cms";

type Props = {
  projects: Project[];
};

type Wordmark = {
  name: string;
  tag?: string;
};

// Tier 1 — central government + premier institutional. Named explicitly even
// when the underlying project page is a stub (IAF), because the relationship
// is real and the name carries credibility.
const TIER_INSTITUTIONAL: Wordmark[] = [
  { name: "IIT Delhi", tag: "Institutional · New Delhi" },
  { name: "DDA", tag: "Central · New Delhi" },
  { name: "Indian Air Force", tag: "Central · Defence" },
];

// Tier 2 — municipal corporations, grouped by state for geographic legibility.
// BHEL and PWD intentionally excluded while entity / data questions are open.
const TIER_MUNICIPAL: Wordmark[] = [
  { name: "Mysuru City Corporation", tag: "Karnataka" },
  { name: "Hubli-Dharwad Municipal Corporation", tag: "Karnataka" },
  { name: "Kalaburagi Mahanagara Palike", tag: "Karnataka" },
  { name: "Davanagere Municipal Corporation", tag: "Karnataka" },
  { name: "City Municipal Council Bidar", tag: "Karnataka" },
  { name: "Nagar Nigam Bareilly", tag: "Uttar Pradesh" },
  { name: "Nagar Nigam Mathura-Vrindavan", tag: "Uttar Pradesh" },
  { name: "Municipal Corporation Dewas", tag: "Madhya Pradesh" },
];

export function ClientWordmarks({ projects: _projects }: Props) {
  return (
    <section className="relative overflow-hidden bg-deep-green">
      <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
        <header className="mb-16 max-w-3xl md:mb-20">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-brand-green">
            Trusted by
          </p>
          <h2 className="mt-5 text-balance text-3xl font-medium leading-tight tracking-tight text-offwhite md:text-4xl">
            Eleven institutional clients across India.
          </h2>
          <p className="mt-4 text-base text-offwhite/60 md:text-lg">
            Central government, state governments, and municipal corporations —
            every relationship awarded through competitive public procurement.
          </p>
        </header>

        {/* Tier 1 — institutional wall. Left margin rule = architectural drawing. */}
        <div className="relative border-t border-offwhite/15 md:pl-8">
          <div
            aria-hidden
            className="absolute left-0 top-0 hidden h-full w-px bg-brand-green/50 md:block"
          />
          {TIER_INSTITUTIONAL.map((w) => (
            <div
              key={w.name}
              className="flex flex-col gap-1 border-b border-offwhite/15 py-6 md:flex-row md:items-baseline md:justify-between md:gap-6 md:py-8"
            >
              <h3 className="text-2xl font-medium tracking-tight text-offwhite md:text-[2.125rem]">
                {w.name}
              </h3>
              {w.tag && (
                <p className="shrink-0 text-[11px] font-medium uppercase tracking-[0.2em] text-brand-green/85">
                  {w.tag}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Tier 2 — municipal corporations, denser */}
        <div className="mt-16 md:mt-20">
          <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.22em] text-offwhite/45">
            Municipal corporations
          </p>
          <div className="grid grid-cols-1 border-t border-offwhite/15 md:grid-cols-2 md:gap-x-12">
            {TIER_MUNICIPAL.map((w) => (
              <div
                key={w.name}
                className="flex items-baseline justify-between gap-4 border-b border-offwhite/15 py-4 md:py-5"
              >
                <h4 className="text-base font-medium tracking-tight text-offwhite md:text-lg">
                  {w.name}
                </h4>
                {w.tag && (
                  <p className="shrink-0 text-[10px] font-medium uppercase tracking-[0.18em] text-offwhite/45">
                    {w.tag}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
