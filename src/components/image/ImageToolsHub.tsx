"use client";

import { motion } from "framer-motion";
import { ImageToolCard } from "@/components/image/ImageToolCard";
import { imageTools } from "@/components/image/imageToolsData";
import { SeoPopularLinks } from "@/components/seo/SeoPopularLinks";

const ease = [0.22, 1, 0.36, 1] as const;

const hubTools = imageTools.map((tool) =>
  tool.href === "/tools/image/history" ? { ...tool, wide: true } : tool,
);

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
          {hubTools.map((tool, index) => (
            <motion.li
              key={tool.href}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 + index * 0.07, ease }}
              className={tool.wide ? "sm:col-span-2 lg:col-span-3" : undefined}
            >
              <ImageToolCard tool={tool} wide={tool.wide} />
            </motion.li>
          ))}
        </ul>

        <SeoPopularLinks />

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
