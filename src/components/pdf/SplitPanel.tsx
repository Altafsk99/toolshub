"use client";

import { useEffect, useMemo, useState } from "react";
import { PdfDocumentPreview } from "@/components/pdf/PdfDocumentPreview";
import { PdfSingleUploader } from "@/components/pdf/PdfSingleUploader";
import { formatBytes, usePdfStore } from "@/stores/pdfStore";
import type { SplitPdfLandingPreset } from "@/types/seo";
import type { SplitMode } from "@/types/pdf";

type SplitPanelProps = {
  preset?: SplitPdfLandingPreset;
};

export function SplitPanel({ preset }: SplitPanelProps = {}) {
  const singlePdf = usePdfStore((s) => s.singlePdf);
  const resultBlob = usePdfStore((s) => s.resultBlob);
  const resultFilename = usePdfStore((s) => s.resultFilename);
  const resultPreviewUrl = usePdfStore((s) => s.resultPreviewUrl);
  const isPreviewing = usePdfStore((s) => s.isPreviewing);
  const error = usePdfStore((s) => s.error);
  const setSinglePdf = usePdfStore((s) => s.setSinglePdf);
  const runSplit = usePdfStore((s) => s.runSplit);
  const downloadResult = usePdfStore((s) => s.downloadResult);
  const clear = usePdfStore((s) => s.clear);

  const [mode, setMode] = useState<SplitMode>(preset?.mode ?? "every-page");
  const [fromPage, setFromPage] = useState(preset?.fromPage ?? 1);
  const [toPage, setToPage] = useState(preset?.toPage ?? 1);
  const [extractInput, setExtractInput] = useState("1");

  const pageCount = singlePdf?.meta.pageCount ?? 0;
  const resultIsZip = Boolean(resultFilename?.toLowerCase().endsWith(".zip"));

  useEffect(() => {
    if (singlePdf) {
      setToPage(singlePdf.meta.pageCount);
      setFromPage(1);
    }
  }, [singlePdf]);

  const highlightedPages = useMemo(() => {
    if (!singlePdf || pageCount <= 0) return undefined;

    if (mode === "every-page") {
      return new Set(Array.from({ length: pageCount }, (_, index) => index + 1));
    }

    if (mode === "range") {
      const from = Math.max(1, Math.min(fromPage, pageCount));
      const to = Math.max(from, Math.min(toPage, pageCount));
      return new Set(Array.from({ length: to - from + 1 }, (_, index) => from + index));
    }

    const pages = extractInput
      .split(/[,\s]+/)
      .map((value) => Number.parseInt(value.trim(), 10))
      .filter((value) => Number.isFinite(value) && value >= 1 && value <= pageCount);
    return new Set(pages);
  }, [singlePdf, pageCount, mode, fromPage, toPage, extractInput]);

  useEffect(() => {
    if (!singlePdf) return;

    const timer = window.setTimeout(() => {
      if (mode === "range") {
        void runSplit("range", { fromPage, toPage }, { silent: true });
        return;
      }
      if (mode === "extract") {
        const pages = extractInput
          .split(/[,\s]+/)
          .map((value) => Number.parseInt(value.trim(), 10))
          .filter((value) => Number.isFinite(value));
        void runSplit("extract", { pages }, { silent: true });
        return;
      }
      void runSplit("every-page", {}, { silent: true });
    }, 320);

    return () => window.clearTimeout(timer);
  }, [singlePdf, mode, fromPage, toPage, extractInput, runSplit]);

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
            resultIsZip={resultIsZip}
            zipPageCount={resultIsZip ? pageCount : undefined}
            isPreviewing={isPreviewing}
          />
        )}
      </div>

      <div className="flex h-full flex-col justify-between gap-6 rounded-[var(--radius-lg)] border border-line bg-paper/70 p-5">
        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft/60">
              Split PDF
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft/80">
              Extract pages or split every page into separate files. Preview updates live as
              you change the mode or page selection.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Mode</p>
            <div className="mt-3 grid gap-2">
              {(
                [
                  { id: "every-page" as const, label: "Every page (ZIP)" },
                  { id: "range" as const, label: "Page range" },
                  { id: "extract" as const, label: "Pick pages" },
                ] as const
              ).map((option) => (
                <button
                  key={option.id}
                  type="button"
                  disabled={!singlePdf}
                  onClick={() => setMode(option.id)}
                  className={`focus-ring rounded-md px-3 py-2 text-left text-sm font-semibold transition disabled:opacity-40 ${
                    mode === option.id
                      ? "bg-ink text-foam"
                      : "bg-mist text-ink-soft hover:bg-mist/80"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {mode === "range" && singlePdf ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="split-from" className="text-sm font-semibold text-ink">
                  From page
                </label>
                <input
                  id="split-from"
                  type="number"
                  min={1}
                  max={pageCount}
                  value={fromPage}
                  onChange={(e) => setFromPage(Number(e.target.value))}
                  className="mt-2 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label htmlFor="split-to" className="text-sm font-semibold text-ink">
                  To page
                </label>
                <input
                  id="split-to"
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

          {mode === "extract" && singlePdf ? (
            <div>
              <label htmlFor="split-pages" className="text-sm font-semibold text-ink">
                Pages (comma-separated)
              </label>
              <input
                id="split-pages"
                type="text"
                value={extractInput}
                onChange={(e) => setExtractInput(e.target.value)}
                placeholder="e.g. 1, 3, 5"
                className="mt-2 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm"
              />
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
                <p className="mt-2 text-xs text-accent-deep">Updating split preview…</p>
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
