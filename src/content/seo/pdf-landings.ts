import {
  pdfHubLink,
  pdfParentToolLink,
  pdfPrivacyFaqs,
  pdfRelatedFromSlugs,
} from "@/lib/seo/landing-helpers";
import type { PdfSeoLandingPage } from "@/types/seo";

const mergeLandings: PdfSeoLandingPage[] = [
  {
    slug: "merge-pdf-online",
    category: "pdf",
    title: "Merge PDF Online Free — Combine PDF Files | PrivyTool",
    description:
      "Free online PDF merger. Combine multiple PDF files in seconds — no registration, no watermarks, no upload. Merge & combine PDFs in your browser.",
    h1: "Merge PDF Online",
    intro:
      "Merge PDF online free. Combine documents with live preview — no sign-up, no installation, processing stays on your device.",
    keywords: [
      "pdf merge online free",
      "merge pdf online free",
      "merge pdf online",
      "combine pdf",
      "combine pdf files",
      "pdf merger free",
      "join pdf files",
      "merge pdf no registration",
    ],
    preset: { tool: "merge-pdf" },
    parentHref: "/tools/pdf/merge",
    howTo: [
      { name: "Add PDF files", text: "Drop two or more PDFs from your device." },
      { name: "Reorder", text: "Use arrows to set merge order. Preview updates automatically." },
      { name: "Download", text: "Save the merged PDF when the live preview looks correct." },
    ],
    faqs: pdfPrivacyFaqs([
      {
        question: "How many PDFs can I merge?",
        answer: "There is no hard limit, but very large files depend on your device memory.",
      },
    ]),
    related: [],
  },
  {
    slug: "combine-pdf-files",
    category: "pdf",
    title: "Combine PDF Files — Free Browser Tool | PrivyTool",
    description:
      "Combine PDF files into one document without uploading. Free, fast, and 100% private.",
    h1: "Combine PDF Files",
    intro:
      "Join reports, scans, and chapters into a single PDF. All processing stays on your device with live preview.",
    keywords: [
      "combine pdf files",
      "join pdf documents",
      "merge pdf free",
      "pdf merge online free",
      "combine multiple pdfs",
      "pdf merger no signup",
    ],
    preset: { tool: "merge-pdf" },
    parentHref: "/tools/pdf/merge",
    howTo: [
      { name: "Upload PDFs", text: "Select the files you want to combine." },
      { name: "Arrange order", text: "Reorder files before merging." },
      { name: "Export", text: "Download the combined PDF." },
    ],
    faqs: pdfPrivacyFaqs(),
    related: [],
  },
  {
    slug: "join-pdf-free",
    category: "pdf",
    title: "Join PDF Free — No Upload, No Account | PrivyTool",
    description:
      "Join PDF pages and files for free in your browser. No signup, no server upload.",
    h1: "Join PDF Free",
    intro:
      "Need to stitch PDFs together? PrivyTool joins files locally — free with no account required.",
    keywords: ["join pdf free", "join pdf online", "free pdf combiner"],
    preset: { tool: "merge-pdf" },
    parentHref: "/tools/pdf/merge",
    howTo: [
      { name: "Add files", text: "Upload the PDFs you want to join." },
      { name: "Preview merge", text: "Live preview updates as you add or reorder files." },
      { name: "Download", text: "Save the joined PDF to your device." },
    ],
    faqs: pdfPrivacyFaqs(),
    related: [],
  },
  {
    slug: "merge-pdf-no-upload",
    category: "pdf",
    title: "Merge PDF No Upload — 100% Private | PrivyTool",
    description:
      "Merge PDF without uploading to a server. Browser-based, privacy-first PDF merger.",
    h1: "Merge PDF No Upload",
    intro:
      "Your PDFs never leave your browser. PrivyTool merges documents on-device for maximum privacy.",
    keywords: ["merge pdf no upload", "private pdf merger", "offline pdf merge browser"],
    preset: { tool: "merge-pdf" },
    parentHref: "/tools/pdf/merge",
    howTo: [
      { name: "Choose PDFs", text: "Files stay in browser memory only." },
      { name: "Merge locally", text: "Preview the combined document in real time." },
      { name: "Save", text: "Download when ready." },
    ],
    faqs: pdfPrivacyFaqs(),
    related: [],
  },
];

