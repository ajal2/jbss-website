import type { Metadata } from "next";
import { getProjects } from "@/lib/cms";
import { Hero } from "@/components/Hero";
import { MetricsBand } from "@/components/MetricsBand";
import { WhatWeDo } from "@/components/WhatWeDo";
import { CapabilitiesPipeline } from "@/components/CapabilitiesPipeline";
import { SelectedWork } from "@/components/SelectedWork";
import { FootprintMap } from "@/components/FootprintMap";
import { ContactCTA } from "@/components/ContactCTA";
import { RevealObserver } from "@/components/RevealOnScroll";

// Static render, regenerated hourly — Notion edits surface within the window
// instead of every visitor hitting the API.
export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

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
