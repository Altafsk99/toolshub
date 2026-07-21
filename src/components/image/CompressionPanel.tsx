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
  const isPreviewing = useImageStore((s) => s.isPreviewing);
  const compressResult = useImageStore((s) => s.compressResult);
  const resultFilename = useImageStore((s) => s.resultFilename);
  const error = useImageStore((s) => s.error);
  const runCompress = useImageStore((s) => s.runCompress);
  const downloadResult = useImageStore((s) => s.downloadResult);
  const clear = useImageStore((s) => s.clear);
  const exportFormatId = usePreferencesStore((s) => s.exportFormatId);
  const setExportFormatId = usePreferencesStore((s) => s.setExportFormatId);

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

  const setActiveFormat = (id: ExportFormatId) => {
    if (preset?.formatId) {
      setLocalFormatId(id);
    } else {
      setExportFormatId(id);
    }
  };

  useEffect(() => {
    if (!file || !meta) return;
    if (mode === "target" && (!Number.isFinite(targetKb) || targetKb < 1)) return;

    const timer = window.setTimeout(() => {
      void runCompress(
        {
          mode,
          qualityPercent,
          targetKb: mode === "target" ? targetKb : undefined,
          format: formatOption.mime,
          formatId: activeFormatId,
        },
        { silent: true },
      );
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [
    file,
    meta,
    mode,
    qualityPercent,
    targetKb,
    activeFormatId,
    formatOption.mime,
    debounceMs,
    runCompress,
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
            Preview and file size update live. Export format is shared across all tools.
          </p>
        </div>

        <ExportFormatSelect
          id="compress-export-format"
          disabled={!file}
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
                disabled={!file}
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
                    disabled={!file}
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
                  disabled={!file}
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
                disabled={!file}
                onChange={(e) => applyCustomKb(e.target.value)}
                className="focus-ring min-h-11 w-28 rounded-md border border-line bg-paper px-3 py-2 text-base tabular-nums disabled:opacity-40 sm:text-sm"
                aria-label="Custom target size in KB"
              />
              <span className="text-sm text-ink-soft/70">KB (custom)</span>
            </div>
          </div>
        )}

        {meta ? (
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
                  <p className="mt-2  text-xs text-ink-soft/60" title={resultFilename}>
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
        <button
          type="button"
          disabled={!compressResult}
          onClick={() => downloadResult("compress")}
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