const splitLandings: PdfSeoLandingPage[] = [
  {
    slug: "split-pdf-online",
    category: "pdf",
    title: "Split PDF Online — Free, No Upload | PrivyTool",
    description:
      "Split PDF pages online in your browser. Extract ranges or every page — free and private.",
    h1: "Split PDF Online",
    intro:
      "Separate PDF pages without uploading. Split by range, pick pages, or export every page as a ZIP.",
    keywords: ["split pdf online", "pdf splitter free", "separate pdf pages"],
    preset: { tool: "split-pdf", mode: "range" },
    parentHref: "/tools/pdf/split",
    howTo: [
      { name: "Upload PDF", text: "Drop a PDF from your device." },
      { name: "Choose split mode", text: "Pick page range, specific pages, or every page." },
      { name: "Download", text: "Save the split PDF or ZIP archive." },
    ],
    faqs: pdfPrivacyFaqs([
      {
        question: "Can I split every page into separate files?",
        answer: "Yes. Every-page mode downloads a ZIP with one PDF per page.",
      },
    ]),
    related: [],
  },
  {
    slug: "extract-pdf-pages",
    category: "pdf",
    title: "Extract PDF Pages Online — Free | PrivyTool",
    description:
      "Extract specific pages from a PDF in your browser. Free, private, no upload required.",
    h1: "Extract PDF Pages",
    intro:
      "Pull out the pages you need into a new PDF. Live preview updates as you change your selection.",
    keywords: ["extract pdf pages", "pdf page extractor", "copy pages from pdf"],
    preset: { tool: "split-pdf", mode: "extract" },
    parentHref: "/tools/pdf/split",
    howTo: [
      { name: "Add PDF", text: "Upload the source document." },
      { name: "Enter page numbers", text: "Type pages to extract, e.g. 1, 3, 5." },
      { name: "Download", text: "Save the extracted pages as a new PDF." },
    ],
    faqs: pdfPrivacyFaqs(),
    related: [],
  },
  {
    slug: "separate-pdf-pages",
    category: "pdf",
    title: "Separate PDF Pages — Free Online Tool | PrivyTool",
    description:
      "Separate PDF pages into individual files or ranges. Browser-based, no upload.",
    h1: "Separate PDF Pages",
    intro:
      "Break a PDF into smaller parts locally. Preview updates live as you adjust the split settings.",
    keywords: ["separate pdf pages", "divide pdf", "split pdf pages free"],
    preset: { tool: "split-pdf", mode: "every-page" },
    parentHref: "/tools/pdf/split",
    howTo: [
      { name: "Upload", text: "Select your PDF file." },
      { name: "Pick mode", text: "Separate every page, a range, or specific pages." },
      { name: "Export", text: "Download PDF or ZIP output." },
    ],
    faqs: pdfPrivacyFaqs(),
    related: [],
  },
  {
    slug: "split-pdf-by-page-range",
    category: "pdf",
    title: "Split PDF by Page Range — Free | PrivyTool",
    description:
      "Split a PDF by page range in your browser. Extract pages 1–5, 6–10, and more — no upload.",
    h1: "Split PDF by Page Range",
    intro:
      "Extract a continuous range of pages into a new PDF. Set from/to page numbers with live preview.",
    keywords: ["split pdf by page range", "extract pdf page range", "pdf split pages"],
    preset: { tool: "split-pdf", mode: "range", fromPage: 1, toPage: 5 },
    parentHref: "/tools/pdf/split",
    howTo: [
      { name: "Upload PDF", text: "Add the file to split." },
      { name: "Set range", text: "Enter start and end page numbers." },
      { name: "Download", text: "Save the extracted range as a PDF." },
    ],
    faqs: pdfPrivacyFaqs(),
    related: [],
  },
];

