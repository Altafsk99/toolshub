"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ImageToolCard } from "@/components/image/ImageToolCard";
import { imageTools } from "@/components/image/imageToolsData";

const ease = [0.22, 1, 0.36, 1] as const;

export function HomeImageToolsSection() {
  const motionProps = {
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
  };

  return (
    <section className="border-t border-line/80 bg-paper/50">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <motion.div
          {...motionProps}
          transition={{ duration: 0.45, ease }}
          className="flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
                Image Tools
              </h2>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1 text-xs font-medium text-ink-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-bright" aria-hidden />
                Live now
              </span>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft/75">
              Compress, resize, convert — all in your browser. More utilities ship every
              sprint.
            </p>
          </div>
          <Link
            href="/tools/image"
            className="focus-ring text-sm font-semibold text-accent-deep transition hover:text-accent"
          >
            View all tools →
          </Link>
        </motion.div>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {imageTools.map((tool, index) => (
            <motion.li
              key={tool.href}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.06, ease }}
              className="h-full"
            >
              <ImageToolCard tool={tool} compact />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
