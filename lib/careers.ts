// Careers config — client-safe (no server-only imports), so the Apply button
// in components/CareersList.tsx can read it directly.

/**
 * The single Microsoft Form every Apply button points to, unless a job row
 * sets its own "Apply Link". Set via NEXT_PUBLIC_CAREERS_FORM_URL so it's
 * inlined into the client bundle. Empty → the button falls back to mailto.
 */
const CAREERS_FORM_URL = process.env.NEXT_PUBLIC_CAREERS_FORM_URL ?? "";

/** Fallback contact when no form URL is configured. Matches the site's contact email. */
const CAREERS_EMAIL = "aryanjalota@jbssgroup.com";

/**
 * Resolve where a job's Apply button should go:
 *   per-row link  →  global form  →  mailto fallback.
 */
export function applyHref(job: { role: string; applyLink?: string }): string {
  if (job.applyLink) return job.applyLink;
  if (CAREERS_FORM_URL) return CAREERS_FORM_URL;
  const subject = encodeURIComponent(`Application — ${job.role}`);
  return `mailto:${CAREERS_EMAIL}?subject=${subject}`;
}

/** mailto links open in-place; http(s) form links open in a new tab. */
export function isExternal(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}
