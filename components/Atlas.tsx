// Atlas / survey furniture — the site-wide "chartered drawing" vocabulary,
// extended from the FootprintMap plate. Quiet, technical, institutional:
// a sheet index on every header, registration crop-marks framing plates, and
// an atlas-plate stamp closing every section. This is the YES-list device the
// brand is built on (Tata Projects / Holcim / L&T register), applied evenly.

type Tone = "light" | "dark";
type Accent = "green" | "terra" | "faint";

const EYEBROW =
  "font-mono text-[0.72rem] font-bold uppercase tracking-[0.18em]";

function eyebrowColor(accent: Accent, tone: Tone): string {
  if (accent === "green") return "text-green-300";
  if (accent === "terra") return tone === "dark" ? "text-terra-300" : "text-terra-700";
  return tone === "dark" ? "text-tx-dim" : "text-tx-faint";
}

/** Section header — eyebrow + hairline rule. */
export function SheetHead({
  label,
  tone = "light",
  accent = "faint",
}: {
  label: string;
  index?: string;
  total?: number;
  tone?: Tone;
  accent?: Accent;
}) {
  const rule = tone === "dark" ? "bg-line-dk" : "bg-line";
  return (
    <div className="mb-[22px] flex items-center gap-3">
      <span className={`${EYEBROW} ${eyebrowColor(accent, tone)}`}>{label}</span>
      <span className={`h-px flex-1 ${rule}`} />
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
