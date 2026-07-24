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
  title: "PDF Tools Online Free — Merge, Compress, Split | PrivyTool",
  description:
    "Free online PDF tools: merge PDF, compress, split, rotate, and images to PDF. No registration, no watermarks, no upload — works in your browser.",
  path: "/tools/pdf",
  keywords: [
    "pdf merge online free",
    "merge pdf online free",
    "pdf tools",
    "combine pdf files",
    "compress pdf online free",
    "split pdf online",
    "pdf merger free",
    "no registration",
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
