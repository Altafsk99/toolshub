"use client";

import { useEffect, useMemo, useState } from "react";
import { PdfDocumentPreview } from "@/components/pdf/PdfDocumentPreview";
import { PdfSingleUploader } from "@/components/pdf/PdfSingleUploader";
import { formatBytes, usePdfStore } from "@/stores/pdfStore";
import type { RotatePdfLandingPreset } from "@/types/seo";
import type { RotateAngle, RotateScope } from "@/types/pdf";

type RotatePanelProps = {
  preset?: RotatePdfLandingPreset;
};

export function RotatePanel({ preset }: RotatePanelProps = {}) {
  const singlePdf = usePdfStore((s) => s.singlePdf);
  const resultBlob = usePdfStore((s) => s.resultBlob);
  const resultFilename = usePdfStore((s) => s.resultFilename);
  const resultPreviewUrl = usePdfStore((s) => s.resultPreviewUrl);
  const isPreviewing = usePdfStore((s) => s.isPreviewing);
  const error = usePdfStore((s) => s.error);
  const setSinglePdf = usePdfStore((s) => s.setSinglePdf);
  const runRotate = usePdfStore((s) => s.runRotate);
  const downloadResult = usePdfStore((s) => s.downloadResult);
  const clear = usePdfStore((s) => s.clear);

  const [angle, setAngle] = useState<RotateAngle>(preset?.angle ?? 90);
  const [scope, setScope] = useState<RotateScope>(preset?.scope ?? "all");
  const [fromPage, setFromPage] = useState(1);
  const [toPage, setToPage] = useState(1);

  const pageCount = singlePdf?.meta.pageCount ?? 0;

  useEffect(() => {
    if (singlePdf) {
      setToPage(singlePdf.meta.pageCount);
      setFromPage(1);
    }
  }, [singlePdf]);

  const highlightedPages = useMemo(() => {
    if (!singlePdf || pageCount <= 0) return undefined;

    if (scope === "all") {
      return new Set(Array.from({ length: pageCount }, (_, index) => index + 1));
    }

    const from = Math.max(1, Math.min(fromPage, pageCount));
    const to = Math.max(from, Math.min(toPage, pageCount));
    return new Set(Array.from({ length: to - from + 1 }, (_, index) => from + index));
  }, [singlePdf, pageCount, scope, fromPage, toPage]);

  useEffect(() => {
    if (!singlePdf) return;

    const timer = window.setTimeout(() => {
      void runRotate(
        angle,
        scope,
        scope === "range" ? fromPage : undefined,
        scope === "range" ? toPage : undefined,
        { silent: true },
      );
    }, 320);

    return () => window.clearTimeout(timer);
  }, [singlePdf, angle, scope, fromPage, toPage, runRotate]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        {!singlePdf ? (
          <PdfSingleUploader
            onFileSelected={(file) => void setSinglePdf(file)}
            error={error}
          />
        ) : (
          <PdfDocumentPreview
            file={singlePdf.file}
            pageCount={pageCount}
            fileName={singlePdf.meta.name}
            highlightedPages={highlightedPages}
            resultPreviewUrl={resultPreviewUrl}
            resultFilename={resultFilename}
            resultBlob={resultBlob}
            isPreviewing={isPreviewing}
          />
        )}
      </div>

      <div className="flex h-full flex-col justify-between gap-6 rounded-[var(--radius-lg)] border border-line bg-paper/70 p-5">
        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft/60">
              Rotate PDF
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft/80">
              Turn pages 90°, 180°, or 270° clockwise. The rotated PDF preview updates live as
              you change angle or page range.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Rotation</p>
            <div className="mt-3 flex gap-2">
              {([90, 180, 270] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  disabled={!singlePdf}
                  onClick={() => setAngle(value)}
                  className={`focus-ring flex-1 rounded-md px-3 py-2 text-sm font-semibold transition disabled:opacity-40 ${
                    angle === value
                      ? "bg-ink text-foam"
                      : "bg-mist text-ink-soft hover:bg-mist/80"
                  }`}
                >
                  {value}°
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Apply to</p>
            <div className="mt-3 flex gap-2">
              {(
                [
                  { id: "all" as const, label: "All pages" },
                  { id: "range" as const, label: "Page range" },
                ] as const
              ).map((option) => (
                <button
                  key={option.id}
                  type="button"
                  disabled={!singlePdf}
                  onClick={() => setScope(option.id)}
                  className={`focus-ring flex-1 rounded-md px-3 py-2 text-sm font-semibold transition disabled:opacity-40 ${
                    scope === option.id
                      ? "bg-ink text-foam"
                      : "bg-mist text-ink-soft hover:bg-mist/80"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {scope === "range" && singlePdf ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="rotate-from" className="text-sm font-semibold text-ink">
                  From page
                </label>
                <input
                  id="rotate-from"
                  type="number"
                  min={1}
                  max={pageCount}
                  value={fromPage}
                  onChange={(e) => setFromPage(Number(e.target.value))}
                  className="mt-2 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label htmlFor="rotate-to" className="text-sm font-semibold text-ink">
                  To page
                </label>
                <input
                  id="rotate-to"
                  type="number"
                  min={1}
                  max={pageCount}
                  value={toPage}
                  onChange={(e) => setToPage(Number(e.target.value))}
                  className="mt-2 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm"
                />
              </div>
            </div>
          ) : null}

          {resultBlob ? (
            <div className="rounded-md border border-line bg-foam/60 px-3 py-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-ink-soft/70">Ready</span>
                <span className="font-medium tabular-nums text-ink">
                  {formatBytes(resultBlob.size)}
                </span>
              </div>
              {isPreviewing ? (
                <p className="mt-2 text-xs text-accent-deep">Updating rotated preview…</p>
              ) : null}
            </div>
          ) : null}

          {error && singlePdf ? (
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
          {singlePdf ? (
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
