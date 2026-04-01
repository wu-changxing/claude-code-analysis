import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://cc.openonion.ai";
  const pages = [
    "",
    "/architecture",
    "/query-loop",
    "/tools",
    "/permissions",
    "/agents",
    "/services",
    "/context",
    "/file-map",
    "/fun-facts",
  ];

  return pages.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date("2026-04-01"),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
}
