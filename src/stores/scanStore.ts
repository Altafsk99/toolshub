"use client";

import { create } from "zustand";
import { downloadBlob } from "@/lib/image/engine";
import { imagesToPdf } from "@/lib/pdf/engine";
import {
  canvasToJpegBlob,
  defaultScanQuad,
  loadImageToCanvas,
  scanDocument,
  warpAndFilter,
  type ScanFilter,
  type ScanQuad,
} from "@/lib/image/scan";
import { useHistoryStore } from "@/stores/historyStore";
import type { PdfImageMeta } from "@/types/pdf";

export type ScanPage = {
  id: string;
  blob: Blob;
  previewUrl: string;
  width: number;
  height: number;
  name: string;
  originalFile: File;
};

type ScanStore = {
  sourceFile: File | null;
  sourcePreviewUrl: string | null;
  sourceWidth: number;
  sourceHeight: number;
  quad: ScanQuad | null;
  filter: ScanFilter;
  livePreviewUrl: string | null;
  isPreviewing: boolean;
  isProcessing: boolean;
  pages: ScanPage[];
  error: string | null;
  setSourceFile: (file: File) => Promise<void>;
  setFilter: (filter: ScanFilter) => void;
  setQuad: (quad: ScanQuad) => void;
  updateCorner: (corner: keyof ScanQuad, x: number, y: number) => void;
  refreshLivePreview: () => Promise<void>;
  applyScan: () => Promise<void>;
  removePage: (id: string) => void;
  downloadLastPage: () => void;
  downloadPdf: () => Promise<void>;
  clearSource: () => void;
  clearAll: () => void;
};

let previewToken = 0;

function newId(): string {
  return crypto.randomUUID();
}

function revoke(url: string | null): null {
  if (url) URL.revokeObjectURL(url);
  return null;
}

