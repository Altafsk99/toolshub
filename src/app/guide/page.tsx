import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildPageMetadata,
} from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "How to Use PrivyTool — Tools & Features Guide",
  description:
    "Step-by-step guide to PrivyTool features: compress, resize, convert, crop, rotate, flip, scan, PDF tools, export formats, and download history.",
  path: "/guide",
  keywords: [
    "how to use privytool",
    "image compress guide",
    "pdf tools guide",
    "privytool features",
    "resize image tutorial",
  ],
});

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        {title}
      </h2>
      <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink-soft/85">
        {children}
      </div>
    </section>
  );
}

function ToolHowTo({
  id,
  href,
  title,
  steps,
  features,
}: {
  id: string;
  href: string;
  title: string;
  steps: string[];
  features: string[];
}) {
  return (
    <section id={id} className="scroll-mt-28 rounded-[var(--radius-lg)] border border-line bg-paper/80 p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
        <Link
          href={href}
          className="text-sm font-semibold text-accent-deep underline-offset-2 hover:underline"
        >
          Open tool →
        </Link>
      </div>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink/45">
        How to use
      </p>
      <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-[15px] leading-relaxed text-ink-soft/85">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-ink/45">
        Features
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft/80">
        {features.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

const toc = [
  ["#basics", "Site basics"],
  ["#workflow", "Common workflow"],
  ["#export", "Export format"],
  ["#compress", "Compress image"],
  ["#resize", "Resize"],
  ["#convert", "Convert"],
  ["#crop", "Crop"],
  ["#rotate", "Rotate"],
  ["#flip", "Flip"],
  ["#scan", "Scan document"],
  ["#pdf-compress", "Compress PDF"],
  ["#pdf-merge", "Merge PDF"],
  ["#pdf-split", "Split PDF"],
  ["#pdf-rotate", "Rotate PDF"],
  ["#pdf-images", "Images to PDF"],
  ["#history", "History"],
];

export default function GuidePage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "How to use", path: "/guide" },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to use PrivyTool tools and features",
          description:
            "Step-by-step instructions for PrivyTool image and PDF tools.",
          url: absoluteUrl("/guide"),
        }}
      />

      <div className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--accent)_16%,transparent),transparent_70%)]"
        />

        <div className="relative mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/45">
            Help
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            How to use PrivyTool
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft/80 sm:text-lg">
            Step-by-step instructions for every tool and feature. All image and PDF
            processing runs in your browser — files are not uploaded to our servers.
          </p>

          <nav
            aria-label="Guide contents"
            className="mt-8 rounded-[var(--radius-lg)] border border-line bg-paper/80 p-4 sm:p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/45">
              Contents
            </p>
            <ol className="mt-3 grid gap-1.5 text-sm text-accent-deep sm:grid-cols-2">
              {toc.map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="underline-offset-2 hover:underline">
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-14 space-y-12">
            <Section id="basics" title="Site basics">
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong className="font-semibold text-ink">Home</strong> — overview
                  and links into Image Tools and PDF Tools.
                </li>
                <li>
                  <strong className="font-semibold text-ink">Image Tools</strong> (
                  <Link href="/tools/image" className="text-accent-deep underline-offset-2 hover:underline">
                    /tools/image
                  </Link>
                  ) — compress, resize, convert, crop, rotate, flip, scan.
                </li>
                <li>
                  <strong className="font-semibold text-ink">PDF Tools</strong> (
                  <Link href="/tools/pdf" className="text-accent-deep underline-offset-2 hover:underline">
                    /tools/pdf
                  </Link>
                  ) — compress, merge, split, rotate, images to PDF.
                </li>
                <li>
                  <strong className="font-semibold text-ink">History</strong> — recent
                  downloads saved only in this browser (see below).
                </li>
                <li>
                  <strong className="font-semibold text-ink">Blog</strong> — short
                  articles on common tasks (e.g. compress to 50 KB).
                </li>
                <li>
                  Top navigation works on mobile via the menu button.
                </li>
              </ul>
            </Section>

            <Section id="workflow" title="Common workflow (most tools)">
              <ol className="list-decimal space-y-2 pl-5">
                <li>Open a tool from the menu or hub page.</li>
                <li>
                  <strong className="font-semibold text-ink">Drop a file</strong> or
                  click to choose one (JPG, PNG, WebP, etc. for images; PDF for PDF
                  tools).
                </li>
                <li>
                  Change options on the right. Many tools show a{" "}
                  <strong className="font-semibold text-ink">live preview</strong>.
                </li>
                <li>
                  Click <strong className="font-semibold text-ink">Download</strong>{" "}
                  when you are happy with the result.
                </li>
                <li>
                  Click <strong className="font-semibold text-ink">Start over</strong>{" "}
                  to clear the file and begin again. Switching to another tool also
                  clears the current session.
                </li>
              </ol>
            </Section>

            <Section id="export" title="Export format">
              <p>
                Most image tools include an <strong className="font-semibold text-ink">Export
                format</strong> dropdown (PNG, JPG, JPEG, WebP, AVIF). Your choice is
                remembered in this browser and shared across tools.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong className="font-semibold text-ink">JPG / JPEG</strong> — smaller
                  photos; transparent areas become white.
                </li>
                <li>
                  <strong className="font-semibold text-ink">PNG</strong> — lossless;
                  keeps transparency when the format allows.
                </li>
                <li>
                  <strong className="font-semibold text-ink">WebP / AVIF</strong> — strong
                  compression; needs a modern browser (unsupported options are
                  disabled automatically).
                </li>
              </ul>
            </Section>

            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                Image tools — how to use
              </h2>

              <ToolHowTo
                id="compress"
                href="/tools/image/compress"
                title="Compress image"
                steps={[
                  "Open Compress and drop one image — or several images for batch mode.",
                  "Pick export format (JPG/WebP usually shrink best).",
                  "Quality mode: move the quality slider (lower = smaller file).",
                  "Target size mode: pick 20 / 50 / 100 / 200 KB or type a custom KB.",
                  "Single file: preview updates live → click Download.",
                  "Multiple files: click Compress all → Download ZIP (up to 20 images).",
                ]}
                features={[
                  "Live preview and size comparison (single file)",
                  "Quality slider and target KB presets",
                  "Batch compress → one ZIP download",
                  "Cap of 20 images per batch",
                  "Original vs compressed size shown before download",
                ]}
              />

              <ToolHowTo
                id="resize"
                href="/tools/image/resize"
                title="Resize image"
                steps={[
                  "Drop an image, then set Width and Height (pixels).",
                  "Leave Lock aspect ratio on to keep proportions, or unlock to set both freely.",
                  "Or use Scale % to shrink/enlarge by percentage.",
                  "Pick a preset if you need a common size (e.g. 1920×1080, passport).",
                  "Choose Fit: Fit (no crop), Crop to fill, or Stretch.",
                  "If Fit leaves empty edges, choose fill: White, Black, Blur, or Transparent.",
                  "Optional: enable Also compress and set quality or target KB.",
                  "Download when the preview looks right.",
                ]}
                features={[
                  "Custom width / height and scale %",
                  "Aspect lock",
                  "Presets including passport-style size",
                  "Fit / crop / stretch modes",
                  "Fill colors for letterboxing",
                  "Optional compress pass on the resized file",
                ]}
              />

              <ToolHowTo
                id="convert"
                href="/tools/image/convert"
                title="Convert format"
                steps={[
                  "Drop an image.",
                  "Choose the output format in Export format.",
                  "Adjust Quality if the format supports it (JPG, WebP, AVIF).",
                  "Preview the converted file size, then Download.",
                ]}
                features={[
                  "JPG, PNG, WebP, AVIF (as supported by your browser)",
                  "Quality control for lossy formats",
                  "Live size preview",
                ]}
              />

              <ToolHowTo
                id="crop"
                href="/tools/image/crop"
                title="Crop"
                steps={[
                  "Drop an image.",
                  "Pick a crop shape or aspect (free, square, circle, or presets).",
                  "Adjust the crop area / focus with the controls.",
                  "Choose export format, then Download.",
                ]}
                features={[
                  "Free / square / circle and aspect presets",
                  "Focus / position controls",
                  "Live preview of the cropped result",
                ]}
              />

              <ToolHowTo
                id="rotate"
                href="/tools/image/rotate"
                title="Rotate"
                steps={[
                  "Drop an image that is sideways or upside down.",
                  "Use 90° / 180° buttons or set a custom angle.",
                  "Check the live preview, then Download.",
                ]}
                features={["90° / 180° shortcuts", "Custom angle", "Live preview"]}
              />

              <ToolHowTo
                id="flip"
                href="/tools/image/flip"
                title="Flip"
                steps={[
                  "Drop an image.",
                  "Choose Horizontal and/or Vertical flip.",
                  "Preview, then Download.",
                ]}
                features={["Horizontal flip", "Vertical flip", "Live preview"]}
              />

              <ToolHowTo
                id="scan"
                href="/tools/image/scan"
                title="Scan document"
                steps={[
                  "Open Scan. Upload a photo of a page, or use the camera (phone or desktop).",
                  "Drag the four corners to match the page edges.",
                  "Pick a filter: Enhance, Color, Gray, or B&W.",
                  "Apply the scan to add the page to your document.",
                  "Repeat for more pages if needed.",
                  "Download the last page as an image, or Download PDF for all pages.",
                ]}
                features={[
                  "Upload or camera capture",
                  "Corner adjustment overlay",
                  "Enhance / color / grayscale / black-and-white filters",
                  "Multi-page document → one PDF",
                  "Download single page or full PDF",
                ]}
              />
            </div>

            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                PDF tools — how to use
              </h2>

              <ToolHowTo
                id="pdf-compress"
                href="/tools/pdf/compress"
                title="Compress PDF"
                steps={[
                  "Open Compress PDF and choose a PDF file.",
                  "Adjust compression strength if options are shown.",
                  "Compare original vs new size, then Download.",
                ]}
                features={[
                  "Runs in the browser",
                  "Live size comparison before download",
                ]}
              />

              <ToolHowTo
                id="pdf-merge"
                href="/tools/pdf/merge"
                title="Merge PDF"
                steps={[
                  "Add two or more PDF files.",
                  "Reorder them if needed.",
                  "Merge, then Download the combined PDF.",
                ]}
                features={["Multiple files", "Reorder before merging"]}
              />

              <ToolHowTo
                id="pdf-split"
                href="/tools/pdf/split"
                title="Split PDF"
                steps={[
                  "Upload a PDF.",
                  "Choose page ranges or split every page.",
                  "Download the result (often as a ZIP of PDFs).",
                ]}
                features={["Page ranges", "Split every page", "ZIP download when multiple files"]}
              />

              <ToolHowTo
                id="pdf-rotate"
                href="/tools/pdf/rotate"
                title="Rotate PDF"
                steps={[
                  "Upload a PDF.",
                  "Choose 90°, 180°, or 270°.",
                  "Apply to all pages or a selected range, then Download.",
                ]}
                features={["90° / 180° / 270°", "All pages or a page range"]}
              />

              <ToolHowTo
                id="pdf-images"
                href="/tools/pdf/images-to-pdf"
                title="Images to PDF"
                steps={[
                  "Add one or more images.",
                  "Reorder if needed.",
                  "Create the PDF, then Download.",
                ]}
                features={["Multiple images → one PDF", "Reorder pages"]}
              />
            </div>

            <Section id="history" title="History">
              <p>
                Open{" "}
                <Link
                  href="/tools/image/history"
                  className="text-accent-deep underline-offset-2 hover:underline"
                >
                  History
                </Link>{" "}
                to see recent downloads from this browser.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  An entry is saved only when you click{" "}
                  <strong className="font-semibold text-ink">Download</strong> (not on
                  every preview).
                </li>
                <li>Filter by tool (Compress, Resize, Convert, Crop, etc.).</li>
                <li>Preview original vs output, re-download, or delete entries.</li>
                <li>Stored on your device only (about 30 entries max). Clear all anytime.</li>
                <li>
                  On a shared computer, clear History or use a private window when you
                  finish.
                </li>
              </ul>
            </Section>

            <Section id="privacy-note" title="Privacy (short)">
              <p>
                Image and PDF tools process files locally in your browser. We do not
                upload your files to PrivyTool for these tools. See the{" "}
                <Link
                  href="/privacy"
                  className="text-accent-deep underline-offset-2 hover:underline"
                >
                  Privacy Policy
                </Link>{" "}
                for details.
              </p>
            </Section>
          </div>

          <div className="mt-14 flex flex-wrap gap-3">
            <Link
              href="/tools/image"
              className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] bg-accent px-5 text-sm font-semibold text-foam transition hover:bg-accent-deep"
            >
              Image Tools
            </Link>
            <Link
              href="/tools/pdf"
              className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] border border-line bg-paper px-5 text-sm font-semibold text-ink transition hover:border-accent/50"
            >
              PDF Tools
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
