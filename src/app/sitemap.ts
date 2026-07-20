import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/metadata";
import { publicSitemapEntries } from "@/lib/seo/routes";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicSitemapEntries.map((entry) => ({
    url: absoluteUrl(entry.path),
    lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
