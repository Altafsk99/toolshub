import type { FaqItem, RelatedTool, SeoLandingPage } from "@/types/seo";

const PRIVACY_FAQ: FaqItem = {
  question: "Do you upload my images?",
  answer:
    "No. Processing runs entirely in your browser using the Canvas API. Your files never leave your device.",
};

const FREE_FAQ: FaqItem = {
  question: "Is PrivyTool free?",
  answer:
    "Yes. Basic image tools are free. Optional premium features may arrive later as traffic grows.",
};

export function privacyFaqs(extra: FaqItem[] = []): FaqItem[] {
  return [...extra, PRIVACY_FAQ, FREE_FAQ];
}

export function parentToolLink(
  tool: "compress" | "resize" | "convert" | "crop" | "rotate" | "flip",
): RelatedTool {
  const map = {
    compress: {
      href: "/tools/image/compress",
      title: "Compress Image",
      description: "Full compressor with quality and target KB modes.",
    },
    resize: {
      href: "/tools/image/resize",
      title: "Resize Image",
      description: "Custom dimensions, fit modes, and optional compression.",
    },
    convert: {
      href: "/tools/image/convert",
      title: "Convert Image",
      description: "Switch between PNG, JPG, WebP, and AVIF.",
    },
    crop: {
      href: "/tools/image/crop",
      title: "Crop Image",
      description: "Square, circle, and social aspect ratio crops.",
    },
    rotate: {
      href: "/tools/image/rotate",
      title: "Rotate Image",
      description: "Turn photos 90°, 180°, or any custom angle.",
    },
    flip: {
      href: "/tools/image/flip",
      title: "Flip Image",
      description: "Mirror photos horizontally or vertically.",
    },
  } as const;
  return map[tool];
}

export function hubLink(): RelatedTool {
  return {
    href: "/tools/image",
    title: "All Image Tools",
    description: "Browse the full privacy-first image toolkit.",
  };
}

export function relatedFromSlugs(
  slugs: string[],
  bySlug: Map<string, SeoLandingPage>,
): RelatedTool[] {
  return slugs
    .map((slug) => bySlug.get(slug))
    .filter((page): page is SeoLandingPage => page != null)
    .map((page) => ({
      href: `/tools/image/${page.slug}`,
      title: page.h1,
      description: page.intro.slice(0, 120),
    }));
}
