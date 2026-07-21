export type ExportMime =
  | "image/png"
  | "image/jpeg"
  | "image/webp"
  | "image/avif";

/** @deprecated use ExportMime — kept for gradual migration */
export type ExportFormat = ExportMime;

export type ExportFormatId = "png" | "jpg" | "jpeg" | "webp" | "avif";

export type ImageMeta = {
  name: string;
  type: string;
  size: number;
  width: number;
  height: number;
  lastModified: number;
};

export type ExportOptions = {
  format?: ExportMime;
  /** Filename extension preference when mime is shared (jpg vs jpeg) */
  formatId?: ExportFormatId;
  quality?: number;
  filename?: string;
};

export type CompressMode = "quality" | "target";

/** Lossy + PNG/AVIF etc. — same as export mime set */
export type CompressFormat = ExportMime;

export type CompressOptions = {
  mode: CompressMode;
  /** 1–100 UI quality */
  qualityPercent: number;
  /** Target size in KB when mode is "target" */
  targetKb?: number;
  format: CompressFormat;
  formatId?: ExportFormatId;
};

export type ConvertResult = {
  blob: Blob;
  filename: string;
  originalBytes: number;
  outputBytes: number;
  width: number;
  height: number;
  format: ExportMime;
  formatId?: ExportFormatId;
  qualityUsed?: number;
};

export type CompressResult = {
  blob: Blob;
  filename: string;
  originalBytes: number;
  outputBytes: number;
  width: number;
  height: number;
  format: CompressFormat;
  formatId?: ExportFormatId;
  qualityUsed: number;
};

export type ResizeFitMode = "stretch" | "contain" | "cover";

/** Used when fit mode is "contain" for letterbox/pillarbox areas */
export type ResizeFillMode = "white" | "black" | "blur" | "transparent";

export type ResizeOptions = {
  width: number;
  height: number;
  /** stretch = distort, contain = fit inside + fill empty, cover = crop to fill */
  fit?: ResizeFitMode;
  /** Background for empty space when using contain */
  fill?: ResizeFillMode;
  /** Keep original format when possible */
  format?: ExportMime;
  formatId?: ExportFormatId;
  quality?: number;
  /** Also compress the resized output */
  compress?: boolean;
  compressMode?: CompressMode;
  /** 1–100 when compressMode is quality */
  qualityPercent?: number;
  /** Target KB when compressMode is target */
  targetKb?: number;
  /** Forced output when compressing */
  compressFormat?: CompressFormat;
  compressFormatId?: ExportFormatId;
};

export type ResizeResult = {
  blob: Blob;
  filename: string;
  originalWidth: number;
  originalHeight: number;
  width: number;
  height: number;
  outputBytes: number;
  format: ExportMime;
  formatId?: ExportFormatId;
  fit: ResizeFitMode;
  fill?: ResizeFillMode;
  compressed?: boolean;
  qualityUsed?: number;
};

export type CropAspectPreset =
  | "free"
  | "1:1"
  | "4:3"
  | "3:4"
  | "16:9"
  | "9:16"
  | "3:2"
  | "2:3";

export type CropShape = "rect" | "circle";

export type CropOptions = {
  aspect?: CropAspectPreset;
  shape?: CropShape;
  /** 0–1 horizontal focal point for the crop window */
  focusX?: number;
  /** 0–1 vertical focal point for the crop window */
  focusY?: number;
  /** Used when aspect is "free" */
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  format?: ExportMime;
  formatId?: ExportFormatId;
  quality?: number;
};

export type CropResult = {
  blob: Blob;
  filename: string;
  originalWidth: number;
  originalHeight: number;
  width: number;
  height: number;
  outputBytes: number;
  format: ExportMime;
  formatId?: ExportFormatId;
  aspect: CropAspectPreset;
  shape: CropShape;
  qualityUsed?: number;
};

export type EngineSource = {
  bitmap: ImageBitmap;
  meta: ImageMeta;
};
