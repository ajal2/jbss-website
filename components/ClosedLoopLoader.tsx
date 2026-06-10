// "Closed Loop" loader — SWM-green and C&D-terracotta arcs chasing each other
// around a hairline track. Pure CSS animation (see .jbss-loop in globals.css),
// so this works fine as a server component. Used full-screen via app/loading.tsx
// and available inline (e.g. a data-loading region) via the props below.

type Props = {
  /** px, default 72 */
  size?: number;
  /** track tone for the background it sits on, default "paper" */
  tone?: "paper" | "ink";
  /** seconds per revolution, default 2.1 */
  cycle?: number;
  className?: string;
};

export function ClosedLoopLoader({
  size = 72,
  tone = "paper",
  cycle = 2.1,
  className,
}: Props) {
  const style = {
    width: size,
    height: size,
    "--loop-cycle": `${cycle}s`,
  } as React.CSSProperties;

  return (
    <span
      className={`jbss-loop${className ? ` ${className}` : ""}`}
      data-tone={tone}
      style={style}
      role="status"
      aria-label="Loading"
    >
      <svg viewBox="0 0 80 80" width={size} height={size} aria-hidden="true">
        <circle className="track" cx="40" cy="40" r="32" />
        <g className="spin">
          <circle className="arc is-green" cx="40" cy="40" r="32" />
          <circle className="arc is-terra" cx="40" cy="40" r="32" />
        </g>
      </svg>
    </span>
  );
}
