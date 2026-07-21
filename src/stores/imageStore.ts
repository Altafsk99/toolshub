"use client";

import { create } from "zustand";
import { compressSource, formatBytes } from "@/lib/image/compress";
import { cropSource } from "@/lib/image/crop";
import {
  downloadBlob,
  exportSource,
  loadImageFromFile,
  revokeSource,
} from "@/lib/image/engine";
import { resizeSource } from "@/lib/image/resize";
import { flipSource, rotateSource } from "@/lib/image/transform";
import { useHistoryStore } from "@/stores/historyStore";
import type { HistoryToolId } from "@/types/history";
import type {
  CompressOptions,
  CompressResult,
  ConvertResult,
  CropOptions,
  CropResult,
  EngineSource,
  ExportOptions,
  FlipOptions,
  FlipResult,
  ImageMeta,
  ResizeOptions,
  ResizeResult,
  RotateOptions,
  RotateResult,
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
  cropResult: CropResult | null;
  rotateResult: RotateResult | null;
  flipResult: FlipResult | null;
  isProcessing: boolean;
  isPreviewing: boolean;
  error: string | null;
  setFile: (file: File | null) => Promise<void>;
  clear: () => void;
  runIdentityExport: (options?: ExportOptions, opts?: ProcessOpts) => Promise<void>;
  runCompress: (options: CompressOptions, opts?: ProcessOpts) => Promise<void>;
  runResize: (options: ResizeOptions, opts?: ProcessOpts) => Promise<void>;
  runCrop: (options: CropOptions, opts?: ProcessOpts) => Promise<void>;
  clearCropResult: () => void;
  runRotate: (options: RotateOptions, opts?: ProcessOpts) => Promise<void>;
  clearRotateResult: () => void;
  runFlip: (options: FlipOptions, opts?: ProcessOpts) => Promise<void>;
  clearFlipResult: () => void;
  downloadResult: (tool?: HistoryToolId) => void;
};

function revokeUrl(url: string | null) {
  if (url) URL.revokeObjectURL(url);
}

