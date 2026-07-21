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

type ImageToolWorkspaceProps = {
  downloadLabel?: string;
  toolbar?: ReactNode;
};

/**
 * Image workspace for a single tool page.
 * Clears the shared image store whenever the route changes so Compress / Resize
 * (and future tools) never keep another page's upload.
 */
export function ImageToolWorkspace({
  downloadLabel = "Download image",
  toolbar,
}: ImageToolWorkspaceProps) {
  const pathname = usePathname();
  const file = useImageStore((s) => s.file);
  const clear = useImageStore((s) => s.clear);
  const activePath = useRef<string | null>(null);

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
        {!file ? <DragDropUploader /> : null}
        <ImagePreview />
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
              {file ? (
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
