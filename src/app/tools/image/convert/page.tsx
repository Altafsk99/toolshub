import type { Metadata } from "next";
import { ConvertPanel } from "@/components/image/ConvertPanel";
import { ImageToolWorkspace } from "@/components/image/ImageToolWorkspace";
import { ToolPageTemplate } from "@/components/seo/ToolPageTemplate";
import { convertToolContent } from "@/content/tools/image";
import { buildToolMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildToolMetadata(convertToolContent);

export default function ConvertImagePage() {
  return (
    <ToolPageTemplate content={convertToolContent}>
      <ImageToolWorkspace toolbar={<ConvertPanel />} />
    </ToolPageTemplate>
  );
}
