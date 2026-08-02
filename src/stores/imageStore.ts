"use client";

import { compressSource, formatBytes } from "@/lib/image/compress";
import { cropSource } from "@/lib/image/crop";
import {
    adjustSource,
    filterSource,
    stripMetadataSource,
    watermarkSource,
} from "@/lib/image/edit";
import {
    downloadBlob,
    exportSource,
    loadImageFromFile,
    revokeSource,
} from "@/lib/image/engine";
import { resizeSource } from "@/lib/image/resize";
import { flipSource, rotateSource } from "@/lib/image/transform";
import { zipNamedBlobs } from "@/lib/image/zip";
import { useHistoryStore } from "@/stores/historyStore";
import type { HistoryToolId } from "@/types/history";
import type {
    AdjustOptions,
    CompressOptions,
    CompressResult,
    ConvertResult,
    CropOptions,
    CropResult,
    EditResult,
    EngineSource,
    ExportOptions,
    FilterOptions,
    FlipOptions,
    FlipResult,
    ImageMeta,
    MetadataOptions,
    ResizeOptions,
    ResizeResult,
    RotateOptions,
    RotateResult,
    WatermarkOptions,
} from "@/types/image";
import { create } from "zustand";

export type ProcessOpts = {
  /** Live preview: skips heavy UI busy state and ignores stale results */
  silent?: boolean;
};

export type BatchCompressItem = {
  name: string;
  originalBytes: number;
  outputBytes: number;
  blob: Blob;
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
  editResult: EditResult | null;
  /** Multi-file compress queue (empty in single-file mode) */
  batchFiles: File[];
  batchResults: BatchCompressItem[];
  batchProgress: { done: number; total: number } | null;
  isProcessing: boolean;
  isPreviewing: boolean;
  error: string | null;
  setFile: (file: File | null) => Promise<void>;
  setFiles: (files: File[]) => Promise<void>;
  /** Append images to the current batch (or promote a single file into a batch). */
  addFiles: (files: File[]) => Promise<void>;
  clear: () => void;
  runIdentityExport: (options?: ExportOptions, opts?: ProcessOpts) => Promise<void>;
  runCompress: (options: CompressOptions, opts?: ProcessOpts) => Promise<void>;
  runCompressBatch: (options: CompressOptions) => Promise<void>;
  downloadBatchZip: () => Promise<void>;
  runResize: (options: ResizeOptions, opts?: ProcessOpts) => Promise<void>;
  runCrop: (options: CropOptions, opts?: ProcessOpts) => Promise<void>;
  clearCropResult: () => void;
  runRotate: (options: RotateOptions, opts?: ProcessOpts) => Promise<void>;
  clearRotateResult: () => void;
  runFlip: (options: FlipOptions, opts?: ProcessOpts) => Promise<void>;
  clearFlipResult: () => void;
  runAdjust: (options: AdjustOptions, opts?: ProcessOpts) => Promise<void>;
  runFilter: (options: FilterOptions, opts?: ProcessOpts) => Promise<void>;
  runWatermark: (options: WatermarkOptions, opts?: ProcessOpts) => Promise<void>;
  runStripMetadata: (options?: MetadataOptions, opts?: ProcessOpts) => Promise<void>;
  downloadResult: (tool?: HistoryToolId) => void;
};

function revokeUrl(url: string | null) {
  if (url) URL.revokeObjectURL(url);
}

/** Separate tokens so compress/resize live previews don't cancel each other. */
let resizeToken = 0;
let compressToken = 0;
let batchCompressToken = 0;
let exportToken = 0;
let cropToken = 0;
let rotateToken = 0;
let flipToken = 0;
let editToken = 0;

