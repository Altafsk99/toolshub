import type { EngineSource, ExportMime, ExportOptions, ImageMeta } from "@/types/image";
import type { ExportFormatId } from "@/lib/image/formats";
import { getExportFormat, mimeToDefaultFormatId } from "@/lib/image/formats";

function formatFromMime(mime: string): ExportMime {
  if (mime === "image/png") return "image/png";
  if (mime === "image/webp") return "image/webp";
  if (mime === "image/avif") return "image/avif";
  return "image/jpeg";
}

export function extensionFor(
  format: ExportMime,
  formatId?: ExportFormatId,
): string {
  if (formatId) return getExportFormat(formatId).extension;
  if (format === "image/png") return "png";
  if (format === "image/webp") return "webp";
  if (format === "image/avif") return "avif";
  return "jpg";
}

export async function loadImageFromFile(file: File): Promise<EngineSource> {
  const bitmap = await createImageBitmap(file);
  const meta: ImageMeta = {
    name: file.name,
    type: file.type || "image/jpeg",
    size: file.size,
    width: bitmap.width,
    height: bitmap.height,
    lastModified: file.lastModified,
  };
  return { bitmap, meta };
}

export function drawToCanvas(
  source: CanvasImageSource,
  width: number,
  height: number,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 2D context unavailable");
  }
  ctx.drawImage(source, 0, 0, width, height);
  return canvas;
}

export function exportCanvasToBlob(
  canvas: HTMLCanvasElement,
  options: ExportOptions = {},
): Promise<Blob> {
  const format = options.format ?? "image/jpeg";
  const quality = options.quality ?? 0.92;
  const useQuality = format !== "image/png";

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(
            new Error(
              `Failed to encode as ${format}. This format may be unsupported in your browser.`,
            ),
          );
          return;
        }
        resolve(blob);
      },
      format,
      useQuality ? quality : undefined,
    );
  });
}

export async function exportSource(
  source: EngineSource,
  options: ExportOptions = {},
): Promise<{ blob: Blob; filename: string }> {
  const canvas = document.createElement("canvas");
  canvas.width = source.meta.width;
  canvas.height = source.meta.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 2D context unavailable");
  }

  const format = options.format ?? formatFromMime(source.meta.type);
  const formatId = options.formatId ?? mimeToDefaultFormatId(format);
  const formatOption = getExportFormat(formatId);

  if (!formatOption.supportsAlpha) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(source.bitmap, 0, 0, canvas.width, canvas.height);

  const blob = await exportCanvasToBlob(canvas, { ...options, format });
  const base = source.meta.name.replace(/\.[^.]+$/, "") || "image";
  const ext = extensionFor(format, formatId);
  const filename = options.filename ?? `${base}.${ext}`;
  return { blob, filename };
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function revokeSource(source: EngineSource | null): void {
  source?.bitmap.close();
}

/** Sprint 1 skeleton pipeline: load → draw → export (identity pass). */
export async function processIdentity(file: File, options?: ExportOptions) {
  const source = await loadImageFromFile(file);
  try {
    return await exportSource(source, options);
  } finally {
    revokeSource(source);
  }
}
