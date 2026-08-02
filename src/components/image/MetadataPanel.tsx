"use client";

import { useEffect, useState } from "react";
import { ExportFormatSelect } from "@/components/image/ExportFormatSelect";
import {
  PanelActions,
  panelPrimaryBtnClass,
  panelSecondaryBtnClass,
  panelSectionClass,
  panelShellClass,
  rangeInputClass,
} from "@/components/image/PanelChrome";
import { getExportFormat } from "@/lib/image/formats";
import { formatBytes, useImageStore } from "@/stores/imageStore";
import { usePreferencesStore } from "@/stores/preferencesStore";

export function MetadataPanel() {
  const file = useImageStore((s) => s.file);
  const meta = useImageStore((s) => s.meta);
  const isPreviewing = useImageStore((s) => s.isPreviewing);
  const editResult = useImageStore((s) => s.editResult);
  const resultFilename = useImageStore((s) => s.resultFilename);
  const error = useImageStore((s) => s.error);
  const runStripMetadata = useImageStore((s) => s.runStripMetadata);
  const downloadResult = useImageStore((s) => s.downloadResult);
  const clear = useImageStore((s) => s.clear);
  const exportFormatId = usePreferencesStore((s) => s.exportFormatId);

  const [qualityPercent, setQualityPercent] = useState(92);

  const formatOption = getExportFormat(exportFormatId);
  const metadataResult = editResult?.kind === "metadata" ? editResult : null;

  useEffect(() => {
    if (!file || !meta) return;

    const timer = window.setTimeout(() => {
      void runStripMetadata(
        {
          format: formatOption.mime,
          formatId: exportFormatId,
          quality: formatOption.supportsQuality ? qualityPercent / 100 : undefined,
        },
        { silent: true },
      );
    }, 140);

    return () => window.clearTimeout(timer);
  }, [
    file,
    meta,
    exportFormatId,
    formatOption.mime,
    formatOption.supportsQuality,
    qualityPercent,
    runStripMetadata,
  ]);

  return (
    <div className={panelShellClass}>
      <div className={panelSectionClass}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft/60">
            Remove metadata
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft/80">
            Re-encode the image to strip EXIF, GPS, camera, and other embedded metadata. Pixels stay
            the same; hidden data does not.
          </p>
        </div>

        <div className="rounded-md border border-line bg-mist/50 px-3 py-3 text-sm text-ink-soft/80">
          Canvas export rebuilds the file without EXIF tags. Choose PNG to keep transparency; JPG /
          WebP / AVIF for smaller files.
        </div>

        <ExportFormatSelect id="metadata-export-format" disabled={!file} />

        {formatOption.supportsQuality ? (
          <div>
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="metadata-quality" className="text-sm font-semibold text-ink">
                Quality
              </label>
              <span className="text-sm tabular-nums text-ink-soft">{qualityPercent}%</span>
            </div>
            <input
              id="metadata-quality"
              type="range"
              min={1}
              max={100}
              value={qualityPercent}
              disabled={!file}
              onChange={(e) => setQualityPercent(Number(e.target.value))}
              className={rangeInputClass}
            />
            <p className="mt-2 text-xs text-ink-soft/65">
              Use 92%+ for near-lossless look, or lower to shrink file size while stripping
              metadata.
            </p>
          </div>
        ) : null}

        {meta ? (
          <div className="rounded-md border border-line bg-foam/60 px-3 py-3 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-ink-soft/70">Original</span>
              <span className="font-medium tabular-nums text-ink">
                {meta.width}×{meta.height} · {formatBytes(meta.size)}
              </span>
            </div>
            {metadataResult ? (
              <>
                <div className="mt-2 flex justify-between gap-3">
                  <span className="text-ink-soft/70">Clean export</span>
                  <span className="font-medium tabular-nums text-ink">
                    {formatBytes(metadataResult.outputBytes)}
                  </span>
                </div>
                {resultFilename ? (
                  <p className="mt-2 text-xs text-ink-soft/60" title={resultFilename}>
                    File: {resultFilename}
                  </p>
                ) : null}
              </>
            ) : (
              <p className="mt-2 text-xs text-ink-soft/60">
                Upload an image to prepare a metadata-free export.
              </p>
            )}
            {isPreviewing ? (
              <p className="mt-2 text-xs text-accent-deep">Updating preview…</p>
            ) : null}
          </div>
        ) : null}

        {error ? (
          <p className="text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <PanelActions>
        <button
          type="button"
          disabled={!metadataResult}
          onClick={() => downloadResult("metadata")}
          className={panelPrimaryBtnClass}
        >
          Download
        </button>
        {file ? (
          <button type="button" onClick={clear} className={panelSecondaryBtnClass}>
            Start over
          </button>
        ) : null}
      </PanelActions>
    </div>
  );
}
