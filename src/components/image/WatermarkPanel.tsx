"use client";

import { useEffect, useState } from "react";
import { ExportFormatSelect } from "@/components/image/ExportFormatSelect";
import {
  PanelActions,
  chipClass,
  panelPrimaryBtnClass,
  panelSecondaryBtnClass,
  panelSectionClass,
  panelShellClass,
  rangeInputClass,
} from "@/components/image/PanelChrome";
import { getExportFormat } from "@/lib/image/formats";
import { formatBytes, useImageStore } from "@/stores/imageStore";
import { usePreferencesStore } from "@/stores/preferencesStore";
import type { WatermarkPosition } from "@/types/image";

const POSITIONS: { id: WatermarkPosition; label: string }[] = [
  { id: "top-left", label: "Top left" },
  { id: "top-right", label: "Top right" },
  { id: "center", label: "Center" },
  { id: "bottom-left", label: "Bottom left" },
  { id: "bottom-right", label: "Bottom right" },
];

const COLORS = [
  { id: "#ffffff", label: "White" },
  { id: "#000000", label: "Black" },
  { id: "#f5c542", label: "Gold" },
  { id: "#2d6a4f", label: "Green" },
] as const;

export function WatermarkPanel() {
  const file = useImageStore((s) => s.file);
  const meta = useImageStore((s) => s.meta);
  const isPreviewing = useImageStore((s) => s.isPreviewing);
  const editResult = useImageStore((s) => s.editResult);
  const resultFilename = useImageStore((s) => s.resultFilename);
  const error = useImageStore((s) => s.error);
  const runWatermark = useImageStore((s) => s.runWatermark);
  const downloadResult = useImageStore((s) => s.downloadResult);
  const clear = useImageStore((s) => s.clear);
  const exportFormatId = usePreferencesStore((s) => s.exportFormatId);

  const [text, setText] = useState("PrivyTool");
  const [position, setPosition] = useState<WatermarkPosition>("bottom-right");
  const [fontSize, setFontSize] = useState(36);
  const [opacity, setOpacity] = useState(55);
  const [color, setColor] = useState("#ffffff");
  const [qualityPercent, setQualityPercent] = useState(92);

  const formatOption = getExportFormat(exportFormatId);
  const watermarkResult = editResult?.kind === "watermark" ? editResult : null;

  useEffect(() => {
    if (!file || !meta) return;

    const timer = window.setTimeout(() => {
      void runWatermark(
        {
          text,
          position,
          fontSize,
          opacity,
          color,
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
    text,
    position,
    fontSize,
    opacity,
    color,
    exportFormatId,
    formatOption.mime,
    formatOption.supportsQuality,
    qualityPercent,
    runWatermark,
  ]);

  return (
    <div className={panelShellClass}>
      <div className={panelSectionClass}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft/60">
            Watermark
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft/80">
            Add a text watermark for copyright or branding. Position, size, and opacity stay on your
            device.
          </p>
        </div>

        <div>
          <label htmlFor="watermark-text" className="text-sm font-semibold text-ink">
            Text
          </label>
          <input
            id="watermark-text"
            type="text"
            value={text}
            disabled={!file}
            maxLength={80}
            onChange={(e) => setText(e.target.value)}
            placeholder="Your watermark"
            className="focus-ring mt-2 w-full rounded-md border border-line bg-paper px-3 py-2.5 text-sm text-ink"
          />
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">Position</p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {POSITIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={!file}
                onClick={() => setPosition(option.id)}
                className={chipClass(position === option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">Color</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {COLORS.map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={!file}
                onClick={() => setColor(option.id)}
                className={chipClass(color === option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="watermark-size" className="text-sm font-semibold text-ink">
              Size
            </label>
            <span className="text-sm tabular-nums text-ink-soft">{fontSize}px</span>
          </div>
          <input
            id="watermark-size"
            type="range"
            min={12}
            max={96}
            value={fontSize}
            disabled={!file}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className={rangeInputClass}
          />
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="watermark-opacity" className="text-sm font-semibold text-ink">
              Opacity
            </label>
            <span className="text-sm tabular-nums text-ink-soft">{opacity}%</span>
          </div>
          <input
            id="watermark-opacity"
            type="range"
            min={10}
            max={100}
            value={opacity}
            disabled={!file}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className={rangeInputClass}
          />
        </div>

        <ExportFormatSelect id="watermark-export-format" disabled={!file} />

        {formatOption.supportsQuality ? (
          <div>
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="watermark-quality" className="text-sm font-semibold text-ink">
                Quality
              </label>
              <span className="text-sm tabular-nums text-ink-soft">{qualityPercent}%</span>
            </div>
            <input
              id="watermark-quality"
              type="range"
              min={1}
              max={100}
              value={qualityPercent}
              disabled={!file}
              onChange={(e) => setQualityPercent(Number(e.target.value))}
              className={rangeInputClass}
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
            {watermarkResult ? (
              <>
                <div className="mt-2 flex justify-between gap-3">
                  <span className="text-ink-soft/70">Watermarked</span>
                  <span className="font-medium tabular-nums text-ink">
                    {formatBytes(watermarkResult.outputBytes)}
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
                Enter text to see the watermarked preview.
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
          disabled={!watermarkResult}
          onClick={() => downloadResult("watermark")}
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
