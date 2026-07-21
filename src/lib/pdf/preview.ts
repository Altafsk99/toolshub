"use client";

import type { PDFDocumentProxy } from "pdfjs-dist";

let pdfjsModule: typeof import("pdfjs-dist") | null = null;
let workerConfigured = false;

async function getPdfJs() {
  if (!pdfjsModule) {
    pdfjsModule = await import("pdfjs-dist");
    if (!workerConfigured && typeof window !== "undefined") {
      pdfjsModule.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      workerConfigured = true;
    }
  }
  return pdfjsModule;
}

const docCache = new Map<string, Promise<PDFDocumentProxy>>();
const thumbCache = new Map<string, string>();

function fileKey(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function thumbKey(file: File, pageNumber: number, scale: number): string {
  return `${fileKey(file)}-p${pageNumber}-s${scale}`;
}

export async function loadPdfDocument(file: File): Promise<PDFDocumentProxy> {
  const key = fileKey(file);
  let pending = docCache.get(key);
  if (!pending) {
    const pdfjs = await getPdfJs();
    const data = await file.arrayBuffer();
    pending = pdfjs.getDocument({ data }).promise;
    docCache.set(key, pending);
  }
  return pending;
}

export async function renderPdfPageThumbnail(
  file: File,
  pageNumber: number,
  scale = 0.4,
): Promise<string> {
  const key = thumbKey(file, pageNumber, scale);
  const cached = thumbCache.get(key);
  if (cached) return cached;

  const pdf = await loadPdfDocument(file);
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");

  await page.render({ canvasContext: ctx, viewport, canvas }).promise;
  const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
  thumbCache.set(key, dataUrl);
  return dataUrl;
}

export function clearPdfPreviewCache(): void {
  docCache.clear();
  thumbCache.clear();
}

export function isPdfPreviewable(filename: string | null | undefined): boolean {
  return Boolean(filename && filename.toLowerCase().endsWith(".pdf"));
}
