import type { Metadata } from "next";
import { PdfToolWorkspace } from "@/components/pdf/PdfToolWorkspace";
import { RotatePanel } from "@/components/pdf/RotatePanel";
import { ToolPageTemplate } from "@/components/seo/ToolPageTemplate";
import { rotatePdfToolContent } from "@/content/tools/pdf";
import { buildToolMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildToolMetadata(rotatePdfToolContent);

export default function RotatePdfPage() {
  return (
    <ToolPageTemplate content={rotatePdfToolContent}>
      <PdfToolWorkspace>
        <RotatePanel />
      </PdfToolWorkspace>
    </ToolPageTemplate>
  );
}
