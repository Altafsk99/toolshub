import type { ToolPageContent } from "@/types/seo";

export const compressToolContent: ToolPageContent = {
  slug: "compress",
  category: "image",
  title: "Compress Image Online — Free, Private, No Upload | PrivyTool",
  description:
    "Compress JPG, PNG, and WebP images in your browser. Fast, private, and free — your files never leave your device.",
  h1: "Compress Image",
  intro:
    "Shrink image file size without uploading to a server. PrivyTool runs compression locally in your browser for speed and privacy.",
  keywords: [
    "compress image",
    "compress jpg",
    "compress png",
    "reduce image size",
    "online image compressor",
  ],
  howTo: [
    {
      name: "Add your image",
      text: "Drag and drop a JPG, PNG, or WebP file, or click to browse from your device.",
    },
    {
      name: "Choose quality or target size",
      text: "Use the quality slider, or pick a target like 20 KB, 50 KB, 100 KB, or 200 KB. Optionally switch output to JPG or WebP.",
    },
    {
      name: "Compress and download",
      text: "Click Compress to process locally, compare the new size, then download the result.",
    },
  ],
  faqs: [
    {
      question: "Do you upload my images?",
      answer:
        "No. Image processing runs entirely in your browser using the Canvas API. Your files never leave your device.",
    },
    {
      question: "How do I compress to a specific KB size?",
      answer:
        "Switch to Target size, choose a preset (20 / 50 / 100 / 200 KB) or type a custom KB value, then click Compress.",
    },
    {
      question: "Which formats are supported?",
      answer:
        "You can upload JPG, PNG, and WebP. Compressed output is JPG or WebP for the smallest files.",
    },
    {
      question: "Is PrivyTool free?",
      answer:
        "Yes. Basic image tools are free. Optional premium features may arrive later as traffic grows.",
    },
  ],
  related: [
    {
      href: "/tools/image/convert",
      title: "Convert Image",
      description: "Change format to PNG, JPG, WebP, or AVIF.",
    },
    {
      href: "/tools/image/resize",
      title: "Resize Image",
      description: "Change width and height with common presets.",
    },
    {
      href: "/tools/image",
      title: "All Image Tools",
      description: "Browse the full privacy-first image toolkit.",
    },
  ],
};

export const resizeToolContent: ToolPageContent = {
  slug: "resize",
  category: "image",
  title: "Resize Image Online — Free, Private, No Upload | PrivyTool",
  description:
    "Resize images in your browser with no upload required. Custom width/height, percent scale, and presets — free on PrivyTool.",
  h1: "Resize Image",
  intro:
    "Change image dimensions locally in your browser. Choose fit without crop, crop to fill, or stretch — and fill empty edges with white, black, blur, or transparent.",
  keywords: ["resize image", "change image size", "image resizer online", "passport photo size"],
  howTo: [
    {
      name: "Upload locally",
      text: "Select an image from your device. It stays in browser memory only.",
    },
    {
      name: "Set size and fit mode",
      text: "Enter width and height, then choose Fit (no crop), Crop to fill, or Stretch. For Fit, pick white, black, blur, or transparent empty-space fill.",
    },
    {
      name: "Resize and download",
      text: "Click Resize to process on-device, preview the result, then download.",
    },
  ],
  faqs: [
    {
      question: "Is resizing private?",
      answer:
        "Yes. PrivyTool does not upload your images. Resize processing runs entirely in your browser.",
    },
    {
      question: "What happens if the aspect ratio does not match?",
      answer:
        "Use Fit to keep the full image with filled edges, Crop to fill the exact size by trimming edges, or Stretch to force the size (may distort).",
    },
    {
      question: "Can I fill empty space with blur or a solid color?",
      answer:
        "Yes. In Fit (no crop) mode, choose White, Black, Blur, or Transparent for the letterbox/pillarbox areas.",
    },
  ],
  related: [
    {
      href: "/tools/image/compress",
      title: "Compress Image",
      description: "Reduce file size without leaving your browser.",
    },
    {
      href: "/tools/image/convert",
      title: "Convert Image",
      description: "Switch between PNG, JPG, WebP, and AVIF.",
    },
    {
      href: "/tools/image",
      title: "All Image Tools",
      description: "Explore compress, crop, convert, and more.",
    },
  ],
};

export const convertToolContent: ToolPageContent = {
  slug: "convert",
  category: "image",
  title: "Convert Image Format Online — Free, Private, No Upload | PrivyTool",
  description:
    "Convert JPG, PNG, WebP, and AVIF images in your browser. Fast, private, and free — your files never leave your device.",
  h1: "Convert Image",
  intro:
    "Switch image formats locally in your browser. Export to PNG, JPG, JPEG, WebP, or AVIF with live preview — no upload required.",
  keywords: [
    "convert image",
    "jpg to png",
    "png to jpg",
    "webp converter",
    "avif converter",
    "image format converter",
  ],
  howTo: [
    {
      name: "Upload your image",
      text: "Drag and drop a JPG, PNG, WebP, or AVIF file. It stays on your device.",
    },
    {
      name: "Choose output format",
      text: "Pick PNG, JPG, JPEG, WebP, or AVIF. Adjust quality for lossy formats.",
    },
    {
      name: "Download the converted file",
      text: "Preview the result, compare file size, then download.",
    },
  ],
  faqs: [
    {
      question: "Do you upload my images?",
      answer:
        "No. Conversion runs entirely in your browser using the Canvas API. Your files never leave your device.",
    },
    {
      question: "Which formats can I convert between?",
      answer:
        "You can convert between PNG, JPG/JPEG, WebP, and AVIF (where your browser supports encoding). Upload common formats like JPG, PNG, and WebP.",
    },
    {
      question: "What happens to transparency when converting to JPG?",
      answer:
        "JPG does not support transparency. PrivyTool flattens transparent areas onto a white background when exporting to JPG or JPEG.",
    },
    {
      question: "Is PrivyTool free?",
      answer:
        "Yes. Basic image tools are free. Optional premium features may arrive later as traffic grows.",
    },
  ],
  related: [
    {
      href: "/tools/image/compress",
      title: "Compress Image",
      description: "Reduce file size without leaving your browser.",
    },
    {
      href: "/tools/image/resize",
      title: "Resize Image",
      description: "Change dimensions with fit, fill, and optional compression.",
    },
    {
      href: "/tools/image",
      title: "All Image Tools",
      description: "Browse the full privacy-first image toolkit.",
    },
  ],
};
