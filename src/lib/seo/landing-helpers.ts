import type { FaqItem, PdfSeoLandingPage, RelatedTool, SeoLandingPage } from "@/types/seo";

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

const PDF_PRIVACY_FAQ: FaqItem = {
  question: "Do you upload my PDFs?",
  answer:
    "No. PDF processing runs entirely in your browser using pdf-lib. Your files never leave your device.",
};

export function pdfPrivacyFaqs(extra: FaqItem[] = []): FaqItem[] {
  return [
    ...extra,
    PDF_PRIVACY_FAQ,
    {
      question: "Is PrivyTool free?",
      answer: "Yes. Basic PDF tools are free with no account required.",
    },
  ];
}

export function pdfParentToolLink(
  tool: "merge-pdf" | "split-pdf" | "rotate-pdf" | "images-to-pdf",
): RelatedTool {
  const map = {
    "merge-pdf": {
      href: "/tools/pdf/merge",
      title: "Merge PDF",
      description: "Combine multiple PDF files with live preview.",
    },
    "split-pdf": {
      href: "/tools/pdf/split",
      title: "Split PDF",
      description: "Extract pages or split every page into a ZIP.",
    },
    "rotate-pdf": {
      href: "/tools/pdf/rotate",
      title: "Rotate PDF",
      description: "Turn PDF pages 90°, 180°, or 270°.",
    },
    "images-to-pdf": {
      href: "/tools/pdf/images-to-pdf",
      title: "Images to PDF",
      description: "Convert JPG, PNG, and WebP into one PDF.",
    },
  } as const;
  return map[tool];
}

export function pdfHubLink(): RelatedTool {
  return {
    href: "/tools/pdf",
    title: "All PDF Tools",
    description: "Browse merge, split, rotate, and images-to-PDF tools.",
  };
}

export function pdfRelatedFromSlugs(
  slugs: string[],
  bySlug: Map<string, PdfSeoLandingPage>,
): RelatedTool[] {
  return slugs
    .map((slug) => bySlug.get(slug))
    .filter((page): page is PdfSeoLandingPage => page != null)
    .map((page) => ({
      href: `/tools/pdf/${page.slug}`,
      title: page.h1,
      description: page.intro.slice(0, 120),
    }));
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
