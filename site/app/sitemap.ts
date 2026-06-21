import type { MetadataRoute } from "next";
import { flatNav } from "@/lib/nav";

const BASE = "https://docs.estebanaguilar.me";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return flatNav.map((item) => ({
    url: item.href === "/" ? BASE : `${BASE}${item.href}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: item.href === "/" ? 1 : 0.7,
  }));
}
