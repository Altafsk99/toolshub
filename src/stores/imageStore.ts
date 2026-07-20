"use client";

import { create } from "zustand";
import { compressSource, formatBytes } from "@/lib/image/compress";
import {
  downloadBlob,
  exportSource,
  loadImageFromFile,
  revokeSource,
} from "@/lib/image/engine";
import { resizeSource } from "@/lib/image/resize";
import { useHistoryStore } from "@/stores/historyStore";
import type { HistoryToolId } from "@/types/history";
import type {
  CompressOptions,
  CompressResult,
  ConvertResult,
  EngineSource,
  ExportOptions,
  ImageMeta,
  ResizeOptions,
  ResizeResult,
} from "@/types/image";

export type ProcessOpts = {
  /** Live preview: skips heavy UI busy state and ignores stale results */
  silent?: boolean;
};

type ImageState = {
  file: File | null;
  source: EngineSource | null;
  meta: ImageMeta | null;
  previewUrl: string | null;
  resultPreviewUrl: string | null;
  /** Increments on every applied result so preview <img> always remounts */
  resultRevision: number;
  resultBlob: Blob | null;
  resultFilename: string | null;
  compressResult: CompressResult | null;
  convertResult: ConvertResult | null;
  resizeResult: ResizeResult | null;
  isProcessing: boolean;
  isPreviewing: boolean;
  error: string | null;
  setFile: (file: File | null) => Promise<void>;
  clear: () => void;
  runIdentityExport: (options?: ExportOptions, opts?: ProcessOpts) => Promise<void>;
  runCompress: (options: CompressOptions, opts?: ProcessOpts) => Promise<void>;
  runResize: (options: ResizeOptions, opts?: ProcessOpts) => Promise<void>;
  downloadResult: (tool?: HistoryToolId) => void;
};

function revokeUrl(url: string | null) {
  if (url) URL.revokeObjectURL(url);
}

/** Separate tokens so compress/resize live previews don't cancel each other. */
let resizeToken = 0;
let compressToken = 0;
let exportToken = 0;

