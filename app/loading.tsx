import { ClosedLoopLoader } from "@/components/ClosedLoopLoader";

// Global route loading fallback (App Router renders it during server-side
// data fetches). The .loader-screen CSS keeps it hidden for the first ~3s, so
// quick loads never flash it — it only appears when a load genuinely drags on.
export default function Loading() {
  return (
    <div className="loader-screen">
      <ClosedLoopLoader />
    </div>
  );
}
