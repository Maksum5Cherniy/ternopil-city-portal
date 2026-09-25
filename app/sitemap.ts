import type { MetadataRoute } from "next";
import { SITE } from "@/config/site.config";
import {
  events,
  listingCategories,
  locations,
  newsItems,
  placeCategories,
  places,
} from "@/constants/content";
import { getListingSitemapRoutes } from "@/lib/database";
import { getPublishedAdminPortalEntities } from "@/lib/public-content";

const publicRoutes = [
  "/",
  "/news",
  "/places",
  "/locations",
  "/events",
  "/map",
  "/market",
  "/search",
  "/privacy",
  "/terms",
  "/contacts",
];

const dynamicRoutes = [
  ...newsItems.map((item) => item.href),
  ...places.map((item) => item.href),
  ...placeCategories.map((item) => `/places/${item.slug}`),
  ...locations.map((item) => item.href),
  ...events.map((item) => item.href),
  ...listingCategories.map((item) => `/market/${item.slug}`),
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const databaseListingRoutes = await getListingSitemapRoutes().catch(() => []);
  const adminContentRoutes = (await getPublishedAdminPortalEntities(undefined, 120))
    .map((item) => item.href)
    .filter((href) => href.startsWith("/"));
  const routeEntries = [...new Set([...publicRoutes, ...dynamicRoutes, ...adminContentRoutes])].map(
    (route) => ({
      url: `${SITE.url}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "/" ? ("daily" as const) : ("weekly" as const),
      priority: route === "/" ? 1 : 0.7,
    }),
  );
  const databaseEntries = databaseListingRoutes.map((item) => ({
    url: `${SITE.url}${item.route}`,
    lastModified: item.lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...routeEntries, ...databaseEntries];
}
