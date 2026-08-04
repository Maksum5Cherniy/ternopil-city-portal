import type { MetadataRoute } from "next";
import { SITE } from "@/config/site.config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/profile",
          "/owner",
          "/moderation",
          "/login",
          "/register",
          "/forgot-password",
          "/market/new",
          "/api",
        ],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