const rotateLandings: PdfSeoLandingPage[] = [
  {
    slug: "rotate-pdf-online",
    category: "pdf",
    title: "Rotate PDF Online — Free, No Upload | PrivyTool",
    description:
      "Rotate PDF pages 90°, 180°, or 270° in your browser. Free, private, live preview.",
    h1: "Rotate PDF Online",
    intro:
      "Fix sideways or upside-down PDF scans locally. Rotate all pages or a range — preview updates live.",
    keywords: ["rotate pdf online", "turn pdf pages", "pdf rotation free"],
    preset: { tool: "rotate-pdf", angle: 90, scope: "all" },
    parentHref: "/tools/pdf/rotate",
    howTo: [
      { name: "Upload PDF", text: "Drop your PDF file." },
      { name: "Choose rotation", text: "Pick 90°, 180°, or 270° and page scope." },
      { name: "Download", text: "Save the rotated PDF." },
    ],
    faqs: pdfPrivacyFaqs(),
    related: [],
  },
  {
    slug: "rotate-pdf-90-degrees",
    category: "pdf",
    title: "Rotate PDF 90 Degrees — Free Online | PrivyTool",
    description:
      "Rotate PDF 90 degrees clockwise in your browser. No upload, live preview, free.",
    h1: "Rotate PDF 90 Degrees",
    intro:
      "Turn landscape scans upright with one click. 90° rotation runs locally with instant preview.",
    keywords: ["rotate pdf 90 degrees", "turn pdf 90", "rotate pdf clockwise"],
    preset: { tool: "rotate-pdf", angle: 90, scope: "all" },
    parentHref: "/tools/pdf/rotate",
    howTo: [
      { name: "Add PDF", text: "Upload from your device." },
      { name: "90° applied", text: "Rotation preset is 90° — adjust scope if needed." },
      { name: "Save", text: "Download the corrected PDF." },
    ],
    faqs: pdfPrivacyFaqs(),
    related: [],
  },
  {
    slug: "rotate-pdf-180-degrees",
    category: "pdf",
    title: "Rotate PDF 180 Degrees — Free | PrivyTool",
    description: "Flip PDF upside down — rotate 180° in your browser. Free and private.",
    h1: "Rotate PDF 180 Degrees",
    intro: "Fix upside-down PDF pages with 180° rotation. Live preview, no server upload.",
    keywords: ["rotate pdf 180", "flip pdf upside down", "rotate pdf 180 degrees online"],
    preset: { tool: "rotate-pdf", angle: 180, scope: "all" },
    parentHref: "/tools/pdf/rotate",
    howTo: [
      { name: "Upload", text: "Select your PDF." },
      { name: "180° rotation", text: "Preview updates automatically." },
      { name: "Download", text: "Export the rotated file." },
    ],
    faqs: pdfPrivacyFaqs(),
    related: [],
  },
];

