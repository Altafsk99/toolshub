import type { Metadata } from "next";
import { ImageToolsHub } from "@/components/image/ImageToolsHub";

export const metadata: Metadata = {
  title: "Image Tools",
  description:
    "Privacy-first image tools that run in your browser. Compress, resize, crop, convert — no upload required.",
};

export default function ImageToolsHubPage() {
  return <ImageToolsHub />;
}
