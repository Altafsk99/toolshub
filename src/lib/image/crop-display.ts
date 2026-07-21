import type { CropRect } from "@/lib/image/crop";

export type ImageDisplayMetrics = {
  left: number;
  top: number;
  width: number;
  height: number;
  naturalWidth: number;
  naturalHeight: number;
};

export function defaultFreeCropRect(srcW: number, srcH: number): CropRect {
  const margin = 0.1;
  return {
    x: Math.round(srcW * margin),
    y: Math.round(srcH * margin),
    width: Math.max(32, Math.round(srcW * (1 - 2 * margin))),
    height: Math.max(32, Math.round(srcH * (1 - 2 * margin))),
  };
}

export function getImageDisplayMetrics(img: HTMLImageElement): ImageDisplayMetrics {
  const rect = img.getBoundingClientRect();
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight,
  };
}

export function imageRectToDisplayRect(
  crop: CropRect,
  metrics: ImageDisplayMetrics,
): { x: number; y: number; width: number; height: number } {
  const scaleX = metrics.width / metrics.naturalWidth;
  const scaleY = metrics.height / metrics.naturalHeight;
  return {
    x: crop.x * scaleX,
    y: crop.y * scaleY,
    width: crop.width * scaleX,
    height: crop.height * scaleY,
  };
}

export function clientPointToImage(
  clientX: number,
  clientY: number,
  metrics: ImageDisplayMetrics,
): { x: number; y: number } {
  const relX = (clientX - metrics.left) / metrics.width;
  const relY = (clientY - metrics.top) / metrics.height;
  return {
    x: relX * metrics.naturalWidth,
    y: relY * metrics.naturalHeight,
  };
}

export type CropHandle = "nw" | "ne" | "sw" | "se";

const MIN_CROP_SIZE = 32;

export function clampCropRect(rect: CropRect, srcW: number, srcH: number): CropRect {
  const width = Math.max(MIN_CROP_SIZE, Math.min(Math.round(rect.width), srcW));
  const height = Math.max(MIN_CROP_SIZE, Math.min(Math.round(rect.height), srcH));
  const x = Math.max(0, Math.min(Math.round(rect.x), srcW - width));
  const y = Math.max(0, Math.min(Math.round(rect.y), srcH - height));
  return { x, y, width, height };
}

export function moveCropRect(
  rect: CropRect,
  dx: number,
  dy: number,
  srcW: number,
  srcH: number,
): CropRect {
  return clampCropRect(
    {
      x: rect.x + dx,
      y: rect.y + dy,
      width: rect.width,
      height: rect.height,
    },
    srcW,
    srcH,
  );
}

export function resizeCropRect(
  rect: CropRect,
  handle: CropHandle,
  pointX: number,
  pointY: number,
  srcW: number,
  srcH: number,
): CropRect {
  let { x, y, width, height } = rect;

  if (handle === "se") {
    width = pointX - x;
    height = pointY - y;
  } else if (handle === "sw") {
    const right = x + width;
    x = pointX;
    width = right - x;
    height = pointY - y;
  } else if (handle === "ne") {
    const bottom = y + height;
    width = pointX - x;
    y = pointY;
    height = bottom - y;
  } else if (handle === "nw") {
    const right = x + width;
    const bottom = y + height;
    x = pointX;
    y = pointY;
    width = right - x;
    height = bottom - y;
  }

  return clampCropRect({ x, y, width, height }, srcW, srcH);
}
