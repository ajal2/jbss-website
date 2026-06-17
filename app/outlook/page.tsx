import type { Metadata } from "next";
import { getProjects } from "@/lib/cms";
import { deriveStateName } from "@/lib/location";
import { OutlookView } from "./OutlookView";

export const metadata: Metadata = {
  title: "Outlook — JBSS LLP",
  description:
    "India's waste rules are tightening from guideline to statutory and constitutional obligation. JBSS builds and operates the C&D and sanitation infrastructure those rules require.",
  alternates: { canonical: "/outlook" },
};

// Static render, regenerated hourly — mirrors the homepage so Notion edits
// surface within the window instead of every visitor hitting the API.
export const revalidate = 3600;

export default async function OutlookPage() {
  const projects = await getProjects();
  const footprintStates = Array.from(
    new Set(
      projects
        .filter((p) => p.visibleOnWebsite)
        .map((p) => deriveStateName(p.city?.name))
        .filter((s): s is string => Boolean(s)),
    ),
  );

  return <OutlookView footprintStates={footprintStates} />;
}
