import type { HistoryEntryMeta, HistoryEntryRecord, HistoryListItem } from "@/types/history";

const DB_NAME = "toolshub-history";
const DB_VERSION = 1;
const STORE = "entries";
const MAX_ENTRIES = 30;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB is not available in this browser."));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error ?? new Error("Failed to open history DB"));
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: "id" });
        store.createIndex("createdAt", "createdAt", { unique: false });
      }
    };
  });
}

function reqToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed"));
  });
}

function txDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("IndexedDB transaction failed"));
    tx.onabort = () => reject(tx.error ?? new Error("IndexedDB transaction aborted"));
  });
}

function toMeta(record: HistoryEntryRecord): HistoryEntryMeta {
  return {
    id: record.id,
    tool: record.tool,
    createdAt: record.createdAt,
    originalName: record.originalName,
    outputName: record.outputName,
    originalBytes: record.originalBytes,
    outputBytes: record.outputBytes,
    width: record.width,
    height: record.height,
    format: record.format,
  };
}

export async function listHistory(): Promise<HistoryListItem[]> {
  const db = await openDb();
  const tx = db.transaction(STORE, "readonly");
  const store = tx.objectStore(STORE);
  const rows = (await reqToPromise(store.getAll())) as HistoryEntryRecord[];
  await txDone(tx);
  db.close();
  return rows
    .map(toMeta)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function getHistoryEntry(id: string): Promise<HistoryEntryRecord | null> {
  const db = await openDb();
  const tx = db.transaction(STORE, "readonly");
  const store = tx.objectStore(STORE);
  const row = (await reqToPromise(store.get(id))) as HistoryEntryRecord | undefined;
  await txDone(tx);
  db.close();
  return row ?? null;
}

export async function addHistoryEntry(
  entry: Omit<HistoryEntryRecord, "id" | "createdAt"> & { id?: string; createdAt?: number },
): Promise<HistoryEntryMeta> {
  const record: HistoryEntryRecord = {
    ...entry,
    id: entry.id ?? crypto.randomUUID(),
    createdAt: entry.createdAt ?? Date.now(),
  };

  const db = await openDb();
  const tx = db.transaction(STORE, "readwrite");
  const store = tx.objectStore(STORE);
  await reqToPromise(store.put(record));

  // Cap history size (oldest first)
  const all = (await reqToPromise(store.getAll())) as HistoryEntryRecord[];
  if (all.length > MAX_ENTRIES) {
    const sorted = [...all].sort((a, b) => a.createdAt - b.createdAt);
    const removeCount = sorted.length - MAX_ENTRIES;
    for (let i = 0; i < removeCount; i += 1) {
      await reqToPromise(store.delete(sorted[i].id));
    }
  }

  await txDone(tx);
  db.close();
  return toMeta(record);
}

export async function deleteHistoryEntry(id: string): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(STORE, "readwrite");
  await reqToPromise(tx.objectStore(STORE).delete(id));
  await txDone(tx);
  db.close();
}

export async function clearHistory(): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(STORE, "readwrite");
  await reqToPromise(tx.objectStore(STORE).clear());
  await txDone(tx);
  db.close();
}

export { MAX_ENTRIES };
