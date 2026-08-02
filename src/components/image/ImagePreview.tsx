"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CropOverlay } from "@/components/image/CropOverlay";
import { formatBytes, useImageStore } from "@/stores/imageStore";
import { useCropUiStore } from "@/stores/cropUiStore";

type PreviewMode = "original" | "result";

export function ImagePreview() {
  const previewUrl = useImageStore((s) => s.previewUrl);
  const resultPreviewUrl = useImageStore((s) => s.resultPreviewUrl);
  const resultRevision = useImageStore((s) => s.resultRevision);
  const meta = useImageStore((s) => s.meta);
  const resizeResult = useImageStore((s) => s.resizeResult);
  const compressResult = useImageStore((s) => s.compressResult);
  const convertResult = useImageStore((s) => s.convertResult);
  const cropResult = useImageStore((s) => s.cropResult);
  const rotateResult = useImageStore((s) => s.rotateResult);
  const flipResult = useImageStore((s) => s.flipResult);
  const editResult = useImageStore((s) => s.editResult);
  const resultFilename = useImageStore((s) => s.resultFilename);
  const clear = useImageStore((s) => s.clear);
  const freeModeActive = useCropUiStore((s) => s.freeModeActive);
  const freeCropRect = useCropUiStore((s) => s.freeCropRect);

  const imgRef = useRef<HTMLImageElement>(null);
  const hasResult = Boolean(resultPreviewUrl);
  const [mode, setMode] = useState<PreviewMode>("original");

  useEffect(() => {
    if (hasResult) {
      setMode("result");
    } else {
      setMode("original");
    }
  }, [hasResult, resultPreviewUrl]);

  useEffect(() => {
    if (freeModeActive) {
      setMode("original");
    }
  }, [freeModeActive, freeCropRect]);

  if (!previewUrl || !meta) {
    return (
      <div className="flex min-h-48 items-center justify-center rounded-[var(--radius-lg)] border border-line bg-paper/60 px-4 py-8 text-center text-sm text-ink-soft/70 sm:min-h-64 sm:px-6 sm:py-10">
        Preview appears here after you select an image.
      </div>
    );
  }

  const showingResult = mode === "result" && resultPreviewUrl;
  const displayUrl = showingResult ? resultPreviewUrl : previewUrl;

  const resultWidth =
    resizeResult?.width ??
    cropResult?.width ??
    rotateResult?.width ??
    flipResult?.width ??
    editResult?.width ??
    compressResult?.width ??
    convertResult?.width ??
    meta.width;
  const resultHeight =
    resizeResult?.height ??
    cropResult?.height ??
    rotateResult?.height ??
    flipResult?.height ??
    editResult?.height ??
    compressResult?.height ??
    convertResult?.height ??
    meta.height;
  const resultBytes =
    resizeResult?.outputBytes ??
    cropResult?.outputBytes ??
    rotateResult?.outputBytes ??
    flipResult?.outputBytes ??
    editResult?.outputBytes ??
    compressResult?.outputBytes ??
    convertResult?.outputBytes ??
    meta.size;
  const resultType =
    resizeResult?.format ??
    cropResult?.format ??
    rotateResult?.format ??
    flipResult?.format ??
    editResult?.format ??
    compressResult?.format ??
    convertResult?.format ??
    meta.type ??
    "image";
  const displayName = showingResult ? (resultFilename ?? meta.name) : meta.name;

  const dims = showingResult
    ? `${resultWidth}×${resultHeight}`
    : `${meta.width}×${meta.height}`;
  const bytes = showingResult ? resultBytes : meta.size;
  const typeLabel = showingResult ? resultType : meta.type || "image";

  const editBadge =
    editResult?.kind === "adjust"
      ? "Adjusted"
      : editResult?.kind === "blur"
        ? editResult.filterMode === "sharpen"
          ? "Sharpened"
          : "Blurred"
        : editResult?.kind === "watermark"
          ? "Watermarked"
          : editResult?.kind === "metadata"
            ? "Clean metadata"
            : null;

  const badgeLabel = resizeResult
    ? resizeResult.compressed
      ? "Resized + compressed"
      : "Resized"
    : cropResult
      ? cropResult.shape === "circle"
        ? "Circle crop"
        : "Cropped"
      : rotateResult
        ? `Rotated ${rotateResult.angle}°`
        : flipResult
          ? flipResult.axis === "horizontal"
            ? "Flipped H"
            : "Flipped V"
          : editBadge
            ? editBadge
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
        <div className="flex flex-col gap-2 border-b border-line px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-4">
          <div className="flex w-full gap-1 rounded-md bg-mist/70 p-1 sm:w-auto">
            <button
              type="button"
              onClick={() => setMode("original")}
              className={`focus-ring min-h-10 flex-1 rounded-md px-3 py-2 text-xs font-semibold transition sm:flex-none sm:py-1.5 ${
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
              className={`focus-ring min-h-10 flex-1 rounded-md px-3 py-2 text-xs font-semibold transition sm:flex-none sm:py-1.5 ${
                mode === "result"
                  ? "bg-paper text-ink shadow-sm"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {badgeLabel}
            </button>
          </div>
          {showingResult ? (
            <span className="hidden text-xs font-medium text-accent-deep sm:inline">
              {badgeLabel} preview
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="relative flex max-h-[260px] min-h-48 items-center justify-center bg-[linear-gradient(45deg,#dfeae6_25%,transparent_25%),linear-gradient(-45deg,#dfeae6_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#dfeae6_75%),linear-gradient(-45deg,transparent_75%,#dfeae6_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0] p-3 sm:max-h-[420px] sm:min-h-64 sm:p-4">
        <div className="relative inline-block max-h-[220px] max-w-full sm:max-h-[380px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            key={`${resultRevision}-${displayUrl}`}
            src={displayUrl}
            alt={
              showingResult
                ? `${badgeLabel} preview of ${meta.name}`
                : `Preview of ${meta.name}`
            }
            className="block max-h-[220px] max-w-full object-contain sm:max-h-[380px]"
          />
          <CropOverlay imgRef={imgRef} enabled={freeModeActive && !showingResult} />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line px-3 py-3 sm:px-4">
        <div className="min-w-0">
          <p className=" text-sm font-semibold text-ink">{displayName}</p>
          <p className="mt-0.5 text-xs text-ink-soft/70">
            {dims} · {formatBytes(bytes)} · {typeLabel}
          </p>
        </div>
        <button
          type="button"
          onClick={clear}
          className="focus-ring shrink-0 rounded-md px-3 py-2 text-sm font-medium text-ink-soft transition hover:bg-mist hover:text-ink"
        >
          Remove
        </button>
      </div>
    </motion.div>
  );
}
