import type {
  AdjustOptions,
  EditResult,
  EngineSource,
  FilterOptions,
  MetadataOptions,
  WatermarkOptions,
  WatermarkPosition,
} from "@/types/image";
import { exportCanvasToBlob, extensionFor } from "@/lib/image/engine";
import { getExportFormat, mimeToDefaultFormatId } from "@/lib/image/formats";

type ExportConfig = {
  format?: AdjustOptions["format"];
  formatId?: AdjustOptions["formatId"];
  quality?: number;
};

function resolveExport(source: EngineSource, options: ExportConfig) {
  const formatId = options.formatId ?? mimeToDefaultFormatId(source.meta.type);
  const formatOption = getExportFormat(formatId);
  const format = options.format ?? formatOption.mime;
  const quality = options.quality ?? 0.92;
  return { formatId, formatOption, format, quality };
}

function createCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    throw new Error("Canvas 2D context unavailable");
  }
  return { canvas, ctx };
}

function paintSource(
  ctx: CanvasRenderingContext2D,
  source: EngineSource,
  supportsAlpha: boolean,
) {
  const { width, height } = source.meta;
  if (!supportsAlpha) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }
  ctx.drawImage(source.bitmap, 0, 0, width, height);
}

function baseName(source: EngineSource) {
  return source.meta.name.replace(/\.[^.]+$/, "") || "image";
}

function sliderToFilterFactor(value: number): number {
  return Math.max(0, (100 + value) / 100);
}

export async function adjustSource(
  source: EngineSource,
  options: AdjustOptions,
): Promise<EditResult> {
  const { formatId, formatOption, format, quality } = resolveExport(source, options);
  const { width, height } = source.meta;
  const { canvas, ctx } = createCanvas(width, height);

  const b = sliderToFilterFactor(options.brightness);
  const c = sliderToFilterFactor(options.contrast);
  const s = sliderToFilterFactor(options.saturation);
  ctx.filter = `brightness(${b}) contrast(${c}) saturate(${s})`;
  paintSource(ctx, source, formatOption.supportsAlpha);
  ctx.filter = "none";

  const blob = await exportCanvasToBlob(canvas, { format, quality });
  const ext = extensionFor(format, formatId);
  const filename = `${baseName(source)}-adjusted.${ext}`;

  return {
    kind: "adjust",
    blob,
    filename,
    originalWidth: width,
    originalHeight: height,
    width,
    height,
    outputBytes: blob.size,
    format,
    formatId,
    qualityUsed: formatOption.supportsQuality ? quality : undefined,
    brightness: options.brightness,
    contrast: options.contrast,
    saturation: options.saturation,
  };
}

function applySharpen(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  amount: number,
) {
  const strength = Math.max(0, Math.min(100, amount)) / 100;
  if (strength <= 0) return;

  const src = ctx.getImageData(0, 0, width, height);
  const out = ctx.createImageData(width, height);
  const s = src.data;
  const d = out.data;
  // Unsharp-style kernel: center boosted vs neighbors
  const center = 1 + 4 * strength;
  const edge = -strength;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      for (let ch = 0; ch < 3; ch++) {
        let sum = s[i + ch]! * center;
        if (x > 0) sum += s[i - 4 + ch]! * edge;
        if (x < width - 1) sum += s[i + 4 + ch]! * edge;
        if (y > 0) sum += s[i - width * 4 + ch]! * edge;
        if (y < height - 1) sum += s[i + width * 4 + ch]! * edge;
        d[i + ch] = Math.max(0, Math.min(255, Math.round(sum)));
      }
      d[i + 3] = s[i + 3]!;
    }
  }
  ctx.putImageData(out, 0, 0);
}

