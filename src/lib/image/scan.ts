export type ScanPoint = { x: number; y: number };

/** Corners in source image pixel space (clockwise from top-left). */
export type ScanQuad = {
  tl: ScanPoint;
  tr: ScanPoint;
  br: ScanPoint;
  bl: ScanPoint;
};

export type ScanFilter = "original" | "enhance" | "grayscale" | "bw";

export type ScanCornerId = keyof ScanQuad;

function dist(a: ScanPoint, b: ScanPoint): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

export function defaultScanQuad(width: number, height: number): ScanQuad {
  const inset = Math.min(width, height) * 0.08;
  return {
    tl: { x: inset, y: inset },
    tr: { x: width - inset, y: inset },
    br: { x: width - inset, y: height - inset },
    bl: { x: inset, y: height - inset },
  };
}

export function clampScanPoint(
  point: ScanPoint,
  width: number,
  height: number,
): ScanPoint {
  return {
    x: Math.min(width - 1, Math.max(0, point.x)),
    y: Math.min(height - 1, Math.max(0, point.y)),
  };
}

function sampleBilinear(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  x: number,
  y: number,
): [number, number, number, number] {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = Math.min(width - 1, x0 + 1);
  const y1 = Math.min(height - 1, y0 + 1);
  const fx = x - x0;
  const fy = y - y0;

  const i00 = (y0 * width + x0) * 4;
  const i10 = (y0 * width + x1) * 4;
  const i01 = (y1 * width + x0) * 4;
  const i11 = (y1 * width + x1) * 4;

  const r =
    data[i00]! * (1 - fx) * (1 - fy) +
    data[i10]! * fx * (1 - fy) +
    data[i01]! * (1 - fx) * fy +
    data[i11]! * fx * fy;
  const g =
    data[i00 + 1]! * (1 - fx) * (1 - fy) +
    data[i10 + 1]! * fx * (1 - fy) +
    data[i01 + 1]! * (1 - fx) * fy +
    data[i11 + 1]! * fx * fy;
  const b =
    data[i00 + 2]! * (1 - fx) * (1 - fy) +
    data[i10 + 2]! * fx * (1 - fy) +
    data[i01 + 2]! * (1 - fx) * fy +
    data[i11 + 2]! * fx * fy;
  const a =
    data[i00 + 3]! * (1 - fx) * (1 - fy) +
    data[i10 + 3]! * fx * (1 - fy) +
    data[i01 + 3]! * (1 - fx) * fy +
    data[i11 + 3]! * fx * fy;

  return [r, g, b, a];
}

/** Map unit square (u,v) onto the document quad. */
function quadPoint(quad: ScanQuad, u: number, v: number): ScanPoint {
  const topX = quad.tl.x + (quad.tr.x - quad.tl.x) * u;
  const topY = quad.tl.y + (quad.tr.y - quad.tl.y) * u;
  const botX = quad.bl.x + (quad.br.x - quad.bl.x) * u;
  const botY = quad.bl.y + (quad.br.y - quad.bl.y) * u;
  return {
    x: topX + (botX - topX) * v,
    y: topY + (botY - topY) * v,
  };
}

function applyFilterPixel(
  r: number,
  g: number,
  b: number,
  filter: ScanFilter,
): [number, number, number] {
  if (filter === "original") return [r, g, b];

  if (filter === "enhance") {
    const contrast = 1.35;
    const brightness = 12;
    const nr = Math.min(255, Math.max(0, (r - 128) * contrast + 128 + brightness));
    const ng = Math.min(255, Math.max(0, (g - 128) * contrast + 128 + brightness));
    const nb = Math.min(255, Math.max(0, (b - 128) * contrast + 128 + brightness));
    return [nr, ng, nb];
  }

  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  if (filter === "grayscale") return [lum, lum, lum];

  // B&W document threshold
  const t = lum > 150 ? 255 : lum > 110 ? (lum - 110) * (255 / 40) : 0;
  return [t, t, t];
}

export function warpAndFilter(
  sourceCanvas: HTMLCanvasElement,
  quad: ScanQuad,
  filter: ScanFilter,
  maxEdge = 1600,
): HTMLCanvasElement {
  const srcW = sourceCanvas.width;
  const srcH = sourceCanvas.height;
  const srcCtx = sourceCanvas.getContext("2d", { willReadFrequently: true });
  if (!srcCtx) throw new Error("Canvas unavailable");

  const srcImage = srcCtx.getImageData(0, 0, srcW, srcH);
  const srcData = srcImage.data;

  let outW = Math.round(Math.max(dist(quad.tl, quad.tr), dist(quad.bl, quad.br)));
  let outH = Math.round(Math.max(dist(quad.tl, quad.bl), dist(quad.tr, quad.br)));
  outW = Math.max(32, outW);
  outH = Math.max(32, outH);

  const scale = Math.min(1, maxEdge / Math.max(outW, outH));
  outW = Math.max(32, Math.round(outW * scale));
  outH = Math.max(32, Math.round(outH * scale));

  const out = document.createElement("canvas");
  out.width = outW;
  out.height = outH;
  const outCtx = out.getContext("2d");
  if (!outCtx) throw new Error("Canvas unavailable");

  const outImage = outCtx.createImageData(outW, outH);
  const outData = outImage.data;

  for (let y = 0; y < outH; y += 1) {
    const v = outH === 1 ? 0 : y / (outH - 1);
    for (let x = 0; x < outW; x += 1) {
      const u = outW === 1 ? 0 : x / (outW - 1);
      const src = quadPoint(quad, u, v);
      const [r0, g0, b0, a0] = sampleBilinear(srcData, srcW, srcH, src.x, src.y);
      const [r, g, b] = applyFilterPixel(r0, g0, b0, filter);
      const i = (y * outW + x) * 4;
      outData[i] = r;
      outData[i + 1] = g;
      outData[i + 2] = b;
      outData[i + 3] = a0;
    }
  }

  outCtx.putImageData(outImage, 0, 0);
  return out;
}

export async function loadImageToCanvas(file: File): Promise<HTMLCanvasElement> {
  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");
    ctx.drawImage(bitmap, 0, 0);
    return canvas;
  } finally {
    bitmap.close();
  }
}

export async function canvasToJpegBlob(
  canvas: HTMLCanvasElement,
  quality = 0.92,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Failed to encode scan"))),
      "image/jpeg",
      quality,
    );
  });
}

export async function scanDocument(
  file: File,
  quad: ScanQuad,
  filter: ScanFilter,
): Promise<{ blob: Blob; width: number; height: number; previewUrl: string }> {
  const source = await loadImageToCanvas(file);
  const warped = warpAndFilter(source, quad, filter);
  const blob = await canvasToJpegBlob(warped);
  return {
    blob,
    width: warped.width,
    height: warped.height,
    previewUrl: URL.createObjectURL(blob),
  };
}
