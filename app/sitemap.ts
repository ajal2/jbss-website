import type { MetadataRoute } from "next";
import { livePages } from "@/lib/nav";

const BASE = "https://jbssgroup.com";

// Derived from the same nav source of truth (lib/nav). Flip a page's
// `enabled` on and it joins both the nav and this sitemap automatically.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const routes = ["/", ...livePages().map((p) => p.href)];
  return routes.map((path) => ({
    url: path === "/" ? BASE : `${BASE}${path}`,
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
