"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";

type ImageMultiUploaderProps = {
  onFilesSelected: (files: File[]) => void;
  error?: string | null;
};

export function ImageMultiUploader({ onFilesSelected, error }: ImageMultiUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files?.length) return;
      onFilesSelected(Array.from(files));
    },
    [onFilesSelected],
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
          handleFiles(e.dataTransfer.files);
        }}
        className={`focus-ring group relative w-full overflow-hidden rounded-[var(--radius-lg)] border border-dashed px-6 py-14 text-left transition ${
          isDragging
            ? "border-accent bg-mist shadow-[var(--shadow-soft)]"
            : "border-line bg-paper/80 hover:border-accent/60 hover:bg-mist/60"
        }`}
      >
        <p className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          Drop images
        </p>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft/80">
          JPG, PNG, WebP, and more. Add multiple files — each image becomes one PDF page.
        </p>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent-deep">
          Choose files
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </motion.button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      {error ? (
        <p className="mt-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
