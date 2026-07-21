"use client";

import { useEffect, useState } from "react";
import { ExportFormatSelect } from "@/components/image/ExportFormatSelect";
import {
  PanelActions,
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
import type { FlipAxis } from "@/types/image";
import type { FlipLandingPreset } from "@/types/seo";

type FlipPanelProps = {
  preset?: FlipLandingPreset;
};

export function FlipPanel({ preset }: FlipPanelProps = {}) {
  const file = useImageStore((s) => s.file);
  const meta = useImageStore((s) => s.meta);
  const isPreviewing = useImageStore((s) => s.isPreviewing);
  const flipResult = useImageStore((s) => s.flipResult);
  const resultFilename = useImageStore((s) => s.resultFilename);
  const error = useImageStore((s) => s.error);
  const runFlip = useImageStore((s) => s.runFlip);
  const downloadResult = useImageStore((s) => s.downloadResult);
  const clear = useImageStore((s) => s.clear);
  const exportFormatId = usePreferencesStore((s) => s.exportFormatId);

  const [axis, setAxis] = useState<FlipAxis>(preset?.axis ?? "horizontal");
  const [qualityPercent, setQualityPercent] = useState(preset?.qualityPercent ?? 92);

  const formatOption = getExportFormat(exportFormatId);

  useEffect(() => {
    if (!file || !meta) return;

    const timer = window.setTimeout(() => {
      void runFlip(
        {
          axis,
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
    axis,
    exportFormatId,
    formatOption.mime,
    formatOption.supportsQuality,
    qualityPercent,
    runFlip,
  ]);

  return (
    <div className={panelShellClass}>
      <div className={panelSectionClass}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft/60">
            Flip
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft/80">
            Mirror photos horizontally or vertically. Preview updates live — all processing stays
            in your browser.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">Direction</p>
          <div className="mt-3 flex gap-2 rounded-md bg-mist/70 p-1">
            {(
              [
                { id: "horizontal" as const, label: "Horizontal" },
                { id: "vertical" as const, label: "Vertical" },
              ] as const
            ).map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={!file}
                onClick={() => setAxis(option.id)}
                className={modeTabClass(axis === option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <ExportFormatSelect id="flip-export-format" disabled={!file} />

        {formatOption.supportsQuality ? (
          <div>
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="flip-quality" className="text-sm font-semibold text-ink">
                Quality
              </label>
              <span className="text-sm tabular-nums text-ink-soft">{qualityPercent}%</span>
            </div>
            <input
              id="flip-quality"
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
            {flipResult ? (
              <>
                <div className="mt-2 flex justify-between gap-3">
                  <span className="text-ink-soft/70">
                    Flipped {flipResult.axis === "horizontal" ? "horizontal" : "vertical"}
                  </span>
                  <span className="font-medium tabular-nums text-ink">
                    {flipResult.width}×{flipResult.height} · {formatBytes(flipResult.outputBytes)}
                  </span>
                </div>
                {resultFilename ? (
                  <p className="mt-2  text-xs text-ink-soft/60" title={resultFilename}>
                    File: {resultFilename}
                  </p>
                ) : null}
              </>
            ) : (
              <p className="mt-2 text-xs text-ink-soft/60">
                Choose a direction to see the flipped preview.
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
          disabled={!flipResult}
          onClick={() => downloadResult("flip")}
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
