// Shared headline stat (big number + mono label) used in page headers.
export function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div>
      <div className="text-[clamp(1.7rem,2.6vw,2.4rem)] font-extrabold leading-none tracking-[-0.03em] tabular-nums text-ink">
        {n}
      </div>
      <div className="mt-2 text-[0.68rem] font-medium text-tx-faint">
        {label}
      </div>
    </div>
  );
}
