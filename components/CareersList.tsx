"use client";

// NOTE: functional scaffold — Claude Design to finalize the visual treatment.
// Structure, data wiring, a11y and the apply logic are production-ready; the
// styling uses the existing design tokens but is deliberately restrained so it
// can be elevated in the design pass. See careers-handoff.md.

import { useRef, useState } from "react";
import type { JobWithBody, Block, Span } from "@/lib/cms";
import { applyHref, isExternal, CAREERS_EMAIL } from "@/lib/careers";

export function CareersList({ jobs }: { jobs: JobWithBody[] }) {
  // Auto-open when there's a single role; otherwise start collapsed.
  const [openId, setOpenId] = useState<string | null>(
    jobs.length === 1 ? jobs[0].id : null,
  );

  if (jobs.length === 0) return <EmptyState />;

  return (
    <ul className="border-t-2 border-ink">
      {jobs.map((job) => (
        <JobRow
          key={job.id}
          job={job}
          open={openId === job.id}
          onToggle={() => setOpenId((curr) => (curr === job.id ? null : job.id))}
        />
      ))}
    </ul>
  );
}

function JobRow({
  job,
  open,
  onToggle,
}: {
  job: JobWithBody;
  open: boolean;
  onToggle: () => void;
}) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const panelId = `job-panel-${job.id}`;

  return (
    <li className="border-b border-line">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="group flex w-full items-center gap-3 py-[18px] text-left transition-colors hover:opacity-90"
      >
        <span
          aria-hidden
          className={`inline-block w-[14px] flex-none text-tx-faint transition-transform ${
            open ? "rotate-90 text-green-700" : ""
          }`}
        >
          ›
        </span>
        <span className="flex-1">
          <span className="block text-[1.05rem] font-semibold leading-snug text-ink">
            {job.role}
          </span>
          <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.7rem] uppercase tracking-[0.08em] text-tx-faint">
            {job.type && <span>{job.type}</span>}
            {job.location && <span>{job.location}</span>}
            {job.department && <span>{job.department}</span>}
          </span>
        </span>
        <span className="hidden flex-none font-mono text-[0.68rem] uppercase tracking-[0.1em] text-tx-faint sm:block">
          {open ? "Close" : "View"}
        </span>
      </button>

      <div
        id={panelId}
        role="region"
        className="overflow-hidden transition-[max-height] duration-300 ease-out"
        style={{ maxHeight: open ? (drawerRef.current?.scrollHeight ?? 2000) : 0 }}
      >
        <div
          ref={drawerRef}
          className="grid gap-x-[clamp(20px,3vw,48px)] gap-y-6 pb-7 pl-[27px] pr-2 pt-1 md:grid-cols-[1.5fr_auto]"
        >
          <div className="max-w-[62ch] space-y-3 leading-[1.65] text-tx-soft">
            <BlockContent blocks={job.body} />
          </div>
          <div className="md:pt-1">
            <ApplyButton job={job} />
          </div>
        </div>
      </div>
    </li>
  );
}

function ApplyButton({ job }: { job: JobWithBody }) {
  const href = applyHref(job);
  const external = isExternal(href);
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="inline-flex items-center gap-2 whitespace-nowrap rounded-[4px] border-[1.5px] border-green bg-green px-[22px] py-[13px] text-[0.95rem] font-semibold text-white transition-colors hover:border-green-700 hover:bg-green-700"
    >
      Apply <span aria-hidden>→</span>
    </a>
  );
}

// === Body rendering (Notion page blocks → JSX) ===

function BlockContent({ blocks }: { blocks: Block[] }) {
  if (blocks.length === 0) {
    return (
      <p className="text-tx-faint">
        Details coming soon. Reach out at{" "}
        <a className="underline hover:text-ink" href={`mailto:${CAREERS_EMAIL}`}>
          {CAREERS_EMAIL}
        </a>
        .
      </p>
    );
  }

  // Group consecutive list items into a single <ul>/<ol>.
  const out: React.ReactNode[] = [];
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i];
    if (b.kind === "bullet" || b.kind === "number") {
      const ordered = b.kind === "number";
      const items: Span[][] = [];
      while (
        i < blocks.length &&
        blocks[i].kind === (ordered ? "number" : "bullet")
      ) {
        items.push(blocks[i].spans);
        i++;
      }
      const ListTag = ordered ? "ol" : "ul";
      out.push(
        <ListTag
          key={`list-${i}`}
          className={`${ordered ? "list-decimal" : "list-disc"} space-y-1.5 pl-5`}
        >
          {items.map((spans, idx) => (
            <li key={idx}>
              <Spans spans={spans} />
            </li>
          ))}
        </ListTag>,
      );
      continue;
    }

    if (b.kind === "h2" || b.kind === "h3") {
      out.push(
        <h3 key={`h-${i}`} className="text-h3 pt-2 text-ink">
          <Spans spans={b.spans} />
        </h3>,
      );
    } else {
      out.push(
        <p key={`p-${i}`}>
          <Spans spans={b.spans} />
        </p>,
      );
    }
    i++;
  }

  return <>{out}</>;
}

function Spans({ spans }: { spans: Span[] }) {
  return (
    <>
      {spans.map((s, i) => {
        let node: React.ReactNode = s.text;
        if (s.bold) node = <strong>{node}</strong>;
        if (s.italic) node = <em>{node}</em>;
        if (s.href) {
          node = (
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-ink"
            >
              {node}
            </a>
          );
        }
        return <span key={i}>{node}</span>;
      })}
    </>
  );
}

function EmptyState() {
  return (
    <div className="border-t-2 border-ink py-[clamp(40px,7vw,72px)]">
      <p className="max-w-[52ch] text-lead text-tx-soft">
        No open roles right now. We&rsquo;re always glad to hear from people who
        want to help build India&rsquo;s waste infrastructure — write to us at{" "}
        <a className="underline hover:text-ink" href={`mailto:${CAREERS_EMAIL}`}>
          {CAREERS_EMAIL}
        </a>
        .
      </p>
    </div>
  );
}
