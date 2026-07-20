"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const tools = [
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
    wide: true,
  },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

export function ImageToolsHub() {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-8 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_30%_30%,color-mix(in_oklab,var(--accent-bright)_35%,transparent),transparent_70%)] blur-2xl"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="max-w-2xl"
        >
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-deep">
              Category
            </p>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper/80 px-3 py-1 text-xs font-medium text-ink-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-bright" aria-hidden />
              100% on-device
            </span>
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold text-ink sm:text-5xl">
            Image Tools
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft/80">
            Every tool runs in your browser. No upload, no account — pick a utility and
            start with a file from your device.
          </p>
        </motion.header>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool, index) => (
            <motion.li
              key={tool.href}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 + index * 0.07, ease }}
              className={"wide" in tool && tool.wide ? "sm:col-span-2 lg:col-span-3" : undefined}
            >
              <Link
                href={tool.href}
                className={`focus-ring group relative flex h-full overflow-hidden rounded-[var(--radius-lg)] border border-line bg-paper/75 p-5 shadow-[0_1px_0_color-mix(in_oklab,var(--ink)_6%,transparent)] transition duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:bg-paper hover:shadow-[var(--shadow-soft)] sm:p-6 ${
                  "wide" in tool && tool.wide
                    ? "flex-col sm:flex-row sm:items-center sm:gap-8"
                    : "flex-col"
                }`}
              >
                <div
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tool.tint} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />

                <div className="relative flex items-start justify-between gap-4 sm:shrink-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-line/80 bg-foam text-accent-deep transition group-hover:border-accent/30 group-hover:bg-white">
                    <tool.icon />
                  </div>
                  {"tag" in tool && tool.tag ? (
                    <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-deep">
                      {tool.tag}
                    </span>
                  ) : null}
                </div>

                <div
                  className={`relative flex flex-1 flex-col ${"wide" in tool && tool.wide ? "mt-5 sm:mt-0" : "mt-5"}`}
                >
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
            </motion.li>
          ))}
        </ul>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="mt-8 text-center text-xs text-ink-soft/55 sm:text-left"
        >
          Crop and batch tools are on the roadmap. Your files never leave this device.
        </motion.p>
      </div>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
      aria-hidden
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CompressIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
      <path
        d="M8 9V7a2 2 0 0 1 2-2h4M16 15v2a2 2 0 0 1-2 2h-4M7 9H5M19 15h-2M9 7 7 5M15 17l2 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ResizeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
      <path
        d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3M9 9h6v6H9z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ConvertIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
      <path
        d="M7 7h10l-2-2M17 17H7l2 2M15 7 17 5M9 17 7 19"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
      <path
        d="M12 8v4l3 2M21 12a9 9 0 1 1-2.64-6.36"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