export const useScanStore = create<ScanStore>((set, get) => ({
  sourceFile: null,
  sourcePreviewUrl: null,
  sourceWidth: 0,
  sourceHeight: 0,
  quad: null,
  filter: "enhance",
  livePreviewUrl: null,
  isPreviewing: false,
  isProcessing: false,
  pages: [],
  error: null,

  setSourceFile: async (file) => {
    if (!file.type.startsWith("image/")) {
      set({ error: "Please choose an image file." });
      return;
    }

    const { sourcePreviewUrl, livePreviewUrl } = get();
    revoke(sourcePreviewUrl);
    revoke(livePreviewUrl);

    set({
      error: null,
      isProcessing: true,
      sourceFile: null,
      sourcePreviewUrl: null,
      livePreviewUrl: null,
      quad: null,
    });

    try {
      const canvas = await loadImageToCanvas(file);
      const quad = defaultScanQuad(canvas.width, canvas.height);
      set({
        sourceFile: file,
        sourcePreviewUrl: URL.createObjectURL(file),
        sourceWidth: canvas.width,
        sourceHeight: canvas.height,
        quad,
        isProcessing: false,
      });
      void get().refreshLivePreview();
    } catch (err) {
      set({
        isProcessing: false,
        error: err instanceof Error ? err.message : "Could not load image.",
      });
    }
  },

  setFilter: (filter) => {
    set({ filter });
    void get().refreshLivePreview();
  },

  setQuad: (quad) => {
    set({ quad });
  },

  updateCorner: (corner, x, y) => {
    const { quad, sourceWidth, sourceHeight } = get();
    if (!quad) return;
    set({
      quad: {
        ...quad,
        [corner]: {
          x: Math.min(sourceWidth - 1, Math.max(0, x)),
          y: Math.min(sourceHeight - 1, Math.max(0, y)),
        },
      },
    });
  },

  refreshLivePreview: async () => {
    const token = ++previewToken;
    const { sourceFile, quad, filter } = get();
    if (!sourceFile || !quad) return;

    set({ isPreviewing: true, error: null });
    try {
      const source = await loadImageToCanvas(sourceFile);
      if (token !== previewToken) return;
      const warped = warpAndFilter(source, quad, filter, 900);
      const blob = await canvasToJpegBlob(warped, 0.85);
      if (token !== previewToken) return;
      set((s) => ({
        livePreviewUrl: (() => {
          revoke(s.livePreviewUrl);
          return URL.createObjectURL(blob);
        })(),
        isPreviewing: false,
      }));
    } catch (err) {
      if (token !== previewToken) return;
      set({
        isPreviewing: false,
        error: err instanceof Error ? err.message : "Preview failed.",
      });
    }
  },

  applyScan: async () => {
    const { sourceFile, quad, filter, pages } = get();
    if (!sourceFile || !quad) {
      set({ error: "Add a photo first." });
      return;
    }

    set({ isProcessing: true, error: null });
    try {
      const result = await scanDocument(sourceFile, quad, filter);
      const page: ScanPage = {
        id: newId(),
        blob: result.blob,
        previewUrl: result.previewUrl,
        width: result.width,
        height: result.height,
        name: `scan-page-${pages.length + 1}.jpg`,
        originalFile: sourceFile,
      };

      set((s) => ({
        pages: [...s.pages, page],
        isProcessing: false,
      }));
    } catch (err) {
      set({
        isProcessing: false,
        error: err instanceof Error ? err.message : "Scan failed.",
      });
    }
  },

  removePage: (id) => {
    set((s) => {
      const removed = s.pages.find((page) => page.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return { pages: s.pages.filter((page) => page.id !== id) };
    });
  },

  downloadLastPage: () => {
    const { pages } = get();
    const last = pages[pages.length - 1];
    if (!last) return;
    downloadBlob(last.blob, last.name);
    void useHistoryStore.getState().saveDownload({
      tool: "scan",
      originalFile: last.originalFile,
      outputName: last.name,
      outputBlob: last.blob,
      width: last.width,
      height: last.height,
      format: "image/jpeg",
    });
  },

  downloadPdf: async () => {
    const { pages } = get();
    if (pages.length === 0) {
      set({ error: "Apply at least one scanned page first." });
      return;
    }

    set({ isProcessing: true, error: null });
    try {
      const files = pages.map(
        (page) => new File([page.blob], page.name, { type: "image/jpeg" }),
      );
      const metas: PdfImageMeta[] = pages.map((page) => ({
        id: page.id,
        name: page.name,
        size: page.blob.size,
        width: page.width,
        height: page.height,
        type: "image/jpeg",
        lastModified: Date.now(),
      }));
      const result = await imagesToPdf(files, metas, "fit");
      downloadBlob(result.blob, result.filename);
      const first = pages[0];
      void useHistoryStore.getState().saveDownload({
        tool: "scan",
        originalFile: first.originalFile,
        outputName: result.filename,
        outputBlob: result.blob,
        width: first.width,
        height: first.height,
        format: "application/pdf",
      });
      set({ isProcessing: false });
    } catch (err) {
      set({
        isProcessing: false,
        error: err instanceof Error ? err.message : "Could not build PDF.",
      });
    }
  },

  clearSource: () => {
    previewToken += 1;
    const { sourcePreviewUrl, livePreviewUrl } = get();
    revoke(sourcePreviewUrl);
    revoke(livePreviewUrl);
    set({
      sourceFile: null,
      sourcePreviewUrl: null,
      sourceWidth: 0,
      sourceHeight: 0,
      quad: null,
      livePreviewUrl: null,
      isPreviewing: false,
      isProcessing: false,
      error: null,
    });
  },

  clearAll: () => {
    previewToken += 1;
    const { sourcePreviewUrl, livePreviewUrl, pages } = get();
    revoke(sourcePreviewUrl);
    revoke(livePreviewUrl);
    for (const page of pages) URL.revokeObjectURL(page.previewUrl);
    set({
      sourceFile: null,
      sourcePreviewUrl: null,
      sourceWidth: 0,
      sourceHeight: 0,
      quad: null,
      filter: "enhance",
      livePreviewUrl: null,
      isPreviewing: false,
      isProcessing: false,
      pages: [],
      error: null,
    });
  },
}));
