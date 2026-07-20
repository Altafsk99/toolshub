"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HomeImageToolsSection } from "@/components/image/HomeImageToolsSection";

const upcoming = ["PDF Tools", "Video Tools", "Audio Tools", "Developer Tools"];

export function HomePageClient() {
  return (
    <div className="relative overflow-hidden">
      <section className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col justify-center px-4 py-16 sm:px-6 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-3xl"
        >
          <p className="font-display text-5xl font-extrabold tracking-tight text-ink sm:text-7xl md:text-8xl">
            PrivyTool
          </p>
          <h1 className="mt-5 max-w-2xl text-xl font-medium leading-snug text-ink-soft sm:text-2xl">
            The fastest privacy-first online toolkit — starting with image tools that
            never leave your browser.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft/75">
            No upload. No account. Compress, resize, and convert on-device.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/tools/image/compress"
              className="focus-ring inline-flex h-12 items-center rounded-md bg-ink px-6 text-sm font-semibold text-foam transition hover:bg-ink-soft"
            >
              Compress an image
            </Link>
            <Link
              href="/tools/image"
              className="focus-ring inline-flex h-12 items-center rounded-md px-5 text-sm font-semibold text-accent-deep transition hover:bg-mist"
            >
              Browse image tools
            </Link>
          </div>
        </motion.div>

        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute right-[-10%] top-[18%] hidden h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_30%_30%,color-mix(in_oklab,var(--accent-bright)_45%,transparent),transparent_65%)] blur-2xl md:block"
        />
      </section>

      <HomeImageToolsSection />

      <section className="border-t border-line/80">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-3xl font-semibold text-ink">Coming categories</h2>
          <p className="mt-2 text-sm text-ink-soft/75">
            PrivyTool grows beyond images — one category at a time.
          </p>
          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-ink-soft/55">
            {upcoming.map((label) => (
              <li key={label}>{label}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
