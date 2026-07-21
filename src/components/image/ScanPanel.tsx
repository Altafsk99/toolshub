"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ScanCornerOverlay } from "@/components/image/ScanCornerOverlay";
import {
  chipClass,
  modeTabClass,
  panelAccentBtnClass,
  panelPrimaryBtnClass,
  panelSecondaryBtnClass,
  panelSectionClass,
} from "@/components/image/PanelChrome";
import type { ScanFilter } from "@/lib/image/scan";
import { formatBytes } from "@/stores/imageStore";
import { useScanStore } from "@/stores/scanStore";

const FILTERS: { id: ScanFilter; label: string }[] = [
  { id: "enhance", label: "Enhance" },
  { id: "original", label: "Color" },
  { id: "grayscale", label: "Gray" },
  { id: "bw", label: "B&W" },
];

export function ScanPanel() {
  const sourceFile = useScanStore((s) => s.sourceFile);
  const sourcePreviewUrl = useScanStore((s) => s.sourcePreviewUrl);
  const livePreviewUrl = useScanStore((s) => s.livePreviewUrl);
  const quad = useScanStore((s) => s.quad);
  const filter = useScanStore((s) => s.filter);
  const pages = useScanStore((s) => s.pages);
  const isPreviewing = useScanStore((s) => s.isPreviewing);
  const isProcessing = useScanStore((s) => s.isProcessing);
  const error = useScanStore((s) => s.error);
  const setSourceFile = useScanStore((s) => s.setSourceFile);
  const setFilter = useScanStore((s) => s.setFilter);
  const updateCorner = useScanStore((s) => s.updateCorner);
  const refreshLivePreview = useScanStore((s) => s.refreshLivePreview);
  const applyScan = useScanStore((s) => s.applyScan);
  const removePage = useScanStore((s) => s.removePage);
  const downloadLastPage = useScanStore((s) => s.downloadLastPage);
  const downloadPdf = useScanStore((s) => s.downloadPdf);
  const clearSource = useScanStore((s) => s.clearSource);
  const clearAll = useScanStore((s) => s.clearAll);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraStarting, setCameraStarting] = useState(false);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOpen(false);
    setCameraStarting(false);
  }, []);

  const onCornerChange = useCallback(
    (corner: "tl" | "tr" | "br" | "bl", x: number, y: number) => {
      updateCorner(corner, x, y);
    },
    [updateCorner],
  );

  const onDragEnd = useCallback(() => {
    void refreshLivePreview();
  }, [refreshLivePreview]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      useScanStore.getState().clearSource();
    };
  }, []);

  const onFile = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setCameraError(null);
    stopCamera();
    void setSourceFile(file);
  };

  const startCamera = async () => {
    setCameraError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera is not supported in this browser. Upload a photo instead.");
      return;
    }

    setCameraStarting(true);
    setCameraOpen(true);
    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: true,
        });
      }

      streamRef.current = stream;
      setCameraStarting(false);
    } catch {
      stopCamera();
      setCameraError(
        "Could not access the camera. Allow permission in the browser, or upload a photo instead.",
      );
    }
  };

  useEffect(() => {
    if (!cameraOpen || cameraStarting) return;
    const stream = streamRef.current;
    const video = videoRef.current;
    if (!stream || !video) return;

    video.srcObject = stream;
    void video.play().catch(() => {
      setCameraError("Could not start the camera preview.");
    });
  }, [cameraOpen, cameraStarting]);

  const captureFrame = async () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) {
      setCameraError("Camera is still starting. Try again in a moment.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setCameraError("Could not capture from camera.");
      return;
    }
    ctx.drawImage(video, 0, 0);

    try {
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (result) => (result ? resolve(result) : reject(new Error("encode failed"))),
          "image/jpeg",
          0.92,
        );
      });
      const file = new File([blob], `scan-camera-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });
      setCameraError(null);
      stopCamera();
      void setSourceFile(file);
    } catch {
      setCameraError("Could not capture from camera.");
    }
  };

  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      <div className="space-y-4">
        {!sourceFile && cameraOpen ? (
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-line bg-paper">
            <div className="relative flex min-h-48 items-center justify-center bg-ink p-3 sm:min-h-64 sm:p-4">
              <video
                ref={videoRef}
                playsInline
                muted
                className="max-h-[280px] w-full object-contain sm:max-h-[420px]"
              />
              {cameraStarting ? (
                <p className="absolute inset-0 flex items-center justify-center bg-ink/70 text-sm font-medium text-paper">
                  Starting camera…
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-2 border-t border-line px-3 py-3 sm:px-4">
              <button
                type="button"
                disabled={cameraStarting}
                onClick={() => void captureFrame()}
                className={panelAccentBtnClass}
              >
                Capture
              </button>
              <button type="button" onClick={stopCamera} className={panelSecondaryBtnClass}>
                Cancel
              </button>
            </div>
          </div>
        ) : !sourceFile ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="focus-ring w-full rounded-[var(--radius-lg)] border border-dashed border-line bg-paper/80 px-4 py-10 text-left transition hover:border-accent/60 hover:bg-mist/60 sm:px-6 sm:py-14"
            >
              <p className="font-display text-xl font-semibold text-ink sm:text-3xl">
                Scan a document
              </p>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft/80">
                Upload a photo of a page, receipt, or ID — or use your camera. Everything stays
                in your browser.
              </p>
              <span className="mt-6 inline-flex text-sm font-semibold text-accent-deep">
                Choose photo →
              </span>
            </button>
            <button
              type="button"
              onClick={() => void startCamera()}
              className="focus-ring inline-flex min-h-11 w-full items-center justify-center rounded-md border border-line bg-paper px-4 text-sm font-semibold text-ink transition hover:bg-mist sm:w-auto"
            >
              Use camera
            </button>
            {cameraError ? (
              <p className="text-sm text-red-700" role="alert">
                {cameraError}
              </p>
            ) : null}
            {error ? (
              <p className="text-sm text-red-700" role="alert">
                {error}
              </p>
            ) : null}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => onFile(e.target.files)}
            />
          </div>
        ) : (
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-line bg-paper">
            <div className="relative flex max-h-[280px] min-h-48 items-center justify-center bg-[linear-gradient(45deg,#dfeae6_25%,transparent_25%),linear-gradient(-45deg,#dfeae6_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#dfeae6_75%),linear-gradient(-45deg,transparent_75%,#dfeae6_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0] p-3 sm:max-h-[420px] sm:min-h-64 sm:p-4">
              <div className="relative inline-block max-h-[240px] max-w-full sm:max-h-[380px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imgRef}
                  src={sourcePreviewUrl ?? undefined}
                  alt="Document to scan"
                  className="block max-h-[240px] max-w-full object-contain sm:max-h-[380px]"
                />
                <ScanCornerOverlay
                  imgRef={imgRef}
                  enabled
                  quad={quad}
                  onCornerChange={onCornerChange}
                  onDragEnd={onDragEnd}
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-line px-3 py-3 sm:px-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">{sourceFile.name}</p>
                <p className="mt-0.5 text-xs text-ink-soft/70">
                  Drag the four corners to frame the page
                </p>
              </div>
              <button
                type="button"
                onClick={clearSource}
                className="focus-ring shrink-0 rounded-md px-3 py-2 text-sm font-medium text-ink-soft transition hover:bg-mist"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        {livePreviewUrl ? (
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-line bg-paper">
            <p className="border-b border-line px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft/55">
              Scan preview{isPreviewing ? " · updating…" : ""}
            </p>
            <div className="flex max-h-[220px] items-center justify-center bg-mist/40 p-3 sm:max-h-[280px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={livePreviewUrl}
                alt="Scanned preview"
                className="max-h-[200px] max-w-full object-contain sm:max-h-[260px]"
              />
            </div>
          </div>
        ) : null}

        {pages.length > 0 ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft/55">
              Pages ({pages.length})
            </p>
            <ul className="mt-3 flex gap-3 overflow-x-auto pb-1">
              {pages.map((page, index) => (
                <li
                  key={page.id}
                  className="relative w-24 shrink-0 overflow-hidden rounded-md border border-line bg-paper"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={page.previewUrl}
                    alt={`Page ${index + 1}`}
                    className="h-28 w-full object-cover"
                  />
                  <div className="flex items-center justify-between gap-1 px-1.5 py-1">
                    <span className="text-[10px] font-medium text-ink-soft">
                      {index + 1} · {formatBytes(page.blob.size)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removePage(page.id)}
                      className="text-[10px] font-semibold text-ink-soft hover:text-ink"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="flex h-full flex-col justify-between gap-5 rounded-[var(--radius-lg)] border border-line bg-paper/70 p-4 sm:gap-6 sm:p-5">
        <div className={panelSectionClass}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft/60">
              Document scan
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft/80">
              Straighten the page with the corner handles, pick a filter, then add pages to build
              a PDF — all on-device.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Filter</p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              {FILTERS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  disabled={!sourceFile}
                  onClick={() => setFilter(option.id)}
                  className={
                    filter === option.id
                      ? modeTabClass(true)
                      : chipClass(false)
                  }
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {error && sourceFile ? (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          <button
            type="button"
            disabled={!sourceFile || isProcessing || isPreviewing}
            onClick={() => void applyScan()}
            className={panelAccentBtnClass}
          >
            {isProcessing ? "Scanning…" : "Add page"}
          </button>
          <button
            type="button"
            disabled={pages.length === 0}
            onClick={downloadLastPage}
            className={panelPrimaryBtnClass}
          >
            Download image
          </button>
          <button
            type="button"
            disabled={pages.length === 0 || isProcessing}
            onClick={() => void downloadPdf()}
            className={panelPrimaryBtnClass}
          >
            Download PDF
          </button>
          {sourceFile || pages.length > 0 ? (
            <button type="button" onClick={clearAll} className={panelSecondaryBtnClass}>
              Start over
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
