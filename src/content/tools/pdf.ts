import type { ToolPageContent } from "@/types/seo";

const pdfPrivacyFaq = {
  question: "Do you upload my PDFs?",
  answer:
    "No. All PDF processing runs entirely in your browser using pdf-lib. Your files never leave your device.",
};

const pdfFreeFaq = {
  question: "Is PrivyTool free? Do I need an account?",
  answer:
    "Yes — 100% free online PDF tools with no registration, no sign-up, no watermarks, and no installation required.",
};

export const mergePdfToolContent: ToolPageContent = {
  slug: "merge",
  category: "pdf",
  title: "Merge PDF Online Free — Combine PDF Files | PrivyTool",
  description:
    "Free online PDF merger. Combine multiple PDF files into one in seconds — no registration, no watermarks, no upload. Works in your browser on any device.",
  h1: "Merge PDF",
  intro:
    "Merge & combine PDF files online for free. Select multiple PDFs, reorder them, and download one document — privately in your browser with no account required.",
  keywords: [
    "pdf merge online free",
    "merge pdf online free",
    "merge pdf",
    "combine pdf",
    "combine pdf files",
    "pdf merger",
    "pdf merger free",
    "join pdf online",
    "merge pdf no registration",
    "merge pdf no signup",
    "merge pdf no upload",
    "combine multiple pdfs",
  ],
  howTo: [
    {
      name: "Add PDF files",
      text: "Select multiple PDF files from your device — drag and drop or browse. No install needed.",
    },
    {
      name: "Reorder if needed",
      text: "Use the up and down arrows to set the final order before merging.",
    },
    {
      name: "Merge and download",
      text: "Merge & combine into one PDF, then download. Free, with no watermarks and no sign-up.",
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

export const compressPdfToolContent: ToolPageContent = {
  slug: "compress",
  category: "pdf",
  title: "Compress PDF Online Free — Reduce PDF Size | PrivyTool",
  description:
    "Free online PDF compressor. Shrink PDF file size in your browser — no registration, no watermarks, no upload. Great for email and forms.",
  h1: "Compress PDF",
  intro:
    "Compress PDF online free. Shrink large PDFs for email and uploads without signing up — processing stays in your browser with a live size comparison.",
  keywords: [
    "compress pdf online free",
    "compress pdf",
    "reduce pdf size",
    "pdf compressor online",
    "shrink pdf free",
    "compress pdf no upload",
    "pdf compressor no registration",
  ],
  howTo: [
    {
      name: "Add your PDF",
      text: "Drop a PDF from your device. It stays in your browser only.",
    },
    {
      name: "Choose compression level",
      text: "Pick High quality, Balanced, or Smallest. Preview and file size update live.",
    },
    {
      name: "Download",
      text: "Save the compressed PDF when the size looks right.",
    },
  ],
  faqs: [
    pdfPrivacyFaq,
    {
      question: "Will text stay sharp?",
      answer:
        "Compression re-encodes pages as images, so tiny text can look softer. Use High quality for readable documents, or Smallest when size matters most.",
    },
    {
      question: "Why didn’t my PDF get smaller?",
      answer:
        "Some PDFs are already heavily compressed. Try Smallest, or split and compress sections separately.",
    },
    pdfFreeFaq,
  ],
  related: [
    {
      href: "/tools/pdf/merge",
      title: "Merge PDF",
      description: "Combine PDFs before or after compressing.",
    },
    {
      href: "/tools/pdf/split",
      title: "Split PDF",
      description: "Extract pages to shrink what you keep.",
    },
    {
      href: "/tools/image/compress",
      title: "Compress Image",
      description: "Shrink images before converting to PDF.",
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
  compressPdfToolContent,
];
