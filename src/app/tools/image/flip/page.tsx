import type { Metadata } from "next";
import { FlipPanel } from "@/components/image/FlipPanel";
import { ImageToolWorkspace } from "@/components/image/ImageToolWorkspace";
import { ToolPageTemplate } from "@/components/seo/ToolPageTemplate";
import { flipToolContent } from "@/content/tools/image";
import { buildToolMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildToolMetadata(flipToolContent);

export default function FlipImagePage() {
  return (
    <ToolPageTemplate content={flipToolContent}>
      <ImageToolWorkspace toolbar={<FlipPanel />} />
    </ToolPageTemplate>
  );
}
