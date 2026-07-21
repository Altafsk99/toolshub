import type {
  CropAspectPreset,
  CropOptions,
  CropResult,
  CropShape,
  EngineSource,
  ExportMime,
} from "@/types/image";
import { exportCanvasToBlob, extensionFor } from "@/lib/image/engine";
import { getExportFormat, mimeToDefaultFormatId } from "@/lib/image/formats";

function formatFromMime(mime: string): ExportMime {
  if (mime === "image/png") return "image/png";
  if (mime === "image/webp") return "image/webp";
  if (mime === "image/avif") return "image/avif";
  return "image/jpeg";
}

export function aspectToRatio(aspect: CropAspectPreset): number | null {
  switch (aspect) {
    case "1:1":
      return 1;
    case "4:3":
      return 4 / 3;
    case "3:4":
      return 3 / 4;
    case "16:9":
      return 16 / 9;
    case "9:16":
      return 9 / 16;
    case "3:2":
      return 3 / 2;
    case "2:3":
      return 2 / 3;
    default:
      return null;
  }
}

export type CropRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function clampRect(rect: CropRect, srcW: number, srcH: number): CropRect {
  const width = Math.max(1, Math.min(Math.round(rect.width), srcW));
  const height = Math.max(1, Math.min(Math.round(rect.height), srcH));
  const x = Math.max(0, Math.min(Math.round(rect.x), srcW - width));
  const y = Math.max(0, Math.min(Math.round(rect.y), srcH - height));
  return { x, y, width, height };
}

export function computeCropRect(
  srcW: number,
  srcH: number,
  options: Pick<
    CropOptions,
    "aspect" | "focusX" | "focusY" | "x" | "y" | "width" | "height"
  >,
): CropRect {
  const aspect = options.aspect ?? "1:1";
  const focusX = options.focusX ?? 0.5;
  const focusY = options.focusY ?? 0.5;
  const ratio = aspectToRatio(aspect);

  if (aspect === "free" && options.width != null && options.height != null) {
    return clampRect(
      {
        x: options.x ?? 0,
        y: options.y ?? 0,
        width: options.width,
        height: options.height,
      },
      srcW,
      srcH,
    );
  }

  if (ratio == null) {
    return { x: 0, y: 0, width: srcW, height: srcH };
  }

  let cropW: number;
  let cropH: number;
  if (srcW / srcH > ratio) {
    cropH = srcH;
    cropW = Math.max(1, Math.round(cropH * ratio));
  } else {
    cropW = srcW;
    cropH = Math.max(1, Math.round(cropW / ratio));
  }

  const maxX = Math.max(0, srcW - cropW);
  const maxY = Math.max(0, srcH - cropH);
  return {
    x: Math.round(maxX * focusX),
    y: Math.round(maxY * focusY),
    width: cropW,
    height: cropH,
  };
}

function applyCircleClip(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const radius = Math.min(width, height) / 2;
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
}

export async function cropSource(
  source: EngineSource,
  options: CropOptions = {},
): Promise<CropResult> {
  const aspect = options.aspect ?? "1:1";
  const shape: CropShape = options.shape ?? "rect";
  const rect = computeCropRect(source.meta.width, source.meta.height, options);

  const canvas = document.createElement("canvas");
  canvas.width = rect.width;
  canvas.height = rect.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 2D context unavailable");
  }

  let formatId = options.formatId ?? mimeToDefaultFormatId(source.meta.type);
  if (shape === "circle") {
    formatId = "png";
  }
  const formatOption = getExportFormat(formatId);
  const format = options.format ?? formatOption.mime;

  if (shape === "circle") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    applyCircleClip(ctx, rect.width, rect.height);
  } else if (!formatOption.supportsAlpha) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(
    source.bitmap,
    rect.x,
    rect.y,
    rect.width,
    rect.height,
    0,
    0,
    rect.width,
    rect.height,
  );

  const quality = options.quality ?? 0.92;
  const blob = await exportCanvasToBlob(canvas, {
    format: shape === "circle" ? "image/png" : format,
    quality,
  });

  const base = source.meta.name.replace(/\.[^.]+$/, "") || "image";
  const ext = shape === "circle" ? "png" : extensionFor(format, formatId);
  const suffix = shape === "circle" ? "-cropped-circle" : "-cropped";
  const filename = `${base}${suffix}.${ext}`;

  return {
    blob,
    filename,
    originalWidth: source.meta.width,
    originalHeight: source.meta.height,
    width: rect.width,
    height: rect.height,
    outputBytes: blob.size,
    format: shape === "circle" ? "image/png" : format,
    formatId: shape === "circle" ? "png" : formatId,
    aspect,
    shape,
    qualityUsed: formatOption.supportsQuality ? quality : undefined,
  };
}
