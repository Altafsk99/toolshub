import {
  ImagesToPdfIcon,
  MergeIcon,
  RotatePdfIcon,
  SplitIcon,
} from "@/components/pdf/PdfToolIcons";

export type PdfToolItem = {
  href: string;
  title: string;
  subtitle: string;
  description: string;
  icon: typeof MergeIcon;
  tint: string;
  tag?: string;
};

export const pdfTools: PdfToolItem[] = [
  {
    href: "/tools/pdf/merge",
    title: "Merge",
    subtitle: "Merge PDF",
    description: "Combine multiple PDF files into one document. Reorder before merging.",
    tag: "Popular",
    icon: MergeIcon,
    tint: "from-accent/12 to-accent-bright/5",
  },
  {
    href: "/tools/pdf/split",
    title: "Split",
    subtitle: "Split PDF",
    description: "Extract page ranges or split every page into separate PDFs (ZIP).",
    icon: SplitIcon,
    tint: "from-[#5ec8ff]/14 to-accent/5",
  },
  {
    href: "/tools/pdf/rotate",
    title: "Rotate",
    subtitle: "Rotate PDF",
    description: "Turn PDF pages 90°, 180°, or 270° — all pages or a selected range.",
    icon: RotatePdfIcon,
    tint: "from-[#c8a87e]/14 to-accent/5",
  },
  {
    href: "/tools/pdf/images-to-pdf",
    title: "Images to PDF",
    subtitle: "Images to PDF",
    description: "Convert JPG, PNG, and WebP images into a single PDF. Bulk upload supported.",
    icon: ImagesToPdfIcon,
    tint: "from-[#7ec8a4]/14 to-accent/5",
  },
];
