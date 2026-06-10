"use client";

import { useState } from "react";
import Link from "next/link";
import { applyHref, isExternal } from "@/lib/careers";
// Types live in lib/cms (the data layer), not lib/careers — rewired from the
// Claude Design mockup, which assumed they were exported from lib/careers.
import type { Block, JobWithBody, Span } from "@/lib/cms";

type Props = {
  jobs: JobWithBody[];
};

export function CareersList({ jobs }: Props) {
  // Single open role → start expanded (kept from the original behavior);
  // otherwise everything starts closed, one drawer open at a time.
  const [openId, setOpenId] = useState<string | null>(
    jobs.length === 1 ? jobs[0].id : null
  );

  if (jobs.length === 0) return <CareersEmpty />;

  return (
    <div className="careers-list">
      {/* Column header — echoes the projects table thead; hidden <760px */}
      <div className="clist-head" aria-hidden="true">
        <span>Role</span>
        <span>Department</span>
        <span>Type</span>
        <span>Location</span>
      </div>

      <ul className="m-0 list-none p-0">
        {jobs.map((job) => (
          <JobRow
            key={job.id}
            job={job}
            open={openId === job.id}
            onToggle={() =>
              setOpenId((curr) => (curr === job.id ? null : job.id))
            }
          />
        ))}
      </ul>

      <p className="mt-[22px] max-w-[60ch] text-[0.9375rem] text-tx-faint">
        Select a role for the full description.
      </p>
    </div>
  );
}

// === Row + drawer ===

function JobRow({
  job,
  open,
  onToggle,
}: {
  job: JobWithBody;
  open: boolean;
  onToggle: () => void;
}) {
  const href = applyHref(job);
  const ext = isExternal(href);
  const rowId = `careers-row-${job.id}`;
  const drawerId = `careers-drawer-${job.id}`;

  return (
    <li className="border-b border-line">
      <button
        type="button"
        id={rowId}
        className="crow"
        aria-expanded={open}
        aria-controls={drawerId}
        onClick={onToggle}
      >
        <span className="role">
          <span className="chev" aria-hidden="true">
            ›
          </span>
          {job.role}
        </span>
        <span className="meta-line">
          <span className="dept">{job.department ?? "—"}</span>
          <span className="sep" aria-hidden="true">
            ·
          </span>
          <span className="ctype">{job.type ?? "—"}</span>
          <span className="sep" aria-hidden="true">
            ·
          </span>
          <span className="loc">{job.location ?? "—"}</span>
        </span>
      </button>

      <div
        className={open ? "cdrawer open" : "cdrawer"}
        id={drawerId}
        role="region"
        aria-labelledby={rowId}
      >
        <div className="cdrawer-clip">
          <div className="cdrawer-inner">
            <JobBody blocks={job.body} />
            <aside className="cmeta">
              <div className="dl">
                <Spec k="Department" v={job.department} />
                <Spec k="Type" v={job.type} />
                <Spec k="Location" v={job.location} />
              </div>
              <a
                href={href}
                {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group inline-flex items-center justify-self-start gap-2.5 rounded border-[1.5px] border-green bg-green px-[22px] py-[13px] text-[0.95rem] font-semibold tracking-[-0.01em] text-white transition-colors hover:border-green-700 hover:bg-green-700 max-[760px]:min-h-[48px] max-[760px]:justify-center max-[760px]:justify-self-stretch"
              >
                Apply for this role{" "}
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
            </aside>
          </div>
        </div>
      </div>
    </li>
  );
}

function Spec({ k, v }: { k: string; v?: string }) {
  return (
    <div>
      <div className="k">{k}</div>
      <div className="v">{v ?? "—"}</div>
    </div>
  );
}

// === Notion body rendering ===
// Consecutive bullet/number blocks group into one <ul>/<ol>.

function JobBody({ blocks }: { blocks: Block[] }) {
  const out: React.ReactNode[] = [];
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i];
    if (b.kind === "bullet" || b.kind === "number") {
      const kind = b.kind;
      const items: Span[][] = [];
      while (i < blocks.length && blocks[i].kind === kind) {
        items.push(blocks[i].spans);
        i++;
      }
      const ListTag = kind === "bullet" ? "ul" : "ol";
      out.push(
        <ListTag key={`list-${i}`}>
          {items.map((spans, j) => (
            <li key={j}>
              <Spans spans={spans} />
            </li>
          ))}
        </ListTag>
      );
    } else {
      const Tag = b.kind === "h2" ? "h2" : b.kind === "h3" ? "h3" : "p";
      out.push(
        <Tag key={i}>
          <Spans spans={b.spans} />
        </Tag>
      );
      i++;
    }
  }
  return <div className="cbody">{out}</div>;
}

function Spans({ spans }: { spans: Span[] }) {
  return (
    <>
      {spans.map((span, i) => (
        <SpanText key={i} span={span} />
      ))}
    </>
  );
}

function SpanText({ span }: { span: Span }) {
  let node: React.ReactNode = span.text;
  if (span.bold) node = <strong>{node}</strong>;
  if (span.italic) node = <em>{node}</em>;
  if (span.href) {
    node = isExternal(span.href) ? (
      <a href={span.href} target="_blank" rel="noopener noreferrer">
        {node}
      </a>
    ) : (
      <a href={span.href}>{node}</a>
    );
  }
  return <>{node}</>;
}

// === Empty state — the common state; quiet, stated, dated ===

function CareersEmpty() {
  const stamp = new Date().toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
  return (
    <div className="careers-empty">
      <div className="ce-status">
        <span className="dot" aria-hidden="true"></span>
        No open roles · <span suppressHydrationWarning>{stamp}</span>
      </div>
      <h2>Nothing open right now.</h2>
      <p>
        We staff as projects demand. When a role opens, it&apos;s listed on
        this page first.
      </p>
      <Link
        href="/projects"
        className="group mt-7 inline-flex items-center gap-2.5 whitespace-nowrap border-b-2 border-terra pb-[3px] text-[0.95rem] font-semibold text-ink"
      >
        See what we&apos;re building{" "}
        <span
          aria-hidden="true"
          className="text-terra transition-transform group-hover:translate-x-1"
        >
          →
        </span>
      </Link>
    </div>
  );
}
