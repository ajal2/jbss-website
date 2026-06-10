/** Indian-grouped integer formatting (e.g. 12,34,567). Shared by the metric
 *  bands and capability cards so the locale + rounding stay consistent. */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-IN").format(Math.round(n));
}
