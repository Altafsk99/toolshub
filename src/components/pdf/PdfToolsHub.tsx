"use client";

import { motion } from "framer-motion";
import { PdfToolCard } from "@/components/pdf/PdfToolCard";
import { pdfTools } from "@/components/pdf/pdfToolsData";
import { SeoPopularPdfLinks } from "@/components/seo/SeoPopularPdfLinks";

const ease = [0.22, 1, 0.36, 1] as const;

export function PdfToolsHub() {
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
            PDF Tools
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft/80">
            Merge, split, rotate, and convert images to PDF — all in your browser. No upload,
            no account.
          </p>
        </motion.header>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {pdfTools.map((tool, index) => (
            <motion.li
              key={tool.href}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 + index * 0.07, ease }}
            >
              <PdfToolCard tool={tool} />
            </motion.li>
          ))}
        </ul>

        <SeoPopularPdfLinks />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="mt-8 text-center text-xs text-ink-soft/55 sm:text-left"
        >
          Your PDFs never leave this device. Processing uses pdf-lib in the browser.
        </motion.p>
      </div>
    </div>
  );
}
