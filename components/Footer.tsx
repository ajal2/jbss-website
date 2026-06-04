const FOUNDING_YEAR = 2016;

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-charcoal/10 bg-offwhite">
      <div className="relative mx-auto max-w-7xl px-6 py-14 md:py-16">
        {/* Editorial spine — matches every other section */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-[3px] bg-brand-green"
        />

        {/* Colophon header */}
        <header className="mb-10 flex flex-col gap-y-3 md:mb-12 md:flex-row md:items-end md:justify-between md:gap-x-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-brand-green">
              Colophon
            </p>
            <h2 className="mt-4 text-balance text-2xl font-medium leading-[1.1] tracking-tight text-charcoal md:text-3xl">
              Jalota Business Support Services LLP.
            </h2>
          </div>
          <dl className="flex shrink-0 items-baseline gap-x-6 text-[11px] font-medium uppercase tracking-[0.16em] text-steel md:gap-x-8">
            <div>
              <dt className="sr-only">Established</dt>
              <dd>
                <span className="text-base font-medium tabular-nums text-charcoal md:text-lg">
                  {FOUNDING_YEAR}
                </span>{" "}
                est.
              </dd>
            </div>
            <div>
              <dt className="sr-only">Years operating</dt>
              <dd>
                <span className="text-base font-medium tabular-nums text-charcoal md:text-lg">
                  {currentYear - FOUNDING_YEAR}+
                </span>{" "}
                years
              </dd>
            </div>
          </dl>
        </header>

        {/* Three-column data block — hairline dividers, atlas-style */}
        <div className="grid grid-cols-1 border-y border-charcoal/15 md:grid-cols-3">
          <div className="border-charcoal/15 py-6 pr-0 md:border-r md:pr-8 md:py-7">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-steel">
              Practice
            </p>
            <p className="mt-3 text-sm leading-relaxed text-charcoal">
              Waste infrastructure since {FOUNDING_YEAR}. Construction &amp;
              Demolition processing plants and municipal sanitation operations
              for India&apos;s public sector.
            </p>
          </div>

          <div className="border-t border-charcoal/15 py-6 md:border-l-0 md:border-r md:border-t-0 md:px-8 md:py-7">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-steel">
              Registered office
            </p>
            <address className="mt-3 text-sm not-italic leading-relaxed text-charcoal">
              58 GF, The Sapphire
              <br />
              Sector 49, Sohna Road
              <br />
              Gurgaon, Haryana 122018
            </address>
          </div>

          <div className="border-t border-charcoal/15 py-6 md:border-t-0 md:pl-8 md:py-7">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-steel">
              Contact
            </p>
            <p className="mt-3 text-sm leading-relaxed text-steel">
              [email — pending]
              <br />
              [phone — pending]
            </p>
          </div>
        </div>

        {/* Footer baseline */}
        <div className="mt-8 flex flex-col-reverse items-start gap-3 text-[10px] uppercase tracking-[0.18em] text-steel md:mt-10 md:flex-row md:items-center md:justify-between">
          <p>© {currentYear} Jalota Business Support Services LLP</p>
          <p>
            <span className="font-medium text-charcoal">JBSS LLP</span> ·
            Gurgaon · India · {currentYear}
          </p>
        </div>
      </div>
    </footer>
  );
}
