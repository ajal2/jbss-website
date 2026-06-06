"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/lib/cms";

type Props = {
  projects: Project[];
};

// Internal row shape — pre-derived per project so filter/sort work on flat fields
type Row = {
  id: string;
  name: string;
  line: "C&D" | "SWM" | "—";
  lineKey: "cnd" | "swm" | "other";
  model: string;
  city: string;
  state: string;
  capDisplay: string;
  capNum: number;
  year: number | null;
  status: "Ongoing" | "Completed" | "—";
  statusKey: "ongoing" | "completed" | "other";
  scope: string;
};

function extractYear(s?: string): number | null {
  if (!s) return null;
  const y = new Date(s).getFullYear();
  return Number.isNaN(y) ? null : y;
}

function deriveStateName(cityName?: string): string {
  if (!cityName) return "—";
  const parts = cityName
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  if (!parts.length) return "—";
  const last = parts[parts.length - 1];
  const raw =
    last.toLowerCase() === "india" && parts.length >= 2
      ? parts[parts.length - 2]
      : last;
  return raw === "New Delhi" ? "Delhi" : raw;
}

function buildRows(projects: Project[]): Row[] {
  return projects
    .filter((p) => p.visibleOnWebsite)
    .map((p) => {
      const line = p.businessLine === "C&D" ? "C&D" : p.businessLine === "SWM" ? "SWM" : "—";
      const lineKey: Row["lineKey"] =
        line === "C&D" ? "cnd" : line === "SWM" ? "swm" : "other";
      const status: Row["status"] =
        p.status === "Ongoing" ? "Ongoing" : p.status === "Completed" ? "Completed" : "—";
      const statusKey: Row["statusKey"] =
        status === "Ongoing" ? "ongoing" : status === "Completed" ? "completed" : "other";
      const cityFull = p.city?.name ?? "";
      const cityFirst = cityFull.split(",")[0]?.trim() ?? "—";
      const state = deriveStateName(cityFull);
      const capDisplay = p.capacityHeadline ?? "—";
      // Numeric capacity for sorting:
      //   C&D → TPD (kg/day / 1000)
      //   SWM → subSites (or kg/day fallback)
      const capNum =
        line === "C&D"
          ? Math.round((p.dailyCapacityKgPerDay ?? 0) / 1000)
          : (p.subSites ?? p.dailyCapacityKgPerDay ?? 0);
      return {
        id: p.id,
        name: p.displayName || p.projectName,
        line,
        lineKey,
        model: p.serviceModel ?? "—",
        city: cityFirst,
        state,
        capDisplay,
        capNum,
        year: extractYear(p.dateFrom),
        status,
        statusKey,
        scope:
          p.scopeOfWork ||
          p.tileTagline ||
          "No scope description in Notion. Add 'Scope of Work' on the project record to populate this view.",
      };
    });
}

type SortKey = "name" | "line" | "model" | "city" | "cap" | "status";
type SortDir = "asc" | "desc";

