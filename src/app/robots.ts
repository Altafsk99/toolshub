import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/metadata";
import { NOINDEX_PATHS } from "@/lib/seo/routes";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [...NOINDEX_PATHS],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
