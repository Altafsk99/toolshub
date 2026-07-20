import type { Metadata } from "next";
import { HistoryClient } from "@/components/image/HistoryClient";

export const metadata: Metadata = {
  title: "Image History",
  description:
    "View images you processed in ToolsHub. History stays on your device — nothing is uploaded to our servers.",
  robots: { index: false, follow: false },
};

export default function ImageHistoryPage() {
  return <HistoryClient />;
}
