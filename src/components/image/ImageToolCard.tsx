import Link from "next/link";
import { ArrowIcon } from "@/components/image/ImageToolIcons";
import type { ImageToolItem } from "@/components/image/imageToolsData";

type ImageToolCardProps = {
  tool: ImageToolItem;
  compact?: boolean;
  wide?: boolean;
};

export function ImageToolCard({ tool, compact, wide }: ImageToolCardProps) {
  const Icon = tool.icon;

  return (
    <Link
      href={tool.href}
      className={`focus-ring group relative flex h-full overflow-hidden rounded-[var(--radius-lg)] border border-line bg-paper/75 p-5 shadow-[0_1px_0_color-mix(in_oklab,var(--ink)_6%,transparent)] transition duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:bg-paper hover:shadow-[var(--shadow-soft)] sm:p-6 ${
        wide ? "flex-col sm:flex-row sm:items-center sm:gap-8" : "flex-col"
      }`}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tool.tint} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      />

      <div className="relative flex items-start justify-between gap-4 sm:shrink-0">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-line/80 bg-foam text-accent-deep transition group-hover:border-accent/30 group-hover:bg-white">
          <Icon />
        </div>
        {tool.tag ? (
          <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-deep">
            {tool.tag}
          </span>
        ) : null}
      </div>

      <div className={`relative flex flex-1 flex-col ${wide ? "mt-5 sm:mt-0" : "mt-5"}`}>
        <p
          className={`font-display font-semibold text-ink transition group-hover:text-accent-deep ${
            compact ? "text-xl" : "text-2xl"
          }`}
        >
          {tool.title}
        </p>
        <p className="mt-1 text-sm font-medium text-ink-soft/55">{tool.subtitle}</p>
        <p
          className={`mt-3 flex-1 leading-relaxed text-ink-soft/75 ${
            compact ? "text-sm line-clamp-2" : "text-sm"
          }`}
        >
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
