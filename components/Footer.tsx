import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink-2 text-[#cdd2c5]">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-[30px] py-[clamp(48px,6vw,74px)] md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand + tagline */}
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-flex rounded-md bg-mist px-3.5 py-3">
                <Image
                  src="/logo.svg"
                  alt="JBSS LLP"
                  width={160}
                  height={42}
                  className="h-[42px] w-auto"
                />
              </span>
            </div>
            <p className="mt-[18px] max-w-[30ch] text-[0.92rem] text-[#aab09f]">
              Waste infrastructure since 2016 — Construction &amp; Demolition
              processing and municipal Solid Waste Management for India&apos;s
              public sector.
            </p>
          </div>

          {/* Pages */}
          <div>
            <h4 className="font-mono text-[0.72rem] font-bold uppercase tracking-[0.12em] text-green-300">
              Pages
            </h4>
            <ul className="mt-3.5 flex flex-col gap-2.5">
              <li>
                <Link href="/#what" className="hover:text-white">
                  What we do
                </Link>
              </li>
              <li>
                <Link href="/#capabilities" className="hover:text-white">
                  Capabilities
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-white">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-white">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Office */}
          <div>
            <h4 className="font-mono text-[0.72rem] font-bold uppercase tracking-[0.12em] text-green-300">
              Office
            </h4>
            <address className="mt-3.5 not-italic leading-[1.7] text-[0.92rem] text-[#aab09f]">
              58 GF, The Sapphire
              <br />
              Sector 49, Sohna Road
              <br />
              Gurgaon, Haryana 122018
            </address>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-mono text-[0.72rem] font-bold uppercase tracking-[0.12em] text-green-300">
              Contact
            </h4>
            <ul className="mt-3.5 flex flex-col gap-2.5 text-[0.92rem]">
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
                  href="mailto:jbss0786@gmail.com"
                  className="break-all hover:text-white"
                >
                  jbss0786@gmail.com
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

        {/* Baseline */}
        <div className="flex flex-wrap justify-between gap-3 border-t border-line-dk py-[22px] font-mono text-[0.68rem] uppercase tracking-[0.08em] text-[#8b9182]">
          <span>© {year} Jalota Business Support Services LLP</span>
          <span>Gurgaon · India</span>
        </div>
      </div>
    </footer>
  );
}
