"use client";

import { create } from "zustand";
import { downloadBlob } from "@/lib/image/engine";
import {
  formatBytes,
  imagesToPdf,
  mergePdfs,
  readPdfMeta,
  rotatePdf,
  splitPdf,
} from "@/lib/pdf/engine";
import { clearPdfPreviewCache, isPdfPreviewable } from "@/lib/pdf/preview";
import type {
  ImagePageSize,
  PdfFileMeta,
  PdfImageMeta,
  RotateAngle,
  RotateScope,
  SplitMode,
} from "@/types/pdf";

export { formatBytes };

type PdfRunOptions = {
  silent?: boolean;
};

type PdfEntry = {
  file: File;
  meta: PdfFileMeta;
};

type ImageEntry = {
  file: File;
  meta: PdfImageMeta;
  previewUrl: string;
};

type PdfStore = {
  pdfFiles: PdfEntry[];
  singlePdf: PdfEntry | null;
  imageFiles: ImageEntry[];
  resultBlob: Blob | null;
  resultFilename: string | null;
  resultPreviewUrl: string | null;
  isProcessing: boolean;
  isPreviewing: boolean;
  error: string | null;
  addPdfFiles: (files: File[]) => Promise<void>;
  removePdfFile: (id: string) => void;
  movePdfFile: (id: string, direction: "up" | "down") => void;
  setSinglePdf: (file: File) => Promise<void>;
  addImageFiles: (files: File[]) => Promise<void>;
  removeImageFile: (id: string) => void;
  moveImageFile: (id: string, direction: "up" | "down") => void;
  runMerge: (opts?: PdfRunOptions) => Promise<void>;
  runSplit: (
    mode: SplitMode,
    options: { fromPage?: number; toPage?: number; pages?: number[] },
    opts?: PdfRunOptions,
  ) => Promise<void>;
  runRotate: (
    angle: RotateAngle,
    scope: RotateScope,
    fromPage?: number,
    toPage?: number,
    opts?: PdfRunOptions,
  ) => Promise<void>;
  runImagesToPdf: (pageSize: ImagePageSize, opts?: PdfRunOptions) => Promise<void>;
  downloadResult: () => void;
  clear: () => void;
};

let mergeToken = 0;
let splitToken = 0;
let rotateToken = 0;
let imagesToPdfToken = 0;

function newId(): string {
  return crypto.randomUUID();
}

async function imageMetaFromFile(file: File): Promise<PdfImageMeta> {
  const bitmap = await createImageBitmap(file);
  try {
    return {
      id: newId(),
      name: file.name,
      size: file.size,
      width: bitmap.width,
      height: bitmap.height,
      type: file.type || "image/jpeg",
      lastModified: file.lastModified,
    };
  } finally {
    bitmap.close();
  }
}

function revokeImagePreviews(entries: ImageEntry[]): void {
  for (const entry of entries) {
    URL.revokeObjectURL(entry.previewUrl);
  }
}

function revokeResultPreview(url: string | null): null {
  if (url) URL.revokeObjectURL(url);
  return null;
}

function applyBinaryResult(
  state: Pick<PdfStore, "resultPreviewUrl">,
  blob: Blob,
  filename: string,
): Pick<PdfStore, "resultBlob" | "resultFilename" | "resultPreviewUrl" | "isProcessing" | "isPreviewing"> {
  revokeResultPreview(state.resultPreviewUrl);
  return {
    resultBlob: blob,
    resultFilename: filename,
    resultPreviewUrl: isPdfPreviewable(filename) ? URL.createObjectURL(blob) : null,
    isProcessing: false,
    isPreviewing: false,
  };
}

function clearBinaryResult(
  state: Pick<PdfStore, "resultPreviewUrl">,
): Pick<PdfStore, "resultBlob" | "resultFilename" | "resultPreviewUrl" | "isPreviewing"> {
  return {
    resultBlob: null,
    resultFilename: null,
    resultPreviewUrl: revokeResultPreview(state.resultPreviewUrl),
    isPreviewing: false,
  };
}

