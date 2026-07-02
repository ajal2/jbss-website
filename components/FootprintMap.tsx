"use client";

import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { useMemo, useState } from "react";
import type { Project } from "@/lib/cms";
import { deriveStateName } from "@/lib/location";

// India-recognized state boundaries — includes PoK + Aksai Chin as part of
// India, full extent of Arunachal Pradesh. NEVER replace with world-atlas /
// OSM. The handoff CLAUDE.md is explicit about this.
const INDIA_GEO = "/india-states.geojson";

// Delhi / NCR bounding box — pins inside this box also appear on the inset.
const DELHI_BBOX = {
  latMin: 28.2,
  latMax: 29.05,
  lngMin: 76.5,
  lngMax: 77.65,
};
const DELHI_CENTER: [number, number] = [77.1, 28.62];

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
      state: deriveStateName(p.city?.name),
      lat,
      lng,
      isCnd: p.businessLine === "C&D",
      isOngoing: p.status === "Ongoing",
      serviceModel: p.serviceModel,
    });
  }
  return pins;
}

function isDelhiPin(p: Pin): boolean {
  return (
    p.lat >= DELHI_BBOX.latMin &&
    p.lat <= DELHI_BBOX.latMax &&
    p.lng >= DELHI_BBOX.lngMin &&
    p.lng <= DELHI_BBOX.lngMax
  );
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 6;
const ZOOM_STEP = 1.5;

export function FootprintMap({ projects }: Props) {
  const pins = useMemo(() => buildPins(projects), [projects]);
  const [hovered, setHovered] = useState<Pin | null>(null);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([82, 22]);

  const cities = new Set(pins.map((p) => p.city).filter(Boolean));
  const states = new Set(pins.map((p) => p.state).filter(Boolean));
  const stateBreakdown = Array.from(
    pins.reduce((m, p) => {
      const s = p.state || "—";
      m.set(s, (m.get(s) ?? 0) + 1);
      return m;
    }, new Map<string, number>()),
  ).sort((a, b) => b[1] - a[1]);

  const delhiPins = pins.filter(isDelhiPin);

  // Pin radius compensates for zoom so pins stay visually consistent
  const pinR = (base: number) => base / Math.sqrt(zoom);
  const strokeW = (base: number) => base / Math.sqrt(zoom);

  const zoomIn = () =>
    setZoom((z) => Math.min(MAX_ZOOM, z * ZOOM_STEP));
  const zoomOut = () => setZoom((z) => Math.max(MIN_ZOOM, z / ZOOM_STEP));
  const zoomReset = () => {
    setZoom(1);
    setCenter([82, 22]);
  };
  const zoomToDelhi = () => {
    setZoom(4);
    setCenter(DELHI_CENTER);
  };

  return (
    <section className="bg-mist pad-section">
      <div className="container-x">
        {/* Head */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="mb-[22px] flex items-center gap-3">
              <span className="text-[0.8rem] font-semibold text-tx-faint">
                Geographic footprint
              </span>
            </div>
            <h2 className="text-h1 text-ink">
              Plants &amp; operations across India.
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="inline-flex items-center gap-2 text-[0.72rem] font-medium text-tx-soft">
              <span className="inline-block h-2 w-2 rounded-full bg-green" />
              SWM
            </span>
            <span className="inline-flex items-center gap-2 text-[0.72rem] font-medium text-tx-soft">
              <span className="inline-block h-2 w-2 rounded-full bg-terra" />
              C&amp;D
            </span>
            <span className="h-3.5 w-px bg-line" />
            <span className="inline-flex items-center gap-2 text-[0.72rem] font-medium text-tx-soft">
              <span className="relative inline-flex h-2 w-2">
                <span
                  aria-hidden
                  className="absolute -inset-1 rounded-full border-[1.5px] opacity-50"
                  style={{
                    borderColor: "var(--green)",
                    animation:
                      "ping-status 2.4s cubic-bezier(0,0,.2,1) infinite",
                  }}
                />
                <span className="relative inline-block h-2 w-2 rounded-full bg-green" />
              </span>
              Ongoing
            </span>
            <span className="inline-flex items-center gap-2 text-[0.72rem] font-medium text-tx-soft">
              <span className="inline-block h-2 w-2 rounded-full bg-st-done" />
              Completed
            </span>
          </div>
        </div>

        <div className="mt-[clamp(22px,2.5vw,34px)] grid grid-cols-1 gap-[clamp(20px,2.5vw,36px)] lg:grid-cols-[1fr_260px]">
          {/* Main map stage */}
          <div
            className="relative overflow-hidden rounded-xl"
            style={{
              background:
                "radial-gradient(120% 90% at 30% 8%, rgba(60,122,74,.05) 0%, transparent 55%), radial-gradient(circle at 1px 1px, rgba(32,37,31,.05) 1px, transparent 0) 0 0/28px 28px, var(--paper)",
              minHeight: 520,
              borderTop: "1px solid var(--line)",
              borderBottom: "1px solid var(--line)",
            }}
          >
            {/* Zoom controls — top-right */}
            <div className="absolute right-5 top-5 z-10 flex flex-col gap-1.5">
              <ZoomButton onClick={zoomIn} label="Zoom in" disabled={zoom >= MAX_ZOOM}>
                +
              </ZoomButton>
              <ZoomButton onClick={zoomOut} label="Zoom out" disabled={zoom <= MIN_ZOOM}>
                −
              </ZoomButton>
              <ZoomButton onClick={zoomReset} label="Reset zoom" disabled={zoom === 1}>
                ⊙
              </ZoomButton>
            </div>

            {/* Drag hint at first load */}
            {zoom > 1 && (
              <div className="absolute bottom-5 left-5 z-10 text-[0.6rem] font-medium text-tx-faint">
                Drag to pan · Scroll to zoom
              </div>
            )}

            {/* Atlas registration furniture — corner ticks frame the plate */}
            <div aria-hidden className="pointer-events-none absolute inset-0 z-[2]">
              <span className="absolute left-4 top-4 h-3.5 w-3.5 border-l border-t border-tx-faint/40" />
              <span className="absolute right-4 top-4 h-3.5 w-3.5 border-r border-t border-tx-faint/40" />
              <span className="absolute bottom-4 left-4 h-3.5 w-3.5 border-b border-l border-tx-faint/40" />
              <span className="absolute bottom-4 right-4 h-3.5 w-3.5 border-b border-r border-tx-faint/40" />
            </div>

            {/* Projection / datum caption — doubles as the India-aligned
                credibility signal; swaps out for the drag hint when zoomed */}
            {zoom === 1 && (
              <div className="pointer-events-none absolute bottom-5 left-5 z-[4] text-[0.58rem] font-medium leading-[1.6] text-tx-faint">
                <div>geoMercator</div>
                <div className="opacity-70">India-aligned datum</div>
              </div>
            )}

            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 1050, center: [82, 22] }}
              width={780}
              height={620}
              style={{ width: "100%", height: "auto" }}
            >
              <defs>
                <filter id="pin-glow-green" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2.2" result="blur" />
                  <feFlood floodColor="#3C7A4A" floodOpacity="0.55" />
                  <feComposite in2="blur" operator="in" />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="pin-glow-terra" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2.2" result="blur" />
                  <feFlood floodColor="#C56A45" floodOpacity="0.55" />
                  <feComposite in2="blur" operator="in" />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                {/* Lifts the landmass off the paper — shadow of the outer
                    silhouette only, since adjacent state fills form one
                    contiguous alpha region. */}
                <filter id="land-shadow" x="-15%" y="-15%" width="130%" height="135%">
                  <feDropShadow
                    dx="0"
                    dy="4"
                    stdDeviation="6"
                    floodColor="#20251F"
                    floodOpacity="0.2"
                  />
                </filter>
              </defs>

              <ZoomableGroup
                center={center}
                zoom={zoom}
                minZoom={MIN_ZOOM}
                maxZoom={MAX_ZOOM}
                onMoveEnd={({ coordinates, zoom: z }) => {
                  setCenter(coordinates as [number, number]);
                  setZoom(z);
                }}
              >
                {/* Surveyed lat/long grid behind the plate */}
                <Graticule
                  stroke="rgba(32,37,31,.085)"
                  strokeWidth={0.4 / Math.sqrt(zoom)}
                  step={[5, 5]}
                />

                <g filter="url(#land-shadow)">
                  <Geographies geography={INDIA_GEO}>
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          style={{
                            default: {
                              fill: "#e3dccb",
                              stroke: "rgba(32,37,31,.22)",
                              strokeWidth: 0.7 / Math.sqrt(zoom),
                              strokeLinejoin: "round",
                              outline: "none",
                            },
                            hover: {
                              fill: "#e3dccb",
                              stroke: "rgba(32,37,31,.22)",
                              strokeWidth: 0.7 / Math.sqrt(zoom),
                              outline: "none",
                            },
                            pressed: { fill: "#e3dccb", outline: "none" },
                          }}
                        />
                      ))
                    }
                  </Geographies>
                </g>

                {/* Project pins */}
                {pins.map((pin) => {
                  const color = pin.isCnd ? "#C56A45" : "#3C7A4A";
                  const isActive = hovered?.id === pin.id;
                  const glowId = pin.isCnd
                    ? "pin-glow-terra"
                    : "pin-glow-green";
                  return (
                    <Marker
                      key={pin.id}
                      coordinates={[pin.lng, pin.lat]}
                      onMouseEnter={() => setHovered(pin)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <g style={{ cursor: "pointer" }}>
                        {pin.isOngoing && (
                          <>
                            <circle
                              r={pinR(11)}
                              fill="none"
                              stroke={color}
                              strokeWidth={strokeW(1)}
                              opacity={0.55}
                              style={{
                                transformBox: "fill-box",
                                transformOrigin: "center",
                                animation:
                                  "ping-map 2.6s cubic-bezier(0,0,.2,1) infinite",
                                pointerEvents: "none",
                              }}
                            />
                            <circle
                              r={pinR(11)}
                              fill="none"
                              stroke={color}
                              strokeWidth={strokeW(1)}
                              opacity={0.4}
                              style={{
                                transformBox: "fill-box",
                                transformOrigin: "center",
                                animation:
                                  "ping-map 2.6s cubic-bezier(0,0,.2,1) infinite",
                                animationDelay: "1s",
                                pointerEvents: "none",
                              }}
                            />
                          </>
                        )}
                        <circle
                          r={pinR(isActive ? 7.5 : 5.5)}
                          fill={color}
                          stroke="var(--paper)"
                          strokeWidth={strokeW(1.6)}
                          filter={`url(#${glowId})`}
                          style={{ transition: "r .18s ease" }}
                        />
                      </g>
                    </Marker>
                  );
                })}
              </ZoomableGroup>
            </ComposableMap>

            {/* Tooltip */}
            {hovered && (
              <div
                className="pointer-events-none absolute z-20 max-w-[280px] rounded-md border px-3.5 py-3 backdrop-blur-md"
                style={{
                  left: "20px",
                  bottom: zoom > 1 ? "44px" : "20px",
                  background: "rgba(32, 37, 31, 0.92)",
                  borderColor: "rgba(255,255,255,0.08)",
                  boxShadow:
                    "0 16px 40px -18px rgba(32,37,31,.6), 0 0 0 1px rgba(255,255,255,0.04) inset",
                  color: "#fff",
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: hovered.isCnd ? "#E0A183" : "#8FBF9C" }}
                  />
                  <span className="text-[0.6rem] font-medium text-tx-dim">
                    {hovered.isCnd ? "C&D plant" : "SWM site"}
                  </span>
                </div>
                <div className="mt-1.5 text-[0.9rem] font-bold leading-tight">
                  {hovered.name}
                </div>
                <div className="mt-1 text-[0.62rem] font-medium text-tx-dim">
                  {hovered.city}
                  {hovered.state ? ` · ${hovered.state}` : ""}
                  {" · "}
                  {hovered.isOngoing ? "Ongoing" : "Completed"}
                </div>
                {hovered.capacity && (
                  <div
                    className="mt-2 border-t border-white/10 pt-2 font-mono text-[0.78rem] font-bold tabular-nums"
                    style={{ color: hovered.isCnd ? "#E0A183" : "#8FBF9C" }}
                  >
                    {hovered.capacity}
                  </div>
                )}
              </div>
            )}

            {/* Readout */}
            <div className="absolute bottom-5 right-5 z-[4] flex gap-7 font-mono">
              <ReadoutFig n={cities.size} label="Cities" />
              <ReadoutFig n={states.size} label="States" />
              <ReadoutFig n={pins.length} label="Sites" />
            </div>
          </div>

          {/* Rail: Delhi inset + by-state list */}
          <aside className="flex flex-col gap-7 lg:pl-2">
            {/* Delhi inset */}
            {delhiPins.length > 0 && (
              <div>
                <div className="mb-3 flex items-baseline justify-between gap-3">
                  <p className="text-[0.7rem] font-semibold text-ink">
                    Delhi NCR
                  </p>
                  <button
                    type="button"
                    onClick={zoomToDelhi}
                    className="text-[0.6rem] font-medium text-tx-faint underline-offset-2 hover:text-terra-700 hover:underline"
                  >
                    Focus →
                  </button>
                </div>
                <div
                  className="relative aspect-square overflow-hidden rounded-md border border-line"
                  style={{
                    background:
                      "radial-gradient(circle at 1px 1px, rgba(32,37,31,.05) 1px, transparent 0) 0 0/16px 16px, var(--paper)",
                  }}
                >
                  <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{
                      scale: 11000,
                      center: DELHI_CENTER,
                    }}
                    width={260}
                    height={260}
                    style={{ width: "100%", height: "auto" }}
                  >
                    <defs>
                      <filter
                        id="land-shadow-inset"
                        x="-15%"
                        y="-15%"
                        width="130%"
                        height="135%"
                      >
                        <feDropShadow
                          dx="0"
                          dy="2"
                          stdDeviation="3"
                          floodColor="#20251F"
                          floodOpacity="0.14"
                        />
                      </filter>
                    </defs>

                    <Graticule
                      stroke="rgba(32,37,31,.06)"
                      strokeWidth={0.4}
                      step={[0.5, 0.5]}
                    />

                    <g filter="url(#land-shadow-inset)">
                      <Geographies geography={INDIA_GEO}>
                        {({ geographies }) =>
                          geographies.map((geo) => (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              style={{
                                default: {
                                  fill: "#e3dccb",
                                  stroke: "rgba(32,37,31,.24)",
                                  strokeWidth: 0.5,
                                  strokeLinejoin: "round",
                                  outline: "none",
                                },
                                hover: {
                                  fill: "#e3dccb",
                                  stroke: "rgba(32,37,31,.24)",
                                  strokeWidth: 0.5,
                                  outline: "none",
                                },
                                pressed: {
                                  fill: "#e3dccb",
                                  outline: "none",
                                },
                              }}
                            />
                          ))
                        }
                      </Geographies>
                    </g>

                    {/* Delhi pins with persistent labels.
                        Label rule: city if specific; project name if city is
                        the generic "Delhi" / "New Delhi" (e.g., DDA Parks
                        Portfolio, which operates across NCT). */}
                    {delhiPins.map((pin) => {
                      const color = pin.isCnd ? "#C56A45" : "#3C7A4A";
                      const isActive = hovered?.id === pin.id;
                      const isGenericCity =
                        pin.city === "New Delhi" || pin.city === "Delhi";
                      const rawLabel = isGenericCity ? pin.name : pin.city || pin.name;
                      // Keep labels readable at the inset size
                      const label =
                        rawLabel.length > 18
                          ? rawLabel.slice(0, 16) + "…"
                          : rawLabel;
                      return (
                        <Marker
                          key={`delhi-${pin.id}`}
                          coordinates={[pin.lng, pin.lat]}
                          onMouseEnter={() => setHovered(pin)}
                          onMouseLeave={() => setHovered(null)}
                        >
                          <g style={{ cursor: "pointer" }}>
                            {pin.isOngoing && (
                              <circle
                                r={6}
                                fill="none"
                                stroke={color}
                                strokeWidth={0.8}
                                opacity={0.5}
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
                              r={isActive ? 4 : 3}
                              fill={color}
                              stroke="var(--paper)"
                              strokeWidth={1}
                              style={{ transition: "r .18s ease" }}
                            />
                          </g>
                          <text
                            x={6}
                            y={3}
                            style={{
                              fontFamily:
                                "var(--font-archivo), sans-serif",
                              fontSize: 8,
                              fontWeight: 600,
                              fill: "#20251F",
                              paintOrder: "stroke",
                              stroke: "var(--paper)",
                              strokeWidth: 2.5,
                              strokeLinejoin: "round",
                              pointerEvents: "none",
                            }}
                          >
                            {label}
                          </text>
                        </Marker>
                      );
                    })}
                  </ComposableMap>
                </div>
                <p className="mt-2 text-[0.6rem] font-medium text-tx-faint">
                  {delhiPins.length} {delhiPins.length === 1 ? "site" : "sites"} · 1:500K
                </p>
              </div>
            )}

            {/* By state */}
            <div>
              <p className="mb-3 text-[0.7rem] font-semibold text-terra-700">
                By state
              </p>
              <ul>
                {stateBreakdown.map(([state, count], idx) => (
                  <li
                    key={state}
                    className={`flex items-baseline justify-between gap-3 py-[10px] text-[0.92rem] text-ink ${
                      idx > 0 ? "border-t border-line/80" : ""
                    }`}
                  >
                    <span className="truncate">{state}</span>
                    <span className="font-mono text-[0.82rem] text-tx-faint tabular-nums">
                      {String(count).padStart(2, "0")}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[0.85rem] leading-[1.5] text-tx-faint">
                Hover any pin for detail. Drag to pan; scroll to zoom.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function ZoomButton({
  onClick,
  label,
  disabled,
  children,
}: {
  onClick: () => void;
  label: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
      className="grid h-8 w-8 place-items-center rounded-md border border-line bg-card text-[1rem] font-bold text-ink transition-all hover:border-ink hover:bg-paper disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:bg-card"
      style={{
        boxShadow: "0 2px 8px -4px rgba(32,37,31,.15)",
      }}
    >
      {children}
    </button>
  );
}

function ReadoutFig({ n, label }: { n: number; label: string }) {
  return (
    <div className="text-right">
      <div className="text-[1.55rem] font-extrabold leading-none tracking-[-0.03em] tabular-nums text-ink">
        {String(n).padStart(2, "0")}
      </div>
      <div className="mt-1.5 text-[0.58rem] font-medium text-tx-faint">
        {label}
      </div>
    </div>
  );
}
