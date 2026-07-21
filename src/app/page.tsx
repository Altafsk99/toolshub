import type { Metadata } from "next";
import { HomePageClient } from "@/components/home/HomePageClient";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildHomeItemListJsonLd,
  buildOrganizationJsonLd,
  buildPageMetadata,
  buildWebSiteJsonLd,
} from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "PrivyTool — Free Privacy-First Online Tools",
  description:
    "Compress, resize, and convert images; merge, split, and rotate PDFs — all in your browser. No upload, no account, 100% private.",
  path: "/",
  keywords: [
    "online tools",
    "image tools",
    "pdf tools",
    "merge pdf online",
    "split pdf",
    "jpg to pdf",
    "compress image online",
    "privacy first",
    "no upload",
  ],
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={[buildOrganizationJsonLd(), buildWebSiteJsonLd()]} />
      <JsonLd data={buildHomeItemListJsonLd()} />
      <HomePageClient />
    </>
  );
}
