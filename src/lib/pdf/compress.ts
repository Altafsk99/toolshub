"use client";

import { PDFDocument } from "pdf-lib";
import { loadPdfDocument } from "@/lib/pdf/preview";
import type { PdfCompressLevel } from "@/types/pdf";

const LEVEL_SETTINGS: Record<
  PdfCompressLevel,
  { scale: number; quality: number; label: string }
> = {
  high: { scale: 1.5, quality: 0.82, label: "High quality" },
  balanced: { scale: 1.2, quality: 0.7, label: "Balanced" },
  small: { scale: 1, quality: 0.55, label: "Smallest" },
};

export function getCompressLevelSettings(level: PdfCompressLevel) {
  return LEVEL_SETTINGS[level];
}

function toPdfBlob(bytes: Uint8Array): Blob {
  return new Blob([Uint8Array.from(bytes)], { type: "application/pdf" });
}

async function canvasToJpegBytes(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Uint8Array> {
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Failed to encode page image"))),
      "image/jpeg",
      quality,
    );
  });
  return new Uint8Array(await blob.arrayBuffer());
}

/**
 * Compress a PDF in the browser by rasterizing pages (pdf.js) and rebuilding
 * with JPEG-compressed page images (pdf-lib). Text may become less sharp —
 * choose High quality for documents you need to read closely.
 */
export async function compressPdf(
  file: File,
  level: PdfCompressLevel,
): Promise<{
  blob: Blob;
  filename: string;
  originalBytes: number;
  outputBytes: number;
  pageCount: number;
}> {
  const settings = LEVEL_SETTINGS[level];
  const pdf = await loadPdfDocument(file);
  const pageCount = pdf.numPages;
  if (pageCount < 1) {
    throw new Error("This PDF has no pages to compress.");
  }

  const out = await PDFDocument.create();

  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: settings.scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.floor(viewport.width));
    canvas.height = Math.max(1, Math.floor(viewport.height));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");

    // White background — avoids black transparent edges in JPEG
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvasContext: ctx, viewport, canvas }).promise;
    const jpegBytes = await canvasToJpegBytes(canvas, settings.quality);
    const embedded = await out.embedJpg(jpegBytes);
    const pdfPage = out.addPage([embedded.width, embedded.height]);
    pdfPage.drawImage(embedded, {
      x: 0,
      y: 0,
      width: embedded.width,
      height: embedded.height,
    });

    // Yield so the UI can stay responsive on long PDFs
    await new Promise((resolve) => window.setTimeout(resolve, 0));
  }

  const saved = await out.save({ useObjectStreams: true });
  const base = file.name.replace(/\.pdf$/i, "") || "document";
  const blob = toPdfBlob(saved);

  return {
    blob,
    filename: `${base}-compressed.pdf`,
    originalBytes: file.size,
    outputBytes: blob.size,
    pageCount,
  };
}
