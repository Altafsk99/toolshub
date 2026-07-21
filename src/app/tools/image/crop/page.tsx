import type { Metadata } from "next";
import { CropPanel } from "@/components/image/CropPanel";
import { ImageToolWorkspace } from "@/components/image/ImageToolWorkspace";
import { ToolPageTemplate } from "@/components/seo/ToolPageTemplate";
import { cropToolContent } from "@/content/tools/image";
import { buildToolMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildToolMetadata(cropToolContent);

export default function CropImagePage() {
  return (
    <ToolPageTemplate content={cropToolContent}>
      <ImageToolWorkspace toolbar={<CropPanel />} />
    </ToolPageTemplate>
  );
}
