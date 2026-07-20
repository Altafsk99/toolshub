"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatBytes, useImageStore } from "@/stores/imageStore";

type PreviewMode = "original" | "result";

export function ImagePreview() {
  const previewUrl = useImageStore((s) => s.previewUrl);
  const resultPreviewUrl = useImageStore((s) => s.resultPreviewUrl);
  const resultRevision = useImageStore((s) => s.resultRevision);
  const meta = useImageStore((s) => s.meta);
  const resizeResult = useImageStore((s) => s.resizeResult);
  const compressResult = useImageStore((s) => s.compressResult);
  const convertResult = useImageStore((s) => s.convertResult);
  const resultFilename = useImageStore((s) => s.resultFilename);
  const clear = useImageStore((s) => s.clear);

  const hasResult = Boolean(resultPreviewUrl);
  const [mode, setMode] = useState<PreviewMode>("original");

  useEffect(() => {
    if (hasResult) {
      setMode("result");
    } else {
      setMode("original");
    }
  }, [hasResult, resultPreviewUrl]);

  if (!previewUrl || !meta) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-[var(--radius-lg)] border border-line bg-paper/60 px-6 py-10 text-center text-sm text-ink-soft/70">
        Preview appears here after you select an image.
      </div>
    );
  }

  const showingResult = mode === "result" && resultPreviewUrl;
  const displayUrl = showingResult ? resultPreviewUrl : previewUrl;

  const resultWidth =
    resizeResult?.width ?? compressResult?.width ?? convertResult?.width ?? meta.width;
  const resultHeight =
    resizeResult?.height ?? compressResult?.height ?? convertResult?.height ?? meta.height;
  const resultBytes =
    resizeResult?.outputBytes ??
    compressResult?.outputBytes ??
    convertResult?.outputBytes ??
    meta.size;
  const resultType =
    resizeResult?.format ??
    compressResult?.format ??
    convertResult?.format ??
    meta.type ??
    "image";
  const displayName = showingResult
    ? (resultFilename ?? meta.name)
    : meta.name;

  const dims = showingResult
    ? `${resultWidth}×${resultHeight}`
    : `${meta.width}×${meta.height}`;
  const bytes = showingResult ? resultBytes : meta.size;
  const typeLabel = showingResult ? resultType : meta.type || "image";

  const badgeLabel = resizeResult
    ? resizeResult.compressed
      ? "Resized + compressed"
      : "Resized"
    : compressResult
      ? "Compressed"
      : convertResult
        ? "Converted"
        : "Result";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-[var(--radius-lg)] border border-line bg-paper"
    >
      {hasResult ? (
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2">
          <div className="flex gap-1 rounded-md bg-mist/70 p-1">
            <button
              type="button"
              onClick={() => setMode("original")}
              className={`focus-ring rounded-md px-3 py-1 text-xs font-semibold transition ${
                mode === "original"
                  ? "bg-paper text-ink shadow-sm"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              Original
            </button>
            <button
              type="button"
              onClick={() => setMode("result")}
              className={`focus-ring rounded-md px-3 py-1 text-xs font-semibold transition ${
                mode === "result"
                  ? "bg-paper text-ink shadow-sm"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {badgeLabel}
            </button>
          </div>
          {showingResult ? (
            <span className="text-xs font-medium text-accent-deep">{badgeLabel} preview</span>
          ) : null}
        </div>
      ) : null}

      <div className="relative flex max-h-[420px] min-h-64 items-center justify-center bg-[linear-gradient(45deg,#dfeae6_25%,transparent_25%),linear-gradient(-45deg,#dfeae6_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#dfeae6_75%),linear-gradient(-45deg,transparent_75%,#dfeae6_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0] p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={`${resultRevision}-${displayUrl}`}
          src={displayUrl}
          alt={
            showingResult
              ? `${badgeLabel} preview of ${meta.name}`
              : `Preview of ${meta.name}`
          }
          className="max-h-[380px] max-w-full object-contain"
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{displayName}</p>
          <p className="mt-0.5 text-xs text-ink-soft/70">
            {dims} · {formatBytes(bytes)} · {typeLabel}
          </p>
        </div>
        <button
          type="button"
          onClick={clear}
          className="focus-ring rounded-md px-3 py-1.5 text-sm font-medium text-ink-soft transition hover:bg-mist hover:text-ink"
        >
          Remove
        </button>
      </div>
    </motion.div>
  );
}
