import type { Metadata } from "next";
import { CvPanel } from "@/components/cv/CvPanel";
import { ToolPageTemplate } from "@/components/seo/ToolPageTemplate";
import { cvToolContent } from "@/content/tools/cv";
import { buildToolMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildToolMetadata(cvToolContent, { noIndex: true });

export default function CvMakerPage() {
  return (
    <ToolPageTemplate content={cvToolContent}>
      <CvPanel />
    </ToolPageTemplate>
  );
}