const emptyBatch = {
  batchFiles: [] as File[],
  batchResults: [] as BatchCompressItem[],
  batchProgress: null as { done: number; total: number } | null,
};

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
  editResult: null,
  ...emptyBatch,
  isProcessing: false,
  isPreviewing: false,
  error: null,

  setFile: async (file) => {
    resizeToken += 1;
    compressToken += 1;
    batchCompressToken += 1;
    exportToken += 1;
    cropToken += 1;
    rotateToken += 1;
    flipToken += 1;
    editToken += 1;
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
        editResult: null,
        ...emptyBatch,
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
        editResult: null,
        ...emptyBatch,
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
        editResult: null,
        ...emptyBatch,
        isProcessing: false,
        isPreviewing: false,
        error: "Could not read that image. Try JPG, PNG, or WebP.",
      });
    }
  },

  setFiles: async (files) => {
    const images = files.filter((file) => file.type.startsWith("image/"));
    if (images.length === 0) {
      set({ error: "Please choose image files (JPG, PNG, WebP, …)." });
      return;
    }

    if (images.length === 1) {
      await get().setFile(images[0]!);
      return;
    }

    resizeToken += 1;
    compressToken += 1;
    batchCompressToken += 1;
    exportToken += 1;
    cropToken += 1;
    rotateToken += 1;
    flipToken += 1;
    editToken += 1;
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
      convertResult: null,
      resizeResult: null,
      cropResult: null,
      rotateResult: null,
      flipResult: null,
        editResult: null,
      batchFiles: images,
      batchResults: [],
      batchProgress: null,
      isProcessing: false,
      isPreviewing: false,
      error: null,
    });
  },

  addFiles: async (files) => {
    const images = files.filter((file) => file.type.startsWith("image/"));
    if (images.length === 0) {
      set({ error: "Please choose image files (JPG, PNG, WebP, …)." });
      return;
    }

    const prev = get();
    const existing =
      prev.batchFiles.length > 0
        ? prev.batchFiles
        : prev.file
          ? [prev.file]
          : [];

    if (existing.length === 0) {
      await get().setFiles(images);
      return;
    }

    const merged = [...existing, ...images];
    if (merged.length === 1) {
      await get().setFile(merged[0]!);
      return;
    }

    batchCompressToken += 1;
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
      convertResult: null,
      resizeResult: null,
      cropResult: null,
      rotateResult: null,
      flipResult: null,
        editResult: null,
      batchFiles: merged,
      batchResults: [],
      batchProgress: null,
      isProcessing: false,
      isPreviewing: false,
      error: null,
    });
  },

  clear: () => {
    resizeToken += 1;
    compressToken += 1;
    batchCompressToken += 1;
    exportToken += 1;
    cropToken += 1;
    rotateToken += 1;
    flipToken += 1;
    editToken += 1;
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
        editResult: null,
      convertResult: null,
      ...emptyBatch,
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
        editResult: null,
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
        editResult: null,
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

  runCompressBatch: async (options) => {
    const { batchFiles } = get();
    if (batchFiles.length < 2) return;

    const token = ++batchCompressToken;
    const total = batchFiles.length;
    set({
      isProcessing: true,
      isPreviewing: false,
      error: null,
      batchResults: [],
      batchProgress: { done: 0, total },
    });

    const results: BatchCompressItem[] = [];

    try {
      for (let i = 0; i < batchFiles.length; i += 1) {
        if (token !== batchCompressToken) return;

        const file = batchFiles[i]!;
        let source: EngineSource | null = null;
        try {
          source = await loadImageFromFile(file);
          const compressed = await compressSource(source, options);
          results.push({
            name: compressed.filename,
            originalBytes: file.size,
            outputBytes: compressed.blob.size,
            blob: compressed.blob,
          });
        } catch {
          results.push({
            name: file.name,
            originalBytes: file.size,
            outputBytes: file.size,
            blob: file,
          });
        } finally {
          if (source) revokeSource(source);
        }

        if (token !== batchCompressToken) return;
        set({
          batchResults: [...results],
          batchProgress: { done: i + 1, total },
        });
      }

      if (token !== batchCompressToken) return;
      set({
        batchResults: results,
        batchProgress: { done: total, total },
        isProcessing: false,
        isPreviewing: false,
      });
    } catch {
      if (token !== batchCompressToken) return;
      set({
        isProcessing: false,
        isPreviewing: false,
        error: "Batch compression failed. Try fewer images or a different format.",
      });
    }
  },

  downloadBatchZip: async () => {
    const { batchResults, batchFiles } = get();
    if (batchResults.length === 0) return;

    try {
      const zipBlob = await zipNamedBlobs(
        batchResults.map((item) => ({ name: item.name, blob: item.blob })),
      );
      downloadBlob(zipBlob, "compressed-images.zip");

      const first = batchFiles[0];
      if (first) {
        void useHistoryStore.getState().saveDownload({
          tool: "compress",
          originalFile: first,
          outputBlob: zipBlob,
          outputName: "compressed-images.zip",
          width: 0,
          height: 0,
          format: "application/zip",
        });
      }
    } catch {
      set({ error: "Could not create ZIP. Try again." });
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
        editResult: null,
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
        editResult: null,
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
        editResult: null,
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
        editResult: null,
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
      editResult: null,
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
        editResult: null,
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

  runAdjust: async (options, opts) => {
    const { source } = get();
    if (!source) return;

    const silent = Boolean(opts?.silent);
    const token = ++editToken;
    set(
      silent
        ? { isPreviewing: true, error: null }
        : { isProcessing: true, isPreviewing: false, error: null },
    );

    try {
      const result = await adjustSource(source, options);
      if (token !== editToken) return;
      revokeUrl(get().resultPreviewUrl);
      set({
        resultBlob: result.blob,
        resultFilename: result.filename,
        resultPreviewUrl: URL.createObjectURL(result.blob),
        resultRevision: get().resultRevision + 1,
        editResult: result,
        compressResult: null,
        convertResult: null,
        resizeResult: null,
        cropResult: null,
        rotateResult: null,
        flipResult: null,
        isProcessing: false,
        isPreviewing: false,
      });
    } catch {
      if (token !== editToken) return;
      set({
        isProcessing: false,
        isPreviewing: false,
        error: "Adjust failed. Try different slider values.",
      });
    }
  },

  runFilter: async (options, opts) => {
    const { source } = get();
    if (!source) return;

    const silent = Boolean(opts?.silent);
    const token = ++editToken;
    set(
      silent
        ? { isPreviewing: true, error: null }
        : { isProcessing: true, isPreviewing: false, error: null },
    );

    try {
      const result = await filterSource(source, options);
      if (token !== editToken) return;
      revokeUrl(get().resultPreviewUrl);
      set({
        resultBlob: result.blob,
        resultFilename: result.filename,
        resultPreviewUrl: URL.createObjectURL(result.blob),
        resultRevision: get().resultRevision + 1,
        editResult: result,
        compressResult: null,
        convertResult: null,
        resizeResult: null,
        cropResult: null,
        rotateResult: null,
        flipResult: null,
        isProcessing: false,
        isPreviewing: false,
      });
    } catch {
      if (token !== editToken) return;
      set({
        isProcessing: false,
        isPreviewing: false,
        error: "Filter failed. Try a smaller blur or sharpen amount.",
      });
    }
  },

  runWatermark: async (options, opts) => {
    const { source } = get();
    if (!source) return;

    const silent = Boolean(opts?.silent);
    const token = ++editToken;
    set(
      silent
        ? { isPreviewing: true, error: null }
        : { isProcessing: true, isPreviewing: false, error: null },
    );

    try {
      const result = await watermarkSource(source, options);
      if (token !== editToken) return;
      revokeUrl(get().resultPreviewUrl);
      set({
        resultBlob: result.blob,
        resultFilename: result.filename,
        resultPreviewUrl: URL.createObjectURL(result.blob),
        resultRevision: get().resultRevision + 1,
        editResult: result,
        compressResult: null,
        convertResult: null,
        resizeResult: null,
        cropResult: null,
        rotateResult: null,
        flipResult: null,
        isProcessing: false,
        isPreviewing: false,
      });
    } catch {
      if (token !== editToken) return;
      set({
        isProcessing: false,
        isPreviewing: false,
        error: "Watermark failed. Try shorter text or another image.",
      });
    }
  },

  runStripMetadata: async (options, opts) => {
    const { source } = get();
    if (!source) return;

    const silent = Boolean(opts?.silent);
    const token = ++editToken;
    set(
      silent
        ? { isPreviewing: true, error: null }
        : { isProcessing: true, isPreviewing: false, error: null },
    );

    try {
      const result = await stripMetadataSource(source, options ?? {});
      if (token !== editToken) return;
      revokeUrl(get().resultPreviewUrl);
      set({
        resultBlob: result.blob,
        resultFilename: result.filename,
        resultPreviewUrl: URL.createObjectURL(result.blob),
        resultRevision: get().resultRevision + 1,
        editResult: result,
        compressResult: null,
        convertResult: null,
        resizeResult: null,
        cropResult: null,
        rotateResult: null,
        flipResult: null,
        isProcessing: false,
        isPreviewing: false,
      });
    } catch {
      if (token !== editToken) return;
      set({
        isProcessing: false,
        isPreviewing: false,
        error: "Metadata removal failed. Try another format or image.",
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
      editResult,
    } = get();

    if (resultBlob && resultFilename) {
      downloadBlob(resultBlob, resultFilename);

      if (tool && file) {
        const width =
          resizeResult?.width ??
          cropResult?.width ??
          rotateResult?.width ??
          flipResult?.width ??
          editResult?.width ??
          compressResult?.width ??
          convertResult?.width ??
          meta?.width ??
          0;
        const height =
          resizeResult?.height ??
          cropResult?.height ??
          rotateResult?.height ??
          flipResult?.height ??
          editResult?.height ??
          compressResult?.height ??
          convertResult?.height ??
          meta?.height ??
          0;
        const format =
          resizeResult?.format ??
          cropResult?.format ??
          rotateResult?.format ??
          flipResult?.format ??
          editResult?.format ??
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
