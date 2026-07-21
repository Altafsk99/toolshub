import type { Metadata } from "next";
import { ImagesToPdfPanel } from "@/components/pdf/ImagesToPdfPanel";
import { PdfToolWorkspace } from "@/components/pdf/PdfToolWorkspace";
import { ToolPageTemplate } from "@/components/seo/ToolPageTemplate";
import { imagesToPdfToolContent } from "@/content/tools/pdf";
import { buildToolMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildToolMetadata(imagesToPdfToolContent);

export default function ImagesToPdfPage() {
  return (
    <ToolPageTemplate content={imagesToPdfToolContent}>
      <PdfToolWorkspace>
        <ImagesToPdfPanel />
      </PdfToolWorkspace>
    </ToolPageTemplate>
  );
}
