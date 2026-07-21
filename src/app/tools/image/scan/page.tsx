import type { Metadata } from "next";
import { ScanPanel } from "@/components/image/ScanPanel";
import { ToolPageTemplate } from "@/components/seo/ToolPageTemplate";
import { scanToolContent } from "@/content/tools/image";
import { buildToolMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildToolMetadata(scanToolContent);

export default function ScanDocumentPage() {
  return (
    <ToolPageTemplate content={scanToolContent}>
      <ScanPanel />
    </ToolPageTemplate>
  );
}
