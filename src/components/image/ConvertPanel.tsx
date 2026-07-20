"use client";

import { useEffect, useMemo, useState } from "react";
import { ExportFormatSelect } from "@/components/image/ExportFormatSelect";
import { getExportFormat, mimeToDefaultFormatId } from "@/lib/image/formats";
import { formatBytes, useImageStore } from "@/stores/imageStore";
import { usePreferencesStore } from "@/stores/preferencesStore";

export function ConvertPanel() {
  const file = useImageStore((s) => s.file);
  const meta = useImageStore((s) => s.meta);
  const isPreviewing = useImageStore((s) => s.isPreviewing);
  const convertResult = useImageStore((s) => s.convertResult);
  const resultFilename = useImageStore((s) => s.resultFilename);
  const error = useImageStore((s) => s.error);
  const runIdentityExport = useImageStore((s) => s.runIdentityExport);
  const downloadResult = useImageStore((s) => s.downloadResult);
  const clear = useImageStore((s) => s.clear);
  const exportFormatId = usePreferencesStore((s) => s.exportFormatId);

  const [qualityPercent, setQualityPercent] = useState(92);

  const formatOption = getExportFormat(exportFormatId);
  const sourceFormatId = meta ? mimeToDefaultFormatId(meta.type) : null;

  useEffect(() => {
    if (!file || !meta) return;

    const timer = window.setTimeout(() => {
      void runIdentityExport(
        {
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
    exportFormatId,
    formatOption.mime,
    formatOption.supportsQuality,
    qualityPercent,
    runIdentityExport,
  ]);

  const sizeDelta = useMemo(() => {
    if (!convertResult) return null;
    const delta = convertResult.outputBytes - convertResult.originalBytes;
    const pct =
      convertResult.originalBytes > 0
        ? Math.round((delta / convertResult.originalBytes) * 100)
        : 0;
    return { delta, pct };
  }, [convertResult]);

  const sameFormat =
    sourceFormatId != null &&
    sourceFormatId === exportFormatId &&
    formatOption.mime === meta?.type;

  return (
    <div className="flex h-full flex-col justify-between gap-6">
      <div className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft/60">
            Convert
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft/80">
            Change image format locally — JPG, PNG, WebP, or AVIF. Preview and file
            size update live.
          </p>
        </div>

        <ExportFormatSelect id="convert-export-format" disabled={!file} />

        {formatOption.supportsQuality ? (
          <div>
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="convert-quality" className="text-sm font-semibold text-ink">
                Quality
              </label>
              <span className="text-sm tabular-nums text-ink-soft">{qualityPercent}%</span>
            </div>
            <input
              id="convert-quality"
              type="range"
              min={1}
              max={100}
              value={qualityPercent}
              onChange={(e) => setQualityPercent(Number(e.target.value))}
              disabled={!file}
              className="mt-3 w-full accent-[var(--accent)] disabled:opacity-40"
            />
            <p className="mt-2 text-xs text-ink-soft/65">
              Higher quality keeps more detail. Lower quality shrinks the file.
            </p>
          </div>
        ) : null}

        {meta ? (
          <div className="rounded-md border border-line bg-foam/60 px-3 py-3 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-ink-soft/70">Original</span>
              <span className="font-medium tabular-nums text-ink">
                {formatBytes(meta.size)} ·{" "}
                {getExportFormat(mimeToDefaultFormatId(meta.type)).label}
              </span>
            </div>
            {convertResult ? (
              <>
                <div className="mt-2 flex justify-between gap-3">
                  <span className="text-ink-soft/70">Converted</span>
                  <span className="font-medium tabular-nums text-ink">
                    {formatBytes(convertResult.outputBytes)} · {formatOption.label}
                  </span>
                </div>
                {sizeDelta && !sameFormat ? (
                  <div className="mt-2 flex justify-between gap-3">
                    <span className="text-ink-soft/70">Size change</span>
                    <span
                      className={`font-semibold tabular-nums ${
                        sizeDelta.delta <= 0 ? "text-accent-deep" : "text-ink"
                      }`}
                    >
                      {sizeDelta.delta <= 0 ? "" : "+"}
                      {formatBytes(Math.abs(sizeDelta.delta))} ({sizeDelta.pct > 0 ? "+" : ""}
                      {sizeDelta.pct}%)
                    </span>
                  </div>
                ) : null}
                {sameFormat ? (
                  <p className="mt-2 text-xs text-ink-soft/60">
                    Same format selected — adjust quality to change file size.
                  </p>
                ) : null}
                {resultFilename ? (
                  <p className="mt-2 truncate text-xs text-ink-soft/60" title={resultFilename}>
                    File: {resultFilename}
                  </p>
                ) : null}
              </>
            ) : (
              <p className="mt-2 text-xs text-ink-soft/60">
                Pick an output format to see the converted preview.
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
          disabled={!convertResult}
          onClick={() => downloadResult("convert")}
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
