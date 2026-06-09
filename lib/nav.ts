export type NavItem = {
  label: string;
  href: string;
  /** Pages with `enabled: false` are kept out of the nav + footer until ready. */
  enabled?: boolean;
};

// Single source of truth for the site's top-level pages (Home is the logo).
// About is intentionally deferred — build app/about/page.tsx, flip `enabled`
// to true here, and it appears in the nav and footer automatically.
export const SITE_PAGES: NavItem[] = [
  { label: "About", href: "/about", enabled: false },
  { label: "Projects", href: "/projects" },
  { label: "Outlook", href: "/outlook" },
  { label: "Careers", href: "/careers" },
];

/** The pages currently live in the nav + footer, in order. */
export function livePages(): NavItem[] {
  return SITE_PAGES.filter((p) => p.enabled !== false);
}
