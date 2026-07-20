import type { Metadata } from "next";
import { ImageToolWorkspace } from "@/components/image/ImageToolWorkspace";
import { ResizePanel } from "@/components/image/ResizePanel";
import { ToolPageTemplate } from "@/components/seo/ToolPageTemplate";
import { resizeToolContent } from "@/content/tools/image";
import { buildToolMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildToolMetadata(resizeToolContent);

export default function ResizeImagePage() {
  return (
    <ToolPageTemplate content={resizeToolContent}>
      <ImageToolWorkspace toolbar={<ResizePanel />} />
    </ToolPageTemplate>
  );
}
