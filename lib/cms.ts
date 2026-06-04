import { Client } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

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

async function fetchProjectsFromNotion(): Promise<Project[]> {
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!apiKey || !databaseId) {
    throw new Error(
      "NOTION_API_KEY and NOTION_DATABASE_ID must be set in .env.local",
    );
  }

  const notion = new Client({ auth: apiKey });
  const response = await notion.databases.query({
    database_id: databaseId,
    sorts: [{ property: "Order", direction: "ascending" }],
  });

  return response.results
    .filter((page): page is PageObjectResponse => "properties" in page)
    .map(notionPageToProject);
}

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
  const anyProp = prop as any;
  const isPlace = anyProp?.type === "place";
  const name = isPlace ? anyProp.place?.name : undefined;
  const lat = latOverride ?? (isPlace ? anyProp.place?.latitude : undefined);
  const lng = lngOverride ?? (isPlace ? anyProp.place?.longitude : undefined);
  if (!name && lat === undefined && lng === undefined) return undefined;
  return { name, lat, lng };
}
