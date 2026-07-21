import Link from "next/link";
import { ArrowIcon } from "@/components/pdf/PdfToolIcons";
import type { PdfToolItem } from "@/components/pdf/pdfToolsData";

type PdfToolCardProps = {
  tool: PdfToolItem;
};

export function PdfToolCard({ tool }: PdfToolCardProps) {
  const Icon = tool.icon;

  return (
    <Link
      href={tool.href}
      className="focus-ring group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-line bg-paper/75 p-5 shadow-[0_1px_0_color-mix(in_oklab,var(--ink)_6%,transparent)] transition duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:bg-paper hover:shadow-[var(--shadow-soft)] sm:p-6"
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tool.tint} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-line/80 bg-foam text-accent-deep transition group-hover:border-accent/30 group-hover:bg-white">
          <Icon />
        </div>
        {tool.tag ? (
          <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-deep">
            {tool.tag}
          </span>
        ) : null}
      </div>

      <div className="relative mt-5 flex flex-1 flex-col">
        <p className="font-display text-2xl font-semibold text-ink transition group-hover:text-accent-deep">
          {tool.title}
        </p>
        <p className="mt-1 text-sm font-medium text-ink-soft/55">{tool.subtitle}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft/75">
          {tool.description}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent-deep">
          Open tool
          <ArrowIcon />
        </span>
      </div>
    </Link>
  );
}
