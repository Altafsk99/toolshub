"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { DragDropUploader } from "@/components/image/DragDropUploader";
import { DownloadButton } from "@/components/image/DownloadButton";
import { ImagePreview } from "@/components/image/ImagePreview";
import {
  PanelActions,
  panelPrimaryBtnClass,
  panelSecondaryBtnClass,
} from "@/components/image/PanelChrome";
import { useImageStore } from "@/stores/imageStore";

const ACCEPT =
  "image/jpeg,image/png,image/webp,image/avif,image/gif,image/bmp";

type ImageToolWorkspaceProps = {
  downloadLabel?: string;
  toolbar?: ReactNode;
  /** Multi-file pick (compress batch only). */
  allowMultiple?: boolean;
};

/**
 * Image workspace for a single tool page.
 * Clears the shared image store whenever the route changes so Compress / Resize
 * (and future tools) never keep another page's upload.
 */
export function ImageToolWorkspace({
  downloadLabel = "Download image",
  toolbar,
  allowMultiple = false,
}: ImageToolWorkspaceProps) {
  const pathname = usePathname();
  const addMoreRef = useRef<HTMLInputElement>(null);
  const file = useImageStore((s) => s.file);
  const batchFiles = useImageStore((s) => s.batchFiles);
  const addFiles = useImageStore((s) => s.addFiles);
  const clear = useImageStore((s) => s.clear);
  const activePath = useRef<string | null>(null);
  const hasSession = Boolean(file) || batchFiles.length > 0;
  const isBatch = batchFiles.length > 1;

  useEffect(() => {
    if (activePath.current !== pathname) {
      clear();
      activePath.current = pathname;
    }

    return () => {
      clear();
      activePath.current = null;
    };
  }, [pathname, clear]);

  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      <div className="space-y-4">
        {!hasSession ? <DragDropUploader multiple={allowMultiple} /> : null}
        {isBatch ? (
          <div className="rounded-[var(--radius-lg)] border border-line bg-paper/80 px-4 py-6 sm:px-5">
            <p className="font-display text-xl font-semibold text-ink sm:text-2xl">
              {batchFiles.length} images ready
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft/80">
              The same quality, target size, and format apply to every file. Compress
              all, then download one ZIP — still entirely in your browser.
            </p>
            {allowMultiple ? (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => addMoreRef.current?.click()}
                  className={panelSecondaryBtnClass}
                >
                  Add more
                </button>
                <input
                  ref={addMoreRef}
                  type="file"
                  accept={ACCEPT}
                  multiple
                  className="sr-only"
                  onChange={(e) => {
                    const list = e.target.files;
                    if (list?.length) void addFiles(Array.from(list));
                    e.target.value = "";
                  }}
                />
              </div>
            ) : null}
          </div>
        ) : (
          <ImagePreview />
        )}
      </div>
      <div className="flex flex-col justify-between gap-5 rounded-[var(--radius-lg)] border border-line bg-paper/70 p-4 sm:gap-6 sm:p-5">
        {toolbar ?? (
          <>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft/60">
                Toolbar
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft/80">
                Load an image, preview it, then export from the canvas engine.
              </p>
            </div>
            <PanelActions>
              <DownloadButton label={downloadLabel} className={panelPrimaryBtnClass} />
              {hasSession ? (
                <button type="button" onClick={clear} className={panelSecondaryBtnClass}>
                  Start over
                </button>
              ) : null}
            </PanelActions>
          </>
        )}
      </div>
    </div>
  );
}
