import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PdfSeoLandingToolbar } from "@/components/pdf/PdfSeoLandingToolbar";
import { PdfToolWorkspace } from "@/components/pdf/PdfToolWorkspace";
import { ToolPageTemplate } from "@/components/seo/ToolPageTemplate";
import {
  getAllPdfSeoLandingSlugs,
  getPdfSeoLandingBySlug,
} from "@/lib/seo/pdf-landings";
import { buildPageMetadata } from "@/lib/seo/metadata";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPdfSeoLandingSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const landing = getPdfSeoLandingBySlug(slug);
  if (!landing) return {};

  return buildPageMetadata({
    title: landing.title,
    description: landing.description,
    path: `/tools/pdf/${landing.slug}`,
    keywords: landing.keywords,
  });
}

export default async function PdfSeoLandingPage({ params }: PageProps) {
  const { slug } = await params;
  const landing = getPdfSeoLandingBySlug(slug);
  if (!landing) notFound();

  return (
    <ToolPageTemplate content={landing}>
      <PdfToolWorkspace>
        <PdfSeoLandingToolbar preset={landing.preset} />
      </PdfToolWorkspace>
    </ToolPageTemplate>
  );
}
