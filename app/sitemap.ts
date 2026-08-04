import type { MetadataRoute } from "next";
import { SITE } from "@/config/site.config";
import {
  events,
  listingCategories,
  listings,
  locations,
  newsItems,
  placeCategories,
  places,
} from "@/constants/content";

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
  ...listings.filter((item) => item.status === "active").map((item) => item.href),
  ...listingCategories.map((item) => `/market/${item.slug}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [...new Set([...publicRoutes, ...dynamicRoutes])].map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
