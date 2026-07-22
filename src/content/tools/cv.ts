import type { ToolPageContent } from "@/types/seo";

export const cvToolContent: ToolPageContent = {
  slug: "cv",
  category: "cv",
  title: "AI CV Maker — Private Resume Builder | PrivyTool",
  description:
    "Build a professional CV with AI assistance. Paste notes, edit live preview, download PDF — draft saved on your device.",
  h1: "AI CV Maker",
  intro:
    "Paste rough career notes and let AI structure your CV. Edit everything, preview live, and download a PDF. Your draft stays in this browser.",
  keywords: ["cv maker", "ai resume builder", "create cv pdf", "resume generator"],
  howTo: [
    {
      name: "Paste notes",
      text: "Add jobs, skills, and education in plain text — or fill the form manually.",
    },
    {
      name: "Generate and edit",
      text: "Use AI to draft sections, then tweak summary, bullets, and skills.",
    },
    {
      name: "Download PDF",
      text: "Export a clean PDF when you're happy with the preview.",
    },
  ],
  faqs: [
    {
      question: "Is my CV uploaded to a server?",
      answer:
        "The PDF is built in your browser. AI generation sends only the text you provide to the configured API on preview/production — not your files.",
    },
    {
      question: "Does AI work locally?",
      answer:
        "AI runs through a server-side API key on Cloudflare preview. Without that key, you can still edit manually and download PDF.",
    },
    {
      question: "Is my draft saved?",
      answer: "Yes — your draft is stored in localStorage on this device.",
    },
  ],
  related: [
    {
      href: "/tools/pdf/images-to-pdf",
      title: "Images to PDF",
      description: "Combine images into a PDF.",
    },
    {
      href: "/tools/image/scan",
      title: "Scan Document",
      description: "Scan pages from your camera.",
    },
    {
      href: "/tools/pdf/compress",
      title: "Compress PDF",
      description: "Shrink PDF file size.",
    },
  ],
};
