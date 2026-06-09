# Careers page — handoff to Claude Design

**Status:** functionally complete and wired to Notion. Build + lint + typecheck pass.
**Your job:** finalize the *visual design* of `/careers`. Keep the data wiring, the apply
logic, and the Notion contract intact — restyle freely on top of them.

**Scope decided with the user: LEAN LISTING.** No hero, no culture/benefits section, no
photos. Header + list of open roles + apply, plus an empty state. Keep the restrained,
operating-language tone of the rest of the site (see brand voice below). Do **not** turn
this into a marketing-style careers landing.

---

## What exists

| File | Role | Touch? |
|---|---|---|
| `app/careers/page.tsx` | Server page. Fetches openings, filters `visible`, pulls each role's body, renders header + `<CareersList>`. `force-dynamic`. | Restyle the header/layout. Keep the data fetch + `force-dynamic`. |
| `components/CareersList.tsx` | Client component: expandable list (drawer per role), Apply button, body renderer, empty state. **This is the main canvas.** | Restyle everything. Keep the apply logic, a11y attrs, and block-rendering structure. |
| `lib/cms.ts` | `getJobOpenings()`, `getJobBody()`, types `JobOpening` / `Block` / `Span` / `JobWithBody`. | **Do not touch** — data layer. |
| `lib/careers.ts` | `applyHref()`, `isExternal()`, `CAREERS_FORM_URL`, `CAREERS_EMAIL`. | **Do not touch** — apply logic. |
| `lib/nav.ts` | Adds `Careers` to nav/footer. | Done. |

The current styling is a **deliberately restrained scaffold** using existing tokens —
treat it as a wireframe, not a finished look.

## Data contract (what `CareersList` receives)

```ts
type JobWithBody = {
  id: string;
  role: string;          // job title — the row heading
  location?: string;     // e.g. "Gurugram"
  type?: string;         // Full-time | Part-time | Contract | Internship
  department?: string;   // optional
  order?: number;        // sort (already applied)
  applyLink?: string;    // optional per-role override
  visible?: boolean;     // already filtered to true
  body: Block[];         // the job description, from the Notion page body
};

type Span  = { text: string; bold?; italic?; href? };
type Block =
  | { kind: "p" | "h2" | "h3"; spans: Span[] }
  | { kind: "bullet" | "number"; spans: Span[] };
```

`body` is the rendered Notion page body. Supported blocks: paragraph, H2/H3, bulleted &
numbered lists, with inline bold/italic/links. Consecutive list items are grouped into
one `<ul>`/`<ol>`. Anything else in Notion (images, dividers) is skipped by design.

## Apply button — DO NOT change the logic

`applyHref(job)` resolves: **per-row `applyLink` → global Microsoft Form
(`NEXT_PUBLIC_CAREERS_FORM_URL`) → `mailto:` fallback**. External (http) links open in a
new tab; mailto opens in place. You may restyle the button; keep `applyHref`/`isExternal`
and the `target`/`rel` behavior.

---

## Design system (reuse these — don't invent tokens)

- **Tokens & utilities:** `app/globals.css`. Colors: `--ink`, `--paper`, `--mist`,
  `--card`, `--line`, `--tx-soft`, `--tx-faint`; brand `--green*` (SWM) / `--terra*` (C&D).
- **Type ramp:** `.text-display / .text-h1 / .text-h2 / .text-h3 / .text-lead`.
  Fonts: **Archivo** (display/body), **Space Mono** (labels — uppercase, tracked).
- **Layout:** `.container-x`, `.pad-section`, `--gutter`, `--radius: 4px`.
- **Patterns to match:** the Projects page header (`app/projects/page.tsx` — eyebrow +
  `text-h1` + `Stat`), the row/drawer + mobile-card behavior in
  `components/ProjectsTable.tsx` (CSS scoped under `.projects-table` in `globals.css`),
  the green filled CTA used in `Hero`/`ContactCTA`, and the pulsing status dot.
- **Reveal-on-scroll:** the page already renders `<RevealObserver>`; add `reveal` classes
  to taste.

## Brand voice (for any copy you adjust)

"New India infrastructure," MSME-restrained, **no marketing speak**. Plain, operational
language. Current header copy: eyebrow "Careers", H1 "Build India's waste infrastructure
with us", lead "We design, build and operate waste systems across India. When we're
hiring, the open roles show up here." Empty state points to `CAREERS_EMAIL`. You may
refine wording in this register; don't make it loud.

## Open design calls (yours to make)

- Row treatment: list vs. cards; how `type` / `location` / `department` read as meta.
- Drawer vs. inline reveal; the open/close affordance; transition feel.
- Empty-state composition (it will be the common state — make it feel intentional, not broken).
- Mobile: the scaffold is a `<ul>` (already responsive). If you switch to a `<table>`,
  reuse the `.projects-table` mobile-card CSS.
- Single-role case: scaffold auto-opens the drawer when there's exactly one role — keep or change.

## Guardrails

- Keep `export const dynamic = "force-dynamic"`.
- Keep the data fetch in `page.tsx` and the props shape into `CareersList`.
- Keep apply-href resolution and a11y (`aria-expanded`, `aria-controls`, focusable controls).
- Don't add new env vars or data sources.

## Verify

`npm run dev` → `/careers`. With the Notion DB shared + `NEXT_PUBLIC_CAREERS_FORM_URL`
set, ticking **Visible on Website** on a role makes it appear; the drawer shows the page
body; Apply opens the form. With nothing visible, the empty state shows. `npm run build`
must stay green.
