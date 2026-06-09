# Outlook page — Claude Design handoff & integration

The `/outlook` page is being rebuilt in Claude Design. This is the drop-in plan so
the handoff doesn't lose anything load-bearing. The current page stays live until
the new file is dropped in.

## Where the file goes

Save the Claude Design export as:

```
app/outlook/OutlookView.tsx        // the presentational component (the design)
```

Then `app/outlook/page.tsx` stays the thin server wrapper that owns the things a
design tool can't: route metadata, any Notion data, and the scroll-reveal mount.
Target shape:

```tsx
import type { Metadata } from "next";
import { OutlookView } from "./OutlookView";
import { RevealObserver } from "@/components/RevealOnScroll";

export const metadata: Metadata = {
  title: "Outlook — JBSS LLP",
  description: "…",   // keep the cleaned, sober description
};

export default function OutlookPage() {
  return (
    <>
      <OutlookView />
      <RevealObserver />
    </>
  );
}
```

If the export is a full page (its own metadata/layout), instead replace
`page.tsx` directly and lift `metadata` back out into the server file.

## Must-preserve checklist (verify after dropping in)

- [ ] **Metadata** — keep `title`/`description` (sober register, no marketing).
- [ ] **Fonts** — use the wired `--font-archivo` / `--font-space-mono`. No new fonts.
- [ ] **Tokens** — `--ink/--paper/--mist/--card/--terra(+700/300)/--green(+700/300)/--st-done`.
      No raw hexes that bypass the palette.
- [ ] **Tabular numbers** on every numeral (years, counts, steps).
- [ ] **No photos** on this page (data-viz / schematic only — this is intended here).
- [ ] **Supreme Court citation stays verbatim** — "Solid Waste Management Rules 2026
      are as good as the will expressed by Parliament." · *Bhopal Municipal Corporation
      v. Dr Subhash C. Pandey* · 19 February 2026.
- [ ] **Evidence section is gone** — no IIT Delhi / Bareilly project records.
- [ ] **India-aligned borders** if any map appears (PoK + Aksai Chin as India;
      use `/india-states.geojson`, never a world-atlas source). Credibility hard rule.

## Two wiring gotchas

1. **Nav theme flag.** `components/Nav.tsx` darkens the shared nav on `/outlook`
   via `const isDark = pathname.startsWith("/outlook")`. The old page was near-black.
   **If the redesign is light or hybrid, remove/relax that branch** so the nav
   doesn't render dark over a light page.

2. **Notion + dead CSS.** The current `page.tsx` fetches `getProjects()` only to
   feed the (now-removed) Evidence records — that fetch and the `findProject`/`r1`/`r2`
   helpers can be deleted unless the new design uses project data. After the swap,
   delete the now-unused `.ol-*` rules in `app/globals.css` (the whole
   "OUTLOOK PAGE — dark / atmospheric briefing room" block) and the `CountUp`
   import if unused.

## After integration

`npm run lint` + `npx tsc --noEmit` clean, then screenshot `/outlook` to confirm
layout, the nav theme, and that the data-viz reads as intended. The full design
intent is in the brief handed to Claude Design (lighter, less dense, regulatory
escalation as the visual spine, high-growth feel).
