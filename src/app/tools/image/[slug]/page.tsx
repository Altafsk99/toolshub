import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ImageToolWorkspace } from "@/components/image/ImageToolWorkspace";
import { SeoLandingToolbar } from "@/components/image/SeoLandingToolbar";
import { ToolPageTemplate } from "@/components/seo/ToolPageTemplate";
import { getAllSeoLandingSlugs, getSeoLandingBySlug } from "@/lib/seo/landings";
import { buildPageMetadata } from "@/lib/seo/metadata";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllSeoLandingSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const landing = getSeoLandingBySlug(slug);
  if (!landing) return {};

  return buildPageMetadata({
    title: landing.title,
    description: landing.description,
    path: `/tools/image/${landing.slug}`,
    keywords: landing.keywords,
  });
}

export default async function SeoLandingPage({ params }: PageProps) {
  const { slug } = await params;
  const landing = getSeoLandingBySlug(slug);
  if (!landing) notFound();

  return (
    <ToolPageTemplate content={landing}>
      <ImageToolWorkspace toolbar={<SeoLandingToolbar preset={landing.preset} />} />
    </ToolPageTemplate>
  );
}
