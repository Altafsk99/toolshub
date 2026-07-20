import type { Metadata } from "next";
import { HomePageClient } from "@/components/home/HomePageClient";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildOrganizationJsonLd,
  buildPageMetadata,
  buildWebSiteJsonLd,
} from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "PrivyTool — Free Privacy-First Online Image Tools",
  description:
    "Compress, resize, and convert images in your browser. No upload, no account — 100% private and free on PrivyTool.",
  path: "/",
  keywords: [
    "online tools",
    "image tools",
    "compress image online",
    "resize image online",
    "convert image format",
    "privacy first",
    "no upload",
  ],
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={buildOrganizationJsonLd()} />
      <JsonLd data={buildWebSiteJsonLd()} />
      <HomePageClient />
    </>
  );
}
