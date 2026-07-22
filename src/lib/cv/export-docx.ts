import {
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import type { CvData, CvTemplateId } from "@/types/cv";
import { CV_TEMPLATE_THEMES } from "@/lib/cv/templates";
import { getCvSections, dateLine, educationLine, roleLine } from "@/lib/cv/cv-sections";

function sectionHeading(label: string, color: string, centered = false): Paragraph {
  return new Paragraph({
    alignment: centered ? "center" : undefined,
    spacing: { before: 280, after: 120 },
    border: {
      bottom: {
        color: "D0D8D8",
        space: 4,
        style: BorderStyle.SINGLE,
        size: 6,
      },
    },
    children: [
      new TextRun({
        text: label.toUpperCase(),
        bold: true,
        size: 20,
        color,
      }),
    ],
  });
}

function bodyParagraph(text: string, centered = false): Paragraph {
  return new Paragraph({
    alignment: centered ? "center" : undefined,
    spacing: { after: 120 },
    children: [new TextRun({ text, size: 22 })],
  });
}

function mutedParagraph(text: string, centered = false): Paragraph {
  return new Paragraph({
    alignment: centered ? "center" : undefined,
    spacing: { after: 120 },
    children: [new TextRun({ text, size: 18, color: "555555" })],
  });
}

function roleHeader(role: string, company: string): Paragraph {
  const label = [role, company].filter(Boolean).join(" — ");
  return new Paragraph({
    spacing: { before: 160, after: 60 },
    children: [new TextRun({ text: label, bold: true, size: 22 })],
  });
}

function experienceBlock(data: CvData, accent: string): Paragraph[] {
  const { experience } = getCvSections(data);
  const blocks: Paragraph[] = [];
  if (experience.length === 0) return blocks;

  blocks.push(sectionHeading("Experience", accent));
  for (const item of experience) {
    blocks.push(roleHeader(item.role.trim(), item.company.trim()));
    const dates = dateLine(item);
    if (dates) blocks.push(mutedParagraph(dates));
    for (const bullet of item.bullets.filter((b) => b.trim())) {
      blocks.push(
        new Paragraph({
          spacing: { after: 60 },
          bullet: { level: 0 },
          children: [new TextRun({ text: bullet.trim(), size: 22 })],
        }),
      );
    }
  }
  return blocks;
}

function educationBlock(data: CvData, accent: string): Paragraph[] {
  const { education } = getCvSections(data);
  const blocks: Paragraph[] = [];
  if (education.length === 0) return blocks;

  blocks.push(sectionHeading("Education", accent));
  for (const item of education) {
    blocks.push(roleHeader(item.degree.trim(), item.school.trim()));
    if (item.year.trim()) blocks.push(mutedParagraph(item.year.trim()));
  }
  return blocks;
}

function buildClassicDocx(data: CvData): Document {
  const theme = CV_TEMPLATE_THEMES.classic;
  const accent = theme.accent.replace("#", "");
  const children: Paragraph[] = [];
  const { contact } = getCvSections(data);

  if (data.fullName.trim()) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.TITLE,
        spacing: { after: 80 },
        children: [new TextRun({ text: data.fullName.trim(), bold: true, size: 44 })],
      }),
    );
  }
  if (data.title.trim()) {
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({ text: data.title.trim(), size: 24, color: accent })],
      }),
    );
  }
  if (contact.length > 0) children.push(mutedParagraph(contact.join("  ·  ")));
  if (data.summary.trim()) {
    children.push(sectionHeading("Summary", accent));
    children.push(bodyParagraph(data.summary.trim()));
  }
  if (data.skills.length > 0) {
    children.push(sectionHeading("Skills", accent));
    children.push(bodyParagraph(data.skills.join(" · ")));
  }
  children.push(...experienceBlock(data, accent));
  children.push(...educationBlock(data, accent));

  return new Document({
    sections: [{ properties: { page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } } }, children }],
  });
}

