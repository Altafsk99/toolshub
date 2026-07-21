"use client";

import type { ReactNode } from "react";
import { formatBytes } from "@/stores/pdfStore";

type PreviewMode = "source" | "result";

type PdfPreviewToggleProps = {
  mode: PreviewMode;
  onModeChange: (mode: PreviewMode) => void;
  sourceLabel?: string;
  resultLabel?: string;
  showResult?: boolean;
};

export function PdfPreviewToggle({
  mode,
  onModeChange,
  sourceLabel = "Source",
  resultLabel = "Result",
  showResult = true,
}: PdfPreviewToggleProps) {
  if (!showResult) return null;

  return (
    <div className="flex gap-1 rounded-md bg-mist p-1">
      <button
        type="button"
        onClick={() => onModeChange("source")}
        className={`focus-ring rounded px-3 py-1.5 text-xs font-semibold transition ${
          mode === "source" ? "bg-paper text-ink shadow-sm" : "text-ink-soft"
        }`}
      >
        {sourceLabel}
      </button>
      <button
        type="button"
        onClick={() => onModeChange("result")}
        className={`focus-ring rounded px-3 py-1.5 text-xs font-semibold transition ${
          mode === "result" ? "bg-paper text-ink shadow-sm" : "text-ink-soft"
        }`}
      >
        {resultLabel}
      </button>
    </div>
  );
}

type PdfResultPreviewProps = {
  resultPreviewUrl?: string | null;
  resultFilename?: string | null;
  resultBlob?: Blob | null;
  resultIsZip?: boolean;
  zipPageCount?: number;
};

export function PdfResultPreview({
  resultPreviewUrl,
  resultFilename,
  resultBlob,
  resultIsZip,
  zipPageCount,
}: PdfResultPreviewProps) {
  if (resultIsZip && resultBlob) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-[var(--radius-lg)] border border-line bg-foam/60 px-6 py-10 text-center">
        <p className="font-display text-xl font-semibold text-ink">ZIP ready</p>
        <p className="mt-2 max-w-sm text-sm text-ink-soft/75">
          {zipPageCount
            ? `${zipPageCount} separate PDFs packaged in the archive.`
            : "Separate PDF files packaged in the archive."}{" "}
          Download to extract on your device.
        </p>
        <p className="mt-4 text-xs text-ink-soft/60">
          {resultFilename} · {formatBytes(resultBlob.size)}
        </p>
      </div>
    );
  }

  if (!resultPreviewUrl) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-line bg-paper/50 px-6 py-10 text-center text-sm text-ink-soft/70">
        Result preview appears here after processing.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-line bg-foam/60">
      <iframe
        src={resultPreviewUrl}
        title={resultFilename ?? "PDF preview"}
        className="h-[min(70vh,520px)] w-full bg-white"
      />
      {resultBlob ? (
        <p className="border-t border-line px-4 py-2 text-xs text-ink-soft/70">
          {resultFilename} · {formatBytes(resultBlob.size)}
        </p>
      ) : null}
    </div>
  );
}

const checkerboard =
  "bg-[linear-gradient(45deg,color-mix(in_oklab,var(--ink)_4%,transparent)_25%,transparent_25%,transparent_75%,color-mix(in_oklab,var(--ink)_4%,transparent)_75%)] bg-[length:16px_16px]";

type PdfLargePageProps = {
  thumbnailUrl?: string;
  label: string;
  meta?: string;
  loading?: boolean;
};

export function PdfLargePage({ thumbnailUrl, label, meta, loading }: PdfLargePageProps) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-line bg-foam/60">
      <div
        className={`flex max-h-[min(50vh,420px)] min-h-48 items-center justify-center p-4 ${checkerboard}`}
      >
        {loading ? (
          <p className="text-sm text-ink-soft/70">Loading preview…</p>
        ) : thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailUrl}
            alt={label}
            className="max-h-[min(48vh,400px)] max-w-full object-contain shadow-sm"
          />
        ) : (
          <p className="text-sm text-ink-soft/70">Preview unavailable</p>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-2.5 text-xs text-ink-soft/75">
        <span className="truncate font-medium text-ink" title={label}>
          {label}
        </span>
        {meta ? <span className="shrink-0 tabular-nums">{meta}</span> : null}
      </div>
    </div>
  );
}

type PdfThumbnailStripProps = {
  items: {
    key: string;
    pageNumber: number;
    thumbnailUrl?: string;
    highlighted?: boolean;
    label?: string;
  }[];
  activeKey?: string;
  onSelect: (key: string) => void;
  loading?: boolean;
};

export function PdfThumbnailStrip({
  items,
  activeKey,
  onSelect,
  loading,
}: PdfThumbnailStripProps) {
  if (items.length === 0 && loading) {
    return <p className="text-xs text-ink-soft/70">Generating page previews…</p>;
  }

  return (
    <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
      {items.map((item) => (
        <li key={item.key}>
          <button
            type="button"
            onClick={() => onSelect(item.key)}
            className={`focus-ring relative aspect-[3/4] w-full overflow-hidden rounded-md border bg-foam transition ${
              item.highlighted ? "ring-1 ring-accent/40" : ""
            } ${
              activeKey === item.key
                ? "border-accent ring-2 ring-accent/30"
                : "border-line hover:border-accent/40"
            }`}
          >
            {item.thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.thumbnailUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full items-center justify-center text-[10px] text-ink-soft/50">
                …
              </span>
            )}
            <span className="absolute left-1.5 top-1.5 rounded bg-ink/75 px-1.5 py-0.5 text-[10px] font-semibold text-foam">
              {item.label ?? item.pageNumber}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export function PdfPreviewEmpty({ label }: { label: string }) {
  return (
    <div className="flex min-h-64 items-center justify-center rounded-[var(--radius-lg)] border border-line bg-paper/60 px-6 py-10 text-center text-sm text-ink-soft/70">
      {label}
    </div>
  );
}

export function PdfPreviewHeader({
  title = "Preview",
  toggle,
}: {
  title?: string;
  toggle?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft/60">
        {title}
      </p>
      {toggle}
    </div>
  );
}
