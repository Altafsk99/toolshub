"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PdfLargePage,
  PdfPreviewEmpty,
  PdfResultPreview,
  PdfThumbnailStrip,
} from "@/components/pdf/PdfPreviewParts";
import { PdfLiveOutput, PdfPreviewSection } from "@/components/pdf/PdfLiveOutput";
import { usePdfPageThumbnails } from "@/components/pdf/usePdfThumbnails";

type PdfDocumentPreviewProps = {
  file: File | null | undefined;
  pageCount: number;
  fileName?: string;
  highlightedPages?: Set<number>;
  resultPreviewUrl?: string | null;
  resultFilename?: string | null;
  resultBlob?: Blob | null;
  resultIsZip?: boolean;
  zipPageCount?: number;
  isPreviewing?: boolean;
  emptyLabel?: string;
};

export function PdfDocumentPreview({
  file,
  pageCount,
  fileName,
  highlightedPages,
  resultPreviewUrl,
  resultFilename,
  resultBlob,
  resultIsZip,
  zipPageCount,
  isPreviewing,
  emptyLabel = "Preview appears here after you upload a PDF.",
}: PdfDocumentPreviewProps) {
  const [activePage, setActivePage] = useState(1);
  const { thumbnails, loading } = usePdfPageThumbnails(file, pageCount);

  useEffect(() => {
    if (activePage > pageCount) {
      setActivePage(Math.max(1, pageCount));
    }
  }, [activePage, pageCount]);

  const stripItems = useMemo(
    () =>
      Array.from({ length: Math.min(pageCount, 48) }, (_, index) => {
        const pageNumber = index + 1;
        return {
          key: String(pageNumber),
          pageNumber,
          thumbnailUrl: thumbnails[pageNumber],
          highlighted: highlightedPages?.has(pageNumber),
        };
      }),
    [pageCount, thumbnails, highlightedPages],
  );

  if (!file || pageCount <= 0) {
    return <PdfPreviewEmpty label={emptyLabel} />;
  }

  const hasPdfResult = Boolean(resultPreviewUrl && resultBlob && !resultIsZip);
  const hasZipResult = Boolean(resultIsZip && resultBlob);
  const activeThumb = thumbnails[activePage];

  return (
    <PdfPreviewSection isPreviewing={isPreviewing}>
      {hasPdfResult || hasZipResult ? (
        <PdfLiveOutput
          resultPreviewUrl={resultPreviewUrl}
          resultFilename={resultFilename}
          resultBlob={resultBlob}
          resultIsZip={resultIsZip}
          zipPageCount={zipPageCount}
          isPreviewing={isPreviewing}
        />
      ) : (
        <PdfLargePage
          thumbnailUrl={activeThumb}
          label={`Page ${activePage}${fileName ? ` · ${fileName}` : ""}`}
          meta={`${activePage} / ${pageCount}`}
          loading={(loading || isPreviewing) && !activeThumb}
        />
      )}

      <PdfThumbnailStrip
        items={stripItems}
        activeKey={String(activePage)}
        onSelect={(key) => setActivePage(Number(key))}
        loading={loading}
      />
    </PdfPreviewSection>
  );
}