function buildModernDocx(data: CvData): Document {
  const theme = CV_TEMPLATE_THEMES.modern;
  const accent = theme.accent.replace("#", "");
  const sidebarBg = theme.sidebarBg.replace("#", "");
  const sidebarText = theme.sidebarText.replace("#", "");
  const { contact, experience, education } = getCvSections(data);

  const sidebarChildren: Paragraph[] = [
    new Paragraph({
      children: [new TextRun({ text: data.fullName.trim() || "Your Name", bold: true, size: 32, color: sidebarText })],
    }),
  ];
  if (data.title.trim()) {
    sidebarChildren.push(
      new Paragraph({
        children: [new TextRun({ text: data.title.trim(), size: 20, color: "BFDBFE" })],
      }),
    );
  }
  for (const item of contact) {
    sidebarChildren.push(
      new Paragraph({ children: [new TextRun({ text: item, size: 18, color: sidebarText })] }),
    );
  }
  if (data.skills.length > 0) {
    sidebarChildren.push(
      new Paragraph({
        spacing: { before: 240 },
        children: [new TextRun({ text: "SKILLS", bold: true, size: 18, color: "BFDBFE" })],
      }),
    );
    for (const skill of data.skills) {
      sidebarChildren.push(
        new Paragraph({ children: [new TextRun({ text: `• ${skill}`, size: 18, color: sidebarText })] }),
      );
    }
  }

  const mainChildren: Paragraph[] = [];
  if (data.summary.trim()) {
    mainChildren.push(sectionHeading("Profile", accent));
    mainChildren.push(bodyParagraph(data.summary.trim()));
  }
  if (experience.length > 0) {
    mainChildren.push(sectionHeading("Experience", accent));
    for (const item of experience) {
      mainChildren.push(roleHeader(item.role.trim(), item.company.trim()));
      const dates = dateLine(item);
      if (dates) mainChildren.push(mutedParagraph(dates));
      for (const bullet of item.bullets.filter((b) => b.trim())) {
        mainChildren.push(
          new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: bullet.trim(), size: 22 })],
          }),
        );
      }
    }
  }
  if (education.length > 0) {
    mainChildren.push(sectionHeading("Education", accent));
    for (const item of education) {
      mainChildren.push(roleHeader(item.degree.trim(), item.school.trim()));
      if (item.year.trim()) mainChildren.push(mutedParagraph(item.year.trim()));
    }
  }

  return new Document({
    sections: [
      {
        children: [
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 32, type: WidthType.PERCENTAGE },
                    shading: { fill: sidebarBg },
                    margins: { top: 200, bottom: 200, left: 200, right: 200 },
                    children: sidebarChildren,
                  }),
                  new TableCell({
                    width: { size: 68, type: WidthType.PERCENTAGE },
                    margins: { top: 200, bottom: 200, left: 200, right: 200 },
                    children: mainChildren.length > 0 ? mainChildren : [bodyParagraph("")],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });
}

function buildMinimalDocx(data: CvData): Document {
  const theme = CV_TEMPLATE_THEMES.minimal;
  const accent = theme.accent.replace("#", "");
  const children: Paragraph[] = [];
  const { contact } = getCvSections(data);

  if (data.fullName.trim()) {
    children.push(
      new Paragraph({
        alignment: "center",
        spacing: { after: 80 },
        children: [new TextRun({ text: data.fullName.trim(), bold: true, size: 44 })],
      }),
    );
  }
  if (data.title.trim()) {
    children.push(
      new Paragraph({
        alignment: "center",
        spacing: { after: 120 },
        children: [new TextRun({ text: data.title.trim().toUpperCase(), size: 20, color: "64748B" })],
      }),
    );
  }
  if (contact.length > 0) children.push(mutedParagraph(contact.join(" · "), true));
  if (data.summary.trim()) {
    children.push(sectionHeading("Summary", accent, true));
    children.push(bodyParagraph(data.summary.trim(), true));
  }
  if (data.skills.length > 0) {
    children.push(sectionHeading("Skills", accent, true));
    children.push(bodyParagraph(data.skills.join(" · "), true));
  }
  children.push(...experienceBlock(data, accent));
  children.push(...educationBlock(data, accent));

  return new Document({
    sections: [{ properties: { page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } } }, children }],
  });
}

export async function exportCvDocx(data: CvData, template: CvTemplateId = "classic"): Promise<Blob> {
  const doc =
    template === "modern"
      ? buildModernDocx(data)
      : template === "minimal"
        ? buildMinimalDocx(data)
        : buildClassicDocx(data);
  return Packer.toBlob(doc);
}

export function cvExportBasename(data: CvData): string {
  return data.fullName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") || "cv";
}
