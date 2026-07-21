export type PdfFileMeta = {
  id: string;
  name: string;
  size: number;
  pageCount: number;
  lastModified: number;
};

export type PdfImageMeta = {
  id: string;
  name: string;
  size: number;
  width: number;
  height: number;
  type: string;
  lastModified: number;
};

export type RotateAngle = 90 | 180 | 270;

export type RotateScope = "all" | "range";

export type SplitMode = "every-page" | "range" | "extract";

export type ImagePageSize = "fit" | "a4" | "letter";

export type PdfProcessResult = {
  blob: Blob;
  filename: string;
  pageCount?: number;
};
