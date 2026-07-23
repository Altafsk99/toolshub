import JSZip from "jszip";

export type NamedBlob = {
  name: string;
  blob: Blob;
};

/** Ensure unique filenames inside a ZIP (photo.jpg, photo (2).jpg, …). */
export function uniqueZipNames(names: string[]): string[] {
  const used = new Map<string, number>();
  return names.map((raw) => {
    const name = raw.trim() || "image";
    const count = used.get(name) ?? 0;
    used.set(name, count + 1);
    if (count === 0) return name;

    const dot = name.lastIndexOf(".");
    if (dot > 0) {
      return `${name.slice(0, dot)} (${count + 1})${name.slice(dot)}`;
    }
    return `${name} (${count + 1})`;
  });
}

export async function zipNamedBlobs(entries: NamedBlob[]): Promise<Blob> {
  const zip = new JSZip();
  const names = uniqueZipNames(entries.map((entry) => entry.name));
  for (let i = 0; i < entries.length; i += 1) {
    zip.file(names[i]!, entries[i]!.blob);
  }
  return zip.generateAsync({ type: "blob" });
}
