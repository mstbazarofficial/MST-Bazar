// app/robots.ts

import { SITE_CONFIG } from "@/constants/site";
import type { MetadataRoute } from "next";

const baseUrl = SITE_CONFIG.url;
const DISALLOWED_PATHS = [
  "/admin",
  "/api/",
  "/checkout",
  "/dashboard",
  "/login",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Allow ChatGPT Search crawler
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },

      // Rules for all other crawlers
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
    ],

    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
