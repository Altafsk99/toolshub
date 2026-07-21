import { PDFDocument, degrees, type PDFPage } from "pdf-lib";
import JSZip from "jszip";
import type {
  ImagePageSize,
  PdfFileMeta,
  PdfImageMeta,
  RotateAngle,
  SplitMode,
} from "@/types/pdf";

const A4 = { width: 595.28, height: 841.89 };
const LETTER = { width: 612, height: 792 };

function toPdfBlob(bytes: Uint8Array): Blob {
  return new Blob([Uint8Array.from(bytes)], { type: "application/pdf" });
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export async function readPdfMeta(file: File, id: string): Promise<PdfFileMeta> {
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  return {
    id,
    name: file.name,
    size: file.size,
    pageCount: doc.getPageCount(),
    lastModified: file.lastModified,
  };
}

export async function mergePdfs(files: File[]): Promise<{ blob: Blob; filename: string }> {
  if (files.length < 2) {
    throw new Error("Add at least two PDF files to merge.");
  }

  const merged = await PDFDocument.create();

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const source = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const copied = await merged.copyPages(source, source.getPageIndices());
    for (const page of copied) {
      merged.addPage(page);
    }
  }

  const output = await merged.save();
  const base = files[0]?.name.replace(/\.pdf$/i, "") || "merged";
  return {
    blob: toPdfBlob(output),
    filename: `${base}-merged.pdf`,
  };
}

export async function splitPdf(
  file: File,
  mode: SplitMode,
  options: { fromPage?: number; toPage?: number; pages?: number[] },
): Promise<{ blob: Blob; filename: string } | { zipBlob: Blob; filename: string }> {
  const bytes = await file.arrayBuffer();
  const source = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const pageCount = source.getPageCount();
  const base = file.name.replace(/\.pdf$/i, "") || "document";

  if (mode === "every-page") {
    const zip = new JSZip();
    for (let i = 0; i < pageCount; i += 1) {
      const out = await PDFDocument.create();
      const [page] = await out.copyPages(source, [i]);
      out.addPage(page);
      const saved = await out.save();
      zip.file(`${base}-page-${i + 1}.pdf`, saved);
    }
    const zipBlob = await zip.generateAsync({ type: "blob" });
    return { zipBlob, filename: `${base}-pages.zip` };
  }

  if (mode === "range") {
    const from = Math.max(1, options.fromPage ?? 1);
    const to = Math.min(pageCount, options.toPage ?? pageCount);
    if (from > to) {
      throw new Error("Start page must be less than or equal to end page.");
    }
    const indices = Array.from({ length: to - from + 1 }, (_, idx) => from - 1 + idx);
    const out = await PDFDocument.create();
    const pages = await out.copyPages(source, indices);
    for (const page of pages) {
      out.addPage(page);
    }
    const saved = await out.save();
    return {
      blob: toPdfBlob(saved),
      filename: `${base}-pages-${from}-${to}.pdf`,
    };
  }

  const pages = options.pages?.filter((p) => p >= 1 && p <= pageCount) ?? [];
  if (pages.length === 0) {
    throw new Error("Enter at least one valid page number.");
  }
  const indices = [...new Set(pages)].sort((a, b) => a - b).map((p) => p - 1);
  const out = await PDFDocument.create();
  const copied = await out.copyPages(source, indices);
  for (const page of copied) {
    out.addPage(page);
  }
  const saved = await out.save();
  return {
    blob: toPdfBlob(saved),
    filename: `${base}-extract.pdf`,
  };
}

function rotatePage(page: PDFPage, angle: RotateAngle): void {
  const current = page.getRotation().angle;
  page.setRotation(degrees((current + angle) % 360));
}

export async function rotatePdf(
  file: File,
  angle: RotateAngle,
  scope: "all" | "range",
  fromPage?: number,
  toPage?: number,
): Promise<{ blob: Blob; filename: string }> {
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const pageCount = doc.getPageCount();
  const base = file.name.replace(/\.pdf$/i, "") || "document";

  const pages =
    scope === "all"
      ? doc.getPages()
      : doc
          .getPages()
          .slice(
            Math.max(0, (fromPage ?? 1) - 1),
            Math.min(pageCount, toPage ?? pageCount),
          );

  if (pages.length === 0) {
    throw new Error("No pages selected for rotation.");
  }

  for (const page of pages) {
    rotatePage(page, angle);
  }

  const saved = await doc.save();
  return {
    blob: toPdfBlob(saved),
    filename: `${base}-rotated-${angle}.pdf`,
  };
}

async function imageFileToBytes(file: File): Promise<{ bytes: Uint8Array; mime: string }> {
  const mime = file.type || "image/jpeg";
  if (mime === "image/jpeg" || mime === "image/jpg" || mime === "image/png") {
    return { bytes: new Uint8Array(await file.arrayBuffer()), mime };
  }

  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");
    ctx.drawImage(bitmap, 0, 0);
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Failed to encode image"))),
        "image/jpeg",
        0.92,
      );
    });
    return { bytes: new Uint8Array(await blob.arrayBuffer()), mime: "image/jpeg" };
  } finally {
    bitmap.close();
  }
}

function pageDimensions(
  pageSize: ImagePageSize,
  imgW: number,
  imgH: number,
): { width: number; height: number; drawW: number; drawH: number; x: number; y: number } {
  if (pageSize === "fit") {
    return { width: imgW, height: imgH, drawW: imgW, drawH: imgH, x: 0, y: 0 };
  }

  const box = pageSize === "a4" ? A4 : LETTER;
  const scale = Math.min(box.width / imgW, box.height / imgH);
  const drawW = imgW * scale;
  const drawH = imgH * scale;
  const x = (box.width - drawW) / 2;
  const y = (box.height - drawH) / 2;
  return { width: box.width, height: box.height, drawW, drawH, x, y };
}

export async function imagesToPdf(
  files: File[],
  metas: PdfImageMeta[],
  pageSize: ImagePageSize,
): Promise<{ blob: Blob; filename: string; pageCount: number }> {
  if (files.length === 0) {
    throw new Error("Add at least one image.");
  }

  const pdf = await PDFDocument.create();

  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    const meta = metas[i];
    if (!file || !meta) continue;

    const { bytes, mime } = await imageFileToBytes(file);
    const embedded =
      mime === "image/png"
        ? await pdf.embedPng(bytes)
        : await pdf.embedJpg(bytes);

    const dims = pageDimensions(pageSize, embedded.width, embedded.height);
    const page = pdf.addPage([dims.width, dims.height]);
    page.drawImage(embedded, {
      x: dims.x,
      y: dims.y,
      width: dims.drawW,
      height: dims.drawH,
    });
  }

  const saved = await pdf.save();
  const base = files.length === 1
    ? files[0].name.replace(/\.[^.]+$/, "")
    : "images";
  return {
    blob: toPdfBlob(saved),
    filename: `${base}.pdf`,
    pageCount: files.length,
  };
}
