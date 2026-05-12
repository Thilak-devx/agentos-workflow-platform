import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://agentos.app";
  const routes = [
    "",
    "/login",
    "/signup",
    "/forgot-password",
    "/dashboard",
    "/agents",
    "/workflows",
    "/treasury",
    "/settings",
    "/demo",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "daily",
    priority: route === "" ? 1 : 0.8,
  }));
}