export const usePdfStore = create<PdfStore>((set, get) => ({
  pdfFiles: [],
  singlePdf: null,
  imageFiles: [],
  resultBlob: null,
  resultFilename: null,
  resultPreviewUrl: null,
  isProcessing: false,
  isPreviewing: false,
  error: null,

  addPdfFiles: async (files) => {
    const pdfs = files.filter((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (pdfs.length === 0) {
      set({ error: "Please choose PDF files only." });
      return;
    }
    set({ error: null, isProcessing: true });
    try {
      const entries: PdfEntry[] = [];
      for (const file of pdfs) {
        const meta = await readPdfMeta(file, newId());
        entries.push({ file, meta });
      }
      set((s) => ({
        pdfFiles: [...s.pdfFiles, ...entries],
        isProcessing: false,
      }));
    } catch (err) {
      set({
        isProcessing: false,
        error: err instanceof Error ? err.message : "Could not read PDF.",
      });
    }
  },

  removePdfFile: (id) => {
    set((s) => {
      const pdfFiles = s.pdfFiles.filter((entry) => entry.meta.id !== id);
      return {
        pdfFiles,
        ...(pdfFiles.length < 2 ? clearBinaryResult(s) : {}),
      };
    });
  },

  movePdfFile: (id, direction) => {
    set((s) => {
      const list = [...s.pdfFiles];
      const index = list.findIndex((entry) => entry.meta.id === id);
      if (index < 0) return s;
      const swap = direction === "up" ? index - 1 : index + 1;
      if (swap < 0 || swap >= list.length) return s;
      [list[index], list[swap]] = [list[swap], list[index]];
      return { pdfFiles: list };
    });
  },

  setSinglePdf: async (file) => {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      set({ error: "Please choose a PDF file." });
      return;
    }
    set((s) => ({
      error: null,
      isProcessing: true,
      singlePdf: null,
      ...clearBinaryResult(s),
    }));
    try {
      const meta = await readPdfMeta(file, newId());
      set({
        singlePdf: { file, meta },
        isProcessing: false,
      });
    } catch (err) {
      set({
        singlePdf: null,
        isProcessing: false,
        error: err instanceof Error ? err.message : "Could not read PDF.",
      });
    }
  },

  addImageFiles: async (files) => {
    const images = files.filter((f) => f.type.startsWith("image/"));
    if (images.length === 0) {
      set({ error: "Please choose image files only." });
      return;
    }
    set({ error: null, isProcessing: true });
    try {
      const entries: ImageEntry[] = [];
      for (const file of images) {
        const meta = await imageMetaFromFile(file);
        entries.push({ file, meta, previewUrl: URL.createObjectURL(file) });
      }
      set((s) => ({
        imageFiles: [...s.imageFiles, ...entries],
        isProcessing: false,
      }));
    } catch (err) {
      set({
        isProcessing: false,
        error: err instanceof Error ? err.message : "Could not read image.",
      });
    }
  },

  removeImageFile: (id) => {
    set((s) => {
      const removed = s.imageFiles.find((entry) => entry.meta.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      const imageFiles = s.imageFiles.filter((entry) => entry.meta.id !== id);
      return {
        imageFiles,
        ...(imageFiles.length === 0 ? clearBinaryResult(s) : {}),
      };
    });
  },

  moveImageFile: (id, direction) => {
    set((s) => {
      const list = [...s.imageFiles];
      const index = list.findIndex((entry) => entry.meta.id === id);
      if (index < 0) return s;
      const swap = direction === "up" ? index - 1 : index + 1;
      if (swap < 0 || swap >= list.length) return s;
      [list[index], list[swap]] = [list[swap], list[index]];
      return { imageFiles: list };
    });
  },

  runMerge: async (opts) => {
    const silent = Boolean(opts?.silent);
    const token = ++mergeToken;
    const { pdfFiles } = get();

    if (pdfFiles.length < 2) {
      if (!silent) set({ error: "Add at least two PDF files to merge." });
      else set((s) => ({ ...clearBinaryResult(s), error: null }));
      return;
    }

    set(
      silent
        ? { isPreviewing: true, error: null }
        : { isProcessing: true, isPreviewing: false, error: null },
    );

    try {
      const result = await mergePdfs(pdfFiles.map((entry) => entry.file));
      if (token !== mergeToken) return;
      set((s) => ({
        ...applyBinaryResult(s, result.blob, result.filename),
      }));
    } catch (err) {
      if (token !== mergeToken) return;
      set({
        isProcessing: false,
        isPreviewing: false,
        error: err instanceof Error ? err.message : "Merge failed.",
      });
    }
  },

  runSplit: async (mode, options, opts) => {
    const silent = Boolean(opts?.silent);
    const token = ++splitToken;
    const { singlePdf } = get();

    if (!singlePdf) {
      if (!silent) set({ error: "Upload a PDF first." });
      return;
    }

    set(
      silent
        ? { isPreviewing: true, error: null }
        : { isProcessing: true, isPreviewing: false, error: null },
    );

    try {
      const result = await splitPdf(singlePdf.file, mode, options);
      if (token !== splitToken) return;
      if ("zipBlob" in result) {
        set((s) => ({
          ...applyBinaryResult(s, result.zipBlob, result.filename),
        }));
      } else {
        set((s) => ({
          ...applyBinaryResult(s, result.blob, result.filename),
        }));
      }
    } catch (err) {
      if (token !== splitToken) return;
      set({
        isProcessing: false,
        isPreviewing: false,
        error: err instanceof Error ? err.message : "Split failed.",
      });
    }
  },

  runRotate: async (angle, scope, fromPage, toPage, opts) => {
    const silent = Boolean(opts?.silent);
    const token = ++rotateToken;
    const { singlePdf } = get();

    if (!singlePdf) {
      if (!silent) set({ error: "Upload a PDF first." });
      return;
    }

    set(
      silent
        ? { isPreviewing: true, error: null }
        : { isProcessing: true, isPreviewing: false, error: null },
    );

    try {
      const result = await rotatePdf(singlePdf.file, angle, scope, fromPage, toPage);
      if (token !== rotateToken) return;
      set((s) => ({
        ...applyBinaryResult(s, result.blob, result.filename),
      }));
    } catch (err) {
      if (token !== rotateToken) return;
      set({
        isProcessing: false,
        isPreviewing: false,
        error: err instanceof Error ? err.message : "Rotate failed.",
      });
    }
  },

  runImagesToPdf: async (pageSize, opts) => {
    const silent = Boolean(opts?.silent);
    const token = ++imagesToPdfToken;
    const { imageFiles } = get();

    if (imageFiles.length === 0) {
      if (!silent) set({ error: "Add at least one image." });
      else set((s) => ({ ...clearBinaryResult(s), error: null }));
      return;
    }

    set(
      silent
        ? { isPreviewing: true, error: null }
        : { isProcessing: true, isPreviewing: false, error: null },
    );

    try {
      const result = await imagesToPdf(
        imageFiles.map((entry) => entry.file),
        imageFiles.map((entry) => entry.meta),
        pageSize,
      );
      if (token !== imagesToPdfToken) return;
      set((s) => ({
        ...applyBinaryResult(s, result.blob, result.filename),
      }));
    } catch (err) {
      if (token !== imagesToPdfToken) return;
      set({
        isProcessing: false,
        isPreviewing: false,
        error: err instanceof Error ? err.message : "Could not build PDF.",
      });
    }
  },

  downloadResult: () => {
    const { resultBlob, resultFilename } = get();
    if (!resultBlob || !resultFilename) return;
    downloadBlob(resultBlob, resultFilename);
  },

  clear: () => {
    mergeToken += 1;
    splitToken += 1;
    rotateToken += 1;
    imagesToPdfToken += 1;
    const { imageFiles, resultPreviewUrl } = get();
    revokeImagePreviews(imageFiles);
    revokeResultPreview(resultPreviewUrl);
    clearPdfPreviewCache();
    set({
      pdfFiles: [],
      singlePdf: null,
      imageFiles: [],
      resultBlob: null,
      resultFilename: null,
      resultPreviewUrl: null,
      isProcessing: false,
      isPreviewing: false,
      error: null,
    });
  },
}));
