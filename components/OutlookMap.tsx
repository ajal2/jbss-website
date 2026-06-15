"use client";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";

// India-recognized state boundaries — includes PoK + Aksai Chin as part of
// India, full extent of Arunachal Pradesh. NEVER replace with world-atlas /
// OSM. Same source the homepage FootprintMap uses.
const INDIA_GEO = "/india-states.geojson";

// Palette echoes the homepage map: warm paper land, ink-tinted borders, green
// accent for the operating footprint.
const LAND = "#e3dccb"; // national mandate — all of India
const FOOTPRINT = "#3C7A4A"; // states JBSS actually operates in (var(--green))
const BORDER = "rgba(32,37,31,.22)";

type Props = {
  /** State names where JBSS operates, matched against geojson ST_NM. */
  footprintStates: string[];
};

/**
 * Static, decorative India map for the /outlook hero. Two honest layers:
 * the whole country shaded as the national waste mandate, and JBSS's real
 * operating-footprint states accented on top. No zoom / pins / inset — this
 * is a silhouette, not the interactive homepage map.
 */
export function OutlookMap({ footprintStates }: Props) {
  const footprint = new Set(footprintStates);
  const count = footprint.size;
  const footprintLabel =
    count > 0 ? `JBSS operating in ${count} state${count === 1 ? "" : "s"}` : "JBSS footprint";

  return (
    <figure className="lede-map">
      <div
        className="lede-map-plate"
        role="img"
        aria-label={`Map of India under a nationwide waste mandate${
          count > 0 ? `, with the ${count} state${count === 1 ? "" : "s"} JBSS operates in highlighted` : ""
        }.`}
      >
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 640, center: [81, 23] }}
          width={460}
          height={520}
          style={{ width: "100%", height: "auto" }}
        >
          <defs>
            <filter id="outlook-land-shadow" x="-15%" y="-15%" width="130%" height="135%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#20251F" floodOpacity="0.18" />
            </filter>
          </defs>

          <g filter="url(#outlook-land-shadow)">
            <Geographies geography={INDIA_GEO}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const hit = footprint.has(geo.properties.ST_NM);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      style={{
                        default: {
                          fill: hit ? FOOTPRINT : LAND,
                          fillOpacity: hit ? 0.9 : 1,
                          stroke: BORDER,
                          strokeWidth: 0.6,
                          strokeLinejoin: "round",
                          outline: "none",
                        },
                        hover: {
                          fill: hit ? FOOTPRINT : LAND,
                          fillOpacity: hit ? 0.9 : 1,
                          stroke: BORDER,
                          strokeWidth: 0.6,
                          strokeLinejoin: "round",
                          outline: "none",
                        },
                        pressed: {
                          fill: hit ? FOOTPRINT : LAND,
                          stroke: BORDER,
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </g>
        </ComposableMap>
      </div>

      <figcaption className="lede-map-key">
        <span className="lmk">
          <i className="lmk-sw" style={{ background: LAND }} />
          Nationwide mandate
        </span>
        <span className="lmk">
          <i className="lmk-sw" style={{ background: FOOTPRINT }} />
          {footprintLabel}
        </span>
      </figcaption>
    </figure>
  );
}
