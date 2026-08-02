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

function AdjustSlider({
  id,
  label,
  value,
  disabled,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  disabled: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold text-ink">
          {label}
        </label>
        <span className="text-sm tabular-nums text-ink-soft">
          {value > 0 ? `+${value}` : value}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={-100}
        max={100}
        step={1}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className={rangeInputClass}
      />
    </div>
  );
}

export function AdjustPanel() {
  const file = useImageStore((s) => s.file);
  const meta = useImageStore((s) => s.meta);
  const isPreviewing = useImageStore((s) => s.isPreviewing);
  const editResult = useImageStore((s) => s.editResult);
  const resultFilename = useImageStore((s) => s.resultFilename);
  const error = useImageStore((s) => s.error);
  const runAdjust = useImageStore((s) => s.runAdjust);
  const downloadResult = useImageStore((s) => s.downloadResult);
  const clear = useImageStore((s) => s.clear);
  const exportFormatId = usePreferencesStore((s) => s.exportFormatId);

  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [qualityPercent, setQualityPercent] = useState(92);

  const formatOption = getExportFormat(exportFormatId);
  const adjustResult = editResult?.kind === "adjust" ? editResult : null;

  useEffect(() => {
    if (!file || !meta) return;

    const timer = window.setTimeout(() => {
      void runAdjust(
        {
          brightness,
          contrast,
          saturation,
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
    brightness,
    contrast,
    saturation,
    exportFormatId,
    formatOption.mime,
    formatOption.supportsQuality,
    qualityPercent,
    runAdjust,
  ]);

  return (
    <div className={panelShellClass}>
      <div className={panelSectionClass}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft/60">
            Adjust
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft/80">
            Tweak brightness, contrast, and saturation locally. Preview updates live — nothing
            leaves your device.
          </p>
        </div>

        <AdjustSlider
          id="adjust-brightness"
          label="Brightness"
          value={brightness}
          disabled={!file}
          onChange={setBrightness}
        />
        <AdjustSlider
          id="adjust-contrast"
          label="Contrast"
          value={contrast}
          disabled={!file}
          onChange={setContrast}
        />
        <AdjustSlider
          id="adjust-saturation"
          label="Saturation"
          value={saturation}
          disabled={!file}
          onChange={setSaturation}
        />

        <button
          type="button"
          disabled={!file}
          onClick={() => {
            setBrightness(0);
            setContrast(0);
            setSaturation(0);
          }}
          className={panelSecondaryBtnClass}
        >
          Reset sliders
        </button>

        <ExportFormatSelect id="adjust-export-format" disabled={!file} />

        {formatOption.supportsQuality ? (
          <div>
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="adjust-quality" className="text-sm font-semibold text-ink">
                Quality
              </label>
              <span className="text-sm tabular-nums text-ink-soft">{qualityPercent}%</span>
            </div>
            <input
              id="adjust-quality"
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
            {adjustResult ? (
              <>
                <div className="mt-2 flex justify-between gap-3">
                  <span className="text-ink-soft/70">Adjusted</span>
                  <span className="font-medium tabular-nums text-ink">
                    {formatBytes(adjustResult.outputBytes)}
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
                Move a slider to see the adjusted preview.
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
          disabled={!adjustResult}
          onClick={() => downloadResult("adjust")}
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
