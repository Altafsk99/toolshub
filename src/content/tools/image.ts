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

export const cropToolContent: ToolPageContent = {
  slug: "crop",
  category: "image",
  title: "Crop Image Online — Free, Private, No Upload | PrivyTool",
  description:
    "Crop images to square, circle, or social aspect ratios in your browser. Free, private, and fast — no upload required.",
  h1: "Crop Image",
  intro:
    "Trim photos locally with square, circle, wide, or story aspect ratios. Focal sliders and live preview — nothing leaves your device.",
  keywords: [
    "crop image",
    "crop image online",
    "square crop",
    "circle crop image",
    "crop photo free",
  ],
  howTo: [
    {
      name: "Upload your image",
      text: "Drop a JPG, PNG, or WebP file from your device.",
    },
    {
      name: "Pick aspect and shape",
      text: "Choose square, 16:9, 9:16 story, or circle. Adjust horizontal and vertical focus.",
    },
    {
      name: "Download",
      text: "Preview the cropped result, then save it locally.",
    },
  ],
  faqs: [
    {
      question: "Do you upload my images?",
      answer:
        "No. Cropping runs entirely in your browser using the Canvas API. Your files never leave your device.",
    },
    {
      question: "Can I crop to a circle?",
      answer:
        "Yes. Choose Circle shape — the export is PNG with a transparent background outside the circle.",
    },
    {
      question: "Which aspect ratios are supported?",
      answer:
        "Square (1:1), 4:3, 3:4 portrait, 16:9 wide, 9:16 story, 3:2 photo, 2:3 portrait, and free crop.",
    },
    {
      question: "Is PrivyTool free?",
      answer:
        "Yes. Basic image tools are free. Optional premium features may arrive later as traffic grows.",
    },
  ],
  related: [
    {
      href: "/tools/image/resize",
      title: "Resize Image",
      description: "Set exact pixel dimensions after cropping.",
    },
    {
      href: "/tools/image/compress",
      title: "Compress Image",
      description: "Shrink file size without leaving your browser.",
    },
    {
      href: "/tools/image",
      title: "All Image Tools",
      description: "Browse the full privacy-first image toolkit.",
    },
  ],
};

export const rotateToolContent: ToolPageContent = {
  slug: "rotate",
  category: "image",
  title: "Rotate Image Online — Free, Private, No Upload | PrivyTool",
  description:
    "Rotate JPG, PNG, or WebP photos in your browser. 90°, 180°, or custom angles — free and private on PrivyTool.",
  h1: "Rotate Image",
  intro:
    "Turn photos clockwise or counter-clockwise without uploading. PrivyTool rotates locally in your browser — your files never leave your device.",
  keywords: ["rotate image", "rotate image online", "rotate photo 90 degrees", "flip and rotate image"],
  howTo: [
    { name: "Upload your image", text: "Drop a JPG, PNG, or WebP file from your device." },
    { name: "Pick an angle", text: "Use quick 90° or 180° buttons, or set a custom angle." },
    { name: "Choose background", text: "Pick white, black, or transparent for empty corners at custom angles." },
    { name: "Download", text: "Preview updates live — download when it looks right." },
  ],
  faqs: [
    {
      question: "Do you upload my images?",
      answer:
        "No. Rotation runs entirely in your browser using the Canvas API. Your files never leave your device.",
    },
    {
      question: "Can I rotate by a custom angle?",
      answer: "Yes. Use the angle slider for any value from -180° to 180°.",
    },
    {
      question: "Will rotating change image quality?",
      answer:
        "PrivyTool re-encodes the output in your chosen format. PNG stays lossless; JPG/WebP use the quality slider.",
    },
    {
      question: "Is PrivyTool free?",
      answer:
        "Yes. Basic image tools are free. Optional premium features may arrive later as traffic grows.",
    },
  ],
  related: [
    {
      href: "/tools/image/flip",
      title: "Flip Image",
      description: "Mirror photos horizontally or vertically.",
    },
    {
      href: "/tools/image/crop",
      title: "Crop Image",
      description: "Trim to square, circle, or social aspect ratios.",
    },
    {
      href: "/tools/image",
      title: "All Image Tools",
      description: "Browse the full privacy-first image toolkit.",
    },
  ],
};

