import type {
  EngineSource,
  FlipOptions,
  FlipResult,
  ResizeFillMode,
  RotateOptions,
  RotateResult,
} from "@/types/image";
import { exportCanvasToBlob, extensionFor } from "@/lib/image/engine";
import { getExportFormat, mimeToDefaultFormatId } from "@/lib/image/formats";

type ExportConfig = Pick<RotateOptions, "format" | "formatId" | "quality">;

function resolveExport(source: EngineSource, options: ExportConfig) {
  const formatId = options.formatId ?? mimeToDefaultFormatId(source.meta.type);
  const formatOption = getExportFormat(formatId);
  const format = options.format ?? formatOption.mime;
  const quality = options.quality ?? 0.92;
  return { formatId, formatOption, format, quality };
}

function resolveRotateFill(
  fill: ResizeFillMode,
  supportsAlpha: boolean,
): Exclude<ResizeFillMode, "blur" | "transparent"> | "transparent" {
  if (fill === "blur") return "white";
  if (!supportsAlpha && fill === "transparent") return "white";
  return fill;
}

function applyRotateBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  fill: ResizeFillMode,
  supportsAlpha: boolean,
) {
  const renderFill = resolveRotateFill(fill, supportsAlpha);

  if (renderFill === "transparent") {
    ctx.clearRect(0, 0, width, height);
    return;
  }
  if (renderFill === "black") {
    ctx.fillStyle = "#000000";
  } else {
    ctx.fillStyle = "#ffffff";
  }
  ctx.fillRect(0, 0, width, height);
}

export function rotatedDimensions(
  width: number,
  height: number,
  angleDegrees: number,
): { width: number; height: number } {
  const rad = (angleDegrees * Math.PI) / 180;
  const cos = Math.abs(Math.cos(rad));
  const sin = Math.abs(Math.sin(rad));
  return {
    width: Math.max(1, Math.round(width * cos + height * sin)),
    height: Math.max(1, Math.round(width * sin + height * cos)),
  };
}

export async function rotateSource(
  source: EngineSource,
  options: RotateOptions,
): Promise<RotateResult> {
  const angle = options.angle;
  const fill: ResizeFillMode = options.fill ?? "white";
  const { formatId, formatOption, format, quality } = resolveExport(source, options);
  const srcW = source.meta.width;
  const srcH = source.meta.height;
  const { width, height } = rotatedDimensions(srcW, srcH, angle);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 2D context unavailable");
  }

  applyRotateBackground(ctx, width, height, fill, formatOption.supportsAlpha);
  ctx.translate(width / 2, height / 2);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.drawImage(source.bitmap, -srcW / 2, -srcH / 2, srcW, srcH);

  const blob = await exportCanvasToBlob(canvas, { format, quality });
  const base = source.meta.name.replace(/\.[^.]+$/, "") || "image";
  const ext = extensionFor(format, formatId);
  const filename = `${base}-rotated-${angle}deg.${ext}`;

  return {
    blob,
    filename,
    originalWidth: srcW,
    originalHeight: srcH,
    width,
    height,
    outputBytes: blob.size,
    format,
    formatId,
    angle,
    fill,
    qualityUsed: formatOption.supportsQuality ? quality : undefined,
  };
}

export async function flipSource(
  source: EngineSource,
  options: FlipOptions,
): Promise<FlipResult> {
  const axis = options.axis;
  const { formatId, formatOption, format, quality } = resolveExport(source, options);
  const srcW = source.meta.width;
  const srcH = source.meta.height;

  const canvas = document.createElement("canvas");
  canvas.width = srcW;
  canvas.height = srcH;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 2D context unavailable");
  }

  if (!formatOption.supportsAlpha) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, srcW, srcH);
  }

  if (axis === "horizontal") {
    ctx.translate(srcW, 0);
    ctx.scale(-1, 1);
  } else {
    ctx.translate(0, srcH);
    ctx.scale(1, -1);
  }
  ctx.drawImage(source.bitmap, 0, 0, srcW, srcH);

  const blob = await exportCanvasToBlob(canvas, { format, quality });
  const base = source.meta.name.replace(/\.[^.]+$/, "") || "image";
  const ext = extensionFor(format, formatId);
  const suffix = axis === "horizontal" ? "flipped-h" : "flipped-v";
  const filename = `${base}-${suffix}.${ext}`;

  return {
    blob,
    filename,
    originalWidth: srcW,
    originalHeight: srcH,
    width: srcW,
    height: srcH,
    outputBytes: blob.size,
    format,
    formatId,
    axis,
    qualityUsed: formatOption.supportsQuality ? quality : undefined,
  };
}
