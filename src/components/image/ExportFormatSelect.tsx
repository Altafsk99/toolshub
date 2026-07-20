"use client";

import { useEffect, useState } from "react";
import {
  detectFormatSupport,
  EXPORT_FORMATS,
  type ExportFormatId,
} from "@/lib/image/formats";
import { usePreferencesStore } from "@/stores/preferencesStore";

type ExportFormatSelectProps = {
  id?: string;
  label?: string;
  disabled?: boolean;
  /** Controlled override; defaults to global preference */
  value?: ExportFormatId;
  onChange?: (id: ExportFormatId) => void;
  className?: string;
};

export function ExportFormatSelect({
  id = "export-format",
  label = "Export format",
  disabled,
  value,
  onChange,
  className = "",
}: ExportFormatSelectProps) {
  const preferred = usePreferencesStore((s) => s.exportFormatId);
  const setPreferred = usePreferencesStore((s) => s.setExportFormatId);
  const selected = value ?? preferred;
  const [support, setSupport] = useState<Record<ExportFormatId, boolean> | null>(
    null,
  );

  useEffect(() => {
    let alive = true;
    void detectFormatSupport().then((result) => {
      if (alive) setSupport(result);
    });
    return () => {
      alive = false;
    };
  }, []);

  const handleChange = (next: ExportFormatId) => {
    setPreferred(next);
    onChange?.(next);
  };

  const unsupported =
    support && selected === "avif" && !support.avif
      ? "AVIF isn’t supported in this browser. Try Chrome/Edge, or pick WebP/JPG."
      : support && selected === "webp" && !support.webp
        ? "WebP encode isn’t supported in this browser."
        : null;

  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>
      <select
        id={id}
        value={selected}
        disabled={disabled}
        onChange={(e) => handleChange(e.target.value as ExportFormatId)}
        className="focus-ring mt-2 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm disabled:opacity-40"
      >
        {EXPORT_FORMATS.map((format) => {
          const isSupported = support ? support[format.id] : true;
          return (
            <option key={format.id} value={format.id} disabled={!isSupported}>
              {format.label}
              {!isSupported ? " (unsupported)" : ""}
            </option>
          );
        })}
      </select>
      {unsupported ? (
        <p className="mt-2 text-xs text-red-700">{unsupported}</p>
      ) : (
        <p className="mt-2 text-xs text-ink-soft/65">
          PNG keeps sharp edges; JPG/JPEG are smaller photos; WebP/AVIF are modern
          and usually smallest.
        </p>
      )}
    </div>
  );
}
