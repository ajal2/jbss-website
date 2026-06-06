"use client";

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { useMemo, useState } from "react";
import type { Project } from "@/lib/cms";

// India-recognized state boundaries — includes PoK + Aksai Chin as part of
// India, full extent of Arunachal Pradesh. NEVER replace with world-atlas /
// OSM. The handoff CLAUDE.md is explicit about this.
const INDIA_GEO = "/india-states.geojson";

type Props = {
  projects: Project[];
};

type Pin = {
  id: string;
  name: string;
  capacity?: string;
  city?: string;
  state?: string;
  lat: number;
  lng: number;
  isCnd: boolean;
  isOngoing: boolean;
  serviceModel?: string;
};

function deriveState(cityName?: string): string | undefined {
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

function buildPins(projects: Project[]): Pin[] {
  const pins: Pin[] = [];
  for (const p of projects) {
    if (!p.visibleOnWebsite) continue;
    const lat = p.city?.lat;
    const lng = p.city?.lng;
    if (typeof lat !== "number" || typeof lng !== "number") continue;
    pins.push({
      id: p.id,
      name: p.displayName || p.projectName,
      capacity: p.capacityHeadline,
      city: p.city?.name?.split(",")[0]?.trim(),
      state: deriveState(p.city?.name),
      lat,
      lng,
      isCnd: p.businessLine === "C&D",
      isOngoing: p.status === "Ongoing",
      serviceModel: p.serviceModel,
    });
  }
  return pins;
}

export function FootprintMap({ projects }: Props) {
  const pins = useMemo(() => buildPins(projects), [projects]);
  const [hovered, setHovered] = useState<Pin | null>(null);

  const cities = new Set(pins.map((p) => p.city).filter(Boolean));
  const states = new Set(pins.map((p) => p.state).filter(Boolean));
  const stateBreakdown = Array.from(
    pins.reduce((m, p) => {
      const s = p.state || "—";
      m.set(s, (m.get(s) ?? 0) + 1);
      return m;
    }, new Map<string, number>()),
  ).sort((a, b) => b[1] - a[1]);

  return (
    <section className="bg-mist pad-section">
      <div className="container-x">
        {/* Head */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="mb-[22px] flex items-center gap-3">
              <span className="font-mono text-[0.72rem] font-bold uppercase tracking-[0.18em] text-tx-faint">
                Geographic footprint
              </span>
            </div>
            <h2 className="text-h1 text-ink">Plants &amp; operations across India.</h2>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.06em] text-tx-soft">
              <span className="inline-block h-[11px] w-[11px] rounded-full bg-st-ongoing" />
              Ongoing
            </span>
            <span className="inline-flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.06em] text-tx-soft">
              <span className="inline-block h-[11px] w-[11px] rounded-full bg-st-done" />
              Completed
            </span>
            <span className="h-4 w-px bg-line" />
            <span className="inline-flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.06em] text-tx-soft">
              <span className="inline-block h-[11px] w-[11px] rounded-full border-[1.5px] border-tx-soft" />
              C&amp;D plant
            </span>
            <span className="inline-flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.06em] text-tx-soft">
              <span
                className="inline-block h-[11px] w-[11px] rounded-[1px] border-[1.5px] border-tx-soft"
                style={{ transform: "rotate(45deg)" }}
              />
              SWM site
            </span>
          </div>
        </div>

        <div className="mt-[clamp(26px,3vw,40px)] grid grid-cols-1 gap-[clamp(20px,2.5vw,34px)] lg:grid-cols-[1fr_240px]">
          {/* Map */}
          <div
            className="relative overflow-hidden rounded-lg border border-line"
            style={{
              background:
                "radial-gradient(circle at 1px 1px, rgba(32,37,31,.09) 1px, transparent 0) 0 0/22px 22px, var(--card)",
              minHeight: 520,
            }}
          >
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 1050, center: [82, 22] }}
              width={780}
              height={620}
              style={{ width: "100%", height: "auto" }}
            >
              <Geographies geography={INDIA_GEO}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      style={{
                        default: {
                          fill: "var(--mist)",
                          stroke: "rgba(32,37,31,.32)",
                          strokeWidth: 1,
                          strokeLinejoin: "round",
                          outline: "none",
                        },
                        hover: {
                          fill: "var(--mist)",
                          stroke: "rgba(32,37,31,.32)",
                          strokeWidth: 1,
                          outline: "none",
                        },
                        pressed: { fill: "var(--mist)", outline: "none" },
                      }}
                    />
                  ))
                }
              </Geographies>

              {pins.map((pin) => {
                const fill = pin.isCnd ? "#c56a45" : "#3c7a4a";
                const isActive = hovered?.id === pin.id;
                return (
                  <Marker
                    key={pin.id}
                    coordinates={[pin.lng, pin.lat]}
                    onMouseEnter={() => setHovered(pin)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {pin.isOngoing && (
                      <circle
                        r={6}
                        fill="none"
                        stroke={fill}
                        strokeWidth={1.3}
                        style={{
                          transformBox: "fill-box",
                          transformOrigin: "center",
                          animation:
                            "ping-map 2.6s cubic-bezier(0,0,.2,1) infinite",
                          pointerEvents: "none",
                        }}
                      />
                    )}
                    <circle
                      r={isActive ? 7 : 5}
                      fill={fill}
                      stroke="#20251f"
                      strokeWidth={1.3}
                      style={{ cursor: "pointer", transition: "r .15s ease" }}
                    />
                  </Marker>
                );
              })}
            </ComposableMap>

            {/* Tooltip — fixed top-left of map area */}
            {hovered && (
              <div
                className="pointer-events-none absolute left-5 top-5 z-10 rounded-md px-3 py-2.5 text-white"
                style={{
                  background: "var(--ink)",
                  boxShadow: "0 12px 30px -14px rgba(0,0,0,.55)",
                }}
              >
                <div className="text-[0.9rem] font-bold">{hovered.name}</div>
                <div className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.06em] text-tx-dim">
                  {hovered.isOngoing ? "Ongoing" : "Completed"} ·{" "}
                  {hovered.isCnd ? "C&D" : "SWM"}
                  {hovered.serviceModel ? ` · ${hovered.serviceModel}` : ""}
                </div>
                {hovered.capacity && (
                  <div
                    className="mt-0.5 font-mono font-bold"
                    style={{ color: hovered.isCnd ? "#e0a183" : "#8fbf9c" }}
                  >
                    {hovered.capacity}
                  </div>
                )}
              </div>
            )}

            {/* Readout — bottom-left */}
            <div
              className="absolute bottom-5 left-5 z-[4] flex gap-[22px] rounded-md border border-ink px-5 py-3.5 backdrop-blur-sm"
              style={{ background: "rgba(251,248,242,.95)" }}
            >
              <div>
                <div className="text-[1.7rem] font-extrabold leading-none tracking-[-0.03em] tabular-nums text-ink">
                  {cities.size}
                </div>
                <div className="mt-[5px] font-mono text-[0.62rem] uppercase tracking-[0.1em] text-tx-faint">
                  Cities
                </div>
              </div>
              <div>
                <div className="text-[1.7rem] font-extrabold leading-none tracking-[-0.03em] tabular-nums text-ink">
                  {states.size}
                </div>
                <div className="mt-[5px] font-mono text-[0.62rem] uppercase tracking-[0.1em] text-tx-faint">
                  States
                </div>
              </div>
              <div>
                <div className="text-[1.7rem] font-extrabold leading-none tracking-[-0.03em] tabular-nums text-ink">
                  {pins.length}
                </div>
                <div className="mt-[5px] font-mono text-[0.62rem] uppercase tracking-[0.1em] text-tx-faint">
                  Projects
                </div>
              </div>
            </div>
          </div>

          {/* Rail */}
          <aside className="rounded-lg border border-line bg-card p-[clamp(18px,2vw,26px)]">
            <p className="font-mono text-[0.72rem] font-bold uppercase tracking-[0.18em] text-terra-700">
              By state
            </p>
            <ul className="mt-3.5">
              {stateBreakdown.map(([state, count], idx) => (
                <li
                  key={state}
                  className={`flex items-baseline justify-between gap-3 py-3 text-[0.92rem] text-ink ${
                    idx > 0 ? "border-t border-line" : ""
                  }`}
                >
                  <span className="whitespace-nowrap">{state}</span>
                  <span className="font-mono text-[0.82rem] text-tx-faint tabular-nums">
                    {count}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-[18px] text-[0.9375rem] text-tx-faint">
              Hover a pin for project detail. Full list in the portfolio.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
