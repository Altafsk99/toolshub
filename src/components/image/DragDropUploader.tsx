"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useImageStore } from "@/stores/imageStore";

const ACCEPT =
  "image/jpeg,image/png,image/webp,image/avif,image/gif,image/bmp";

type DragDropUploaderProps = {
  onFileSelected?: (file: File) => void;
};

export function DragDropUploader({ onFileSelected }: DragDropUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const setFile = useImageStore((s) => s.setFile);
  const error = useImageStore((s) => s.error);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      const file = files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        return;
      }
      await setFile(file);
      onFileSelected?.(file);
    },
    [onFileSelected, setFile],
  );

  return (
    <div className="w-full">
      <motion.button
        type="button"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          void handleFiles(e.dataTransfer.files);
        }}
        className={`focus-ring group relative w-full overflow-hidden rounded-[var(--radius-lg)] border border-dashed px-6 py-14 text-left transition ${
          isDragging
            ? "border-accent bg-mist shadow-[var(--shadow-soft)]"
            : "border-line bg-paper/80 hover:border-accent/60 hover:bg-mist/60"
        }`}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-accent/10 blur-2xl transition group-hover:bg-accent/20"
        />
        <p className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          Drop an image
        </p>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft/80">
          Or click to browse. JPG, PNG, and WebP — processed entirely in your browser.
          Nothing is uploaded.
        </p>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent-deep">
          Choose file
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </span>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          onChange={(e) => void handleFiles(e.target.files)}
        />
      </motion.button>
      {error ? (
        <p className="mt-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
