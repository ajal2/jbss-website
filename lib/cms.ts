import { cache } from "react";
import { Client } from "@notionhq/client";
import type {
  PageObjectResponse,
  ListBlockChildrenResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

export interface Project {
  id: string;
  projectName: string;
  displayName?: string;
  tileTagline?: string;
  capacityHeadline?: string;
  businessLine?: string;
  serviceModel?: string;
  status?: string;
  client?: string;
  city?: { name?: string; lat?: number; lng?: number };
  scopeOfWork?: string;
  subSites?: number;
  dailyCapacityKgPerDay?: number;
  dateFrom?: string;
  dateTo?: string;
  featured?: boolean;
  order?: number;
  visibleOnWebsite?: boolean;
  coverImageUrl?: string;
}

export async function getProjects(): Promise<Project[]> {
  return fetchProjectsFromNotion();
}

/** Publish gate shared by every consumer of the projects list. */
export const getVisibleProjects = (projects: Project[]): Project[] =>
  projects.filter((p) => p.visibleOnWebsite);

// cache() dedupes the Notion round-trip across all consumers in a single
// render (the homepage alone fans `projects` out to four sections).
const fetchProjectsFromNotion = cache(async (): Promise<Project[]> => {
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!databaseId) {
    throw new Error("NOTION_DATABASE_ID must be set in .env.local");
  }

  const notion = notionClient();
  const response = await notion.databases.query({
    database_id: databaseId,
    sorts: [{ property: "Order", direction: "ascending" }],
  });

  return response.results
    .filter((page): page is PageObjectResponse => "properties" in page)
    .map(notionPageToProject);
});

function notionPageToProject(page: PageObjectResponse): Project {
  const props = page.properties;
  return {
    id: page.id,
    projectName: readTitle(props["Project Name"]),
    displayName: readRichText(props["Display Name"]),
    tileTagline: readRichText(props["Tile Tagline"]),
    capacityHeadline: readRichText(props["Capacity Headline"]),
    businessLine: readSelect(props["Business Line"]),
    serviceModel: readSelect(props["Service Model"]),
    status: readSelect(props["Status"]),
    client: readRichText(props["Client"]),
    city: readPlace(props["City "], readNumber(props["Latitude"]), readNumber(props["Longitude"])),
    scopeOfWork: readRichText(props["Scope of Work"]),
    subSites: readNumber(props["Sub-Sites"]),
    dailyCapacityKgPerDay: readNumber(props["Daily Capacity (kg/day)"]),
    dateFrom: readDate(props["Date From"]),
    dateTo: readDate(props["Date To"]),
    featured: readCheckbox(props["Featured"]),
    order: readNumber(props["Order"]),
    visibleOnWebsite: readCheckbox(props["Visible on Website"]),
    coverImageUrl: readFirstFileUrl(props["Cover Image"]),
  };
}

type Property = PageObjectResponse["properties"][string];

function readTitle(prop: Property | undefined): string {
  if (prop?.type !== "title") return "";
  return prop.title.map((t) => t.plain_text).join("");
}

function readRichText(prop: Property | undefined): string | undefined {
  if (prop?.type !== "rich_text") return undefined;
  const text = prop.rich_text.map((t) => t.plain_text).join("");
  return text || undefined;
}

function readSelect(prop: Property | undefined): string | undefined {
  if (prop?.type !== "select") return undefined;
  return prop.select?.name;
}

function readNumber(prop: Property | undefined): number | undefined {
  if (prop?.type !== "number") return undefined;
  return prop.number ?? undefined;
}

function readCheckbox(prop: Property | undefined): boolean | undefined {
  if (prop?.type !== "checkbox") return undefined;
  return prop.checkbox;
}

function readDate(prop: Property | undefined): string | undefined {
  if (prop?.type !== "date") return undefined;
  return prop.date?.start;
}

function readFirstFileUrl(prop: Property | undefined): string | undefined {
  if (prop?.type !== "files") return undefined;
  const first = prop.files[0];
  if (!first) return undefined;
  if (first.type === "external") return first.external.url;
  if (first.type === "file") return first.file.url;
  return undefined;
}

// 'place' type isn't in the SDK's Property union yet — cast through any. The
// SDK also doesn't reliably surface latitude/longitude from the place type,
// so callers pass in explicit lat/lng (sourced from dedicated Number columns
// in Notion) which take precedence over anything the place property returns.
function readPlace(
  prop: Property | undefined,
  latOverride?: number,
  lngOverride?: number,
): { name?: string; lat?: number; lng?: number } | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyProp = prop as any;
  const isPlace = anyProp?.type === "place";
  const name = isPlace ? anyProp.place?.name : undefined;
  const lat = latOverride ?? (isPlace ? anyProp.place?.latitude : undefined);
  const lng = lngOverride ?? (isPlace ? anyProp.place?.longitude : undefined);
  if (!name && lat === undefined && lng === undefined) return undefined;
  return { name, lat, lng };
}

