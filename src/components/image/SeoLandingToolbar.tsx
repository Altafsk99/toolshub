"use client";

import { CompressionPanel } from "@/components/image/CompressionPanel";
import { ConvertPanel } from "@/components/image/ConvertPanel";
import { CropPanel } from "@/components/image/CropPanel";
import { FlipPanel } from "@/components/image/FlipPanel";
import { ResizePanel } from "@/components/image/ResizePanel";
import { RotatePanel } from "@/components/image/RotatePanel";
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
  if (preset.tool === "crop") {
    return <CropPanel preset={preset} />;
  }
  if (preset.tool === "rotate") {
    return <RotatePanel preset={preset} />;
  }
  if (preset.tool === "flip") {
    return <FlipPanel preset={preset} />;
  }
  return <ConvertPanel preset={preset} />;
}
