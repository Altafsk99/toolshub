"use client";

import { useEffect, useState } from "react";
import { renderPdfPageThumbnail } from "@/lib/pdf/preview";

const MAX_PAGES = 48;

export function usePdfPageThumbnails(
  file: File | null | undefined,
  pageCount: number,
  maxPages = MAX_PAGES,
) {
  const [thumbnails, setThumbnails] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!file || pageCount <= 0) {
      setThumbnails({});
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setThumbnails({});

    const total = Math.min(pageCount, maxPages);

    void (async () => {
      const next: Record<number, string> = {};
      for (let page = 1; page <= total; page += 1) {
        if (cancelled) return;
        try {
          next[page] = await renderPdfPageThumbnail(file, page);
          if (!cancelled) setThumbnails({ ...next });
        } catch {
          // Skip pages that fail to render (encrypted/corrupt).
        }
      }
      if (!cancelled) setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [file, pageCount, maxPages]);

  return { thumbnails, loading };
}

export type MergeThumbItem = {
  id: string;
  name: string;
  pageCount: number;
  file: File;
};

export function useMergeThumbnails(files: MergeThumbItem[]) {
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const filesKey = files.map((entry) => entry.id).join("|");

  useEffect(() => {
    if (files.length === 0) {
      setThumbnails({});
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setThumbnails({});

    void (async () => {
      const next: Record<string, string> = {};
      for (const entry of files) {
        if (cancelled) return;
        try {
          next[entry.id] = await renderPdfPageThumbnail(entry.file, 1, 0.35);
          if (!cancelled) setThumbnails({ ...next });
        } catch {
          // Skip failed thumbnails.
        }
      }
      if (!cancelled) setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [filesKey, files]);

  return { thumbnails, loading };
}