// ============================================================
//  Careers — job openings, driven by a second Notion database.
//  Mirrors the Projects pattern above and reuses its readers.
//  The job *description* lives in the Notion page body (so a
//  non-technical editor just opens the row and writes), and is
//  fetched separately via getJobBody().
// ============================================================

export interface JobOpening {
  id: string;
  role: string;
  location?: string;
  type?: string;
  department?: string;
  order?: number;
  /** Per-role form URL. Blank → the site falls back to the global form. */
  applyLink?: string;
  /** The "Visible on Website" checkbox — the editor's publish toggle. */
  visible?: boolean;
}

/** A single rich-text run inside a body block. */
export interface Span {
  text: string;
  bold?: boolean;
  italic?: boolean;
  href?: string;
}

/** A normalized page-body block. Only the handful of types below render. */
export type Block =
  | { kind: "p"; spans: Span[] }
  | { kind: "h2"; spans: Span[] }
  | { kind: "h3"; spans: Span[] }
  | { kind: "bullet"; spans: Span[] }
  | { kind: "number"; spans: Span[] };

/** A job plus its rendered description body — what the careers page renders. */
export type JobWithBody = JobOpening & { body: Block[] };

export async function getJobOpenings(): Promise<JobOpening[]> {
  return fetchJobOpeningsFromNotion();
}

const fetchJobOpeningsFromNotion = cache(async (): Promise<JobOpening[]> => {
  const databaseId = process.env.NOTION_CAREERS_DATABASE_ID;

  // Graceful no-op until the careers database is wired up, so the page
  // renders its empty state instead of crashing during setup.
  if (!databaseId) {
    console.warn(
      "NOTION_CAREERS_DATABASE_ID is not set — careers page will show no openings.",
    );
    return [];
  }

  try {
    const notion = notionClient();
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [{ property: "Order", direction: "ascending" }],
    });

    return response.results
      .filter((page): page is PageObjectResponse => "properties" in page)
      .map(notionPageToJob);
  } catch (err) {
    // e.g. the DB isn't shared with the integration yet — degrade to empty
    // state rather than 500 the page.
    console.error("Failed to load careers from Notion:", err);
    return [];
  }
});

function notionPageToJob(page: PageObjectResponse): JobOpening {
  const props = page.properties;
  return {
    id: page.id,
    role: readTitle(props["Role"]),
    location: readRichText(props["Location"]),
    type: readSelect(props["Type"]),
    department: readSelect(props["Department"]),
    order: readNumber(props["Order"]),
    applyLink: readUrl(props["Apply Link"]),
    // Same publish gate the team already uses on Projects.
    visible: readCheckbox(props["Visible on Website"]),
  };
}

/** Fetch a job's description from its Notion page body (top-level blocks only). */
export async function getJobBody(pageId: string): Promise<Block[]> {
  try {
    const notion = notionClient();
    const res = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100,
    });
    return res.results.map(toBlock).filter((b): b is Block => b !== null);
  } catch (err) {
    console.error(`Failed to load job body for ${pageId}:`, err);
    return [];
  }
}

// One client per server process, shared by the projects + careers fetchers.
let notionSingleton: Client | null = null;

function notionClient(): Client {
  if (notionSingleton) return notionSingleton;
  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) {
    throw new Error("NOTION_API_KEY must be set in .env.local");
  }
  notionSingleton = new Client({ auth: apiKey });
  return notionSingleton;
}

function readUrl(prop: Property | undefined): string | undefined {
  if (prop?.type !== "url") return undefined;
  return prop.url ?? undefined;
}

type BlockResult = ListBlockChildrenResponse["results"][number];

function toBlock(b: BlockResult): Block | null {
  if (!("type" in b)) return null;
  switch (b.type) {
    case "paragraph": {
      const spans = readSpans(b.paragraph.rich_text);
      return spans.length ? { kind: "p", spans } : null; // drop blank lines
    }
    case "heading_2":
      return { kind: "h2", spans: readSpans(b.heading_2.rich_text) };
    case "heading_3":
      return { kind: "h3", spans: readSpans(b.heading_3.rich_text) };
    case "bulleted_list_item":
      return { kind: "bullet", spans: readSpans(b.bulleted_list_item.rich_text) };
    case "numbered_list_item":
      return { kind: "number", spans: readSpans(b.numbered_list_item.rich_text) };
    default:
      return null; // images, dividers, etc. are intentionally skipped
  }
}

function readSpans(rt: RichTextItemResponse[]): Span[] {
  return rt
    .map((t) => ({
      text: t.plain_text,
      bold: t.annotations.bold || undefined,
      italic: t.annotations.italic || undefined,
      href: t.href ?? undefined,
    }))
    .filter((s) => s.text.length > 0);
}
