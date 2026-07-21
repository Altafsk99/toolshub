"use client";

import { useEffect, useState } from "react";
import { ExportFormatSelect } from "@/components/image/ExportFormatSelect";
import { getExportFormat } from "@/lib/image/formats";
import { formatBytes, useImageStore } from "@/stores/imageStore";
import { usePreferencesStore } from "@/stores/preferencesStore";
import type { ResizeFillMode } from "@/types/image";
import type { RotateLandingPreset } from "@/types/seo";

const QUICK_ANGLES = [
  { label: "90° left", angle: -90 },
  { label: "90° right", angle: 90 },
  { label: "180°", angle: 180 },
] as const;

const BACKGROUND_OPTIONS: { id: ResizeFillMode; label: string }[] = [
  { id: "white", label: "White" },
  { id: "black", label: "Black" },
  { id: "transparent", label: "Transparent" },
];

type RotatePanelProps = {
  preset?: RotateLandingPreset;
};

export function RotatePanel({ preset }: RotatePanelProps = {}) {
  const file = useImageStore((s) => s.file);
  const meta = useImageStore((s) => s.meta);
  const isPreviewing = useImageStore((s) => s.isPreviewing);
  const rotateResult = useImageStore((s) => s.rotateResult);
  const resultFilename = useImageStore((s) => s.resultFilename);
  const error = useImageStore((s) => s.error);
  const runRotate = useImageStore((s) => s.runRotate);
  const downloadResult = useImageStore((s) => s.downloadResult);
  const clear = useImageStore((s) => s.clear);
  const exportFormatId = usePreferencesStore((s) => s.exportFormatId);

  const [angle, setAngle] = useState(preset?.angle ?? 90);
  const [fill, setFill] = useState<ResizeFillMode>(preset?.fill ?? "white");
  const [qualityPercent, setQualityPercent] = useState(preset?.qualityPercent ?? 92);

  const formatOption = getExportFormat(exportFormatId);

  useEffect(() => {
    if (!file || !meta) return;

    const timer = window.setTimeout(() => {
      void runRotate(
        {
          angle,
          fill,
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
    angle,
    fill,
    exportFormatId,
    formatOption.mime,
    formatOption.supportsQuality,
    qualityPercent,
    runRotate,
  ]);

  return (
    <div className="flex h-full flex-col justify-between gap-6">
      <div className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft/60">
            Rotate
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft/80">
            Turn photos clockwise or counter-clockwise. Preview updates live — nothing leaves your
            device.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">Quick rotate</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {QUICK_ANGLES.map((option) => (
              <button
                key={option.label}
                type="button"
                disabled={!file}
                onClick={() => setAngle(option.angle)}
                className={`focus-ring rounded-md px-3 py-1.5 text-sm font-medium transition disabled:opacity-40 ${
                  angle === option.angle
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
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="rotate-angle" className="text-sm font-semibold text-ink">
              Custom angle
            </label>
            <span className="text-sm tabular-nums text-ink-soft">{angle}°</span>
          </div>
          <input
            id="rotate-angle"
            type="range"
            min={-180}
            max={180}
            step={1}
            value={angle}
            disabled={!file}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="mt-3 w-full accent-[var(--accent)] disabled:opacity-40"
          />
          <p className="mt-2 text-xs text-ink-soft/65">
            Positive values rotate clockwise. Negative values rotate counter-clockwise.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">Background</p>
          <p className="mt-1 text-xs text-ink-soft/65">
            Fills empty corners when rotating at custom angles.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {BACKGROUND_OPTIONS.map((option) => (
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

        <ExportFormatSelect id="rotate-export-format" disabled={!file} />

        {fill === "transparent" && !formatOption.supportsAlpha ? (
          <p className="text-xs text-ink-soft/70">
            {formatOption.label} can&apos;t keep transparency — empty corners will export as white.
            Choose PNG, WebP, or AVIF for a transparent background.
          </p>
        ) : null}

        {formatOption.supportsQuality ? (
          <div>
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="rotate-quality" className="text-sm font-semibold text-ink">
                Quality
              </label>
              <span className="text-sm tabular-nums text-ink-soft">{qualityPercent}%</span>
            </div>
            <input
              id="rotate-quality"
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
            {rotateResult ? (
              <>
                <div className="mt-2 flex justify-between gap-3">
                  <span className="text-ink-soft/70">Rotated {rotateResult.angle}°</span>
                  <span className="font-medium tabular-nums text-ink">
                    {rotateResult.width}×{rotateResult.height} ·{" "}
                    {formatBytes(rotateResult.outputBytes)}
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
                Adjust the angle to see the rotated preview.
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
          disabled={!rotateResult}
          onClick={() => downloadResult("rotate")}
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
