import { privacyFaqs } from "@/lib/seo/landing-helpers";
import type { SeoLandingPage } from "@/types/seo";

const extraCropLandings: SeoLandingPage[] = [
  {
    slug: "crop-passport-photo",
    category: "image",
    title: "Crop Passport Photo Online — Free, No Upload | PrivyTool",
    description:
      "Crop photos to passport size (3:4 portrait) in your browser. Free, private on PrivyTool.",
    h1: "Crop Passport Photo",
    intro:
      "Trim head-and-shoulders photos to standard passport proportions locally — nothing is uploaded.",
    keywords: ["crop passport photo", "passport photo crop online", "3x4 photo crop"],
    preset: { tool: "crop", aspect: "3:4", shape: "rect", focusX: 0.5, focusY: 0.35 },
    parentHref: "/tools/image/crop",
    howTo: [
      { name: "Upload portrait", text: "Use a clear head-and-shoulders photo." },
      { name: "3:4 crop", text: "Passport portrait ratio is pre-applied." },
      { name: "Download", text: "Save and pair with resize for exact pixel dimensions." },
    ],
    faqs: privacyFaqs([
      {
        question: "Is this the final passport size?",
        answer:
          "This crops to 3:4 ratio. Use Resize for exact dimensions like 413×531 px for submission.",
      },
    ]),
    related: [],
  },
  {
    slug: "crop-youtube-thumbnail",
    category: "image",
    title: "Crop for YouTube Thumbnail — 16:9 | PrivyTool",
    description:
      "Crop images to 16:9 for YouTube thumbnails in your browser. Free, private — no upload.",
    h1: "Crop YouTube Thumbnail",
    intro: "YouTube thumbnails use 16:9 widescreen. Crop locally before uploading to YouTube Studio.",
    keywords: ["crop youtube thumbnail", "16:9 thumbnail crop", "youtube thumbnail crop online"],
    preset: { tool: "crop", aspect: "16:9", shape: "rect" },
    parentHref: "/tools/image/crop",
    howTo: [
      { name: "Upload artwork", text: "Add your thumbnail design or photo." },
      { name: "16:9 crop", text: "Widescreen ratio is pre-applied." },
      { name: "Download", text: "Use with resize for 1280×720 if needed." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "crop-4-3",
    category: "image",
    title: "Crop Image to 4:3 — Free, No Upload | PrivyTool",
    description:
      "Crop photos to 4:3 landscape ratio in your browser. Free, private on PrivyTool.",
    h1: "Crop to 4:3",
    intro: "Classic 4:3 landscape ratio for slides, prints, and older displays.",
    keywords: ["crop 4:3", "4:3 aspect ratio crop", "landscape 4x3 crop"],
    preset: { tool: "crop", aspect: "4:3", shape: "rect" },
    parentHref: "/tools/image/crop",
    howTo: [
      { name: "Upload image", text: "Drop a photo from your device." },
      { name: "4:3 preset", text: "Landscape ratio is pre-applied." },
      { name: "Download", text: "Save the cropped image." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "crop-3-4-portrait",
    category: "image",
    title: "Crop Image to 3:4 Portrait — Free, No Upload | PrivyTool",
    description:
      "Crop photos to 3:4 portrait ratio in your browser. Free and private on PrivyTool.",
    h1: "Crop to 3:4 Portrait",
    intro: "Vertical 3:4 works for portraits, ID photos, and print sizes.",
    keywords: ["crop 3:4", "portrait crop 3x4", "vertical 3:4 crop"],
    preset: { tool: "crop", aspect: "3:4", shape: "rect" },
    parentHref: "/tools/image/crop",
    howTo: [
      { name: "Upload photo", text: "Choose a portrait-friendly image." },
      { name: "3:4 crop", text: "Portrait ratio is pre-set." },
      { name: "Download", text: "Save locally." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "crop-3-2-photo",
    category: "image",
    title: "Crop Image to 3:2 Photo Ratio — Free | PrivyTool",
    description:
      "Crop to 3:2 DSLR photo ratio in your browser. Free, private — no upload required.",
    h1: "Crop to 3:2 Photo",
    intro: "3:2 matches most camera sensors and standard photo prints.",
    keywords: ["crop 3:2", "3:2 photo crop", "dslr aspect ratio crop"],
    preset: { tool: "crop", aspect: "3:2", shape: "rect" },
    parentHref: "/tools/image/crop",
    howTo: [
      { name: "Upload image", text: "Add any photo from your device." },
      { name: "3:2 preset", text: "Standard photo ratio is pre-applied." },
      { name: "Download", text: "Save the crop." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
];

const extraCompressLandings: SeoLandingPage[] = [
  {
    slug: "compress-for-email",
    category: "image",
    title: "Compress Image for Email — Free, No Upload | PrivyTool",
    description:
      "Compress photos for email attachments in your browser. Smaller files, faster sends — private and free.",
    h1: "Compress Image for Email",
    intro:
      "Email providers often limit attachment size. Compress to ~200 KB locally before sending.",
    keywords: ["compress image for email", "reduce photo size email", "email attachment compressor"],
    preset: { tool: "compress", mode: "target", targetKb: 200, formatId: "jpg" },
    parentHref: "/tools/image/compress",
    howTo: [
      { name: "Upload photo", text: "Select the image you want to attach." },
      { name: "200 KB target", text: "A practical email size is pre-applied." },
      { name: "Attach to email", text: "Download and attach the smaller file." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "compress-for-website",
    category: "image",
    title: "Compress Image for Website — Free, No Upload | PrivyTool",
    description:
      "Optimize images for faster web pages in your browser. Free, private compressor on PrivyTool.",
    h1: "Compress for Website",
    intro:
      "Smaller images load faster. Compress locally for blogs, landing pages, and portfolios.",
    keywords: ["compress image for website", "optimize images web", "web image compressor"],
    preset: { tool: "compress", mode: "target", targetKb: 150, formatId: "webp" },
    parentHref: "/tools/image/compress",
    howTo: [
      { name: "Upload image", text: "Add a hero, banner, or inline photo." },
      { name: "150 KB WebP", text: "Web-friendly size and format are pre-set." },
      { name: "Download", text: "Upload the optimized file to your site." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "compress-avif",
    category: "image",
    title: "Compress to AVIF Online — Free, No Upload | PrivyTool",
    description:
      "Compress images to AVIF format in your browser. Next-gen compression — free on PrivyTool.",
    h1: "Compress to AVIF",
    intro:
      "AVIF often beats JPG and WebP on file size. Compress locally if your browser supports AVIF.",
    keywords: ["compress avif", "avif compressor online", "convert compress avif"],
    preset: { tool: "compress", mode: "quality", qualityPercent: 80, formatId: "avif" },
    parentHref: "/tools/image/compress",
    howTo: [
      { name: "Upload image", text: "Drop JPG, PNG, or WebP from your device." },
      { name: "AVIF output", text: "AVIF export with quality compression is pre-selected." },
      { name: "Download AVIF", text: "Save the smaller AVIF file." },
    ],
    faqs: privacyFaqs([
      {
        question: "Will AVIF work in all browsers?",
        answer: "AVIF is supported in modern browsers. If export fails, try WebP or JPG.",
      },
    ]),
    related: [],
  },
  {
    slug: "compress-to-1mb",
    category: "image",
    title: "Compress Image to 1MB Online — Free, No Upload | PrivyTool",
    description:
      "Compress images to 1 MB (1000 KB) in your browser. Free, private — no upload required.",
    h1: "Compress Image to 1MB",
    intro:
      "Many portals cap uploads at 1 MB. Hit the limit locally with PrivyTool — nothing is uploaded.",
    keywords: ["compress image to 1mb", "compress to 1000kb", "1mb image compressor"],
    preset: { tool: "compress", mode: "target", targetKb: 1000, formatId: "jpg" },
    parentHref: "/tools/image/compress",
    howTo: [
      { name: "Upload image", text: "Select a large photo from your device." },
      { name: "1 MB target", text: "Target size is set to 1000 KB." },
      { name: "Download", text: "Save the compressed file." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "compress-for-discord",
    category: "image",
    title: "Compress Image for Discord — Free, No Upload | PrivyTool",
    description:
      "Compress photos for Discord uploads in your browser. Free, private — no upload to PrivyTool.",
    h1: "Compress for Discord",
    intro:
      "Keep Discord uploads fast and under common size limits. Compress locally before sharing.",
    keywords: ["compress image for discord", "discord image size", "discord photo compressor"],
    preset: { tool: "compress", mode: "target", targetKb: 500, formatId: "jpg" },
    parentHref: "/tools/image/compress",
    howTo: [
      { name: "Upload photo", text: "Select the image for Discord." },
      { name: "500 KB target", text: "A practical Discord-friendly size is pre-applied." },
      { name: "Share on Discord", text: "Download and upload to your chat or server." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
];

const extraResizeLandings2: SeoLandingPage[] = [
  {
    slug: "resize-to-4k",
    category: "image",
    title: "Resize Image to 4K (3840×2160) — Free, No Upload | PrivyTool",
    description:
      "Resize images to 4K UHD 3840×2160 in your browser. Free, private resizer on PrivyTool.",
    h1: "Resize to 4K",
    intro: "Scale photos and graphics to Ultra HD 4K — processed entirely on-device.",
    keywords: ["resize image to 4k", "3840x2160 resize", "4k uhd image resizer"],
    preset: { tool: "resize", width: 3840, height: 2160, fit: "contain", fill: "black" },
    parentHref: "/tools/image/resize",
    howTo: [
      { name: "Upload image", text: "Add any JPG, PNG, or WebP." },
      { name: "3840 × 2160", text: "4K UHD dimensions are pre-set." },
      { name: "Download", text: "Save the 4K output." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "resize-for-amazon-product",
    category: "image",
    title: "Amazon Product Image Size — 2000×2000 | PrivyTool",
    description:
      "Resize product photos to 2000×2000 for Amazon listings in your browser. Free and private.",
    h1: "Amazon Product Image Size",
    intro:
      "Amazon recommends square high-res product images. Resize to 2000×2000 locally before upload.",
    keywords: ["amazon product image size", "2000x2000 product photo", "amazon listing image"],
    preset: { tool: "resize", width: 2000, height: 2000, fit: "cover" },
    parentHref: "/tools/image/resize",
    howTo: [
      { name: "Upload product photo", text: "Use a clear product image on white or lifestyle background." },
      { name: "2000 × 2000", text: "Square Amazon-friendly size is pre-applied." },
      { name: "Download", text: "Upload to Seller Central." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "resize-for-discord-emoji",
    category: "image",
    title: "Discord Emoji Size — 128×128 Resizer | PrivyTool",
    description:
      "Resize images to 128×128 for Discord emoji in your browser. Free, private on PrivyTool.",
    h1: "Discord Emoji Size",
    intro: "Custom Discord emojis work best at 128×128 pixels. Resize locally before uploading.",
    keywords: ["discord emoji size", "128x128 emoji resize", "discord custom emoji size"],
    preset: { tool: "resize", width: 128, height: 128, fit: "cover" },
    parentHref: "/tools/image/resize",
    howTo: [
      { name: "Upload image", text: "Choose a square-friendly graphic or photo." },
      { name: "128 × 128", text: "Discord emoji dimensions are pre-set." },
      { name: "Download", text: "Upload as a custom emoji in Discord." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "resize-for-ebay",
    category: "image",
    title: "eBay Listing Photo Size — 1600×1600 | PrivyTool",
    description:
      "Resize product photos to 1600×1600 for eBay listings in your browser. Free on PrivyTool.",
    h1: "eBay Listing Photo Size",
    intro: "Square 1600×1600 works well for eBay gallery images. Resize on-device before listing.",
    keywords: ["ebay image size", "1600x1600 ebay photo", "ebay listing image resize"],
    preset: { tool: "resize", width: 1600, height: 1600, fit: "cover" },
    parentHref: "/tools/image/resize",
    howTo: [
      { name: "Upload product photo", text: "Use a clear photo of your item." },
      { name: "1600 × 1600", text: "Square listing size is pre-applied." },
      { name: "Download", text: "Add to your eBay listing." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
];

const extraConvertLandings2: SeoLandingPage[] = [
  {
    slug: "webp-to-avif",
    category: "image",
    title: "WebP to AVIF Converter — Free, No Upload | PrivyTool",
    description:
      "Convert WebP to AVIF in your browser. Smaller next-gen files — free on PrivyTool.",
    h1: "WebP to AVIF",
    intro: "AVIF can shrink WebP further for modern browsers. Convert locally — no upload.",
    keywords: ["webp to avif", "convert webp to avif online"],
    preset: { tool: "convert", exportFormatId: "avif", qualityPercent: 80 },
    parentHref: "/tools/image/convert",
    howTo: [
      { name: "Upload WebP", text: "Drop your WebP file — it stays local." },
      { name: "AVIF output", text: "AVIF is pre-selected with quality compression." },
      { name: "Download AVIF", text: "Save the converted file." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "avif-to-webp",
    category: "image",
    title: "AVIF to WebP Converter — Free, No Upload | PrivyTool",
    description:
      "Convert AVIF to WebP in your browser. Broader browser support — free on PrivyTool.",
    h1: "AVIF to WebP",
    intro: "WebP has wider support than AVIF. Convert locally for compatibility.",
    keywords: ["avif to webp", "convert avif to webp online"],
    preset: { tool: "convert", exportFormatId: "webp", qualityPercent: 85 },
    parentHref: "/tools/image/convert",
    howTo: [
      { name: "Upload AVIF", text: "Select an AVIF from your device." },
      { name: "WebP output", text: "WebP is pre-selected." },
      { name: "Download WebP", text: "Save the converted file." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "jpeg-to-webp",
    category: "image",
    title: "JPEG to WebP Converter — Free, No Upload | PrivyTool",
    description:
      "Convert JPEG to WebP in your browser. Smaller files for the web — free on PrivyTool.",
    h1: "JPEG to WebP",
    intro: "WebP often beats JPEG on file size. Convert locally without uploading.",
    keywords: ["jpeg to webp", "convert jpeg to webp online", "jpg webp converter"],
    preset: { tool: "convert", exportFormatId: "webp", qualityPercent: 85 },
    parentHref: "/tools/image/convert",
    howTo: [
      { name: "Upload JPEG", text: "Drop your .jpeg or .jpg file." },
      { name: "WebP selected", text: "Output format is WebP with quality compression." },
      { name: "Download WebP", text: "Save the smaller WebP file." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
];

export const batch3SeoLandingPages: SeoLandingPage[] = [
  ...extraCropLandings,
  ...extraCompressLandings,
  ...extraResizeLandings2,
  ...extraConvertLandings2,
];

export const batch3RelatedMap: Record<string, string[]> = {
  "crop-passport-photo": ["resize-passport-photo", "crop-3-4-portrait"],
  "crop-youtube-thumbnail": ["resize-for-youtube-thumbnail", "crop-16-9"],
  "crop-4-3": ["crop-3-2-photo", "crop-16-9"],
  "crop-3-4-portrait": ["crop-passport-photo", "crop-9-16"],
  "crop-3-2-photo": ["crop-4-3", "crop-to-square"],
  "compress-for-email": ["compress-to-200kb", "compress-for-website"],
  "compress-for-website": ["compress-webp", "compress-to-150kb"],
  "compress-avif": ["jpg-to-avif", "png-to-avif"],
  "compress-to-1mb": ["compress-to-500kb", "compress-to-200kb"],
  "compress-for-discord": ["compress-to-500kb", "compress-for-email"],
  "resize-to-4k": ["resize-to-1080p", "compress-jpg"],
  "resize-for-amazon-product": ["resize-to-800x800", "compress-jpg"],
  "resize-for-discord-emoji": ["resize-to-800x800", "compress-to-50kb"],
  "resize-for-ebay": ["resize-for-amazon-product", "compress-jpg"],
  "webp-to-avif": ["avif-to-webp", "jpg-to-avif"],
  "avif-to-webp": ["webp-to-avif", "jpg-to-webp"],
  "jpeg-to-webp": ["jpg-to-webp", "compress-webp"],
};

export const batch3FeaturedSlugs = [
  "compress-for-website",
  "resize-for-amazon-product",
  "crop-passport-photo",
  "fix-sideways-photo",
] as const;
