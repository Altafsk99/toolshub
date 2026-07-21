"use client";

import { create } from "zustand";
import { defaultFreeCropRect } from "@/lib/image/crop-display";
import type { CropRect } from "@/lib/image/crop";
import type { ImageMeta } from "@/types/image";

type CropUiState = {
  freeCropRect: CropRect | null;
  freeCropImageKey: string | null;
  freeModeActive: boolean;
  setFreeModeActive: (active: boolean) => void;
  setFreeCropRect: (rect: CropRect) => void;
  initFreeCropForImage: (meta: ImageMeta) => CropRect;
  reset: () => void;
};

function imageKey(meta: ImageMeta): string {
  return `${meta.width}x${meta.height}-${meta.name}-${meta.size}`;
}

export const useCropUiStore = create<CropUiState>((set, get) => ({
  freeCropRect: null,
  freeCropImageKey: null,
  freeModeActive: false,

  setFreeModeActive: (active) => set({ freeModeActive: active }),

  setFreeCropRect: (rect) => set({ freeCropRect: rect }),

  initFreeCropForImage: (meta) => {
    const key = imageKey(meta);
    const { freeCropImageKey, freeCropRect } = get();
    if (freeCropImageKey === key && freeCropRect) {
      return freeCropRect;
    }
    const rect = defaultFreeCropRect(meta.width, meta.height);
    set({ freeCropRect: rect, freeCropImageKey: key });
    return rect;
  },

  reset: () => set({ freeCropRect: null, freeCropImageKey: null, freeModeActive: false }),
}));
