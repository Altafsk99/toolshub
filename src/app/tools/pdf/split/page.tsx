import type { Metadata } from "next";
import { PdfToolWorkspace } from "@/components/pdf/PdfToolWorkspace";
import { SplitPanel } from "@/components/pdf/SplitPanel";
import { ToolPageTemplate } from "@/components/seo/ToolPageTemplate";
import { splitPdfToolContent } from "@/content/tools/pdf";
import { buildToolMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildToolMetadata(splitPdfToolContent);

export default function SplitPdfPage() {
  return (
    <ToolPageTemplate content={splitPdfToolContent}>
      <PdfToolWorkspace>
        <SplitPanel />
      </PdfToolWorkspace>
    </ToolPageTemplate>
  );
}
