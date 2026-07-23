import type { Metadata } from "next";
import { CompressionPanel } from "@/components/image/CompressionPanel";
import { ImageToolWorkspace } from "@/components/image/ImageToolWorkspace";
import { ToolPageTemplate } from "@/components/seo/ToolPageTemplate";
import { compressToolContent } from "@/content/tools/image";
import { buildToolMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildToolMetadata(compressToolContent);

export default function CompressImagePage() {
  return (
    <ToolPageTemplate content={compressToolContent}>
      <ImageToolWorkspace allowMultiple toolbar={<CompressionPanel />} />
    </ToolPageTemplate>
  );
}
