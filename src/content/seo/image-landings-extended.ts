import { privacyFaqs } from "@/lib/seo/landing-helpers";
import type { SeoLandingPage } from "@/types/seo";

function compressKbLanding(kb: number): SeoLandingPage {
  return {
    slug: `compress-to-${kb}kb`,
    category: "image",
    title: `Compress Image to ${kb}KB Online — Free, No Upload | PrivyTool`,
    description: `Compress JPG or PNG to ${kb} KB in your browser. Free, private, and fast — no upload required.`,
    h1: `Compress Image to ${kb}KB`,
    intro: `Need a ${kb} KB file for forms, portals, or uploads? PrivyTool targets ${kb} KB locally — your image never leaves your device.`,
    keywords: [`compress image to ${kb}kb`, `${kb}kb image compressor`, `reduce image to ${kb}kb`],
    preset: { tool: "compress", mode: "target", targetKb: kb, formatId: "jpg" },
    parentHref: "/tools/image/compress",
    howTo: [
      { name: "Upload your image", text: "Drop a JPG, PNG, or WebP file from your device." },
      {
        name: `Target ${kb} KB`,
        text: `Target size is pre-set to ${kb} KB. Adjust export format if needed.`,
      },
      { name: "Download", text: "Preview the compressed size, then download the result." },
    ],
    faqs: privacyFaqs([
      {
        question: `Why ${kb} KB?`,
        answer: `Many portals and forms cap uploads near ${kb} KB. PrivyTool binary-searches quality to hit your target as closely as possible.`,
      },
    ]),
    related: [],
  };
}

const extraCompressKb = [10, 15, 25, 30, 40, 60, 75, 80, 90, 120, 150, 250, 300, 500].map(
  compressKbLanding,
);

