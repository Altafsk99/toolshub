import type { Metadata } from "next";
import { WatermarkPanel } from "@/components/image/WatermarkPanel";
import { ImageToolWorkspace } from "@/components/image/ImageToolWorkspace";
import { ToolPageTemplate } from "@/components/seo/ToolPageTemplate";
import { watermarkToolContent } from "@/content/tools/image";
import { buildToolMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildToolMetadata(watermarkToolContent);

export default function WatermarkImagePage() {
  return (
    <ToolPageTemplate content={watermarkToolContent}>
      <ImageToolWorkspace toolbar={<WatermarkPanel />} />
    </ToolPageTemplate>
  );
}
