"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ExportFormatSelect } from "@/components/image/ExportFormatSelect";
import { getExportFormat } from "@/lib/image/formats";
import { formatBytes, useImageStore } from "@/stores/imageStore";
import { useCropUiStore } from "@/stores/cropUiStore";
import { usePreferencesStore } from "@/stores/preferencesStore";
import type { CropAspectPreset, CropOptions, CropShape } from "@/types/image";
import type { CropLandingPreset } from "@/types/seo";

const ASPECT_PRESETS: { id: CropAspectPreset; label: string }[] = [
  { id: "1:1", label: "Square 1:1" },
  { id: "4:3", label: "Landscape 4:3" },
  { id: "3:4", label: "Portrait 3:4" },
  { id: "16:9", label: "Wide 16:9" },
  { id: "9:16", label: "Story 9:16" },
  { id: "3:2", label: "Photo 3:2" },
  { id: "2:3", label: "Portrait 2:3" },
  { id: "free", label: "Free" },
];

type CropPanelProps = {
  preset?: CropLandingPreset;
};

export function CropPanel({ preset }: CropPanelProps = {}) {
  const file = useImageStore((s) => s.file);
  const meta = useImageStore((s) => s.meta);
  const isProcessing = useImageStore((s) => s.isProcessing);
  const cropResult = useImageStore((s) => s.cropResult);
  const resultFilename = useImageStore((s) => s.resultFilename);
  const error = useImageStore((s) => s.error);
  const runCrop = useImageStore((s) => s.runCrop);
  const clearCropResult = useImageStore((s) => s.clearCropResult);
  const downloadResult = useImageStore((s) => s.downloadResult);
  const clear = useImageStore((s) => s.clear);
  const exportFormatId = usePreferencesStore((s) => s.exportFormatId);
  const freeCropRect = useCropUiStore((s) => s.freeCropRect);
  const initFreeCropForImage = useCropUiStore((s) => s.initFreeCropForImage);
  const setFreeModeActive = useCropUiStore((s) => s.setFreeModeActive);
  const resetCropUi = useCropUiStore((s) => s.reset);

  const [aspect, setAspect] = useState<CropAspectPreset>(preset?.aspect ?? "1:1");
  const [shape, setShape] = useState<CropShape>(preset?.shape ?? "rect");
  const [focusX, setFocusX] = useState(preset?.focusX ?? 0.5);
  const [focusY, setFocusY] = useState(preset?.focusY ?? 0.5);
  const [qualityPercent, setQualityPercent] = useState(92);

  const skipClearRef = useRef(true);

  const effectiveFormatId = shape === "circle" ? "png" : exportFormatId;
  const formatOption = getExportFormat(effectiveFormatId);
  const isFreeCrop = aspect === "free";
  const canApply = Boolean(file && meta && (!isFreeCrop || freeCropRect));

  useEffect(() => {
    setFreeModeActive(isFreeCrop);
    return () => setFreeModeActive(false);
  }, [isFreeCrop, setFreeModeActive]);

  useEffect(() => {
    if (!meta || !isFreeCrop) return;
    initFreeCropForImage(meta);
  }, [meta, isFreeCrop, initFreeCropForImage]);

  useEffect(() => {
    if (!file) resetCropUi();
  }, [file, resetCropUi]);

  useEffect(() => {
    return () => resetCropUi();
  }, [resetCropUi]);

  useEffect(() => {
    if (skipClearRef.current) {
      skipClearRef.current = false;
      return;
    }
    clearCropResult();
  }, [
    aspect,
    shape,
    focusX,
    focusY,
    qualityPercent,
    effectiveFormatId,
    freeCropRect,
    clearCropResult,
  ]);

  const buildCropOptions = useCallback((): CropOptions | null => {
    if (!meta) return null;
    if (isFreeCrop && !freeCropRect) return null;

    return {
      aspect,
      shape,
      focusX,
      focusY,
      format: formatOption.mime,
      formatId: effectiveFormatId,
      quality: formatOption.supportsQuality ? qualityPercent / 100 : undefined,
      ...(isFreeCrop && freeCropRect
        ? {
            x: freeCropRect.x,
            y: freeCropRect.y,
            width: freeCropRect.width,
            height: freeCropRect.height,
          }
        : {}),
    };
  }, [
    meta,
    isFreeCrop,
    freeCropRect,
    aspect,
    shape,
    focusX,
    focusY,
    formatOption.mime,
    formatOption.supportsQuality,
    effectiveFormatId,
    qualityPercent,
  ]);

  const applyCrop = useCallback(() => {
    const options = buildCropOptions();
    if (!options) return;
    void runCrop(options);
  }, [buildCropOptions, runCrop]);

  const cropLabel = useMemo(() => {
    if (shape === "circle") return "Circle crop";
    const match = ASPECT_PRESETS.find((p) => p.id === aspect);
    return match?.label ?? "Crop";
  }, [aspect, shape]);

  return (
    <div className="flex h-full flex-col justify-between gap-6">
      <div className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft/60">
            Crop
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft/80">
            Adjust aspect, shape, and focal point. In Free mode, drag the box on the preview — then
            click Apply crop to see the result.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">Aspect ratio</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {ASPECT_PRESETS.map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={!file}
                onClick={() => setAspect(option.id)}
                className={`focus-ring rounded-md px-3 py-1.5 text-sm font-medium transition disabled:opacity-40 ${
                  aspect === option.id
                    ? "bg-ink text-foam"
                    : "bg-mist text-ink-soft hover:bg-mist/80"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">Shape</p>
          <div className="mt-3 flex gap-2">
            {(
              [
                { id: "rect" as const, label: "Rectangle" },
                { id: "circle" as const, label: "Circle" },
              ] as const
            ).map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={!file}
                onClick={() => setShape(option.id)}
                className={`focus-ring flex-1 rounded-md px-3 py-2 text-sm font-semibold transition disabled:opacity-40 ${
                  shape === option.id
                    ? "bg-ink text-foam"
                    : "bg-mist text-ink-soft hover:bg-mist/80"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {shape === "circle" ? (
            <p className="mt-2 text-xs text-ink-soft/65">
              Circle crops export as PNG with transparency.
            </p>
          ) : null}
        </div>

        {aspect !== "free" ? (
          <>
            <div>
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="crop-focus-x" className="text-sm font-semibold text-ink">
                  Horizontal focus
                </label>
                <span className="text-sm tabular-nums text-ink-soft">
                  {Math.round(focusX * 100)}%
                </span>
              </div>
              <input
                id="crop-focus-x"
                type="range"
                min={0}
                max={100}
                value={Math.round(focusX * 100)}
                disabled={!file}
                onChange={(e) => setFocusX(Number(e.target.value) / 100)}
                className="mt-3 w-full accent-[var(--accent)] disabled:opacity-40"
              />
            </div>
            <div>
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="crop-focus-y" className="text-sm font-semibold text-ink">
                  Vertical focus
                </label>
                <span className="text-sm tabular-nums text-ink-soft">
                  {Math.round(focusY * 100)}%
                </span>
              </div>
              <input
                id="crop-focus-y"
                type="range"
                min={0}
                max={100}
                value={Math.round(focusY * 100)}
                disabled={!file}
                onChange={(e) => setFocusY(Number(e.target.value) / 100)}
                className="mt-3 w-full accent-[var(--accent)] disabled:opacity-40"
              />
            </div>
          </>
        ) : (
          <p className="rounded-md border border-line bg-foam/60 px-3 py-3 text-sm text-ink-soft/80">
            Drag the crop box on the image preview. Use corner handles to resize, or drag inside
            the box to move it.
          </p>
        )}

        {shape === "rect" ? (
          <ExportFormatSelect id="crop-export-format" disabled={!file} />
        ) : (
          <p className="text-sm text-ink-soft/70">Export format: PNG (required for circle crop)</p>
        )}

        {formatOption.supportsQuality && shape === "rect" ? (
          <div>
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="crop-quality" className="text-sm font-semibold text-ink">
                Quality
              </label>
              <span className="text-sm tabular-nums text-ink-soft">{qualityPercent}%</span>
            </div>
            <input
              id="crop-quality"
              type="range"
              min={1}
              max={100}
              value={qualityPercent}
              disabled={!file}
              onChange={(e) => setQualityPercent(Number(e.target.value))}
              className="mt-3 w-full accent-[var(--accent)] disabled:opacity-40"
            />
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
            {cropResult ? (
              <>
                <div className="mt-2 flex justify-between gap-3">
                  <span className="text-ink-soft/70">{cropLabel}</span>
                  <span className="font-medium tabular-nums text-ink">
                    {cropResult.width}×{cropResult.height} · {formatBytes(cropResult.outputBytes)}
                  </span>
                </div>
                {resultFilename ? (
                  <p className="mt-2 truncate text-xs text-ink-soft/60" title={resultFilename}>
                    File: {resultFilename}
                  </p>
                ) : null}
              </>
            ) : (
              <p className="mt-2 text-xs text-ink-soft/60">
                Click Apply crop to generate a preview.
              </p>
            )}
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
          disabled={!canApply || isProcessing}
          onClick={applyCrop}
          className="focus-ring inline-flex h-11 items-center justify-center rounded-md bg-accent px-5 text-sm font-semibold text-foam transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isProcessing ? "Cropping…" : "Apply crop"}
        </button>
        <button
          type="button"
          disabled={!cropResult}
          onClick={() => downloadResult("crop")}
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
