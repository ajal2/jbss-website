"use client";

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { useState } from "react";
import type { Project } from "@/lib/cms";

// India-recognized state boundaries — includes PoK + Aksai Chin as part of
// India, full extent of Arunachal Pradesh. ~1MB, ~250KB gzipped.
// Source: github.com/jbrobst (gist 56c13bbbf9d97d187fea01ca62ea5112)
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
};

// Derive a clean state name from the City place string. Handles three address
// patterns we see in Notion:
//   "Bareilly, Uttar Pradesh, India"     -> "Uttar Pradesh"  (state is parts[-2])
//   "Bidar, Karnataka, India"            -> "Karnataka"      (state is parts[-2])
//   "IIT Delhi, Hauz Khas, New Delhi"    -> "Delhi"          (state is parts[-1], "Hauz Khas" is a neighborhood)
// Rule: take last segment; if it's "India", fall back to second-to-last.
// Then normalise "New Delhi" -> "Delhi" so DDA and IIT bucket together.
function deriveState(cityName?: string): string | undefined {
  if (!cityName) return undefined;
  const parts = cityName
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length === 0) return undefined;
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
    const cityName = p.city?.name?.split(",")[0]?.trim();
    const stateName = deriveState(p.city?.name);
    pins.push({
      id: p.id,
      name: p.displayName || p.projectName,
      capacity: p.capacityHeadline,
      city: cityName,
      state: stateName,
      lat,
      lng,
      isCnd: p.businessLine === "C&D",
      isOngoing: p.status === "Ongoing",
    });
  }
  return pins;
}

// Delhi / NCR bounding box — anything within these bounds gets the inset
// treatment. Covers Delhi UT + immediate Haryana/UP fringe.
const DELHI_BBOX = {
  latMin: 28.3,
  latMax: 29.0,
  lngMin: 76.5,
  lngMax: 77.6,
};

function isDelhiPin(p: Pin): boolean {
  return (
    p.lat >= DELHI_BBOX.latMin &&
    p.lat <= DELHI_BBOX.latMax &&
    p.lng >= DELHI_BBOX.lngMin &&
    p.lng <= DELHI_BBOX.lngMax
  );
}

