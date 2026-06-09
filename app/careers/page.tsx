import type { Metadata } from "next";
import { getJobOpenings, getJobBody } from "@/lib/cms";
import { CareersList } from "@/components/CareersList";
import { RevealObserver } from "@/components/RevealOnScroll";

// Matches Projects: edits in Notion appear on the next load, no cache wait.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Careers — JBSS",
  description:
    "Open roles at JBSS LLP. Join the team building India's waste infrastructure.",
};

export default async function CareersPage() {
  const openings = await getJobOpenings();
  const visible = openings.filter((o) => o.visible);
  // Pull each visible role's description from its Notion page body.
  const jobs = await Promise.all(
    visible.map(async (o) => ({ ...o, body: await getJobBody(o.id) })),
  );
  const count = jobs.length;

  return (
    <>
      {/* Page head (mist) — mirrors app/projects/page.tsx */}
      <section className="border-b border-line bg-mist">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-7 py-[clamp(40px,6vw,72px)]">
            <div>
              <div className="mb-[22px] flex items-center gap-3">
                <span className="font-mono text-[0.72rem] font-bold uppercase tracking-[0.18em] text-tx-faint">
                  Careers
                </span>
              </div>
              <h1 className="text-h1 text-ink">
                Build India&rsquo;s waste infrastructure with us
              </h1>
              <p className="mt-5 max-w-[56ch] text-lead text-tx-soft">
                We design, build and operate waste systems across India. When
                we&rsquo;re hiring, the open roles show up here.
              </p>
            </div>
            <dl className="flex gap-[clamp(20px,3vw,40px)]">
              <Stat n={count} label={count === 1 ? "Open role" : "Open roles"} />
            </dl>
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="py-[clamp(48px,6vw,84px)]">
        <div className="container-x">
          <CareersList jobs={jobs} />
        </div>
      </section>

      <RevealObserver />
    </>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div>
      <div className="text-[clamp(1.7rem,2.6vw,2.4rem)] font-extrabold leading-none tracking-[-0.03em] tabular-nums text-ink">
        {n}
      </div>
      <div className="mt-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-tx-faint">
        {label}
      </div>
    </div>
  );
}
