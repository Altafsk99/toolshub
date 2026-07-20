"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ExportFormatId } from "@/lib/image/formats";

type PreferencesState = {
  exportFormatId: ExportFormatId;
  setExportFormatId: (id: ExportFormatId) => void;
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      exportFormatId: "jpg",
      setExportFormatId: (exportFormatId) => set({ exportFormatId }),
    }),
    { name: "toolshub-preferences" },
  ),
);
