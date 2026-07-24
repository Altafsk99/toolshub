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
  title: "Photo Compressor & Image Resizer Online Free | PrivyTool",
  description:
    "Free photo compressor, compress image, and image resizer online. JPG/PNG/WebP tools with no registration and no upload — runs in your browser.",
  path: "/tools/image",
  keywords: [
    "photo compressor",
    "compress image",
    "image compressor",
    "image resizer",
    "image compression online free",
    "compress image online free",
    "resize image online",
    "reduce file size jpg",
    "free image compressor",
    "no registration",
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
