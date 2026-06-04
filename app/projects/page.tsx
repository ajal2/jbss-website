import { getProjects } from "@/lib/cms";
import { TwoColumnGrid } from "@/components/TwoColumnGrid";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getProjects();
  const visible = projects.filter((p) => p.visibleOnWebsite);
  const totalProjects = visible.length;
  const ongoingCount = visible.filter((p) => p.status === "Ongoing").length;
  const cities = new Set<string>();
  visible.forEach((p) => {
    const first = p.city?.name?.split(",")[0]?.trim();
    if (first) cities.add(first);
  });

  return (
    <>
      <section className="border-b border-charcoal/10 bg-offwhite">
        <div className="relative mx-auto max-w-7xl px-6 py-14 md:py-16">
          {/* Editorial spine */}
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 w-[3px] bg-brand-green"
          />

          <header className="flex flex-col gap-y-3 md:flex-row md:items-end md:justify-between md:gap-x-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-brand-green">
                Portfolio
              </p>
              <h1 className="mt-4 text-balance text-4xl font-medium leading-[1.05] tracking-tight text-charcoal md:text-5xl">
                All projects.
              </h1>
            </div>
            <dl className="flex shrink-0 items-baseline gap-x-6 text-[11px] font-medium uppercase tracking-[0.16em] text-steel md:gap-x-8">
              <div>
                <dt className="sr-only">Projects</dt>
                <dd>
                  <span className="text-base font-medium tabular-nums text-charcoal md:text-lg">
                    {totalProjects}
                  </span>{" "}
                  projects
                </dd>
              </div>
              <div>
                <dt className="sr-only">Ongoing</dt>
                <dd>
                  <span className="text-base font-medium tabular-nums text-charcoal md:text-lg">
                    {ongoingCount}
                  </span>{" "}
                  ongoing
                </dd>
              </div>
              <div>
                <dt className="sr-only">Cities</dt>
                <dd>
                  <span className="text-base font-medium tabular-nums text-charcoal md:text-lg">
                    {cities.size}
                  </span>{" "}
                  cities
                </dd>
              </div>
            </dl>
          </header>
        </div>
      </section>

      <TwoColumnGrid projects={projects} />
    </>
  );
}
