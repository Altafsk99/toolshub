import {
  CompressIcon,
  ConvertIcon,
  HistoryIcon,
  ResizeIcon,
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
    description: "Shrink JPG, PNG, and WebP with quality or target KB presets.",
    tag: "Popular",
    icon: CompressIcon,
    tint: "from-accent/12 to-accent-bright/5",
  },
  {
    href: "/tools/image/resize",
    title: "Resize",
    subtitle: "Resize Image",
    description: "Set dimensions, fit modes, presets, and optional compression.",
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
    href: "/tools/image/history",
    title: "History",
    subtitle: "On-device history",
    description: "Re-download recent outputs saved locally in your browser.",
    icon: HistoryIcon,
    tint: "from-ink/5 to-mist/60",
  },
];
