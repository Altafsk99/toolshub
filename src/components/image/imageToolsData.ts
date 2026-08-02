import {
  AdjustIcon,
  BlurIcon,
  CompressIcon,
  ConvertIcon,
  CropIcon,
  FlipIcon,
  HistoryIcon,
  MetadataIcon,
  ResizeIcon,
  RotateIcon,
  ScanIcon,
  WatermarkIcon,
} from "@/components/image/ImageToolIcons";

export type ImageToolItem = {
  href: string;
  title: string;
  subtitle: string;
  description: string;
  icon: typeof CompressIcon;
  tint: string;
  tag?: string;
  wide?: boolean;
};

export const imageTools: ImageToolItem[] = [
  {
    href: "/tools/image/compress",
    title: "Compress",
    subtitle: "Compress Image",
    description:
      "Free photo compressor — shrink JPG, PNG, and WebP with quality or target KB.",
    tag: "Popular",
    icon: CompressIcon,
    tint: "from-accent/12 to-accent-bright/5",
  },
  {
    href: "/tools/image/scan",
    title: "Scan",
    subtitle: "Scan Document",
    description: "Camera or photo → straighten, enhance, multi-page PDF — no upload.",
    icon: ScanIcon,
    tint: "from-[#9bb6ff]/16 to-accent/5",
  },
  {
    href: "/tools/image/resize",
    title: "Resize",
    subtitle: "Resize Image",
    description:
      "Free image resizer — set dimensions, fit modes, presets, optional compress.",
    icon: ResizeIcon,
    tint: "from-[#5ec8ff]/14 to-accent/5",
  },
  {
    href: "/tools/image/convert",
    title: "Convert",
    subtitle: "Convert Image",
    description: "Switch between PNG, JPG, WebP, and AVIF without uploading.",
    icon: ConvertIcon,
    tint: "from-accent-deep/10 to-mist/80",
  },
  {
    href: "/tools/image/crop",
    title: "Crop",
    subtitle: "Crop Image",
    description: "Square, circle, and social aspect ratio crops with live preview.",
    icon: CropIcon,
    tint: "from-[#7ec8a4]/14 to-accent/5",
  },
  {
    href: "/tools/image/rotate",
    title: "Rotate",
    subtitle: "Rotate Image",
    description: "Turn photos 90°, 180°, or any custom angle without uploading.",
    icon: RotateIcon,
    tint: "from-[#c8a87e]/14 to-accent/5",
  },
  {
    href: "/tools/image/flip",
    title: "Flip",
    subtitle: "Flip Image",
    description: "Mirror images horizontally or vertically in your browser.",
    icon: FlipIcon,
    tint: "from-[#a8c87e]/14 to-accent/5",
  },
  {
    href: "/tools/image/adjust",
    title: "Adjust",
    subtitle: "Adjust Image",
    description: "Brightness, contrast, and saturation — live preview, no upload.",
    tag: "New",
    icon: AdjustIcon,
    tint: "from-[#c87e9a]/14 to-accent/5",
  },
  {
    href: "/tools/image/blur",
    title: "Blur",
    subtitle: "Blur / Sharpen",
    description: "Soften backgrounds or sharpen detail entirely in your browser.",
    tag: "New",
    icon: BlurIcon,
    tint: "from-[#7e9ac8]/14 to-accent/5",
  },
  {
    href: "/tools/image/watermark",
    title: "Watermark",
    subtitle: "Watermark Image",
    description: "Add a text watermark with position, size, and opacity controls.",
    tag: "New",
    icon: WatermarkIcon,
    tint: "from-[#c8c07e]/14 to-accent/5",
  },
  {
    href: "/tools/image/metadata",
    title: "Metadata",
    subtitle: "Remove Metadata",
    description: "Strip EXIF, GPS, and camera tags before you share a photo.",
    tag: "New",
    icon: MetadataIcon,
    tint: "from-[#7ec8c0]/14 to-accent/5",
  },
  {
    href: "/tools/image/history",
    title: "History",
    subtitle: "On-device history",
    description: "Re-download recent outputs saved locally in your browser.",
    icon: HistoryIcon,
    tint: "from-ink/5 to-mist/60",
  },
];
