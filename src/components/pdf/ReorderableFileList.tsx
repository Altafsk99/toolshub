"use client";

import { formatBytes } from "@/stores/pdfStore";

type ReorderableFileListProps = {
  items: {
    id: string;
    name: string;
    detail: string;
    thumbnailUrl?: string;
  }[];
  onRemove: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  emptyLabel?: string;
};

export function ReorderableFileList({
  items,
  onRemove,
  onMove,
  emptyLabel = "No files added yet.",
}: ReorderableFileListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-dashed border-line bg-paper/50 px-4 py-10 text-center text-sm text-ink-soft/70">
        {emptyLabel}
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li
          key={item.id}
          className="flex items-center gap-2 rounded-md border border-line bg-foam/60 px-3 py-2.5"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-mist text-xs font-semibold text-ink-soft">
            {index + 1}
          </span>
          {item.thumbnailUrl ? (
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-line bg-paper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.thumbnailUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}
          <div className="min-w-0 flex-1">
            <p className=" text-sm font-medium text-ink" title={item.name}>
              {item.name}
            </p>
            <p className="text-xs text-ink-soft/65">{item.detail}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              aria-label={`Move ${item.name} up`}
              disabled={index === 0}
              onClick={() => onMove(item.id, "up")}
              className="focus-ring rounded px-2 py-1 text-xs font-medium text-ink-soft transition hover:bg-mist disabled:opacity-30"
            >
              ↑
            </button>
            <button
              type="button"
              aria-label={`Move ${item.name} down`}
              disabled={index === items.length - 1}
              onClick={() => onMove(item.id, "down")}
              className="focus-ring rounded px-2 py-1 text-xs font-medium text-ink-soft transition hover:bg-mist disabled:opacity-30"
            >
              ↓
            </button>
            <button
              type="button"
              aria-label={`Remove ${item.name}`}
              onClick={() => onRemove(item.id)}
              className="focus-ring rounded px-2 py-1 text-xs font-medium text-red-700 transition hover:bg-red-50"
            >
              Remove
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function pdfDetail(size: number, pageCount?: number): string {
  if (pageCount != null) {
    return `${pageCount} page${pageCount === 1 ? "" : "s"} · ${formatBytes(size)}`;
  }
  return formatBytes(size);
}

export function imageDetail(width: number, height: number, size: number): string {
  return `${width}×${height} · ${formatBytes(size)}`;
}
