"use client";

import { useEffect, useState } from "react";
import { PdfLargePage, PdfPreviewEmpty, PdfThumbnailStrip } from "@/components/pdf/PdfPreviewParts";
import { PdfLiveOutput, PdfPreviewSection } from "@/components/pdf/PdfLiveOutput";
import { usePdfStore } from "@/stores/pdfStore";

export function ImagesToPdfPreview() {
  const imageFiles = usePdfStore((s) => s.imageFiles);
  const resultPreviewUrl = usePdfStore((s) => s.resultPreviewUrl);
  const resultFilename = usePdfStore((s) => s.resultFilename);
  const resultBlob = usePdfStore((s) => s.resultBlob);
  const isPreviewing = usePdfStore((s) => s.isPreviewing);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (activeIndex >= imageFiles.length) {
      setActiveIndex(Math.max(0, imageFiles.length - 1));
    }
  }, [activeIndex, imageFiles.length]);

  if (imageFiles.length === 0) {
    return (
      <PdfPreviewEmpty label="Live PDF preview appears here after you add images." />
    );
  }

  const active = imageFiles[activeIndex];
  const hasPdf = Boolean(resultPreviewUrl && resultBlob);

  return (
    <PdfPreviewSection isPreviewing={isPreviewing}>
      {hasPdf ? (
        <PdfLiveOutput
          resultPreviewUrl={resultPreviewUrl}
          resultFilename={resultFilename}
          resultBlob={resultBlob}
          isPreviewing={isPreviewing}
        />
      ) : active ? (
        <PdfLargePage
          thumbnailUrl={active.previewUrl}
          label={`Page ${activeIndex + 1} · ${active.meta.name}`}
          meta={`${active.meta.width}×${active.meta.height}`}
          loading={isPreviewing}
        />
      ) : null}

      <PdfThumbnailStrip
        items={imageFiles.map((entry, index) => ({
          key: entry.meta.id,
          pageNumber: index + 1,
          thumbnailUrl: entry.previewUrl,
        }))}
        activeKey={imageFiles[activeIndex]?.meta.id}
        onSelect={(key) => {
          const index = imageFiles.findIndex((entry) => entry.meta.id === key);
          if (index >= 0) setActiveIndex(index);
        }}
      />
    </PdfPreviewSection>
  );
}
