import { privacyFaqs } from "@/lib/seo/landing-helpers";
import type { SeoLandingPage } from "@/types/seo";

const rotateLandings: SeoLandingPage[] = [
  {
    slug: "rotate-image-90-degrees",
    category: "image",
    title: "Rotate Image 90 Degrees Online — Free, No Upload | PrivyTool",
    description:
      "Rotate an image 90 degrees clockwise in your browser. Free, private — no upload required.",
    h1: "Rotate Image 90 Degrees",
    intro:
      "Turn a photo a quarter turn clockwise. PrivyTool rotates locally — your image never leaves your device.",
    keywords: ["rotate image 90 degrees", "rotate photo 90 clockwise", "turn image 90 degrees"],
    preset: { tool: "rotate", angle: 90, fill: "white" },
    parentHref: "/tools/image/rotate",
    howTo: [
      { name: "Upload your image", text: "Drop a JPG, PNG, or WebP from your device." },
      { name: "90° clockwise", text: "Rotation is pre-set to 90 degrees right." },
      { name: "Download", text: "Preview updates live — download when it looks right." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "rotate-image-180-degrees",
    category: "image",
    title: "Rotate Image 180 Degrees Online — Free, No Upload | PrivyTool",
    description:
      "Flip an image upside down with a 180° rotation in your browser. Free and private on PrivyTool.",
    h1: "Rotate Image 180 Degrees",
    intro:
      "Turn a photo completely upside down. Processing runs on-device — nothing is uploaded.",
    keywords: ["rotate image 180 degrees", "upside down image rotate", "flip image 180"],
    preset: { tool: "rotate", angle: 180, fill: "white" },
    parentHref: "/tools/image/rotate",
    howTo: [
      { name: "Upload your image", text: "Select the photo you want to rotate." },
      { name: "180° applied", text: "Upside-down rotation is pre-set." },
      { name: "Download", text: "Save the rotated image locally." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "rotate-image-counter-clockwise",
    category: "image",
    title: "Rotate Image Counter-Clockwise — Free, No Upload | PrivyTool",
    description:
      "Rotate an image 90° counter-clockwise (left) in your browser. Free, private on PrivyTool.",
    h1: "Rotate Counter-Clockwise",
    intro:
      "Turn a photo 90° to the left. PrivyTool rotates in your browser — no server upload.",
    keywords: ["rotate image counter clockwise", "rotate left 90 degrees", "turn photo left"],
    preset: { tool: "rotate", angle: -90, fill: "white" },
    parentHref: "/tools/image/rotate",
    howTo: [
      { name: "Upload your image", text: "Drop a JPG, PNG, or WebP file." },
      { name: "90° left", text: "Counter-clockwise rotation is pre-applied." },
      { name: "Download", text: "Save when the preview looks correct." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "fix-sideways-photo",
    category: "image",
    title: "Fix Sideways Photo Online — Free, No Upload | PrivyTool",
    description:
      "Fix a sideways or upside-down photo in your browser. Rotate locally — free on PrivyTool.",
    h1: "Fix Sideways Photo",
    intro:
      "Phone photos often import sideways. Rotate 90° locally before sharing — nothing leaves your device.",
    keywords: ["fix sideways photo", "rotate sideways image", "correct photo orientation"],
    preset: { tool: "rotate", angle: 90, fill: "white" },
    parentHref: "/tools/image/rotate",
    howTo: [
      { name: "Upload sideways photo", text: "Select the mis-oriented image from your device." },
      { name: "Rotate 90°", text: "Start with 90° right — adjust angle if needed." },
      { name: "Download", text: "Save the correctly oriented photo." },
    ],
    faqs: privacyFaqs([
      {
        question: "Why is my photo sideways?",
        answer:
          "EXIF orientation metadata is sometimes stripped when sharing. Rotating fixes the visible orientation.",
      },
    ]),
    related: [],
  },
  {
    slug: "rotate-image-online",
    category: "image",
    title: "Rotate Image Online — Free, Private, No Upload | PrivyTool",
    description:
      "Rotate JPG, PNG, or WebP photos online in your browser. Free image rotator — no upload required.",
    h1: "Rotate Image Online",
    intro:
      "Turn photos any angle without uploading. PrivyTool processes locally for speed and privacy.",
    keywords: ["rotate image online", "rotate photo free", "online image rotator"],
    preset: { tool: "rotate", angle: 90, fill: "white" },
    parentHref: "/tools/image/rotate",
    howTo: [
      { name: "Add your image", text: "Upload from your device — it stays local." },
      { name: "Set angle", text: "Use quick presets or the custom angle slider." },
      { name: "Download", text: "Save the rotated result." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "rotate-jpg",
    category: "image",
    title: "Rotate JPG Online — Free, Private, No Upload | PrivyTool",
    description:
      "Rotate JPG and JPEG photos in your browser. Free, private — no upload required.",
    h1: "Rotate JPG",
    intro: "Fix orientation on JPEG photos locally. Export as JPG, PNG, or WebP.",
    keywords: ["rotate jpg", "rotate jpeg online", "turn jpg 90 degrees"],
    preset: { tool: "rotate", angle: 90, fill: "white", qualityPercent: 90 },
    parentHref: "/tools/image/rotate",
    howTo: [
      { name: "Upload JPG", text: "Drop your JPEG file from your device." },
      { name: "Rotate", text: "Pick an angle and background fill for empty corners." },
      { name: "Download JPG", text: "Save the rotated JPEG." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "rotate-png",
    category: "image",
    title: "Rotate PNG Online — Free, Private, No Upload | PrivyTool",
    description:
      "Rotate PNG images with transparency in your browser. Free, private on PrivyTool.",
    h1: "Rotate PNG",
    intro:
      "Rotate PNG graphics locally. Choose a transparent or solid background for empty corners.",
    keywords: ["rotate png", "rotate png with transparency", "turn png online"],
    preset: { tool: "rotate", angle: 90, fill: "transparent" },
    parentHref: "/tools/image/rotate",
    howTo: [
      { name: "Upload PNG", text: "Select a PNG from your device." },
      { name: "Rotate", text: "Transparent background is pre-selected for PNG export." },
      { name: "Download PNG", text: "Save the rotated PNG." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
];

const flipLandings: SeoLandingPage[] = [
  {
    slug: "flip-image-horizontally",
    category: "image",
    title: "Flip Image Horizontally — Free, No Upload | PrivyTool",
    description:
      "Mirror an image left-to-right in your browser. Free horizontal flip — no upload required.",
    h1: "Flip Image Horizontally",
    intro:
      "Create a horizontal mirror of your photo. All processing stays in your browser.",
    keywords: ["flip image horizontally", "mirror image horizontally", "flip photo left right"],
    preset: { tool: "flip", axis: "horizontal" },
    parentHref: "/tools/image/flip",
    howTo: [
      { name: "Upload your image", text: "Drop a JPG, PNG, or WebP file." },
      { name: "Horizontal flip", text: "Left-to-right mirror is pre-applied." },
      { name: "Download", text: "Save the flipped image." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "flip-image-vertically",
    category: "image",
    title: "Flip Image Vertically — Free, No Upload | PrivyTool",
    description:
      "Flip an image top-to-bottom in your browser. Free vertical flip on PrivyTool.",
    h1: "Flip Image Vertically",
    intro: "Mirror a photo upside down along the horizontal axis — processed locally.",
    keywords: ["flip image vertically", "flip photo upside down", "vertical mirror image"],
    preset: { tool: "flip", axis: "vertical" },
    parentHref: "/tools/image/flip",
    howTo: [
      { name: "Upload your image", text: "Select the photo to flip." },
      { name: "Vertical flip", text: "Top-to-bottom mirror is pre-applied." },
      { name: "Download", text: "Save the result locally." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "mirror-image-online",
    category: "image",
    title: "Mirror Image Online — Free, Private, No Upload | PrivyTool",
    description:
      "Mirror photos online in your browser. Horizontal or vertical flip — free on PrivyTool.",
    h1: "Mirror Image Online",
    intro:
      "Flip photos like a mirror without uploading. PrivyTool runs entirely in your browser.",
    keywords: ["mirror image online", "mirror photo free", "flip mirror image"],
    preset: { tool: "flip", axis: "horizontal" },
    parentHref: "/tools/image/flip",
    howTo: [
      { name: "Add your image", text: "Upload from your device." },
      { name: "Choose direction", text: "Horizontal or vertical mirror." },
      { name: "Download", text: "Preview updates live — download when ready." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "flip-selfie-photo",
    category: "image",
    title: "Flip Selfie Photo — Mirror Selfie Online | PrivyTool",
    description:
      "Flip a selfie to mirror mode in your browser. Free, private — no upload required.",
    h1: "Flip Selfie Photo",
    intro:
      "Front-camera selfies are mirrored by default. Flip horizontally to match how others see you.",
    keywords: ["flip selfie", "mirror selfie photo", "unmirror selfie online"],
    preset: { tool: "flip", axis: "horizontal" },
    parentHref: "/tools/image/flip",
    howTo: [
      { name: "Upload selfie", text: "Select your front-camera photo." },
      { name: "Horizontal flip", text: "Mirror mode is pre-applied." },
      { name: "Download", text: "Save the corrected selfie." },
    ],
    faqs: privacyFaqs([
      {
        question: "Why flip a selfie?",
        answer:
          "Phone previews show a mirrored view. Flipping can match the non-mirrored version others see.",
      },
    ]),
    related: [],
  },
  {
    slug: "flip-jpg",
    category: "image",
    title: "Flip JPG Online — Free, Private, No Upload | PrivyTool",
    description:
      "Flip JPG and JPEG photos horizontally or vertically in your browser. Free on PrivyTool.",
    h1: "Flip JPG",
    intro: "Mirror JPEG photos locally. Export in your preferred format.",
    keywords: ["flip jpg", "mirror jpeg online", "flip jpeg horizontally"],
    preset: { tool: "flip", axis: "horizontal", qualityPercent: 90 },
    parentHref: "/tools/image/flip",
    howTo: [
      { name: "Upload JPG", text: "Drop your JPEG from your device." },
      { name: "Flip", text: "Choose horizontal or vertical mirror." },
      { name: "Download", text: "Save the flipped JPG." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
  {
    slug: "flip-png",
    category: "image",
    title: "Flip PNG Online — Free, Private, No Upload | PrivyTool",
    description:
      "Flip PNG images with transparency in your browser. Free, private on PrivyTool.",
    h1: "Flip PNG",
    intro: "Mirror PNG graphics locally while preserving transparency.",
    keywords: ["flip png", "mirror png online", "flip png transparency"],
    preset: { tool: "flip", axis: "horizontal" },
    parentHref: "/tools/image/flip",
    howTo: [
      { name: "Upload PNG", text: "Select a PNG from your device." },
      { name: "Flip", text: "Horizontal or vertical mirror." },
      { name: "Download PNG", text: "Save the flipped PNG." },
    ],
    faqs: privacyFaqs(),
    related: [],
  },
];

/** Rotate + flip programmatic SEO pages */
export const transformSeoLandingPages: SeoLandingPage[] = [...rotateLandings, ...flipLandings];

export const transformRelatedMap: Record<string, string[]> = {
  "rotate-image-90-degrees": ["rotate-image-counter-clockwise", "fix-sideways-photo"],
  "rotate-image-180-degrees": ["rotate-image-90-degrees", "flip-image-vertically"],
  "rotate-image-counter-clockwise": ["rotate-image-90-degrees", "fix-sideways-photo"],
  "fix-sideways-photo": ["rotate-image-90-degrees", "rotate-image-online"],
  "rotate-image-online": ["rotate-jpg", "rotate-png"],
  "rotate-jpg": ["rotate-png", "compress-jpg"],
  "rotate-png": ["rotate-jpg", "png-to-jpg"],
  "flip-image-horizontally": ["flip-image-vertically", "mirror-image-online"],
  "flip-image-vertically": ["flip-image-horizontally", "rotate-image-180-degrees"],
  "mirror-image-online": ["flip-selfie-photo", "flip-image-horizontally"],
  "flip-selfie-photo": ["flip-image-horizontally", "mirror-image-online"],
  "flip-jpg": ["flip-png", "rotate-jpg"],
  "flip-png": ["flip-jpg", "png-to-jpg"],
};

export const transformFeaturedSlugs = [
  "rotate-image-90-degrees",
  "fix-sideways-photo",
  "flip-image-horizontally",
  "mirror-image-online",
] as const;
