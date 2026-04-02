import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/compartilhar"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
