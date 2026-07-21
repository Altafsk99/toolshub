import {
  compressToolContent,
  convertToolContent,
  cropToolContent,
  flipToolContent,
  resizeToolContent,
  rotateToolContent,
} from "@/content/tools/image";
import { pdfToolPages } from "@/content/tools/pdf";
import { seoLandingPages } from "@/lib/seo/landings";
import { pdfSeoLandingPages } from "@/lib/seo/pdf-landings";
import type { ToolPageContent } from "@/types/seo";

export type SitemapEntry = {
  path: string;
  priority: number;
  changeFrequency: "weekly" | "monthly";
};

/** Routes that should not appear in sitemap or search indexes */
export const NOINDEX_PATHS = ["/tools/image/history"] as const;

export const imageToolPages: ToolPageContent[] = [
  compressToolContent,
  resizeToolContent,
  convertToolContent,
  cropToolContent,
  rotateToolContent,
  flipToolContent,
];

/** Indexable routes for sitemap generation — extend when adding SEO landing pages */
export const publicSitemapEntries: SitemapEntry[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/tools/image", priority: 0.9, changeFrequency: "weekly" },
  { path: "/tools/pdf", priority: 0.9, changeFrequency: "weekly" },
  ...imageToolPages.map((tool) => ({
    path: `/tools/image/${tool.slug}`,
    priority: 0.85,
    changeFrequency: "monthly" as const,
  })),
  ...pdfToolPages.map((tool) => ({
    path: `/tools/pdf/${tool.slug}`,
    priority: 0.85,
    changeFrequency: "monthly" as const,
  })),
  ...seoLandingPages.map((page) => ({
    path: `/tools/image/${page.slug}`,
    priority: 0.8,
    changeFrequency: "monthly" as const,
  })),
  ...pdfSeoLandingPages.map((page) => ({
    path: `/tools/pdf/${page.slug}`,
    priority: 0.8,
    changeFrequency: "monthly" as const,
  })),
];

export function isNoIndexPath(path: string): boolean {
  return NOINDEX_PATHS.includes(path as (typeof NOINDEX_PATHS)[number]);
}