export function IndiaMap({ projects }: Props) {
  const pins = buildPins(projects);
  const delhiPins = pins.filter(isDelhiPin);
  const showInset = delhiPins.length >= 2;
  const [hovered, setHovered] = useState<Pin | null>(null);

  const cityCount = new Set(pins.map((p) => p.city).filter(Boolean)).size;
  const stateCount = new Set(pins.map((p) => p.state).filter(Boolean)).size;
  const ongoingCount = pins.filter((p) => p.isOngoing).length;

  // State breakdown for the right-rail data display
  const stateBreakdown = Array.from(
    pins.reduce((map, p) => {
      const state = p.state || "—";
      map.set(state, (map.get(state) ?? 0) + 1);
      return map;
    }, new Map<string, number>()),
  ).sort((a, b) => b[1] - a[1]);

  return (
    <section className="border-y border-charcoal/10 bg-offwhite">
      <div className="relative mx-auto max-w-7xl px-6 py-14 md:py-16">
        {/* Editorial spine — brand-green rule anchors the section */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-[3px] bg-brand-green"
        />
        {/* Header — eyebrow + headline only, no paragraph for compactness */}
        <header className="mb-6 flex flex-col gap-y-3 md:mb-8 md:flex-row md:items-end md:justify-between md:gap-x-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-brand-green">
              Geographic footprint
            </p>
            <h2 className="mt-4 text-balance text-3xl font-medium leading-[1.05] tracking-tight text-charcoal md:text-4xl">
              {cityCount} {cityCount === 1 ? "city" : "cities"}.{" "}
              {stateCount} {stateCount === 1 ? "state" : "states"}.
            </h2>
          </div>
          {/* Inline summary stats — industrial atlas convention */}
          <dl className="flex shrink-0 items-baseline gap-x-6 text-[11px] font-medium uppercase tracking-[0.16em] text-steel md:gap-x-8">
            <div>
              <dt className="sr-only">Sites</dt>
              <dd>
                <span className="text-base font-medium tabular-nums text-charcoal md:text-lg">
                  {pins.length}
                </span>{" "}
                sites
              </dd>
            </div>
            <div>
              <dt className="sr-only">Ongoing</dt>
              <dd>
                <span className="text-base font-medium tabular-nums text-charcoal md:text-lg">
                  {ongoingCount}
                </span>{" "}
                ongoing
              </dd>
            </div>
          </dl>
        </header>

        {/* Legend strip — horizontal, immediately below the header so it's
            visible the moment the section enters the viewport */}
        <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-charcoal/15 py-3 text-[12px] text-charcoal md:mb-10">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-brand-green" />
            Solid Waste Management
          </span>
          <span className="text-charcoal/25">·</span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-highlight" />
            Construction &amp; Demolition
          </span>
          <span className="text-charcoal/25">·</span>
          <span className="inline-flex items-center gap-2 text-steel">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-brand-green opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-green" />
            </span>
            Pulsing = currently operational
          </span>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px] lg:gap-16">
          {/* Map */}
          <div className="relative">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 1050, center: [82, 22] }}
              width={620}
              height={540}
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
                          fill: "#EFEEE8",
                          stroke: "#1A1F1A",
                          strokeWidth: 0.4,
                          strokeOpacity: 0.4,
                          outline: "none",
                        },
                        hover: {
                          fill: "#EFEEE8",
                          stroke: "#1A1F1A",
                          strokeWidth: 0.4,
                          strokeOpacity: 0.4,
                          outline: "none",
                        },
                        pressed: { fill: "#EFEEE8", outline: "none" },
                      }}
                    />
                  ))
                }
              </Geographies>

              {pins.map((pin) => {
                const fill = pin.isCnd ? "#F59E0B" : "#5BAE3C";
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
                        r={14}
                        fill={fill}
                        opacity={0.3}
                        className="animate-ping-slow"
                      />
                    )}
                    <circle
                      r={isActive ? 9 : 7}
                      fill={fill}
                      stroke="#1A1F1A"
                      strokeWidth={1.5}
                      style={{ cursor: "pointer", transition: "r 180ms ease-out" }}
                    />
                    {isActive && (
                      <g
                        transform="translate(13, 4)"
                        style={{ pointerEvents: "none" }}
                      >
                        {/* Offwhite halo via paintOrder=stroke keeps text readable
                            over any map fill without a box or shadow */}
                        <text
                          x={0}
                          y={0}
                          paintOrder="stroke"
                          stroke="#F8F8F4"
                          strokeWidth={3}
                          strokeLinejoin="round"
                          fill="#1A1F1A"
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                          }}
                        >
                          {pin.name}
                        </text>
                        {pin.capacity && (
                          <text
                            x={0}
                            y={13}
                            paintOrder="stroke"
                            stroke="#F8F8F4"
                            strokeWidth={3}
                            strokeLinejoin="round"
                            fill={pin.isCnd ? "#F59E0B" : "#5BAE3C"}
                            style={{
                              fontSize: 10.5,
                              fontWeight: 500,
                              fontVariantNumeric: "tabular-nums",
                            }}
                          >
                            {pin.capacity}
                          </text>
                        )}
                      </g>
                    )}
                  </Marker>
                );
              })}
            </ComposableMap>

            {/* Atlas title block — small typographic plate at the corner,
                gives the map an editorial/industrial signature */}
            <div className="pointer-events-none absolute bottom-2 right-2 text-right text-[10px] uppercase leading-[1.4] tracking-[0.18em] text-steel md:bottom-3 md:right-3">
              <p className="font-medium text-charcoal">India · 2016—Present</p>
              <p>Scale ~1:15M · {pins.length} sites</p>
            </div>
          </div>

          {/* Inset + Legend + summary list */}
          <div className="flex flex-col gap-8 lg:pt-4">
            {showInset && (
              <div>
                <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.22em] text-steel">
                  Delhi · NCR enlarged
                </p>
                <div className="relative aspect-square border border-charcoal/20 bg-offwhite">
                  {/* Brand-green corner mark — small accent that frames the inset */}
                  <div
                    aria-hidden
                    className="absolute -left-px -top-px h-3 w-3 bg-brand-green"
                  />
                  <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{ scale: 12000, center: [77.1, 28.6] }}
                    width={300}
                    height={300}
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
                                fill: "#EFEEE8",
                                stroke: "#1A1F1A",
                                strokeWidth: 0.5,
                                strokeOpacity: 0.4,
                                outline: "none",
                              },
                              hover: {
                                fill: "#EFEEE8",
                                stroke: "#1A1F1A",
                                strokeWidth: 0.5,
                                strokeOpacity: 0.4,
                                outline: "none",
                              },
                              pressed: { fill: "#EFEEE8", outline: "none" },
                            }}
                          />
                        ))
                      }
                    </Geographies>

                    {delhiPins.map((pin) => {
                      const fill = pin.isCnd ? "#F59E0B" : "#5BAE3C";
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
                              r={9}
                              fill={fill}
                              opacity={0.3}
                              className="animate-ping-slow"
                            />
                          )}
                          <circle
                            r={isActive ? 6 : 5}
                            fill={fill}
                            stroke="#1A1F1A"
                            strokeWidth={1.2}
                            style={{
                              cursor: "pointer",
                              transition: "r 180ms ease-out",
                            }}
                          />
                          {/* Persistent label */}
                          <text
                            x={8}
                            y={3}
                            paintOrder="stroke"
                            stroke="#F8F8F4"
                            strokeWidth={2.5}
                            strokeLinejoin="round"
                            fill={isActive ? "#1A1F1A" : "#1A1F1A"}
                            style={{
                              fontSize: 9,
                              fontWeight: 600,
                              letterSpacing: "0.04em",
                              textTransform: "uppercase",
                              pointerEvents: "none",
                            }}
                          >
                            {pin.name}
                          </text>
                        </Marker>
                      );
                    })}
                  </ComposableMap>
                </div>
                <p className="mt-2 text-[10px] uppercase tracking-wide text-steel">
                  {delhiPins.length} sites — scale ~1:500,000
                </p>
              </div>
            )}

            {/* State breakdown — small typographic data display */}
            <div>
              <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-steel">
                By state
              </p>
              <ul className="divide-y divide-charcoal/10 text-sm">
                {stateBreakdown.map(([state, count]) => (
                  <li
                    key={state}
                    className="flex items-baseline justify-between gap-3 py-2.5"
                  >
                    <span className="text-charcoal">{state}</span>
                    <span className="shrink-0 text-xs tabular-nums text-steel">
                      {count} {count === 1 ? "site" : "sites"}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[11px] leading-relaxed text-steel">
                Full project detail in the Portfolio section below.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
