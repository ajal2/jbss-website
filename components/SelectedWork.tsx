import Link from "next/link";
import { getVisibleProjects, type Project } from "@/lib/cms";
import { Ticks } from "@/components/Atlas";

type Props = {
  projects: Project[];
};

export function SelectedWork({ projects }: Props) {
  const visible = getVisibleProjects(projects);
  // Up to 3 featured projects; fall back to ordering by `order` if fewer than 3 featured
  const featured = visible.filter((p) => p.featured);
  const picked = (
    featured.length >= 3
      ? featured.slice(0, 3)
      : [
          ...featured,
          ...visible.filter((p) => !p.featured).sort((a, b) => (a.order ?? 999) - (b.order ?? 999)),
        ].slice(0, 3)
  );

  const totalVisible = visible.length;

  return (
    <section id="projects" className="pad-section">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="mb-[22px] flex items-center gap-3">
              <span className="text-[0.8rem] font-semibold text-tx-faint">
                Selected work
              </span>
            </div>
            <h2 className="text-h1 text-ink">What we build and run.</h2>
          </div>
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2.5 border-b-2 border-terra pb-[3px] font-semibold text-ink"
          >
            View all projects
            <span className="text-terra transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        <div className="mt-[clamp(28px,4vw,42px)] grid grid-cols-1 gap-[clamp(16px,2vw,24px)] md:grid-cols-2 lg:grid-cols-3">
          {picked.map((p) => {
            const title = p.displayName || p.projectName;
            const cap = p.capacityHeadline;
            const isOngoing = p.status === "Ongoing";
            const cover = p.coverImageUrl;
            const isCnd = p.businessLine === "C&D";
            // Split "300 TPD" / "1,850 homes" into a big tabular figure + mono unit;
            // a purely non-numeric headline falls through whole, with no unit.
            const capMatch = cap
              ?.trim()
              .match(/^([\d.,]+(?:\s*[–-]\s*[\d.,]+)?\+?)\s*(.*)$/);
            const capFigure = capMatch ? capMatch[1] : cap;
            const capUnit = capMatch ? capMatch[2] : "";
            return (
              <article
                key={p.id}
                className="reveal flex flex-col overflow-hidden rounded-md border border-line bg-card transition-all duration-200 hover:-translate-y-1"
                style={{ transitionProperty: "transform, box-shadow" }}
              >
                {/* Line-accent top bar — same motif as the "What we do" cards */}
                <div
                  aria-hidden
                  className={`h-1 w-full ${isCnd ? "bg-terra" : "bg-green"}`}
                />

                {/* Documentary photo — the figure moved off it, so only a faint scrim remains */}
                <div className="relative aspect-[4/3]">
                  {cover ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={cover}
                      alt={`${title}, JBSS ${p.businessLine ?? ""} project site`.trim()}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    /* No site photo on file — render a drafted spec plate so
                       the gap reads as intentional, not broken. */
                    <div
                      aria-hidden
                      className="survey-grid absolute inset-0 grid place-items-center overflow-hidden bg-mist"
                    >
                      <Ticks tone="light" />
                      <div className="relative text-center">
                        <div
                          className={`font-mono text-[clamp(2rem,4.4vw,2.9rem)] font-bold leading-none tracking-[-0.02em] ${
                            isCnd ? "text-terra-700/25" : "text-green-700/25"
                          }`}
                        >
                          {p.businessLine ?? "JBSS"}
                        </div>
                        <div className="mt-3.5 text-[0.56rem] font-medium text-tx-faint">
                          {p.city?.name?.split(",")[0]?.trim() ?? "JBSS LLP"}
                          {" · No site photo"}
                        </div>
                      </div>
                    </div>
                  )}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(transparent 68%, rgba(20,28,20,.28))",
                    }}
                  />
                </div>

                <div className="flex flex-1 flex-col gap-2.5 px-5 pb-[22px] pt-[18px]">
                  {/* Mono spec row — uniform monochrome: status · model · line */}
                  <div className="flex flex-wrap items-center gap-2.5 text-[0.7rem] font-medium text-tx-faint">
                    <span className="inline-flex items-center gap-1.5 text-tx-soft">
                      <span
                        className={`relative inline-block h-2 w-2 rounded-full ${
                          isOngoing ? "bg-st-ongoing" : "bg-st-done"
                        }`}
                      >
                        {isOngoing && (
                          <span
                            aria-hidden
                            className="absolute -inset-1 rounded-full border-[1.5px] opacity-50"
                            style={{
                              borderColor: "var(--st-ongoing)",
                              animation:
                                "ping-status 2.4s cubic-bezier(0,0,.2,1) infinite",
                            }}
                          />
                        )}
                      </span>
                      {isOngoing ? "Ongoing" : "Completed"}
                    </span>
                    {p.serviceModel && (
                      <>
                        <span aria-hidden>·</span>
                        <span>{p.serviceModel}</span>
                      </>
                    )}
                    {p.businessLine && (
                      <>
                        <span aria-hidden>·</span>
                        <span>{p.businessLine}</span>
                      </>
                    )}
                  </div>

                  <h3 className="text-[1.3rem] font-bold tracking-[-0.02em] text-ink">
                    {title}
                  </h3>

                  {p.tileTagline && (
                    <p className="text-[0.95rem] text-tx-soft">{p.tileTagline}</p>
                  )}

                  {/* Dedicated capacity stat — figure + mono unit on a top hairline,
                      echoing the "What we do" card stat block */}
                  {cap && (
                    <div className="mt-auto flex items-baseline gap-2.5 border-t border-line pt-[18px]">
                      <span
                        className={`text-2xl font-extrabold leading-none tracking-[-0.03em] tabular-nums ${
                          isCnd ? "text-terra-700" : "text-green-700"
                        }`}
                      >
                        {capFigure}
                      </span>
                      {capUnit && (
                        <span className="text-[0.72rem] font-medium text-tx-faint">
                          {capUnit}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-[clamp(24px,3vw,36px)] border-t border-line pt-5">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2.5 border-b-2 border-terra pb-[3px] font-semibold text-ink"
          >
            See the full portfolio: {totalVisible} projects across both lines
            <span className="text-terra transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
