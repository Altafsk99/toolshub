import type { Metadata } from "next";
import { PdfToolsHub } from "@/components/pdf/PdfToolsHub";
import { pdfTools } from "@/components/pdf/pdfToolsData";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
  buildPageMetadata,
} from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "PDF Tools — Merge, Split, Rotate & Images to PDF | PrivyTool",
  description:
    "Free privacy-first PDF tools that run in your browser. Merge, compress, split, rotate PDFs, and convert images to PDF — no upload required.",
  path: "/tools/pdf",
  keywords: [
    "pdf tools",
    "merge pdf online",
    "compress pdf",
    "split pdf",
    "rotate pdf",
    "images to pdf",
    "browser pdf tools",
    "no upload",
  ],
});

export default function PdfToolsHubPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "PDF Tools", path: "/tools/pdf" },
        ])}
      />
      <JsonLd
        data={buildItemListJsonLd(
          "PrivyTool PDF Tools",
          pdfTools.map((tool) => ({
            name: tool.subtitle,
            path: tool.href,
            description: tool.description,
          })),
        )}
      />
      <PdfToolsHub />
    </>
  );
}
