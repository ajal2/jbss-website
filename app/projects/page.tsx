import { getProjects, getVisibleProjects } from "@/lib/cms";
import { ProjectsTable } from "@/components/ProjectsTable";
import { RevealObserver } from "@/components/RevealOnScroll";
import { Stat } from "@/components/Stat";
import { SurveyField } from "@/components/Atlas";

export const revalidate = 3600;

export default async function ProjectsPage() {
  const projects = await getProjects();
  const visible = getVisibleProjects(projects);

  // Stats for the page header
  const total = visible.length;
  const ongoing = visible.filter((p) => p.status === "Ongoing").length;
  const cities = new Set<string>();
  visible.forEach((p) => {
    const first = p.city?.name?.split(",")[0]?.trim();
    if (first) cities.add(first);
  });

  return (
    <>
      {/* Page head (mist) */}
      <section className="relative overflow-hidden border-b border-line bg-mist">
        <SurveyField />
        <div className="relative container-x">
          <div className="flex flex-wrap items-end justify-between gap-7 py-[clamp(40px,6vw,72px)]">
            <div>
              <div className="mb-[22px] flex items-center gap-3">
                <span className="font-mono text-[0.72rem] font-bold uppercase tracking-[0.18em] text-tx-faint">
                  Portfolio
                </span>
              </div>
              <h1 className="text-h1 text-ink">Our projects across both lines</h1>
            </div>
            <dl className="flex gap-[clamp(20px,3vw,40px)]">
              <Stat n={total} label="Projects" />
              <Stat n={ongoing} label="Ongoing" />
              <Stat n={cities.size} label="Cities" />
            </dl>
          </div>
        </div>
      </section>

      {/* Table */}
      <section className="py-[clamp(48px,6vw,84px)]">
        <div className="container-x">
          <ProjectsTable projects={projects} />
        </div>
      </section>

      <RevealObserver />
    </>
  );
}
