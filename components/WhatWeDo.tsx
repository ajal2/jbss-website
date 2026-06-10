import Image from "next/image";
import { getVisibleProjects, type Project } from "@/lib/cms";
import { formatNumber } from "@/lib/format";
import { SheetHead, AtlasFooter } from "@/components/Atlas";

type Props = {
  projects: Project[];
};

export function WhatWeDo({ projects }: Props) {
  const visible = getVisibleProjects(projects);
  const tpdCnd =
    visible
      .filter((p) => p.businessLine === "C&D")
      .reduce((sum, p) => sum + (p.dailyCapacityKgPerDay ?? 0), 0) / 1000;
  const omSites = visible
    .filter((p) => p.serviceModel?.includes("O&M"))
    .reduce((sum, p) => sum + (p.subSites ?? 1), 0);

  return (
    <section id="what" className="pad-section scroll-mt-[100px]">
      <div className="container-x">
        <SheetHead label="What we do" index="02" />

        <div className="max-w-[62ch]">
          <h2 className="text-h1 text-ink">
            Two business lines, one operating model.
          </h2>
          <p className="mt-[18px] text-lead">
            JBSS designs, builds and commissions waste infrastructure, then
            operates it under long-term contract.
          </p>
        </div>

        <div className="mt-[clamp(28px,4vw,42px)] grid grid-cols-1 gap-[clamp(18px,2.5vw,28px)] md:grid-cols-2">
          {/* C&D card */}
          <article className="reveal flex flex-col overflow-hidden rounded-md border border-line bg-card">
            <div className="h-1 w-full bg-terra" />
            <div className="relative aspect-[16/10]">
              <Image
                src="/capabilities/C&D_Plant.jpg"
                alt="JBSS C&D plant processing line"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col gap-4 p-[clamp(22px,2.5vw,34px)]">
              <div className="flex items-center gap-3">
                <span className="rounded-[3px] bg-terra px-2.5 py-[5px] font-mono text-[0.68rem] font-bold uppercase tracking-[0.1em] text-white">
                  C&amp;D
                </span>
                <span className="font-mono text-[0.72rem] font-bold uppercase tracking-[0.18em] text-tx-faint">
                  Construction &amp; Demolition
                </span>
              </div>
              <h3 className="text-[clamp(1.4rem,2.2vw,1.9rem)] font-bold tracking-[-0.02em] text-ink">
                Processing plants, delivered &amp; run.
              </h3>
              <p className="text-[1.0625rem] leading-[1.65] text-tx-soft">
                We design, supply, build and commission municipal C&amp;D
                processing plants, then operate them under long-term O&amp;M. The
                plant turns rubble into reusable aggregate.
              </p>
              <div className="flex flex-wrap gap-2">
                {["EPC", "EPC + O&M", "turnkey"].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-line bg-white px-3 py-[5px] font-mono text-[0.72rem] tracking-[0.04em] text-tx-soft"
                  >
                    {chip}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex items-baseline gap-2.5 border-t border-line pt-[18px]">
                <span className="text-2xl font-extrabold tracking-[-0.03em] tabular-nums text-terra-700">
                  {formatNumber(tpdCnd)}
                </span>
                <span className="font-mono text-[0.72rem] uppercase tracking-[0.08em] text-tx-faint">
                  TPD installed
                </span>
              </div>
            </div>
          </article>

          {/* SWM card */}
          <article className="reveal flex flex-col overflow-hidden rounded-md border border-line bg-card">
            <div className="h-1 w-full bg-green" />
            <div className="relative aspect-[16/10]">
              <Image
                src="/capabilities/swm.jpg"
                alt="JBSS sanitation crew loading collected waste"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col gap-4 p-[clamp(22px,2.5vw,34px)]">
              <div className="flex items-center gap-3">
                <span className="rounded-[3px] bg-green px-2.5 py-[5px] font-mono text-[0.68rem] font-bold uppercase tracking-[0.1em] text-white">
                  SWM
                </span>
                <span className="font-mono text-[0.72rem] font-bold uppercase tracking-[0.18em] text-tx-faint">
                  Solid Waste Management
                </span>
              </div>
              <h3 className="text-[clamp(1.4rem,2.2vw,1.9rem)] font-bold tracking-[-0.02em] text-ink">
                Municipal and institutional sanitation.
              </h3>
              <p className="text-[1.0625rem] leading-[1.65] text-tx-soft">
                Long-term municipal and institutional sanitation with on-site
                composting. We handle collection, segregation and processing
                under O&amp;M contract.
              </p>
              <div className="flex flex-wrap gap-2">
                {["O&M", "composting", "collection"].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-line bg-white px-3 py-[5px] font-mono text-[0.72rem] tracking-[0.04em] text-tx-soft"
                  >
                    {chip}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex items-baseline gap-2.5 border-t border-line pt-[18px]">
                <span className="text-2xl font-extrabold tracking-[-0.03em] tabular-nums text-green-700">
                  {omSites}+
                </span>
                <span className="font-mono text-[0.72rem] uppercase tracking-[0.08em] text-tx-faint">
                  sites operated
                </span>
              </div>
            </div>
          </article>
        </div>
        <AtlasFooter section="Two business lines" note="EPC · EPC + O&M" />
      </div>
    </section>
  );
}
