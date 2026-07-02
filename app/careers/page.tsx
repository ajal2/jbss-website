import type { Metadata } from "next";
import { getJobOpenings, getJobBody } from "@/lib/cms";
import { CareersList } from "@/components/CareersList";
import { RevealObserver } from "@/components/RevealOnScroll";
import { Stat } from "@/components/Stat";
import { SurveyField } from "@/components/Atlas";

// Careers is edited live in Notion — fetch on every request so a new row
// shows up on the next refresh instead of waiting on the ISR cache window.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Careers — JBSS",
  description:
    "Open roles at JBSS LLP. Join the team building India's waste infrastructure.",
  alternates: { canonical: "/careers" },
};

export default async function CareersPage() {
  // Real contract (lib/cms): list openings, keep visible, then pull each
  // role's description from its Notion page body. (Claude Design's mockup
  // assumed a single getJobs(); the JSX below is its redesign, rewired here.)
  const openings = await getJobOpenings();
  const visible = openings.filter((o) => o.visible);
  const jobs = await Promise.all(
    visible.map(async (o) => ({ ...o, body: await getJobBody(o.id) })),
  );

  return (
    <>
      {/* Page head (mist) — same band as /projects */}
      <section className="relative overflow-hidden border-b border-line bg-mist">
        <SurveyField />
        <div className="relative container-x">
          <div className="flex flex-wrap items-end justify-between gap-7 py-[clamp(40px,6vw,72px)]">
            <div className="max-w-[62ch]">
              <div className="mb-[22px] flex items-center gap-3">
                <span className="text-[0.8rem] font-semibold text-tx-faint">
                  Careers
                </span>
              </div>
              <h1 className="text-h1 max-w-[18ch] text-ink">
                Build India&apos;s waste infrastructure with us.
              </h1>
              <p className="mt-[18px] max-w-[46ch] text-[clamp(1rem,1.4vw,1.15rem)] leading-[1.55] text-tx-soft">
                We design, build and operate waste systems across India. When
                we&apos;re hiring, the open roles show up here.
              </p>
            </div>
            <dl className="flex gap-[clamp(20px,3vw,40px)]">
              <Stat n={jobs.length} label="Open roles" />
            </dl>
          </div>
        </div>
      </section>

      {/* Roles list / empty state */}
      <section className="py-[clamp(48px,6vw,84px)]">
        <div className="container-x">
          <CareersList jobs={jobs} />
        </div>
      </section>

      <RevealObserver />
    </>
  );
}
