"use client";

import { useEffect, useMemo, useState } from "react";
import { ExportFormatSelect } from "@/components/image/ExportFormatSelect";
import { getExportFormat } from "@/lib/image/formats";
import { formatBytes, useImageStore } from "@/stores/imageStore";
import { usePreferencesStore } from "@/stores/preferencesStore";
import type { CompressMode, ResizeFillMode, ResizeFitMode } from "@/types/image";

const PRESETS = [
  { label: "480 × 640", width: 480, height: 640 },
  { label: "800 × 800", width: 800, height: 800 },
  { label: "1920 × 1080", width: 1920, height: 1080 },
  { label: "Passport 3.5×4.5 cm", width: 413, height: 531 },
] as const;

const KB_PRESETS = [20, 50, 100, 200] as const;

const FIT_OPTIONS: { id: ResizeFitMode; label: string; help: string }[] = [
  {
    id: "contain",
    label: "Fit (no crop)",
    help: "Keep the full image. Empty edges use the fill color or blur.",
  },
  {
    id: "cover",
    label: "Crop to fill",
    help: "Fill the exact size by cropping overflow. No empty space.",
  },
  {
    id: "stretch",
    label: "Stretch",
    help: "Force exact size even if it distorts the image.",
  },
];

const FILL_OPTIONS: { id: ResizeFillMode; label: string }[] = [
  { id: "white", label: "White" },
  { id: "black", label: "Black" },
  { id: "blur", label: "Blur" },
  { id: "transparent", label: "Transparent" },
];

