"use client";

import { useEffect, useState } from "react";
import { ImageMultiUploader } from "@/components/pdf/ImageMultiUploader";
import { ImagesToPdfPreview } from "@/components/pdf/ImagesToPdfPreview";
import { imageDetail, ReorderableFileList } from "@/components/pdf/ReorderableFileList";
import { formatBytes, usePdfStore } from "@/stores/pdfStore";
import type { ImagesToPdfLandingPreset } from "@/types/seo";
import type { ImagePageSize } from "@/types/pdf";

type ImagesToPdfPanelProps = {
  preset?: ImagesToPdfLandingPreset;
};

export function ImagesToPdfPanel({ preset }: ImagesToPdfPanelProps = {}) {
  const imageFiles = usePdfStore((s) => s.imageFiles);
  const resultBlob = usePdfStore((s) => s.resultBlob);
  const isPreviewing = usePdfStore((s) => s.isPreviewing);
  const error = usePdfStore((s) => s.error);
  const addImageFiles = usePdfStore((s) => s.addImageFiles);
  const removeImageFile = usePdfStore((s) => s.removeImageFile);
  const moveImageFile = usePdfStore((s) => s.moveImageFile);
  const runImagesToPdf = usePdfStore((s) => s.runImagesToPdf);
  const downloadResult = usePdfStore((s) => s.downloadResult);
  const clear = usePdfStore((s) => s.clear);

  const [pageSize, setPageSize] = useState<ImagePageSize>(preset?.pageSize ?? "a4");
  const imageKey = imageFiles.map((entry) => entry.meta.id).join("|");

  useEffect(() => {
    if (imageFiles.length === 0) return;
    const timer = window.setTimeout(() => {
      void runImagesToPdf(pageSize, { silent: true });
    }, 320);
    return () => window.clearTimeout(timer);
  }, [imageKey, imageFiles.length, pageSize, runImagesToPdf]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        {imageFiles.length === 0 ? (
          <ImageMultiUploader
            onFilesSelected={(files) => void addImageFiles(files)}
            error={error}
          />
        ) : (
          <>
            <ImagesToPdfPreview />
            <ReorderableFileList
              items={imageFiles.map((entry) => ({
                id: entry.meta.id,
                name: entry.meta.name,
                detail: imageDetail(entry.meta.width, entry.meta.height, entry.meta.size),
                thumbnailUrl: entry.previewUrl,
              }))}
              onRemove={removeImageFile}
              onMove={moveImageFile}
              emptyLabel="Add images to convert."
            />
            <ImageMultiUploader
              onFilesSelected={(files) => void addImageFiles(files)}
              error={null}
            />
          </>
        )}
      </div>

      <div className="flex h-full flex-col justify-between gap-6 rounded-[var(--radius-lg)] border border-line bg-paper/70 p-5">
        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft/60">
              Images to PDF
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft/80">
              Turn JPG, PNG, and WebP files into a single PDF. Preview updates live as you add,
              reorder, or change page size.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Page size</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(
                [
                  { id: "a4" as const, label: "A4" },
                  { id: "letter" as const, label: "Letter" },
                  { id: "fit" as const, label: "Fit to image" },
                ] as const
              ).map((option) => (
                <button
                  key={option.id}
                  type="button"
                  disabled={imageFiles.length === 0}
                  onClick={() => setPageSize(option.id)}
                  className={`focus-ring rounded-md px-3 py-2 text-sm font-semibold transition disabled:opacity-40 ${
                    pageSize === option.id
                      ? "bg-ink text-foam"
                      : "bg-mist text-ink-soft hover:bg-mist/80"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {imageFiles.length > 0 ? (
            <div className="rounded-md border border-line bg-foam/60 px-3 py-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-ink-soft/70">Images</span>
                <span className="font-medium tabular-nums text-ink">{imageFiles.length}</span>
              </div>
              {resultBlob ? (
                <div className="mt-2 flex justify-between gap-3">
                  <span className="text-ink-soft/70">Output PDF</span>
                  <span className="font-medium tabular-nums text-ink">
                    {formatBytes(resultBlob.size)}
                  </span>
                </div>
              ) : null}
              {isPreviewing ? (
                <p className="mt-2 text-xs text-accent-deep">Updating PDF preview…</p>
              ) : null}
            </div>
          ) : null}

          {error && imageFiles.length > 0 ? (
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
          {imageFiles.length > 0 ? (
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