export async function filterSource(
  source: EngineSource,
  options: FilterOptions,
): Promise<EditResult> {
  const { formatId, formatOption, format, quality } = resolveExport(source, options);
  const { width, height } = source.meta;
  const { canvas, ctx } = createCanvas(width, height);

  if (options.mode === "blur") {
    const radius = Math.max(0, Math.min(20, options.amount));
    ctx.filter = radius > 0 ? `blur(${radius}px)` : "none";
    paintSource(ctx, source, formatOption.supportsAlpha);
    ctx.filter = "none";
  } else {
    paintSource(ctx, source, formatOption.supportsAlpha);
    applySharpen(ctx, width, height, options.amount);
  }

  const blob = await exportCanvasToBlob(canvas, { format, quality });
  const ext = extensionFor(format, formatId);
  const suffix = options.mode === "blur" ? "blurred" : "sharpened";
  const filename = `${baseName(source)}-${suffix}.${ext}`;

  return {
    kind: "blur",
    blob,
    filename,
    originalWidth: width,
    originalHeight: height,
    width,
    height,
    outputBytes: blob.size,
    format,
    formatId,
    qualityUsed: formatOption.supportsQuality ? quality : undefined,
    filterMode: options.mode,
    filterAmount: options.amount,
  };
}

function watermarkAnchor(
  position: WatermarkPosition,
  width: number,
  height: number,
  pad: number,
): { x: number; y: number; align: CanvasTextAlign; baseline: CanvasTextBaseline } {
  switch (position) {
    case "top-left":
      return { x: pad, y: pad, align: "left", baseline: "top" };
    case "top-right":
      return { x: width - pad, y: pad, align: "right", baseline: "top" };
    case "center":
      return { x: width / 2, y: height / 2, align: "center", baseline: "middle" };
    case "bottom-left":
      return { x: pad, y: height - pad, align: "left", baseline: "bottom" };
    case "bottom-right":
    default:
      return { x: width - pad, y: height - pad, align: "right", baseline: "bottom" };
  }
}

export async function watermarkSource(
  source: EngineSource,
  options: WatermarkOptions,
): Promise<EditResult> {
  const { formatId, formatOption, format, quality } = resolveExport(source, options);
  const { width, height } = source.meta;
  const { canvas, ctx } = createCanvas(width, height);

  paintSource(ctx, source, formatOption.supportsAlpha);

  const text = options.text.trim() || "PrivyTool";
  const fontSize = Math.max(8, Math.min(120, options.fontSize));
  const opacity = Math.max(0, Math.min(100, options.opacity)) / 100;
  const pad = Math.max(12, Math.round(Math.min(width, height) * 0.03));
  const anchor = watermarkAnchor(options.position, width, height, pad);

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = options.color || "#ffffff";
  ctx.strokeStyle = "rgba(0,0,0,0.35)";
  ctx.lineWidth = Math.max(1, fontSize / 18);
  ctx.font = `600 ${fontSize}px "Instrument Sans", system-ui, sans-serif`;
  ctx.textAlign = anchor.align;
  ctx.textBaseline = anchor.baseline;
  ctx.strokeText(text, anchor.x, anchor.y);
  ctx.fillText(text, anchor.x, anchor.y);
  ctx.restore();

  const blob = await exportCanvasToBlob(canvas, { format, quality });
  const ext = extensionFor(format, formatId);
  const filename = `${baseName(source)}-watermarked.${ext}`;

  return {
    kind: "watermark",
    blob,
    filename,
    originalWidth: width,
    originalHeight: height,
    width,
    height,
    outputBytes: blob.size,
    format,
    formatId,
    qualityUsed: formatOption.supportsQuality ? quality : undefined,
    watermarkText: text,
    watermarkPosition: options.position,
  };
}

/** Re-encode through canvas — strips EXIF / GPS / other embedded metadata. */
export async function stripMetadataSource(
  source: EngineSource,
  options: MetadataOptions = {},
): Promise<EditResult> {
  const { formatId, formatOption, format, quality } = resolveExport(source, options);
  const { width, height } = source.meta;
  const { canvas, ctx } = createCanvas(width, height);

  paintSource(ctx, source, formatOption.supportsAlpha);

  const blob = await exportCanvasToBlob(canvas, { format, quality });
  const ext = extensionFor(format, formatId);
  const filename = `${baseName(source)}-no-exif.${ext}`;

  return {
    kind: "metadata",
    blob,
    filename,
    originalWidth: width,
    originalHeight: height,
    width,
    height,
    outputBytes: blob.size,
    format,
    formatId,
    qualityUsed: formatOption.supportsQuality ? quality : undefined,
  };
}
