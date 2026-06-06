import Link from "next/link";

export function ContactCTA() {
  return (
    <section
      id="contact"
      className="bg-ink pad-section text-white scroll-mt-[86px]"
    >
      <div className="container-x">
        <div className="grid grid-cols-1 items-center gap-[clamp(30px,5vw,64px)] md:grid-cols-[1.3fr_1fr]">
          <div className="reveal">
            <h2 className="text-h1 text-white">
              Have a tender or a site to discuss?
            </h2>
            <p className="mt-[18px] text-lead" style={{ color: "#dcd8cc" }}>
              Talk to the team that builds the plant and runs it — for the
              public sector, institutions and private clients.
            </p>
            <div className="mt-[30px] flex flex-wrap gap-3.5">
              <a
                href="mailto:info@jbss.in?subject=Project%20enquiry%20%E2%80%94%20JBSS%20LLP&body=Hi%20JBSS%20team%2C%0A%0A"
                className="group inline-flex items-center gap-2.5 rounded-[4px] border-[1.5px] border-terra bg-terra px-[22px] py-[13px] text-[0.95rem] font-semibold text-white transition-colors hover:border-terra-700 hover:bg-terra-700"
              >
                Start a conversation
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
              <Link
                href="/projects"
                className="group inline-flex items-center gap-2.5 rounded-[4px] border-[1.5px] border-white/45 bg-transparent px-[22px] py-[13px] text-[0.95rem] font-semibold text-white transition-colors hover:border-white"
              >
                See our work
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
          <div
            className="reveal rounded-lg border border-line-dk bg-ink-2 p-[clamp(24px,3vw,34px)]"
          >
            <p className="font-mono text-[0.72rem] font-bold uppercase tracking-[0.18em] text-green-300">
              Registered office
            </p>
            <address className="mt-3.5 not-italic leading-[1.7] text-[#dcd8cc]">
              58 GF, The Sapphire
              <br />
              Sector 49, Sohna Road
              <br />
              Gurgaon, Haryana 122018
            </address>
            <p className="mt-[22px] font-mono text-[0.72rem] font-bold uppercase tracking-[0.18em] text-green-300">
              Get in touch
            </p>
            <address className="mt-3.5 not-italic leading-[1.7] text-[#dcd8cc]">
              <span className="font-mono">[email — pending]</span>
              <br />
              <span className="font-mono">[phone — pending]</span>
            </address>
          </div>
        </div>
      </div>
    </section>
  );
}
