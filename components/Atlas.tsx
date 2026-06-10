// Atlas / survey furniture — the site-wide "chartered drawing" vocabulary,
// extended from the FootprintMap plate. Quiet, technical, institutional:
// a sheet index on every header, registration crop-marks framing plates, and
// an atlas-plate stamp closing every section. This is the YES-list device the
// brand is built on (Tata Projects / Holcim / L&T register), applied evenly.

const ATLAS_YEAR = "2026";

type Tone = "light" | "dark";
type Accent = "green" | "terra" | "faint";

const EYEBROW =
  "font-mono text-[0.72rem] font-bold uppercase tracking-[0.18em]";

function eyebrowColor(accent: Accent, tone: Tone): string {
  if (accent === "green") return "text-green-300";
  if (accent === "terra") return tone === "dark" ? "text-terra-300" : "text-terra-700";
  return tone === "dark" ? "text-tx-dim" : "text-tx-faint";
}

/**
 * Sheet header — eyebrow + hairline rule + drawing-sheet index.
 * Drop-in replacement for the old `eyebrow + rule` block; the index on the
 * right turns each section into a numbered plate of one document.
 */
export function SheetHead({
  label,
  index,
  total = 6,
  tone = "light",
  accent = "faint",
}: {
  label: string;
  index: string;
  total?: number;
  tone?: Tone;
  accent?: Accent;
}) {
  const rule = tone === "dark" ? "bg-line-dk" : "bg-line";
  const idx = tone === "dark" ? "text-tx-dim" : "text-tx-faint";
  return (
    <div className="mb-[22px] flex items-center gap-3.5">
      <span className={`${EYEBROW} ${eyebrowColor(accent, tone)}`}>{label}</span>
      <span className={`h-px flex-1 ${rule}`} />
      <span className={`shrink-0 font-mono text-[0.6rem] uppercase tracking-[0.14em] ${idx}`}>
        Sheet {index}/{String(total).padStart(2, "0")}
      </span>
    </div>
  );
}

/**
 * Sheet footer — a hairline closing rule with a left-side datum note and the
 * atlas-plate stamp on the right. Closes a section like a drawing sheet.
 */
export function AtlasFooter({
  section,
  note,
  tone = "light",
  className = "",
}: {
  section: string;
  note?: string;
  tone?: Tone;
  className?: string;
}) {
  const border = tone === "dark" ? "border-line-dk" : "border-line";
  const text = tone === "dark" ? "text-tx-dim" : "text-tx-faint";
  return (
    <div
      className={`mt-[clamp(30px,4vw,52px)] flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t ${border} pt-[15px] font-mono text-[0.6rem] uppercase tracking-[0.16em] ${text} ${className}`}
    >
      <span>{note ?? "Jalota Business Support Services LLP"}</span>
      <span className="tabular-nums">
        <span className="opacity-55">JBSS LLP · </span>
        {section}
        <span className="opacity-55"> · {ATLAS_YEAR}</span>
      </span>
    </div>
  );
}

/** Registration crop-marks framing a plate. Parent must be `relative`. */
export function Ticks({ tone = "light" }: { tone?: Tone }) {
  const c = tone === "dark" ? "border-white/15" : "border-tx-faint/35";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]">
      <span className={`absolute left-3 top-3 h-3 w-3 border-l border-t ${c}`} />
      <span className={`absolute right-3 top-3 h-3 w-3 border-r border-t ${c}`} />
      <span className={`absolute bottom-3 left-3 h-3 w-3 border-b border-l ${c}`} />
      <span className={`absolute bottom-3 right-3 h-3 w-3 border-b border-r ${c}`} />
    </div>
  );
}

/**
 * Faint graph-paper plate, masked to fade at the edges. Render as the first
 * child of a `relative overflow-hidden` section.
 */
export function SurveyField({ tone = "light" }: { tone?: Tone }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${
        tone === "dark" ? "survey-grid--dark" : "survey-grid"
      }`}
    />
  );
}