export function ResizePanel() {
  const file = useImageStore((s) => s.file);
  const meta = useImageStore((s) => s.meta);
  const isPreviewing = useImageStore((s) => s.isPreviewing);
  const resizeResult = useImageStore((s) => s.resizeResult);
  const resultFilename = useImageStore((s) => s.resultFilename);
  const error = useImageStore((s) => s.error);
  const runResize = useImageStore((s) => s.runResize);
  const downloadResult = useImageStore((s) => s.downloadResult);
  const clear = useImageStore((s) => s.clear);
  const exportFormatId = usePreferencesStore((s) => s.exportFormatId);
  const formatOption = getExportFormat(exportFormatId);

  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [lockAspect, setLockAspect] = useState(true);
  const [percent, setPercent] = useState(100);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [fit, setFit] = useState<ResizeFitMode>("contain");
  const [fill, setFill] = useState<ResizeFillMode>("white");

  const [compress, setCompress] = useState(false);
  const [compressMode, setCompressMode] = useState<CompressMode>("quality");
  const [qualityPercent, setQualityPercent] = useState(80);
  const [targetKb, setTargetKb] = useState(100);
  const [customKb, setCustomKb] = useState("100");

  const debounceMs = compress && compressMode === "target" ? 300 : 160;

  useEffect(() => {
    if (!meta) return;
    setWidth(meta.width);
    setHeight(meta.height);
    setPercent(100);
    setActivePreset(null);
  }, [meta]);

  // Live preview whenever resize / compress inputs change
  useEffect(() => {
    if (!file || !meta) return;
    if (!Number.isFinite(width) || !Number.isFinite(height)) return;
    if (width < 1 || height < 1) return;
    if (compress && compressMode === "target" && targetKb < 1) return;

    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (cancelled) return;
      void runResize(
        {
          width,
          height,
          fit,
          fill: fit === "contain" ? fill : undefined,
          formatId: exportFormatId,
          format: formatOption.mime,
          compress,
          compressMode: compress ? compressMode : undefined,
          qualityPercent: compress ? qualityPercent : undefined,
          targetKb: compress && compressMode === "target" ? targetKb : undefined,
          compressFormat: compress ? formatOption.mime : undefined,
          compressFormatId: compress ? exportFormatId : undefined,
        },
        { silent: true },
      );
    }, debounceMs);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [
    file,
    meta,
    width,
    height,
    fit,
    fill,
    compress,
    compressMode,
    qualityPercent,
    targetKb,
    exportFormatId,
    formatOption.mime,
    debounceMs,
    runResize,
  ]);

  const aspect =
    meta && meta.height > 0 ? meta.width / meta.height : width / Math.max(height, 1);

  const aspectMismatch = useMemo(() => {
    if (!meta || !width || !height) return false;
    const target = width / height;
    const source = meta.width / meta.height;
    return Math.abs(target - source) > 0.02;
  }, [meta, width, height]);

  const onWidthChange = (next: number) => {
    const w = Math.max(1, next);
    setWidth(w);
    setActivePreset(null);
    if (lockAspect && aspect > 0) {
      setHeight(Math.max(1, Math.round(w / aspect)));
    }
    if (meta) {
      setPercent(Math.round((w / meta.width) * 100));
    }
  };

  const onHeightChange = (next: number) => {
    const h = Math.max(1, next);
    setHeight(h);
    setActivePreset(null);
    if (lockAspect && aspect > 0) {
      setWidth(Math.max(1, Math.round(h * aspect)));
    }
    if (meta) {
      setPercent(Math.round((h / meta.height) * 100));
    }
  };

  const onPercentChange = (next: number) => {
    if (!meta) return;
    const p = Math.max(1, Math.min(500, next));
    setPercent(p);
    setActivePreset(null);
    setWidth(Math.max(1, Math.round((meta.width * p) / 100)));
    setHeight(Math.max(1, Math.round((meta.height * p) / 100)));
  };

  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    setLockAspect(false);
    setWidth(preset.width);
    setHeight(preset.height);
    setActivePreset(preset.label);
    if (meta) {
      setPercent(Math.round((preset.width / meta.width) * 100));
    }
  };

  const applyKbPreset = (kb: number) => {
    setCompressMode("target");
    setTargetKb(kb);
    setCustomKb(String(kb));
  };

  const applyCustomKb = (value: string) => {
    setCustomKb(value);
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed > 0) {
      setCompressMode("target");
      setTargetKb(Math.round(parsed));
    }
  };

  const fitHelp = FIT_OPTIONS.find((o) => o.id === fit)?.help;

  return (
    <div className="flex h-full flex-col justify-between gap-6">
      <div className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft/60">
            Resize
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft/80">
            Preview updates live. Optionally compress the resized file in the same step.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="resize-width" className="text-sm font-semibold text-ink">
              Width (px)
            </label>
            <input
              id="resize-width"
              type="number"
              min={1}
              value={width}
              disabled={!file}
              onChange={(e) => onWidthChange(Number(e.target.value) || 1)}
              className="focus-ring mt-2 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm tabular-nums disabled:opacity-40"
            />
          </div>
          <div>
            <label htmlFor="resize-height" className="text-sm font-semibold text-ink">
              Height (px)
            </label>
            <input
              id="resize-height"
              type="number"
              min={1}
              value={height}
              disabled={!file}
              onChange={(e) => onHeightChange(Number(e.target.value) || 1)}
              className="focus-ring mt-2 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm tabular-nums disabled:opacity-40"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={lockAspect}
            disabled={!file}
            onChange={(e) => setLockAspect(e.target.checked)}
            className="accent-[var(--accent)] disabled:opacity-40"
          />
          Lock aspect ratio
        </label>

        <div>
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="resize-percent" className="text-sm font-semibold text-ink">
              Scale
            </label>
            <span className="text-sm tabular-nums text-ink-soft">{percent}%</span>
          </div>
          <input
            id="resize-percent"
            type="range"
            min={1}
            max={200}
            value={Math.min(200, percent)}
            disabled={!file}
            onChange={(e) => onPercentChange(Number(e.target.value))}
            className="mt-3 w-full accent-[var(--accent)] disabled:opacity-40"
          />
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">When aspect ratios differ</p>
          <div className="mt-3 flex flex-col gap-2">
            {FIT_OPTIONS.map((option) => (
              <label
                key={option.id}
                className={`flex cursor-pointer items-start gap-3 rounded-md border px-3 py-2.5 transition ${
                  fit === option.id
                    ? "border-accent bg-mist/80"
                    : "border-line bg-paper/60 hover:border-accent/40"
                } ${!file ? "opacity-40" : ""}`}
              >
                <input
                  type="radio"
                  name="resize-fit"
                  checked={fit === option.id}
                  disabled={!file}
                  onChange={() => setFit(option.id)}
                  className="mt-0.5 accent-[var(--accent)]"
                />
                <span>
                  <span className="block text-sm font-semibold text-ink">{option.label}</span>
                  <span className="mt-0.5 block text-xs text-ink-soft/70">{option.help}</span>
                </span>
              </label>
            ))}
          </div>
          {aspectMismatch && fit !== "stretch" ? (
            <p className="mt-2 text-xs text-ink-soft/65">
              Target size doesn’t match the original ratio —{" "}
              {fit === "cover" ? "edges will be cropped." : "empty edges will be filled."}
            </p>
          ) : null}
        </div>

        {fit === "contain" ? (
          <div>
            <p className="text-sm font-semibold text-ink">Empty space fill</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {FILL_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  disabled={!file}
                  onClick={() => setFill(option.id)}
                  className={`focus-ring rounded-md px-3 py-1.5 text-sm font-medium transition disabled:opacity-40 ${
                    fill === option.id
                      ? "bg-ink text-foam"
                      : "bg-mist text-ink-soft hover:bg-mist/80"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div>
          <p className="text-sm font-semibold text-ink">Presets</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                disabled={!file}
                onClick={() => applyPreset(preset)}
                className={`focus-ring rounded-md px-3 py-1.5 text-sm font-medium transition disabled:opacity-40 ${
                  activePreset === preset.label
                    ? "bg-ink text-foam"
                    : "bg-mist text-ink-soft hover:bg-mist/80"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <ExportFormatSelect id="resize-export-format" disabled={!file} />

        {fit === "contain" && fill === "transparent" && !formatOption.supportsAlpha ? (
          <p className="text-xs text-ink-soft/65">
            {formatOption.label} can’t keep transparency — empty edges will export as white.
            Choose PNG, WebP, or AVIF for transparent edges.
          </p>
        ) : null}

        <div className="rounded-md border border-line bg-paper/80 p-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-ink">
            <input
              type="checkbox"
              checked={compress}
              disabled={!file}
              onChange={(e) => setCompress(e.target.checked)}
              className="accent-[var(--accent)] disabled:opacity-40"
            />
            Also compress output
          </label>
          <p className="mt-1 text-xs text-ink-soft/65">
            Resize first, then reduce file size in one download.
          </p>

          {compress ? (
            <div className="mt-4 space-y-4">
              <div className="flex gap-2 rounded-md bg-mist/70 p-1">
                <button
                  type="button"
                  onClick={() => setCompressMode("quality")}
                  className={`focus-ring flex-1 rounded-md px-3 py-2 text-sm font-semibold transition ${
                    compressMode === "quality"
                      ? "bg-paper text-ink shadow-sm"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  Quality
                </button>
                <button
                  type="button"
                  onClick={() => setCompressMode("target")}
                  className={`focus-ring flex-1 rounded-md px-3 py-2 text-sm font-semibold transition ${
                    compressMode === "target"
                      ? "bg-paper text-ink shadow-sm"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  Target size
                </button>
              </div>

              {compressMode === "quality" ? (
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <label htmlFor="resize-quality" className="text-sm font-semibold text-ink">
                      Quality
                    </label>
                    <span className="text-sm tabular-nums text-ink-soft">
                      {qualityPercent}%
                    </span>
                  </div>
                  <input
                    id="resize-quality"
                    type="range"
                    min={1}
                    max={100}
                    value={qualityPercent}
                    disabled={!formatOption.supportsQuality}
                    onChange={(e) => setQualityPercent(Number(e.target.value))}
                    className="mt-3 w-full accent-[var(--accent)] disabled:opacity-40"
                  />
                  {!formatOption.supportsQuality ? (
                    <p className="mt-2 text-xs text-ink-soft/65">
                      PNG is lossless — quality doesn’t apply. Pick JPG/WebP/AVIF to use quality.
                    </p>
                  ) : null}
                </div>
              ) : (
                <div>
                  <p className="text-sm font-semibold text-ink">Target size (KB)</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {KB_PRESETS.map((kb) => (
                      <button
                        key={kb}
                        type="button"
                        onClick={() => applyKbPreset(kb)}
                        className={`focus-ring rounded-md px-3 py-1.5 text-sm font-medium transition ${
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
                      value={customKb}
                      onChange={(e) => applyCustomKb(e.target.value)}
                      className="focus-ring w-28 rounded-md border border-line bg-paper px-3 py-2 text-sm tabular-nums"
                      aria-label="Custom target size in KB"
                    />
                    <span className="text-sm text-ink-soft/70">KB</span>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {meta ? (
          <div className="rounded-md border border-line bg-foam/60 px-3 py-3 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-ink-soft/70">Original</span>
              <span className="font-medium tabular-nums text-ink">
                {meta.width} × {meta.height} · {formatBytes(meta.size)}
              </span>
            </div>
            <div className="mt-2 flex justify-between gap-3">
              <span className="text-ink-soft/70">New size</span>
              <span className="font-medium tabular-nums text-ink">
                {resizeResult
                  ? `${resizeResult.width} × ${resizeResult.height}`
                  : `${width} × ${height}`}
              </span>
            </div>
            <div className="mt-2 flex justify-between gap-3">
              <span className="text-ink-soft/70">Mode</span>
              <span className="font-medium text-ink">
                {fitHelp?.split(".")[0]}
                {fit === "contain" ? ` · ${fill}` : ""}
                {compress ? " · compressed" : ""}
              </span>
            </div>
            {resizeResult ? (
              <>
                <div className="mt-2 flex justify-between gap-3">
                  <span className="text-ink-soft/70">Output file</span>
                  <span className="font-medium tabular-nums text-accent-deep">
                    {formatBytes(resizeResult.outputBytes)}
                  </span>
                </div>
                <div className="mt-2 flex justify-between gap-3">
                  <span className="text-ink-soft/70">Export</span>
                  <span className="font-medium tabular-nums text-ink">
                    {resizeResult.format.replace("image/", "").toUpperCase()}
                    {resizeResult.compressed && resizeResult.qualityUsed != null
                      ? ` · q${Math.round(resizeResult.qualityUsed * 100)}`
                      : ""}
                  </span>
                </div>
                {resultFilename ? (
                  <p className="mt-2 truncate text-xs text-ink-soft/60" title={resultFilename}>
                    File: {resultFilename}
                  </p>
                ) : null}
              </>
            ) : null}
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
          disabled={!resizeResult}
          onClick={() => downloadResult("resize")}
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
