"use client";

import { create } from "zustand";
import {
  addHistoryEntry,
  clearHistory,
  deleteHistoryEntry,
  getHistoryEntry,
  listHistory,
} from "@/lib/history/idb";
import type { HistoryEntryRecord, HistoryListItem, HistoryToolId } from "@/types/history";

type HistoryState = {
  items: HistoryListItem[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  saveDownload: (input: {
    tool: HistoryToolId;
    originalFile: File;
    outputBlob: Blob;
    outputName: string;
    width: number;
    height: number;
    format: string;
  }) => Promise<void>;
  remove: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  getEntry: (id: string) => Promise<HistoryEntryRecord | null>;
};

export const useHistoryStore = create<HistoryState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  refresh: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await listHistory();
      set({ items, isLoading: false });
    } catch {
      set({
        isLoading: false,
        error: "Could not load history from this browser.",
      });
    }
  },

  saveDownload: async (input) => {
    try {
      await addHistoryEntry({
        tool: input.tool,
        originalName: input.originalFile.name,
        outputName: input.outputName,
        originalBytes: input.originalFile.size,
        outputBytes: input.outputBlob.size,
        width: input.width,
        height: input.height,
        format: input.format,
        originalBlob: input.originalFile,
        outputBlob: input.outputBlob,
      });
      await get().refresh();
    } catch {
      // Non-blocking — download should still succeed
      console.warn("Failed to save history entry");
    }
  },

  remove: async (id) => {
    await deleteHistoryEntry(id);
    set({ items: get().items.filter((item) => item.id !== id) });
  },

  clearAll: async () => {
    await clearHistory();
    set({ items: [] });
  },

  getEntry: async (id) => getHistoryEntry(id),
}));
