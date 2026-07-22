import type { CvTemplateId } from "@/types/cv";

export type CvTemplateOption = {
  id: CvTemplateId;
  label: string;
  description: string;
};

export const CV_TEMPLATES: CvTemplateOption[] = [
  {
    id: "classic",
    label: "Classic",
    description: "Teal headings · single column",
  },
  {
    id: "modern",
    label: "Modern",
    description: "Sidebar accent · two column",
  },
  {
    id: "minimal",
    label: "Minimal",
    description: "Centered · ATS-friendly",
  },
];

export type CvTemplateTheme = {
  accent: string;
  accentDark: string;
  ink: string;
  muted: string;
  sidebarBg: string;
  sidebarText: string;
};

export const CV_TEMPLATE_THEMES: Record<CvTemplateId, CvTemplateTheme> = {
  classic: {
    accent: "#146B66",
    accentDark: "#0F524E",
    ink: "#1E293B",
    muted: "#64748B",
    sidebarBg: "#146B66",
    sidebarText: "#FFFFFF",
  },
  modern: {
    accent: "#1E3A5F",
    accentDark: "#152A45",
    ink: "#0F172A",
    muted: "#475569",
    sidebarBg: "#1E3A5F",
    sidebarText: "#F8FAFC",
  },
  minimal: {
    accent: "#334155",
    accentDark: "#1E293B",
    ink: "#0F172A",
    muted: "#64748B",
    sidebarBg: "#334155",
    sidebarText: "#F8FAFC",
  },
};
