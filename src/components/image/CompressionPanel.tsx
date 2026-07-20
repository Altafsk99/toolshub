"use client";

import { useEffect, useMemo, useState } from "react";
import { ExportFormatSelect } from "@/components/image/ExportFormatSelect";
import { getExportFormat } from "@/lib/image/formats";
import { formatBytes, useImageStore } from "@/stores/imageStore";
import { usePreferencesStore } from "@/stores/preferencesStore";
import type { CompressMode } from "@/types/image";

const KB_PRESETS = [20, 50, 100, 200] as const;

export function CompressionPanel() {
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

  const [mode, setMode] = useState<CompressMode>("quality");
  const [qualityPercent, setQualityPercent] = useState(70);
  const [targetKb, setTargetKb] = useState(100);
  const [customKb, setCustomKb] = useState("100");

  const formatOption = getExportFormat(exportFormatId);
  const debounceMs = mode === "target" ? 320 : 140;

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
          formatId: exportFormatId,
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
    exportFormatId,
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
    <div className="flex h-full flex-col justify-between gap-6">
      <div className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft/60">
            Compression
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft/80">
            Preview and file size update live. Export format is shared across all tools.
          </p>
        </div>

        <div className="flex gap-2 rounded-md bg-mist/70 p-1">
          <ModeButton
            active={mode === "quality"}
            onClick={() => setMode("quality")}
            label="Quality"
          />
          <ModeButton
            active={mode === "target"}
            onClick={() => setMode("target")}
            label="Target size"
          />
        </div>

        {mode === "quality" ? (
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
              disabled={!file || !formatOption.supportsQuality}
              className="mt-3 w-full accent-[var(--accent)] disabled:opacity-40"
            />
            <p className="mt-2 text-xs text-ink-soft/65">
              {formatOption.supportsQuality
                ? "Lower quality = smaller file. Higher quality = better detail."
                : "PNG is lossless — quality doesn’t apply. Use JPG/WebP/AVIF to shrink with quality."}
            </p>
          </div>
        ) : (
          <div>
            <label className="text-sm font-semibold text-ink">Target size (KB)</label>
            <div className="mt-3 flex flex-wrap gap-2">
              {KB_PRESETS.map((kb) => (
                <button
                  key={kb}
                  type="button"
                  disabled={!file}
                  onClick={() => applyPreset(kb)}
                  className={`focus-ring rounded-md px-3 py-1.5 text-sm font-medium transition disabled:opacity-40 ${
                    targetKb === kb
                      ? "bg-ink text-foam"
                      : "bg-mist text-ink-soft hover:bg-mist/80"
                  }`}
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
                value={customKb}
                disabled={!file}
                onChange={(e) => applyCustomKb(e.target.value)}
                className="focus-ring w-28 rounded-md border border-line bg-paper px-3 py-2 text-sm tabular-nums disabled:opacity-40"
                aria-label="Custom target size in KB"
              />
              <span className="text-sm text-ink-soft/70">KB (custom)</span>
            </div>
          </div>
        )}

        <ExportFormatSelect id="compress-export-format" disabled={!file} />

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
                    <span className="font-semibold tabular-nums text-accent-deep">
                      {formatBytes(Math.max(0, savedLabel.saved))} ({savedLabel.pct}%)
                    </span>
                  </div>
                ) : null}
                {resultFilename ? (
                  <p className="mt-2 truncate text-xs text-ink-soft/60" title={resultFilename}>
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

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={!compressResult}
          onClick={() => downloadResult("compress")}
          className="focus-ring inline-flex h-11 items-center justify-center rounded-md bg-ink px-5 text-sm font-semibold text-foam transition hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-40"
        >
          Download
        </button>
        {file ? (
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
  );
}

function ModeButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`focus-ring flex-1 rounded-md px-3 py-2 text-sm font-semibold transition ${
        active ? "bg-paper text-ink shadow-sm" : "text-ink-soft hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}