export const flipToolContent: ToolPageContent = {
  slug: "flip",
  category: "image",
  title: "Flip Image Online — Free, Private, No Upload | PrivyTool",
  description:
    "Flip images horizontally or vertically in your browser. Free, private mirror tool — no upload required.",
  h1: "Flip Image",
  intro:
    "Mirror photos left-to-right or top-to-bottom locally. PrivyTool flips in your browser — nothing is sent to a server.",
  keywords: ["flip image", "flip image horizontally", "mirror image online", "flip photo vertical"],
  howTo: [
    { name: "Upload your image", text: "Drop a JPG, PNG, or WebP file from your device." },
    { name: "Choose direction", text: "Select horizontal (mirror) or vertical flip." },
    { name: "Download", text: "Preview updates live — download when it looks right." },
  ],

  faqs: [
    {
      question: "Do you upload my images?",
      answer:
        "No. Flipping runs entirely in your browser using the Canvas API. Your files never leave your device.",
    },
    {
      question: "What's the difference between horizontal and vertical flip?",
      answer:
        "Horizontal flip mirrors left-to-right (like a selfie camera). Vertical flip mirrors top-to-bottom.",
    },
    {
      question: "Can I flip and then rotate?",
      answer: "Yes. Flip here, download, then open the result in Rotate — or vice versa.",
    },
    {
      question: "Is PrivyTool free?",
      answer:
        "Yes. Basic image tools are free. Optional premium features may arrive later as traffic grows.",
    },
  ],
  related: [
    {
      href: "/tools/image/rotate",
      title: "Rotate Image",
      description: "Turn photos 90°, 180°, or any custom angle.",
    },
    {
      href: "/tools/image/crop",
      title: "Crop Image",
      description: "Trim to square, circle, or social aspect ratios.",
    },
    {
      href: "/tools/image",
      title: "All Image Tools",
      description: "Browse the full privacy-first image toolkit.",
    },
  ],
};

export const scanToolContent: ToolPageContent = {
  slug: "scan",
  category: "image",
  title: "Scan Document Online — Free Camera Scanner, No Upload | PrivyTool",
  description:
    "Scan documents from your camera or photo in the browser. Straighten, enhance, and export multi-page PDF — private, no upload.",
  h1: "Scan Document",
  intro:
    "Turn a phone photo into a clean scanned page. Drag four corners to straighten, apply Enhance or B&W, then download an image or multi-page PDF — all in your browser.",
  keywords: [
    "scan document online",
    "camera document scanner",
    "cam scanner online",
    "photo to pdf scanner",
    "document scanner no upload",
  ],
  howTo: [
    {
      name: "Add a photo",
      text: "Upload an image or use your camera. The file stays on your device.",
    },
    {
      name: "Frame the page",
      text: "Drag the four corner handles to match the document edges. Pick Enhance, Gray, or B&W.",
    },
    {
      name: "Add pages and export",
      text: "Tap Add page for each sheet, then download the last image or a combined PDF.",
    },
  ],
  faqs: [
    {
      question: "Do you upload my scans?",
      answer:
        "No. Scanning, filters, and PDF export run entirely in your browser. Nothing is sent to a server.",
    },
    {
      question: "Is this like CamScanner?",
      answer:
        "It covers the core flow: capture, straighten with corners, document filters, and multi-page PDF. Auto edge detection is not included yet.",
    },
    {
      question: "Can I scan multiple pages?",
      answer:
        "Yes. Apply Add page for each photo, then Download PDF to combine them.",
    },
    {
      question: "Is PrivyTool free?",
      answer: "Yes. Basic image tools are free with no account required.",
    },
  ],
  related: [
    {
      href: "/tools/pdf/images-to-pdf",
      title: "Images to PDF",
      description: "Convert existing images into a PDF.",
    },
    {
      href: "/tools/image/crop",
      title: "Crop Image",
      description: "Trim photos to exact aspect ratios.",
    },
    {
      href: "/tools/pdf/compress",
      title: "Compress PDF",
      description: "Shrink PDF file size after scanning.",
    },
    {
      href: "/tools/image",
      title: "All Image Tools",
      description: "Browse the full privacy-first image toolkit.",
    },
  ],
};