const extraResizeLandings: SeoLandingPage[] = [
  {
    slug: "resize-for-twitter",
    category: "image",
    title: "Twitter / X Header Size — 1500×500 Resizer | PrivyTool",
    description:
      "Resize images to Twitter / X header size 1500×500 in your browser. Free, private — no upload.",
    h1: "Twitter / X Header Size",
    intro:
      "X (Twitter) profile headers display at 1500×500 pixels. Resize on-device before updating your profile.",
    keywords: ["twitter header size", "x header size", "1500x500 twitter banner"],
    preset: { tool: "resize", width: 1500, height: 500, fit: "cover" },
    parentHref: "/tools/image/resize",
    howTo: [
      { name: "Upload banner", text: "Use a wide image from your device." },
      { name: "1500 × 500", text: "Twitter / X header dimensions are pre-applied." },
      { name: "Download", text: "Upload the result to your X profile." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "resize-for-pinterest",
    category: "image",
    title: "Pinterest Pin Size — 1000×1500 Resizer | PrivyTool",
    description:
      "Resize images to Pinterest pin size 1000×1500 in your browser. Free, private — no upload.",
    h1: "Pinterest Pin Size",
    intro:
      "Vertical 2:3 pins perform well on Pinterest. Resize to 1000×1500 locally before you pin.",
    keywords: ["pinterest pin size", "1000x1500 pinterest", "resize for pinterest"],
    preset: { tool: "resize", width: 1000, height: 1500, fit: "cover" },
    parentHref: "/tools/image/resize",
    howTo: [
      { name: "Upload image", text: "Choose a vertical or crop-friendly photo." },
      { name: "1000 × 1500", text: "Standard Pinterest pin ratio is pre-applied." },
      { name: "Download", text: "Save and upload to Pinterest." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "resize-for-tiktok",
    category: "image",
    title: "TikTok Cover Size — 1080×1920 Resizer | PrivyTool",
    description:
      "Resize images to TikTok vertical cover size 1080×1920 in your browser. Free and private.",
    h1: "TikTok Cover Size",
    intro:
      "TikTok covers and story-style graphics use 9:16 (1080×1920). Resize locally — nothing is uploaded.",
    keywords: ["tiktok cover size", "1080x1920 tiktok", "resize for tiktok"],
    preset: { tool: "resize", width: 1080, height: 1920, fit: "cover" },
    parentHref: "/tools/image/resize",
    howTo: [
      { name: "Upload photo", text: "Add a portrait or vertical design." },
      { name: "1080 × 1920", text: "9:16 TikTok dimensions are pre-set." },
      { name: "Download", text: "Use as your TikTok cover or thumbnail." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "resize-for-instagram-story",
    category: "image",
    title: "Instagram Story Size — 1080×1920 Resizer | PrivyTool",
    description:
      "Resize photos for Instagram Stories (1080×1920) in your browser. Free, private — no upload.",
    h1: "Instagram Story Size",
    intro:
      "Stories use 1080×1920 (9:16). Resize in your browser before posting — your file stays on-device.",
    keywords: ["instagram story size", "1080x1920 instagram story", "resize instagram story"],
    preset: { tool: "resize", width: 1080, height: 1920, fit: "cover" },
    parentHref: "/tools/image/resize",
    howTo: [
      { name: "Upload photo", text: "Choose a vertical image from your device." },
      { name: "1080 × 1920", text: "Story dimensions are pre-applied with crop-to-fill." },
      { name: "Download & post", text: "Save and share to Instagram Stories." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
];

const extraConvertLandings: SeoLandingPage[] = [
  {
    slug: "webp-to-jpg",
    category: "image",
    title: "WebP to JPG Converter — Free, Private, No Upload | PrivyTool",
    description:
      "Convert WebP to JPG in your browser. Universal compatibility — free and private on PrivyTool.",
    h1: "WebP to JPG",
    intro:
      "Some apps still expect JPG. Convert WebP to JPG locally — transparent areas flatten to white.",
    keywords: ["webp to jpg", "convert webp to jpeg", "webp jpg converter"],
    preset: { tool: "convert", exportFormatId: "jpg", qualityPercent: 90 },
    parentHref: "/tools/image/convert",
    howTo: [
      { name: "Upload WebP", text: "Drop your WebP file — it stays on your device." },
      { name: "JPG output", text: "Export format is set to JPG with quality compression." },
      { name: "Download JPG", text: "Save the converted file." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "webp-to-png",
    category: "image",
    title: "WebP to PNG Converter — Free, Private, No Upload | PrivyTool",
    description:
      "Convert WebP to PNG in your browser. Lossless output with transparency — free on PrivyTool.",
    h1: "WebP to PNG",
    intro: "Need PNG for editing? Convert WebP to PNG locally without uploading.",
    keywords: ["webp to png", "convert webp to png online"],
    preset: { tool: "convert", exportFormatId: "png" },
    parentHref: "/tools/image/convert",
    howTo: [
      { name: "Upload WebP", text: "Select a WebP from your device." },
      { name: "PNG output", text: "PNG is pre-selected as the export format." },
      { name: "Download PNG", text: "Save the converted PNG." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "jpg-to-avif",
    category: "image",
    title: "JPG to AVIF Converter — Free, Private, No Upload | PrivyTool",
    description:
      "Convert JPG to AVIF in your browser. Next-gen compression — free and private on PrivyTool.",
    h1: "JPG to AVIF",
    intro:
      "AVIF often beats JPG on file size. Convert locally if your browser supports AVIF export.",
    keywords: ["jpg to avif", "convert jpeg to avif", "avif converter online"],
    preset: { tool: "convert", exportFormatId: "avif", qualityPercent: 80 },
    parentHref: "/tools/image/convert",
    howTo: [
      { name: "Add JPG", text: "Upload your JPEG file locally." },
      { name: "AVIF selected", text: "Output format is AVIF with quality compression." },
      { name: "Download AVIF", text: "Save the smaller AVIF file." },
    ],
    faqs: privacyFaqs([
      {
        question: "Will AVIF work everywhere?",
        answer:
          "AVIF is supported in modern browsers. If export fails, use WebP or JPG instead.",
      },
    ]),
    related: [],
  },
  {
    slug: "png-to-avif",
    category: "image",
    title: "PNG to AVIF Converter — Free, Private, No Upload | PrivyTool",
    description:
      "Convert PNG to AVIF in your browser. Smaller files with transparency — free on PrivyTool.",
    h1: "PNG to AVIF",
    intro:
      "AVIF supports transparency like PNG but often produces much smaller files. Convert on-device.",
    keywords: ["png to avif", "convert png to avif online"],
    preset: { tool: "convert", exportFormatId: "avif", qualityPercent: 85 },
    parentHref: "/tools/image/convert",
    howTo: [
      { name: "Upload PNG", text: "Drop a PNG with or without transparency." },
      { name: "AVIF output", text: "AVIF is pre-selected with quality compression." },
      { name: "Download", text: "Save the AVIF file." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "avif-to-jpg",
    category: "image",
    title: "AVIF to JPG Converter — Free, Private, No Upload | PrivyTool",
    description:
      "Convert AVIF to JPG in your browser. Universal JPG output — free and private on PrivyTool.",
    h1: "AVIF to JPG",
    intro:
      "Open AVIF photos as JPG for apps that do not support AVIF yet. Convert locally — no upload.",
    keywords: ["avif to jpg", "convert avif to jpeg", "avif jpg converter"],
    preset: { tool: "convert", exportFormatId: "jpg", qualityPercent: 90 },
    parentHref: "/tools/image/convert",
    howTo: [
      { name: "Upload AVIF", text: "Select an AVIF file from your device." },
      { name: "JPG output", text: "JPG is pre-selected as the export format." },
      { name: "Download JPG", text: "Save the converted JPEG." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "avif-to-png",
    category: "image",
    title: "AVIF to PNG Converter — Free, Private, No Upload | PrivyTool",
    description:
      "Convert AVIF to PNG in your browser. Lossless PNG output — free and private on PrivyTool.",
    h1: "AVIF to PNG",
    intro: "Need PNG for editing workflows? Convert AVIF to PNG locally without uploading.",
    keywords: ["avif to png", "convert avif to png online"],
    preset: { tool: "convert", exportFormatId: "png" },
    parentHref: "/tools/image/convert",
    howTo: [
      { name: "Upload AVIF", text: "Drop your AVIF file — it stays local." },
      { name: "PNG output", text: "PNG is pre-selected as the export format." },
      { name: "Download PNG", text: "Save the converted PNG." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
];

const cropLandings: SeoLandingPage[] = [
  {
    slug: "crop-to-square",
    category: "image",
    title: "Crop Image to Square — Free, Private, No Upload | PrivyTool",
    description:
      "Crop photos to a perfect 1:1 square in your browser. Free, private — no upload required.",
    h1: "Crop to Square",
    intro:
      "Square crops work for profile photos, listings, and social posts. Trim locally with live preview.",
    keywords: ["crop image to square", "square crop online", "1:1 crop photo"],
    preset: { tool: "crop", aspect: "1:1", shape: "rect" },
    parentHref: "/tools/image/crop",
    howTo: [
      { name: "Upload image", text: "Drop a JPG, PNG, or WebP from your device." },
      { name: "Square 1:1", text: "Aspect ratio is pre-set to square. Adjust focus sliders." },
      { name: "Download", text: "Save the square crop." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "crop-circle",
    category: "image",
    title: "Circle Crop Image — Free, Private, No Upload | PrivyTool",
    description:
      "Crop images to a circle with transparent background in your browser. Free on PrivyTool.",
    h1: "Circle Crop",
    intro:
      "Perfect for avatars and badges. Circle crop exports PNG with transparency — processed on-device.",
    keywords: ["circle crop image", "round crop photo online", "circular avatar crop"],
    preset: { tool: "crop", aspect: "1:1", shape: "circle" },
    parentHref: "/tools/image/crop",
    howTo: [
      { name: "Upload portrait", text: "Choose a clear photo from your device." },
      { name: "Circle shape", text: "Square aspect with circle mask is pre-applied." },
      { name: "Download PNG", text: "Save the circular PNG with transparency." },
    ],
    faqs: privacyFaqs([
      {
        question: "Why PNG for circle crops?",
        answer: "PNG supports transparency outside the circle. JPG cannot preserve the round edge.",
      },
    ]),
    related: [],
  },
  {
    slug: "crop-16-9",
    category: "image",
    title: "Crop Image to 16:9 — Free, Private, No Upload | PrivyTool",
    description:
      "Crop photos to widescreen 16:9 in your browser. Free, private — no upload required.",
    h1: "Crop to 16:9",
    intro:
      "16:9 is the standard widescreen ratio for video thumbnails and presentations. Crop locally with focus sliders.",
    keywords: ["crop 16:9", "widescreen crop online", "16:9 photo crop"],
    preset: { tool: "crop", aspect: "16:9", shape: "rect" },
    parentHref: "/tools/image/crop",
    howTo: [
      { name: "Upload image", text: "Add any photo from your device." },
      { name: "16:9 aspect", text: "Widescreen ratio is pre-applied. Pan with focus sliders." },
      { name: "Download", text: "Save the 16:9 crop." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "crop-9-16",
    category: "image",
    title: "Crop Image to 9:16 Story — Free, No Upload | PrivyTool",
    description:
      "Crop photos to vertical 9:16 story ratio in your browser. Free and private on PrivyTool.",
    h1: "Crop to 9:16 Story",
    intro:
      "Stories, Reels, and TikTok use 9:16 vertical video. Crop to story ratio before you post.",
    keywords: ["crop 9:16", "story crop online", "vertical crop photo"],
    preset: { tool: "crop", aspect: "9:16", shape: "rect" },
    parentHref: "/tools/image/crop",
    howTo: [
      { name: "Upload photo", text: "Use a portrait-friendly image from your device." },
      { name: "9:16 preset", text: "Vertical story ratio is pre-applied." },
      { name: "Download", text: "Save and use in Stories or Reels." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "crop-for-instagram",
    category: "image",
    title: "Crop for Instagram — Square 1:1 | PrivyTool",
    description:
      "Crop photos for Instagram feed posts (1:1 square) in your browser. Free, private — no upload.",
    h1: "Crop for Instagram",
    intro:
      "Square crops fit Instagram feed posts cleanly. Trim on-device before you upload to Instagram.",
    keywords: ["crop for instagram", "instagram square crop", "instagram photo crop"],
    preset: { tool: "crop", aspect: "1:1", shape: "rect" },
    parentHref: "/tools/image/crop",
    howTo: [
      { name: "Upload photo", text: "Choose the image you want to post." },
      { name: "Square crop", text: "1:1 Instagram feed ratio is pre-set." },
      { name: "Download & post", text: "Save and upload to Instagram." },
    ],
    faqs: privacyFaqs([
      {
        question: "What about Instagram Stories?",
        answer: "Stories use 9:16. Try our Crop to 9:16 Story page or the Resize tool.",
      },
    ]),
    related: [],
  },
  {
    slug: "crop-profile-photo",
    category: "image",
    title: "Crop Profile Photo — Square or Circle | PrivyTool",
    description:
      "Crop profile photos to square or circle in your browser. Free, private — no upload.",
    h1: "Crop Profile Photo",
    intro:
      "Headshots and avatars look best as a centered square or circle crop. Adjust focus, then download.",
    keywords: ["crop profile photo", "avatar crop online", "profile picture crop"],
    preset: { tool: "crop", aspect: "1:1", shape: "circle", focusX: 0.5, focusY: 0.4 },
    parentHref: "/tools/image/crop",
    howTo: [
      { name: "Upload headshot", text: "Use a clear portrait from your device." },
      { name: "Circle avatar", text: "Circle crop with centered focus is pre-applied." },
      { name: "Download PNG", text: "Save your new profile photo." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
];

/** Additional programmatic SEO pages (Phase 2 scale) */
export const extendedSeoLandingPages: SeoLandingPage[] = [
  ...extraCompressKb,
  ...extraResizeLandings,
  ...extraConvertLandings,
  ...cropLandings,
];

/** Related-link map for extended pages */
export const extendedRelatedMap: Record<string, string[]> = {
  "compress-to-10kb": ["compress-to-20kb", "compress-to-50kb"],
  "compress-to-15kb": ["compress-to-20kb", "compress-to-50kb"],
  "compress-to-25kb": ["compress-to-20kb", "compress-to-50kb"],
  "compress-to-30kb": ["compress-to-50kb", "compress-to-100kb"],
  "compress-to-40kb": ["compress-to-50kb", "compress-to-100kb"],
  "compress-to-60kb": ["compress-to-50kb", "compress-to-100kb"],
  "compress-to-75kb": ["compress-to-100kb", "compress-for-whatsapp"],
  "compress-to-80kb": ["compress-to-100kb", "compress-for-whatsapp"],
  "compress-to-90kb": ["compress-to-100kb", "compress-for-whatsapp"],
  "compress-to-120kb": ["compress-to-100kb", "compress-for-whatsapp"],
  "compress-to-150kb": ["compress-to-100kb", "compress-to-200kb"],
  "compress-to-250kb": ["compress-to-200kb", "compress-jpg"],
  "compress-to-300kb": ["compress-to-200kb", "compress-jpg"],
  "compress-to-500kb": ["compress-to-200kb", "compress-jpg"],
  "resize-for-twitter": ["resize-for-linkedin", "resize-for-facebook"],
  "resize-for-pinterest": ["resize-for-instagram", "crop-9-16"],
  "resize-for-tiktok": ["resize-for-instagram-story", "crop-9-16"],
  "resize-for-instagram-story": ["resize-for-instagram", "crop-9-16"],
  "webp-to-jpg": ["jpg-to-webp", "compress-jpg"],
  "webp-to-png": ["png-to-webp", "jpg-to-png"],
  "jpg-to-avif": ["png-to-avif", "jpg-to-webp"],
  "png-to-avif": ["jpg-to-avif", "png-to-webp"],
  "avif-to-jpg": ["jpg-to-avif", "webp-to-jpg"],
  "avif-to-png": ["png-to-avif", "webp-to-png"],
  "crop-to-square": ["crop-for-instagram", "crop-profile-photo"],
  "crop-circle": ["crop-profile-photo", "crop-to-square"],
  "crop-16-9": ["resize-for-youtube-thumbnail", "crop-9-16"],
  "crop-9-16": ["resize-for-instagram-story", "resize-for-tiktok"],
  "crop-for-instagram": ["resize-for-instagram", "crop-to-square"],
  "crop-profile-photo": ["crop-circle", "crop-to-square"],
};

export const extendedFeaturedSlugs = [
  "crop-to-square",
  "crop-circle",
  "compress-to-30kb",
  "webp-to-jpg",
  "resize-for-instagram-story",
] as const;
