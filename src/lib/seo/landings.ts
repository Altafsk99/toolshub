import {
  featuredSeoLandingSlugs,
  seoLandingPagesWithRelated,
} from "@/content/seo/image-landings";
import type { SeoLandingPage } from "@/types/seo";

const landingBySlug = new Map(
  seoLandingPagesWithRelated.map((page) => [page.slug, page]),
);

export function getSeoLandingBySlug(slug: string): SeoLandingPage | undefined {
  return landingBySlug.get(slug);
}

export function getAllSeoLandingSlugs(): string[] {
  return seoLandingPagesWithRelated.map((page) => page.slug);
}

export function getFeaturedSeoLandings(): SeoLandingPage[] {
  return featuredSeoLandingSlugs
    .map((slug) => landingBySlug.get(slug))
    .filter((page): page is SeoLandingPage => page != null);
}

export { seoLandingPagesWithRelated as seoLandingPages };
