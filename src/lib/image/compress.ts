import type {
  CompressFormat,
  CompressMode,
  CompressOptions,
  CompressResult,
  EngineSource,
} from "@/types/image";
import type { ExportFormatId } from "@/lib/image/formats";
import { getExportFormat } from "@/lib/image/formats";
import { drawToCanvas, exportCanvasToBlob } from "@/lib/image/engine";

function clampQuality(qualityPercent: number): number {
  return Math.min(1, Math.max(0.01, qualityPercent / 100));
}

function resolveFormatId(
  format: CompressFormat,
  formatId?: ExportFormatId,
): ExportFormatId {
  if (formatId) return formatId;
  if (format === "image/png") return "png";
  if (format === "image/webp") return "webp";
  if (format === "image/avif") return "avif";
  return "jpg";
}

function fileExtension(format: CompressFormat, formatId?: ExportFormatId): string {
  return getExportFormat(resolveFormatId(format, formatId)).extension;
}

async function encodeAtScale(
  source: EngineSource,
  format: CompressFormat,
  quality: number,
  scale: number,
): Promise<{ blob: Blob; width: number; height: number }> {
  const width = Math.max(1, Math.round(source.meta.width * scale));
  const height = Math.max(1, Math.round(source.meta.height * scale));
  const canvas = drawToCanvas(source.bitmap, width, height);
  const blob = await exportCanvasToBlob(canvas, { format, quality });
  return { blob, width, height };
}

async function compressByQuality(
  source: EngineSource,
  options: CompressOptions,
): Promise<
  Omit<CompressResult, "originalBytes" | "filename"> & { filenameBase: string }
> {
  const quality = clampQuality(options.qualityPercent);
  const { blob, width, height } = await encodeAtScale(
    source,
    options.format,
    quality,
    1,
  );
  return {
    blob,
    outputBytes: blob.size,
    width,
    height,
    format: options.format,
    formatId: resolveFormatId(options.format, options.formatId),
    qualityUsed: quality,
    filenameBase: source.meta.name.replace(/\.[^.]+$/, "") || "image",
  };
}

/**
 * Hit a target file size by binary-searching lossy quality,
 * then scaling down dimensions if still too large.
 */
async function compressToTarget(
  source: EngineSource,
  options: CompressOptions,
): Promise<
  Omit<CompressResult, "originalBytes" | "filename"> & { filenameBase: string }
> {
  const targetBytes = Math.max(1024, Math.round((options.targetKb ?? 100) * 1024));
  let scale = 1;
  let best: { blob: Blob; width: number; height: number; quality: number } | null =
    null;

  for (let scaleAttempt = 0; scaleAttempt < 8; scaleAttempt += 1) {
    let low = 0.05;
    let high = 0.95;
    let localBest: {
      blob: Blob;
      width: number;
      height: number;
      quality: number;
    } | null = null;

    for (let i = 0; i < 10; i += 1) {
      const mid = (low + high) / 2;
      const encoded = await encodeAtScale(source, options.format, mid, scale);

      if (encoded.blob.size <= targetBytes) {
        localBest = { ...encoded, quality: mid };
        low = mid;
      } else {
        high = mid;
      }
    }

    if (localBest) {
      best = localBest;
      break;
    }

    const tiny = await encodeAtScale(source, options.format, 0.05, scale);
    best = { ...tiny, quality: 0.05 };
    if (tiny.blob.size <= targetBytes) break;
    scale *= 0.75;
  }

  if (!best) {
    throw new Error("Compression failed");
  }

  return {
    blob: best.blob,
    outputBytes: best.blob.size,
    width: best.width,
    height: best.height,
    format: options.format,
    formatId: resolveFormatId(options.format, options.formatId),
    qualityUsed: best.quality,
    filenameBase: source.meta.name.replace(/\.[^.]+$/, "") || "image",
  };
}

export async function compressSource(
  source: EngineSource,
  options: CompressOptions,
): Promise<CompressResult> {
  const result =
    options.mode === "target"
      ? await compressToTarget(source, options)
      : await compressByQuality(source, options);

  const ext = fileExtension(options.format, options.formatId);
  const filename = `${result.filenameBase}-compressed.${ext}`;

  return {
    blob: result.blob,
    filename,
    originalBytes: source.meta.size,
    outputBytes: result.outputBytes,
    width: result.width,
    height: result.height,
    format: result.format,
    formatId: result.formatId,
    qualityUsed: result.qualityUsed,
  };
}

async function encodeCanvas(
  canvas: HTMLCanvasElement,
  format: CompressFormat,
  quality: number,
): Promise<Blob> {
  return exportCanvasToBlob(canvas, { format, quality });
}

function scaleCanvas(source: HTMLCanvasElement, scale: number): HTMLCanvasElement {
  const width = Math.max(1, Math.round(source.width * scale));
  const height = Math.max(1, Math.round(source.height * scale));
  return drawToCanvas(source, width, height);
}

/**
 * Compress an already-rendered canvas (used by resize + compress).
 * Keeps canvas pixel dimensions when possible; scales down only for hard target KB.
 */
export async function compressCanvas(
  canvas: HTMLCanvasElement,
  options: {
    mode: CompressMode;
    qualityPercent: number;
    targetKb?: number;
    format: CompressFormat;
    formatId?: ExportFormatId;
  },
): Promise<{
  blob: Blob;
  qualityUsed: number;
  width: number;
  height: number;
  formatId: ExportFormatId;
}> {
  const formatId = resolveFormatId(options.format, options.formatId);

  if (options.mode === "quality") {
    const quality = clampQuality(options.qualityPercent);
    const blob = await encodeCanvas(canvas, options.format, quality);
    return {
      blob,
      qualityUsed: quality,
      width: canvas.width,
      height: canvas.height,
      formatId,
    };
  }

  const targetBytes = Math.max(1024, Math.round((options.targetKb ?? 100) * 1024));
  let scale = 1;
  let working = canvas;
  let best: { blob: Blob; quality: number; width: number; height: number } | null =
    null;

  for (let scaleAttempt = 0; scaleAttempt < 8; scaleAttempt += 1) {
    if (scale < 1) {
      working = scaleCanvas(canvas, scale);
    }

    let low = 0.05;
    let high = 0.95;
    let localBest: { blob: Blob; quality: number } | null = null;

    for (let i = 0; i < 10; i += 1) {
      const mid = (low + high) / 2;
      const blob = await encodeCanvas(working, options.format, mid);
      if (blob.size <= targetBytes) {
        localBest = { blob, quality: mid };
        low = mid;
      } else {
        high = mid;
      }
    }

    if (localBest) {
      best = {
        ...localBest,
        width: working.width,
        height: working.height,
      };
      break;
    }

    const tiny = await encodeCanvas(working, options.format, 0.05);
    best = {
      blob: tiny,
      quality: 0.05,
      width: working.width,
      height: working.height,
    };
    if (tiny.size <= targetBytes) break;
    scale *= 0.75;
  }

  if (!best) {
    throw new Error("Compression failed");
  }

  return {
    blob: best.blob,
    qualityUsed: best.quality,
    width: best.width,
    height: best.height,
    formatId,
  };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
