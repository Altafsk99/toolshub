"use client";

import { useEffect, useMemo, useState } from "react";
import { downloadBlob } from "@/lib/image/engine";
import { formatBytes } from "@/stores/imageStore";
import { useHistoryStore } from "@/stores/historyStore";
import type { HistoryEntryRecord, HistoryToolId } from "@/types/history";

type HistoryFilter = "all" | HistoryToolId;

function toolLabel(tool: HistoryToolId): string {
  if (tool === "compress") return "Compress";
  if (tool === "convert") return "Convert";
  if (tool === "crop") return "Crop";
  if (tool === "rotate") return "Rotate";
  if (tool === "flip") return "Flip";
  if (tool === "scan") return "Scan";
  if (tool === "adjust") return "Adjust";
  if (tool === "blur") return "Blur / Sharpen";
  if (tool === "watermark") return "Watermark";
  if (tool === "metadata") return "Metadata";
  return "Resize";
}

function formatWhen(ts: number): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(ts));
  } catch {
    return new Date(ts).toLocaleString();
  }
}

export function HistoryClient() {
  const items = useHistoryStore((s) => s.items);
  const isLoading = useHistoryStore((s) => s.isLoading);
  const error = useHistoryStore((s) => s.error);
  const refresh = useHistoryStore((s) => s.refresh);
  const remove = useHistoryStore((s) => s.remove);
  const clearAll = useHistoryStore((s) => s.clearAll);
  const getEntry = useHistoryStore((s) => s.getEntry);

  const [filter, setFilter] = useState<HistoryFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selected, setSelected] = useState<HistoryEntryRecord | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [view, setView] = useState<"output" | "original">("output");

  const filteredItems = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((item) => item.tool === filter);
  }, [items, filter]);

  const compressCount = useMemo(
    () => items.filter((item) => item.tool === "compress").length,
    [items],
  );
  const resizeCount = useMemo(
    () => items.filter((item) => item.tool === "resize").length,
    [items],
  );
  const convertCount = useMemo(
    () => items.filter((item) => item.tool === "convert").length,
    [items],
  );
  const cropCount = useMemo(
    () => items.filter((item) => item.tool === "crop").length,
    [items],
  );
  const rotateCount = useMemo(
    () => items.filter((item) => item.tool === "rotate").length,
    [items],
  );
  const flipCount = useMemo(
    () => items.filter((item) => item.tool === "flip").length,
    [items],
  );
  const scanCount = useMemo(
    () => items.filter((item) => item.tool === "scan").length,
    [items],
  );
  const adjustCount = useMemo(
    () => items.filter((item) => item.tool === "adjust").length,
    [items],
  );
  const blurCount = useMemo(
    () => items.filter((item) => item.tool === "blur").length,
    [items],
  );
  const watermarkCount = useMemo(
    () => items.filter((item) => item.tool === "watermark").length,
    [items],
  );
  const metadataCount = useMemo(
    () => items.filter((item) => item.tool === "metadata").length,
    [items],
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!selectedId) return;
    const stillVisible = filteredItems.some((item) => item.id === selectedId);
    if (!stillVisible) {
      setSelectedId(null);
    }
  }, [filteredItems, selectedId]);

  useEffect(() => {
    let revoked: string[] = [];
    let cancelled = false;

    async function load() {
      if (!selectedId) {
        setSelected(null);
        setPreviewUrl(null);
        setOriginalUrl(null);
        return;
      }
      const entry = await getEntry(selectedId);
      if (cancelled) return;
      if (!entry) {
        setSelected(null);
        setPreviewUrl(null);
        setOriginalUrl(null);
        return;
      }
      const out = URL.createObjectURL(entry.outputBlob);
      const orig = URL.createObjectURL(entry.originalBlob);
      revoked = [out, orig];
      setSelected(entry);
      setPreviewUrl(out);
      setOriginalUrl(orig);
      setView("output");
    }

    void load();
    return () => {
      cancelled = true;
      revoked.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedId, getEntry]);

  const displayUrl = view === "output" ? previewUrl : originalUrl;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-deep">
          Image Tools
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold text-ink sm:text-5xl">
          History
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink-soft/80">
          Downloads are saved on this device only (browser storage). Nothing is
          uploaded to our servers. Up to 30 recent items.
        </p>
      </header>

      <div className="mt-8 flex flex-wrap items-end gap-3">
        <div className="min-w-[220px]">
          <label
            htmlFor="history-filter"
            className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft/60"
          >
            Show history
          </label>
          <select
            id="history-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value as HistoryFilter)}
            className="focus-ring mt-2 w-full rounded-md border border-line bg-paper px-3 py-2.5 text-sm font-medium text-ink"
          >
            <option value="all">All tools ({items.length})</option>
            <option value="compress">Compress ({compressCount})</option>
            <option value="resize">Resize ({resizeCount})</option>
            <option value="convert">Convert ({convertCount})</option>
            <option value="crop">Crop ({cropCount})</option>
            <option value="rotate">Rotate ({rotateCount})</option>
            <option value="flip">Flip ({flipCount})</option>
            <option value="scan">Scan ({scanCount})</option>
            <option value="adjust">Adjust ({adjustCount})</option>
            <option value="blur">Blur / Sharpen ({blurCount})</option>
            <option value="watermark">Watermark ({watermarkCount})</option>
            <option value="metadata">Metadata ({metadataCount})</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => void refresh()}
          className="focus-ring h-10 rounded-md bg-mist px-4 text-sm font-semibold text-ink transition hover:bg-mist/80"
        >
          Refresh
        </button>
        {items.length > 0 ? (
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Clear all history on this device?")) {
                void clearAll();
                setSelectedId(null);
              }
            }}
            className="focus-ring h-10 rounded-md px-4 text-sm font-medium text-ink-soft transition hover:bg-mist"
          >
            Clear all
          </button>
        ) : null}
      </div>

      {error ? (
        <p className="mt-4 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-[var(--radius-lg)] border border-line bg-paper/70">
          {isLoading ? (
            <p className="px-4 py-10 text-sm text-ink-soft/70">Loading history…</p>
          ) : filteredItems.length === 0 ? (
            <p className="px-4 py-10 text-sm text-ink-soft/70">
              {items.length === 0
                ? "No history yet. Process an image and click Download to save it here."
                : `No ${filter === "all" ? "" : `${toolLabel(filter).toLowerCase()} `}history in this filter.`}
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {filteredItems.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={`focus-ring flex w-full flex-col gap-1 px-4 py-3 text-left transition hover:bg-mist/60 ${
                      selectedId === item.id ? "bg-mist/80" : ""
                    }`}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className=" text-sm font-semibold text-ink">
                        {item.outputName}
                      </span>
                      <span className="shrink-0 text-xs font-medium text-accent-deep">
                        {toolLabel(item.tool)}
                      </span>
                    </span>
                    <span className="text-xs text-ink-soft/70">
                      {formatWhen(item.createdAt)} · {item.width}×{item.height} ·{" "}
                      {formatBytes(item.outputBytes)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-[var(--radius-lg)] border border-line bg-paper/70 p-4">
          {!selected || !displayUrl ? (
            <div className="flex min-h-72 items-center justify-center text-sm text-ink-soft/70">
              Select an item to preview original and output.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-1 rounded-md bg-mist/70 p-1">
                <button
                  type="button"
                  onClick={() => setView("output")}
                  className={`focus-ring flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    view === "output"
                      ? "bg-paper text-ink shadow-sm"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  Output
                </button>
                <button
                  type="button"
                  onClick={() => setView("original")}
                  className={`focus-ring flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    view === "original"
                      ? "bg-paper text-ink shadow-sm"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  Original
                </button>
              </div>

              <div className="flex max-h-[380px] min-h-56 items-center justify-center bg-[linear-gradient(45deg,#dfeae6_25%,transparent_25%),linear-gradient(-45deg,#dfeae6_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#dfeae6_75%),linear-gradient(-45deg,transparent_75%,#dfeae6_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0] p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={displayUrl}
                  alt={view === "output" ? selected.outputName : selected.originalName}
                  className="max-h-[350px] max-w-full object-contain"
                />
              </div>

              <div className="text-sm">
                <p className="font-semibold text-ink">
                  {view === "output" ? selected.outputName : selected.originalName}
                </p>
                <p className="mt-1 text-xs text-ink-soft/70">
                  {selected.width}×{selected.height} ·{" "}
                  {formatBytes(
                    view === "output" ? selected.outputBytes : selected.originalBytes,
                  )}{" "}
                  · {selected.format.replace("image/", "").toUpperCase()} ·{" "}
                  {toolLabel(selected.tool)}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() =>
                    downloadBlob(selected.outputBlob, selected.outputName)
                  }
                  className="focus-ring h-11 rounded-md bg-ink px-5 text-sm font-semibold text-foam transition hover:bg-ink-soft"
                >
                  Download output
                </button>
                <button
                  type="button"
                  onClick={() =>
                    downloadBlob(selected.originalBlob, selected.originalName)
                  }
                  className="focus-ring h-11 rounded-md bg-mist px-5 text-sm font-semibold text-ink transition hover:bg-mist/80"
                >
                  Download original
                </button>
                <button
                  type="button"
                  onClick={() => {
                    void remove(selected.id);
                    setSelectedId(null);
                  }}
                  className="focus-ring h-11 rounded-md px-4 text-sm font-medium text-ink-soft transition hover:bg-mist"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
