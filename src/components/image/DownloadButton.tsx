"use client";

import { useImageStore } from "@/stores/imageStore";

type DownloadButtonProps = {
  label?: string;
  prepareFirst?: boolean;
  className?: string;
};

export function DownloadButton({
  label = "Download",
  prepareFirst = true,
  className,
}: DownloadButtonProps) {
  const file = useImageStore((s) => s.file);
  const resultBlob = useImageStore((s) => s.resultBlob);
  const isProcessing = useImageStore((s) => s.isProcessing);
  const runIdentityExport = useImageStore((s) => s.runIdentityExport);
  const downloadResult = useImageStore((s) => s.downloadResult);

  const disabled = !file || isProcessing;

  const handleClick = async () => {
    if (!file) return;
    if (prepareFirst && !resultBlob) {
      await runIdentityExport();
    }
    downloadResult();
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => void handleClick()}
      className={
        className ??
        "focus-ring inline-flex h-11 items-center justify-center rounded-md bg-ink px-5 text-sm font-semibold text-foam transition hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-40"
      }
    >
      {isProcessing ? "Preparing…" : label}
    </button>
  );
}
