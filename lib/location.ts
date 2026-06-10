/**
 * Derive a display state name from a Notion city string like
 * "Bareilly, Uttar Pradesh" or "New Delhi, Delhi, India" — returns the last
 * meaningful segment (skipping a trailing "India"), normalizing "New Delhi"
 * to "Delhi". Returns undefined when there's nothing usable.
 *
 * Shared by MetricsBand, FootprintMap and ProjectsTable. Callers that need a
 * placeholder (the table renders "—") apply `?? "—"` at the call site.
 */
export function deriveStateName(cityName?: string): string | undefined {
  if (!cityName) return undefined;
  const parts = cityName
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!parts.length) return undefined;
  const last = parts[parts.length - 1];
  const raw =
    last.toLowerCase() === "india" && parts.length >= 2
      ? parts[parts.length - 2]
      : last;
  return raw === "New Delhi" ? "Delhi" : raw;
}