/** Separate tokens so compress/resize live previews don't cancel each other. */
let resizeToken = 0;
let compressToken = 0;
let exportToken = 0;
let cropToken = 0;
let rotateToken = 0;
let flipToken = 0;

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
  cropResult: null,
  rotateResult: null,
  flipResult: null,
  isProcessing: false,
  isPreviewing: false,
  error: null,

  setFile: async (file) => {
    resizeToken += 1;
    compressToken += 1;
    exportToken += 1;
    cropToken += 1;
    rotateToken += 1;
    flipToken += 1;
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
        cropResult: null,
        rotateResult: null,
        flipResult: null,
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
        cropResult: null,
        rotateResult: null,
        flipResult: null,
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
        cropResult: null,
        rotateResult: null,
        flipResult: null,
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
    cropToken += 1;
    rotateToken += 1;
    flipToken += 1;
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
      cropResult: null,
      rotateResult: null,
      flipResult: null,
      convertResult: null,
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
        cropResult: null,
        rotateResult: null,
        flipResult: null,
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
        cropResult: null,
        rotateResult: null,
        flipResult: null,
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
        cropResult: null,
        rotateResult: null,
        flipResult: null,
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

  clearCropResult: () => {
    cropToken += 1;
    revokeUrl(get().resultPreviewUrl);
    set({
      resultPreviewUrl: null,
      resultBlob: null,
      resultFilename: null,
      cropResult: null,
      rotateResult: null,
      flipResult: null,
      isProcessing: false,
      isPreviewing: false,
      error: null,
    });
  },

  runCrop: async (options, opts) => {
    const { source } = get();
    if (!source) return;

    const silent = Boolean(opts?.silent);
    const token = ++cropToken;
    set(
      silent
        ? { isPreviewing: true, error: null }
        : { isProcessing: true, isPreviewing: false, error: null },
    );

    try {
      const result = await cropSource(source, options);
      if (token !== cropToken) return;
      revokeUrl(get().resultPreviewUrl);
      set({
        resultBlob: result.blob,
        resultFilename: result.filename,
        resultPreviewUrl: URL.createObjectURL(result.blob),
        resultRevision: get().resultRevision + 1,
        cropResult: result,
        compressResult: null,
        convertResult: null,
        resizeResult: null,
        rotateResult: null,
        flipResult: null,
        isProcessing: false,
        isPreviewing: false,
      });
    } catch {
      if (token !== cropToken) return;
      set({
        isProcessing: false,
        isPreviewing: false,
        error: "Crop failed. Try another aspect ratio or image.",
      });
    }
  },

  clearRotateResult: () => {
    rotateToken += 1;
    revokeUrl(get().resultPreviewUrl);
    set({
      resultPreviewUrl: null,
      resultBlob: null,
      resultFilename: null,
      rotateResult: null,
      isProcessing: false,
      isPreviewing: false,
      error: null,
    });
  },

  runRotate: async (options, opts) => {
    const { source } = get();
    if (!source) return;

    const silent = Boolean(opts?.silent);
    const token = ++rotateToken;
    set(
      silent
        ? { isPreviewing: true, error: null }
        : { isProcessing: true, isPreviewing: false, error: null },
    );

    try {
      const result = await rotateSource(source, options);
      if (token !== rotateToken) return;
      revokeUrl(get().resultPreviewUrl);
      set({
        resultBlob: result.blob,
        resultFilename: result.filename,
        resultPreviewUrl: URL.createObjectURL(result.blob),
        resultRevision: get().resultRevision + 1,
        rotateResult: result,
        compressResult: null,
        convertResult: null,
        resizeResult: null,
        cropResult: null,
        flipResult: null,
        isProcessing: false,
        isPreviewing: false,
      });
    } catch {
      if (token !== rotateToken) return;
      set({
        isProcessing: false,
        isPreviewing: false,
        error: "Rotate failed. Try another angle or image.",
      });
    }
  },

  clearFlipResult: () => {
    flipToken += 1;
    revokeUrl(get().resultPreviewUrl);
    set({
      resultPreviewUrl: null,
      resultBlob: null,
      resultFilename: null,
      flipResult: null,
      isProcessing: false,
      isPreviewing: false,
      error: null,
    });
  },

  runFlip: async (options, opts) => {
    const { source } = get();
    if (!source) return;

    const silent = Boolean(opts?.silent);
    const token = ++flipToken;
    set(
      silent
        ? { isPreviewing: true, error: null }
        : { isProcessing: true, isPreviewing: false, error: null },
    );

    try {
      const result = await flipSource(source, options);
      if (token !== flipToken) return;
      revokeUrl(get().resultPreviewUrl);
      set({
        resultBlob: result.blob,
        resultFilename: result.filename,
        resultPreviewUrl: URL.createObjectURL(result.blob),
        resultRevision: get().resultRevision + 1,
        flipResult: result,
        compressResult: null,
        convertResult: null,
        resizeResult: null,
        cropResult: null,
        rotateResult: null,
        isProcessing: false,
        isPreviewing: false,
      });
    } catch {
      if (token !== flipToken) return;
      set({
        isProcessing: false,
        isPreviewing: false,
        error: "Flip failed. Try again with another image.",
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
      cropResult,
      rotateResult,
      flipResult,
    } = get();

    if (resultBlob && resultFilename) {
      downloadBlob(resultBlob, resultFilename);

      if (tool && file) {
        const width =
          resizeResult?.width ??
          cropResult?.width ??
          rotateResult?.width ??
          flipResult?.width ??
          compressResult?.width ??
          convertResult?.width ??
          meta?.width ??
          0;
        const height =
          resizeResult?.height ??
          cropResult?.height ??
          rotateResult?.height ??
          flipResult?.height ??
          compressResult?.height ??
          convertResult?.height ??
          meta?.height ??
          0;
        const format =
          resizeResult?.format ??
          cropResult?.format ??
          rotateResult?.format ??
          flipResult?.format ??
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
