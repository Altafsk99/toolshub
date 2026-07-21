import {
  featuredPdfSeoLandingSlugs,
  pdfSeoLandingPages,
} from "@/content/seo/pdf-landings";
import type { PdfSeoLandingPage } from "@/types/seo";

const landingBySlug = new Map(pdfSeoLandingPages.map((page) => [page.slug, page]));

export function getPdfSeoLandingBySlug(slug: string): PdfSeoLandingPage | undefined {
  return landingBySlug.get(slug);
}

export function getAllPdfSeoLandingSlugs(): string[] {
  return pdfSeoLandingPages.map((page) => page.slug);
}

export function getFeaturedPdfSeoLandings(): PdfSeoLandingPage[] {
  return featuredPdfSeoLandingSlugs
    .map((slug) => landingBySlug.get(slug))
    .filter((page): page is PdfSeoLandingPage => page != null);
}

export { pdfSeoLandingPages };
