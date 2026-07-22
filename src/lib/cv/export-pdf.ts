import { PDFDocument, StandardFonts, rgb, type RGB } from "pdf-lib";
import type { CvData, CvTemplateId } from "@/types/cv";
import { CV_TEMPLATE_THEMES } from "@/lib/cv/templates";
import { getCvSections, dateLine, educationLine, roleLine } from "@/lib/cv/cv-sections";

const PAGE = { width: 595.28, height: 841.89 };

function hexRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  return rgb(
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  );
}

function wrapText(
  text: string,
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>,
  size: number,
  maxWidth: number,
): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const lines: string[] = [];
  let line = words[0] ?? "";

  for (let i = 1; i < words.length; i += 1) {
    const next = `${line} ${words[i]}`;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      line = next;
    } else {
      lines.push(line);
      line = words[i] ?? "";
    }
  }
  if (line) lines.push(line);
  return lines;
}

type PdfCtx = {
  doc: PDFDocument;
  page: ReturnType<PDFDocument["addPage"]>;
  y: number;
  margin: number;
  contentWidth: number;
  contentX: number;
  regular: Awaited<ReturnType<PDFDocument["embedFont"]>>;
  bold: Awaited<ReturnType<PDFDocument["embedFont"]>>;
  ink: RGB;
  muted: RGB;
  accent: RGB;
  onNewPage?: () => void;
};

function createCtx(
  doc: PDFDocument,
  fonts: { regular: PdfCtx["regular"]; bold: PdfCtx["bold"] },
  colors: { ink: RGB; muted: RGB; accent: RGB },
  layout: { margin: number; contentX: number; contentWidth: number },
  page: PdfCtx["page"],
): PdfCtx {
  return {
    doc,
    page,
    y: PAGE.height - layout.margin,
    margin: layout.margin,
    contentWidth: layout.contentWidth,
    contentX: layout.contentX,
    regular: fonts.regular,
    bold: fonts.bold,
    ink: colors.ink,
    muted: colors.muted,
    accent: colors.accent,
  };
}

function ensureSpace(ctx: PdfCtx, needed: number) {
  if (ctx.y - needed >= ctx.margin) return;
  ctx.page = ctx.doc.addPage([PAGE.width, PAGE.height]);
  ctx.y = PAGE.height - ctx.margin;
  ctx.onNewPage?.();
}

function drawLines(
  ctx: PdfCtx,
  lines: string[],
  size: number,
  font: PdfCtx["regular"],
  color: RGB,
  lineHeight = size * 1.45,
) {
  for (const line of lines) {
    ensureSpace(ctx, lineHeight);
    ctx.page.drawText(line, {
      x: ctx.contentX,
      y: ctx.y - size,
      size,
      font,
      color,
    });
    ctx.y -= lineHeight;
  }
}

function drawHeading(ctx: PdfCtx, label: string, centered = false) {
  ensureSpace(ctx, 28);
  ctx.y -= 8;
  const size = 10;
  const text = label.toUpperCase();
  let x = ctx.contentX;
  if (centered) {
    const w = ctx.bold.widthOfTextAtSize(text, size);
    x = ctx.contentX + (ctx.contentWidth - w) / 2;
  }
  ctx.page.drawText(text, {
    x,
    y: ctx.y - size,
    size,
    font: ctx.bold,
    color: ctx.accent,
  });
  ctx.y -= 18;
  ctx.page.drawLine({
    start: { x: ctx.contentX, y: ctx.y },
    end: { x: ctx.contentX + ctx.contentWidth, y: ctx.y },
    thickness: 0.75,
    color: rgb(0.82, 0.86, 0.86),
  });
  ctx.y -= 14;
}

