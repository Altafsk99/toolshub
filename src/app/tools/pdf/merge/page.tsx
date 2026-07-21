import type { Metadata } from "next";
import { MergePanel } from "@/components/pdf/MergePanel";
import { PdfToolWorkspace } from "@/components/pdf/PdfToolWorkspace";
import { ToolPageTemplate } from "@/components/seo/ToolPageTemplate";
import { mergePdfToolContent } from "@/content/tools/pdf";
import { buildToolMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildToolMetadata(mergePdfToolContent);

export default function MergePdfPage() {
  return (
    <ToolPageTemplate content={mergePdfToolContent}>
      <PdfToolWorkspace>
        <MergePanel />
      </PdfToolWorkspace>
    </ToolPageTemplate>
  );
}
