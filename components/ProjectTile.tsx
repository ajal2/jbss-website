import type { Project } from "@/lib/cms";
import { StatusBadge } from "@/components/StatusBadge";

export type TileAccent = "brand-green" | "highlight";
export type TileVariant = "featured" | "compact";

type Props = {
  project: Project;
  accent?: TileAccent;
  variant?: TileVariant;
};

function extractYear(dateString?: string): string | undefined {
  if (!dateString) return undefined;
  const year = new Date(dateString).getFullYear();
  if (Number.isNaN(year)) return undefined;
  return year.toString();
}

const ACCENT_TEXT: Record<TileAccent, string> = {
  "brand-green": "text-brand-green",
  highlight: "text-highlight",
};

// Tinted fallback block when no cover image is uploaded.
const ACCENT_FILL: Record<TileAccent, string> = {
  "brand-green": "bg-brand-green/15",
  highlight: "bg-highlight/15",
};

const ACCENT_BORDER: Record<TileAccent, string> = {
  "brand-green": "border-brand-green",
  highlight: "border-highlight",
};

function deriveYearLabel(project: Project): string | undefined {
  const startYear = extractYear(project.dateFrom);
  const endYear = extractYear(project.dateTo);
  if (project.status === "Completed" && endYear) return `Completed ${endYear}`;
  if (startYear) return `Awarded ${startYear}`;
  return undefined;
}

export function ProjectTile({
  project,
  accent = "brand-green",
  variant = "compact",
}: Props) {
  if (variant === "featured") {
    return <FeaturedTile project={project} accent={accent} />;
  }
  return <CompactTile project={project} accent={accent} />;
}

// ─── Featured ───────────────────────────────────────────────────────────────

function FeaturedTile({
  project,
  accent,
}: {
  project: Project;
  accent: TileAccent;
}) {
  const title = project.displayName || project.projectName;
  const tagline = project.tileTagline;
  const headline = project.capacityHeadline;
  const status = project.status;
  const serviceModel = project.serviceModel;
  const city = project.city?.name?.split(",")[0];
  const yearLabel = deriveYearLabel(project);
  const cover = project.coverImageUrl;

  return (
    <article className="group">
      {/* Visual block — real image, or tinted fallback with capacity typography */}
      {cover ? (
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-charcoal/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover}
            alt=""
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
        </div>
      ) : (
        <div
          className={`relative flex aspect-[16/10] w-full items-end overflow-hidden ${ACCENT_FILL[accent]}`}
        >
          {/* Faint hairline grid for industrial texture */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(26,31,26,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(26,31,26,0.08) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          {headline && (
            <p className="relative p-6 text-4xl font-medium leading-none tracking-tight tabular-nums text-charcoal md:p-8 md:text-5xl">
              {headline}
            </p>
          )}
        </div>
      )}

      {/* Accent rule + content */}
      <div className={`mt-5 border-t-2 pt-5 ${ACCENT_BORDER[accent]}`}>
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h3 className="text-2xl font-medium leading-tight tracking-tight text-charcoal md:text-[1.75rem]">
            {title}
          </h3>
          {headline && cover && (
            <p
              className={`shrink-0 text-xl font-medium tracking-tight tabular-nums ${ACCENT_TEXT[accent]} md:text-2xl`}
            >
              {headline}
            </p>
          )}
        </div>

        {tagline && (
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-steel">
            {tagline}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium uppercase tracking-wide text-steel">
          <StatusBadge status={status} />
          {serviceModel && (
            <>
              <span className="text-charcoal/20">·</span>
              <span>{serviceModel}</span>
            </>
          )}
          {city && (
            <>
              <span className="text-charcoal/20">·</span>
              <span>{city}</span>
            </>
          )}
          {yearLabel && (
            <>
              <span className="text-charcoal/20">·</span>
              <span>{yearLabel}</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

// ─── Compact ────────────────────────────────────────────────────────────────

function CompactTile({
  project,
  accent,
}: {
  project: Project;
  accent: TileAccent;
}) {
  const title = project.displayName || project.projectName;
  const headline = project.capacityHeadline;
  const status = project.status;
  const serviceModel = project.serviceModel;
  const city = project.city?.name?.split(",")[0];
  const yearLabel = deriveYearLabel(project);

  const metaParts = [serviceModel, city, yearLabel].filter(Boolean);

  return (
    <article className="grid grid-cols-[auto_1fr_auto] items-baseline gap-x-4 border-t border-charcoal/15 py-4 first:border-t-0 first:pt-0 md:gap-x-6 md:py-5">
      <div className="self-center">
        <StatusBadge status={status} />
      </div>

      <div className="min-w-0">
        <h3 className="text-base font-medium leading-snug tracking-tight text-charcoal md:text-[1.0625rem]">
          {title}
        </h3>
        {metaParts.length > 0 && (
          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-steel">
            {metaParts.join(" · ")}
          </p>
        )}
      </div>

      {headline && (
        <p
          className={`shrink-0 text-base font-medium tabular-nums ${ACCENT_TEXT[accent]} md:text-[1.0625rem]`}
        >
          {headline}
        </p>
      )}
    </article>
  );
}