const imagesToPdfLandings: PdfSeoLandingPage[] = [
  {
    slug: "jpg-to-pdf",
    category: "pdf",
    title: "JPG to PDF — Convert Images Free, No Upload | PrivyTool",
    description:
      "Convert JPG photos to PDF in your browser. Bulk upload, reorder pages, live preview.",
    h1: "JPG to PDF",
    intro:
      "Turn JPEG photos into a PDF document locally. Add multiple images — each becomes one page.",
    keywords: ["jpg to pdf", "jpeg to pdf online", "convert jpg to pdf free"],
    preset: { tool: "images-to-pdf", pageSize: "a4" },
    parentHref: "/tools/pdf/images-to-pdf",
    howTo: [
      { name: "Add JPG files", text: "Upload one or more JPEG images." },
      { name: "Reorder & size", text: "Arrange pages and pick A4, Letter, or fit-to-image." },
      { name: "Download PDF", text: "Save when the live preview looks right." },
    ],
    faqs: pdfPrivacyFaqs([
      {
        question: "Can I convert multiple JPGs at once?",
        answer: "Yes. Add as many images as you need — each image becomes one PDF page.",
      },
    ]),
    related: [],
  },
  {
    slug: "png-to-pdf",
    category: "pdf",
    title: "PNG to PDF — Free Online Converter | PrivyTool",
    description:
      "Convert PNG images to PDF in your browser. Bulk images supported — no upload.",
    h1: "PNG to PDF",
    intro:
      "Combine PNG screenshots or graphics into one PDF. Processing stays on your device.",
    keywords: ["png to pdf", "convert png to pdf online", "png to pdf free"],
    preset: { tool: "images-to-pdf", pageSize: "a4" },
    parentHref: "/tools/pdf/images-to-pdf",
    howTo: [
      { name: "Upload PNGs", text: "Drop PNG files from your device." },
      { name: "Set page size", text: "Choose A4, Letter, or fit each page to the image." },
      { name: "Export", text: "Download the combined PDF." },
    ],
    faqs: pdfPrivacyFaqs(),
    related: [],
  },
  {
    slug: "images-to-pdf-online",
    category: "pdf",
    title: "Images to PDF Online — Free, No Upload | PrivyTool",
    description:
      "Convert images to PDF online in your browser. JPG, PNG, WebP — bulk upload with live preview.",
    h1: "Images to PDF Online",
    intro:
      "Create a PDF from photos and scans without uploading. Reorder images and preview the result live.",
    keywords: ["images to pdf online", "photo to pdf", "picture to pdf converter"],
    preset: { tool: "images-to-pdf", pageSize: "a4" },
    parentHref: "/tools/pdf/images-to-pdf",
    howTo: [
      { name: "Add images", text: "Upload JPG, PNG, or WebP files." },
      { name: "Arrange pages", text: "Drag order with up/down controls." },
      { name: "Download", text: "Save the PDF to your device." },
    ],
    faqs: pdfPrivacyFaqs(),
    related: [],
  },
  {
    slug: "bulk-images-to-pdf",
    category: "pdf",
    title: "Bulk Images to PDF — Combine Photos Free | PrivyTool",
    description:
      "Combine many images into one PDF in your browser. Bulk upload, reorder, live preview.",
    h1: "Bulk Images to PDF",
    intro:
      "Merge dozens of photos into a single PDF locally. Ideal for scans, receipts, and albums.",
    keywords: ["bulk images to pdf", "multiple images to pdf", "combine photos to pdf"],
    preset: { tool: "images-to-pdf", pageSize: "a4" },
    parentHref: "/tools/pdf/images-to-pdf",
    howTo: [
      { name: "Select many images", text: "Upload multiple files at once." },
      { name: "Order pages", text: "Reorder before export. Preview updates live." },
      { name: "Download", text: "Get one combined PDF file." },
    ],
    faqs: pdfPrivacyFaqs(),
    related: [],
  },
  {
    slug: "webp-to-pdf",
    category: "pdf",
    title: "WebP to PDF — Free Browser Converter | PrivyTool",
    description: "Convert WebP images to PDF without uploading. Free, private, live preview.",
    h1: "WebP to PDF",
    intro: "Turn WebP images into a printable PDF document. All conversion runs in your browser.",
    keywords: ["webp to pdf", "convert webp to pdf online"],
    preset: { tool: "images-to-pdf", pageSize: "fit" },
    parentHref: "/tools/pdf/images-to-pdf",
    howTo: [
      { name: "Add WebP files", text: "Upload from your device." },
      { name: "Choose layout", text: "Fit to image or use A4/Letter page size." },
      { name: "Save PDF", text: "Download the converted document." },
    ],
    faqs: pdfPrivacyFaqs(),
    related: [],
  },
  {
    slug: "photos-to-pdf",
    category: "pdf",
    title: "Photos to PDF — Free Online | PrivyTool",
    description:
      "Turn phone photos into a PDF in your browser. Free, no account, live preview.",
    h1: "Photos to PDF",
    intro:
      "Combine camera photos into one shareable PDF. Perfect for documents, IDs, and portfolios.",
    keywords: ["photos to pdf", "pictures to pdf", "convert photos to pdf free"],
    preset: { tool: "images-to-pdf", pageSize: "a4" },
    parentHref: "/tools/pdf/images-to-pdf",
    howTo: [
      { name: "Upload photos", text: "Add JPG or PNG images from your phone or PC." },
      { name: "Reorder", text: "Set the page order for your PDF." },
      { name: "Download", text: "Save the finished PDF." },
    ],
    faqs: pdfPrivacyFaqs(),
    related: [],
  },
];

const compressLandings: PdfSeoLandingPage[] = [
  {
    slug: "compress-pdf-online",
    category: "pdf",
    title: "Compress PDF Online — Free, No Upload | PrivyTool",
    description:
      "Compress PDF files in your browser. Reduce size for email and forms — free, private, no upload.",
    h1: "Compress PDF Online",
    intro:
      "Shrink PDF file size locally with live preview. PrivyTool compresses in your browser — nothing is uploaded.",
    keywords: ["compress pdf online", "pdf compressor free", "reduce pdf size online"],
    preset: { tool: "compress-pdf", level: "balanced" },
    parentHref: "/tools/pdf/compress",
    howTo: [
      { name: "Add a PDF", text: "Drop your file from your device." },
      { name: "Pick a level", text: "Balanced works for most email attachments." },
      { name: "Download", text: "Save when the compressed size looks right." },
    ],
    faqs: pdfPrivacyFaqs([
      {
        question: "Does compression hurt quality?",
        answer:
          "Pages are re-encoded as images. High quality keeps more detail; Smallest prioritizes size.",
      },
    ]),
    related: [],
  },
  {
    slug: "reduce-pdf-file-size",
    category: "pdf",
    title: "Reduce PDF File Size — Free Browser Tool | PrivyTool",
    description:
      "Reduce PDF file size without uploading. Free on-device compressor with High, Balanced, and Smallest modes.",
    h1: "Reduce PDF File Size",
    intro:
      "Make large PDFs small enough for portals and email. Processing stays on your device with a live size comparison.",
    keywords: ["reduce pdf file size", "make pdf smaller", "shrink pdf online"],
    preset: { tool: "compress-pdf", level: "small" },
    parentHref: "/tools/pdf/compress",
    howTo: [
      { name: "Upload PDF", text: "Select the file you want to shrink." },
      { name: "Choose Smallest", text: "Use the strongest level when forms reject large files." },
      { name: "Export", text: "Download the reduced PDF." },
    ],
    faqs: pdfPrivacyFaqs(),
    related: [],
  },
  {
    slug: "compress-pdf-for-email",
    category: "pdf",
    title: "Compress PDF for Email — Free, Private | PrivyTool",
    description:
      "Compress a PDF for email attachments in your browser. No upload — shrink files so they send reliably.",
    h1: "Compress PDF for Email",
    intro:
      "Email providers often reject large attachments. Compress locally, preview the result, then attach the smaller file.",
    keywords: [
      "compress pdf for email",
      "pdf too large for email",
      "shrink pdf attachment",
    ],
    preset: { tool: "compress-pdf", level: "balanced" },
    parentHref: "/tools/pdf/compress",
    howTo: [
      { name: "Add the PDF", text: "Open the attachment you need to send." },
      { name: "Use Balanced", text: "Good size vs readability for most emails." },
      { name: "Download and attach", text: "Save the compressed file, then attach it to your message." },
    ],
    faqs: pdfPrivacyFaqs(),
    related: [],
  },
];

