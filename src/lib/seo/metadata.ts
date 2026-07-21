import type { Metadata } from "next";
import type { BlogPost } from "@/types/blog";
import type { ToolPageContent } from "@/types/seo";

const SITE_NAME = "PrivyTool";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://privytool.com";

export type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
};

export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE_URL).toString();
}

export function buildPageMetadata(input: PageMetadataInput): Metadata {
  const url = absoluteUrl(input.path);
  return {
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    alternates: { canonical: url },
    robots: input.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
    },
  };
}

export function toolPagePath(content: ToolPageContent): string {
  return `/tools/${content.category}/${content.slug}`;
}

export function buildToolMetadata(content: ToolPageContent): Metadata {
  return buildPageMetadata({
    title: content.title,
    description: content.description,
    path: toolPagePath(content),
    keywords: content.keywords,
  });
}

export function buildWebApplicationJsonLd(content: ToolPageContent) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: content.h1,
    description: content.description,
    url: absoluteUrl(toolPagePath(content)),
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    browserRequirements: "Requires JavaScript. Processing runs in your browser.",
  };
}

export function buildFaqJsonLd(content: ToolPageContent) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildHowToJsonLd(content: ToolPageContent) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use ${content.h1}`,
    description: content.intro,
    step: content.howTo.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: absoluteUrl("/"),
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/icon-512.png"),
      width: 512,
      height: 512,
    },
    image: absoluteUrl("/og-image.png"),
    description:
      "Privacy-first online tools. Compress, resize, convert, crop, rotate, and flip images; merge, split, rotate PDFs — all in your browser.",
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: absoluteUrl("/"),
    description:
      "Free privacy-first online toolkit. Compress and edit images; merge, split, and rotate PDFs in your browser.",
    inLanguage: "en-US",
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
  };
}

export function buildHomeItemListJsonLd() {
  return buildItemListJsonLd("PrivyTool — Free Online Tools", [
    {
      name: "Compress Image",
      path: "/tools/image/compress",
      description: "Shrink JPG, PNG, and WebP with quality or target KB presets.",
    },
    {
      name: "Resize Image",
      path: "/tools/image/resize",
      description: "Set dimensions, fit modes, and optional compression.",
    },
    {
      name: "Compress PDF",
      path: "/tools/pdf/compress",
      description: "Reduce PDF file size with live preview.",
    },
    {
      name: "Merge PDF",
      path: "/tools/pdf/merge",
      description: "Combine multiple PDF files with live preview.",
    },
    {
      name: "Split PDF",
      path: "/tools/pdf/split",
      description: "Extract pages or split every page into a ZIP.",
    },
    {
      name: "Rotate PDF",
      path: "/tools/pdf/rotate",
      description: "Turn PDF pages 90°, 180°, or 270°.",
    },
    {
      name: "Images to PDF",
      path: "/tools/pdf/images-to-pdf",
      description: "Convert JPG, PNG, and WebP into one PDF.",
    },
    {
      name: "Crop Image",
      path: "/tools/image/crop",
      description: "Square, circle, and social aspect ratio crops.",
    },
    {
      name: "Convert Image",
      path: "/tools/image/convert",
      description: "Switch between PNG, JPG, WebP, and AVIF.",
    },
  ]);
}

export function buildBreadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildItemListJsonLd(
  name: string,
  items: { name: string; path: string; description: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
      description: item.description,
    })),
  };
}

export function buildArticleJsonLd(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl("/"),
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl("/"),
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/icon-512.png"),
      },
    },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    image: absoluteUrl("/og-image.png"),
    keywords: post.keywords.join(", "),
  };
}

export { SITE_NAME, SITE_URL };
