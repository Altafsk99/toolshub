"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  clientPointToImage,
  getImageDisplayMetrics,
  imageRectToDisplayRect,
  moveCropRect,
  resizeCropRect,
  type CropHandle,
  type ImageDisplayMetrics,
} from "@/lib/image/crop-display";
import type { CropRect } from "@/lib/image/crop";
import { useCropUiStore } from "@/stores/cropUiStore";
import { useImageStore } from "@/stores/imageStore";

type DragState =
  | { kind: "move"; startX: number; startY: number; origin: CropRect }
  | { kind: "resize"; handle: CropHandle; origin: CropRect };

type CropOverlayProps = {
  imgRef: React.RefObject<HTMLImageElement | null>;
  enabled: boolean;
};

export function CropOverlay({ imgRef, enabled }: CropOverlayProps) {
  const meta = useImageStore((s) => s.meta);
  const freeCropRect = useCropUiStore((s) => s.freeCropRect);
  const setFreeCropRect = useCropUiStore((s) => s.setFreeCropRect);

  const [drag, setDrag] = useState<DragState | null>(null);
  const [displayRect, setDisplayRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const syncDisplayRect = useCallback(() => {
    const img = imgRef.current;
    if (!img || !freeCropRect || !meta) {
      setDisplayRect(null);
      return;
    }
    const metrics = getImageDisplayMetrics(img);
    setDisplayRect(imageRectToDisplayRect(freeCropRect, metrics));
  }, [freeCropRect, imgRef, meta]);

  useEffect(() => {
    syncDisplayRect();
    const img = imgRef.current;
    if (!img) return;

    const observer = new ResizeObserver(() => syncDisplayRect());
    observer.observe(img);
    window.addEventListener("resize", syncDisplayRect);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncDisplayRect);
    };
  }, [imgRef, syncDisplayRect]);

  useEffect(() => {
    if (!drag || !meta) return;
    const activeDrag = drag;
    const srcW = meta.width;
    const srcH = meta.height;

    function onPointerMove(event: PointerEvent) {
      const img = imgRef.current;
      if (!img) return;
      const metrics = getImageDisplayMetrics(img);
      const point = clientPointToImage(event.clientX, event.clientY, metrics);

      if (activeDrag.kind === "move") {
        const dx = point.x - activeDrag.startX;
        const dy = point.y - activeDrag.startY;
        setFreeCropRect(moveCropRect(activeDrag.origin, dx, dy, srcW, srcH));
        return;
      }

      setFreeCropRect(
        resizeCropRect(activeDrag.origin, activeDrag.handle, point.x, point.y, srcW, srcH),
      );
    }

    function onPointerUp() {
      setDrag(null);
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [drag, imgRef, meta, setFreeCropRect]);

  if (!enabled || !meta || !freeCropRect || !displayRect) {
    return null;
  }

  function startMove(event: React.PointerEvent) {
    event.preventDefault();
    event.stopPropagation();
    const img = imgRef.current;
    if (!img) return;
    const metrics = getImageDisplayMetrics(img);
    const point = clientPointToImage(event.clientX, event.clientY, metrics);
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    setDrag({ kind: "move", startX: point.x, startY: point.y, origin: freeCropRect! });
  }

  function startResize(handle: CropHandle, event: React.PointerEvent) {
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    setDrag({ kind: "resize", handle, origin: freeCropRect! });
  }

  const handles: { id: CropHandle; className: string }[] = [
    { id: "nw", className: "left-0 top-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize" },
    { id: "ne", className: "right-0 top-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize" },
    { id: "sw", className: "left-0 bottom-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize" },
    { id: "se", className: "right-0 bottom-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize" },
  ];

  return (
    <div
      className="pointer-events-none absolute inset-0"
      aria-hidden={!enabled}
    >
      <div
        className="pointer-events-auto absolute touch-none"
        style={{
          left: displayRect.x,
          top: displayRect.y,
          width: displayRect.width,
          height: displayRect.height,
          boxShadow: "0 0 0 9999px rgba(15, 23, 20, 0.48)",
          border: "2px solid rgba(255,255,255,0.95)",
        }}
        onPointerDown={startMove}
      >
        <div className="absolute inset-0 cursor-move" />
        {handles.map((handle) => (
          <button
            key={handle.id}
            type="button"
            aria-label={`Resize ${handle.id}`}
            className={`absolute h-3.5 w-3.5 rounded-full border-2 border-white bg-accent shadow-sm ${handle.className}`}
            onPointerDown={(event) => startResize(handle.id, event)}
          />
        ))}
      </div>
    </div>
  );
}