function drawBody(ctx: PdfCtx, data: CvData) {
  const { contact, experience, education } = getCvSections(data);

  if (data.summary.trim()) {
    drawHeading(ctx, "Summary", ctx.contentX === ctx.margin && ctx.contentWidth < PAGE.width * 0.7);
    drawLines(
      ctx,
      wrapText(data.summary, ctx.regular, 10, ctx.contentWidth),
      10,
      ctx.regular,
      ctx.ink,
    );
    ctx.y -= 4;
  }

  if (data.skills.length > 0 && ctx.contentX > PAGE.width * 0.2) {
    drawHeading(ctx, "Skills");
    drawLines(
      ctx,
      wrapText(data.skills.join(" · "), ctx.regular, 10, ctx.contentWidth),
      10,
      ctx.regular,
      ctx.ink,
    );
    ctx.y -= 4;
  }

  if (experience.length > 0) {
    drawHeading(ctx, "Experience");
    for (const item of experience) {
      const header = roleLine(item);
      const dates = dateLine(item);
      ensureSpace(ctx, 16);
      ctx.page.drawText(header, {
        x: ctx.contentX,
        y: ctx.y - 11,
        size: 11,
        font: ctx.bold,
        color: ctx.ink,
      });
      ctx.y -= 14;
      if (dates) drawLines(ctx, [dates], 9, ctx.regular, ctx.muted, 12);
      for (const bullet of item.bullets.filter((b) => b.trim())) {
        drawLines(
          ctx,
          wrapText(`• ${bullet.trim()}`, ctx.regular, 10, ctx.contentWidth - 8),
          10,
          ctx.regular,
          ctx.ink,
        );
      }
      ctx.y -= 6;
    }
  }

  if (education.length > 0) {
    drawHeading(ctx, "Education");
    for (const item of education) {
      const line = educationLine(item);
      if (line) {
        ensureSpace(ctx, 14);
        ctx.page.drawText(line, {
          x: ctx.contentX,
          y: ctx.y - 11,
          size: 11,
          font: ctx.bold,
          color: ctx.ink,
        });
        ctx.y -= 14;
      }
      if (item.year.trim()) drawLines(ctx, [item.year.trim()], 9, ctx.regular, ctx.muted, 12);
      ctx.y -= 4;
    }
  }
}

async function exportClassicPdf(data: CvData): Promise<Blob> {
  const theme = CV_TEMPLATE_THEMES.classic;
  const doc = await PDFDocument.create();
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const margin = 48;
  const contentWidth = PAGE.width - margin * 2;

  let page = doc.addPage([PAGE.width, PAGE.height]);
  const ctx = createCtx(
    doc,
    { regular, bold },
    { ink: hexRgb(theme.ink), muted: hexRgb(theme.muted), accent: hexRgb(theme.accent) },
    { margin, contentX: margin, contentWidth },
    page,
  );

  if (data.fullName.trim()) {
    page.drawText(data.fullName.trim(), {
      x: margin,
      y: ctx.y - 22,
      size: 22,
      font: bold,
      color: hexRgb(theme.ink),
    });
    ctx.y -= 30;
  }
  if (data.title.trim()) {
    page.drawText(data.title.trim(), {
      x: margin,
      y: ctx.y - 12,
      size: 12,
      font: regular,
      color: hexRgb(theme.muted),
    });
    ctx.y -= 18;
  }

  const contact = getCvSections(data).contact.join("  ·  ");
  if (contact) {
    drawLines(ctx, wrapText(contact, regular, 9, contentWidth), 9, regular, hexRgb(theme.muted), 12);
    ctx.y -= 6;
  }

  drawBody(ctx, data);
  const bytes = await doc.save();
  return new Blob([Uint8Array.from(bytes)], { type: "application/pdf" });
}

