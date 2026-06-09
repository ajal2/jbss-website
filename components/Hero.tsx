import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/capabilities/swm.jpg"
        alt="JBSS field crew collecting and loading garden waste"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Legibility scrim — two gradients per CSS */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,28,20,.40) 0%, rgba(20,28,20,.22) 42%, rgba(22,28,20,.80) 100%), linear-gradient(90deg, rgba(20,28,20,.66) 0%, rgba(20,28,20,.12) 55%, rgba(20,28,20,0) 78%)",
        }}
      />

      <div className="container-x relative">
        <div className="pb-[clamp(32px,5vw,58px)] pt-[clamp(60px,10vw,120px)]">
          <h1 className="max-w-[17ch] text-display text-white">
            We build{" "}
            <em className="not-italic" style={{ color: "var(--green-300)" }}>
              and operate
            </em>{" "}
            waste infrastructure across India.
          </h1>
          <p className="mt-[26px] max-w-[46ch] text-[clamp(1.05rem,1.6vw,1.3rem)] leading-[1.5] text-[#e7e3d8]">
            Construction &amp; Demolition processing plants and municipal
            sanitation systems. We deliver them turnkey, then run them for up to
            15 years.
          </p>
          <div className="mt-[34px] flex flex-wrap gap-3.5">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2.5 rounded-[4px] border-[1.5px] border-white bg-white px-[22px] py-[13px] text-[0.95rem] font-semibold text-ink transition-transform hover:-translate-y-[2px]"
            >
              View our projects
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
            <a
              href="mailto:aryanjalota@jbssgroup.com?subject=Hello%20JBSS&body=Hi%20JBSS%20team%2C%0A%0A"
              className="group inline-flex items-center gap-2.5 rounded-[4px] border-[1.5px] border-white/45 bg-transparent px-[22px] py-[13px] text-[0.95rem] font-semibold text-white transition-colors hover:border-white"
            >
              Get in touch
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Hero credit, bottom right */}
      <p className="absolute bottom-4 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-white/50" style={{ right: "var(--gutter)" }}>
        JBSS field operations · Solid Waste Management
      </p>
    </section>
  );
}
