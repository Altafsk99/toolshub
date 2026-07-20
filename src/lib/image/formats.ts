export type ExportMime =
  | "image/png"
  | "image/jpeg"
  | "image/webp"
  | "image/avif";

/** UI / filename identity — JPG and JPEG share mime, differ by extension */
export type ExportFormatId = "png" | "jpg" | "jpeg" | "webp" | "avif";

export type ExportFormatOption = {
  id: ExportFormatId;
  mime: ExportMime;
  label: string;
  extension: string;
  /** Quality slider applies (lossy codecs) */
  supportsQuality: boolean;
  /** Can store transparency */
  supportsAlpha: boolean;
};

export const EXPORT_FORMATS: ExportFormatOption[] = [
  {
    id: "png",
    mime: "image/png",
    label: "PNG",
    extension: "png",
    supportsQuality: false,
    supportsAlpha: true,
  },
  {
    id: "jpg",
    mime: "image/jpeg",
    label: "JPG",
    extension: "jpg",
    supportsQuality: true,
    supportsAlpha: false,
  },
  {
    id: "jpeg",
    mime: "image/jpeg",
    label: "JPEG",
    extension: "jpeg",
    supportsQuality: true,
    supportsAlpha: false,
  },
  {
    id: "webp",
    mime: "image/webp",
    label: "WebP",
    extension: "webp",
    supportsQuality: true,
    supportsAlpha: true,
  },
  {
    id: "avif",
    mime: "image/avif",
    label: "AVIF",
    extension: "avif",
    supportsQuality: true,
    supportsAlpha: true,
  },
];

export function getExportFormat(id: ExportFormatId): ExportFormatOption {
  return EXPORT_FORMATS.find((f) => f.id === id) ?? EXPORT_FORMATS[1];
}

export function mimeToDefaultFormatId(mime: string): ExportFormatId {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/avif") return "avif";
  if (mime === "image/jpeg") return "jpg";
  return "jpg";
}

/** Check canvas encode support for AVIF (and others). */
export async function detectFormatSupport(): Promise<Record<ExportFormatId, boolean>> {
  const support: Record<ExportFormatId, boolean> = {
    png: true,
    jpg: true,
    jpeg: true,
    webp: false,
    avif: false,
  };

  if (typeof document === "undefined") return support;

  const canvas = document.createElement("canvas");
  canvas.width = 2;
  canvas.height = 2;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, 2, 2);
  }

  const probe = (mime: string) =>
    new Promise<boolean>((resolve) => {
      try {
        canvas.toBlob(
          (blob) => resolve(Boolean(blob && blob.type === mime && blob.size > 0)),
          mime,
          0.8,
        );
      } catch {
        resolve(false);
      }
    });

  const [webp, avif] = await Promise.all([
    probe("image/webp"),
    probe("image/avif"),
  ]);
  support.webp = webp;
  support.avif = avif;
  return support;
}
