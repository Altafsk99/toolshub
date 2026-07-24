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
  title: "PrivyTool — Free Photo Compressor & PDF Merger Online",
  description:
    "Free photo compressor and PDF merge online — compress image, resize, combine PDFs. No registration, no watermarks. 100% private in your browser.",
  path: "/",
  keywords: [
    "photo compressor",
    "compress image",
    "image compressor",
    "image resizer",
    "image compression online free",
    "compress image online free",
    "pdf merge online free",
    "merge pdf online free",
    "reduce file size jpg",
    "free image compressor",
    "no registration",
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
