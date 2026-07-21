import type { ToolPageContent } from "@/types/seo";

const pdfPrivacyFaq = {
  question: "Do you upload my PDFs?",
  answer:
    "No. All PDF processing runs entirely in your browser using pdf-lib. Your files never leave your device.",
};

const pdfFreeFaq = {
  question: "Is PrivyTool free?",
  answer: "Yes. Basic PDF tools are free with no account required.",
};

export const mergePdfToolContent: ToolPageContent = {
  slug: "merge",
  category: "pdf",
  title: "Merge PDF Online — Free, Private, No Upload | PrivyTool",
  description:
    "Combine multiple PDF files into one document in your browser. Free, fast, and private — no upload required.",
  h1: "Merge PDF",
  intro:
    "Join PDF files in the order you choose. PrivyTool merges documents locally in your browser — nothing is sent to a server.",
  keywords: ["merge pdf", "combine pdf", "join pdf online", "pdf merger free"],
  howTo: [
    {
      name: "Add PDF files",
      text: "Drag and drop two or more PDFs, or click to browse from your device.",
    },
    {
      name: "Reorder if needed",
      text: "Use the up and down arrows to set the final page order before merging.",
    },
    {
      name: "Merge and download",
      text: "Click Merge PDFs, then download the combined document.",
    },
  ],
  faqs: [
    pdfPrivacyFaq,
    {
      question: "How many PDFs can I merge?",
      answer:
        "There is no hard limit in the tool, but very large files may be slower depending on your device and browser memory.",
    },
    pdfFreeFaq,
  ],
  related: [
    {
      href: "/tools/pdf/split",
      title: "Split PDF",
      description: "Extract pages or split a PDF into separate files.",
    },
    {
      href: "/tools/pdf/images-to-pdf",
      title: "Images to PDF",
      description: "Convert JPG and PNG images into a PDF document.",
    },
    {
      href: "/tools/pdf",
      title: "All PDF Tools",
      description: "Browse the full privacy-first PDF toolkit.",
    },
  ],
};

export const splitPdfToolContent: ToolPageContent = {
  slug: "split",
  category: "pdf",
  title: "Split PDF Online — Free, Private, No Upload | PrivyTool",
  description:
    "Split PDF pages in your browser. Extract a range, pick specific pages, or save every page as a separate file.",
  h1: "Split PDF",
  intro:
    "Extract pages from a PDF without uploading. Split by range, pick individual pages, or export every page as a ZIP of PDFs.",
  keywords: ["split pdf", "extract pdf pages", "separate pdf pages", "pdf splitter online"],
  howTo: [
    {
      name: "Upload a PDF",
      text: "Select the PDF you want to split. It stays on your device only.",
    },
    {
      name: "Choose split mode",
      text: "Pick every page (ZIP), a page range, or specific page numbers.",
    },
    {
      name: "Split and download",
      text: "Click Split PDF, then download the result or ZIP archive.",
    },
  ],
  faqs: [
    pdfPrivacyFaq,
    {
      question: "What does every page (ZIP) do?",
      answer:
        "Each page is saved as its own PDF file and bundled into a ZIP download so you get all pages at once.",
    },
    pdfFreeFaq,
  ],
  related: [
    {
      href: "/tools/pdf/merge",
      title: "Merge PDF",
      description: "Combine multiple PDFs into one file.",
    },
    {
      href: "/tools/pdf/rotate",
      title: "Rotate PDF",
      description: "Turn PDF pages 90°, 180°, or 270°.",
    },
    {
      href: "/tools/pdf",
      title: "All PDF Tools",
      description: "Browse the full privacy-first PDF toolkit.",
    },
  ],
};

export const rotatePdfToolContent: ToolPageContent = {
  slug: "rotate",
  category: "pdf",
  title: "Rotate PDF Online — Free, Private, No Upload | PrivyTool",
  description:
    "Rotate PDF pages 90°, 180°, or 270° in your browser. Apply to all pages or a selected range — free and private.",
  h1: "Rotate PDF",
  intro:
    "Fix sideways or upside-down PDF pages locally. Rotate all pages or only a specific range — no upload required.",
  keywords: ["rotate pdf", "turn pdf pages", "pdf rotation online", "rotate pdf 90 degrees"],
  howTo: [
    {
      name: "Upload a PDF",
      text: "Choose the PDF file you want to rotate.",
    },
    {
      name: "Set rotation and scope",
      text: "Pick 90°, 180°, or 270°, then apply to all pages or a page range.",
    },
    {
      name: "Rotate and download",
      text: "Click Rotate PDF and download the updated document.",
    },
  ],
  faqs: [
    pdfPrivacyFaq,
    {
      question: "Can I rotate only some pages?",
      answer: "Yes. Choose Page range and enter the start and end page numbers.",
    },
    pdfFreeFaq,
  ],
  related: [
    {
      href: "/tools/pdf/split",
      title: "Split PDF",
      description: "Extract or separate PDF pages.",
    },
    {
      href: "/tools/pdf/merge",
      title: "Merge PDF",
      description: "Combine PDF files into one document.",
    },
    {
      href: "/tools/pdf",
      title: "All PDF Tools",
      description: "Browse the full privacy-first PDF toolkit.",
    },
  ],
};

export const imagesToPdfToolContent: ToolPageContent = {
  slug: "images-to-pdf",
  category: "pdf",
  title: "Images to PDF — Bulk Convert JPG/PNG to PDF | PrivyTool",
  description:
    "Convert JPG, PNG, and WebP images to a single PDF in your browser. Bulk upload, reorder pages, A4 or Letter — no upload.",
  h1: "Images to PDF",
  intro:
    "Turn photos and scans into one PDF document. Add multiple images, reorder them, and choose A4, Letter, or fit-to-image page sizes.",
  keywords: [
    "images to pdf",
    "jpg to pdf",
    "png to pdf",
    "convert images to pdf online",
    "bulk images to pdf",
  ],
  howTo: [
    {
      name: "Add images",
      text: "Drop JPG, PNG, or WebP files — add as many as you need.",
    },
    {
      name: "Reorder and set page size",
      text: "Arrange image order and pick A4, Letter, or fit each page to the image size.",
    },
    {
      name: "Create and download PDF",
      text: "Click Create PDF, then download your combined document.",
    },
  ],
  faqs: [
    {
      question: "Do you upload my images?",
      answer:
        "No. Images are converted to PDF entirely in your browser. Nothing is sent to a server.",
    },
    {
      question: "Which image formats are supported?",
      answer: "JPG, PNG, WebP, and most browser-readable image formats. Others are converted via canvas first.",
    },
    pdfFreeFaq,
  ],
  related: [
    {
      href: "/tools/pdf/merge",
      title: "Merge PDF",
      description: "Combine PDF files after converting images.",
    },
    {
      href: "/tools/image/compress",
      title: "Compress Image",
      description: "Shrink images before adding them to a PDF.",
    },
    {
      href: "/tools/pdf",
      title: "All PDF Tools",
      description: "Browse the full privacy-first PDF toolkit.",
    },
  ],
};

export const pdfToolPages = [
  mergePdfToolContent,
  splitPdfToolContent,
  rotatePdfToolContent,
  imagesToPdfToolContent,
];
