import type { Metadata } from "next";
import type { ToolPageContent } from "@/types/seo";

const SITE_NAME = "ToolsHub";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toolshub.app";

export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE_URL).toString();
}

export function buildToolMetadata(content: ToolPageContent): Metadata {
  const url = absoluteUrl(`/tools/image/${content.slug}`);
  return {
    title: content.title,
    description: content.description,
    keywords: content.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: content.title,
      description: content.description,
      url,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description,
    },
  };
}

export function buildWebApplicationJsonLd(content: ToolPageContent) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: content.h1,
    description: content.description,
    url: absoluteUrl(`/tools/image/${content.slug}`),
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

export { SITE_NAME, SITE_URL };
