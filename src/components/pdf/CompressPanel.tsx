"use client";

import { useEffect, useMemo, useState } from "react";
import { PdfDocumentPreview } from "@/components/pdf/PdfDocumentPreview";
import { PdfSingleUploader } from "@/components/pdf/PdfSingleUploader";
import { getCompressLevelSettings } from "@/lib/pdf/compress";
import { formatBytes, usePdfStore } from "@/stores/pdfStore";
import type { CompressPdfLandingPreset } from "@/types/seo";
import type { PdfCompressLevel } from "@/types/pdf";

const LEVELS: { id: PdfCompressLevel; help: string }[] = [
  {
    id: "high",
    help: "Best readability. Milder size reduction.",
  },
  {
    id: "balanced",
    help: "Good default for email and forms.",
  },
  {
    id: "small",
    help: "Strongest shrink. Text may look softer.",
  },
];

type CompressPanelProps = {
  preset?: CompressPdfLandingPreset;
};

export function CompressPanel({ preset }: CompressPanelProps = {}) {
  const singlePdf = usePdfStore((s) => s.singlePdf);
  const resultBlob = usePdfStore((s) => s.resultBlob);
  const resultFilename = usePdfStore((s) => s.resultFilename);
  const resultPreviewUrl = usePdfStore((s) => s.resultPreviewUrl);
  const compressOriginalBytes = usePdfStore((s) => s.compressOriginalBytes);
  const compressOutputBytes = usePdfStore((s) => s.compressOutputBytes);
  const isPreviewing = usePdfStore((s) => s.isPreviewing);
  const error = usePdfStore((s) => s.error);
  const setSinglePdf = usePdfStore((s) => s.setSinglePdf);
  const runCompress = usePdfStore((s) => s.runCompress);
  const downloadResult = usePdfStore((s) => s.downloadResult);
  const clear = usePdfStore((s) => s.clear);

  const [level, setLevel] = useState<PdfCompressLevel>(preset?.level ?? "balanced");

  const pageCount = singlePdf?.meta.pageCount ?? 0;

  const savedLabel = useMemo(() => {
    if (compressOriginalBytes == null || compressOutputBytes == null) return null;
    const saved = compressOriginalBytes - compressOutputBytes;
    const pct =
      compressOriginalBytes > 0
        ? Math.round((saved / compressOriginalBytes) * 100)
        : 0;
    return { saved, pct };
  }, [compressOriginalBytes, compressOutputBytes]);

  useEffect(() => {
    if (!singlePdf) return;

    const timer = window.setTimeout(() => {
      void runCompress(level, { silent: true });
    }, 400);

    return () => window.clearTimeout(timer);
  }, [singlePdf, level, runCompress]);

  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
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
            resultPreviewUrl={resultPreviewUrl}
            resultFilename={resultFilename}
            resultBlob={resultBlob}
            isPreviewing={isPreviewing}
          />
        )}
      </div>

      <div className="flex h-full flex-col justify-between gap-5 rounded-[var(--radius-lg)] border border-line bg-paper/70 p-4 sm:gap-6 sm:p-5">
        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft/60">
              Compress PDF
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft/80">
              Shrink PDF file size in your browser. Pages are re-encoded as compressed images —
              nothing is uploaded.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Compression level</p>
            <div className="mt-3 flex flex-col gap-2">
              {LEVELS.map((option) => {
                const settings = getCompressLevelSettings(option.id);
                return (
                  <label
                    key={option.id}
                    className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-md border px-3 py-3 transition ${
                      level === option.id
                        ? "border-accent bg-mist/80"
                        : "border-line bg-paper/60 hover:border-accent/40"
                    } ${!singlePdf ? "opacity-40" : ""}`}
                  >
                    <input
                      type="radio"
                      name="pdf-compress-level"
                      checked={level === option.id}
                      disabled={!singlePdf}
                      onChange={() => setLevel(option.id)}
                      className="mt-0.5 accent-[var(--accent)]"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-ink">
                        {settings.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-ink-soft/70">
                        {option.help}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {singlePdf ? (
            <div className="rounded-md border border-line bg-foam/60 px-3 py-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-ink-soft/70">Original</span>
                <span className="font-medium tabular-nums text-ink">
                  {formatBytes(compressOriginalBytes ?? singlePdf.meta.size)}
                </span>
              </div>
              {compressOutputBytes != null ? (
                <>
                  <div className="mt-2 flex justify-between gap-3">
                    <span className="text-ink-soft/70">Compressed</span>
                    <span className="font-medium tabular-nums text-ink">
                      {formatBytes(compressOutputBytes)}
                    </span>
                  </div>
                  {savedLabel ? (
                    <div className="mt-2 flex justify-between gap-3">
                      <span className="text-ink-soft/70">Saved</span>
                      <span
                        className={`font-semibold tabular-nums ${
                          savedLabel.saved > 0 ? "text-accent-deep" : "text-ink-soft"
                        }`}
                      >
                        {formatBytes(Math.max(0, savedLabel.saved))} ({savedLabel.pct}%)
                      </span>
                    </div>
                  ) : null}
                  {savedLabel && savedLabel.saved <= 0 ? (
                    <p className="mt-2 text-xs text-ink-soft/65">
                      File didn’t get smaller — try Smallest, or the PDF may already be highly
                      compressed.
                    </p>
                  ) : null}
                </>
              ) : (
                <p className="mt-2 text-xs text-ink-soft/60">
                  {isPreviewing
                    ? "Compressing pages…"
                    : "Pick a level to compress this PDF."}
                </p>
              )}
              {isPreviewing ? (
                <p className="mt-2 text-xs text-accent-deep">Updating compressed preview…</p>
              ) : null}
            </div>
          ) : null}

          {error && singlePdf ? (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          <button
            type="button"
            disabled={!resultBlob || isPreviewing}
            onClick={downloadResult}
            className="focus-ring inline-flex min-h-11 w-full items-center justify-center rounded-md bg-ink px-5 text-sm font-semibold text-foam transition hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            Download
          </button>
          {singlePdf ? (
            <button
              type="button"
              onClick={clear}
              className="focus-ring inline-flex min-h-11 w-full items-center justify-center rounded-md border border-line bg-paper px-4 text-sm font-medium text-ink-soft transition hover:bg-mist sm:w-auto sm:border-0 sm:bg-transparent"
            >
              Start over
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
