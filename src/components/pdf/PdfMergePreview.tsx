"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PdfLargePage,
  PdfPreviewEmpty,
  PdfThumbnailStrip,
} from "@/components/pdf/PdfPreviewParts";
import { PdfLiveOutput, PdfPreviewSection } from "@/components/pdf/PdfLiveOutput";
import { useMergeThumbnails, type MergeThumbItem } from "@/components/pdf/usePdfThumbnails";

type PdfMergePreviewProps = {
  files: MergeThumbItem[];
  totalPages: number;
  resultPreviewUrl?: string | null;
  resultFilename?: string | null;
  resultBlob?: Blob | null;
  isPreviewing?: boolean;
  emptyLabel?: string;
};

export function PdfMergePreview({
  files,
  totalPages,
  resultPreviewUrl,
  resultFilename,
  resultBlob,
  isPreviewing,
  emptyLabel = "Preview appears here after you add PDF files.",
}: PdfMergePreviewProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { thumbnails, loading } = useMergeThumbnails(files);

  useEffect(() => {
    if (files.length === 0) {
      setActiveId(null);
      return;
    }
    if (!activeId || !files.some((entry) => entry.id === activeId)) {
      setActiveId(files[0]?.id ?? null);
    }
  }, [files, activeId]);

  const stripItems = useMemo(
    () =>
      files.map((entry, index) => ({
        key: entry.id,
        pageNumber: index + 1,
        thumbnailUrl: thumbnails[entry.id],
        label: String(index + 1),
      })),
    [files, thumbnails],
  );

  if (files.length === 0) {
    return <PdfPreviewEmpty label={emptyLabel} />;
  }

  const active = files.find((entry) => entry.id === activeId) ?? files[0];
  const activeIndex = files.findIndex((entry) => entry.id === active?.id);
  const hasMergedPreview = Boolean(resultPreviewUrl && resultBlob && files.length >= 2);

  return (
    <PdfPreviewSection isPreviewing={isPreviewing}>
      {hasMergedPreview ? (
        <PdfLiveOutput
          resultPreviewUrl={resultPreviewUrl}
          resultFilename={resultFilename}
          resultBlob={resultBlob}
          isPreviewing={isPreviewing}
          emptyLabel="Add at least two PDFs to see the merged preview."
        />
      ) : active ? (
        <PdfLargePage
          thumbnailUrl={thumbnails[active.id]}
          label={`File ${activeIndex + 1} · ${active.name}`}
          meta={
            files.length < 2
              ? "Add one more PDF to merge"
              : `${active.pageCount} page${active.pageCount === 1 ? "" : "s"}`
          }
          loading={(loading || isPreviewing) && !thumbnails[active.id]}
        />
      ) : null}

      <PdfThumbnailStrip
        items={stripItems}
        activeKey={activeId ?? undefined}
        onSelect={setActiveId}
        loading={loading}
      />

      <p className="text-xs text-ink-soft/60">
        {files.length} files · {totalPages} total pages — order matches the list below.
      </p>
    </PdfPreviewSection>
  );
}