export const useImageStore = create<ImageState>((set, get) => ({
  file: null,
  source: null,
  meta: null,
  previewUrl: null,
  resultPreviewUrl: null,
  resultRevision: 0,
  resultBlob: null,
  resultFilename: null,
  compressResult: null,
  convertResult: null,
  resizeResult: null,
  isProcessing: false,
  isPreviewing: false,
  error: null,

  setFile: async (file) => {
    resizeToken += 1;
    compressToken += 1;
    exportToken += 1;
    const prev = get();
    revokeSource(prev.source);
    revokeUrl(prev.previewUrl);
    revokeUrl(prev.resultPreviewUrl);

    if (!file) {
      set({
        file: null,
        source: null,
        meta: null,
        previewUrl: null,
        resultPreviewUrl: null,
        resultBlob: null,
        resultFilename: null,
        compressResult: null,
        convertResult: null,
        resizeResult: null,
        isProcessing: false,
        isPreviewing: false,
        error: null,
      });
      return;
    }

    try {
      const source = await loadImageFromFile(file);
      set({
        file,
        source,
        meta: source.meta,
        previewUrl: URL.createObjectURL(file),
        resultPreviewUrl: null,
        resultBlob: null,
        resultFilename: null,
        compressResult: null,
        convertResult: null,
        resizeResult: null,
        isProcessing: false,
        isPreviewing: false,
        error: null,
      });
    } catch {
      set({
        file: null,
        source: null,
        meta: null,
        previewUrl: null,
        resultPreviewUrl: null,
        compressResult: null,
        convertResult: null,
        resizeResult: null,
        isProcessing: false,
        isPreviewing: false,
        error: "Could not read that image. Try JPG, PNG, or WebP.",
      });
    }
  },

  clear: () => {
    resizeToken += 1;
    compressToken += 1;
    exportToken += 1;
    const prev = get();
    revokeSource(prev.source);
    revokeUrl(prev.previewUrl);
    revokeUrl(prev.resultPreviewUrl);
    set({
      file: null,
      source: null,
      meta: null,
      previewUrl: null,
      resultPreviewUrl: null,
      resultBlob: null,
      resultFilename: null,
      compressResult: null,
      resizeResult: null,
      isProcessing: false,
      isPreviewing: false,
      error: null,
    });
  },

  runIdentityExport: async (options, opts) => {
    const { source } = get();
    if (!source) return;

    const silent = Boolean(opts?.silent);
    const token = ++exportToken;
    set(
      silent
        ? { isPreviewing: true, error: null }
        : { isProcessing: true, isPreviewing: false, error: null },
    );
    try {
      const { blob, filename } = await exportSource(source, options);
      if (token !== exportToken) return;
      const format = options?.format ?? blob.type;
      const qualityUsed = options?.quality;
      const ext = filename.includes(".") ? filename.split(".").pop() : undefined;
      const convertedFilename =
        ext && !filename.includes("-converted.")
          ? filename.replace(`.${ext}`, `-converted.${ext}`)
          : filename;

      revokeUrl(get().resultPreviewUrl);
      set({
        resultBlob: blob,
        resultFilename: convertedFilename,
        resultPreviewUrl: URL.createObjectURL(blob),
        resultRevision: get().resultRevision + 1,
        compressResult: null,
        convertResult: {
          blob,
          filename: convertedFilename,
          originalBytes: source.meta.size,
          outputBytes: blob.size,
          width: source.meta.width,
          height: source.meta.height,
          format: format as ConvertResult["format"],
          formatId: options?.formatId,
          qualityUsed,
        },
        resizeResult: null,
        isProcessing: false,
        isPreviewing: false,
      });
    } catch {
      if (token !== exportToken) return;
      set({
        isProcessing: false,
        isPreviewing: false,
        error: "Conversion failed. Try another format or image.",
      });
    }
  },

  runCompress: async (options, opts) => {
    const { source } = get();
    if (!source) return;

    const silent = Boolean(opts?.silent);
    const token = ++compressToken;
    set(
      silent
        ? { isPreviewing: true, error: null }
        : { isProcessing: true, isPreviewing: false, error: null },
    );

    try {
      const result = await compressSource(source, options);
      if (token !== compressToken) return;
      revokeUrl(get().resultPreviewUrl);
      set({
        resultBlob: result.blob,
        resultFilename: result.filename,
        resultPreviewUrl: URL.createObjectURL(result.blob),
        resultRevision: get().resultRevision + 1,
        compressResult: result,
        convertResult: null,
        resizeResult: null,
        isProcessing: false,
        isPreviewing: false,
      });
    } catch {
      if (token !== compressToken) return;
      set({
        isProcessing: false,
        isPreviewing: false,
        error: "Compression failed. Try a higher target size or different format.",
      });
    }
  },

  runResize: async (options, opts) => {
    const { source } = get();
    if (!source) return;

    const silent = Boolean(opts?.silent);
    const token = ++resizeToken;
    set(
      silent
        ? { isPreviewing: true, error: null }
        : { isProcessing: true, isPreviewing: false, error: null },
    );

    try {
      const result = await resizeSource(source, options);
      if (token !== resizeToken) return;
      revokeUrl(get().resultPreviewUrl);
      set({
        resultBlob: result.blob,
        resultFilename: result.filename,
        resultPreviewUrl: URL.createObjectURL(result.blob),
        resultRevision: get().resultRevision + 1,
        resizeResult: result,
        compressResult: null,
        convertResult: null,
        isProcessing: false,
        isPreviewing: false,
      });
    } catch {
      if (token !== resizeToken) return;
      set({
        isProcessing: false,
        isPreviewing: false,
        error: "Resize failed. Check width and height, then try again.",
      });
    }
  },

  downloadResult: (tool) => {
    const {
      resultBlob,
      resultFilename,
      file,
      meta,
      compressResult,
      convertResult,
      resizeResult,
    } = get();

    if (resultBlob && resultFilename) {
      downloadBlob(resultBlob, resultFilename);

      if (tool && file) {
        const width =
          resizeResult?.width ??
          compressResult?.width ??
          convertResult?.width ??
          meta?.width ??
          0;
        const height =
          resizeResult?.height ??
          compressResult?.height ??
          convertResult?.height ??
          meta?.height ??
          0;
        const format =
          resizeResult?.format ??
          compressResult?.format ??
          convertResult?.format ??
          resultBlob.type ??
          "image/jpeg";

        void useHistoryStore.getState().saveDownload({
          tool,
          originalFile: file,
          outputBlob: resultBlob,
          outputName: resultFilename,
          width,
          height,
          format,
        });
      }
      return;
    }

    if (file) {
      downloadBlob(file, file.name);
    }
  },
}));

export { formatBytes };
