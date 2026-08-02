import type { Metadata } from "next";
import { MetadataPanel } from "@/components/image/MetadataPanel";
import { ImageToolWorkspace } from "@/components/image/ImageToolWorkspace";
import { ToolPageTemplate } from "@/components/seo/ToolPageTemplate";
import { metadataToolContent } from "@/content/tools/image";
import { buildToolMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildToolMetadata(metadataToolContent);

export default function RemoveMetadataPage() {
  return (
    <ToolPageTemplate content={metadataToolContent}>
      <ImageToolWorkspace toolbar={<MetadataPanel />} />
    </ToolPageTemplate>
  );
}