export function ProjectsTable({ projects }: Props) {
  const rows = useMemo(() => buildRows(projects), [projects]);

  const [lineFilter, setLineFilter] = useState<"all" | "cnd" | "swm">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "ongoing" | "completed">("all");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("status");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const r = rows.filter((row) => {
      if (lineFilter !== "all" && row.lineKey !== lineFilter) return false;
      if (statusFilter !== "all" && row.statusKey !== statusFilter) return false;
      if (q) {
        const hay = `${row.name} ${row.city} ${row.state}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    const dir = sortDir === "asc" ? 1 : -1;
    r.sort((a, b) => {
      let av: string | number;
      let bv: string | number;
      if (sortKey === "status") {
        av = a.statusKey === "ongoing" ? 0 : 1;
        bv = b.statusKey === "ongoing" ? 0 : 1;
        if (av === bv) return (b.year ?? 0) - (a.year ?? 0); // recency tiebreak
      } else if (sortKey === "cap") {
        av = a.capNum;
        bv = b.capNum;
      } else {
        av = String(a[sortKey]).toLowerCase();
        bv = String(b[sortKey]).toLowerCase();
      }
      return av < bv ? -1 * dir : av > bv ? 1 * dir : 0;
    });
    return r;
  }, [rows, lineFilter, statusFilter, search, sortKey, sortDir]);

  const onHeaderClick = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const toggleRow = (id: string) => {
    setOpenId((curr) => (curr === id ? null : id));
  };

  const countLabel = `${visible.length} ${visible.length === 1 ? "project" : "projects"}`;

  return (
    <>
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-x-[22px] gap-y-4 border-b-2 border-ink pb-[22px]">
        <FilterGroup
          label="Line"
          value={lineFilter}
          onChange={(v) => setLineFilter(v as typeof lineFilter)}
          options={[
            { value: "all", label: "All" },
            { value: "cnd", label: "C&D" },
            { value: "swm", label: "SWM" },
          ]}
        />
        <FilterGroup
          label="Status"
          value={statusFilter}
          onChange={(v) => setStatusFilter(v as typeof statusFilter)}
          options={[
            { value: "all", label: "All" },
            { value: "ongoing", label: "Ongoing" },
            { value: "completed", label: "Completed" },
          ]}
        />
        <div className="relative ml-auto w-full sm:w-[220px]">
          <span
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tx-faint"
          >
            ⌕
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search project or city…"
            aria-label="Search projects"
            className="w-full rounded-md border border-line bg-white py-2.5 pl-9 pr-3.5 text-[0.9rem] text-ink transition-colors focus:border-green focus:outline-none"
          />
        </div>
      </div>

      {/* Result count */}
      <div className="flex justify-end px-0 pb-1 pt-3.5">
        <span className="font-mono text-[0.72rem] uppercase tracking-[0.06em] text-tx-faint">
          {countLabel}
        </span>
      </div>

      {/* Table (collapses to cards <760px via projects-table.css scope) */}
      <div className="projects-table mt-2">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <HeaderCell sortKey="name" active={sortKey} dir={sortDir} onClick={onHeaderClick}>
                Project
              </HeaderCell>
              <HeaderCell sortKey="line" active={sortKey} dir={sortDir} onClick={onHeaderClick}>
                Line
              </HeaderCell>
              <HeaderCell sortKey="model" active={sortKey} dir={sortDir} onClick={onHeaderClick}>
                Model
              </HeaderCell>
              <HeaderCell sortKey="city" active={sortKey} dir={sortDir} onClick={onHeaderClick}>
                City
              </HeaderCell>
              <HeaderCell
                sortKey="cap"
                active={sortKey}
                dir={sortDir}
                onClick={onHeaderClick}
                numeric
              >
                Capacity
              </HeaderCell>
              <HeaderCell sortKey="status" active={sortKey} dir={sortDir} onClick={onHeaderClick}>
                Status
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-[60px] text-center font-mono text-[0.85rem] uppercase tracking-[0.06em] text-tx-faint"
                >
                  No projects match these filters.
                </td>
              </tr>
            )}
            {visible.map((row) => {
              const isOpen = openId === row.id;
              return (
                <RowAndDrawer
                  key={row.id}
                  row={row}
                  open={isOpen}
                  onToggle={() => toggleRow(row.id)}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-[22px] max-w-[60ch] text-[0.9375rem] text-tx-faint">
        Click any row for project detail. Capacity is shown as TPD for C&amp;D
        plants and operated sites for SWM contracts.
      </p>
    </>
  );
}

// === Sub-components ===

function FilterGroup({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-tx-faint">
        {label}
      </span>
      <div className="inline-flex gap-0.5 rounded-md border border-line bg-mist p-[3px]">
        {options.map((opt) => {
          const pressed = value === opt.value;
          let textClass = "text-tx-soft";
          if (pressed) {
            if (opt.value === "cnd") textClass = "text-terra-700";
            else if (opt.value === "swm") textClass = "text-green-700";
            else textClass = "text-ink";
          }
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={pressed}
              onClick={() => onChange(opt.value)}
              className={`rounded-[4px] px-3.5 py-[7px] text-[0.85rem] font-medium transition-all hover:text-ink ${
                pressed
                  ? `bg-white ${textClass} font-semibold shadow-[0_1px_3px_rgba(32,37,31,.12)]`
                  : textClass
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function HeaderCell({
  sortKey: thisKey,
  active,
  dir,
  onClick,
  children,
  numeric,
}: {
  sortKey: SortKey;
  active: SortKey;
  dir: SortDir;
  onClick: (k: SortKey) => void;
  children: React.ReactNode;
  numeric?: boolean;
}) {
  const isActive = active === thisKey;
  return (
    <th
      onClick={() => onClick(thisKey)}
      aria-sort={
        isActive ? (dir === "asc" ? "ascending" : "descending") : undefined
      }
      className={`cursor-pointer select-none whitespace-nowrap border-b border-line p-[16px_14px] font-mono text-[0.66rem] font-bold uppercase tracking-[0.1em] text-tx-faint ${
        numeric ? "text-right" : "text-left"
      }`}
    >
      {children}
      <span
        className={`ml-1.5 text-[0.8em] ${isActive ? "text-terra-700 opacity-100" : "opacity-30"}`}
      >
        {isActive ? (dir === "asc" ? "↑" : "↓") : "↕"}
      </span>
    </th>
  );
}

function LineChip({ row }: { row: Row }) {
  if (row.lineKey === "cnd") {
    return (
      <span className="inline-flex items-center gap-[7px] font-mono text-[0.72rem] font-bold tracking-[0.04em] text-terra-700">
        <span className="inline-block h-[9px] w-[9px] flex-none rounded-[2px] bg-terra" />
        C&amp;D
      </span>
    );
  }
  if (row.lineKey === "swm") {
    return (
      <span className="inline-flex items-center gap-[7px] font-mono text-[0.72rem] font-bold tracking-[0.04em] text-green-700">
        <span className="inline-block h-[9px] w-[9px] flex-none rounded-full bg-green" />
        SWM
      </span>
    );
  }
  return <span className="text-tx-faint">—</span>;
}

function StatusEl({ row }: { row: Row }) {
  if (row.statusKey === "ongoing") {
    return (
      <span className="inline-flex items-center gap-2 whitespace-nowrap font-mono text-[0.72rem] uppercase tracking-[0.06em] text-tx-soft">
        <span className="relative inline-block h-2 w-2 flex-none rounded-full bg-st-ongoing">
          <span
            aria-hidden
            className="absolute -inset-1 rounded-full border-[1.5px] opacity-50"
            style={{
              borderColor: "var(--st-ongoing)",
              animation: "ping-status 2.4s cubic-bezier(0,0,.2,1) infinite",
            }}
          />
        </span>
        Ongoing
      </span>
    );
  }
  if (row.statusKey === "completed") {
    return (
      <span className="inline-flex items-center gap-2 whitespace-nowrap font-mono text-[0.72rem] uppercase tracking-[0.06em] text-tx-soft">
        <span className="inline-block h-2 w-2 flex-none rounded-full bg-st-done" />
        Completed
      </span>
    );
  }
  return <span className="text-tx-faint">—</span>;
}

function RowAndDrawer({
  row,
  open,
  onToggle,
}: {
  row: Row;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr
        onClick={onToggle}
        className={`row cursor-pointer border-b border-line transition-colors hover:bg-mist ${
          open ? "open bg-mist" : ""
        }`}
      >
        <td
          data-h="Project"
          className="p-[16px_14px] align-middle text-[0.98rem] font-semibold text-ink"
        >
          <span
            className={`mr-1.5 inline-block w-[14px] text-tx-faint transition-transform ${
              open ? "rotate-90 text-terra-700" : ""
            }`}
          >
            ›
          </span>
          {row.name}
        </td>
        <td data-h="Line" className="p-[16px_14px] align-middle text-[0.98rem]">
          <LineChip row={row} />
        </td>
        <td data-h="Model" className="p-[16px_14px] align-middle text-[0.98rem]">
          <span className="font-mono text-[0.8rem] text-tx-faint">
            {row.model}
          </span>
        </td>
        <td data-h="City" className="p-[16px_14px] align-middle text-[0.98rem]">
          {row.city}
        </td>
        <td
          data-h="Capacity"
          className="p-[16px_14px] text-right align-middle text-[0.98rem] tabular-nums"
        >
          {row.capDisplay}
        </td>
        <td data-h="Status" className="p-[16px_14px] align-middle text-[0.98rem]">
          <StatusEl row={row} />
        </td>
      </tr>
      <tr className="drawer-row">
        <td colSpan={6} className="border-b border-line p-0">
          <div
            className="overflow-hidden transition-[max-height] duration-[280ms] ease-out"
            style={{ maxHeight: open ? 600 : 0 }}
          >
            <div className="grid grid-cols-1 gap-x-[clamp(20px,3vw,48px)] gap-y-5 px-[14px] pb-[26px] pt-1.5 md:grid-cols-[1.4fr_1fr]">
              <div className="max-w-[60ch] leading-[1.6] text-tx-soft">
                <span className="mb-2.5 block font-mono text-[0.72rem] font-bold uppercase tracking-[0.18em] text-tx-faint">
                  Scope of work
                </span>
                {row.scope}
              </div>
              <div className="grid grid-cols-2 content-start gap-y-4 gap-x-6">
                <Spec k="Business line" v={row.line} />
                <Spec k="Service model" v={row.model} />
                <Spec k="Capacity" v={row.capDisplay} tnum />
                <Spec k="Awarded" v={row.year ? String(row.year) : "—"} tnum />
                <Spec k="Location" v={`${row.city}, ${row.state}`} />
                <Spec k="Status" v={row.status} />
              </div>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}

function Spec({ k, v, tnum }: { k: string; v: string; tnum?: boolean }) {
  return (
    <div>
      <div className="font-mono text-[0.64rem] uppercase tracking-[0.1em] text-tx-faint">
        {k}
      </div>
      <div
        className={`mt-1 font-semibold text-ink ${tnum ? "tabular-nums" : ""}`}
      >
        {v}
      </div>
    </div>
  );
}
