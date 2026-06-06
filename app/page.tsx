import { getProjects } from "@/lib/cms";
import { Hero } from "@/components/Hero";
import { MetricsBand } from "@/components/MetricsBand";
import { WhatWeDo } from "@/components/WhatWeDo";
import { CapabilitiesPipeline } from "@/components/CapabilitiesPipeline";
import { SelectedWork } from "@/components/SelectedWork";
import { FootprintMap } from "@/components/FootprintMap";
import { ContactCTA } from "@/components/ContactCTA";
import { RevealObserver } from "@/components/RevealOnScroll";

export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = await getProjects();

  return (
    <>
      <Hero />
      <MetricsBand projects={projects} />
      <WhatWeDo projects={projects} />
      <CapabilitiesPipeline />
      <SelectedWork projects={projects} />
      <FootprintMap projects={projects} />
      <ContactCTA />
      <RevealObserver />
    </>
  );
}
