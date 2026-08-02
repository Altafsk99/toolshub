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
import type { FilterMode } from "@/types/image";

export function BlurPanel() {
  const file = useImageStore((s) => s.file);
  const meta = useImageStore((s) => s.meta);
  const isPreviewing = useImageStore((s) => s.isPreviewing);
  const editResult = useImageStore((s) => s.editResult);
  const resultFilename = useImageStore((s) => s.resultFilename);
  const error = useImageStore((s) => s.error);
  const runFilter = useImageStore((s) => s.runFilter);
  const downloadResult = useImageStore((s) => s.downloadResult);
  const clear = useImageStore((s) => s.clear);
  const exportFormatId = usePreferencesStore((s) => s.exportFormatId);

  const [mode, setMode] = useState<FilterMode>("blur");
  const [amount, setAmount] = useState(4);
  const [qualityPercent, setQualityPercent] = useState(92);

  const formatOption = getExportFormat(exportFormatId);
  const filterResult = editResult?.kind === "blur" ? editResult : null;
  const maxAmount = mode === "blur" ? 20 : 100;
  const amountLabel = mode === "blur" ? `${amount}px` : `${amount}%`;

  useEffect(() => {
    if (!file || !meta) return;

    const timer = window.setTimeout(() => {
      void runFilter(
        {
          mode,
          amount,
          format: formatOption.mime,
          formatId: exportFormatId,
          quality: formatOption.supportsQuality ? qualityPercent / 100 : undefined,
        },
        { silent: true },
      );
    }, 160);

    return () => window.clearTimeout(timer);
  }, [
    file,
    meta,
    mode,
    amount,
    exportFormatId,
    formatOption.mime,
    formatOption.supportsQuality,
    qualityPercent,
    runFilter,
  ]);

  return (
    <div className={panelShellClass}>
      <div className={panelSectionClass}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft/60">
            Blur / Sharpen
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft/80">
            Soften backgrounds or crisp up detail in your browser. Preview updates as you adjust.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">Mode</p>
          <div className="mt-3 flex gap-2 rounded-md bg-mist/70 p-1">
            {(
              [
                { id: "blur" as const, label: "Blur" },
                { id: "sharpen" as const, label: "Sharpen" },
              ] as const
            ).map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={!file}
                onClick={() => {
                  setMode(option.id);
                  setAmount(option.id === "blur" ? 4 : 40);
                }}
                className={modeTabClass(mode === option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="filter-amount" className="text-sm font-semibold text-ink">
              {mode === "blur" ? "Blur radius" : "Sharpen strength"}
            </label>
            <span className="text-sm tabular-nums text-ink-soft">{amountLabel}</span>
          </div>
          <input
            id="filter-amount"
            type="range"
            min={0}
            max={maxAmount}
            step={mode === "blur" ? 0.5 : 1}
            value={Math.min(amount, maxAmount)}
            disabled={!file}
            onChange={(e) => setAmount(Number(e.target.value))}
            className={rangeInputClass}
          />
        </div>

        <ExportFormatSelect id="blur-export-format" disabled={!file} />

        {formatOption.supportsQuality ? (
          <div>
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="blur-quality" className="text-sm font-semibold text-ink">
                Quality
              </label>
              <span className="text-sm tabular-nums text-ink-soft">{qualityPercent}%</span>
            </div>
            <input
              id="blur-quality"
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
            {filterResult ? (
              <>
                <div className="mt-2 flex justify-between gap-3">
                  <span className="text-ink-soft/70">
                    {filterResult.filterMode === "sharpen" ? "Sharpened" : "Blurred"}
                  </span>
                  <span className="font-medium tabular-nums text-ink">
                    {formatBytes(filterResult.outputBytes)}
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
                Choose blur or sharpen to update the preview.
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
          disabled={!filterResult}
          onClick={() => downloadResult("blur")}
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
