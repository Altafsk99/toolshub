"use client";

import { CompressionPanel } from "@/components/image/CompressionPanel";
import { ConvertPanel } from "@/components/image/ConvertPanel";
import { ResizePanel } from "@/components/image/ResizePanel";
import type { SeoLandingPreset } from "@/types/seo";

type SeoLandingToolbarProps = {
  preset: SeoLandingPreset;
};

export function SeoLandingToolbar({ preset }: SeoLandingToolbarProps) {
  if (preset.tool === "compress") {
    return <CompressionPanel preset={preset} />;
  }
  if (preset.tool === "resize") {
    return <ResizePanel preset={preset} />;
  }
  return <ConvertPanel preset={preset} />;
}
