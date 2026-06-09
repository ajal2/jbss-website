import type { Metadata } from "next";
import { OutlookView } from "./OutlookView";

export const metadata: Metadata = {
  title: "Outlook — JBSS LLP",
  description:
    "India's waste rules are tightening from guideline to statutory and constitutional obligation. JBSS builds and operates the C&D and sanitation infrastructure those rules require.",
};

export default function OutlookPage() {
  return <OutlookView />;
}
