import type {
  CompressFormat,
  EngineSource,
  ExportMime,
  ResizeFillMode,
  ResizeFitMode,
  ResizeOptions,
  ResizeResult,
} from "@/types/image";
import { compressCanvas } from "@/lib/image/compress";
import { getExportFormat, mimeToDefaultFormatId } from "@/lib/image/formats";
import { exportCanvasToBlob } from "@/lib/image/engine";

function formatFromMime(mime: string): ExportMime {
  if (mime === "image/png") return "image/png";
  if (mime === "image/webp") return "image/webp";
  if (mime === "image/avif") return "image/avif";
  return "image/jpeg";
}

function drawContain(
  ctx: CanvasRenderingContext2D,
  bitmap: ImageBitmap,
  canvasW: number,
  canvasH: number,
  fill: ResizeFillMode,
) {
  const scale = Math.min(canvasW / bitmap.width, canvasH / bitmap.height);
  const drawW = Math.max(1, Math.round(bitmap.width * scale));
  const drawH = Math.max(1, Math.round(bitmap.height * scale));
  const x = Math.round((canvasW - drawW) / 2);
  const y = Math.round((canvasH - drawH) / 2);

  if (fill === "blur") {
    const coverScale = Math.max(canvasW / bitmap.width, canvasH / bitmap.height);
    const bgW = Math.max(1, Math.round(bitmap.width * coverScale));
    const bgH = Math.max(1, Math.round(bitmap.height * coverScale));
    const bgX = Math.round((canvasW - bgW) / 2);
    const bgY = Math.round((canvasH - bgH) / 2);
    ctx.save();
    ctx.filter = "blur(24px)";
    ctx.drawImage(bitmap, bgX, bgY, bgW, bgH);
    ctx.restore();
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.fillRect(0, 0, canvasW, canvasH);
  } else if (fill === "white") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasW, canvasH);
  } else if (fill === "black") {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvasW, canvasH);
  } else {
    ctx.clearRect(0, 0, canvasW, canvasH);
  }

  ctx.drawImage(bitmap, x, y, drawW, drawH);
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  bitmap: ImageBitmap,
  canvasW: number,
  canvasH: number,
) {
  const scale = Math.max(canvasW / bitmap.width, canvasH / bitmap.height);
  const drawW = Math.max(1, Math.round(bitmap.width * scale));
  const drawH = Math.max(1, Math.round(bitmap.height * scale));
  const x = Math.round((canvasW - drawW) / 2);
  const y = Math.round((canvasH - drawH) / 2);
  ctx.drawImage(bitmap, x, y, drawW, drawH);
}

function drawStretch(
  ctx: CanvasRenderingContext2D,
  bitmap: ImageBitmap,
  canvasW: number,
  canvasH: number,
) {
  ctx.drawImage(bitmap, 0, 0, canvasW, canvasH);
}

export function renderResizedCanvas(
  source: EngineSource,
  width: number,
  height: number,
  fit: ResizeFitMode,
  fill: ResizeFillMode,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 2D context unavailable");
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  if (fit === "cover") {
    drawCover(ctx, source.bitmap, width, height);
  } else if (fit === "contain") {
    drawContain(ctx, source.bitmap, width, height, fill);
  } else {
    drawStretch(ctx, source.bitmap, width, height);
  }

  return canvas;
}

export async function resizeSource(
  source: EngineSource,
  options: ResizeOptions,
): Promise<ResizeResult> {
  const width = Math.max(1, Math.round(options.width));
  const height = Math.max(1, Math.round(options.height));
  const fit: ResizeFitMode = options.fit ?? "stretch";
  const fill: ResizeFillMode = options.fill ?? "white";
  const compress = Boolean(options.compress);
  const compressFormatId =
    options.compressFormatId ?? options.formatId ?? "jpg";
  const compressFormat: CompressFormat =
    options.compressFormat ?? getExportFormat(compressFormatId).mime;

  // JPEG has no alpha — flatten transparent letterbox onto white
  const renderFill: ResizeFillMode =
    compress &&
    !getExportFormat(compressFormatId).supportsAlpha &&
    fill === "transparent"
      ? "white"
      : fill;

  const canvas = renderResizedCanvas(source, width, height, fit, renderFill);
  const base = source.meta.name.replace(/\.[^.]+$/, "") || "image";

  if (compress) {
    const compressed = await compressCanvas(canvas, {
      mode: options.compressMode ?? "quality",
      qualityPercent: options.qualityPercent ?? 80,
      targetKb: options.targetKb,
      format: compressFormat,
      formatId: compressFormatId,
    });

    const ext = getExportFormat(compressed.formatId).extension;
    const qualityTag =
      (options.compressMode ?? "quality") === "target"
        ? `t${options.targetKb ?? 100}kb`
        : `q${options.qualityPercent ?? 80}`;

    return {
      blob: compressed.blob,
      filename: `${base}-${compressed.width}x${compressed.height}-${qualityTag}.${ext}`,
      originalWidth: source.meta.width,
      originalHeight: source.meta.height,
      width: compressed.width,
      height: compressed.height,
      outputBytes: compressed.blob.size,
      format: compressFormat,
      formatId: compressed.formatId,
      fit,
      fill: fit === "contain" ? renderFill : undefined,
      compressed: true,
      qualityUsed: compressed.qualityUsed,
    };
  }

  const formatId =
    options.formatId ?? mimeToDefaultFormatId(formatFromMime(source.meta.type));
  const formatOption = getExportFormat(formatId);
  // Respect explicit formatId over source mime
  const format = options.format ?? formatOption.mime;
  const quality = options.quality ?? 0.92;
  const exportFill =
    !formatOption.supportsAlpha && fill === "transparent" ? "white" : renderFill;
  const exportCanvas =
    exportFill === renderFill
      ? canvas
      : renderResizedCanvas(source, width, height, fit, exportFill);
  const blob = await exportCanvasToBlob(exportCanvas, { format, quality });

  return {
    blob,
    filename: `${base}-${width}x${height}.${formatOption.extension}`,
    originalWidth: source.meta.width,
    originalHeight: source.meta.height,
    width,
    height,
    outputBytes: blob.size,
    format,
    formatId,
    fit,
    fill: fit === "contain" ? exportFill : undefined,
    compressed: false,
  };
}
