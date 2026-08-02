import type { Metadata } from "next";
import { AdjustPanel } from "@/components/image/AdjustPanel";
import { ImageToolWorkspace } from "@/components/image/ImageToolWorkspace";
import { ToolPageTemplate } from "@/components/seo/ToolPageTemplate";
import { adjustToolContent } from "@/content/tools/image";
import { buildToolMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildToolMetadata(adjustToolContent);

export default function AdjustImagePage() {
  return (
    <ToolPageTemplate content={adjustToolContent}>
      <ImageToolWorkspace toolbar={<AdjustPanel />} />
    </ToolPageTemplate>
  );
}
