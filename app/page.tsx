import { getProjects } from "@/lib/cms";
import { StatsBanner } from "@/components/StatsBanner";
import { IndiaMap } from "@/components/IndiaMap";
import { Capabilities } from "@/components/Capabilities";
import { TwoColumnGrid } from "@/components/TwoColumnGrid";

export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = await getProjects();

  return (
    <>
      {/* HERO — full-viewport cinematic film */}
      <section className="relative flex min-h-[calc(100vh-72px)] items-end overflow-hidden bg-deep-green">
        {/* Background video — drop /public/hero.mp4 (and optional /public/hero-poster.jpg). */}
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/hero-poster.jpg"
          aria-hidden
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        {/* Legibility overlay — deep-green wash, darker toward the bottom where the headline sits */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-deep-green/50 via-deep-green/70 to-deep-green/95"
        />

        {/* Brand dot-grid texture, kept subtle on top of the video */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #5BAE3C 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative mx-auto w-full max-w-7xl px-6 pb-20 pt-32 md:pb-32 md:pt-44">
          {/* Editorial spine — runs the height of the hero content area */}
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 w-[3px] bg-brand-green md:left-0"
          />

          <p className="mb-10 text-xs font-medium uppercase tracking-[0.25em] text-brand-green/90">
            Jalota Business Support Services LLP · Since 2016
          </p>
          <h1 className="max-w-5xl text-balance text-5xl font-medium leading-[1.02] tracking-tight text-offwhite md:text-7xl lg:text-[5.5rem]">
            Waste processing infrastructure for India&apos;s public sector and
            institutional clients.
          </h1>
          <p className="mt-12 max-w-2xl text-lg leading-relaxed text-offwhite/70 md:text-xl">
            EPC delivery and long-term operations of Construction &amp;
            Demolition processing plants and municipal sanitation systems.
          </p>

          {/* Atlas plate — film-slate inspired, bottom-right */}
          <p className="mt-16 text-right text-[10px] uppercase leading-[1.4] tracking-[0.22em] text-offwhite/50 md:absolute md:bottom-8 md:right-6 md:mt-0">
            <span className="font-medium text-offwhite/80">JBSS LLP</span> ·
            Gurgaon · India · {new Date().getFullYear()}
          </p>
        </div>
      </section>

      {/* STATS BANNER */}
      <StatsBanner projects={projects} />

      {/* GEOGRAPHIC FOOTPRINT — India map with project pins */}
      <IndiaMap projects={projects} />

      {/* CAPABILITIES — three expertise areas */}
      <Capabilities projects={projects} />

      {/* FEATURED PORTFOLIO — featured projects only + CTA to /projects */}
      <TwoColumnGrid projects={projects} showFeaturedOnly />
    </>
  );
}
