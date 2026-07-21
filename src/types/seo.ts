export type FaqItem = {
  question: string;
  answer: string;
};

export type HowToStep = {
  name: string;
  text: string;
};

export type RelatedTool = {
  href: string;
  title: string;
  description: string;
};

export type ToolPageContent = {
  slug: string;
  category: "image";
  title: string;
  description: string;
  h1: string;
  intro: string;
  howTo: HowToStep[];
  faqs: FaqItem[];
  related: RelatedTool[];
  keywords?: string[];
};

export type CompressLandingPreset = {
  tool: "compress";
  mode: "quality" | "target";
  targetKb?: number;
  qualityPercent?: number;
  formatId?: "png" | "jpg" | "jpeg" | "webp" | "avif";
};

export type ResizeLandingPreset = {
  tool: "resize";
  width?: number;
  height?: number;
  fit?: "stretch" | "contain" | "cover";
  fill?: "white" | "black" | "blur" | "transparent";
  lockAspect?: boolean;
  /** Scale relative to uploaded image (e.g. 50 = half size) */
  percent?: number;
};

export type ConvertLandingPreset = {
  tool: "convert";
  exportFormatId: "png" | "jpg" | "jpeg" | "webp" | "avif";
  qualityPercent?: number;
};

export type CropLandingPreset = {
  tool: "crop";
  aspect?: "free" | "1:1" | "4:3" | "3:4" | "16:9" | "9:16" | "3:2" | "2:3";
  shape?: "rect" | "circle";
  focusX?: number;
  focusY?: number;
};

export type RotateLandingPreset = {
  tool: "rotate";
  angle?: number;
  fill?: "white" | "black" | "transparent";
  qualityPercent?: number;
};

export type FlipLandingPreset = {
  tool: "flip";
  axis?: "horizontal" | "vertical";
  qualityPercent?: number;
};

export type SeoLandingPreset =
  | CompressLandingPreset
  | ResizeLandingPreset
  | ConvertLandingPreset
  | CropLandingPreset
  | RotateLandingPreset
  | FlipLandingPreset;

export type SeoLandingPage = ToolPageContent & {
  preset: SeoLandingPreset;
  parentHref: string;
};
