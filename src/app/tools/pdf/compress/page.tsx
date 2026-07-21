import type { Metadata } from "next";
import { CompressPanel } from "@/components/pdf/CompressPanel";
import { PdfToolWorkspace } from "@/components/pdf/PdfToolWorkspace";
import { ToolPageTemplate } from "@/components/seo/ToolPageTemplate";
import { compressPdfToolContent } from "@/content/tools/pdf";
import { buildToolMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildToolMetadata(compressPdfToolContent);

export default function CompressPdfPage() {
  return (
    <ToolPageTemplate content={compressPdfToolContent}>
      <PdfToolWorkspace>
        <CompressPanel />
      </PdfToolWorkspace>
    </ToolPageTemplate>
  );
}
