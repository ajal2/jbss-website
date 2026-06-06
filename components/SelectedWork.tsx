import Link from "next/link";
import type { Project } from "@/lib/cms";

type Props = {
  projects: Project[];
};

function cityShort(name?: string): string | undefined {
  return name?.split(",")[0]?.trim();
}

export function SelectedWork({ projects }: Props) {
  const visible = projects.filter((p) => p.visibleOnWebsite);
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
              <span className="font-mono text-[0.72rem] font-bold uppercase tracking-[0.18em] text-tx-faint">
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

        <div className="mt-[clamp(36px,5vw,54px)] grid grid-cols-1 gap-[clamp(18px,2.4vw,28px)] md:grid-cols-2 lg:grid-cols-3">
          {picked.map((p) => {
            const title = p.displayName || p.projectName;
            const cap = p.capacityHeadline;
            const isOngoing = p.status === "Ongoing";
            const cover = p.coverImageUrl;
            return (
              <article
                key={p.id}
                className="reveal flex flex-col overflow-hidden rounded-md border border-line bg-card transition-all duration-200 hover:-translate-y-1"
                style={{
                  transitionProperty: "transform, box-shadow",
                }}
              >
                <div className="relative aspect-[4/3]">
                  {cover ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={cover}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      aria-hidden
                      className="absolute inset-0 grid place-items-center p-4"
                      style={{
                        background:
                          "repeating-linear-gradient(45deg, rgba(32,37,31,.05) 0 10px, transparent 10px 20px), var(--mist)",
                      }}
                    >
                      <span className="font-mono text-[0.72rem] uppercase tracking-[0.08em] text-tx-faint">
                        ▭ Project photo
                      </span>
                    </div>
                  )}
                  {/* gradient overlay for caption legibility */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(transparent 50%, rgba(20,28,20,.55))",
                    }}
                  />
                  {cap && (
                    <span
                      className="absolute bottom-3 left-3.5 z-[2] font-mono text-[1.5rem] font-bold tracking-[-0.02em] text-white"
                      style={{ textShadow: "0 1px 14px rgba(0,0,0,.5)" }}
                    >
                      {cap}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2.5 px-5 pb-[22px] pt-[18px]">
                  <div className="flex flex-wrap items-center gap-2.5 font-mono text-[0.7rem] uppercase tracking-[0.06em] text-tx-faint">
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
                        <span>·</span>
                        <span>{p.serviceModel}</span>
                      </>
                    )}
                    {cityShort(p.city?.name) && (
                      <>
                        <span>·</span>
                        <span>{cityShort(p.city?.name)}</span>
                      </>
                    )}
                  </div>
                  <h3 className="text-[1.3rem] font-bold tracking-[-0.02em] text-ink">
                    {title}
                  </h3>
                  {p.tileTagline && (
                    <p className="text-[0.95rem] text-tx-soft">{p.tileTagline}</p>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-[clamp(30px,4vw,46px)] border-t border-line pt-6">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2.5 border-b-2 border-terra pb-[3px] font-semibold text-ink"
          >
            See the full portfolio — {totalVisible} projects across both lines
            <span className="text-terra transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
