"use client";

import { useCallback, useEffect, useState } from "react";
import type { ScanCornerId, ScanQuad } from "@/lib/image/scan";
import {
  clientPointToImage,
  getImageDisplayMetrics,
} from "@/lib/image/crop-display";

type DisplayPoint = { x: number; y: number };

type ScanCornerOverlayProps = {
  imgRef: React.RefObject<HTMLImageElement | null>;
  enabled: boolean;
  quad: ScanQuad | null;
  onCornerChange: (corner: ScanCornerId, x: number, y: number) => void;
  onDragEnd: () => void;
};

const CORNERS: ScanCornerId[] = ["tl", "tr", "br", "bl"];

export function ScanCornerOverlay({
  imgRef,
  enabled,
  quad,
  onCornerChange,
  onDragEnd,
}: ScanCornerOverlayProps) {
  const [dragCorner, setDragCorner] = useState<ScanCornerId | null>(null);
  const [display, setDisplay] = useState<Record<ScanCornerId, DisplayPoint> | null>(
    null,
  );

  const sync = useCallback(() => {
    const img = imgRef.current;
    if (!img || !quad || !enabled) {
      setDisplay(null);
      return;
    }
    const metrics = getImageDisplayMetrics(img);
    const scaleX = metrics.width / metrics.naturalWidth;
    const scaleY = metrics.height / metrics.naturalHeight;
    setDisplay({
      tl: { x: quad.tl.x * scaleX, y: quad.tl.y * scaleY },
      tr: { x: quad.tr.x * scaleX, y: quad.tr.y * scaleY },
      br: { x: quad.br.x * scaleX, y: quad.br.y * scaleY },
      bl: { x: quad.bl.x * scaleX, y: quad.bl.y * scaleY },
    });
  }, [enabled, imgRef, quad]);

  useEffect(() => {
    sync();
    const img = imgRef.current;
    if (!img) return;
    const observer = new ResizeObserver(() => sync());
    observer.observe(img);
    window.addEventListener("resize", sync);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, [imgRef, sync]);

  useEffect(() => {
    if (!dragCorner) return;
    const activeCorner = dragCorner;

    function onMove(event: PointerEvent) {
      const img = imgRef.current;
      if (!img) return;
      const metrics = getImageDisplayMetrics(img);
      const point = clientPointToImage(event.clientX, event.clientY, metrics);
      onCornerChange(activeCorner, point.x, point.y);
    }

    function onUp() {
      setDragCorner(null);
      onDragEnd();
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragCorner, imgRef, onCornerChange, onDragEnd]);

  if (!enabled || !quad || !display) return null;

  const poly = `${display.tl.x},${display.tl.y} ${display.tr.x},${display.tr.y} ${display.br.x},${display.br.y} ${display.bl.x},${display.bl.y}`;

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg className="absolute inset-0 h-full w-full overflow-visible">
        <polygon
          points={poly}
          fill="color-mix(in oklab, var(--accent) 18%, transparent)"
          stroke="var(--accent-deep)"
          strokeWidth="2"
        />
      </svg>
      {CORNERS.map((corner) => (
        <button
          key={corner}
          type="button"
          aria-label={`Move ${corner} corner`}
          className="pointer-events-auto absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 touch-none rounded-full border-2 border-accent-deep bg-paper shadow-sm"
          style={{ left: display[corner].x, top: display[corner].y }}
          onPointerDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setDragCorner(corner);
          }}
        />
      ))}
    </div>
  );
}
