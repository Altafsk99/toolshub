"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { DragDropUploader } from "@/components/image/DragDropUploader";
import { DownloadButton } from "@/components/image/DownloadButton";
import { ImagePreview } from "@/components/image/ImagePreview";
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
    // New tool route → drop any previous upload/result
    if (activePath.current !== pathname) {
      clear();
      activePath.current = pathname;
    }

    return () => {
      // Leaving the tool page → clear so the next tool starts empty
      clear();
      activePath.current = null;
    };
  }, [pathname, clear]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        {!file ? <DragDropUploader /> : null}
        <ImagePreview />
      </div>
      <div className="flex flex-col justify-between gap-6 rounded-[var(--radius-lg)] border border-line bg-paper/70 p-5">
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
            <div className="flex flex-wrap items-center gap-3">
              <DownloadButton label={downloadLabel} />
              {file ? (
                <button
                  type="button"
                  onClick={clear}
                  className="focus-ring h-11 rounded-md px-4 text-sm font-medium text-ink-soft transition hover:bg-mist"
                >
                  Start over
                </button>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
