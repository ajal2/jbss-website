import Link from "next/link";
import { SheetHead, SurveyField } from "@/components/Atlas";

export function ContactCTA() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-ink pad-section text-white scroll-mt-[100px]"
    >
      <SurveyField tone="dark" />
      <div className="relative container-x">
        <SheetHead label="Get in touch" index="06" tone="dark" accent="green" />
        <div className="grid grid-cols-1 items-center gap-[clamp(26px,4vw,52px)] md:grid-cols-[1.3fr_1fr]">
          <div className="reveal">
            <h2 className="text-h1 text-white">
              Have a tender or a site to discuss?
            </h2>
            <p className="mt-[18px] text-lead" style={{ color: "#dcd8cc" }}>
              We work with the public sector, institutions and private clients.
              That covers design and build through to long-term operations.
            </p>
            <div className="mt-[30px] flex flex-wrap gap-3.5">
              <a
                href="mailto:aryanjalota@jbssgroup.com?subject=Project%20enquiry%20%E2%80%94%20JBSS%20LLP&body=Hi%20JBSS%20team%2C%0A%0A"
                className="group inline-flex items-center gap-2.5 rounded-[4px] border-[1.5px] border-terra bg-terra px-[22px] py-[13px] text-[0.95rem] font-semibold text-white transition-colors hover:border-terra-700 hover:bg-terra-700"
              >
                Email the team
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
            <p className="text-[0.8rem] font-semibold text-green-300">
              Registered office
            </p>
            <address className="mt-3.5 not-italic leading-[1.7] text-[#dcd8cc]">
              58 GF, The Sapphire
              <br />
              Sector 49, Sohna Road
              <br />
              Gurgaon, Haryana 122018
            </address>
            <p className="mt-[22px] text-[0.8rem] font-semibold text-green-300">
              Get in touch
            </p>
            <ul className="mt-3.5 flex flex-col gap-2 leading-[1.6] text-[#dcd8cc]">
              <li>
                <a
                  href="mailto:aryanjalota@jbssgroup.com"
                  className="break-all hover:text-white"
                >
                  aryanjalota@jbssgroup.com
                </a>
              </li>
              <li>
                <a
                  href="mailto:sandeepjalota@jbssgroup.com"
                  className="break-all hover:text-white"
                >
                  sandeepjalota@jbssgroup.com
                </a>
              </li>
              <li>
                <a href="tel:+919891666049" className="hover:text-white">
                  +91 98916 66049
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
