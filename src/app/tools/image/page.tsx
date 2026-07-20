import type { Metadata } from "next";
import { ImageToolsHub } from "@/components/image/ImageToolsHub";
import { JsonLd } from "@/components/seo/JsonLd";
import { imageTools } from "@/components/image/imageToolsData";
import {
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
  buildPageMetadata,
} from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Image Tools — Compress, Resize & Convert Online | PrivyTool",
  description:
    "Free privacy-first image tools that run in your browser. Compress, resize, and convert JPG, PNG, WebP, and AVIF — no upload required.",
  path: "/tools/image",
  keywords: [
    "image tools",
    "online image editor",
    "compress image",
    "resize image",
    "convert image",
    "browser image tools",
    "no upload",
  ],
});

export default function ImageToolsHubPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Image Tools", path: "/tools/image" },
        ])}
      />
      <JsonLd
        data={buildItemListJsonLd(
          "PrivyTool Image Tools",
          imageTools.map((tool) => ({
            name: tool.subtitle,
            path: tool.href,
            description: tool.description,
          })),
        )}
      />
      <ImageToolsHub />
    </>
  );
}
