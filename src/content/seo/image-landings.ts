import {
  hubLink,
  parentToolLink,
  privacyFaqs,
  relatedFromSlugs,
} from "@/lib/seo/landing-helpers";
import {
  batch3FeaturedSlugs,
  batch3RelatedMap,
  batch3SeoLandingPages,
} from "@/content/seo/image-landings-batch3";
import {
  extendedFeaturedSlugs,
  extendedRelatedMap,
  extendedSeoLandingPages,
} from "@/content/seo/image-landings-extended";
import {
  transformFeaturedSlugs,
  transformRelatedMap,
  transformSeoLandingPages,
} from "@/content/seo/image-landings-transform";
import type { SeoLandingPage } from "@/types/seo";

const compressLandings: SeoLandingPage[] = [
  {
    slug: "compress-to-20kb",
    category: "image",
    title: "Compress Image to 20KB Online — Free, No Upload | PrivyTool",
    description:
      "Compress JPG or PNG to 20 KB in your browser. Free, private, and fast — no upload required.",
    h1: "Compress Image to 20KB",
    intro:
      "Need a tiny file for forms or uploads? PrivyTool targets 20 KB locally in your browser — your image never leaves your device.",
    keywords: ["compress image to 20kb", "reduce image to 20kb", "20kb image compressor"],
    preset: { tool: "compress", mode: "target", targetKb: 20, formatId: "jpg" },
    parentHref: "/tools/image/compress",
    howTo: [
      { name: "Upload your image", text: "Drop a JPG, PNG, or WebP file from your device." },
      {
        name: "Target 20 KB",
        text: "Target size is pre-set to 20 KB. Adjust export format if needed.",
      },
      { name: "Download", text: "Preview the compressed size, then download the result." },
    ],
    faqs: privacyFaqs([
      {
        question: "Why 20 KB?",
        answer:
          "Many online forms and portals cap uploads at 20 KB. PrivyTool binary-searches quality to hit your target as closely as possible.",
      },
    ]),
    related: [],
  },
  {
    slug: "compress-to-50kb",
    category: "image",
    title: "Compress Image to 50KB Online — Free, No Upload | PrivyTool",
    description:
      "Compress images to 50 KB online without uploading. Free browser-based tool — private and fast.",
    h1: "Compress Image to 50KB",
    intro:
      "Hit the common 50 KB upload limit with one click. Processing runs on-device — no server upload.",
    keywords: ["compress image to 50kb", "50kb photo compressor", "reduce image size 50kb"],
    preset: { tool: "compress", mode: "target", targetKb: 50, formatId: "jpg" },
    parentHref: "/tools/image/compress",
    howTo: [
      { name: "Add your photo", text: "Drag and drop or browse for JPG, PNG, or WebP." },
      { name: "50 KB target applied", text: "The compressor targets 50 KB automatically." },
      { name: "Save the file", text: "Download when the preview meets your needs." },
    ],
    faqs: privacyFaqs([
      {
        question: "Will quality suffer at 50 KB?",
        answer:
          "Smaller targets mean more compression. JPG or WebP output usually works best for photos at this size.",
      },
    ]),
    related: [],
  },
  {
    slug: "compress-to-100kb",
    category: "image",
    title: "Compress Image to 100KB Online — Free, No Upload | PrivyTool",
    description:
      "Compress JPG or PNG to 100 KB in your browser. Free, private image compressor — no upload.",
    h1: "Compress Image to 100KB",
    intro:
      "100 KB is a common cap for job portals and ID uploads. Compress locally with PrivyTool — nothing is sent to a server.",
    keywords: ["compress image to 100kb", "100kb image compressor online"],
    preset: { tool: "compress", mode: "target", targetKb: 100, formatId: "jpg" },
    parentHref: "/tools/image/compress",
    howTo: [
      { name: "Upload locally", text: "Select an image from your device." },
      { name: "100 KB preset", text: "Target size is set to 100 KB out of the box." },
      { name: "Download", text: "Compare original vs compressed, then save." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "compress-to-200kb",
    category: "image",
    title: "Compress Image to 200KB Online — Free, No Upload | PrivyTool",
    description:
      "Reduce image file size to 200 KB in your browser. Free, fast, and private — no upload required.",
    h1: "Compress Image to 200KB",
    intro:
      "Shrink large photos toward 200 KB while keeping reasonable quality. All processing stays in your browser.",
    keywords: ["compress image to 200kb", "200kb photo size online"],
    preset: { tool: "compress", mode: "target", targetKb: 200, formatId: "jpg" },
    parentHref: "/tools/image/compress",
    howTo: [
      { name: "Choose a file", text: "Upload JPG, PNG, or WebP from your device." },
      { name: "200 KB target", text: "Compression targets 200 KB automatically." },
      { name: "Export", text: "Download the compressed image when ready." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "compress-jpg",
    category: "image",
    title: "Compress JPG Online — Free, Private, No Upload | PrivyTool",
    description:
      "Compress JPG and JPEG photos in your browser. Reduce file size without uploading — free on PrivyTool.",
    h1: "Compress JPG",
    intro:
      "Optimize JPG photos for web, email, or forms. PrivyTool compresses locally with adjustable quality — no upload.",
    keywords: ["compress jpg", "compress jpeg online", "reduce jpg file size"],
    preset: { tool: "compress", mode: "quality", qualityPercent: 70, formatId: "jpg" },
    parentHref: "/tools/image/compress",
    howTo: [
      { name: "Upload a JPG", text: "Drop your JPEG file or browse from your device." },
      { name: "Adjust quality", text: "Use the quality slider or switch to a KB target." },
      { name: "Download JPG", text: "Save the smaller JPG when the preview looks right." },
    ],
    faqs: privacyFaqs([
      {
        question: "JPG vs JPEG — is there a difference?",
        answer: "They are the same format. PrivyTool lets you export as .jpg or .jpeg.",
      },
    ]),
    related: [],
  },
  {
    slug: "compress-png",
    category: "image",
    title: "Compress PNG Online — Free, Private, No Upload | PrivyTool",
    description:
      "Compress PNG images in your browser without uploading. Free, private PNG optimizer on PrivyTool.",
    h1: "Compress PNG",
    intro:
      "PNG is lossless — for smaller files, export to JPG or WebP. Keep PNG when you need sharp edges and transparency.",
    keywords: ["compress png", "reduce png size", "png optimizer online"],
    preset: { tool: "compress", mode: "quality", qualityPercent: 90, formatId: "png" },
    parentHref: "/tools/image/compress",
    howTo: [
      { name: "Upload PNG", text: "Add a PNG from your device — it stays local." },
      {
        name: "Pick output format",
        text: "Stay on PNG for lossless, or switch to JPG/WebP for much smaller files.",
      },
      { name: "Download", text: "Save the optimized image." },
    ],
    faqs: privacyFaqs([
      {
        question: "Why is my PNG still large?",
        answer:
          "PNG does not use lossy quality. For photos, convert to JPG or WebP for dramatic size savings.",
      },
    ]),
    related: [],
  },
  {
    slug: "compress-webp",
    category: "image",
    title: "Compress WebP Online — Free, Private, No Upload | PrivyTool",
    description:
      "Compress WebP images in your browser. Modern format, smaller files — free and private on PrivyTool.",
    h1: "Compress WebP",
    intro:
      "WebP already saves space vs JPG. Tune quality further or target a specific KB — all in your browser.",
    keywords: ["compress webp", "webp compressor online", "reduce webp size"],
    preset: { tool: "compress", mode: "quality", qualityPercent: 80, formatId: "webp" },
    parentHref: "/tools/image/compress",
    howTo: [
      { name: "Add WebP file", text: "Upload from your device — no server transfer." },
      { name: "Set quality or KB", text: "WebP output is pre-selected with quality compression." },
      { name: "Download", text: "Save the compressed WebP." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "compress-for-whatsapp",
    category: "image",
    title: "Compress Image for WhatsApp — Free, No Upload | PrivyTool",
    description:
      "Compress photos for WhatsApp sharing in your browser. Smaller files, faster sends — private and free.",
    h1: "Compress Image for WhatsApp",
    intro:
      "Large photos slow down WhatsApp uploads. Compress to ~100 KB locally before sharing — your chat stays private.",
    keywords: [
      "compress image for whatsapp",
      "whatsapp image size reducer",
      "reduce photo size whatsapp",
    ],
    preset: { tool: "compress", mode: "target", targetKb: 100, formatId: "jpg" },
    parentHref: "/tools/image/compress",
    howTo: [
      { name: "Upload your photo", text: "Select the image you want to send on WhatsApp." },
      { name: "100 KB target", text: "A practical size for fast mobile sharing is pre-applied." },
      { name: "Share on WhatsApp", text: "Download, then attach the smaller file in WhatsApp." },
    ],
    faqs: privacyFaqs([
      {
        question: "What size works best for WhatsApp?",
        answer:
          "Under 100 KB sends quickly on slow networks. Raise the target if you need more detail.",
      },
    ]),
    related: [],
  },
];

const resizeLandings: SeoLandingPage[] = [
  {
    slug: "resize-passport-photo",
    category: "image",
    title: "Passport Photo Size Online — Free, No Upload | PrivyTool",
    description:
      "Resize to passport photo dimensions (3.5×4.5 cm / 413×531 px) in your browser. Free and private.",
    h1: "Passport Photo Size",
    intro:
      "Set your photo to standard passport dimensions at 300 DPI. Processing runs locally — no upload to any server.",
    keywords: ["passport photo size online", "413x531 passport photo", "passport photo resize"],
    preset: {
      tool: "resize",
      width: 413,
      height: 531,
      fit: "contain",
      fill: "white",
      lockAspect: false,
    },
    parentHref: "/tools/image/resize",
    howTo: [
      { name: "Upload portrait", text: "Use a clear head-and-shoulders photo from your device." },
      {
        name: "413 × 531 preset",
        text: "Standard 3.5×4.5 cm at 300 DPI is applied. Use Fit mode to avoid cropping faces.",
      },
      { name: "Download", text: "Save the resized passport photo." },
    ],
    faqs: privacyFaqs([
      {
        question: "Is 413×531 correct for all countries?",
        answer:
          "Many countries use 35×45 mm (413×531 px at 300 DPI). Check your country's official requirements before submitting.",
      },
    ]),
    related: [],
  },
  {
    slug: "resize-to-1080p",
    category: "image",
    title: "Resize Image to 1080p (1920×1080) — Free, No Upload | PrivyTool",
    description:
      "Resize images to 1920×1080 Full HD in your browser. Free, private resizer — no upload required.",
    h1: "Resize to 1080p",
    intro:
      "Scale photos and graphics to 1920×1080 for slides, thumbnails, or HD displays — processed entirely on-device.",
    keywords: ["resize image to 1080p", "1920x1080 image resizer", "full hd resize online"],
    preset: { tool: "resize", width: 1920, height: 1080, fit: "contain", fill: "black" },
    parentHref: "/tools/image/resize",
    howTo: [
      { name: "Upload image", text: "Add any JPG, PNG, or WebP from your device." },
      { name: "1920 × 1080 applied", text: "Full HD dimensions are pre-set. Choose fit or crop mode." },
      { name: "Download", text: "Save the resized 1080p image." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "resize-to-800x800",
    category: "image",
    title: "Resize Image to 800×800 — Free, No Upload | PrivyTool",
    description:
      "Resize images to 800×800 pixels in your browser. Square output for listings and avatars — free and private.",
    h1: "Resize to 800×800",
    intro:
      "800×800 is a common square size for product photos and profile images. Resize locally without uploading.",
    keywords: ["resize image 800x800", "800x800 photo online", "square image resize"],
    preset: { tool: "resize", width: 800, height: 800, fit: "cover" },
    parentHref: "/tools/image/resize",
    howTo: [
      { name: "Add your image", text: "Upload from your device." },
      { name: "800 × 800 square", text: "Crop to fill is pre-selected for a perfect square." },
      { name: "Download", text: "Save the square output." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "resize-for-instagram",
    category: "image",
    title: "Instagram Image Size — 1080×1080 Resizer | PrivyTool",
    description:
      "Resize photos for Instagram posts (1080×1080) in your browser. Free, private — no upload required.",
    h1: "Instagram Image Size",
    intro:
      "Square 1080×1080 works for Instagram feed posts. Resize in your browser before you post — nothing is uploaded.",
    keywords: ["instagram image size", "resize for instagram", "1080x1080 instagram"],
    preset: { tool: "resize", width: 1080, height: 1080, fit: "cover" },
    parentHref: "/tools/image/resize",
    howTo: [
      { name: "Upload photo", text: "Choose the image you want to post on Instagram." },
      { name: "1080 × 1080", text: "Square post size is pre-applied with crop-to-fill." },
      { name: "Download & post", text: "Save and upload to Instagram from your phone or desktop." },
    ],
    faqs: privacyFaqs([
      {
        question: "What about Instagram Stories?",
        answer: "Stories use 1080×1920 (9:16). Use the main Resize tool for custom story dimensions.",
      },
    ]),
    related: [],
  },
  {
    slug: "resize-for-youtube-thumbnail",
    category: "image",
    title: "YouTube Thumbnail Size — 1280×720 Resizer | PrivyTool",
    description:
      "Resize images to YouTube thumbnail size 1280×720 in your browser. Free, private — no upload.",
    h1: "YouTube Thumbnail Size",
    intro:
      "YouTube recommends 1280×720 (16:9) for custom thumbnails. Resize locally with PrivyTool before uploading to YouTube.",
    keywords: ["youtube thumbnail size", "1280x720 thumbnail", "resize youtube thumbnail"],
    preset: { tool: "resize", width: 1280, height: 720, fit: "cover" },
    parentHref: "/tools/image/resize",
    howTo: [
      { name: "Upload artwork", text: "Add your thumbnail design or photo." },
      { name: "1280 × 720", text: "Standard YouTube thumbnail dimensions are pre-set." },
      { name: "Download", text: "Save and upload to YouTube Studio." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "resize-for-linkedin",
    category: "image",
    title: "LinkedIn Banner Size — 1584×396 Resizer | PrivyTool",
    description:
      "Resize images to LinkedIn cover photo size 1584×396 in your browser. Free and private on PrivyTool.",
    h1: "LinkedIn Banner Size",
    intro:
      "LinkedIn profile banners display at 1584×396 pixels. Resize on-device before updating your profile.",
    keywords: ["linkedin banner size", "linkedin cover photo size", "1584x396 resize"],
    preset: { tool: "resize", width: 1584, height: 396, fit: "cover" },
    parentHref: "/tools/image/resize",
    howTo: [
      { name: "Upload banner", text: "Use a wide image from your device." },
      { name: "1584 × 396", text: "LinkedIn cover dimensions are pre-applied." },
      { name: "Download", text: "Upload the result to your LinkedIn profile." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "resize-for-facebook",
    category: "image",
    title: "Facebook Cover Photo Size — 820×312 Resizer | PrivyTool",
    description:
      "Resize to Facebook cover photo size 820×312 in your browser. Free, private image resizer.",
    h1: "Facebook Cover Photo Size",
    intro:
      "Facebook cover photos display at 820×312 on desktop. Resize locally — your image never leaves your browser.",
    keywords: ["facebook cover photo size", "820x312 cover photo", "facebook banner resize"],
    preset: { tool: "resize", width: 820, height: 312, fit: "cover" },
    parentHref: "/tools/image/resize",
    howTo: [
      { name: "Choose image", text: "Upload a wide photo or graphic." },
      { name: "820 × 312", text: "Facebook cover dimensions are pre-set." },
      { name: "Download", text: "Save and set as your Facebook cover." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "resize-percentage",
    category: "image",
    title: "Resize Image by Percentage — Free, No Upload | PrivyTool",
    description:
      "Scale images by percentage in your browser. Halve or double size — free, private resizer on PrivyTool.",
    h1: "Resize by Percentage",
    intro:
      "Scale relative to the original — 50% halves width and height. All math runs locally in your browser.",
    keywords: ["resize image by percentage", "scale image percent online", "50 percent resize"],
    preset: { tool: "resize", percent: 50, lockAspect: true },
    parentHref: "/tools/image/resize",
    howTo: [
      { name: "Upload image", text: "Add any image from your device." },
      { name: "50% scale preset", text: "Scale starts at 50% — drag the slider to adjust." },
      { name: "Download", text: "Save the scaled image." },
    ],
    faqs: privacyFaqs([
      {
        question: "Does 50% mean half the pixels?",
        answer: "Yes. 50% scales both width and height to half, so area becomes 25% of the original.",
      },
    ]),
    related: [],
  },
];

const convertLandings: SeoLandingPage[] = [
  {
    slug: "png-to-jpg",
    category: "image",
    title: "PNG to JPG Converter — Free, Private, No Upload | PrivyTool",
    description:
      "Convert PNG to JPG in your browser. Smaller files for photos — free, fast, and private on PrivyTool.",
    h1: "PNG to JPG",
    intro:
      "JPG is smaller for photos without transparency. Convert PNG to JPG locally — transparent areas flatten to white.",
    keywords: ["png to jpg", "convert png to jpeg online", "png jpg converter free"],
    preset: { tool: "convert", exportFormatId: "jpg", qualityPercent: 90 },
    parentHref: "/tools/image/convert",
    howTo: [
      { name: "Upload PNG", text: "Drop your PNG file — it stays on your device." },
      { name: "JPG output selected", text: "Export format is set to JPG. Adjust quality if needed." },
      { name: "Download JPG", text: "Save the converted file." },
    ],
    faqs: privacyFaqs([
      {
        question: "What happens to transparency?",
        answer: "JPG does not support transparency. PrivyTool flattens transparent pixels onto white.",
      },
    ]),
    related: [],
  },
  {
    slug: "jpg-to-png",
    category: "image",
    title: "JPG to PNG Converter — Free, Private, No Upload | PrivyTool",
    description:
      "Convert JPG to PNG in your browser. Lossless output for editing — free and private on PrivyTool.",
    h1: "JPG to PNG",
    intro:
      "Need PNG for transparency workflows or lossless editing? Convert JPG to PNG locally without uploading.",
    keywords: ["jpg to png", "jpeg to png converter", "convert jpg to png online"],
    preset: { tool: "convert", exportFormatId: "png" },
    parentHref: "/tools/image/convert",
    howTo: [
      { name: "Upload JPG", text: "Select a JPEG from your device." },
      { name: "PNG output", text: "PNG is pre-selected as the export format." },
      { name: "Download PNG", text: "Save the converted PNG." },
    ],
    faqs: privacyFaqs([
      {
        question: "Will converting JPG to PNG improve quality?",
        answer:
          "No — JPG compression artifacts remain. PNG prevents further loss and supports transparency for edits.",
      },
    ]),
    related: [],
  },
  {
    slug: "jpg-to-webp",
    category: "image",
    title: "JPG to WebP Converter — Free, Private, No Upload | PrivyTool",
    description:
      "Convert JPG to WebP in your browser. Modern format, smaller files — free on PrivyTool.",
    h1: "JPG to WebP",
    intro:
      "WebP often beats JPG on file size at similar quality. Convert locally for web performance — no upload.",
    keywords: ["jpg to webp", "convert jpeg to webp", "webp converter online"],
    preset: { tool: "convert", exportFormatId: "webp", qualityPercent: 85 },
    parentHref: "/tools/image/convert",
    howTo: [
      { name: "Add JPG", text: "Upload your JPEG file locally." },
      { name: "WebP selected", text: "Output format is WebP with quality compression." },
      { name: "Download WebP", text: "Save the smaller WebP file." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "png-to-webp",
    category: "image",
    title: "PNG to WebP Converter — Free, Private, No Upload | PrivyTool",
    description:
      "Convert PNG to WebP in your browser. Keep transparency with smaller files — free on PrivyTool.",
    h1: "PNG to WebP",
    intro:
      "WebP supports transparency like PNG but often produces much smaller files. Convert on-device — no server upload.",
    keywords: ["png to webp", "convert png to webp online", "webp transparency converter"],
    preset: { tool: "convert", exportFormatId: "webp", qualityPercent: 90 },
    parentHref: "/tools/image/convert",
    howTo: [
      { name: "Upload PNG", text: "Drop a PNG with or without transparency." },
      { name: "WebP output", text: "WebP is pre-selected. Transparency is preserved." },
      { name: "Download", text: "Save the WebP file." },
    ],
    faqs: privacyFaqs([
      {
        question: "Does WebP keep transparency?",
        answer: "Yes. WebP supports alpha like PNG, usually at a fraction of the file size.",
      },
    ]),
    related: [],
  },
];

/** All programmatic SEO landing pages */
export const seoLandingPages: SeoLandingPage[] = [
  ...compressLandings,
  ...resizeLandings,
  ...convertLandings,
  ...extendedSeoLandingPages,
  ...transformSeoLandingPages,
  ...batch3SeoLandingPages,
];

const bySlug = new Map(seoLandingPages.map((page) => [page.slug, page]));

/** Wire related-tool links after all pages are defined */
function withRelated(page: SeoLandingPage, relatedSlugs: string[]): SeoLandingPage {
  return {
    ...page,
    related: [
      parentToolLink(page.preset.tool),
      ...relatedFromSlugs(relatedSlugs, bySlug),
      hubLink(),
    ],
  };
}

export const seoLandingPagesWithRelated: SeoLandingPage[] = seoLandingPages.map((page) => {
  const relatedMap: Record<string, string[]> = {
    "compress-to-20kb": ["compress-to-50kb", "compress-for-whatsapp"],
    "compress-to-50kb": ["compress-to-100kb", "compress-jpg"],
    "compress-to-100kb": ["compress-to-50kb", "compress-for-whatsapp"],
    "compress-to-200kb": ["compress-to-100kb", "compress-jpg"],
    "compress-jpg": ["compress-webp", "compress-to-50kb"],
    "compress-png": ["png-to-jpg", "png-to-webp"],
    "compress-webp": ["jpg-to-webp", "compress-jpg"],
    "compress-for-whatsapp": ["compress-to-50kb", "compress-to-100kb"],
    "resize-passport-photo": ["resize-to-800x800", "compress-to-50kb"],
    "resize-to-1080p": ["resize-for-youtube-thumbnail", "compress-jpg"],
    "resize-to-800x800": ["resize-for-instagram", "compress-jpg"],
    "resize-for-instagram": ["resize-for-youtube-thumbnail", "compress-for-whatsapp"],
    "resize-for-youtube-thumbnail": ["resize-to-1080p", "compress-jpg"],
    "resize-for-linkedin": ["resize-for-facebook", "compress-to-100kb"],
    "resize-for-facebook": ["resize-for-linkedin", "compress-to-100kb"],
    "resize-percentage": ["resize-to-800x800", "compress-jpg"],
    "png-to-jpg": ["jpg-to-png", "compress-jpg"],
    "jpg-to-png": ["png-to-jpg", "png-to-webp"],
    "jpg-to-webp": ["png-to-webp", "compress-webp"],
    "png-to-webp": ["png-to-jpg", "jpg-to-webp"],
    ...extendedRelatedMap,
    ...transformRelatedMap,
    ...batch3RelatedMap,
  };
  return withRelated(page, relatedMap[page.slug] ?? []);
});

export const featuredSeoLandingSlugs = [
  "compress-to-50kb",
  "compress-to-100kb",
  "png-to-jpg",
  "jpg-to-png",
  "resize-passport-photo",
  "resize-for-instagram",
  ...extendedFeaturedSlugs,
  ...transformFeaturedSlugs,
  ...batch3FeaturedSlugs,
] as const;