async function exportModernPdf(data: CvData): Promise<Blob> {
  const theme = CV_TEMPLATE_THEMES.modern;
  const sidebarW = 190;
  const doc = await PDFDocument.create();
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const sidebarBg = hexRgb(theme.sidebarBg);
  const sidebarText = hexRgb(theme.sidebarText);
  const margin = 36;
  const contentX = sidebarW + margin;
  const contentWidth = PAGE.width - contentX - margin;

  const paintSidebar = (p: typeof page) => {
    p.drawRectangle({ x: 0, y: 0, width: sidebarW, height: PAGE.height, color: sidebarBg });
  };

  let page = doc.addPage([PAGE.width, PAGE.height]);
  paintSidebar(page);

  let sy = PAGE.height - margin;
  if (data.fullName.trim()) {
    for (const line of wrapText(data.fullName.trim(), bold, 14, sidebarW - 32)) {
      page.drawText(line, { x: 20, y: sy - 14, size: 14, font: bold, color: sidebarText });
      sy -= 18;
    }
  }
  if (data.title.trim()) {
    for (const line of wrapText(data.title.trim(), regular, 9, sidebarW - 32)) {
      page.drawText(line, { x: 20, y: sy - 9, size: 9, font: regular, color: rgb(0.75, 0.85, 0.95) });
      sy -= 12;
    }
  }

  sy -= 12;
  for (const item of getCvSections(data).contact) {
    for (const line of wrapText(item, regular, 8, sidebarW - 32)) {
      page.drawText(line, { x: 20, y: sy - 8, size: 8, font: regular, color: sidebarText });
      sy -= 10;
    }
  }

  if (data.skills.length > 0) {
    sy -= 10;
    page.drawText("SKILLS", { x: 20, y: sy - 9, size: 9, font: bold, color: rgb(0.75, 0.85, 0.95) });
    sy -= 14;
    for (const skill of data.skills) {
      page.drawText(`• ${skill}`, { x: 20, y: sy - 8, size: 8, font: regular, color: sidebarText });
      sy -= 11;
    }
  }

  const ctx = createCtx(
    doc,
    { regular, bold },
    { ink: hexRgb(theme.ink), muted: hexRgb(theme.muted), accent: hexRgb(theme.accent) },
    { margin, contentX, contentWidth },
    page,
  );
  ctx.y = PAGE.height - margin;
  ctx.onNewPage = () => paintSidebar(ctx.page);

  if (data.summary.trim()) {
    drawHeading(ctx, "Profile");
    drawLines(ctx, wrapText(data.summary, regular, 10, contentWidth), 10, regular, hexRgb(theme.ink));
    ctx.y -= 4;
  }

  const { experience, education } = getCvSections(data);
  if (experience.length > 0) {
    drawHeading(ctx, "Experience");
    for (const item of experience) {
      ensureSpace(ctx, 16);
      ctx.page.drawText(roleLine(item), {
        x: contentX,
        y: ctx.y - 11,
        size: 11,
        font: bold,
        color: hexRgb(theme.ink),
      });
      ctx.y -= 14;
      const dates = dateLine(item);
      if (dates) drawLines(ctx, [dates], 9, regular, hexRgb(theme.muted), 12);
      for (const bullet of item.bullets.filter((b) => b.trim())) {
        drawLines(
          ctx,
          wrapText(`• ${bullet.trim()}`, regular, 10, contentWidth - 8),
          10,
          regular,
          hexRgb(theme.ink),
        );
      }
      ctx.y -= 6;
    }
  }

  if (education.length > 0) {
    drawHeading(ctx, "Education");
    for (const item of education) {
      ensureSpace(ctx, 14);
      ctx.page.drawText(educationLine(item), {
        x: contentX,
        y: ctx.y - 11,
        size: 11,
        font: bold,
        color: hexRgb(theme.ink),
      });
      ctx.y -= 14;
      if (item.year.trim()) drawLines(ctx, [item.year.trim()], 9, regular, hexRgb(theme.muted), 12);
      ctx.y -= 4;
    }
  }

  const bytes = await doc.save();
  return new Blob([Uint8Array.from(bytes)], { type: "application/pdf" });
}

async function exportMinimalPdf(data: CvData): Promise<Blob> {
  const theme = CV_TEMPLATE_THEMES.minimal;
  const doc = await PDFDocument.create();
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const margin = 54;
  const contentWidth = PAGE.width - margin * 2;

  let page = doc.addPage([PAGE.width, PAGE.height]);
  const ctx = createCtx(
    doc,
    { regular, bold },
    { ink: hexRgb(theme.ink), muted: hexRgb(theme.muted), accent: hexRgb(theme.accent) },
    { margin, contentX: margin, contentWidth },
    page,
  );

  if (data.fullName.trim()) {
    const size = 24;
    const w = bold.widthOfTextAtSize(data.fullName.trim(), size);
    page.drawText(data.fullName.trim(), {
      x: (PAGE.width - w) / 2,
      y: ctx.y - size,
      size,
      font: bold,
      color: hexRgb(theme.ink),
    });
    ctx.y -= 32;
  }
  if (data.title.trim()) {
    const size = 11;
    const w = regular.widthOfTextAtSize(data.title.trim(), size);
    page.drawText(data.title.trim(), {
      x: (PAGE.width - w) / 2,
      y: ctx.y - size,
      size,
      font: regular,
      color: hexRgb(theme.muted),
    });
    ctx.y -= 18;
  }

  const contact = getCvSections(data).contact.join(" · ");
  if (contact) {
    const lines = wrapText(contact, regular, 9, contentWidth);
    for (const line of lines) {
      const w = regular.widthOfTextAtSize(line, 9);
      ensureSpace(ctx, 12);
      page.drawText(line, {
        x: (PAGE.width - w) / 2,
        y: ctx.y - 9,
        size: 9,
        font: regular,
        color: hexRgb(theme.muted),
      });
      ctx.y -= 12;
    }
    ctx.y -= 8;
  }

  drawBody(ctx, data);
  const bytes = await doc.save();
  return new Blob([Uint8Array.from(bytes)], { type: "application/pdf" });
}

export async function exportCvPdf(data: CvData, template: CvTemplateId = "classic"): Promise<Blob> {
  if (template === "modern") return exportModernPdf(data);
  if (template === "minimal") return exportMinimalPdf(data);
  return exportClassicPdf(data);
}

export function cvExportBasename(data: CvData): string {
  return data.fullName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") || "cv";
}
