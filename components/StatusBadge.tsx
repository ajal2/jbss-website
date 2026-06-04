type Props = {
  status?: string;
};

export function StatusBadge({ status }: Props) {
  if (!status) return null;

  const isOngoing = status === "Ongoing";
  const dotColor = isOngoing ? "bg-brand-green" : "bg-status-completed";

  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-charcoal">
      <span className="relative flex h-2 w-2">
        {isOngoing && (
          <span
            className={`absolute inline-flex h-full w-full animate-ping-slow rounded-full ${dotColor} opacity-60`}
          />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${dotColor}`}
        />
      </span>
      {status}
    </span>
  );
}
