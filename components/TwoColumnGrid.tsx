import Link from "next/link";
import type { Project } from "@/lib/cms";
import { ProjectTile, type TileAccent } from "@/components/ProjectTile";

type Props = {
  projects: Project[];
  /** Homepage-mode: show only featured tiles per column, hide "Other sites",
   *  append a "View full portfolio" CTA below the grid. */
  showFeaturedOnly?: boolean;
};

function sortProjects(a: Project, b: Project) {
  const statusRank: Record<string, number> = { Ongoing: 0, Completed: 1 };
  const aStatus = statusRank[a.status ?? ""] ?? 2;
  const bStatus = statusRank[b.status ?? ""] ?? 2;
  if (aStatus !== bStatus) return aStatus - bStatus;
  return (a.order ?? 999) - (b.order ?? 999);
}

function aggregateColumn(projects: Project[], line: "SWM" | "C&D") {
  const filtered = projects
    .filter((p) => p.visibleOnWebsite && p.businessLine === line)
    .sort(sortProjects);

  const totalCapacity = filtered.reduce(
    (sum, p) => sum + (p.dailyCapacityKgPerDay ?? 0),
    0,
  );
  const totalSites = filtered.reduce((sum, p) => sum + (p.subSites ?? 1), 0);

  return { projects: filtered, totalCapacity, totalSites };
}

function formatScale(kgPerDay: number, line: "SWM" | "C&D"): string {
  if (line === "C&D") {
    return `${Math.round(kgPerDay / 1000)} TPD installed`;
  }
  return `~${Math.round(kgPerDay).toLocaleString("en-IN")} kg/day`;
}

const ACCENT_TEXT: Record<TileAccent, string> = {
  "brand-green": "text-brand-green",
  highlight: "text-highlight",
};

const ACCENT_BG: Record<TileAccent, string> = {
  "brand-green": "bg-brand-green",
  highlight: "bg-highlight",
};

export function TwoColumnGrid({ projects, showFeaturedOnly = false }: Props) {
  const swm = aggregateColumn(projects, "SWM");
  const cnd = aggregateColumn(projects, "C&D");

  const totalProjects = swm.projects.length + cnd.projects.length;
  const ongoingCount = [...swm.projects, ...cnd.projects].filter(
    (p) => p.status === "Ongoing",
  ).length;

  return (
    <section className="bg-offwhite">
      <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20">
        {/* Editorial spine */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-[3px] bg-brand-green"
        />

        <header className="mb-12 flex flex-col gap-y-3 md:mb-16 md:flex-row md:items-end md:justify-between md:gap-x-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-brand-green">
              {showFeaturedOnly ? "Featured work" : "Portfolio"}
            </p>
            <h2 className="mt-4 text-balance text-3xl font-medium leading-[1.05] tracking-tight text-charcoal md:text-4xl">
              {showFeaturedOnly
                ? "Representative projects across both business lines."
                : "Two business lines. One operating model."}
            </h2>
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
          </dl>
        </header>

        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-x-16">
          <Column
            eyebrow="Solid Waste Management"
            headline={formatScale(swm.totalCapacity, "SWM")}
            subtitle={`Sanitation operations across ${swm.totalSites} sites and institutional customers.`}
            projects={swm.projects}
            accent="brand-green"
            showFeaturedOnly={showFeaturedOnly}
          />
          <Column
            eyebrow="Construction & Demolition"
            headline={formatScale(cnd.totalCapacity, "C&D")}
            subtitle={`EPC delivery and O&M of ${cnd.projects.length} municipal C&D plants.`}
            projects={cnd.projects}
            accent="highlight"
            showFeaturedOnly={showFeaturedOnly}
          />
        </div>

        {/* CTA — only when in featured-only mode, leads to the full portfolio */}
        {showFeaturedOnly && (
          <div className="mt-14 flex justify-start border-t border-charcoal/15 pt-8 md:mt-16">
            <Link
              href="/projects"
              className="group inline-flex items-baseline gap-3 text-xs font-medium uppercase tracking-[0.22em] text-charcoal transition-colors hover:text-brand-green"
            >
              <span className="relative">
                View full portfolio
                <span
                  aria-hidden
                  className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-100 bg-brand-green transition-transform duration-200"
                />
              </span>
              <span
                aria-hidden
                className="text-base text-brand-green transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        )}

        {/* Atlas plate — colophon */}
        <p className="mt-16 text-right text-[10px] uppercase leading-[1.4] tracking-[0.18em] text-steel md:mt-20">
          <span className="font-medium text-charcoal">JBSS LLP</span> ·{" "}
          {showFeaturedOnly ? "Featured work" : "Portfolio"} ·{" "}
          {new Date().getFullYear()}
        </p>
      </div>
    </section>
  );
}

function Column({
  eyebrow,
  headline,
  subtitle,
  projects,
  accent,
  showFeaturedOnly = false,
}: {
  eyebrow: string;
  headline: string;
  subtitle: string;
  projects: Project[];
  accent: TileAccent;
  showFeaturedOnly?: boolean;
}) {
  const featured = projects.filter((p) => p.featured);
  // In featured-only mode, the compact list is dropped entirely; the homepage
  // is a curated showcase, full list lives on /projects.
  const rest = showFeaturedOnly ? [] : projects.filter((p) => !p.featured);

  return (
    <div className="relative">
      {/* Per-column corner accent — small colored square at the top-left,
          matches the Delhi inset corner pattern */}
      <span
        aria-hidden
        className={`absolute -left-1 top-0 inline-block h-3 w-3 ${ACCENT_BG[accent]}`}
      />

      <header className="mb-10 border-b border-charcoal/25 pb-6 pl-5">
        <p
          className={`text-xs font-medium uppercase tracking-[0.22em] ${ACCENT_TEXT[accent]}`}
        >
          {eyebrow}
        </p>
        <p className="mt-4 text-3xl font-medium tracking-tight tabular-nums text-charcoal md:text-4xl">
          {headline}
        </p>
        <p className="mt-3 max-w-md text-base leading-relaxed text-steel">
          {subtitle}
        </p>
      </header>

      {featured.length > 0 && (
        <div className="space-y-14 md:space-y-16">
          {featured.map((p) => (
            <ProjectTile
              key={p.id}
              project={p}
              accent={accent}
              variant="featured"
            />
          ))}
        </div>
      )}

      {rest.length > 0 && (
        <div className={featured.length > 0 ? "mt-16 md:mt-20" : ""}>
          {featured.length > 0 && (
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-steel">
              Other sites
            </p>
          )}
          <div>
            {rest.map((p) => (
              <ProjectTile
                key={p.id}
                project={p}
                accent={accent}
                variant="compact"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
