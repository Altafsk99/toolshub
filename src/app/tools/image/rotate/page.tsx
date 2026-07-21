import type { Metadata } from "next";
import { RotatePanel } from "@/components/image/RotatePanel";
import { ImageToolWorkspace } from "@/components/image/ImageToolWorkspace";
import { ToolPageTemplate } from "@/components/seo/ToolPageTemplate";
import { rotateToolContent } from "@/content/tools/image";
import { buildToolMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildToolMetadata(rotateToolContent);

export default function RotateImagePage() {
  return (
    <ToolPageTemplate content={rotateToolContent}>
      <ImageToolWorkspace toolbar={<RotatePanel />} />
    </ToolPageTemplate>
  );
}
