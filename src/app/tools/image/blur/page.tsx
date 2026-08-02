import type { Metadata } from "next";
import { BlurPanel } from "@/components/image/BlurPanel";
import { ImageToolWorkspace } from "@/components/image/ImageToolWorkspace";
import { ToolPageTemplate } from "@/components/seo/ToolPageTemplate";
import { blurToolContent } from "@/content/tools/image";
import { buildToolMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildToolMetadata(blurToolContent);

export default function BlurImagePage() {
  return (
    <ToolPageTemplate content={blurToolContent}>
      <ImageToolWorkspace toolbar={<BlurPanel />} />
    </ToolPageTemplate>
  );
}
