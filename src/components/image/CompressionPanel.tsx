"use client";

import { useEffect, useMemo, useState } from "react";
import { ExportFormatSelect } from "@/components/image/ExportFormatSelect";
import {
  PanelActions,
  chipClass,
  modeTabClass,
  panelPrimaryBtnClass,
  panelSecondaryBtnClass,
  panelSectionClass,
  panelShellClass,
  rangeInputClass,
} from "@/components/image/PanelChrome";
import { getExportFormat } from "@/lib/image/formats";
import { formatBytes, useImageStore } from "@/stores/imageStore";
import { usePreferencesStore } from "@/stores/preferencesStore";
import type { ExportFormatId } from "@/lib/image/formats";
import type { CompressLandingPreset } from "@/types/seo";
import type { CompressMode } from "@/types/image";

const KB_PRESETS = [20, 50, 100, 200] as const;

type CompressionPanelProps = {
  preset?: CompressLandingPreset;
};

export function CompressionPanel({ preset }: CompressionPanelProps = {}) {
  const file = useImageStore((s) => s.file);
  const meta = useImageStore((s) => s.meta);
  const batchFiles = useImageStore((s) => s.batchFiles);
  const batchResults = useImageStore((s) => s.batchResults);
  const batchProgress = useImageStore((s) => s.batchProgress);
  const isProcessing = useImageStore((s) => s.isProcessing);
  const isPreviewing = useImageStore((s) => s.isPreviewing);
  const compressResult = useImageStore((s) => s.compressResult);
  const resultFilename = useImageStore((s) => s.resultFilename);
  const error = useImageStore((s) => s.error);
  const runCompress = useImageStore((s) => s.runCompress);
  const runCompressBatch = useImageStore((s) => s.runCompressBatch);
  const downloadBatchZip = useImageStore((s) => s.downloadBatchZip);
  const downloadResult = useImageStore((s) => s.downloadResult);
  const clear = useImageStore((s) => s.clear);
  const exportFormatId = usePreferencesStore((s) => s.exportFormatId);
  const setExportFormatId = usePreferencesStore((s) => s.setExportFormatId);

  const isBatch = batchFiles.length > 1;
  const hasInput = Boolean(file) || isBatch;

  const [mode, setMode] = useState<CompressMode>(preset?.mode ?? "quality");
  const [qualityPercent, setQualityPercent] = useState(preset?.qualityPercent ?? 70);
  const [targetKb, setTargetKb] = useState(preset?.targetKb ?? 100);
  const [customKb, setCustomKb] = useState(String(preset?.targetKb ?? 100));
  const [localFormatId, setLocalFormatId] = useState<ExportFormatId | null>(
    preset?.formatId ?? null,
  );

  const activeFormatId = localFormatId ?? exportFormatId;
  const formatOption = getExportFormat(activeFormatId);
  const debounceMs = mode === "target" ? 320 : 140;

  const compressOptions = useMemo(
    () => ({
      mode,
      qualityPercent,
      targetKb: mode === "target" ? targetKb : undefined,
      format: formatOption.mime,
      formatId: activeFormatId,
    }),
    [mode, qualityPercent, targetKb, formatOption.mime, activeFormatId],
  );

  const setActiveFormat = (id: ExportFormatId) => {
    if (preset?.formatId) {
      setLocalFormatId(id);
    } else {
      setExportFormatId(id);
    }
  };

  useEffect(() => {
    if (isBatch || !file || !meta) return;
    if (mode === "target" && (!Number.isFinite(targetKb) || targetKb < 1)) return;

    const timer = window.setTimeout(() => {
      void runCompress(compressOptions, { silent: true });
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [
    isBatch,
    file,
    meta,
    compressOptions,
    debounceMs,
    runCompress,
    mode,
    targetKb,
  ]);

  const savedLabel = useMemo(() => {
    if (!compressResult) return null;
    const saved = compressResult.originalBytes - compressResult.outputBytes;
    const pct =
      compressResult.originalBytes > 0
        ? Math.round((saved / compressResult.originalBytes) * 100)
        : 0;
    return { saved, pct };
  }, [compressResult]);

  const batchTotals = useMemo(() => {
    if (batchResults.length === 0) return null;
    const originalBytes = batchResults.reduce((sum, item) => sum + item.originalBytes, 0);
    const outputBytes = batchResults.reduce((sum, item) => sum + item.outputBytes, 0);
    const saved = originalBytes - outputBytes;
    const pct = originalBytes > 0 ? Math.round((saved / originalBytes) * 100) : 0;
    return { originalBytes, outputBytes, saved, pct };
  }, [batchResults]);

  const applyPreset = (kb: number) => {
    setMode("target");
    setTargetKb(kb);
    setCustomKb(String(kb));
  };

  const applyCustomKb = (value: string) => {
    setCustomKb(value);
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed > 0) {
      setMode("target");
      setTargetKb(Math.round(parsed));
    }
  };

  return (
    <div className={panelShellClass}>
      <div className={panelSectionClass}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft/60">
            Compression
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft/80">
            {isBatch
              ? "Same settings for every file. Compress all, then download a ZIP."
              : "Preview and file size update live. Export format is shared across all tools."}
          </p>
        </div>

        <ExportFormatSelect
          id="compress-export-format"
          disabled={!hasInput}
          value={preset?.formatId ? activeFormatId : undefined}
          onChange={preset?.formatId ? setLocalFormatId : undefined}
        />

        <div className="flex gap-2 rounded-md bg-mist/70 p-1">
          <button
            type="button"
            onClick={() => setMode("quality")}
            className={modeTabClass(mode === "quality")}
          >
            Quality
          </button>
          <button
            type="button"
            onClick={() => setMode("target")}
            className={modeTabClass(mode === "target")}
          >
            Target size
          </button>
        </div>

        {mode === "quality" ? (
          formatOption.supportsQuality ? (
            <div>
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="quality" className="text-sm font-semibold text-ink">
                  Quality
                </label>
                <span className="text-sm tabular-nums text-ink-soft">{qualityPercent}%</span>
              </div>
              <input
                id="quality"
                type="range"
                min={1}
                max={100}
                value={qualityPercent}
                onChange={(e) => setQualityPercent(Number(e.target.value))}
                disabled={!hasInput}
                className={rangeInputClass}
              />
              <p className="mt-2 text-xs text-ink-soft/65">
                Lower quality = smaller file. Higher quality = better detail.
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-line bg-mist/50 px-3 py-3">
              <p className="text-sm font-semibold text-ink">
                {formatOption.label} won’t shrink with quality
              </p>
              <p className="mt-1 text-xs leading-relaxed text-ink-soft/70">
                PNG is lossless. Switch to JPG or WebP to compress, or use Target size.
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {(["jpg", "webp", "avif"] as const).map((id) => (
                  <button
                    key={id}
                    type="button"
                    disabled={!hasInput}
                    onClick={() => setActiveFormat(id)}
                    className={chipClass(false)}
                  >
                    {id.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          )
        ) : (
          <div>
            <label className="text-sm font-semibold text-ink">Target size (KB)</label>
            {!formatOption.supportsQuality ? (
              <p className="mt-1 text-xs text-ink-soft/65">
                Tip: JPG or WebP usually hit KB targets more easily than PNG.
              </p>
            ) : null}
            <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              {KB_PRESETS.map((kb) => (
                <button
                  key={kb}
                  type="button"
                  disabled={!hasInput}
                  onClick={() => applyPreset(kb)}
                  className={chipClass(targetKb === kb)}
                >
                  {kb} KB
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <input
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                value={customKb}
                disabled={!hasInput}
                onChange={(e) => applyCustomKb(e.target.value)}
                className="focus-ring min-h-11 w-28 rounded-md border border-line bg-paper px-3 py-2 text-base tabular-nums disabled:opacity-40 sm:text-sm"
                aria-label="Custom target size in KB"
              />
              <span className="text-sm text-ink-soft/70">KB (custom)</span>
            </div>
          </div>
        )}

        {isBatch ? (
          <div className="space-y-3">
            <ul className="max-h-56 space-y-2 overflow-y-auto rounded-md border border-line bg-foam/60 p-3 text-sm">
              {batchFiles.map((batchFile, index) => {
                const matched = batchResults[index] ?? null;
                const status =
                  matched != null
                    ? formatBytes(matched.outputBytes)
                    : isProcessing && batchProgress && batchProgress.done === index
                      ? "Compressing…"
                      : "Waiting";

                return (
                  <li
                    key={`${batchFile.name}-${index}`}
                    className="flex items-start justify-between gap-3 border-b border-line/60 pb-2 last:border-0 last:pb-0"
                  >
                    <span className="min-w-0 truncate font-medium text-ink" title={batchFile.name}>
                      {batchFile.name}
                    </span>
                    <span className="shrink-0 text-right text-xs tabular-nums text-ink-soft">
                      <span className="block">{formatBytes(batchFile.size)}</span>
                      <span className="mt-0.5 block text-accent-deep">{status}</span>
                    </span>
                  </li>
                );
              })}
            </ul>

            {batchProgress ? (
              <p className="text-xs text-ink-soft/70">
                Progress: {batchProgress.done} / {batchProgress.total}
                {isProcessing ? " — compressing…" : null}
              </p>
            ) : null}

            {batchTotals ? (
              <div className="rounded-md border border-line bg-foam/60 px-3 py-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-ink-soft/70">Original</span>
                  <span className="font-medium tabular-nums text-ink">
                    {formatBytes(batchTotals.originalBytes)}
                  </span>
                </div>
                <div className="mt-2 flex justify-between gap-3">
                  <span className="text-ink-soft/70">Compressed</span>
                  <span className="font-medium tabular-nums text-ink">
                    {formatBytes(batchTotals.outputBytes)}
                  </span>
                </div>
                <div className="mt-2 flex justify-between gap-3">
                  <span className="text-ink-soft/70">Saved</span>
                  <span
                    className={`font-semibold tabular-nums ${
                      batchTotals.saved > 0 ? "text-accent-deep" : "text-ink-soft"
                    }`}
                  >
                    {formatBytes(Math.max(0, batchTotals.saved))} ({batchTotals.pct}%)
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        ) : meta ? (
          <div className="rounded-md border border-line bg-foam/60 px-3 py-3 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-ink-soft/70">Original</span>
              <span className="font-medium tabular-nums text-ink">
                {formatBytes(meta.size)}
              </span>
            </div>
            {compressResult ? (
              <>
                <div className="mt-2 flex justify-between gap-3">
                  <span className="text-ink-soft/70">Compressed</span>
                  <span className="font-medium tabular-nums text-ink">
                    {formatBytes(compressResult.outputBytes)}
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
                {savedLabel && savedLabel.saved <= 0 && !formatOption.supportsQuality ? (
                  <p className="mt-2 text-xs text-ink-soft/65">
                    No size change yet — pick JPG/WebP above, or switch to Target size.
                  </p>
                ) : null}
                {resultFilename ? (
                  <p className="mt-2 text-xs text-ink-soft/60" title={resultFilename}>
                    File: {resultFilename}
                  </p>
                ) : null}
              </>
            ) : (
              <p className="mt-2 text-xs text-ink-soft/60">
                Adjust controls to see live compressed size.
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
        {isBatch ? (
          <>
            <button
              type="button"
              disabled={!hasInput || isProcessing}
              onClick={() => void runCompressBatch(compressOptions)}
              className={panelPrimaryBtnClass}
            >
              {isProcessing ? "Compressing…" : "Compress all"}
            </button>
            <button
              type="button"
              disabled={batchResults.length === 0 || isProcessing}
              onClick={() => void downloadBatchZip()}
              className={panelSecondaryBtnClass}
            >
              Download ZIP
            </button>
          </>
        ) : (
          <button
            type="button"
            disabled={!compressResult}
            onClick={() => downloadResult("compress")}
            className={panelPrimaryBtnClass}
          >
            Download
          </button>
        )}
        {hasInput ? (
          <button type="button" onClick={clear} className={panelSecondaryBtnClass}>
            Start over
          </button>
        ) : null}
      </PanelActions>
    </div>
  );
}
