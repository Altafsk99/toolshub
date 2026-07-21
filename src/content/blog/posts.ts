import type { BlogPost } from "@/types/blog";

export const blogPosts: BlogPost[] = [
  {
    slug: "compress-image-to-50kb-for-forms",
    title: "How to Compress an Image to 50KB for Online Forms",
    description:
      "Many government and job portals reject photos over 50KB. Learn how to hit that limit in your browser without uploading files to a server.",
    publishedAt: "2026-07-14",
    dateLabel: "July 14, 2026",
    keywords: [
      "compress image to 50kb",
      "reduce image size for form",
      "50kb photo online",
    ],
    related: [
      { href: "/tools/image/compress-to-50kb", label: "Compress to 50KB" },
      { href: "/tools/image/compress", label: "Compress Image" },
      { href: "/tools/image/compress-for-whatsapp", label: "Compress for WhatsApp" },
    ],
    blocks: [
      {
        type: "p",
        text: "Online forms often cap photo uploads at 20KB, 50KB, or 100KB. If your phone photo is several megabytes, the form rejects it — even when the picture looks fine. The fix is target-size compression, not endless trial-and-error with quality sliders.",
      },
      {
        type: "h2",
        text: "Why forms care about 50KB",
      },
      {
        type: "p",
        text: "Portals store millions of applications. Small file caps keep storage and bandwidth under control. A 50KB JPEG is usually enough for a headshot or ID-style photo on screen, as long as dimensions are reasonable (often under 1000px on the long edge).",
      },
      {
        type: "h2",
        text: "Steps in PrivyTool (no upload)",
      },
      {
        type: "ol",
        items: [
          "Open Compress to 50KB (or Compress Image and pick the 50KB preset).",
          "Drop your photo — processing stays in your browser.",
          "Wait for the live preview; check file size under the result.",
          "If needed, resize first (e.g. 800×800) then compress again.",
          "Download and attach the file to your form.",
        ],
      },
      {
        type: "callout",
        text: "PrivyTool never uploads your image to a server. Compression runs locally with Canvas APIs.",
      },
      {
        type: "h2",
        text: "Tips when 50KB is still too hard",
      },
      {
        type: "ul",
        items: [
          "Export as JPEG or WebP instead of PNG for photos.",
          "Crop away empty background before compressing.",
          "Lower dimensions first — a 4000px image fights every KB target.",
          "Avoid screenshots of screenshots; use the original photo.",
        ],
      },
      {
        type: "cta",
        href: "/tools/image/compress-to-50kb",
        label: "Compress image to 50KB",
        description: "Free, private, and ready for form uploads.",
      },
    ],
  },
  {
    slug: "passport-photo-size-requirements",
    title: "Passport Photo Size Requirements (India & US) — Resize Online",
    description:
      "Quick guide to common passport and visa photo sizes for India and the US, plus how to resize privately in your browser.",
    publishedAt: "2026-07-15",
    dateLabel: "July 15, 2026",
    keywords: [
      "passport photo size",
      "passport photo online",
      "india passport photo size",
      "us passport photo size",
    ],
    related: [
      { href: "/tools/image/resize-passport-photo", label: "Resize passport photo" },
      { href: "/tools/image/resize", label: "Resize Image" },
      { href: "/tools/image/compress-to-50kb", label: "Compress to 50KB" },
    ],
    blocks: [
      {
        type: "p",
        text: "Passport and visa portals reject photos that are the wrong pixel size, wrong aspect ratio, or too large in file size. Requirements change by country and by whether you apply online or at a booth — always confirm on the official site before you submit.",
      },
      {
        type: "h2",
        text: "Common sizes (verify before filing)",
      },
      {
        type: "ul",
        items: [
          "India (many online apps): often 2×2 inch prints or ~350×350 to 1000×1000 px square digital uploads — check your portal.",
          "United States passport: typically 2×2 inches; digital submissions may specify pixel ranges and a white/off-white background.",
          "Many portals also enforce a max file size (often 50–200KB).",
        ],
      },
      {
        type: "h2",
        text: "How to resize without uploading",
      },
      {
        type: "ol",
        items: [
          "Open the passport resize tool or Resize Image with a passport preset.",
          "Upload locally and lock aspect ratio if you need a square.",
          "Use Fit (no crop) or Crop to fill depending on headroom rules.",
          "Compress afterward if the portal has a KB limit.",
          "Download and keep a backup of the original photo.",
        ],
      },
      {
        type: "callout",
        text: "PrivyTool helps with dimensions and file size. Background rules, expression, and lighting still follow official photo guidelines.",
      },
      {
        type: "cta",
        href: "/tools/image/resize-passport-photo",
        label: "Resize passport photo",
        description: "Set common passport dimensions in your browser.",
      },
    ],
  },
  {
    slug: "jpg-vs-png-vs-webp",
    title: "JPG vs PNG vs WebP — When to Use Each Format",
    description:
      "A practical guide to choosing JPEG, PNG, or WebP for photos, screenshots, and web uploads — plus free browser conversion.",
    publishedAt: "2026-07-16",
    dateLabel: "July 16, 2026",
    keywords: [
      "jpg vs png",
      "png vs webp",
      "when to use webp",
      "convert image format",
    ],
    related: [
      { href: "/tools/image/png-to-jpg", label: "PNG to JPG" },
      { href: "/tools/image/jpg-to-webp", label: "JPG to WebP" },
      { href: "/tools/image/convert", label: "Convert Image" },
    ],
    blocks: [
      {
        type: "p",
        text: "Picking the wrong format is why a “simple” screenshot becomes a 4MB attachment. Here’s a short decision guide — then convert privately with PrivyTool.",
      },
      {
        type: "h2",
        text: "JPEG (JPG)",
      },
      {
        type: "ul",
        items: [
          "Best for photos and complex gradients.",
          "Lossy — smaller files, tiny quality tradeoffs.",
          "No true transparency.",
          "Default choice for forms, WhatsApp, and email photos.",
        ],
      },
      {
        type: "h2",
        text: "PNG",
      },
      {
        type: "ul",
        items: [
          "Best for logos, UI, screenshots with sharp text, and transparency.",
          "Lossless — files can get large for photos.",
          "Avoid PNG for large camera photos when size limits matter.",
        ],
      },
      {
        type: "h2",
        text: "WebP",
      },
      {
        type: "ul",
        items: [
          "Often smaller than JPEG/PNG at similar quality.",
          "Supports lossy, lossless, and transparency.",
          "Great for websites; check older portals still expect JPG/PNG.",
        ],
      },
      {
        type: "callout",
        text: "Rule of thumb: photos → JPEG or WebP. Logos/transparency → PNG or WebP. Strict old forms → JPEG.",
      },
      {
        type: "cta",
        href: "/tools/image/convert",
        label: "Convert image format",
        description: "JPG ↔ PNG ↔ WebP ↔ AVIF in your browser.",
      },
    ],
  },
  {
    slug: "browser-side-processing-vs-upload",
    title: "Why Browser-Side Image Tools Beat Upload Sites",
    description:
      "Upload-based compressors send your files to a server. Learn why client-side (in-browser) processing is faster for privacy and often just as capable.",
    publishedAt: "2026-07-17",
    dateLabel: "July 17, 2026",
    keywords: [
      "compress image without uploading",
      "browser image tools",
      "privacy image compressor",
    ],
    related: [
      { href: "/", label: "PrivyTool home" },
      { href: "/tools/image/compress", label: "Compress Image" },
      { href: "/privacy", label: "Privacy Policy" },
    ],
    blocks: [
      {
        type: "p",
        text: "Most “free online” image sites ask you to upload first. That means your photo travels to someone else’s server, sits in temporary storage, and depends on their retention policy. Browser-side tools flip that model: the file stays on your device.",
      },
      {
        type: "h2",
        text: "What “in the browser” means",
      },
      {
        type: "p",
        text: "Modern browsers can load images into memory, draw them on a Canvas, re-encode JPEG/WebP/PNG, and download the result — all without a file-upload API. PrivyTool uses that path for compress, resize, convert, crop, rotate, flip, and PDF tools.",
      },
      {
        type: "h2",
        text: "Benefits",
      },
      {
        type: "ul",
        items: [
          "Privacy — sensitive IDs, medical scans, and work docs never hit our servers.",
          "Speed — no wait for upload/download round-trips on large files.",
          "Works offline once the page is loaded (network not required for processing).",
          "Fewer “file expired” errors from temporary cloud buckets.",
        ],
      },
      {
        type: "h2",
        text: "Tradeoffs to know",
      },
      {
        type: "ul",
        items: [
          "Very large images depend on your device RAM.",
          "Format support follows your browser (AVIF varies).",
          "Batch server farms can still win for huge enterprise pipelines — not the typical personal use case.",
        ],
      },
      {
        type: "cta",
        href: "/tools/image/compress",
        label: "Try private compression",
        description: "Shrink images without uploading them.",
      },
    ],
  },
  {
    slug: "compress-image-for-whatsapp",
    title: "Compress an Image for WhatsApp Without Losing Too Much Quality",
    description:
      "WhatsApp recompresses media. Learn how to pre-compress photos so they send faster and still look sharp on phones.",
    publishedAt: "2026-07-18",
    dateLabel: "July 18, 2026",
    keywords: [
      "compress image for whatsapp",
      "reduce photo size whatsapp",
      "whatsapp image quality",
    ],
    related: [
      { href: "/tools/image/compress-for-whatsapp", label: "Compress for WhatsApp" },
      { href: "/tools/image/compress-to-100kb", label: "Compress to 100KB" },
      { href: "/tools/image/compress", label: "Compress Image" },
    ],
    blocks: [
      {
        type: "p",
        text: "WhatsApp applies its own compression when you send photos in a chat. Starting from a huge 8–12MP camera file can still look soft after WhatsApp’s pass. Pre-compressing to a sensible size often looks better and uploads faster on slow networks.",
      },
      {
        type: "h2",
        text: "Practical targets",
      },
      {
        type: "ul",
        items: [
          "Aim for roughly 100–300KB for typical chat photos.",
          "Keep the long edge around 1280–1600px unless you need more detail.",
          "Prefer JPEG or WebP over PNG for camera photos.",
        ],
      },
      {
        type: "h2",
        text: "Quick workflow",
      },
      {
        type: "ol",
        items: [
          "Open Compress for WhatsApp (or Compress Image with a 100KB preset).",
          "Drop the photo — preview updates live in your browser.",
          "Compare original vs result if you need sharper text in the frame.",
          "Download and send as a regular image (or Document if you need less WhatsApp recompression).",
        ],
      },
      {
        type: "callout",
        text: "Sending as a Document in WhatsApp can preserve more quality but uses more data. Use it for contracts and screenshots with fine text.",
      },
      {
        type: "cta",
        href: "/tools/image/compress-for-whatsapp",
        label: "Compress for WhatsApp",
        description: "Private compression tuned for chat sharing.",
      },
    ],
  },
  {
    slug: "best-free-image-tools-no-upload",
    title: "Best Free Image Tools That Don’t Upload Your Files",
    description:
      "Looking for online image tools that keep files on your device? Here’s how PrivyTool’s browser-based toolkit compares to upload-first sites.",
    publishedAt: "2026-07-19",
    dateLabel: "July 19, 2026",
    keywords: [
      "free image tools no upload",
      "private image editor online",
      "browser image compressor",
    ],
    related: [
      { href: "/tools/image", label: "Image Tools hub" },
      { href: "/tools/pdf", label: "PDF Tools hub" },
      { href: "/privacy", label: "Privacy Policy" },
    ],
    blocks: [
      {
        type: "p",
        text: "If your checklist is “free + works in the browser + no account + no upload,” most classic compressors fail the last point. PrivyTool is built around that checklist for everyday image and PDF jobs.",
      },
      {
        type: "h2",
        text: "What to look for",
      },
      {
        type: "ul",
        items: [
          "Clear privacy copy that processing is client-side.",
          "No forced signup for basic tools.",
          "Live preview before download.",
          "Useful export formats (JPEG, PNG, WebP, AVIF where supported).",
          "On-device history you can clear anytime.",
        ],
      },
      {
        type: "h2",
        text: "PrivyTool image toolkit",
      },
      {
        type: "ul",
        items: [
          "Compress — quality or target KB.",
          "Resize — presets, fit/crop, optional compress.",
          "Convert — JPG, PNG, WebP, AVIF.",
          "Crop, rotate, and flip with live preview.",
        ],
      },
      {
        type: "h2",
        text: "PDF tools too",
      },
      {
        type: "p",
        text: "The same privacy model applies to merge, split, rotate, and images-to-PDF — still in your browser, still no file upload server for processing.",
      },
      {
        type: "cta",
        href: "/tools/image",
        label: "Browse image tools",
        description: "Start with compress, resize, or convert.",
      },
    ],
  },
  {
    slug: "resize-image-for-instagram-2026",
    title: "How to Resize an Image for Instagram (2026 Sizes)",
    description:
      "Common Instagram feed, story, and profile sizes — and how to resize privately without uploading to a third-party server.",
    publishedAt: "2026-07-20",
    dateLabel: "July 20, 2026",
    keywords: [
      "instagram image size",
      "resize for instagram",
      "instagram post dimensions 2026",
    ],
    related: [
      { href: "/tools/image/resize-for-instagram", label: "Resize for Instagram" },
      { href: "/tools/image/crop", label: "Crop Image" },
      { href: "/tools/image/resize", label: "Resize Image" },
    ],
    blocks: [
      {
        type: "p",
        text: "Instagram crops aggressively. Preparing the right aspect ratio before you post avoids cut-off faces and soft upscales. Exact pixel specs shift over time — treat the numbers below as common starting points and check Instagram’s help docs for the latest.",
      },
      {
        type: "h2",
        text: "Common starting sizes",
      },
      {
        type: "ul",
        items: [
          "Feed square: 1080×1080 (1:1).",
          "Feed portrait: often 1080×1350 (4:5).",
          "Stories / Reels covers: commonly 1080×1920 (9:16).",
          "Profile photo: square; upload large and let Instagram scale.",
        ],
      },
      {
        type: "h2",
        text: "Resize workflow",
      },
      {
        type: "ol",
        items: [
          "Open Resize for Instagram or the general Resize tool.",
          "Pick a preset or set width/height with aspect lock.",
          "Use Crop to fill when you need an exact frame; Fit when you must keep the whole image.",
          "Optional: crop first for subject framing, then resize.",
          "Export JPEG/WebP and upload from your phone or desktop app.",
        ],
      },
      {
        type: "cta",
        href: "/tools/image/resize-for-instagram",
        label: "Resize for Instagram",
        description: "Private presets for common social sizes.",
      },
    ],
  },
  {
    slug: "avif-vs-webp-which-is-smaller",
    title: "AVIF vs WebP — Which Is Smaller for the Web?",
    description:
      "AVIF often wins on size; WebP wins on compatibility. Compare both and convert in your browser with PrivyTool.",
    publishedAt: "2026-07-21",
    dateLabel: "July 21, 2026",
    keywords: [
      "avif vs webp",
      "avif smaller than webp",
      "convert to avif",
      "convert to webp",
    ],
    related: [
      { href: "/tools/image/jpg-to-webp", label: "JPG to WebP" },
      { href: "/tools/image/convert", label: "Convert Image" },
      { href: "/tools/image/compress", label: "Compress Image" },
    ],
    blocks: [
      {
        type: "p",
        text: "For websites, smaller images mean faster Largest Contentful Paint. AVIF and WebP both beat classic JPEG in many cases — but they are not identical.",
      },
      {
        type: "h2",
        text: "Short comparison",
      },
      {
        type: "ul",
        items: [
          "AVIF — often the smallest at similar visual quality; encoding can be slower; support is strong in modern browsers but not universal everywhere.",
          "WebP — excellent size/quality balance; very wide browser support; great default for most sites.",
          "JPEG — still the safest for old portals, email clients, and strict upload validators.",
        ],
      },
      {
        type: "h2",
        text: "Practical recommendation",
      },
      {
        type: "ol",
        items: [
          "Use WebP (or AVIF + WebP fallbacks) for marketing sites.",
          "Keep JPEG for forms that reject modern formats.",
          "Always compare a real photo at your target quality — charts lie, eyes don’t.",
          "Compress after convert if you still need a KB cap.",
        ],
      },
      {
        type: "callout",
        text: "PrivyTool detects whether your browser can export AVIF. If AVIF isn’t available, pick WebP or JPEG instead.",
      },
      {
        type: "cta",
        href: "/tools/image/convert",
        label: "Convert to WebP or AVIF",
        description: "Try both formats locally and pick the smaller file.",
      },
    ],
  },
];
