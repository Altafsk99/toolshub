"use client";

import { ImagesToPdfPanel } from "@/components/pdf/ImagesToPdfPanel";
import { MergePanel } from "@/components/pdf/MergePanel";
import { RotatePanel } from "@/components/pdf/RotatePanel";
import { SplitPanel } from "@/components/pdf/SplitPanel";
import type { PdfSeoLandingPreset } from "@/types/seo";

type PdfSeoLandingToolbarProps = {
  preset: PdfSeoLandingPreset;
};

export function PdfSeoLandingToolbar({ preset }: PdfSeoLandingToolbarProps) {
  if (preset.tool === "merge-pdf") {
    return <MergePanel />;
  }
  if (preset.tool === "split-pdf") {
    return <SplitPanel preset={preset} />;
  }
  if (preset.tool === "rotate-pdf") {
    return <RotatePanel preset={preset} />;
  }
  return <ImagesToPdfPanel preset={preset} />;
}
