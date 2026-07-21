"use client";

import type { ReactNode } from "react";
import {
  PdfPreviewEmpty,
  PdfPreviewHeader,
  PdfResultPreview,
} from "@/components/pdf/PdfPreviewParts";

type PdfLiveOutputProps = {
  resultPreviewUrl?: string | null;
  resultFilename?: string | null;
  resultBlob?: Blob | null;
  resultIsZip?: boolean;
  zipPageCount?: number;
  isPreviewing?: boolean;
  waitingLabel?: string;
  emptyLabel?: string;
};

export function PdfLiveOutput({
  resultPreviewUrl,
  resultFilename,
  resultBlob,
  resultIsZip,
  zipPageCount,
  isPreviewing,
  waitingLabel = "Live preview updates as you change settings.",
  emptyLabel = "Preview appears here after you add files.",
}: PdfLiveOutputProps) {
  const hasResult = Boolean(resultBlob);

  if (!hasResult && !isPreviewing) {
    return <PdfPreviewEmpty label={emptyLabel} />;
  }

  if (!hasResult && isPreviewing) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-[var(--radius-lg)] border border-line bg-paper/60 px-6 py-10 text-center text-sm text-ink-soft/70">
        Updating preview…
      </div>
    );
  }

  return (
    <div className="relative space-y-2">
      <PdfResultPreview
        resultPreviewUrl={resultPreviewUrl}
        resultFilename={resultFilename}
        resultBlob={resultBlob}
        resultIsZip={resultIsZip}
        zipPageCount={zipPageCount}
      />
      {isPreviewing ? (
        <p className="text-xs text-accent-deep">Updating preview…</p>
      ) : null}
      {!hasResult && !isPreviewing ? (
        <p className="text-xs text-ink-soft/55">{waitingLabel}</p>
      ) : null}
    </div>
  );
}

export function PdfPreviewSection({
  children,
  isPreviewing,
}: {
  children: ReactNode;
  isPreviewing?: boolean;
}) {
  return (
    <div className="space-y-3">
      <PdfPreviewHeader
        title={isPreviewing ? "Preview · updating" : "Preview"}
      />
      {children}
    </div>
  );
}
