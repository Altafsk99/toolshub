import type { Metadata } from "next";
import { HistoryClient } from "@/components/image/HistoryClient";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Image History",
  description:
    "View images you processed in PrivyTool. History stays on your device — nothing is uploaded to our servers.",
  path: "/tools/image/history",
  noIndex: true,
});

export default function ImageHistoryPage() {
  return <HistoryClient />;
}
