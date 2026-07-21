"use client";

import { useEffect } from "react";
import { PdfMergePreview } from "@/components/pdf/PdfMergePreview";
import { PdfMultiUploader } from "@/components/pdf/PdfMultiUploader";
import { pdfDetail, ReorderableFileList } from "@/components/pdf/ReorderableFileList";
import { formatBytes, usePdfStore } from "@/stores/pdfStore";

export function MergePanel() {
  const pdfFiles = usePdfStore((s) => s.pdfFiles);
  const resultBlob = usePdfStore((s) => s.resultBlob);
  const resultFilename = usePdfStore((s) => s.resultFilename);
  const resultPreviewUrl = usePdfStore((s) => s.resultPreviewUrl);
  const isPreviewing = usePdfStore((s) => s.isPreviewing);
  const error = usePdfStore((s) => s.error);
  const addPdfFiles = usePdfStore((s) => s.addPdfFiles);
  const removePdfFile = usePdfStore((s) => s.removePdfFile);
  const movePdfFile = usePdfStore((s) => s.movePdfFile);
  const runMerge = usePdfStore((s) => s.runMerge);
  const downloadResult = usePdfStore((s) => s.downloadResult);
  const clear = usePdfStore((s) => s.clear);

  const totalPages = pdfFiles.reduce((sum, entry) => sum + entry.meta.pageCount, 0);
  const fileKey = pdfFiles.map((entry) => entry.meta.id).join("|");

  useEffect(() => {
    if (pdfFiles.length < 2) return;
    const timer = window.setTimeout(() => {
      void runMerge({ silent: true });
    }, 320);
    return () => window.clearTimeout(timer);
  }, [fileKey, pdfFiles.length, runMerge]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        {pdfFiles.length === 0 ? (
          <PdfMultiUploader
            onFilesSelected={(files) => void addPdfFiles(files)}
            error={error}
          />
        ) : (
          <>
            <PdfMergePreview
              files={pdfFiles.map((entry) => ({
                id: entry.meta.id,
                name: entry.meta.name,
                pageCount: entry.meta.pageCount,
                file: entry.file,
              }))}
              totalPages={totalPages}
              resultPreviewUrl={resultPreviewUrl}
              resultFilename={resultFilename}
              resultBlob={resultBlob}
              isPreviewing={isPreviewing}
            />
            <ReorderableFileList
              items={pdfFiles.map((entry) => ({
                id: entry.meta.id,
                name: entry.meta.name,
                detail: pdfDetail(entry.meta.size, entry.meta.pageCount),
              }))}
              onRemove={removePdfFile}
              onMove={movePdfFile}
              emptyLabel="Add PDF files to merge."
            />
            <PdfMultiUploader
              label="Add more PDFs"
              hint="Drop additional files or click to browse."
              onFilesSelected={(files) => void addPdfFiles(files)}
              error={null}
            />
          </>
        )}
      </div>

      <div className="flex h-full flex-col justify-between gap-6 rounded-[var(--radius-lg)] border border-line bg-paper/70 p-5">
        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft/60">
              Merge PDF
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft/80">
              Combine multiple PDFs in order. The merged preview updates live as you add or
              reorder files — all processing stays in your browser.
            </p>
          </div>

          {pdfFiles.length > 0 ? (
            <div className="rounded-md border border-line bg-foam/60 px-3 py-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-ink-soft/70">Files</span>
                <span className="font-medium tabular-nums text-ink">{pdfFiles.length}</span>
              </div>
              <div className="mt-2 flex justify-between gap-3">
                <span className="text-ink-soft/70">Total pages</span>
                <span className="font-medium tabular-nums text-ink">{totalPages}</span>
              </div>
              {resultBlob && resultFilename ? (
                <div className="mt-2 flex justify-between gap-3">
                  <span className="text-ink-soft/70">Output</span>
                  <span className="font-medium tabular-nums text-ink">
                    {formatBytes(resultBlob.size)}
                  </span>
                </div>
              ) : null}
              {isPreviewing ? (
                <p className="mt-2 text-xs text-accent-deep">Updating merged preview…</p>
              ) : null}
            </div>
          ) : null}

          {error && pdfFiles.length > 0 ? (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={!resultBlob || isPreviewing}
            onClick={downloadResult}
            className="focus-ring inline-flex h-11 items-center justify-center rounded-md bg-ink px-5 text-sm font-semibold text-foam transition hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-40"
          >
            Download
          </button>
          {pdfFiles.length > 0 ? (
            <button
              type="button"
              onClick={clear}
              className="focus-ring h-11 rounded-md px-4 text-sm font-medium text-ink-soft transition hover:bg-mist"
            >
              Start over
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
