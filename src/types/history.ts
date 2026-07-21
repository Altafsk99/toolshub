export type HistoryToolId = "compress" | "resize" | "convert" | "crop";

export type HistoryEntryMeta = {
  id: string;
  tool: HistoryToolId;
  createdAt: number;
  originalName: string;
  outputName: string;
  originalBytes: number;
  outputBytes: number;
  width: number;
  height: number;
  format: string;
  /** Object URLs are runtime-only; blobs live in IDB */
};

export type HistoryEntryRecord = HistoryEntryMeta & {
  originalBlob: Blob;
  outputBlob: Blob;
};

export type HistoryListItem = HistoryEntryMeta;