export const pdfSeoLandingPagesBase: PdfSeoLandingPage[] = [
  ...mergeLandings,
  ...splitLandings,
  ...rotateLandings,
  ...imagesToPdfLandings,
  ...compressLandings,
];

const pdfRelatedMap: Record<string, string[]> = {
  "merge-pdf-online": ["combine-pdf-files", "join-pdf-free"],
  "combine-pdf-files": ["merge-pdf-online", "merge-pdf-no-upload"],
  "join-pdf-free": ["merge-pdf-online", "merge-pdf-no-upload"],
  "merge-pdf-no-upload": ["merge-pdf-online", "combine-pdf-files"],
  "split-pdf-online": ["extract-pdf-pages", "split-pdf-by-page-range"],
  "extract-pdf-pages": ["split-pdf-online", "separate-pdf-pages"],
  "separate-pdf-pages": ["split-pdf-online", "extract-pdf-pages"],
  "split-pdf-by-page-range": ["extract-pdf-pages", "split-pdf-online"],
  "rotate-pdf-online": ["rotate-pdf-90-degrees", "rotate-pdf-180-degrees"],
  "rotate-pdf-90-degrees": ["rotate-pdf-online", "rotate-pdf-180-degrees"],
  "rotate-pdf-180-degrees": ["rotate-pdf-online", "rotate-pdf-90-degrees"],
  "jpg-to-pdf": ["png-to-pdf", "bulk-images-to-pdf"],
  "png-to-pdf": ["jpg-to-pdf", "webp-to-pdf"],
  "images-to-pdf-online": ["bulk-images-to-pdf", "photos-to-pdf"],
  "bulk-images-to-pdf": ["images-to-pdf-online", "jpg-to-pdf"],
  "webp-to-pdf": ["png-to-pdf", "jpg-to-pdf"],
  "photos-to-pdf": ["images-to-pdf-online", "bulk-images-to-pdf"],
  "compress-pdf-online": ["reduce-pdf-file-size", "compress-pdf-for-email"],
  "reduce-pdf-file-size": ["compress-pdf-online", "compress-pdf-for-email"],
  "compress-pdf-for-email": ["compress-pdf-online", "reduce-pdf-file-size"],
};

function withPdfRelated(page: PdfSeoLandingPage, relatedSlugs: string[]): PdfSeoLandingPage {
  const bySlug = new Map(pdfSeoLandingPagesBase.map((entry) => [entry.slug, entry]));
  return {
    ...page,
    related: [
      pdfParentToolLink(page.preset.tool),
      ...pdfRelatedFromSlugs(relatedSlugs, bySlug),
      pdfHubLink(),
    ],
  };
}

export const pdfSeoLandingPages: PdfSeoLandingPage[] = pdfSeoLandingPagesBase.map((page) =>
  withPdfRelated(page, pdfRelatedMap[page.slug] ?? []),
);

export const featuredPdfSeoLandingSlugs = [
  "merge-pdf-online",
  "compress-pdf-online",
  "split-pdf-online",
  "rotate-pdf-online",
  "jpg-to-pdf",
  "png-to-pdf",
  "images-to-pdf-online",
  "bulk-images-to-pdf",
] as const;
